# taskbean.ai

Marketing site for **[taskbean](https://github.com/taskbean/taskbean)** — the AI task manager that lives on your machine. Deployed via GitHub Pages at **[taskbean.ai](https://taskbean.ai)**.

No build step, no bundler, no package manager. Vanilla HTML/CSS/JS only.

## Structure

| Path | What it is |
|---|---|
| `index.html`, `about.html`, `how-it-works.html`, `docs.html` | Standalone marketing pages (shared nav/footer markup) |
| `css/style.css` | Full design system in one file — `@layer` cascade, coffee-themed design tokens |
| `js/main.js` | Nav scroll, mobile toggle, scroll reveal, smooth scroll |
| `docs/` | [Mintlify](https://mintlify.com) docs subsite, deployed separately to `docs.taskbean.ai` |
| `assets/` | Brand assets, hero art, app screenshots, OG image |
| `vendor/lucide.min.js` | Vendored icon library (no CDN) |
| `CNAME` | `taskbean.ai` — GitHub Pages custom domain |

## Local development

```bash
# Easiest — just open it:
start index.html            # Windows
open  index.html            # macOS

# Or serve it (for relative paths + service worker testing):
python -m http.server 8765
```

Edit any HTML/CSS/JS file and refresh. Icons auto-render via `<i data-lucide="icon-name"></i>`.

## Conventions

- **BEM naming** — `block__element--modifier` (e.g. `nav__link--external`)
- **`.reveal` class** — add to any element for a scroll-triggered entrance animation
- **`.container`** — centering wrapper using `--max-w` and `--gutter`
- Navigation markup is duplicated across the HTML files — update every page when editing nav

## Deployment

- `main` is deployed automatically via GitHub Pages
- `CNAME` maps the site to `taskbean.ai`
- Docs subsite (`docs/`) is deployed separately by Mintlify per `docs/docs.json`

## Tech

Vanilla HTML5, CSS3 (`@layer`, custom properties), vanilla JS, Lucide icons, Umami analytics.

## Contributing

Small site, low ceremony. Open a PR against `main`. When touching layout or shared styles, verify on desktop (1440×900) and mobile (375×812).

## License

[MIT](LICENSE)
