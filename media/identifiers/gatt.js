// GATT display data for the GhostTooth app: appearance-category names,
// characteristic names shown in the probe's vendor-service fingerprints, and
// plain-language notes for services worth explaining.
//
// Names are verified against the Bluetooth SIG assigned-numbers documents
// (service/characteristic UUID YAMLs and the appearance values list) before
// being added. Notes are curated English free text; the app keeps its own
// localised notes for the entries it ships with and uses these for everything
// discovered later, so identifications reach users without an app release.
//
// Byte-level decoding (System ID layout, temperature units, sentinels) is NOT
// data and does not belong here: those are Bluetooth SIG specification
// structures, implemented and unit-tested in the app (ble/GattValues.kt).
//
// One entry per line — the app parses this file line by line.

const GHOSTTOOTH_GATT_APPEARANCE = [
    [0, "Unknown"],
    [1, "Phone"],
    [2, "Computer"],
    [3, "Watch"],
    [4, "Clock"],
    [5, "Display"],
    [6, "Remote control"],
    [7, "Glasses"],
    [8, "Tag"],
    [9, "Keyring"],
    [10, "Media player"],
    [11, "Barcode scanner"],
    [12, "Thermometer"],
    [13, "Heart-rate sensor"],
    [14, "Blood-pressure monitor"],
    [15, "Keyboard/mouse (HID)"],
    [16, "Glucose meter"],
    [17, "Running/walking sensor"],
    [18, "Cycling sensor"],
    [19, "Control device"],
    [20, "Network device"],
    [21, "Sensor"],
    [22, "Light fixture"],
    [23, "Fan"],
    [24, "HVAC"],
    [25, "Air conditioning"],
    [26, "Humidifier"],
    [27, "Heating"],
    [28, "Access control"],
    [29, "Motorised device"],
    [30, "Power device"],
    [31, "Light source"],
    [32, "Window covering"],
    [33, "Speaker"],
    [34, "Audio source"],
    [35, "Motorised vehicle"],
    [36, "Domestic appliance"],
    [37, "Wearable audio"],
    [38, "Aircraft"],
    [39, "AV equipment"],
    [40, "Display equipment"],
    [41, "Hearing aid"],
    [42, "Gaming device"],
    [43, "Signage"],
    [49, "Pulse oximeter"],
    [50, "Weight scale"],
    [51, "Personal mobility device"],
    [52, "Glucose monitor"],
    [53, "Insulin pump"],
    [54, "Medication delivery"],
    [55, "Spirometer"],
    [81, "Outdoor sports device"],
];

const GHOSTTOOTH_GATT_CHARACTERISTICS = [
    ["2a00", "Device Name"],
    ["2a01", "Appearance"],
    ["2a04", "Preferred Connection Parameters"],
    ["2a05", "Service Changed"],
    ["2a07", "Tx Power Level"],
    ["2a19", "Battery Level"],
    ["2a23", "System ID"],
    ["2a24", "Model Number"],
    ["2a25", "Serial Number"],
    ["2a26", "Firmware Revision"],
    ["2a27", "Hardware Revision"],
    ["2a28", "Software Revision"],
    ["2a29", "Manufacturer Name"],
    ["2a2a", "IEEE Regulatory Certification"],
    ["2a2b", "Current Time"],
    ["2a37", "Heart Rate Measurement"],
    ["2a38", "Body Sensor Location"],
    ["2a3f", "Alert Status"],
    ["2a4a", "HID Information"],
    ["2a4b", "HID Report Map"],
    ["2a4d", "HID Report"],
    ["2a50", "PnP ID"],
    ["2a63", "Cycling Power Measurement"],
    ["2a6d", "Pressure"],
    ["2a6e", "Temperature"],
    ["2a6f", "Humidity"],
    ["2aa6", "Central Address Resolution"],
    ["2acc", "Fitness Machine Feature"],
    ["2b29", "Client Supported Features"],
    ["2b2a", "Database Hash"],
    ["2b3a", "Server Supported Features"],
];

const GHOSTTOOTH_GATT_NOTES = [
    ["0000fe59-0000-1000-8000-00805f9b34fb", "This device can be reprogrammed over the air (Nordic DFU)."],
    ["00001812-0000-1000-8000-00805f9b34fb", "Acts as an input device (keyboard/mouse); can inject keystrokes when paired."],
    ["00001819-0000-1000-8000-00805f9b34fb", "Exposes location and navigation data."],
    ["0000feaa-0000-1000-8000-00805f9b34fb", "Broadcasts beacon frames that apps can use for presence detection."],
];
