/* ============================================================
   Curated known-device database for the GHOSTTOOTH scanner
   (loaded before script.js as a classic script, and fetched by the
   Android app's Registry at runtime).

   WHY THIS FILE EXISTS
   --------------------
   SURVEILLANCE_COMPANIES / TRACKER_COMPANIES in script.js key off
   Bluetooth SIG manufacturer IDs, which is safe only when the ID
   identifies the *product maker*. Many single-purpose devices only
   ever advertise a generic silicon vendor's MFR ID (Nordic
   Semiconductor, Espressif, Dialog/Renesas, STMicro, TI, ...) shared
   by thousands of unrelated products. Those IDs must NEVER be used
   for classification on their own — instead, add an entry here keyed
   by a device-name pattern.

   EVERY ENTRY REACHES EVERY INSTALLED APP WITHIN 12 HOURS, with no
   app update and no Play review. This is the cheapest, fastest and
   lowest-risk way to improve detection, so it is worth keeping fat.

   FORMAT — one entry per line, exactly these keys:
     { pattern: /regex/i, type: 'surveillance'|'tracker', confidence: 'possible'|'likely'|'confirmed', reason: 'text' }

   The Android app parses this with a deliberately tolerant
   line-based scanner (Registry.parseKnownJs), so:
     - KEEP ONE ENTRY PER LINE. A wrapped line is silently skipped.
     - Use /.../i regex literals and 'single quotes' for strings.
     - `confidence` is optional and defaults to 'likely'.
     - Anything unparseable is skipped, never fatal.

   WRITING GOOD PATTERNS
     - Anchor on distinctive brand/model tokens, not generic words.
       /\btag\b/ would match a hundred innocent devices; /air.?tag/ won't.
     - Use \b word boundaries generously.
     - Prefer a false negative over a false positive. A detector that
       cries wolf gets ignored, and then it protects nobody.
     - Set confidence: 'confirmed' only when the name is effectively
       unique to that product.
     - Leave a short note saying why the entry exists.
   ============================================================ */

'use strict';

/**
 * Devices identified by name/model that generic MFR-ID or built-in
 * name-pattern rules in script.js do not catch.
 */
const KNOWN_DEVICE_NAME_PATTERNS = [
    // ==========================================================
    // Wearable recorders and AI pins
    // These record audio (sometimes video) continuously and are often
    // worn without the knowledge of people nearby, which is exactly
    // the case GHOSTTOOTH exists to surface.
    // ==========================================================
    { pattern: /\bplaud\b/i, type: 'surveillance', confidence: 'confirmed', reason: 'PLAUD Note / NotePin — wearable AI voice recorder' },
    { pattern: /limitless.?pendant/i, type: 'surveillance', confidence: 'confirmed', reason: 'Limitless Pendant — always-listening wearable recorder' },
    { pattern: /\bomi\b.?(dev|device|necklace)/i, type: 'surveillance', confidence: 'possible', reason: 'Omi (formerly Friend) — wearable AI recorder' },
    { pattern: /\bbee\b.?(pioneer|computer)\b/i, type: 'surveillance', confidence: 'likely', reason: 'Bee Pioneer — always-on wearable AI recorder' },
    { pattern: /senstone/i, type: 'surveillance', confidence: 'confirmed', reason: 'Senstone — wearable voice recorder' },
    { pattern: /rabbit.?r1\b/i, type: 'surveillance', confidence: 'confirmed', reason: 'Rabbit R1 — AI device with always-available microphone and camera' },
    { pattern: /humane.?(ai.?)?pin/i, type: 'surveillance', confidence: 'confirmed', reason: 'Humane AI Pin — wearable camera and microphone' },
    { pattern: /instant.?365/i, type: 'surveillance', confidence: 'likely', reason: 'Wearable AI recorder' },

    // ==========================================================
    // Camera glasses
    // Meta, Snap and Amazon are already caught by their company IDs;
    // these cover smaller vendors and models that advertise under a
    // generic chipset vendor ID.
    // ==========================================================
    { pattern: /oakley.?meta|meta.?(hstn|vanguard)/i, type: 'surveillance', confidence: 'confirmed', reason: 'Oakley Meta smart glasses — built-in camera' },
    { pattern: /even.?realities/i, type: 'surveillance', confidence: 'likely', reason: 'Even Realities smart glasses' },
    { pattern: /halliday.?glass/i, type: 'surveillance', confidence: 'likely', reason: 'Halliday smart glasses' },
    { pattern: /rayneo/i, type: 'surveillance', confidence: 'likely', reason: 'RayNeo smart glasses — built-in camera' },
    { pattern: /\bsolos\b.?(airgo|smart)/i, type: 'surveillance', confidence: 'likely', reason: 'Solos AirGo smart glasses' },
    { pattern: /viture.?(one|pro|luma)/i, type: 'surveillance', confidence: 'possible', reason: 'Viture XR glasses' },
    { pattern: /inmo.?(air|go)/i, type: 'surveillance', confidence: 'likely', reason: 'INMO smart glasses' },
    { pattern: /brilliant.?labs/i, type: 'surveillance', confidence: 'likely', reason: 'Brilliant Labs Frame — camera glasses' },

    // ==========================================================
    // Body cameras and covert recorders
    // ==========================================================
    { pattern: /\baxon\b.?(body|flex)/i, type: 'surveillance', confidence: 'confirmed', reason: 'Axon body-worn camera' },
    { pattern: /body.?cam\b/i, type: 'surveillance', confidence: 'likely', reason: 'Body-worn camera' },
    { pattern: /\bboblov\b|\bmiufly\b/i, type: 'surveillance', confidence: 'likely', reason: 'Consumer body camera' },
    { pattern: /spy.?cam|hidden.?cam/i, type: 'surveillance', confidence: 'likely', reason: 'Device advertising itself as a covert camera' },

    // ==========================================================
    // Tracking tags
    // Apple, Tile and Chipolo are handled by decoded payload and
    // company ID; these cover the rest of the market.
    // ==========================================================
    { pattern: /pebblebee.?(clip|tag|card|found)/i, type: 'tracker', confidence: 'confirmed', reason: 'Pebblebee tracking tag' },
    { pattern: /\beufy\b.?(smart)?track/i, type: 'tracker', confidence: 'confirmed', reason: 'Eufy SmartTrack tracking tag' },
    { pattern: /moto.?tag\b/i, type: 'tracker', confidence: 'confirmed', reason: 'Motorola Moto Tag — Find My Device Network tracker' },
    { pattern: /\bjio.?tag\b/i, type: 'tracker', confidence: 'confirmed', reason: 'Jio Tag tracking tag' },
    { pattern: /\bcube\b.?(tracker|shadow)/i, type: 'tracker', confidence: 'likely', reason: 'Cube tracking tag' },
    { pattern: /\bknog\b.?scout|\bnutale\b/i, type: 'tracker', confidence: 'likely', reason: 'Bluetooth tracking tag' },
    { pattern: /\bitag\b|anti.?lost/i, type: 'tracker', confidence: 'possible', reason: 'Generic "iTag" style anti-loss tag — a very common unbranded tracker' },
    { pattern: /\bmusegear\b|\bnotione\b/i, type: 'tracker', confidence: 'likely', reason: 'European Bluetooth tracking tag' },
    { pattern: /\bwistiki\b/i, type: 'tracker', confidence: 'likely', reason: 'Wistiki Bluetooth tracking tag' },
    { pattern: /galaxy.?smart.?tag/i, type: 'tracker', confidence: 'confirmed', reason: 'Samsung Galaxy SmartTag' },

    // ==========================================================
    // Vehicle and asset trackers
    // Frequently repurposed for stalking: cheap, magnetic, battery-powered.
    // ==========================================================
    { pattern: /\bgf.?07\b|\btk.?102\b|\btk.?905\b|\bgt02\b/i, type: 'tracker', confidence: 'likely', reason: 'Common covert GPS/GSM vehicle tracker module' },
    { pattern: /\binvoxia\b/i, type: 'tracker', confidence: 'likely', reason: 'Invoxia GPS tracker' },
    { pattern: /\btracki\b/i, type: 'tracker', confidence: 'likely', reason: 'Tracki consumer GPS tracker' },
];
