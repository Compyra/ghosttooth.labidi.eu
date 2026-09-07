# ghosttooth.labidi.eu

Website and detection-definition host for **GhostTooth**, the Android app that
finds Bluetooth trackers and surveillance devices around you — free, no ads,
and nothing ever leaves your phone.

**Get the app:** <https://play.google.com/store/apps/details?id=com.compyra.ghosttooth>

## What lives here

- The public site (EN/FR/NL): landing, help & FAQ, safety guide, privacy,
  terms, accessibility and changelog. Localised pages are **generated** — edit
  `tools/site_content.py` and run `python tools/build-site.py`; never edit the
  generated `index.html` files by hand.
- `media/identifiers/` — the detection registries every installed app
  refreshes from (company identifiers, known devices, device types, GATT
  display data). `tools/build-registry-index.py` hashes them and maintains the
  digest index plus the byte-identical legacy copies at `media/*.js` that
  older installs fetch; never hand-edit or delete those.

A Pro edition of the app is on its way for everyone who wants to support the
project; the free app stays free.
