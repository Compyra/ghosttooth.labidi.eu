# TODO in version 2

> ✅ **Version 2 complete** — enchanted grimoire redesign applied and all references consolidated to ghosttooth.

### [DONE] Redesign the website's look and feel (for Claude Opus 4.8)
Think like an experienced, advanced front-end web developer.
Reimagine the entire visual style of this website into a mystical, wizardry, enchanted-castle atmosphere — evoking spellbooks, potions, wands, owls, moving staircases and old-magic academia — without ever literally naming the source of inspiration. Only hint at it through mood, colors, typography and imagery.

Suggestions to guide the styling:
- Use a rich, moody palette: deep midnight blues, emerald greens, aged golds, burgundy reds and parchment tones.
- Pick elegant, slightly antique typography (ornate serif for headings, readable serif/sans for body).
- Add subtle magical touches: glowing accents, candle-like light, floating/shimmer animations, parchment or textured backgrounds.
- Keep it tasteful and subtle — hint, never spell it out.

Make it fully responsive and ensure it works flawlessly on all types of screens (mobile, tablet, desktop and ultra-wide). Use fluid layouts, sensible breakpoints and accessible contrast.

### [DONE] Rename all references to Ghosttooth
Update every reference throughout the codebase to use the name "ghosttooth" (and the domain "ghosttooth.labidi.eu").
Remove any remaining "lebon.it" or other legacy/leftover references so the site is consistently named ghosttooth everywhere.

---

## Scanning reliability & troubleshooting (version 2)

The core scan starts fine, but there are three recurring problems to investigate and fix:

1. **Scanning only works when devices already appear in the browser permission popup.**
   The popup shown in the screenshots is Chrome's `requestLEScan` permission dialog
   ("…wants to scan for nearby Bluetooth devices. The following devices have been found:").
   That preview list is populated by the browser *before* we get control. If devices show
   up there, advertisement events flow afterwards; if the list is empty, we get no events.
2. **Sometimes the popup appears empty and then scanning does nothing.**
3. **Scanning stops after only a few seconds / a handful of devices**, then goes quiet.

### Likely root causes (to confirm)

- **Windows Chromium limitation.** `requestLEScan` / `advertisementreceived` is well known to
  be flaky-to-non-functional on Windows — the code already warns about this in `startScan()`
  and the watchdog. The empty-popup and "stops after a few seconds" symptoms are classic Windows
  Web Bluetooth behavior, not our bug. The reliable path on Windows is the local scanner bridge
  (`bt-bridge.py`). Confirm whether the failing sessions are Web-Bluetooth-only (no bridge running).
- **Empty popup = no advertising devices captured in the pre-scan preview window.** When Chrome
  shows the permission dialog with no entries, no advertisement packets were seen during that
  short window; on Windows the subsequent `advertisementreceived` stream often never starts.
- **Scan auto-stops.** Chromium throttles or tears down BLE scans in the background/after a short
  interval, and the `BluetoothLEScan` object can be garbage-collected if not strongly referenced.
  We keep `activeScan`, but verify it isn't being dropped and that the page isn't being
  backgrounded/throttled (Page Visibility, tab discarding, power saving).

### Ideas & improvements to implement / try

- [x] **Push the local scanner bridge (`bt-bridge.py`) as the primary path on Windows.**
  Implemented: `startScan()` now detects Windows (`isWindows()`) and, when it falls through to
  Web Bluetooth, opens the troubleshooting panel and shows a prominent warning recommending the
  bridge. The panel has a one-click **[ COPY ]** button for `python bt-bridge.py`.
- [x] **Distinguish "no bridge + Windows Web Bluetooth" clearly in the UI.**
  Implemented: diagnostics row shows `MODE = WEB BT (WIN)` vs `BRIDGE (WS/HTTP)`, and a Windows
  warning notice is shown up front.
- [x] **Auto-restart the passive scan.** Implemented: `startScanKeepalive()` checks every
  `SCAN_KEEPALIVE_MS` (4 s) and calls `restartPassiveScan()` when `activeScan.active === false`
  or when packets have been flowing but went quiet for `SCAN_QUIET_RESTART_MS` (7 s). Restarts are
  counted (`RESTARTS` in the diagnostics row) and logged to console. Re-issuing `requestLEScan`
  does NOT re-prompt because permission persists for the session.
- [x] **Handle the empty-popup case explicitly.** Implemented via the escalating watchdog: a gentle
  nudge at 4 s, then at 10 s a clear "permission granted but no advertisements received — use the
  bridge" message plus the auto-opened troubleshooting panel.
- [x] **Keep a strong reference to the scan and re-check `activeScan.active`.** Implemented: the
  keepalive reads `activeScan.active` and the diagnostics row shows `ACTIVE` / `STALLED`.
- [x] **Guard against page throttling.** Implemented: `bindVisibilityHandler()` logs when the tab is
  hidden and restarts the passive scan when it returns to the foreground; the keepalive pauses while
  `document.hidden`.
- [x] **Improve the watchdog.** Implemented: split into `WATCHDOG_FIRST_MS` (4 s, gentle) and
  `WATCHDOG_DELAY_MS` (10 s, escalated → recommend the bridge).
- [x] **Surface scan diagnostics.** Implemented: live `#scan-diag` row shows MODE, PACKETS, UNIQUE,
  LAST PKT (seconds since last packet), SCAN (ACTIVE/STALLED/BRIDGE) and RESTARTS, refreshed once/sec.
- [x] **Add a manual "Troubleshoot" panel.** Implemented: collapsible `#troubleshoot` grimoire with
  ordered steps (bridge, grant permission, experimental flag, OS Bluetooth, HTTPS, add-device,
  diagnostics). Auto-opens when a scan struggles.
- [x] **Log everything to console with timestamps.** Implemented: `btLog()` prints `[ghosttooth HH:MM:SS.mmm]`
  lines for start, permission granted, watchdog, restarts and stop — always on, ready to copy from DevTools.
- [ ] **Consider the `requestDevice` + `watchAdvertisements` fallback per-device** — the existing
  **[ + ADD DEVICE ]** button already covers this; documented in the troubleshooting panel. No further
  work done yet; revisit if users want a "watch several picked devices" flow.

### Follow-up items discovered while implementing (new)

- [ ] **Tune the auto-restart heuristics with real data.** `SCAN_QUIET_RESTART_MS = 7 s` and
  `SCAN_KEEPALIVE_MS = 4 s` are educated guesses. Capture a few real sessions and adjust so we don't
  restart during legitimate quiet periods, and add exponential backoff if restarts never help.
- [ ] **Verify `restartPassiveScan()` doesn't leak or double-count on rapid start/stop.** Manual test:
  spam START/STOP and confirm only one keepalive/diag interval runs and no orphan `advertisementreceived`
  listeners remain.
- [ ] **Confirm behaviour across Chromium browsers** (Chrome, Edge, Brave, Opera) on Android/ChromeOS
  where passive scanning actually works — make sure the Windows-specific messaging only appears on Windows.
- [ ] **Consider a "copy diagnostics" button** that dumps the console log timeline + browser/OS label to
  the clipboard for easy bug reports.
- [ ] **Bridge auto-reconnect.** If the bridge WebSocket drops mid-scan, offer a one-click reconnect
  instead of only showing "BRIDGE LOST".
- [ ] **Clipboard copy needs a secure context.** `copyBridgeCommand()` falls back to selecting the text
  when `navigator.clipboard` is unavailable (e.g. plain HTTP); verify this fallback on an HTTP origin.

### Suggested first troubleshooting step
Reproduce a failing session and capture: OS + Chrome version, whether `bt-bridge.py` was running,
the console log timeline (permission granted → first packet → last packet), and whether
`navigator.bluetooth.requestLEScan` even exists. The new `btLog()` output and the diagnostics row now
make this straightforward. That confirms whether it's the known Windows Web Bluetooth limitation
(→ push the bridge) or a real bug in our scan lifecycle (→ tune the auto-restart).

---

# TODO in version 3
# Do not do the tasks underneath yet

### 1) Create seperate category for gaming or other work related devices 
These could fall under surveillance devices, tracking devices or normal devices.
Some of these are similar to the Quest or Bluetooth speakers.
Create a seperate color for this category.

### 2) Extra information from devices found
When finding devices such as: "0000180f-0000-1000-8000-00805f9b34fb (Battery Service)"
We also want to collect the battery information when available.

Potentially we can do the following too:
0000180a-0000-1000-8000-00805f9b34fb (Device Information)

### 3) Add subcatogories.
Perhaps add these to the side of the screen when the screen width is enough.
These should show "Cars", "Phones", "Car chargers", "shavers", ... when these devices are recognized.
See the ./test.html file for example devices.