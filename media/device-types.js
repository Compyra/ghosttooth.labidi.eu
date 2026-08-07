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

   Service hints accept either the 16-bit assigned number ('180d') or a
   full 128-bit proprietary UUID (e.g. Lovense's
   '5a300001-0023-4bd4-bbd5-a6920e4c5653'). App versions before the
   full-UUID lookup shipped ignore full-UUID entries harmlessly.

   Guidance:
     - Prefer NAME patterns; they are far less ambiguous than a bare
       manufacturer ID (see the note in known-devices.js).
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

    // --- Intimate devices ---------------------------------------------------
    // Lovense toys advertise "LVS-<model><version>" (older firmware) or
    // "LOVE-<letters>" (newer). Naming them plainly matters: a device hidden
    // on or near a person should be identifiable for what it is.
    // Source: buttplug.io stpihkal Lovense protocol documentation.
    { pattern: /^(lvs|love)-|lovense/i, category: 'Intimate device' },

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

    // Lovense proprietary advertised services: xxxx0001-002x-4bd4-bbd5-a6920e4c5653,
    // first two bytes = ASCII model code. Covers adverts with no local name.
    // One entry per advertised UUID from the buttplug.io Lovense protocol data.
    { service: '414e0001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Lush Anal
    { service: '42300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Max
    { service: '42410001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Solace Pro
    { service: '43300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Nora
    { service: '43410001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Mission 2
    { service: '43420001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Velvo
    { service: '45410001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Gravity
    { service: '45420001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Hyphy
    { service: '45440001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Gush
    { service: '45460001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' },
    { service: '45490001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Flexer
    { service: '454c0001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Ridge
    { service: '455a0001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Gush 2
    { service: '46300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Sex Machine
    { service: '46530001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Mini Sex Machine
    { service: '48300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Solace
    { service: '4a300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Dolce
    { service: '4c300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Ambi
    { service: '4c410001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' },
    { service: '4e300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Gemini
    { service: '4f300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Osci
    { service: '4f430001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Osci 3
    { service: '50300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Edge
    { service: '50300001-0024-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Edge
    { service: '50300011-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' },
    { service: '51300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Tenera
    { service: '51420001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Loveai Fizz
    { service: '52300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Diamo
    { service: '53300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Lush
    { service: '53440001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Vulse
    { service: '54300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Calor
    { service: '55300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Lapis
    { service: '56300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Mission
    { service: '57300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Domi
    { service: '57440001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Spinel
    { service: '58300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Ferri
    { service: '5a300001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Hush
    { service: '5a300001-0024-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Hush
    { service: '5a410001-0023-4bd4-bbd5-a6920e4c5653', category: 'Intimate device' }, // Synth
];

// Exported for the website's own tooling; the app parses the source text.
if (typeof window !== 'undefined') {
    window.DEVICE_TYPE_PATTERNS = DEVICE_TYPE_PATTERNS;
    window.DEVICE_TYPE_SERVICE_HINTS = DEVICE_TYPE_SERVICE_HINTS;
}
