#!/usr/bin/env python3
"""Generate media/registry-index.json.

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

Run this after editing anything in media/ that the app consumes:

    python tools/build-registry-index.py

Consumed by Registry.refreshFromRemote() in the ghosttooth-apk repository.
"""

from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

# Files the Android app fetches. Keys are the bare file names, which is what
# Registry.fileKey() derives from the media/ path.
TRACKED = [
    "company_identifiers.js",
    "long_company_identifiers.js",
    "known-devices.js",
    "device-types.js",
]

ROOT = Path(__file__).resolve().parent.parent
MEDIA = ROOT / "media"
OUTPUT = MEDIA / "registry-index.json"

# Bump when the *shape* of this file changes, not when its contents do.
SCHEMA_VERSION = 1


def main() -> int:
    files: dict[str, dict[str, object]] = {}
    missing: list[str] = []

    for name in TRACKED:
        path = MEDIA / name
        if not path.is_file():
            missing.append(name)
            continue

        data = path.read_bytes()
        # A UTF-8 BOM would be included in the app's decoded string but not in a
        # naive byte hash, so refuse rather than ship a digest that never matches.
        if data.startswith(b"\xef\xbb\xbf"):
            raise SystemExit(f"{name} starts with a UTF-8 BOM; re-save it without one.")

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

    OUTPUT.write_text(json.dumps(index, indent=2) + "\n", encoding="utf-8", newline="\n")

    print(f"wrote {OUTPUT.relative_to(ROOT)}")
    for name, meta in files.items():
        print(f"  {name:<30} {meta['bytes']:>8,} bytes  {meta['sha256'][:16]}…")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
