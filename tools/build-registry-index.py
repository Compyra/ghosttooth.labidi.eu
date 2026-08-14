#!/usr/bin/env python3
"""Generate the registry index and the legacy-path registry copies.

WHY THIS EXISTS
---------------
The Android app used to re-download every registry file on a fixed 12-hour
timer: roughly 170 KB per install, per refresh, whether or not anything had
changed. It also had no way to tell a truncated download from a good one — and a
half-written registry is a silent detection outage, which is the worst possible
failure mode for a detector.

The index fixes both. It is tiny, so the app fetches it first, compares each
SHA-256 against its cached copy, and only downloads what actually changed. The
same digest then verifies the download, so a truncated or tampered file is
discarded rather than parsed.

LAYOUT (since the 2026-08 media split)
--------------------------------------
Canonical registry sources live in media/identifiers/. Every deployed app
version before the split fetches the OLD paths (media/<name> and
media/registry-index.json), so this script also writes byte-identical legacy
copies there. Never hand-edit the legacy copies — edit media/identifiers/ and
re-run:

    python tools/build-registry-index.py

Consumed by Registry.refreshFromRemote() in the ghosttooth-apk repository.
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

# Files the Android app fetches. Keys are the bare file names, which is what
# Registry.fileKey() derives from the media path.
TRACKED = [
    "company_identifiers.js",
    "long_company_identifiers.js",
    "known-devices.js",
    "device-types.js",
    "oui.js",
]

# Files added after the media split. No released app version fetches the legacy
# path for these, so a second 1.7 MB copy in media/ would be dead weight.
LEGACY_EXEMPT = {"oui.js"}

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "media"
CANONICAL = MEDIA / "identifiers"
OUTPUT = CANONICAL / "registry-index.json"
# Pre-split app versions fetch these; kept in lockstep by this script.
LEGACY_DIR = MEDIA
LEGACY_OUTPUT = MEDIA / "registry-index.json"

# Bump when the *shape* of this file changes, not when its contents do.
SCHEMA_VERSION = 1


def main() -> int:
    files: dict[str, dict[str, object]] = {}
    missing: list[str] = []

    for name in TRACKED:
        path = CANONICAL / name
        if not path.is_file():
            missing.append(name)
            continue

        data = path.read_bytes()
        # A UTF-8 BOM would be included in the app's decoded string but not in a
        # naive byte hash, so refuse rather than ship a digest that never matches.
        if data.startswith(b"\xef\xbb\xbf"):
            raise SystemExit(f"{name} starts with a UTF-8 BOM; re-save it without one.")

        # Hash what GitHub Pages will actually serve: the committed blob, which
        # git normalises to LF. On a Windows checkout (core.autocrlf=true) the
        # working tree is CRLF, and hashing it raw published digests that never
        # matched the served bytes — every app refresh failed its integrity check.
        data = data.replace(b"\r\n", b"\n")

        # Legacy copy for pre-split app versions, byte-identical to canonical.
        if name not in LEGACY_EXEMPT:
            legacy = LEGACY_DIR / name
            if not legacy.is_file() or legacy.read_bytes().replace(b"\r\n", b"\n") != data:
                legacy.write_bytes(data)

        files[name] = {
            "sha256": hashlib.sha256(data).hexdigest(),
            "bytes": len(data),
        }

    if missing:
        raise SystemExit("missing registry file(s): " + ", ".join(missing))

    index = {
        "version": SCHEMA_VERSION,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "files": files,
    }

    payload = json.dumps(index, indent=2) + "\n"
    OUTPUT.write_text(payload, encoding="utf-8", newline="\n")
    LEGACY_OUTPUT.write_text(payload, encoding="utf-8", newline="\n")

    print(f"wrote {OUTPUT.relative_to(ROOT)} (+ legacy copies in media/)")
    for name, meta in files.items():
        print(f"  {name:<30} {meta['bytes']:>8,} bytes  {meta['sha256'][:16]}…")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
