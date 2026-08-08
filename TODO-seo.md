# GHOSTTOOTH — Technical SEO Checklist

Domain: https://ghosttooth.labidi.eu/
Goal: flawless technical SEO, rich results, fast + crawlable, socially shareable.

## Legend
- [x] done
- [ ] todo
- [~] partial / needs an external asset

---

## 1. Crawlability & indexing
- [x] `robots.txt` present, allows all, references sitemap
- [x] `robots.txt` disallows the internal test fixture (`/test-found-devices.html`) and `/tools/`
- [x] `sitemap.xml` — now **generated** by `tools/build-site.py`; 19 URLs across en/fr/nl with `xhtml:link` hreflang alternates
- [x] Canonical URL on every page
- [x] `hreflang` alternates + `x-default` on every page, both generated and hand-written
- [x] `meta robots` = `index, follow, max-image-preview:large` on indexable pages
- [x] 404 page returns a helpful, on-brand page and is `noindex`
- [x] 404 uses absolute paths so it still resolves when served from a deep URL
- [x] Internal test fixture is wrapped, labelled and `noindex, nofollow, noarchive`
- [ ] Submit sitemap in Google Search Console + Bing Webmaster Tools (manual, external)

## 2. Metadata (per page)
- [x] Unique, keyword-relevant `<title>` (< ~60 chars)
- [x] Unique `meta description` (~150–160 chars) per page
- [x] `meta keywords` (low value, kept minimal on home)
- [x] `author`, `theme-color`, `color-scheme`
- [x] `lang` set correctly per page (`en` / `fr` / `nl`)

## 3. Social / Open Graph / Twitter
- [x] Open Graph tags on every page, generated and hand-written
- [x] Twitter summary_large_image tags on all pages
- [x] `og:image` + dimensions + type declared
- [x] `og:locale` per language + `og:locale:alternate` on the English pages
- [x] Dedicated 1200×630 landscape share image — `media/img/og-1200x630.png`, generated
      reproducibly by `tools/build-og-image.py`, referenced by every page

## 4. Structured data (schema.org / JSON-LD)
- [x] `WebApplication` / `SoftwareApplication` on home
- [x] `Organization` + `WebSite` on home
- [x] `FAQPage` on the FAQ page (rich results eligible)
- [x] `BreadcrumbList` on faq + privacy
- [ ] Validate all with Google Rich Results Test (manual, external)

## 5. Icons & PWA
- [x] Favicon based on the GHOSTTOOTH logo (PNG + apple-touch-icon)
- [x] `site.webmanifest` (installable, theme/background color), linked from every page
- [x] Service worker (`sw.js`) — cache-first shell, network-first registries, offline
      fallback. Registered on every page so the FAQ and safety guide open offline.
- [x] Text-free mascot logo (`media/img/GhostTooth-mascot.png`, transparent) used in-site
- [x] Google Play app icons generated (`app-icon-512.png`, `app-icon-1024.png`)
- [x] Dedicated maskable icon (`app-icon-maskable-512.png`, safe-zone padding)

## 6. Performance & Core Web Vitals
- [x] `width`/`height` on the logo image to reserve layout space (avoid CLS)
- [x] Fonts preconnected; heavy inline pages are self-contained (no CDN)
- [ ] Add `font-display: swap` awareness (Google Fonts already appends `&display=swap`)
- [ ] Compress/serve logo as WebP alongside PNG (optional, needs asset build)

## 7. Accessibility (supports SEO)
- [x] Descriptive `alt` text on meaningful images; decorative images `alt=""`
- [x] Landmarks: `header`, `main`, `footer`, `nav`
- [x] Skip-to-content link on the home page

## 8. Internal linking
- [x] Home links to FAQ + Privacy (callout + footer)
- [x] FAQ + Privacy link back to Home + each other
- [x] 404 links back to Home + FAQ + Safety + Terms, plus FR/NL
- [x] Every page footers to Safety, Terms, Accessibility and Changelog
- [x] Language switcher on every page, including the hand-written English ones

## 9. Consistency
- [x] Logo (not emoji) in all hero/brand marks
- [x] Matching meta/OG/Twitter structure across all pages
- [x] Consistent "Last updated" dates, driven from `UPDATED` in `tools/site_content.py`
- [x] No version number on the landing page that could contradict the app changelog

## Remaining manual / external actions
- [ ] Register in Google Search Console & Bing, submit sitemap
- [ ] Validate structured data with the Google Rich Results Test
- [ ] Add real 1.3.0 app screenshots to `media/screenshots/` and re-run
      `tools/build-site.py` (the gallery is skipped while they are missing —
      see `media/img/screenshots/README.md`)
- [ ] Optional: serve the logo as WebP alongside PNG
