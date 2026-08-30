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

    // HeyCyan is an SDK/reference platform rather than a brand: a long tail of
    // white-label camera glasses ship on it and advertise its name, including
    // the Nilox Smart AI Glasses sold through ALDI/Hofer. Catching the platform
    // catches every rebrand at once, which is why this is worth more than any
    // single vendor entry.
    { pattern: /heycyan/i, type: 'surveillance', confidence: 'likely', reason: 'HeyCyan-platform smart glasses — this platform is used by camera glasses sold under many different brand names' },
    { pattern: /nilox.?(smart|ai|glass)/i, type: 'surveillance', confidence: 'likely', reason: 'Nilox Smart AI Glasses — built-in camera' },
    { pattern: /rollme.?(vista|view|glass)/i, type: 'surveillance', confidence: 'likely', reason: 'Rollme VistaView smart glasses — built-in camera' },
    { pattern: /rogbird/i, type: 'surveillance', confidence: 'likely', reason: 'Rogbird smart glasses — built-in camera' },
    { pattern: /\bmyvu\b/i, type: 'surveillance', confidence: 'likely', reason: 'Meizu MYVU AR glasses' },
    { pattern: /\bvuzix\b|\bblade\b.?(smart|glass)/i, type: 'surveillance', confidence: 'likely', reason: 'Vuzix smart glasses — built-in camera' },
    { pattern: /\bxreal\b|\bnreal\b/i, type: 'surveillance', confidence: 'possible', reason: 'XREAL display glasses. Most models have no camera — a viewing accessory rather than a recorder' },

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

    // ==========================================================
    // Bluetooth serial bridge modules (the card-skimmer profile)
    //
    // Bluetooth card skimmers are not a product with a brand name.
    // They are a cheap serial-to-Bluetooth module wired to a card
    // reader, and the module almost always keeps its factory name.
    // Bluetana (UCSD/UIUC + US Secret Service, USENIX Security 2019)
    // found that the factory scan profile is the single best signal
    // available to a phone, and Passaro (SANS, 2025) documents the
    // same for the BLE generation built on HM-19 modules.
    //
    // EVERY ENTRY HERE IS 'possible' ON PURPOSE. These exact modules
    // sell by the million for e-bikes, OBD readers, LED strips, 3D
    // printers and school Arduino kits. The name proves a serial
    // bridge, never a crime. 'possible' keeps them out of the
    // headline counts and out of every alert: the app shows the row
    // and explains it, and the user judges the context. A module in
    // a workshop is furniture. The same module inside a fuel pump,
    // ATM or payment terminal is worth reporting to the operator.
    //
    // Classic-Bluetooth-only skimmers (HC-05/HC-06, RNBT-*, MAC
    // prefix 00:06:66) are deliberately absent: they do not
    // advertise over BLE, so no BLE scanner can see them at all.
    // Pretending otherwise would be a false reassurance.
    // ==========================================================
    { pattern: /\bhm.?(10|11|16|17|19)\b/i, type: 'surveillance', confidence: 'possible', reason: 'HM-1x Bluetooth serial bridge — hobby electronics use these constantly, and so do BLE card skimmers' },
    { pattern: /\bdsd.?tech\b/i, type: 'surveillance', confidence: 'possible', reason: 'DSD TECH — factory name of the HM-19 serial bridge documented in SANS skimmer research' },
    { pattern: /\bcc41.?a\b|\bat.?09\b|\bmlt.?bt05\b|\bbt0(4|5).?a?\b/i, type: 'surveillance', confidence: 'possible', reason: 'HM-10 clone serial bridge — sold unbranded, used in DIY projects and in card skimmers' },
    { pattern: /\bjdy.?(08|09|10|23|31|33)\b/i, type: 'surveillance', confidence: 'possible', reason: 'JDY serial bridge module — generic Bluetooth-to-serial hardware' },
    { pattern: /\b(sh.?)?hc.?(08|42)\b/i, type: 'surveillance', confidence: 'possible', reason: 'HC-08/HC-42 BLE serial bridge — generic Bluetooth-to-serial hardware' },
    { pattern: /\bbolutek\b|\bble.?serial\b/i, type: 'surveillance', confidence: 'possible', reason: 'Unconfigured Bluetooth serial bridge advertising its factory name' },
];
