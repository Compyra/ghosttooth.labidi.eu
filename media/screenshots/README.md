# App screenshots

Drop four PNGs in this folder and re-run `python tools/build-site.py`. The
landing pages pick them up automatically; if a file is missing the generator
silently omits the whole gallery rather than shipping a broken image, so the
site is always correct even when this folder is empty.

| Filename | What it must show |
| --- | --- |
| `scan-list.png` | The live device list with confidence-rated badges |
| `threat-detail.png` | An expanded device card showing the "why" and the confidence line |
| `monitoring.png` | The ongoing monitoring notification with running counts |
| `locate.png` | The hot/cold locator screen |

Portrait, ideally 1080×2280 or similar 9:19.5. Keep them under ~300 KB each
(`pngquant` or `oxipng` is fine); they are served to every landing-page visitor.

## Why this folder is empty

The screenshots on the Play listing were captured from **1.2.0**, before the
detection rework in 1.3.0. They show the false positives that release fixed —
one has a status bar reading `3040 devices · 3 surveillance · 1803 trackers`
(nearly every Apple and Samsung device in range counted as a tracker) and a JBL
speaker badged `SURVEILLANCE`. Re-publishing them here would advertise the bug
we just removed, so they were deliberately not carried over.

**Capture fresh ones from a 1.3.0 build**, and update the Play listing with the
same set while you are there — the store screenshots have the same problem.

Do not crop or retouch a screenshot to hide a verdict. If the app gets a call
wrong in the shot, fix the app.
