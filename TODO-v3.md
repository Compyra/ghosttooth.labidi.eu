# TODO v3 — Settings rework, alerts, Help image, media split

Tracking file for the 2026-08 rework. Spans **ghosttooth-apk** and
**ghosttooth.labidi.eu**. Update the checkboxes as work lands; add notes under
each item when reality differs from the plan.

## A. App — main menu (⋮) restructure

- [x] **A1. "View" submenu** holding everything that affects the list view:
      Collapse all, Group by manufacturer, Show stale devices, Order by,
      Refresh rate. Android menus allow only one submenu level, so Order by and
      Refresh rate become single-choice dialogs launched from the View submenu.
- [x] **A2. Menu sections** (with group dividers): top = options
      (Pause, View, Settings) · middle = export options (device list CSV,
      manufacturer summary CSV) · bottom = sources, websites and information
      (Safety guide, Help & FAQ, Website, Privacy policy).
- [x] **A3. Remove "Add device manually"** from the menu → moves to Advanced
      settings (D1).
- [x] **A4. Remove "Refresh reference data"** from the menu — verified it calls
      the exact same `Registry.refreshFromRemote()` as Settings →
      "Check for new definitions". The settings button is the survivor (D2).

## B. App — monitoring toggle

- [x] **B1. Move "Keep monitoring in the background"** master switch from the
      main screen card into Settings (top of the Background monitoring
      section). The main screen keeps the live status line; tapping it opens
      the monitoring settings/troubleshooter as before.

## C. App — definitions auto-check

- [x] **C1. "Auto check daily" toggle** in Advanced settings next to
      "Check for new definitions", **off by default**. When on, the app checks
      online for new definitions at most once per day (on process start).
      Replaces the previous unconditional 12-hour auto-refresh — checking
      online is now opt-in.
- [x] **C2. First-startup notice**: one-time dialog explaining the toggle with
      an "Enable" action and a "Not now" action.

## D. App — Advanced settings additions

- [x] **D1. "Add device manually"** button + dialog (moved from menu).
- [x] **D2. Merged definitions refresh** (already present as
      "Check for new definitions"; menu duplicate removed in A4).
- [x] **D3. Alert categories**: per-category alert switches for every
      `DeviceKind` the app can guess (earbuds … intimate device), matching the
      categories from the website's device-types.js. Default all off. When a
      scanned device's guessed kind is enabled, the app raises a notification
      (own channel, deduped per device).
      Notes: alerts post on the existing alerts channel at DEFAULT priority
      with a "not a threat verdict" line; registry (device-types.js) category
      labels map back to DeviceKind via Classifier.guessAlertKind; enabling any
      category appends HID/Fast-Pair/heart-rate/cycling services to the
      background scan-filter net (threat filters keep priority for the limited
      hardware slots).

## E. App — Help & FAQ image

- [x] **E1. Fix the logo next to the title never loading.** Cause: the FAQ
      HTML is rendered with `loadDataWithBaseURL(null, …)` (deliberate opaque
      origin), so the page's relative `../media/…` image can never resolve.
      Fix: when fetching, inline the image(s) as data: URIs (falls back to
      absolute site URLs), so the cached page is self-contained offline too.

## F. Website — media/ folder split

- [x] **F1. New layout** inside media/:
      `media/js/` (script.js) · `media/css/` (style.css) ·
      `media/identifiers/` (company_identifiers.js, long_company_identifiers.js,
      known-devices.js, device-types.js, registry-index.json) ·
      `media/img/` (icons, mascots, og image, feature graphic, GhostTooth.*,
      screenshots/). css/ is a fourth bucket because a stylesheet is neither
      javascript, identifiers nor an image.
- [x] **F2. Deployed-app compatibility**: every installed app fetches
      `media/<name>.js` + `media/registry-index.json` with digest verification.
      `tools/build-registry-index.py` now treats `media/identifiers/` as
      canonical and writes byte-identical legacy copies + index at the old
      paths. Old installs keep working forever; never hand-edit the legacy
      copies.
- [x] **F3. Update every reference**: index.html, 404.html, faq/, privacy/
      (hand-written), tools/build-site.py + site_content.py (generated pages),
      build-og-image.py, wrap-test-fixture.py, audit-buttplug-registry.py,
      sw.js (precache + version bump), site.webmanifest.
- [x] **F4. Regenerate** generated pages (fr/nl + en safety/terms/accessibility/
      changelog + sitemap) and the registry index; verify with headless-browser
      selftest + a repo-wide grep for dangling `media/<file>` references.
      Verified: registries resolve in-browser, CSS + logo load, legacy paths
      serve 200. Only pre-existing gaps remain (Play screenshots never taken).

## G. App — follow the new website paths

- [x] **G1. Registry fetch paths** switch to `media/identifiers/…` (new
      canonical); digest/index logic unchanged (index keys are bare filenames).
- [x] **G2. Help fix (E1)** uses the new image locations.

## H. Verification

- [x] **H1. App**: `testDebugUnitTest` + `lintRelease` green.
- [x] **H2. Website**: registry selftest in headless Edge; no dangling media
      references; service worker cache version bumped.
- [x] **H3.** Keep this file updated; note surprises inline.

## Done — 2026-08-08

Everything above landed in one pass across both repositories. Surprises worth
recording: the old nested Order-by/Refresh-rate submenus could not survive
inside the View submenu (Android allows one submenu level) and became dialogs;
the unconditional 12-hour definitions auto-refresh became opt-in per C1, which
is a deliberate behaviour change for existing installs (they get the one-time
prompt instead).
