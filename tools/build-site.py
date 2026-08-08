#!/usr/bin/env python3
"""Static page generator for ghosttooth.labidi.eu.

WHY A GENERATOR
---------------
The app ships in English, French and Dutch. The site did not, which meant a
Dutch or French user got a localised app and an English help page — landing on
English exactly when they were most confused. Hand-maintaining three copies of
every page guarantees they drift apart, so the copy lives in `site_content.py`
and this script renders it into standalone, offline-safe HTML.

Every generated page keeps the conventions of the hand-written pages:
  * one file, no external CSS/JS/fonts/CDN, so it works offline and leaks nothing
  * full canonical / Open Graph / Twitter / JSON-LD metadata
  * hreflang alternates between the three languages
  * dark-first with a light-mode fallback, safe-area aware

Run after editing site_content.py:

    python tools/build-site.py
"""

from __future__ import annotations

import html
import shutil
from pathlib import Path

from site_content import (
    BASE_URL,
    LANGS,
    NAV,
    PAGES,
    SUPPORT_EMAIL,
    UI,
    UPDATED,
)

ROOT = Path(__file__).resolve().parent.parent

# ---------------------------------------------------------------------------
# Shared stylesheet. Inlined into every page: the site promises no third-party
# requests, and an offline reader must still get a legible page.
# ---------------------------------------------------------------------------
CSS = """
  :root {
    --bg: #0b0d1a; --bg-2: #12152a; --surface: #161a30; --surface-2: #1d2340;
    --border: #2a3157; --ink: #e8e9f0; --ink-dim: #a7adc9; --ink-faint: #7b81a3;
    --gold: #e3c46a; --gold-soft: #f0d98f; --accent: #8fb8ff;
    --danger: #ff5a6e; --warn: #f5b942; --ok: #5fd3a6;
    --radius: 14px; --radius-sm: 10px; --maxw: 860px;
    --shadow: 0 6px 24px rgba(0,0,0,.35);
    --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    --mono: ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, Consolas, monospace;
  }
  @media (prefers-color-scheme: light) {
    :root {
      --bg: #f4f5fb; --bg-2: #eaecf6; --surface: #ffffff; --surface-2: #f0f2fb;
      --border: #d6d9ec; --ink: #191c2c; --ink-dim: #4a5170; --ink-faint: #6b7290;
      --gold: #9a7b16; --gold-soft: #7d6410; --accent: #2f5fd0;
      --danger: #c62839; --warn: #a5720a; --ok: #1f8f63;
      --shadow: 0 6px 24px rgba(20,25,60,.10);
    }
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: radial-gradient(1200px 600px at 50% -10%, rgba(143,184,255,.08), transparent 60%), var(--bg);
    color: var(--ink); font-family: var(--font); font-size: 17px; line-height: 1.65;
    padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  }
  .wrap { max-width: var(--maxw); margin: 0 auto; padding: clamp(16px,4vw,40px) clamp(16px,5vw,32px) 64px; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 6px; }
  .skip {
    position: absolute; left: -9999px; top: 0; background: var(--surface);
    color: var(--ink); padding: 10px 16px; border-radius: var(--radius-sm); z-index: 10;
  }
  .skip:focus { left: 12px; top: 12px; }
  header.site { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
  header.site img { width: 44px; height: 44px; border-radius: 10px; }
  .brand { font-family: var(--mono); font-weight: 700; letter-spacing: .12em; color: var(--gold); font-size: 15px; }
  nav.langs { margin-left: auto; display: flex; gap: 6px; font-size: 13px; font-family: var(--mono); }
  nav.langs a, nav.langs span {
    padding: 6px 10px; border-radius: 8px; border: 1px solid var(--border);
    min-height: 32px; display: inline-flex; align-items: center;
  }
  nav.langs [aria-current="true"] { background: var(--surface-2); color: var(--gold); border-color: var(--gold); }
  h1 { font-size: clamp(26px, 5vw, 36px); line-height: 1.2; margin: 18px 0 6px; color: var(--gold); }
  h2 { font-size: clamp(20px, 3.5vw, 24px); margin: 36px 0 8px; color: var(--gold-soft); }
  h3 { font-size: 18px; margin: 24px 0 6px; color: var(--ink); }
  p { margin: 10px 0; }
  ul, ol { margin: 10px 0; padding-left: 22px; }
  li { margin: 6px 0; }
  .lede { color: var(--ink-dim); font-size: 18px; }
  .updated { color: var(--ink-faint); font-size: 13px; font-family: var(--mono); }
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
    padding: clamp(14px, 3vw, 20px); margin: 18px 0; box-shadow: var(--shadow);
  }
  .card.warn { border-color: var(--warn); }
  .card.danger { border-color: var(--danger); }
  .card.ok { border-color: var(--ok); }
  .card h2, .card h3 { margin-top: 0; }
  .step { counter-increment: step; }
  .step h2::before { content: counter(step) ". "; color: var(--gold); }
  main { counter-reset: step; }
  .btnrow { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0; }
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    min-height: 48px; padding: 12px 20px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--surface-2); color: var(--ink);
    font-weight: 600; font-size: 15px;
  }
  .btn:hover { text-decoration: none; border-color: var(--accent); }
  .btn.primary { background: var(--gold); color: #191c2c; border-color: var(--gold); }
  .btn.primary:hover { background: var(--gold-soft); }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 15px; }
  th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); vertical-align: top; }
  th { color: var(--gold-soft); font-weight: 600; }
  code { font-family: var(--mono); font-size: .92em; background: var(--surface-2); padding: 2px 6px; border-radius: 6px; }
  .shots { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; margin: 18px 0; }
  .shots figure { margin: 0; }
  .shots img {
    width: 100%; height: auto; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--surface-2); display: block;
  }
  .shots figcaption { color: var(--ink-faint); font-size: 13px; margin-top: 6px; }
  footer.site {
    margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border);
    color: var(--ink-faint); font-size: 14px;
  }
  footer.site nav { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 10px; }
  .visually-hidden {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip: rect(0 0 0 0); white-space: nowrap;
  }
"""


# Screenshot sources referenced by the content but absent from the tree. Collected
# during rendering and reported once at the end, so a missing asset is loud in
# the build log but never reaches a visitor as a broken image.
MISSING_SHOTS: set[str] = set()


def esc(text: str) -> str:
    return html.escape(text, quote=True)


def page_url(lang: str, slug: str) -> str:
    """Canonical URL for a page. English lives at the root, others under /xx/."""
    prefix = "" if lang == "en" else f"{lang}/"
    return f"{BASE_URL}{prefix}{slug}/" if slug else f"{BASE_URL}{prefix}"


def page_path(lang: str, slug: str) -> Path:
    parts = [] if lang == "en" else [lang]
    if slug:
        parts.append(slug)
    return ROOT.joinpath(*parts, "index.html")


def rel_root(lang: str, slug: str) -> str:
    """Relative path back to the site root from a generated page."""
    depth = (0 if lang == "en" else 1) + (1 if slug else 0)
    return "../" * depth if depth else "./"


def render_blocks(blocks: list[dict], root: str) -> str:
    """Render the content blocks of a page into HTML.

    `{root}` in any string is the relative path back to the site root. It is
    substituted everywhere, not just in link blocks: prose regularly contains
    inline links, and a missed substitution ships a literally broken href.
    """

    def sub(text: str) -> str:
        return text.replace("{root}", root)

    out: list[str] = []
    for block in blocks:
        kind = block["type"]

        if kind == "p":
            out.append(f'<p>{sub(block["text"])}</p>')
        elif kind == "lede":
            out.append(f'<p class="lede">{sub(block["text"])}</p>')
        elif kind == "h2":
            out.append(f'<h2>{esc(block["text"])}</h2>')
        elif kind == "h3":
            out.append(f'<h3>{esc(block["text"])}</h3>')
        elif kind == "step":
            out.append(
                f'<section class="step"><h2>{esc(block["title"])}</h2>'
                f'<p>{sub(block["text"])}</p></section>'
            )
        elif kind == "card":
            variant = block.get("variant", "")
            title = f'<h3>{esc(block["title"])}</h3>' if block.get("title") else ""
            out.append(f'<div class="card {variant}">{title}<p>{sub(block["text"])}</p></div>')
        elif kind == "ul":
            items = "".join(f"<li>{sub(item)}</li>" for item in block["items"])
            out.append(f"<ul>{items}</ul>")
        elif kind == "ol":
            items = "".join(f"<li>{sub(item)}</li>" for item in block["items"])
            out.append(f"<ol>{items}</ol>")
        elif kind == "table":
            head = "".join(f"<th scope=\"col\">{esc(h)}</th>" for h in block["head"])
            rows = "".join(
                "<tr>" + "".join(f"<td>{sub(cell)}</td>" for cell in row) + "</tr>"
                for row in block["rows"]
            )
            out.append(f"<table><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>")
        elif kind == "buttons":
            links = "".join(
                '<a class="btn {cls}" href="{href}"{attrs}>{label}</a>'.format(
                    cls="primary" if b.get("primary") else "",
                    href=b["href"].replace("{root}", root),
                    attrs=' target="_blank" rel="noopener"' if b.get("external") else "",
                    label=esc(b["label"]),
                )
                for b in block["items"]
            )
            out.append(f'<div class="btnrow">{links}</div>')
        elif kind == "shots":
            # Only render the gallery when every image actually exists. A missing
            # screenshot would otherwise ship as a broken image on the landing
            # page, which is worse than no gallery at all. See
            # media/img/screenshots/README.md for the expected filenames.
            present = [s for s in block["items"] if (ROOT / s["src"]).is_file()]
            if len(present) != len(block["items"]):
                MISSING_SHOTS.update(
                    s["src"] for s in block["items"] if not (ROOT / s["src"]).is_file()
                )
                continue
            figures = "".join(
                '<figure><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy">'
                '<figcaption>{cap}</figcaption></figure>'.format(
                    src=root + s["src"], alt=esc(s["alt"]), cap=esc(s["caption"]),
                    w=s.get("width", 1080), h=s.get("height", 2280),
                )
                for s in present
            )
            out.append(f'<div class="shots">{figures}</div>')
        elif kind == "html":
            out.append(block["html"].replace("{root}", root))
        else:  # pragma: no cover - guards a typo in the content file
            raise SystemExit(f"unknown block type: {kind}")
    return "\n".join(out)


def render_page(lang: str, slug: str, page: dict) -> str:
    meta = page["langs"][lang]
    root = rel_root(lang, slug)
    url = page_url(lang, slug)

    # Languages this page is reachable in. The English landing page, FAQ and
    # privacy policy are hand-written files this generator does not produce, so
    # they are absent from page["langs"] — but they exist, and a French reader
    # must still be able to switch to English. Without this the generated pages
    # offered FR/NL only and stranded anyone who wanted English.
    available = [c for c in LANGS if c in page["langs"] or (c == "en" and slug in HANDWRITTEN_EN)]

    alternates = "\n".join(
        f'<link rel="alternate" hreflang="{code}" href="{page_url(code, slug)}">'
        for code in available
    )
    alternates += f'\n<link rel="alternate" hreflang="x-default" href="{page_url("en", slug)}">'

    lang_nav = "".join(
        (
            f'<span aria-current="true" lang="{code}">{LANGS[code]["short"]}</span>'
            if code == lang
            else f'<a href="{page_url(code, slug)}" lang="{code}" '
                 f'hreflang="{code}">{LANGS[code]["short"]}</a>'
        )
        for code in available
    )

    nav_links = "".join(
        f'<a href="{page_url(lang, item["slug"]) if item["slug"] in ALL_SLUGS_FOR[lang] else page_url("en", item["slug"])}">'
        f'{esc(NAV[lang][item["key"]])}</a>'
        for item in NAV["_order"]
    )

    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "GHOSTTOOTH", "item": page_url(lang, "")},
            {"@type": "ListItem", "position": 2, "name": meta["title"], "item": url},
        ],
    }
    import json as _json

    jsonld = _json.dumps(breadcrumb, ensure_ascii=False, indent=2)
    extra_jsonld = page.get("jsonld_builder")
    extra = ""
    if extra_jsonld:
        extra = (
            '\n<script type="application/ld+json">\n'
            + _json.dumps(extra_jsonld(lang, meta), ensure_ascii=False, indent=2)
            + "\n</script>"
        )

    body = render_blocks(meta["blocks"], root)

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<meta name="description" content="{esc(meta['description'])}">
<meta name="author" content="labidi.eu">
<meta name="robots" content="{page.get('robots', 'index, follow, max-image-preview:large')}">
<meta name="theme-color" content="#0b0d1a">
<link rel="canonical" href="{url}">
{alternates}
<link rel="icon" type="image/png" href="{root}media/img/app-icon-512.png">
<link rel="apple-touch-icon" href="{root}media/img/app-icon-512.png">
<link rel="manifest" href="{root}site.webmanifest">

<meta property="og:type" content="website">
<meta property="og:site_name" content="GHOSTTOOTH">
<meta property="og:title" content="{esc(meta['og_title'])}">
<meta property="og:description" content="{esc(meta['description'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE_URL}media/img/og-1200x630.png">
<meta property="og:image:alt" content="GHOSTTOOTH — Bluetooth surveillance and tracker detector">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="{LANGS[lang]['og_locale']}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(meta['og_title'])}">
<meta name="twitter:description" content="{esc(meta['description'])}">
<meta name="twitter:image" content="{BASE_URL}media/img/og-1200x630.png">
<meta name="twitter:image:alt" content="GHOSTTOOTH logo">

<title>{esc(meta['title'])}</title>
<style>{CSS}</style>
<script type="application/ld+json">
{jsonld}
</script>{extra}
</head>
<body>
<a class="skip" href="#content">{esc(UI[lang]['skip'])}</a>
<div class="wrap">

<header class="site">
  <a href="{page_url(lang, '')}"><img src="{root}media/img/GhostTooth-mascot-512.png" alt="GHOSTTOOTH" width="44" height="44"></a>
  <span class="brand">GHOSTTOOTH</span>
  <nav class="langs" aria-label="{esc(UI[lang]['language'])}">{lang_nav}</nav>
</header>

<main id="content">
<h1>{esc(meta['heading'])}</h1>
<p class="updated">{esc(UI[lang]['updated'])} {esc(page['updated'])}</p>
{body}
</main>

<footer class="site">
  <nav aria-label="{esc(UI[lang]['footer_nav'])}">{nav_links}</nav>
  <p>{UI[lang]['footer_note'].replace('{email}', f'<a href="mailto:{SUPPORT_EMAIL}">{SUPPORT_EMAIL}</a>')}</p>
</footer>

</div>
<script>
/* Offline support. Someone reading the safety guide may have deliberately gone
   offline, and someone reading the FAQ is often there because their device is
   misbehaving. Failure is silent: the site works perfectly well without it. */
if ('serviceWorker' in navigator) {{
  window.addEventListener('load', function () {{
    navigator.serviceWorker.register('/sw.js').catch(function () {{}});
  }});
}}
</script>
</body>
</html>
"""


# Which slugs exist per language, so navigation never links to a missing page.
ALL_SLUGS_FOR: dict[str, set[str]] = {}

# The English landing page, FAQ and privacy policy are hand-written files that
# this generator deliberately does not own — but they still belong in the
# sitemap, so they are declared here.
HANDWRITTEN_EN = {"", "faq", "privacy"}

# changefreq / priority per slug. Content pages change rarely; the landing page
# and changelog move with each release.
SITEMAP_HINTS = {
    "": ("monthly", "1.0"),
    "faq": ("monthly", "0.8"),
    "safety": ("monthly", "0.8"),
    "changelog": ("monthly", "0.6"),
    "privacy": ("yearly", "0.5"),
    "terms": ("yearly", "0.4"),
    "accessibility": ("yearly", "0.4"),
}


def write_sitemap() -> int:
    """Emit sitemap.xml with xhtml:link alternates for every localised page.

    Generated rather than hand-maintained: with three languages and seven slugs
    a hand-written sitemap drifts out of date the moment a page is added, and a
    sitemap that lists a 404 is worse than no sitemap.
    """
    langs_for: dict[str, list[str]] = {}
    for slug in SITEMAP_HINTS:
        codes = [c for c in LANGS if slug in ALL_SLUGS_FOR.get(c, set())]
        if slug in HANDWRITTEN_EN and "en" not in codes:
            codes.insert(0, "en")
        if codes:
            langs_for[slug] = codes

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ]
    count = 0
    for slug, codes in langs_for.items():
        changefreq, priority = SITEMAP_HINTS[slug]
        for lang in codes:
            lines.append("  <url>")
            lines.append(f"    <loc>{page_url(lang, slug)}</loc>")
            for alt in codes:
                lines.append(
                    f'    <xhtml:link rel="alternate" hreflang="{alt}" '
                    f'href="{page_url(alt, slug)}"/>'
                )
            lines.append(
                '    <xhtml:link rel="alternate" hreflang="x-default" '
                f'href="{page_url("en", slug)}"/>'
            )
            lines.append(f"    <lastmod>{UPDATED}</lastmod>")
            lines.append(f"    <changefreq>{changefreq}</changefreq>")
            lines.append(f"    <priority>{priority}</priority>")
            lines.append("  </url>")
            count += 1
    lines.append("</urlset>")

    (ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    return count


def main() -> int:
    for code in LANGS:
        ALL_SLUGS_FOR[code] = {
            slug for slug, page in PAGES.items() if code in page["langs"]
        }
    # The hand-written English pages exist even though this generator does not
    # emit them, so navigation must treat them as present.
    ALL_SLUGS_FOR["en"].update(HANDWRITTEN_EN)

    written = 0
    for slug, page in PAGES.items():
        for lang in page["langs"]:
            target = page_path(lang, slug)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(render_page(lang, slug, page), encoding="utf-8", newline="\n")
            print(f"  {target.relative_to(ROOT)}")
            written += 1

    print(f"\ngenerated {written} page(s)")

    urls = write_sitemap()
    print(f"sitemap.xml — {urls} url(s)")

    if MISSING_SHOTS:
        print(
            "\nnote: screenshot gallery omitted, these files are missing:\n  "
            + "\n  ".join(sorted(MISSING_SHOTS))
            + "\n  (see media/img/screenshots/README.md)"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
