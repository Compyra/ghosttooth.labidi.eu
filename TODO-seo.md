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
- [x] `sitemap.xml` with home, faq, privacy (lastmod, priority, changefreq)
- [x] Canonical URL on every page (home, faq, privacy, 404)
- [x] `meta robots` = `index, follow, max-image-preview:large` on indexable pages
- [x] 404 page returns a helpful, on-brand page and is `noindex`
- [ ] Verify GitHub Pages serves `/404.html` for unknown paths (it does by convention)
- [ ] Submit sitemap in Google Search Console + Bing Webmaster Tools (manual, external)

## 2. Metadata (per page)
- [x] Unique, keyword-relevant `<title>` (< ~60 chars)
- [x] Unique `meta description` (~150–160 chars) per page
- [x] `meta keywords` (low value, kept minimal on home)
- [x] `author`, `theme-color`, `color-scheme`
- [x] `lang="en"` on `<html>`

## 3. Social / Open Graph / Twitter
- [x] Open Graph tags on home, faq, privacy, 404
- [x] Twitter summary_large_image tags on all pages
- [x] `og:image` + dimensions + type declared
- [x] Social share image is text-free (mascot on brand background, 1024×1024)
- [ ] Optional: dedicated 1200×630 landscape share image

## 4. Structured data (schema.org / JSON-LD)
- [x] `WebApplication` / `SoftwareApplication` on home
- [x] `Organization` + `WebSite` on home
- [x] `FAQPage` on the FAQ page (rich results eligible)
- [x] `BreadcrumbList` on faq + privacy
- [ ] Validate all with Google Rich Results Test (manual, external)

## 5. Icons & PWA
- [x] Favicon based on the GHOSTTOOTH logo (PNG + apple-touch-icon)
- [x] `site.webmanifest` (installable, theme/background color)
- [x] Text-free mascot logo (`media/GhostTooth-mascot.png`, transparent) used in-site
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
- [x] 404 links back to Home + FAQ + Privacy

## 9. Consistency
- [x] Logo (not emoji) in all hero/brand marks
- [x] Matching meta/OG/Twitter structure across all pages
- [x] Consistent "Last updated" dates in sitemap

## Remaining manual / external actions
- [ ] Optional: create a 1200×630 landscape OG share image for richer social cards
- [ ] Register in Google Search Console & Bing, submit sitemap
- [ ] Replace the Google Play placeholder link once the app is published
- [ ] Upload `media/app-icon-512.png` as the Play Store listing icon
