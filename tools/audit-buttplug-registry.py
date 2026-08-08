#!/usr/bin/env python3
"""One-shot audit: buttplug.io device-config vs GhostTooth registries.

Downloads every protocol YAML from buttplugio/buttplug (the successor to the
metafetish buttplug-csharp / buttplug-js / lovesense-* repos, whose device
data was folded into this one config tree), extracts the BLE identification
data (names, advertised service UUIDs), and reports what the GhostTooth
registries do not yet recognise. Read-only: writes nothing but a report.
"""

from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

API = "https://api.github.com/repos/buttplugio/buttplug/contents/crates/buttplug_server_device_config/device-config/protocols"
RAW = "https://raw.githubusercontent.com/buttplugio/buttplug/master/crates/buttplug_server_device_config/device-config/protocols/"

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tools" / "buttplug-audit.json"

# Non-BLE or non-toy configs: skip.
SKIP = {"xinput.yml", "simulated.yml", "nintendo-joycon.yml", "rez-trancevibrator.yml", "nextlevelracing.yml"}

# Generic transport services shared by thousands of unrelated products.
# Never usable as toy identification on their own.
GENERIC_SERVICES = {
    "6e400001-b5a3-f393-e0a9-e50e24dcca9e",  # Nordic UART
    "0000fff0-0000-1000-8000-00805f9b34fb",  # ISSC transparent
    "0000ffe0-0000-1000-8000-00805f9b34fb",  # HM-10 UART
    "0000ffb0-0000-1000-8000-00805f9b34fb",
    "0000fe00-0000-1000-8000-00805f9b34fb",
    "49535343-fe7d-4ae5-8fa9-9fafd205e455",  # ISSC proprietary (Microchip)
    "0000180a-0000-1000-8000-00805f9b34fb",  # Device Information
    "00001800-0000-1000-8000-00805f9b34fb",
    "00001801-0000-1000-8000-00805f9b34fb",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "ghosttooth-registry-audit"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main() -> int:
    listing = json.loads(fetch(API))
    files = [e["name"] for e in listing if e["name"].endswith(".yml") and e["name"] not in SKIP]
    print(f"protocols: {len(files)}")

    per_proto: dict[str, dict[str, list[str]]] = {}
    for name in sorted(files):
        text = fetch(RAW + name).decode("utf-8", "replace")
        # Only the identification part matters: the btle communication block.
        m = re.search(r"^communication:\s*$(.*)", text, re.M | re.S)
        block = m.group(1) if m else text
        names = re.findall(r"^\s*-\s*([A-Za-z0-9 ._\'&+()\[\]*-]+?)\s*$", block, re.M)
        # names list: lines under "names:" — refine by scanning explicitly.
        names = []
        nm = re.search(r"^\s*names:\s*$(.*?)(?=^\s*(?:advertised_services|services|manufacturer_data|characteristics)\s*:|\Z)", block, re.M | re.S)
        if nm:
            names = [x.strip().strip("'\"") for x in re.findall(r"^\s*-\s*(.+?)\s*$", nm.group(1), re.M)]
        adv = []
        am = re.search(r"^\s*advertised_services:\s*$(.*?)(?=^\s*services\s*:|\Z)", block, re.M | re.S)
        if am:
            adv = [x.strip().strip("'\"").lower() for x in re.findall(r"^\s*-\s*([0-9a-fA-F-]{4,36})\s*$", am.group(1), re.M)]
        svc = [s.lower() for s in re.findall(r"^      ([0-9a-fA-F-]{36}):\s*$", block, re.M)]
        per_proto[name[:-4]] = {"names": names, "advertised": adv, "services": svc}

    # --- our registries ---------------------------------------------------
    dt = (ROOT / "media" / "device-types.js").read_text(encoding="utf-8")
    lc = (ROOT / "media" / "long_company_identifiers.js").read_text(encoding="utf-8")
    our_hints = {m.group(1).lower() for m in re.finditer(r"\{ service: '([0-9a-fx-]+)'", dt)}
    our_named = {m.group(1).lower() for m in re.finditer(r'\["([0-9a-f-]{36})"', lc)}
    our_patterns = [re.compile(m.group(1), re.I) for m in re.finditer(r"\{ pattern: /(.+?)/i?, category: 'Intimate device' \}", dt)]

    def hinted(uuid: str) -> bool:
        # The app normalizes 0000xxxx-…-00805f9b34fb to its 16-bit form.
        if uuid in our_hints:
            return True
        return uuid.startswith("0000") and uuid.endswith("-0000-1000-8000-00805f9b34fb") and uuid[4:8] in our_hints

    report = {"missing_names": {}, "missing_advertised": {}, "generic_only": []}
    for proto, d in sorted(per_proto.items()):
        unmatched = [n for n in d["names"] if n and not any(p.search(n.replace("*", "x")) for p in our_patterns)]
        adv_specific = [u for u in d["advertised"] if u not in GENERIC_SERVICES]
        missing_adv = [u for u in adv_specific if not hinted(u)]
        if unmatched:
            report["missing_names"][proto] = unmatched
        if missing_adv:
            report["missing_advertised"][proto] = missing_adv
        if not d["names"] and not adv_specific:
            report["generic_only"].append(proto)

    OUT.write_text(json.dumps({"protocols": per_proto, "report": report}, indent=1), encoding="utf-8")
    print(f"\nprotocols with names our patterns MISS: {len(report['missing_names'])}")
    for proto, names in report["missing_names"].items():
        print(f"  {proto}: {names[:12]}{' ...' if len(names) > 12 else ''}")
    print(f"\nprotocols with specific advertised services we lack: {len(report['missing_advertised'])}")
    for proto, uuids in report["missing_advertised"].items():
        print(f"  {proto}: {uuids[:6]}{' ...' if len(uuids) > 6 else ''}")
    print(f"\nidentifiable only via generic transport services (no entry possible): {report['generic_only']}")
    print(f"\nfull dump: {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
