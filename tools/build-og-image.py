#!/usr/bin/env python3
"""Generate media/og-1200x630.png — the social share card.

Every page references this image in its Open Graph and Twitter Card metadata.
1200x630 is the landscape ratio both Facebook and X crop to; the square icon the
site used before was letterboxed into an ugly pillarboxed card.

Run after changing the mascot or the tagline:

    python tools/build-og-image.py

Requires Pillow:  python -m venv .venv && .venv/Scripts/pip install pillow
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "media" / "og-1200x630.png"
MASCOT = ROOT / "media" / "GhostTooth-mascot-512.png"

W, H = 1200, 630

# Brand palette, kept in step with the site stylesheet in build-site.py.
BG = (11, 13, 26)
GLOW = (143, 184, 255)
GOLD = (227, 196, 106)
INK = (232, 233, 240)
INK_DIM = (167, 173, 201)
BORDER = (42, 49, 87)

TITLE = "GHOSTTOOTH"
TAGLINE = "Find Bluetooth trackers and surveillance devices"
SUB = "Free · No ads · No data collection · Works offline"


def font(names: list[str], size: int) -> ImageFont.FreeTypeFont:
    """First available font from a preference list, else Pillow's default."""
    for name in names:
        for base in (Path("C:/Windows/Fonts"), Path("/usr/share/fonts"), Path("/Library/Fonts")):
            candidate = base / name
            if candidate.is_file():
                return ImageFont.truetype(str(candidate), size)
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default(size)


def main() -> int:
    img = Image.new("RGB", (W, H), BG)

    # Soft radial glow behind the mascot, matching the site's page background.
    glow = Image.new("RGB", (W, H), BG)
    gd = ImageDraw.Draw(glow)
    cx, cy = 250, H // 2
    for radius in range(420, 0, -6):
        t = 1 - radius / 420
        gd.ellipse(
            (cx - radius, cy - radius, cx + radius, cy + radius),
            fill=(
                int(BG[0] + (GLOW[0] - BG[0]) * t * 0.16),
                int(BG[1] + (GLOW[1] - BG[1]) * t * 0.16),
                int(BG[2] + (GLOW[2] - BG[2]) * t * 0.16),
            ),
        )
    img = Image.blend(img, glow, 0.9)
    d = ImageDraw.Draw(img)

    # Mascot, left third.
    if MASCOT.is_file():
        mascot = Image.open(MASCOT).convert("RGBA")
        mascot.thumbnail((360, 360), Image.LANCZOS)
        img.paste(mascot, (cx - mascot.width // 2, cy - mascot.height // 2), mascot)

    x = 520
    f_title = font(["segoeuib.ttf", "DejaVuSans-Bold.ttf", "Arial Bold.ttf"], 76)
    f_tag = font(["segoeui.ttf", "DejaVuSans.ttf", "Arial.ttf"], 34)
    f_sub = font(["segoeui.ttf", "DejaVuSans.ttf", "Arial.ttf"], 25)

    d.text((x, 214), TITLE, font=f_title, fill=GOLD)

    # Tagline, wrapped by hand so the break lands in a sensible place.
    d.text((x, 318), "Find Bluetooth trackers and", font=f_tag, fill=INK)
    d.text((x, 362), "surveillance devices", font=f_tag, fill=INK)

    d.line((x, 424, x + 300, 424), fill=BORDER, width=2)
    d.text((x, 446), SUB, font=f_sub, fill=INK_DIM)
    d.text((x, 486), "ghosttooth.labidi.eu", font=f_sub, fill=GLOW)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, optimize=True)
    print(f"wrote {OUT.relative_to(ROOT)}  {img.width}x{img.height}  {OUT.stat().st_size:,} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
