#!/usr/bin/env python3
"""Wrap test-found-devices.html into a labelled, non-indexable test page.

WHY A SCRIPT
------------
The fixture is ~11 MB of raw device-list markup with no <head>, no <body> and no
doctype — it was captured straight out of the DOM. Rewriting it through an
editor risks re-encoding 11 MB of UTF-8, so this splices a header and footer
around the existing bytes and leaves the payload untouched.

Idempotent: running it twice does nothing the second time.

    python tools/wrap-test-fixture.py
"""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "test-found-devices.html"
MARKER = b"<!-- ghosttooth:test-fixture -->"

HEADER = """<!DOCTYPE html>
<!-- ghosttooth:test-fixture -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="color-scheme" content="dark light">

<!-- NOT USER-FACING. This page is a development fixture and must never appear
     in search results or be linked from navigation. Also blocked in robots.txt. -->
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="googlebot" content="noindex, nofollow">

<title>[TEST FIXTURE] Mock device list — GHOSTTOOTH</title>
<link rel="stylesheet" href="/media/css/style.css">
<style>
  .fixture-note {
    max-width: 900px; margin: 20px auto; padding: 18px 22px;
    border: 2px solid #f5b942; border-radius: 12px;
    background: #2a220c; color: #f4e6c0;
    font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
    font-size: 15px; line-height: 1.6;
  }
  .fixture-note h1 { margin: 0 0 10px; font-size: 20px; color: #f5b942; letter-spacing: .06em; }
  .fixture-note code { background: #000000055; padding: 1px 5px; border-radius: 4px; }
  .fixture-note a { color: #8fb8ff; }
  .fixture-note ul { margin: 8px 0; padding-left: 20px; }
</style>
</head>
<body class="terminal-bg">

<div class="fixture-note">
  <h1>&#9888; TEST PAGE &mdash; NOT REAL DATA</h1>
  <p>
    This is an <strong>internal development fixture</strong>, not part of the
    GHOSTTOOTH website. Everything below is a <strong>frozen snapshot of mock
    devices</strong> captured from a scan session and saved as static markup.
    <strong>None of these devices exist</strong>, none of them are near you, and
    nothing on this page is scanning anything. The MAC addresses, names, signal
    strengths and threat badges are all inert test data.
  </p>
  <p>It exists so the layout can be checked without a live Bluetooth radio &mdash; useful for:</p>
  <ul>
    <li>rendering a long list (several hundred cards) and checking scroll performance;</li>
    <li>testing filters, sorting, grouping and the search box against a fixed dataset;</li>
    <li>checking the <code>NORMAL</code> / <code>TRACKER</code> / <code>SURVEILLANCE</code>
        badge styling, including the confidence tiers;</li>
    <li>eyeballing CSS changes on a realistic page without waiting for devices to appear;</li>
    <li>reproducing layout bugs reported against a specific device shape.</li>
  </ul>
  <p>
    It is excluded from <code>sitemap.xml</code>, blocked in <code>robots.txt</code>,
    and marked <code>noindex</code>. It is safe to delete once it stops being
    useful &mdash; nothing links to it.
  </p>
  <p>
    &#8592; <a href="/">Back to the real GHOSTTOOTH scanner</a>
  </p>
</div>

"""

FOOTER = """

<div class="fixture-note">
  <p>
    &#9888; End of test fixture. Everything above is mock data.
    &#8592; <a href="/">Back to the real GHOSTTOOTH scanner</a>
  </p>
</div>

</body>
</html>
"""


def main() -> int:
    if not TARGET.is_file():
        print(f"nothing to do: {TARGET.name} not found")
        return 0

    payload = TARGET.read_bytes()
    if MARKER in payload[:400]:
        print(f"{TARGET.name} already wrapped — no change")
        return 0

    TARGET.write_bytes(
        HEADER.encode("utf-8") + payload + FOOTER.encode("utf-8")
    )
    print(
        f"wrapped {TARGET.name}: {len(payload):,} -> {TARGET.stat().st_size:,} bytes"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
