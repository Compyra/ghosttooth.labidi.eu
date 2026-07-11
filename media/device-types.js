/* ============================================================
   Device-type heuristics for the GHOSTTOOTH scanner.
   (Optional data source — the Android app falls back to its
   built-in heuristics when this file is unavailable.)

   Loaded and cached by the app's Registry using the same tolerant
   line-based parser as known-devices.js, so KEEP ONE ENTRY PER LINE
   and use the exact shapes below. Anything the parser can't read is
   silently skipped, so a malformed line never breaks classification.

   Two entry shapes:
     { pattern: /regex/i, category: 'Label' }   // match advertised NAME
     { service: '180d',   category: 'Label' }   // 16-bit service UUID hint

   Guidance:
     - Prefer NAME patterns; they are far less ambiguous than a bare
       manufacturer ID (see the note in known-devices.js).
     - Service hints use the 16-bit assigned number only (e.g. '180d',
       not the full 128-bit base UUID).
     - Keep labels short and human ('Earbuds', not 'Wireless Earbuds v2').
     - This file classifies *what a device is*, NOT whether it is a
       threat. Threat classification stays in script.js / known-devices.js.
   ============================================================ */

'use strict';

const DEVICE_TYPE_PATTERNS = [
    // --- Audio ------------------------------------------------------------
    { pattern: /air.?pods|free.?buds|galaxy.?buds|\bbuds\b|ear.?buds|\bpods\b|wf-|elite\s?\d/i, category: 'Earbuds' },
    { pattern: /head.?phone|head.?set|\bwh-\b|\bwh\d|\bqc\b|bose|jbl|beats|momentum|sennheiser/i, category: 'Headphones' },
    { pattern: /speaker|sound.?bar|sound.?link|sound.?core|charge\s?\d|flip\s?\d|\bmini\b.?speaker|homepod|sonos|echo\s?(dot|pop|show|studio)?/i, category: 'Speaker' },

    // --- Wearables --------------------------------------------------------
    { pattern: /watch|\bband\b|mi.?band|smart.?band|fit.?bit|garmin|amazfit|gear.?s|galaxy.?watch|\bwhoop\b|oura/i, category: 'Smartwatch / band' },

    // --- Home / media -----------------------------------------------------
    { pattern: /\btv\b|bravia|aquos|\blg.?tv|firestick|fire.?tv|chromecast|shield|roku|apple.?tv|webos|android.?tv/i, category: 'TV / media' },

    // --- Input ------------------------------------------------------------
    { pattern: /mouse|\bmx\b.?master|trackpad|magic.?mouse/i, category: 'Mouse' },
    { pattern: /keyboard|\bkbd\b|magic.?keyboard/i, category: 'Keyboard' },

    // --- Phones / computers ----------------------------------------------
    { pattern: /\biphone\b|galaxy(?!.?buds|.?watch)|pixel|redmi|oneplus|xiaomi|\bphone\b/i, category: 'Phone' },
    { pattern: /macbook|\bimac\b|\bipad\b|surface|thinkpad|laptop/i, category: 'Computer / tablet' },

    // --- Trackers ---------------------------------------------------------
    { pattern: /air.?tag|\btile\b|smart.?tag|chipolo|find.?my|pebblebee|\btrackr\b/i, category: 'Tracker tag' },

    // --- Sensors / misc ---------------------------------------------------
    { pattern: /scale|thermo|hygro|\bsensor\b|\btag\b|beacon|ibeacon|eddystone/i, category: 'Sensor / beacon' },
    { pattern: /printer|epson|\bhp\b.?print|brother/i, category: 'Printer' },
    { pattern: /\bobd\b|vgate|carly|\belm327\b/i, category: 'Car dongle (OBD)' },
];

const DEVICE_TYPE_SERVICE_HINTS = [
    { service: '1812', category: 'Input device (HID)' },       // Human Interface Device
    { service: '180d', category: 'Heart-rate sensor' },        // Heart Rate
    { service: '1816', category: 'Cycling sensor' },           // Cycling Speed & Cadence
    { service: '1818', category: 'Cycling sensor' },           // Cycling Power
    { service: '1826', category: 'Fitness machine' },          // Fitness Machine
    { service: 'fe9f', category: 'Accessory (Fast Pair)' },    // Google Fast Pair
    { service: 'feaa', category: 'Beacon (Eddystone)' },       // Eddystone
    { service: '110b', category: 'Audio' },                    // Audio Sink
    { service: '1108', category: 'Headset' },                  // Headset
    { service: '111e', category: 'Hands-free' },               // Hands-Free
];

// Exported for the website's own tooling; the app parses the source text.
if (typeof window !== 'undefined') {
    window.DEVICE_TYPE_PATTERNS = DEVICE_TYPE_PATTERNS;
    window.DEVICE_TYPE_SERVICE_HINTS = DEVICE_TYPE_SERVICE_HINTS;
}
