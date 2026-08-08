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
    // Naming these plainly matters: a device hidden on or near a person
    // should be identifiable for what it is.
    // Sources: buttplug.io stpihkal protocol docs + the buttplugio/buttplug
    // device-config tree (successor to the metafetish buttplug-csharp /
    // buttplug-js / lovesense-* repos). Only brand-anchored tokens are used;
    // generic model words ("Classic", "Nova", "Boost", "M2") are deliberately
    // skipped — a false positive here is worse than a miss.
    // Lovense: "LVS-<model><version>" (older firmware), "LOVE-<letters>" (newer).
    { pattern: /^(lvs|love)-|lovense/i, category: 'Intimate device' },
    { pattern: /kiiroo|ohmibod|fleshlight|\bkeon\b|\bcliona\b|onyx\s?2|pearl\s?[23]/i, category: 'Intimate device' },
    { pattern: /we-?vibe|\bskeena\b/i, category: 'Intimate device' },
    { pattern: /\blelo\b|\bf1sv\d|tiani.?(harmony|twist)|ida.?wave|double.?sonic|\bhugo2\b|\bgigi3\b|\bsona3\b|\btor3\b/i, category: 'Intimate device' },
    { pattern: /satisfyer|^sf\s/i, category: 'Intimate device' },
    { pattern: /magic.?motion|\bgballs?\d\b|\bfugu2?\b|smart.?mini.?vibe|smart.?bean|\bkrush\b/i, category: 'Intimate device' },
    { pattern: /mysteryvibe|\bmv\s(crescendo|tenuto|poco)\b/i, category: 'Intimate device' },
    { pattern: /svakom|\b(sam|alex|emma|phoenix|vick|iker|mora|trysta|ava|hannes)\sneo\b/i, category: 'Intimate device' },
    { pattern: /hismith|auxfun|sinloli|wildolo|pleasuredrive|eropair/i, category: 'Intimate device' },
    { pattern: /\bthe\shandy\b|^ohd_hw\d/i, category: 'Intimate device' },
    { pattern: /vorze|\bufosa\b|\bcycsa\b|bach\ssmart|\bomorfi\b/i, category: 'Intimate device' },
    { pattern: /vibratissimo|monsterpub|monsterhub|tracydog|picobong|motorbunny|jejoue|je\sjoue|youcups|\bwetoy\b|utimi|sakuraneko|love.?nuts|twerking.?butt/i, category: 'Intimate device' },
    { pattern: /^zalo-|^tf-(bhplus|rock|meta|spray|one)|tryfun|pink.?punch|_vibio$|^xxd-|^tklm-|^meese-|sayberx|\bkgoal\b|\blioness2?\b|adrien.?lastic/i, category: 'Intimate device' },

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

    // Adrien Lastic toys advertise this unassigned SIG-base service.
    { service: '1320', category: 'Intimate device' },

    // Proprietary services of other toy brands (from the buttplug.io device
    // configs). Mostly seen via GATT discovery rather than advertisements.
    // Deliberately absent: Nordic-example/squatted UUIDs shared by unrelated
    // hobbyist hardware (00001523-1212-efde… "LED Button Service", 0xae00,
    // 0x6000, 0xffe0/fff0 UART clones) — they would mislabel innocent devices.
    { service: 'f000bb03-0451-4000-b000-000000000000', category: 'Intimate device' }, // We-Vibe
    { service: '88f80580-0000-01e6-aace-0002a5d5c51b', category: 'Intimate device' }, // Kiiroo v2
    { service: '88f82580-0000-01e6-aace-0002a5d5c51b', category: 'Intimate device' }, // Kiiroo v2 vibrator
    { service: 'f60402a6-0293-4bdb-9f20-6758133f7090', category: 'Intimate device' }, // Kiiroo v2 sensor
    { service: 'a0d70001-4c16-4ba7-977a-d394920e13a3', category: 'Intimate device' }, // Kiiroo v2.1 / OhMiBod
    { service: '51361500-c5e7-47c7-8a6e-47ebc99d80e8', category: 'Intimate device' }, // Satisfyer
    { service: '78667579-7b48-43db-b8c5-7928a6b0a335', category: 'Intimate device' }, // Magic Motion
    { service: 'f0006900-110c-478b-b74b-6f403b364a9c', category: 'Intimate device' }, // MysteryVibe
    { service: '1775244d-6b43-439b-877c-060f2d9bed07', category: 'Intimate device' }, // The Handy
    { service: '77834d26-40f7-11ee-be56-0242ac120002', category: 'Intimate device' }, // The Handy v3
    { service: '40ee1111-63ec-4b7f-8ce7-712efd55b90e', category: 'Intimate device' }, // Vorze
    { service: '8e7c6065-7656-17ad-1b41-b53d1a548e0d', category: 'Intimate device' }, // kGoal Boost
    { service: '53300021-0050-4bd4-bbe5-a6920e4c5663', category: 'Intimate device' }, // Vibio

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
