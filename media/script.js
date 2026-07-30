/* ============================================================
   GHOSTTOOTH — Gathering Hidden Objects through Signal Tracking
   and Telemetry Observation of Operational Tracker Hardware
   (Bluetooth Surveillance & Tracker Detector)

   Uses Web Bluetooth requestLEScan (experimental) and
   requestDevice + watchAdvertisements (standard fallback)

   Detection technique inspired by:
   https://github.com/yjeanrenaud/yj_nearbyglasses
   Manufacturer IDs from Bluetooth SIG Assigned Numbers:
   https://www.bluetooth.com/specifications/assigned-numbers/
   Full company-identifier registry (media/company_identifiers.js), generated from:
   https://bitbucket.org/bluetooth-SIG/public/src/main/assigned_numbers/company_identifiers/company_identifiers.yaml
   For the long_company_identifiers.js file, source: https://gist.githubusercontent.com/ariccio/2882a435c79da28ba6035a14c5c65f22/raw/775e70cbc17b37fb1961b581b514f55296947338/BluetoothConstants.ts
   ============================================================ */

'use strict';

// ================================================================
// Known Manufacturer Company IDs (Bluetooth SIG Assigned Numbers)
// ================================================================

/**
 * Company IDs associated with covert surveillance hardware:
 * smart glasses, spy cameras, and wearable recording devices.
 */
const SURVEILLANCE_COMPANIES = {
    0x01AB: 'Meta Platforms, Inc. (Ray-Ban Meta / formerly Facebook)',
    0x058E: 'Meta Platforms Technologies, LLC',
    0x0D53: 'Luxottica Group S.p.A (manufactures Meta Ray-Ban glasses)',
    0x03C2: 'Snap Inc. (Snap Spectacles)',
    0x0171: 'Amazon.com Services, LLC (Echo Frames)',
    0x060C: 'Vuzix Corporation (smart glasses)',   // was 0x0057 (= Harman/JBL) - changed 2026-07-26
    0x02A6: 'Epson (Moverio smart glasses)',
};

/**
 * Company IDs that, on their own, identify a tracking tag — because these
 * companies make nothing else.
 */
const TRACKER_COMPANIES = {
    0x00D7: 'Tile, Inc.',
    0x0250: 'Chipolo (tracking tag)',
    0x0397: 'AIRTAG Solutions Ltd.',
    0x0B26: 'Pebblebee',
};

/**
 * Company IDs belonging to vendors that make trackers *and* ordinary consumer
 * electronics.
 *
 * A bare match here means nothing: 0x004C is broadcast by every iPhone, iPad,
 * Mac, Apple Watch and set of AirPods, and 0x0075 by every Galaxy device.
 * Classifying on the ID alone turned any public place into a wall of false
 * "TRACKER" badges. These are only escalated when the advertisement payload
 * itself proves it — see decodeAppleAdvert() and classifyAdvertisement().
 */
const AMBIGUOUS_TRACKER_COMPANIES = {
    0x004C: 'Apple, Inc.',
    0x0075: 'Samsung Electronics Co., Ltd.',
};

// ================================================================
// Device Name Patterns
// ================================================================

/** Regex patterns that match known surveillance device names. */
const SURVEILLANCE_NAME_PATTERNS = [
    /ray.?ban/i,
    /\bmeta\b.*glass/i,
    /spectacles/i,
    /echo.?frame/i,
    /\baria\b/i,              // Amazon Echo Frames "Aria"
    /\bvuzix\b/i,
    /moverio/i,
    /\bnreal\b/i,
    /\bxreal\b/i,
    /\brokid\b/i,
    /tcl.?nxt/i,
    /oppo.?air.?glass/i,
    /envision.?glass/i,
    /\bora\b.*glass/i,        // Ora-2 smart glasses
];

/** Regex patterns that match known tracker device names. */
const TRACKER_NAME_PATTERNS = [
    /air.?tag/i,
    /\btile\b/i,
    /smart.?tag/i,
    /\bchipolo\b/i,
    /orbit.?key/i,
    /nut.?find/i,
    /pebblebee/i,
    /find.?my/i,
    /\btrackr\b/i,
    /\blost.?found\b/i,
];

// ================================================================
// Service UUIDs
// ================================================================

/**
 * Service UUIDs that on their own identify a tracking tag.
 *
 * 0xFEAA is deliberately absent: Google's Find My Device Network shares the
 * Eddystone UUID with ordinary retail beacons, so a flat match flagged every
 * shop display and museum tag. It is decided by frame type in
 * decodeEddystone() instead.
 */
const TRACKER_SERVICE_UUIDS = new Set([
    '0000fd44-0000-1000-8000-00805f9b34fb', // Apple Find My (Offline Finding)
    '0000feed-0000-1000-8000-00805f9b34fb', // Tile
    '0000feec-0000-1000-8000-00805f9b34fb', // Tile
]);

/** 16-bit assigned numbers used by the payload decoders. */
const SERVICE_EDDYSTONE = 'feaa';       // Eddystone / Find My Device Network
const SERVICE_SAMSUNG_FIND = 'fd5a';    // Samsung Find / SmartTag

/** Evidence strength, mirrored from the Android app's Confidence enum. */
const CONFIDENCE = { POSSIBLE: 'possible', LIKELY: 'likely', CONFIRMED: 'confirmed' };

/** Rank used when deciding whether new evidence beats what we already had. */
const CONFIDENCE_RANK = { possible: 0, likely: 1, confirmed: 2 };

/** Plain-language explanation of what each confidence level actually means. */
const CONFIDENCE_EXPLANATION = {
    possible: 'one weak signal only — quite possibly innocent',
    likely: 'backed by the vendor or the service it advertises',
    confirmed: 'read directly out of the tracking protocol itself',
};

// ================================================================
// Company Identifier Registry
// ================================================================

/**
 * Full Bluetooth SIG company-identifier registry (numeric ID -> name),
 * loaded from company_identifiers.js (COMPANY_IDENTIFIERS), which is
 * generated from the SIG registry:
 * https://bitbucket.org/bluetooth-SIG/public/src/main/assigned_numbers/company_identifiers/company_identifiers.yaml
 */
const companyNames = typeof COMPANY_IDENTIFIERS !== 'undefined' ? COMPANY_IDENTIFIERS : new Map();

/** Best-known name for a company ID: full SIG registry, then curated lists. */
function companyName(companyId) {
    return companyNames.get(companyId)
        || SURVEILLANCE_COMPANIES[companyId]
        || TRACKER_COMPANIES[companyId]
        || AMBIGUOUS_TRACKER_COMPANIES[companyId]
        || 'Unknown';
}

/**
 * Human-readable name for an advertised service UUID, resolved against
 * SERVICE_UUID_NAMES (long_company_identifiers.js — GATT services plus
 * SIG member UUIDs for Google, Apple, Tile, Chipolo…), or null if unknown.
 */
function serviceUuidName(uuid) {
    return typeof SERVICE_UUID_NAMES !== 'undefined'
        ? (SERVICE_UUID_NAMES.get(String(uuid).toLowerCase()) ?? null)
        : null;
}

// ================================================================
// Application State
// ================================================================

/** Map of deviceId -> device data object. */
const devices = new Map();

/** Map of deviceId -> data object backing the currently rendered card (may be a bundle). */
const renderedData = new Map();

/** Timer handle for the throttled list re-render, or null. */
let renderTimer = null;

/** Minimum interval between list re-renders (ms). */
const RENDER_INTERVAL_MS = 300;

/** Timer handle for auto-hiding the alert banner, or null. */
let alertTimer = null;

/** Number of advertisement packets received during the current scan. */
let packetsReceived = 0;

/** Watchdog timer: warns the user if a scan produces no packets. */
let scanWatchdog = null;

/** Second-stage watchdog: escalates the message if silence persists. */
let scanWatchdogEscalate = null;

/** First-packet gentle nudge (ms) — keeps the user informed quickly. */
const WATCHDOG_FIRST_MS = 4000;

/** Escalated troubleshooting help if still no packets (ms). */
const WATCHDOG_DELAY_MS = 10000;

/** Currently active BluetoothLEScan (from requestLEScan), or null. */
let activeScan = null;

// ---- Scan lifecycle diagnostics & auto-restart (Web Bluetooth) ----

/** Epoch ms when the current scan session began, or 0 when idle. */
let scanStartedAt = 0;

/** Epoch ms of the most recent advertisement packet, or 0. */
let lastPacketAt = 0;

/** How many times the passive scan was auto-restarted this session. */
let scanRestarts = 0;

/** Human-readable label for the active scan transport (for diagnostics UI). */
let scanModeLabel = '\u2014';

/** Interval handle that keeps the passive scan alive / restarts stalled scans. */
let scanKeepalive = null;

/** Interval handle that refreshes the live diagnostics readout. */
let diagTimer = null;

/** True while a passive-scan auto-restart is in flight (avoids overlap). */
let restarting = false;

/** How often to check that the passive scan is still alive (ms). */
const SCAN_KEEPALIVE_MS = 4000;

/**
 * If no advertisement packet arrives for this long while a passive scan is
 * supposed to be active, assume Chromium tore the scan down and restart it.
 * Real BLE beacons advertise well under 2 s apart, so this only fires on stalls.
 */
const SCAN_QUIET_RESTART_MS = 7000;

/** Whether the Page Visibility handler has been attached (bind once). */
let visibilityBound = false;

/**
 * WebSocket URL for the local bridge.
 * Chrome 130+ blocks fetch() from https:// to loopback (Private Network Access),
 * but does not yet enforce that restriction for WebSocket connections.
 */
const BRIDGE_WS_URL = 'ws://127.0.0.1:8437';

/** HTTP fallback URL for the local bridge (used when WebSocket is unavailable). */
const BRIDGE_URL = 'http://127.0.0.1:8437';

/** Poll interval for the HTTP fallback (ms). */
const BRIDGE_POLL_MS = 2000;

/** Active WebSocket connection to the bridge, or null. */
let bridgeWs = null;

/** Timer handle for HTTP-fallback polling, or null when bridge mode is inactive. */
let bridgeTimer = null;

/** Set of device objects being watched via watchAdvertisements(). */
const watchedDevices = new Set();

/** Current filter: 'all' | 'surveillance' | 'tracker' | 'normal' */
let currentFilter = 'all';

/** Free-text filter (lowercased), matched against name / manufacturer / id. */
let textFilter = '';

/** Minimum RSSI filter in dBm, or null for no signal filtering. */
let rssiFilter = null;

/** Whether the device list is grouped by manufacturer. */
let groupByMfr = false;

/** Group keys currently collapsed in the grouped view. */
const collapsedGroups = new Set();

/** Sort mode: 'lastseen' | 'proximity' | 'severity' */
let sortMode = 'lastseen';

/** Hide devices not seen within this window (ms), or null to keep all. */
let staleThresholdMs = null;

/** Whether nameless devices with matching MFR + signal are bundled (MAC rotation). */
let bundleRotating = false;

/** Max gap between one alias disappearing and the next appearing (ms). */
const BUNDLE_GAP_MS = 30000;

/** Max RSSI difference between aliases to be considered the same device (dBm). */
const BUNDLE_RSSI_TOLERANCE = 8;

/** localStorage key for per-device notes. */
const NOTES_STORAGE_KEY = 'btscan-notes';

/** Map of deviceId -> user note text (persisted in localStorage). */
let deviceNotes = {};

// ================================================================
// Advertisement payload decoders
// ================================================================

/**
 * Reduce a 128-bit base UUID to its 16-bit assigned number.
 * Returns the input lower-cased when it is a vendor UUID.
 */
function shortUuid(uuid) {
    const u = String(uuid).toLowerCase();
    return (u.length === 36 && u.startsWith('0000') && u.endsWith('-0000-1000-8000-00805f9b34fb'))
        ? u.slice(4, 8)
        : u;
}

/** Read a DataView / ArrayBuffer / typed array as a plain byte array. */
function toBytes(value) {
    if (!value) return [];
    if (value instanceof DataView) {
        return Array.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
    }
    if (ArrayBuffer.isView(value)) return Array.from(new Uint8Array(value.buffer));
    if (value instanceof ArrayBuffer) return Array.from(new Uint8Array(value));
    return Array.from(value);
}

/**
 * Decode Apple's manufacturer payload.
 *
 * Apple packs `[type][length][value…]` records into its advertisement. The
 * distinction that matters is Find My *separated* (the accessory has lost
 * contact with its owner and is calling out to the crowd-sourced network)
 * versus everything else — AirPods pairing beacons, Handoff, Nearby, and so on,
 * which are just somebody's phone or headphones.
 *
 * @returns {'find_my_separated'|'find_my_near_owner'|'proximity_pairing'|'consumer'|'unknown'}
 */
function decodeAppleAdvert(payload) {
    const bytes = toBytes(payload);
    if (bytes.length === 0) return 'unknown';

    const RANK = { unknown: 0, consumer: 1, proximity_pairing: 2, find_my_near_owner: 3, find_my_separated: 4 };
    let best = 'unknown';
    const keep = (candidate) => { if (RANK[candidate] > RANK[best]) best = candidate; };

    for (let i = 0; i + 1 < bytes.length;) {
        const type = bytes[i];
        const declared = bytes[i + 1];
        const valueStart = i + 2;
        const truncated = declared === 0 || valueStart + declared > bytes.length;
        // Judge a truncated record on the bytes we actually received, never on
        // the declared length. A packet claiming a 25-byte Find My record while
        // carrying two bytes must not be reported as a *confirmed* separated
        // tracker — that would alarm someone on the strength of data we never saw.
        const len = truncated ? Math.max(0, bytes.length - valueStart) : declared;
        let verdict;
        switch (type) {
            case 0x12: // Find My / offline finding
                // 0x19 carries the full rotating public key, which an accessory
                // only sends once it is away from its owner.
                verdict = len >= 0x19 ? 'find_my_separated' : 'find_my_near_owner';
                break;
            case 0x07: verdict = 'proximity_pairing'; break;  // AirPods & friends
            case 0x02: // iBeacon
            case 0x05: // AirDrop
            case 0x09: // AirPlay
            case 0x0C: // Handoff
            case 0x0F: // Nearby Action
            case 0x10: // Nearby Info (iPhone / Mac presence)
                verdict = 'consumer'; break;
            default: verdict = 'unknown';
        }
        keep(verdict);
        if (truncated) break;
        i = valueStart + declared;
    }
    return best;
}

/**
 * Decode 0xFEAA service data.
 *
 * @returns {'fmdn'|'fmdn-separated'|'beacon'|'unknown'} `fmdn` is a Google Find
 *   My Device Network tag; `fmdn-separated` is one advertising in unwanted
 *   tracking protection mode (Google's spec maps this to the DULT "separated
 *   state" — the tag is away from its owner and has stopped rotating its
 *   address so detectors can find it); `beacon` is an ordinary Eddystone beacon
 *   such as a shop display.
 */
function decodeEddystone(payload) {
    const bytes = toBytes(payload);
    if (bytes.length === 0) return 'unknown';
    switch (bytes[0]) {
        case 0x40: return 'fmdn';
        case 0x41: return 'fmdn-separated';
        case 0x00: case 0x10: case 0x20: case 0x30: return 'beacon';
        default: return 'unknown';
    }
}

// ================================================================
// Classification
// ================================================================

/**
 * Classify a BLE advertisement event.
 *
 * Kept deliberately in step with `Classifier.kt` in the Android app: the same
 * priority order, the same verdict names and the same confidence levels, so the
 * two products never disagree about the same device.
 *
 * @param {BluetoothAdvertisingEvent | object} event
 * @returns {{ type: string, reason: string|null, confidence: string }}
 */
function classifyAdvertisement(event) {
    const name = (event.device?.name || '').trim();
    const uuids = event.uuids || [];
    const mfr = event.manufacturerData;
    const svcData = event.serviceData;

    const mfrGet = (companyId) => {
        if (!mfr) return undefined;
        return typeof mfr.get === 'function' ? mfr.get(companyId) : mfr[companyId];
    };
    const hasCompany = (companyId) => {
        if (!mfr) return false;
        return typeof mfr.has === 'function'
            ? mfr.has(companyId)
            : Object.prototype.hasOwnProperty.call(mfr, companyId);
    };

    // 1. Surveillance company IDs. These vendors' products record; there is no
    //    ambiguous consumer case to separate out.
    if (mfr && (mfr.size > 0 || Object.keys(mfr).length > 0)) {
        const ids = typeof mfr.keys === 'function' ? Array.from(mfr.keys()) : Object.keys(mfr).map(Number);
        for (const companyId of ids) {
            if (Object.prototype.hasOwnProperty.call(SURVEILLANCE_COMPANIES, companyId)) {
                const corroborated = name && SURVEILLANCE_NAME_PATTERNS.some(p => p.test(name));
                return {
                    type: 'surveillance',
                    reason: `Manufacturer ID ${formatCompanyId(companyId)}: ${SURVEILLANCE_COMPANIES[companyId]}`,
                    confidence: corroborated ? CONFIDENCE.CONFIRMED : CONFIDENCE.LIKELY,
                };
            }
        }
    }

    // 2. Decoded tracking protocols — the strongest evidence available.
    const appleVerdict = decodeAppleAdvert(mfrGet(0x004C));
    if (appleVerdict === 'find_my_separated') {
        return {
            type: 'tracker',
            reason: 'Apple Find My accessory broadcasting in separated state — it is away from its owner. Consistent with an AirTag.',
            confidence: CONFIDENCE.CONFIRMED,
        };
    }
    if (appleVerdict === 'find_my_near_owner') {
        return {
            type: 'tracker',
            reason: 'Apple Find My device near its owner — usually someone\u2019s iPhone or a tag with its owner present.',
            confidence: CONFIDENCE.POSSIBLE,
        };
    }

    if (svcData) {
        for (const [uuid, data] of (typeof svcData.entries === 'function' ? svcData.entries() : Object.entries(svcData))) {
            if (shortUuid(uuid) !== SERVICE_EDDYSTONE) continue;
            const frame = decodeEddystone(data);
            if (frame === 'fmdn-separated') {
                return {
                    type: 'tracker',
                    reason: 'Google Find My Device Network tag, away from its owner — it is broadcasting so it can be found.',
                    confidence: CONFIDENCE.CONFIRMED,
                };
            }
            if (frame === 'fmdn') {
                return {
                    type: 'tracker',
                    reason: 'Google Find My Device Network tag — broadcasting to be located by nearby Android phones.',
                    confidence: CONFIDENCE.CONFIRMED,
                };
            }
        }
    }

    if (uuids.some(u => shortUuid(u) === SERVICE_SAMSUNG_FIND)) {
        const isSamsung = hasCompany(0x0075);
        const namedTag = /smart.?tag/i.test(name);
        return {
            type: 'tracker',
            reason: `Samsung Find / SmartTag service${isSamsung ? ' from a Samsung device' : ''}`,
            confidence: namedTag ? CONFIDENCE.CONFIRMED : CONFIDENCE.LIKELY,
        };
    }

    // 3. Tracker-only vendors: the company ID alone is meaningful here.
    if (mfr) {
        const ids = typeof mfr.keys === 'function' ? Array.from(mfr.keys()) : Object.keys(mfr).map(Number);
        for (const companyId of ids) {
            if (Object.prototype.hasOwnProperty.call(TRACKER_COMPANIES, companyId)) {
                return {
                    type: 'tracker',
                    reason: `Manufacturer ID ${formatCompanyId(companyId)}: ${TRACKER_COMPANIES[companyId]}`,
                    confidence: CONFIDENCE.LIKELY,
                };
            }
        }
    }

    // 4. Curated known devices (media/known-devices.js), then name patterns.
    if (name) {
        if (typeof KNOWN_DEVICE_NAME_PATTERNS !== 'undefined') {
            for (const entry of KNOWN_DEVICE_NAME_PATTERNS) {
                if (entry.pattern.test(name)) {
                    return {
                        type: entry.type,
                        reason: entry.reason,
                        confidence: entry.confidence || CONFIDENCE.LIKELY,
                    };
                }
            }
        }
        for (const pattern of SURVEILLANCE_NAME_PATTERNS) {
            if (pattern.test(name)) {
                return {
                    type: 'surveillance',
                    reason: `Device name matches surveillance pattern: "${name}"`,
                    confidence: CONFIDENCE.LIKELY,
                };
            }
        }
        for (const pattern of TRACKER_NAME_PATTERNS) {
            if (pattern.test(name)) {
                return {
                    type: 'tracker',
                    reason: `Device name matches tracker pattern: "${name}"`,
                    // A name is freely settable and easily coincidental.
                    confidence: CONFIDENCE.POSSIBLE,
                };
            }
        }
    }

    // 5. Tracker service UUIDs.
    for (const uuid of uuids) {
        if (TRACKER_SERVICE_UUIDS.has(String(uuid).toLowerCase())) {
            return {
                type: 'tracker',
                reason: `Known tracker service UUID: ${uuid}`,
                confidence: CONFIDENCE.LIKELY,
            };
        }
    }

    return { type: 'normal', reason: null, confidence: CONFIDENCE.CONFIRMED };
}

/** Format a numeric company ID as a 0x-prefixed hex string. */
function formatCompanyId(id) {
    return `0x${id.toString(16).toUpperCase().padStart(4, '0')}`;
}

/**
 * Rough distance estimate from RSSI using the log-distance path-loss model.
 * If the advertisement carries a TX power, RSSI at 1 m is approximated as
 * txPower - 41 dB (free-space loss at 1 m, 2.4 GHz); otherwise -59 dBm
 * (typical BLE). Indoor path-loss exponent n = 2.5.
 * @returns {number|null} estimated distance in meters, or null.
 */
function estimateDistance(rssi, txPower) {
    if (rssi == null) return null;
    const rssiAt1m = txPower != null ? txPower - 41 : -59;
    return Math.pow(10, (rssiAt1m - rssi) / (10 * 2.5));
}

/** Human-friendly distance string. */
function formatDistance(meters) {
    if (meters >= 100) return '100+ m';
    if (meters >= 10) return `${Math.round(meters)} m`;
    return `${meters.toFixed(1)} m`;
}

// ================================================================
// Advertisement Event Handler
// ================================================================

/**
 * Handle a BluetoothAdvertisingEvent (from requestLEScan or watchAdvertisements).
 * Updates the device map and refreshes the UI.
 */
function handleAdvertisement(event) {
    packetsReceived++;
    lastPacketAt = Date.now();
    const deviceId = event.device.id;
    const classification = classifyAdvertisement(event);

    // Collect manufacturer data
    const manufacturers = [];
    if (event.manufacturerData && event.manufacturerData.size > 0) {
        for (const [companyId] of event.manufacturerData) {
            manufacturers.push({ id: formatCompanyId(companyId), name: companyName(companyId) });
        }
    }

    // Merge with existing data. A higher threat type always wins; at the same
    // threat type, stronger evidence wins — so a tag first seen beside its
    // owner and later seen separated is upgraded rather than ignored.
    const existing = devices.get(deviceId);
    const finalClassification = shouldReplaceClassification(existing?.classification, classification)
        ? classification
        : (existing?.classification ?? classification);

    const deviceData = {
        id: deviceId,
        name: event.device.name || existing?.name || null,
        rssi: event.rssi ?? existing?.rssi,
        txPower: event.txPower ?? existing?.txPower,
        classification: finalClassification,
        manufacturers: manufacturers.length > 0 ? manufacturers : (existing?.manufacturers ?? []),
        uuids: event.uuids?.length ? [...event.uuids] : (existing?.uuids ?? []),
        lastSeen: Date.now(),
        firstSeen: existing?.firstSeen ?? Date.now(),
    };

    const isNew = !devices.has(deviceId);
    devices.set(deviceId, deviceData);
    scheduleRender();

    // Alert only on evidence strong enough to be worth interrupting for.
    if (isNew
        && finalClassification.type === 'surveillance'
        && CONFIDENCE_RANK[finalClassification.confidence] >= CONFIDENCE_RANK.likely) {
        showAlertBanner(deviceData.name || 'Unknown Device');
    }
}

/** Queue a throttled re-render of the device list. */
function scheduleRender() {
    if (renderTimer !== null) return;
    renderTimer = setTimeout(() => {
        renderTimer = null;
        renderDeviceList();
        updateCounts();
    }, RENDER_INTERVAL_MS);
}

/**
 * Returns true if moving to newType is an upgrade over oldType.
 * Priority: surveillance > tracker > normal
 */
function shouldUpgrade(oldType, newType) {
    const rank = { surveillance: 2, tracker: 1, normal: 0 };
    return (rank[newType] ?? 0) > (rank[oldType] ?? 0);
}

/**
 * Returns true when a new classification should replace the stored one.
 * Mirrors `Classifier.shouldReplace` in the Android app.
 */
function shouldReplaceClassification(oldClassification, newClassification) {
    if (!oldClassification) return true;
    if (shouldUpgrade(oldClassification.type, newClassification.type)) return true;
    if (shouldUpgrade(newClassification.type, oldClassification.type)) return false;
    return (CONFIDENCE_RANK[newClassification.confidence] ?? 1)
        > (CONFIDENCE_RANK[oldClassification.confidence] ?? 1);
}

// ================================================================
// DOM — Device List Rendering
// ================================================================

function buildCard(data) {
    const card = document.createElement('div');
    card.className = `device-card device-${data.classification.type}`;
    card.dataset.deviceId = data.id;
    card.innerHTML = renderCardHTML(data);
    return card;
}

/** Severity ranking used by the severity sort and bundle classification. */
const SEVERITY_RANK = { surveillance: 2, tracker: 1, normal: 0 };

/** Comparator implementing the active sort mode. */
function deviceComparator(a, b) {
    if (sortMode === 'proximity') {
        return (b.rssi ?? -999) - (a.rssi ?? -999);
    }
    if (sortMode === 'severity') {
        const diff = (SEVERITY_RANK[b.classification.type] ?? 0) - (SEVERITY_RANK[a.classification.type] ?? 0);
        return diff !== 0 ? diff : (b.rssi ?? -999) - (a.rssi ?? -999);
    }
    if (sortMode === 'name') {
        // Named devices alphabetically first; unnamed after, strongest signal first
        if (a.name && b.name) return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        if (a.name) return -1;
        if (b.name) return 1;
        return (b.rssi ?? -999) - (a.rssi ?? -999);
    }
    return b.lastSeen - a.lastSeen; // 'lastseen' (default)
}

/**
 * Bundle likely MAC-rotation aliases: nameless devices sharing a manufacturer
 * ID, where one appears shortly after another disappears at a similar signal
 * level. Named devices and unmatched devices pass through untouched.
 * Purely derived at render time — no state is mutated.
 * @returns {Array<object>} devices and merged pseudo-devices
 */
function computeBundles() {
    const all = [...devices.values()];
    const passthrough = all.filter(d => d.name || d.manufacturers.length === 0);
    const candidates = all
        .filter(d => !d.name && d.manufacturers.length > 0)
        .sort((a, b) => a.firstSeen - b.firstSeen);

    const chains = [];
    for (const dev of candidates) {
        const chain = chains.find(c => {
            const tail = c[c.length - 1];
            return tail.manufacturers[0].id === dev.manufacturers[0].id
                && tail.lastSeen <= dev.firstSeen
                && dev.firstSeen - tail.lastSeen <= BUNDLE_GAP_MS
                && tail.rssi != null && dev.rssi != null
                && Math.abs(tail.rssi - dev.rssi) <= BUNDLE_RSSI_TOLERANCE;
        });
        if (chain) chain.push(dev);
        else chains.push([dev]);
    }

    const merged = chains.map(chain => {
        if (chain.length === 1) return chain[0];
        const latest = chain[chain.length - 1];
        let classification = latest.classification;
        for (const d of chain) {
            if (shouldUpgrade(classification.type, d.classification.type)) classification = d.classification;
        }
        return {
            ...latest,
            classification,
            firstSeen: chain[0].firstSeen,
            lastSeen: Math.max(...chain.map(d => d.lastSeen)),
            aliasIds: chain.map(d => d.id),
        };
    });

    return [...passthrough, ...merged];
}

/**
 * Group key for a device in the grouped view. Falls back, in order, to:
 * (1) the first manufacturer name, (2) a resolvable service-UUID vendor
 * name (e.g. Nest, Tile — via serviceUuidName()), (3) the literal
 * 'NO MANUFACTURER DATA' bucket only when neither is available. Without
 * this fallback, devices that only advertise a recognizable service UUID
 * (no manufacturer data) were all dumped into one giant generic bucket.
 */
function groupKeyFor(d) {
    if (d.manufacturers.length > 0) {
        return `${d.manufacturers[0].id} — ${d.manufacturers[0].name}`;
    }
    for (const uuid of d.uuids) {
        const vendor = serviceUuidName(uuid);
        if (vendor) return `SVC: ${vendor}`;
    }
    return 'NO MANUFACTURER DATA';
}

/**
 * Sort key for a manufacturer group: worst-case (highest) severity among its
 * devices first, then a secondary value depending on the active sortMode —
 * strongest signal for 'proximity', most recently seen for 'lastseen' and
 * 'severity' (used as a tie-breaker), or the group key text for 'name'.
 */
function groupSortValue(items) {
    const severity = Math.max(...items.map(d => SEVERITY_RANK[d.classification.type] ?? 0));
    const secondary = sortMode === 'proximity'
        ? Math.max(...items.map(d => d.rssi ?? -999))
        : Math.max(...items.map(d => d.lastSeen));
    return { severity, secondary };
}

/**
 * Rebuild the device list honoring bundling, grouping, sorting and filters.
 * Throttled via scheduleRender(); skipped while a note editor is open so
 * typing is never clobbered.
 */
function renderDeviceList() {
    const list = document.getElementById('device-list');

    // Never clobber an open note editor — retry on the next tick instead
    if (list.querySelector('.note-input')) {
        scheduleRender();
        return;
    }

    renderedData.clear();

    if (devices.size === 0) {
        list.replaceChildren(renderEmptyState());
        updateFilterStats(0, 0, 0, 0);
        return;
    }

    const entries = bundleRotating ? computeBundles() : [...devices.values()];
    const frag = document.createDocumentFragment();
    const makeCard = (d) => {
        renderedData.set(d.id, d);
        return buildCard(d);
    };

    if (groupByMfr) {
        const groups = new Map();
        for (const d of entries) {
            const key = groupKeyFor(d);
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(d);
        }
        const sortedKeys = [...groups.keys()].sort((keyA, keyB) => {
            const a = groupSortValue(groups.get(keyA));
            const b = groupSortValue(groups.get(keyB));
            if (b.severity !== a.severity) return b.severity - a.severity;
            if (sortMode === 'name') return keyA.localeCompare(keyB, undefined, { sensitivity: 'base' });
            return b.secondary - a.secondary;
        });
        for (const key of sortedKeys) {
            const items = groups.get(key);
            const collapsed = collapsedGroups.has(key);
            const header = document.createElement('button');
            header.type = 'button';
            header.className = 'group-header';
            header.dataset.groupKey = key;
            header.setAttribute('aria-expanded', String(!collapsed));
            header.textContent = `${collapsed ? '\u25B8' : '\u25BE'} ${key} (${items.length})`;
            frag.appendChild(header);
            items.sort(deviceComparator);
            for (const d of items) {
                const card = makeCard(d);
                card.dataset.groupKey = key;
                frag.appendChild(card);
            }
        }
    } else {
        entries.sort(deviceComparator);
        for (const d of entries) frag.appendChild(makeCard(d));
    }

    list.replaceChildren(frag);
    applyCurrentFilter();
    updateCollapseAllButton();
}

/** Sync the COLLAPSE ALL button label/state with the current groups. */
function updateCollapseAllButton() {
    const btn = document.getElementById('btn-collapse-all');
    const keys = new Set([...devices.values()].map(groupKeyFor));
    const allCollapsed = groupByMfr && keys.size > 0 && [...keys].every(k => collapsedGroups.has(k));
    btn.textContent = allCollapsed ? 'EXPAND ALL' : 'COLLAPSE ALL';
    btn.setAttribute('aria-pressed', String(allCollapsed));
    btn.classList.toggle('active', allCollapsed);
}

/** Collapse every manufacturer group at once (or expand, when all are collapsed). */
function collapseAllGroups() {
    // Grouping is required for collapsing — enable it if off
    if (!groupByMfr) {
        groupByMfr = true;
        const groupBtn = document.getElementById('btn-group');
        groupBtn.classList.add('active');
        groupBtn.setAttribute('aria-pressed', 'true');
    }

    const keys = new Set([...devices.values()].map(groupKeyFor));
    const allCollapsed = keys.size > 0 && [...keys].every(k => collapsedGroups.has(k));
    collapsedGroups.clear();
    if (!allCollapsed) {
        for (const k of keys) collapsedGroups.add(k);
    }
    renderDeviceList();
}

function renderCardHTML(data) {
    const name = data.name
        ? escapeHTML(data.name)
        : '<span class="dim">Unknown Device</span>';

    const rssiText = data.rssi != null ? `${data.rssi} dBm` : 'N/A';
    const rssiBar  = data.rssi != null ? buildRssiBar(data.rssi) : '';

    const distance = estimateDistance(data.rssi, data.txPower);
    const distRow = distance != null
        ? `<div class="device-detail">
             <span class="detail-label">DIST</span>
             <span class="detail-value" title="Rough estimate from signal strength — walls, interference and antenna orientation easily cause ×2–×5 error">~${formatDistance(distance)} <span class="dim small">(estimated)</span></span>
           </div>`
        : '';

    const badgeClass = `badge-${data.classification.type}`;
    // Qualify anything flagged, so "we decoded a Find My beacon" and "the name
    // contains the word tile" stop looking identical.
    const badgeText = data.classification.type === 'normal'
        ? 'NORMAL'
        : `${data.classification.type.toUpperCase()} · ${(data.classification.confidence || 'likely').toUpperCase()}`;

    const firstStr = new Date(data.firstSeen).toLocaleTimeString();
    const lastStr  = new Date(data.lastSeen).toLocaleTimeString();
    const duration = formatDuration(data.lastSeen - data.firstSeen);

    let manufacturerRows = '';
    if (data.manufacturers.length > 0) {
        manufacturerRows = data.manufacturers.map(m =>
            `<div class="device-detail">
               <span class="detail-label">MFR ID</span>
               <span class="detail-value manufacturer">${escapeHTML(m.id)}</span>
               <span class="dim small">(${escapeHTML(m.name)})</span>
             </div>`
        ).join('');
    }

    const reasonRow = data.classification.reason
        ? `<div class="device-detail alert-reason">
             <span class="detail-label">REASON</span>
             <span class="detail-value">${escapeHTML(data.classification.reason)}</span>
           </div>`
        : '';

    const confidenceRow = data.classification.type !== 'normal'
        ? `<div class="device-detail">
             <span class="detail-label">CONFIDENCE</span>
             <span class="detail-value dim small">${escapeHTML((data.classification.confidence || 'likely').toUpperCase())} — ${escapeHTML(CONFIDENCE_EXPLANATION[data.classification.confidence] || CONFIDENCE_EXPLANATION.likely)}</span>
           </div>`
        : '';

    const uuidsRow = data.uuids.length > 0
        ? `<div class="device-detail">
             <span class="detail-label">SVC UUID</span>
             <span class="detail-value dim small">${data.uuids.map(formatServiceUuid).join(', ')}</span>
           </div>`
        : '';

    const txRow = data.txPower != null
        ? `<div class="device-detail">
             <span class="detail-label">TX PWR</span>
             <span class="detail-value dim">${data.txPower} dBm</span>
           </div>`
        : '';

    const aliasRow = data.aliasIds && data.aliasIds.length > 1
        ? `<div class="device-detail">
             <span class="detail-label">ALIASES</span>
             <span class="detail-value dim small" title="Likely the same physical device rotating its MAC address (heuristic guess)">${data.aliasIds.length} addresses (MAC rotation?): ${data.aliasIds.map(escapeHTML).join(', ')}</span>
           </div>`
        : '';

    const note = deviceNotes[data.id];
    const noteRow = note
        ? `<div class="device-detail note-row">
             <span class="detail-label">NOTE</span>
             <span class="detail-value note-text">${escapeHTML(note)}</span>
           </div>`
        : '';

    return `
        <div class="device-card-header">
            <div class="device-name">${name}</div>
            <div class="device-actions">
                <button class="icon-btn" type="button" data-action="copy" title="Copy device info" aria-label="Copy device info">⧉</button>
                <button class="icon-btn" type="button" data-action="google" title="Search on Google" aria-label="Search device on Google">G</button>
                <button class="icon-btn" type="button" data-action="ddg" title="Search on DuckDuckGo" aria-label="Search device on DuckDuckGo">D</button>
                <button class="icon-btn" type="button" data-action="note" title="Add or edit note" aria-label="Add or edit note">✎</button>
            </div>
            <span class="badge ${badgeClass}">${badgeText}</span>
        </div>
        <div class="device-details">
            <div class="device-detail">
                <span class="detail-label">RSSI</span>
                <span class="detail-value">${rssiText} ${rssiBar}</span>
            </div>
            ${distRow}
            ${txRow}
            ${manufacturerRows}
            ${reasonRow}
            ${confidenceRow}
            ${uuidsRow}
            ${aliasRow}
            ${noteRow}
            <div class="device-detail">
                <span class="detail-label">FIRST</span>
                <span class="detail-value dim">${firstStr}</span>
            </div>
            <div class="device-detail">
                <span class="detail-label">LAST</span>
                <span class="detail-value dim">${lastStr} <span class="small">(seen for ${duration})</span></span>
            </div>
            <div class="device-detail">
                <span class="detail-label">ID</span>
                <span class="detail-value dim small">${escapeHTML(data.id)}</span>
            </div>
        </div>
    `;
}

/** Human-friendly duration, e.g. "42s", "12m 3s", "1h 05m". */
function formatDuration(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ${s % 60}s`;
    return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

/** Escaped service UUID with its known name appended, when available. */
function formatServiceUuid(uuid) {
    const name = serviceUuidName(uuid);
    return name
        ? `${escapeHTML(uuid)} <span class="uuid-name">(${escapeHTML(name)})</span>`
        : escapeHTML(uuid);
}

function buildRssiBar(rssi) {
    const bars = rssi >= -60 ? 5 : rssi >= -70 ? 4 : rssi >= -80 ? 3 : rssi >= -90 ? 2 : 1;
    let html = '<span class="rssi-bars" title="Signal strength">';
    for (let i = 1; i <= 5; i++) {
        html += `<span class="rssi-bar${i <= bars ? ' active' : ''}"></span>`;
    }
    html += '</span>';
    return html;
}

// ================================================================
// UI Updates
// ================================================================

function updateCounts() {
    const all          = devices.size;
    const surveillance = countByType('surveillance');
    const tracker      = countByType('tracker');

    document.getElementById('device-count').textContent      = all;
    document.getElementById('surveillance-count').textContent = surveillance;
    document.getElementById('tracker-count').textContent      = tracker;

    const survEl = document.getElementById('surveillance-count');
    survEl.classList.toggle('threat', surveillance > 0);
    survEl.classList.toggle('active', surveillance > 0);
}

function countByType(type) {
    let count = 0;
    for (const d of devices.values()) {
        if (d.classification.type === type) count++;
    }
    return count;
}

function setStatus(text, cls = '') {
    const el = document.getElementById('status');
    el.textContent = text;
    el.className = `status-value${cls ? ' ' + cls : ''}`;
}

function showAlertBanner(deviceName) {
    const banner = document.getElementById('alert-banner');
    document.getElementById('alert-text').textContent =
        `SURVEILLANCE DEVICE DETECTED NEARBY: ${deviceName}`;
    banner.classList.remove('hidden');
    clearTimeout(alertTimer);
    alertTimer = setTimeout(() => banner.classList.add('hidden'), 10000);
}

function showNotice(type, message) {
    const box = document.getElementById('notice-box');
    box.className = `notice-box info-${type}`;
    box.textContent = message;
    box.classList.remove('hidden');
}

function clearNotice() {
    document.getElementById('notice-box').classList.add('hidden');
}

// ================================================================
// Filtering
// ================================================================

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        const active = btn.dataset.filter === filter;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
    });
    applyCurrentFilter();
}

/** Returns true if a device passes all active filters (type, signal, staleness, text). */
function deviceMatchesFilters(data) {
    if (currentFilter !== 'all' && data.classification.type !== currentFilter) return false;
    if (rssiFilter != null && (data.rssi == null || data.rssi < rssiFilter)) return false;
    if (staleThresholdMs != null && Date.now() - data.lastSeen > staleThresholdMs) return false;
    if (textFilter) {
        const haystack = [
            data.name || '',
            data.id,
            deviceNotes[data.id] || '',
            ...data.manufacturers.map(m => `${m.id} ${m.name}`),
            ...data.uuids.map(u => serviceUuidName(u) || ''),
        ].join(' ').toLowerCase();
        if (!haystack.includes(textFilter)) return false;
    }
    return true;
}

/**
 * Apply filters to all cards, honour collapsed groups, and refresh the
 * filter statistics (MFR / FILTERED / FILT TRACKERS / FILT SURVEILLANCE).
 */
function applyCurrentFilter() {
    let filtered = 0;
    let trackers = 0;
    let surveillance = 0;
    const mfrIds = new Set();

    document.querySelectorAll('.device-card').forEach(card => {
        const data = renderedData.get(card.dataset.deviceId) || devices.get(card.dataset.deviceId);
        const matches = Boolean(data && deviceMatchesFilters(data));
        card.dataset.filtered = matches ? '1' : '0';
        const collapsed = card.dataset.groupKey != null && collapsedGroups.has(card.dataset.groupKey);
        card.style.display = matches && !collapsed ? '' : 'none';

        if (matches) {
            filtered++;
            if (data.classification.type === 'tracker') trackers++;
            else if (data.classification.type === 'surveillance') surveillance++;
            for (const m of data.manufacturers) mfrIds.add(m.id);
        }
    });

    updateFilterStats(mfrIds.size, filtered, trackers, surveillance);
    updateGroupHeaders();
}

/** Update the filter statistics row in the status area. */
function updateFilterStats(mfr, filtered, trackers, surveillance) {
    document.getElementById('mfr-count').textContent              = mfr;
    document.getElementById('filtered-count').textContent         = filtered;
    document.getElementById('filtered-tracker-count').textContent = trackers;
    document.getElementById('filtered-surv-count').textContent    = surveillance;
}

/** Collapse or expand a manufacturer group. */
function toggleGroup(key) {
    if (collapsedGroups.has(key)) collapsedGroups.delete(key);
    else collapsedGroups.add(key);
    renderDeviceList();
}

/** Hide group headers whose devices are all filtered out (collapse-agnostic). */
function updateGroupHeaders() {
    const list = document.getElementById('device-list');
    let header = null;
    let anyVisible = false;
    for (const el of list.children) {
        if (el.classList.contains('group-header')) {
            if (header) header.style.display = anyVisible ? '' : 'none';
            header = el;
            anyVisible = false;
        } else if (el.classList.contains('device-card') && el.dataset.filtered === '1') {
            anyVisible = true;
        }
    }
    if (header) header.style.display = anyVisible ? '' : 'none';
}

/** Toggle a boolean view option bound to a button, then re-render. */
function bindViewToggle(buttonId, apply) {
    const btn = document.getElementById(buttonId);
    btn.addEventListener('click', () => {
        const active = apply();
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-pressed', String(active));
        renderDeviceList();
    });
}

// ================================================================
// ================================================================
// CSV Export
//
// The schema below is shared with the Android app (see
// app/src/main/java/com/compyra/ghosttooth/export/CsvExport.kt). Someone
// documenting being followed may export from the phone one day and the browser
// the next; if the two files had different columns, different date formats and
// different words for the same verdict they could not be compared, which
// defeats the point of an evidence export. Keep both sides in step.
// ================================================================

/** Bump together with SCHEMA_VERSION in CsvExport.kt. */
const CSV_SCHEMA_VERSION = 'ghosttooth-csv-1';
const CSV_SOURCE = 'web';

const CSV_DEVICE_HEADER = [
    'address', 'name', 'classification', 'confidence', 'reason',
    'manufacturer_ids', 'manufacturer_names', 'service_uuids',
    'rssi_dbm', 'distance_m', 'tx_power', 'samples',
    'first_seen', 'last_seen', 'note', 'source',
];

const CSV_MANUFACTURER_HEADER = [
    'manufacturer', 'company_id', 'total', 'surveillance', 'trackers', 'normal',
];

/**
 * Quote/escape a single CSV field. Prefixes a leading `'` on values starting
 * with =, +, - or @ to prevent CSV/Excel formula injection — device names
 * and notes can contain attacker-controlled BLE broadcast data, so this
 * guards against a malicious "device name" executing as a spreadsheet
 * formula when the export is opened later.
 */
function csvField(value) {
    let s = value == null ? '' : String(value);
    s = s.replace(/[\r\n]+/g, ' ');
    if (/^[=+\-@\t]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
}

/** Build a CSV file from rows (array of arrays) and trigger a download. */
function downloadCsv(filename, rows) {
    const csv = rows.map(row => row.map(csvField).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

/** Provenance banner, so a file found months later still explains itself. */
function csvPreamble() {
    return [`# ${CSV_SCHEMA_VERSION}`, `source=${CSV_SOURCE}`, `generated=${new Date().toISOString()}`];
}

/** Export a per-manufacturer/group summary (counts by classification) as CSV. */
function exportMfrSummaryCsv() {
    if (devices.size === 0) {
        showNotice('warn', 'No devices to export yet.');
        return;
    }
    const groups = new Map();
    for (const d of devices.values()) {
        const key = groupKeyFor(d);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(d);
    }
    const rows = [csvPreamble(), CSV_MANUFACTURER_HEADER];
    for (const [key, items] of groups) {
        rows.push([
            key,
            items[0]?.manufacturers?.[0]?.id ?? '',
            items.length,
            items.filter(d => d.classification.type === 'surveillance').length,
            items.filter(d => d.classification.type === 'tracker').length,
            items.filter(d => d.classification.type === 'normal').length,
        ]);
    }
    downloadCsv(`ghosttooth-manufacturers-${Date.now()}.csv`, rows);
}

/** Export the full device list (one row per device, all known fields) as CSV. */
function exportFullCsv() {
    if (devices.size === 0) {
        showNotice('warn', 'No devices to export yet.');
        return;
    }
    const rows = [csvPreamble(), CSV_DEVICE_HEADER];
    for (const d of devices.values()) {
        const dist = estimateDistance(d.rssi, d.txPower);
        rows.push([
            d.id,
            d.name || '',
            d.classification.type,
            // Blank for an unflagged device: "normal,confirmed" would read as
            // though we are certain it is harmless, and we cannot claim that —
            // it simply matched nothing. Kept in step with CsvExport.kt.
            d.classification.type === 'normal' ? '' : (d.classification.confidence || ''),
            d.classification.reason || '',
            d.manufacturers.map(m => m.id).join('; '),
            d.manufacturers.map(m => m.name).join('; '),
            d.uuids.map(u => serviceUuidName(u) || u).join('; '),
            d.rssi ?? '',
            dist != null ? dist.toFixed(1) : '',
            d.txPower ?? '',
            '', // samples: the web scanner does not buffer per-device samples
            new Date(d.firstSeen).toISOString(),
            new Date(d.lastSeen).toISOString(),
            deviceNotes[d.id] || '',
            CSV_SOURCE,
        ]);
    }
    downloadCsv(`ghosttooth-scan-${Date.now()}.csv`, rows);
}

// ================================================================
// Device Notes (localStorage)
// ================================================================

/** Load saved notes from localStorage. */
function loadNotes() {
    try {
        deviceNotes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    } catch (_) {
        deviceNotes = {};
    }
}

/** Save (or delete, when empty) a note for a device and persist. */
function saveNote(deviceId, text) {
    if (text) deviceNotes[deviceId] = text;
    else delete deviceNotes[deviceId];
    try {
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(deviceNotes));
    } catch (_) { /* storage full/blocked — note stays for this session only */ }
}

/** Open an inline note editor inside a device card. */
function openNoteEditor(card, deviceId) {
    if (card.querySelector('.note-editor')) return;

    const editor = document.createElement('div');
    editor.className = 'device-detail note-editor';
    editor.innerHTML = `
        <span class="detail-label">NOTE</span>
        <input class="note-input terminal-input" type="text" maxlength="200"
               placeholder="e.g. 3rd floor meeting room — seen daily" aria-label="Device note">
        <button class="icon-btn" type="button" data-action="note-save" title="Save note" aria-label="Save note">✔</button>
        <button class="icon-btn" type="button" data-action="note-cancel" title="Cancel" aria-label="Cancel note editing">✕</button>`;

    const input = editor.querySelector('.note-input');
    input.value = deviceNotes[deviceId] || '';
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeNoteEditor(card, deviceId, true);
        else if (e.key === 'Escape') closeNoteEditor(card, deviceId, false);
    });

    card.querySelector('.note-row')?.classList.add('hidden');
    card.querySelector('.device-details').appendChild(editor);
    input.focus();
}

/** Close the note editor, optionally saving, and refresh the list. */
function closeNoteEditor(card, deviceId, save) {
    const editor = card.querySelector('.note-editor');
    if (!editor) return;
    if (save) saveNote(deviceId, editor.querySelector('.note-input').value.trim());
    editor.remove();
    renderDeviceList();
}

// ================================================================
// Card Actions (event delegation — cards are re-rendered constantly)
// ================================================================

function handleCardAction(e) {
    // Group header click: collapse/expand the manufacturer group
    const header = e.target.closest('.group-header');
    if (header) {
        toggleGroup(header.dataset.groupKey);
        return;
    }

    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const card = btn.closest('.device-card');
    if (!card) return;
    const deviceId = card.dataset.deviceId;
    const data = renderedData.get(deviceId) || devices.get(deviceId);
    if (!data) return;

    switch (btn.dataset.action) {
        case 'copy': {
            const mfr = data.manufacturers.map(m => `${m.id} (${m.name})`).join(', ');
            const text = [
                data.name || 'Unknown Device',
                `ID: ${data.id}`,
                mfr && `MFR: ${mfr}`,
                data.rssi != null && `RSSI: ${data.rssi} dBm`,
            ].filter(Boolean).join(' | ');
            navigator.clipboard?.writeText(text).then(
                () => flashButton(btn, '✓'),
                () => flashButton(btn, '✕'),
            );
            break;
        }
        case 'google':
        case 'ddg': {
            const q = encodeURIComponent(`${data.name || data.manufacturers[0]?.name || data.id} bluetooth device`);
            const url = btn.dataset.action === 'google'
                ? `https://www.google.com/search?q=${q}`
                : `https://duckduckgo.com/?q=${q}`;
            window.open(url, '_blank', 'noopener');
            break;
        }
        case 'note':
            openNoteEditor(card, deviceId);
            break;
        case 'note-save':
            closeNoteEditor(card, deviceId, true);
            break;
        case 'note-cancel':
            closeNoteEditor(card, deviceId, false);
            break;
    }
}

/** Briefly swap a button's label to give action feedback. */
function flashButton(btn, symbol) {
    const original = btn.textContent;
    btn.textContent = symbol;
    setTimeout(() => { btn.textContent = original; }, 1000);
}

// ================================================================
// Scan Controls — Public API (called from HTML)
// ================================================================

/**
 * Timestamped console logger for capturing a real scan session
 * (permission granted -> first packet -> last packet -> restarts).
 * Always on so a failing session can be copied straight from DevTools.
 *
 * Every line is also kept in a small ring buffer so the user can hand us a
 * session timeline without ever opening DevTools — see copyDiagnostics().
 */
const LOG_BUFFER = [];
const LOG_BUFFER_MAX = 400;

function btLog(...args) {
    const t = new Date().toISOString().substr(11, 12);
    const line = `[${t}] ${args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ')}`;
    LOG_BUFFER.push(line);
    if (LOG_BUFFER.length > LOG_BUFFER_MAX) LOG_BUFFER.shift();
    // eslint-disable-next-line no-console
    console.log(`[ghosttooth ${t}]`, ...args);
}

/** True on Windows, where Chromium Web Bluetooth passive scanning is unreliable. */
function isWindows() {
    const ua = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || '';
    return /win/i.test(ua);
}

/** Short "Browser x.y on OS" label for diagnostics/logging. */
function browserLabel() {
    const ua = navigator.userAgent || '';
    let name = 'Chromium';
    let m;
    if ((m = ua.match(/Edg\/(\d+)/)))        name = `Edge ${m[1]}`;
    else if ((m = ua.match(/OPR\/(\d+)/)))    name = `Opera ${m[1]}`;
    else if ((m = ua.match(/Brave\/(\d+)/)))  name = `Brave ${m[1]}`;
    else if ((m = ua.match(/Chrome\/(\d+)/))) name = `Chrome ${m[1]}`;
    const os = isWindows() ? 'Windows'
        : /android/i.test(ua) ? 'Android'
        : /cros/i.test(ua) ? 'ChromeOS'
        : /mac/i.test(ua) ? 'macOS'
        : /linux/i.test(ua) ? 'Linux' : 'unknown OS';
    return `${name} on ${os}`;
}

/** Open the collapsible troubleshooting grimoire (used when a scan struggles). */
function openTroubleshoot() {
    document.getElementById('troubleshoot')?.setAttribute('open', '');
}

/**
 * Copy a complete diagnostics report to the clipboard.
 *
 * Bug reports about scanning are almost useless without the environment and the
 * session timeline, and "open DevTools and paste the console" is too much to ask
 * of most people. This bundles the browser/OS label, capability flags, the live
 * counters and the log ring buffer into one paste.
 *
 * Deliberately contains no device data: MAC addresses and device names are not
 * ours to put on someone's clipboard.
 */
async function copyDiagnostics(btn) {
    const diag = (id) => document.getElementById(id)?.textContent?.trim() ?? 'n/a';
    const report = [
        'GHOSTTOOTH diagnostics',
        `when          : ${new Date().toISOString()}`,
        `browser/OS    : ${browserLabel()}`,
        `page          : ${location.origin}${location.pathname}`,
        `secure context: ${window.isSecureContext}`,
        `web bluetooth : ${'bluetooth' in navigator}`,
        `requestLEScan : ${typeof navigator.bluetooth?.requestLEScan === 'function'}`,
        `service worker: ${'serviceWorker' in navigator}`,
        '',
        `mode          : ${diag('diag-mode')}`,
        `packets       : ${diag('diag-packets')}`,
        `unique        : ${diag('diag-unique')}`,
        `last packet   : ${diag('diag-lastpkt')}`,
        `scan state    : ${diag('diag-active')}`,
        `restarts      : ${diag('diag-restarts')}`,
        '',
        `--- session log (${LOG_BUFFER.length} lines) ---`,
        ...(LOG_BUFFER.length ? LOG_BUFFER : ['(no scan started yet)']),
    ].join('\n');

    try {
        await navigator.clipboard.writeText(report);
        if (btn) flashButton(btn, 'COPIED \u2713');
    } catch (_) {
        // Insecure context or blocked clipboard: fall back to a selectable
        // textarea so the report can still be copied by hand.
        const box = document.getElementById('diag-dump');
        if (box) {
            box.value = report;
            box.classList.remove('hidden');
            box.focus();
            box.select();
        }
        if (btn) flashButton(btn, 'SELECT + COPY');
    }
}

/** Copy the bridge launch command to the clipboard, with button feedback. */
async function copyBridgeCommand(btn) {
    const cmd = 'python bt-bridge.py';
    try {
        await navigator.clipboard.writeText(cmd);
        if (btn) flashButton(btn, 'COPIED \u2713');
    } catch (_) {
        // Clipboard blocked (e.g. insecure context) — select fallback text instead.
        const el = document.getElementById('bridge-cmd');
        if (el) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

// ---- Live scan diagnostics readout ----

/** Show the diagnostics row and begin refreshing it once per second. */
function startDiagnostics(modeLabel) {
    scanModeLabel = modeLabel;
    scanStartedAt = Date.now();
    packetsReceived = 0;
    lastPacketAt = 0;
    scanRestarts = 0;
    document.getElementById('scan-diag')?.classList.remove('hidden');
    updateDiagnostics();
    clearInterval(diagTimer);
    diagTimer = setInterval(updateDiagnostics, 1000);
}

/** Stop refreshing and hide the diagnostics row. */
function stopDiagnostics() {
    clearInterval(diagTimer);
    diagTimer = null;
    scanModeLabel = '\u2014';
    document.getElementById('scan-diag')?.classList.add('hidden');
}

/** Push current scan counters into the diagnostics UI. */
function updateDiagnostics() {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('diag-mode', scanModeLabel);
    set('diag-packets', String(packetsReceived));
    set('diag-unique', String(devices.size));
    set('diag-restarts', String(scanRestarts));

    if (lastPacketAt === 0) {
        set('diag-lastpkt', '\u2014');
    } else {
        const secs = Math.round((Date.now() - lastPacketAt) / 1000);
        set('diag-lastpkt', secs <= 0 ? 'now' : `${secs}s ago`);
    }

    const activeEl = document.getElementById('diag-active');
    if (activeEl) {
        if (activeScan) {
            const alive = activeScan.active !== false;
            activeEl.textContent = alive ? 'ACTIVE' : 'STALLED';
            activeEl.classList.toggle('threat', !alive);
        } else if (bridgeWs || bridgeTimer) {
            activeEl.textContent = 'BRIDGE';
            activeEl.classList.remove('threat');
        } else {
            activeEl.textContent = '\u2014';
            activeEl.classList.remove('threat');
        }
    }
}

// ---- Passive-scan keepalive & auto-restart ----

/**
 * Restart the Web Bluetooth passive scan. Chromium silently tears BLE scans
 * down after a short interval (the "stops after a few seconds" symptom), so we
 * stop and re-issue requestLEScan. The permission is already granted for the
 * session, so this does NOT prompt the user again.
 */
async function restartPassiveScan(reason) {
    if (!activeScan || restarting) return;
    restarting = true;
    try {
        try { activeScan.stop(); } catch (_) { /* ignore */ }
        activeScan = null;
        activeScan = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true,
            keepRepeatedDevices: true,
        });
        scanRestarts++;
        btLog(`Passive scan restarted (#${scanRestarts}) — ${reason}.`);
    } catch (err) {
        btLog(`Passive scan restart failed: ${err.name} ${err.message}`);
        // Surface once; keepalive will keep trying on the next tick.
        setStatus('SCAN STALLED', 'error');
    } finally {
        restarting = false;
    }
}

/** Begin watching the passive scan and auto-restart it when it stalls. */
function startScanKeepalive() {
    clearInterval(scanKeepalive);
    scanKeepalive = setInterval(() => {
        if (!activeScan || restarting || document.hidden) return;
        const quietFor = lastPacketAt ? Date.now() - lastPacketAt : Date.now() - scanStartedAt;
        if (activeScan.active === false) {
            restartPassiveScan('browser deactivated the scan');
        } else if (quietFor > SCAN_QUIET_RESTART_MS && packetsReceived > 0) {
            restartPassiveScan(`no packets for ${Math.round(quietFor / 1000)}s`);
        }
    }, SCAN_KEEPALIVE_MS);
}

/** Stop the passive-scan keepalive loop. */
function stopScanKeepalive() {
    clearInterval(scanKeepalive);
    scanKeepalive = null;
}

/**
 * Resume/verify the scan when the tab becomes visible again. Chromium throttles
 * and can pause BLE scanning for backgrounded tabs, so a returning user gets a
 * fresh scan instead of a silently-dead one. Bound once.
 */
function bindVisibilityHandler() {
    if (visibilityBound) return;
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
        if (!activeScan) return;
        if (document.hidden) {
            btLog('Tab hidden — Chromium may pause BLE scanning.');
        } else {
            btLog('Tab visible again — verifying passive scan.');
            restartPassiveScan('tab returned to foreground');
        }
    });
}

/**
 * Start scanning. Prefers the local scanner bridge (bt-bridge.py), which
 * performs a native BLE scan — required on Windows, where Chromium's
 * requestLEScan never starts radio discovery. Falls back to Web Bluetooth
 * passive scanning (works on Android / ChromeOS with the experimental flag).
 */
async function startScan() {
    clearNotice();
    setStatus('REQUESTING...', 'scanning');
    document.getElementById('btn-scan').disabled = true;
    btLog(`Start scan requested — ${browserLabel()}, HTTPS=${location.protocol === 'https:'}`);

    // 1) Local scanner bridge — full native scan, no browser limitations
    if (await startBridgeScan()) return;

    // 2) Web Bluetooth passive scanning
    if (!navigator.bluetooth) {
        setStatus('UNSUPPORTED', 'error');
        showNotice('error',
            'Web Bluetooth API is not available and no local scanner bridge was found. ' +
            'Run "python bt-bridge.py" on this machine, then click [ START SCAN ] again.');
        openTroubleshoot();
        document.getElementById('btn-scan').disabled = false;
        return;
    }

    try {
        if (typeof navigator.bluetooth.requestLEScan !== 'function') {
            // API not available — tell user and offer fallback
            setStatus('UNSUPPORTED', 'error');
            showNotice(
                'warn',
                'BLE passive scanning is not available in this browser and no local scanner bridge was found. ' +
                'Recommended: run "python bt-bridge.py" on this machine, then scan again. ' +
                'Alternatively enable chrome://flags/#enable-experimental-web-platform-features ' +
                'or use [ + ADD DEVICE ] to add devices one at a time.'
            );
            openTroubleshoot();
            document.getElementById('btn-scan').disabled = false;
            return;
        }

        // Reset diagnostics counters for a fresh session.
        packetsReceived = 0;
        lastPacketAt = 0;
        scanRestarts = 0;

        // Attach the listener BEFORE starting the scan so the initial
        // burst of advertisement packets is not missed.
        navigator.bluetooth.addEventListener('advertisementreceived', handleAdvertisement);

        activeScan = await navigator.bluetooth.requestLEScan({
            acceptAllAdvertisements: true,
            keepRepeatedDevices: true,
        });

        const onWindows = isWindows();
        setStatus('SCANNING', 'scanning');
        btLog(`Passive scan started (requestLEScan). ${onWindows ? 'Windows detected — reliability is poor here.' : ''}`);
        showNotice('info', 'Passive BLE scan active — all nearby advertisement packets will appear below. Click [ STOP SCAN ] when done.');

        // On Windows, Chromium's passive scan is unreliable. Nudge the user
        // toward the bridge up front instead of waiting for silence.
        if (onWindows) {
            openTroubleshoot();
            showNotice(
                'warn',
                'Heads up: on Windows, Chromium\u2019s Web Bluetooth scan is unreliable — it often stops after a few ' +
                'seconds or returns nothing. For a full, continuous scan, run the local bridge: "python bt-bridge.py", ' +
                'then scan again. (Ghosttooth will keep auto-restarting the browser scan in the meantime.)'
            );
        }

        document.getElementById('btn-stop').disabled = false;

        // Live diagnostics + keepalive/auto-restart + visibility handling.
        startDiagnostics(onWindows ? 'WEB BT (WIN)' : 'WEB BT');
        startScanKeepalive();
        bindVisibilityHandler();

        // Escalating watchdog: a quick gentle nudge, then real troubleshooting.
        clearTimeout(scanWatchdog);
        clearTimeout(scanWatchdogEscalate);
        scanWatchdog = setTimeout(() => {
            if (activeScan && packetsReceived === 0) {
                btLog('Watchdog: no packets after first window.');
                showNotice('warn', 'Scan is running but no advertisements have arrived yet\u2026 still listening. Only BLE devices actively ADVERTISING are visible.');
            }
        }, WATCHDOG_FIRST_MS);
        scanWatchdogEscalate = setTimeout(() => {
            if (activeScan && packetsReceived === 0) {
                btLog('Watchdog escalated: still no packets — likely a Windows/browser limitation.');
                openTroubleshoot();
                showNotice(
                    'warn',
                    'Still no advertisement packets. The browser granted permission but is not delivering data \u2014 ' +
                    'this is the known Windows Chromium limitation (and can also happen if the experimental flag is off). ' +
                    'Run the local scanner bridge instead: "python bt-bridge.py", then click [ STOP SCAN ] and [ START SCAN ] again.'
                );
            }
        }, WATCHDOG_DELAY_MS);

    } catch (err) {
        navigator.bluetooth.removeEventListener('advertisementreceived', handleAdvertisement);
        document.getElementById('btn-scan').disabled = false;
        btLog(`Scan start failed: ${err.name} ${err.message}`);

        if (err.name === 'NotAllowedError') {
            setStatus('DENIED', 'error');
            showNotice('error', 'Bluetooth permission was denied. Allow access and try again.');
            openTroubleshoot();
        } else if (err.name === 'InvalidStateError') {
            setStatus('BT OFF', 'error');
            showNotice('error', 'Bluetooth is turned off. Enable Bluetooth and try again.');
            openTroubleshoot();
        } else if (err.name === 'NotSupportedError') {
            setStatus('UNSUPPORTED', 'error');
            showNotice(
                'warn',
                'Your browser does not support BLE scanning. ' +
                'Enable chrome://flags/#enable-experimental-web-platform-features or use [ + ADD DEVICE ].'
            );
            openTroubleshoot();
        } else {
            setStatus('ERROR', 'error');
            showNotice('error', `Scan error: ${err.message}`);
            openTroubleshoot();
        }
    }
}

/** Stop the active passive scan. */
function stopScan() {
    const wasActive = activeScan !== null || watchedDevices.size > 0 || bridgeTimer !== null || bridgeWs !== null;

    clearTimeout(scanWatchdog);
    scanWatchdog = null;
    clearTimeout(scanWatchdogEscalate);
    scanWatchdogEscalate = null;
    stopScanKeepalive();
    stopDiagnostics();

    if (bridgeWs !== null) {
        bridgeWs.onclose = null; // suppress disconnect notice — this is an intentional stop
        bridgeWs.close();
        bridgeWs = null;
    }

    if (bridgeTimer !== null) {
        clearInterval(bridgeTimer);
        bridgeTimer = null;
    }

    if (activeScan) {
        activeScan.stop();
        activeScan = null;
        navigator.bluetooth.removeEventListener('advertisementreceived', handleAdvertisement);
    }

    // Also stop all watched devices
    stopWatchingDevices();

    // A pending bridge reconnect must not resurrect a scan the user just ended.
    cancelBridgeReconnect();

    if (wasActive) btLog('Scan stopped by user.');
    setStatus('STOPPED', '');
    document.getElementById('btn-scan').disabled  = false;
    document.getElementById('btn-stop').disabled  = true;
    if (wasActive) showNotice('info', 'Scan stopped.');
}

/** Unwatch all manually added devices and detach their event listeners. */
function stopWatchingDevices() {
    for (const device of watchedDevices) {
        try { device.unwatchAdvertisements?.(); } catch (_) { /* ignore */ }
        device.removeEventListener('advertisementreceived', handleAdvertisement);
    }
    watchedDevices.clear();
}

// ================================================================
// Local Scanner Bridge (bt-bridge.py)
// ================================================================

/** Fetch the device list from the local bridge via HTTP. Throws on failure. */
async function fetchBridgeDevices() {
    const res = await fetch(`${BRIDGE_URL}/api/devices`, { signal: AbortSignal.timeout(1500) });
    if (!res.ok) throw new Error(`Bridge HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data.devices) ? data.devices : [];
}

/**
 * Try to connect to the bridge via WebSocket (bypasses Chrome PNA loopback block).
 * The bridge pushes a full device list every 2 seconds.
 * @returns {Promise<boolean>} true if WebSocket mode started successfully.
 */
function startBridgeWsScan() {
    return new Promise((resolve) => {
        let started = false;
        let ws;
        try { ws = new WebSocket(BRIDGE_WS_URL); } catch (_) { resolve(false); return; }

        const timeout = setTimeout(() => {
            if (!started) {
                ws.onopen = ws.onmessage = ws.onerror = ws.onclose = null;
                ws.close();
                resolve(false);
            }
        }, 2000);

        ws.onmessage = (ev) => {
            let data;
            try { data = JSON.parse(ev.data); } catch (_) { return; }
            const list = Array.isArray(data.devices) ? data.devices : [];
            processBridgeDevices(list);
            if (!started) {
                started = true;
                clearTimeout(timeout);
                bridgeWs = ws;
                setStatus('SCANNING (BRIDGE)', 'scanning');
                startDiagnostics('BRIDGE (WS)');
                btLog('Connected to local bridge via WebSocket.');
                showNotice('info',
                    'Connected to the local scanner bridge — live native BLE scan active. ' +
                    'All nearby advertising devices will appear below. Click [ STOP SCAN ] when done.');
                document.getElementById('btn-stop').disabled = false;
                resolve(true);
            }
        };

        ws.onerror = () => { if (!started) { clearTimeout(timeout); resolve(false); } };

        ws.onclose = () => {
            if (!started) {
                clearTimeout(timeout);
                resolve(false);
            } else if (bridgeWs !== null) {
                // Unexpected disconnect (bridge crashed, was restarted, or the
                // machine slept). Previously this was a dead end — the user had
                // to notice "BRIDGE LOST" and start over. Try to pick it back up.
                bridgeWs = null;
                handleBridgeLoss();
            }
        };
    });
}

/** How long to keep trying to reach the bridge again after it drops. */
const BRIDGE_RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000];
let bridgeReconnectAttempt = 0;
let bridgeReconnectTimer = null;

/**
 * Recover from a dropped bridge connection.
 *
 * The common cause is the user restarting `bt-bridge.py`, which is exactly the
 * moment they least want to lose their session. Retries with a short backoff and
 * only gives up — with an actionable message — once the backoff is exhausted.
 */
function handleBridgeLoss() {
    if (bridgeReconnectAttempt >= BRIDGE_RECONNECT_DELAYS_MS.length) {
        stopScan();
        setStatus('BRIDGE LOST', 'error');
        showNotice('error',
            'Lost connection to the local scanner bridge and could not reconnect. ' +
            'Restart "python bt-bridge.py", then click [ START SCAN ] again.');
        btLog('Bridge reconnect gave up after all attempts.');
        bridgeReconnectAttempt = 0;
        return;
    }

    const delay = BRIDGE_RECONNECT_DELAYS_MS[bridgeReconnectAttempt];
    bridgeReconnectAttempt += 1;
    setStatus('BRIDGE RECONNECTING', 'scanning');
    btLog(`Bridge connection lost — reconnect attempt ${bridgeReconnectAttempt} in ${delay} ms.`);

    clearTimeout(bridgeReconnectTimer);
    bridgeReconnectTimer = setTimeout(async () => {
        // The user may have pressed STOP while we were waiting. stopScan()
        // calls cancelBridgeReconnect(), which clears this timer and resets the
        // counter, so reaching here means the session is still meant to run.
        const ok = await startBridgeWsScan();
        if (ok) {
            bridgeReconnectAttempt = 0;
            btLog('Bridge reconnected.');
            showNotice('info', 'Reconnected to the local scanner bridge — scanning resumed.');
        } else {
            handleBridgeLoss();
        }
    }, delay);
}

/** Cancel any pending bridge reconnect (called when the user stops a scan). */
function cancelBridgeReconnect() {
    clearTimeout(bridgeReconnectTimer);
    bridgeReconnectTimer = null;
    bridgeReconnectAttempt = 0;
}

/**
 * Try to connect to the local scanner bridge.
 * Prefers WebSocket (avoids Chrome Private Network Access loopback block),
 * falls back to HTTP polling for environments where WebSocket is unavailable.
 * @returns {Promise<boolean>} true if bridge mode started.
 */
async function startBridgeScan() {
    if (await startBridgeWsScan()) return true;

    // HTTP fallback (localhost testing, older setups)
    let list;
    try {
        list = await fetchBridgeDevices();
    } catch (_) {
        return false;
    }

    processBridgeDevices(list);
    setStatus('SCANNING (BRIDGE)', 'scanning');
    startDiagnostics('BRIDGE (HTTP)');
    btLog('Connected to local bridge via HTTP polling.');
    showNotice('info',
        'Connected to the local scanner bridge — live native BLE scan active. ' +
        'All nearby advertising devices will appear below. Click [ STOP SCAN ] when done.');
    document.getElementById('btn-stop').disabled = false;

    bridgeTimer = setInterval(pollBridge, BRIDGE_POLL_MS);
    return true;
}

/** Periodic bridge poll; retries before giving up if the bridge goes away. */
async function pollBridge() {
    try {
        processBridgeDevices(await fetchBridgeDevices());
        bridgeReconnectAttempt = 0;
    } catch (_) {
        // One failed poll is not proof the bridge is gone — it may be
        // restarting. Tolerate a few before tearing the session down.
        bridgeReconnectAttempt += 1;
        if (bridgeReconnectAttempt <= BRIDGE_RECONNECT_DELAYS_MS.length) {
            setStatus('BRIDGE RECONNECTING', 'scanning');
            btLog(`Bridge poll failed (${bridgeReconnectAttempt}) — retrying.`);
            return;
        }
        stopScan();
        setStatus('BRIDGE LOST', 'error');
        showNotice('error',
            'Lost connection to the local scanner bridge and could not reconnect. ' +
            'Restart "python bt-bridge.py", then click [ START SCAN ] again.');
        bridgeReconnectAttempt = 0;
    }
}

/** Decode a hex string from the bridge into a Uint8Array. */
function hexToBytes(hex) {
    if (!hex) return new Uint8Array(0);
    const out = new Uint8Array(hex.length >> 1);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
}

/** Feed bridge JSON entries through the normal advertisement pipeline. */
function processBridgeDevices(list) {
    for (const d of list) {
        // Prefer the full payloads when the bridge sends them (newer versions);
        // fall back to bare company IDs so an older bt-bridge.py still works,
        // just with less certainty about Apple and Samsung devices.
        const manufacturerData = new Map();
        if (d.manufacturer_data) {
            for (const [companyId, hex] of Object.entries(d.manufacturer_data)) {
                manufacturerData.set(Number(companyId), hexToBytes(hex));
            }
        } else {
            for (const id of (d.manufacturer_ids || [])) manufacturerData.set(id, null);
        }

        const serviceData = new Map();
        for (const [uuid, hex] of Object.entries(d.service_data || {})) {
            serviceData.set(String(uuid).toLowerCase(), hexToBytes(hex));
        }

        handleAdvertisement({
            device: { id: d.address, name: d.name || null },
            rssi: d.rssi,
            txPower: d.tx_power,
            manufacturerData,
            serviceData,
            uuids: d.uuids || [],
        });
    }
}

/**
 * Add a single device using the standard requestDevice picker.
 * Works in any Chromium browser without the experimental flag.
 * The user must select the device from the browser's picker.
 */
async function addDevice() {
    if (!navigator.bluetooth) {
        showNotice('error', 'Web Bluetooth is not available in this browser.');
        return;
    }

    clearNotice();

    try {
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });

        // Create a device data entry from the basic device info (no ad data yet)
        const basicEvent = {
            device,
            rssi: undefined,
            txPower: undefined,
            manufacturerData: new Map(),
            uuids: [],
        };

        const classification = classifyAdvertisement(basicEvent);

        const deviceData = {
            id: device.id,
            name: device.name || null,
            rssi: undefined,
            txPower: undefined,
            classification,
            manufacturers: [],
            uuids: [],
            lastSeen: Date.now(),
            firstSeen: Date.now(),
        };

        if (!devices.has(device.id)) {
            devices.set(device.id, deviceData);
            scheduleRender();
        }

        // Try to start advertisement watching for live RSSI + manufacturer data
        if (typeof device.watchAdvertisements === 'function' && !watchedDevices.has(device)) {
            device.addEventListener('advertisementreceived', handleAdvertisement);
            await device.watchAdvertisements();
            watchedDevices.add(device);
            showNotice('info', `Added "${device.name || 'device'}" — watching for advertisement updates.`);
        } else {
            showNotice('info', `Added "${device.name || 'Unknown Device'}" (live advertisement data not available in this browser).`);
        }

    } catch (err) {
        if (err.name === 'NotFoundError') {
            // User cancelled the picker — not an error
            return;
        }
        showNotice('error', `Could not add device: ${err.message}`);
    }
}

/** Clear all detected devices from the list. */
function clearDevices() {
    // Stop watching manually added devices so cleared entries don't reappear
    stopWatchingDevices();

    devices.clear();
    renderedData.clear();
    clearTimeout(renderTimer);
    renderTimer = null;

    renderDeviceList();

    updateCounts();
    clearTimeout(alertTimer);
    document.getElementById('alert-banner').classList.add('hidden');
}

/** Build the empty-state placeholder from the HTML template. */
function renderEmptyState() {
    return document.getElementById('tpl-empty').content.cloneNode(true);
}

// ================================================================
// Utilities
// ================================================================

/** Escape HTML special characters to prevent XSS from device names/data. */
function escapeHTML(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ================================================================
// Init
// ================================================================

(function init() {
    // Wire up controls (script is loaded at end of <body>, DOM is ready)
    document.getElementById('btn-scan').addEventListener('click', startScan);
    document.getElementById('btn-stop').addEventListener('click', stopScan);
    document.getElementById('btn-add').addEventListener('click', addDevice);
    document.getElementById('btn-clear').addEventListener('click', clearDevices);
    document.getElementById('btn-export-mfr').addEventListener('click', exportMfrSummaryCsv);
    document.getElementById('btn-export-full').addEventListener('click', exportFullCsv);
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });

    document.getElementById('filter-text').addEventListener('input', (e) => {
        textFilter = e.target.value.trim().toLowerCase();
        applyCurrentFilter();
    });
    document.getElementById('filter-rssi').addEventListener('change', (e) => {
        rssiFilter = e.target.value ? Number(e.target.value) : null;
        applyCurrentFilter();
    });
    document.getElementById('sort-mode').addEventListener('change', (e) => {
        sortMode = e.target.value;
        renderDeviceList();
    });
    document.getElementById('stale-mode').addEventListener('change', (e) => {
        staleThresholdMs = e.target.value ? Number(e.target.value) : null;
        applyCurrentFilter();
    });

    bindViewToggle('btn-group',  () => (groupByMfr = !groupByMfr));
    bindViewToggle('btn-bundle', () => (bundleRotating = !bundleRotating));
    document.getElementById('btn-collapse-all').addEventListener('click', collapseAllGroups);

    // Card action buttons (copy / search / notes) via delegation
    document.getElementById('device-list').addEventListener('click', handleCardAction);

    // Troubleshooting: copy the bridge launch command
    document.getElementById('btn-copy-cmd')?.addEventListener('click', (e) => copyBridgeCommand(e.currentTarget));
    document.getElementById('btn-copy-diag')?.addEventListener('click', (e) => copyDiagnostics(e.currentTarget));

    // Re-apply the staleness filter periodically while it is active
    setInterval(() => {
        if (staleThresholdMs != null) applyCurrentFilter();
    }, 30000);

    loadNotes();

    // Render the initial empty state from the template
    document.getElementById('device-list').appendChild(renderEmptyState());

    // Warn if page is not served over HTTPS (required for Web Bluetooth)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        showNotice(
            'warn',
            'Web Bluetooth requires HTTPS. This page is served over HTTP — Bluetooth features will not work.'
        );
    }
})();
