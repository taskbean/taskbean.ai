# Copilot Instructions — taskbean.ai

## What This Is

Static marketing site for [taskbean](https://github.com/taskbean/taskbean), deployed via GitHub Pages at [taskbean.ai](https://taskbean.ai). No build step, no bundler, no package manager — open `index.html` in a browser to develop.

## Architecture

- **Pages**: `index.html`, `about.html`, `how-it-works.html`, `docs.html` — each is a standalone HTML file sharing the same nav/footer structure
- **Styles**: Single file `css/style.css` containing the full design system
- **JS**: Single file `js/main.js` for interactions (nav scroll, mobile toggle, scroll reveal, smooth scroll)
- **Docs**: `docs/` directory is a [Mintlify](https://mintlify.com) documentation site deployed separately to `docs.taskbean.ai` — configured via `docs/docs.json`. Preview locally with `npx mint dev` from the `docs/` directory.
- **Vendor**: `vendor/lucide.min.js` — vendored icon library (not loaded from CDN)
- **Analytics**: Umami (privacy-friendly), loaded via script tag in each HTML file
- **Domain/Deploy**: `CNAME` file maps GitHub Pages to `taskbean.ai`. Pushes to the default branch deploy automatically — there is no CI/build workflow.

## Behaviors Wired Up in js/main.js

These are non-obvious runtime behaviors that markup must cooperate with:

- **`.reveal`** → scroll-triggered fade-in via IntersectionObserver (adds `.visible`).
- **Active nav link** → derived from `location.pathname`; `<a class="nav__link" href="about.html">` gets `.active` auto-applied.
- **`.code-block`** → a "Copy" button is injected at runtime (don't hand-author one); requires a child `<pre>`.
- **Showcase scroll-scenes** (`index.html`): `.showcase__panel[data-scene="N"]` panels drive cross-fading `.mockup-scene[data-scene="N"]` + `.showcase__dot[data-scene="N"]`. Scene elements animate via `.scene-el` with `data-delay="ms"`. Dots are clickable and scroll-sync. Scene 4 auto-switches the mockup app-bar to the `projects` tab.
- **Mobile-OS download swap**: on touch/mobile UA, adds `.is-mobile-os` to `<html>` and rewrites `a.btn` containing "Download"/"Get Started" (or `#quick-start`) — nav buttons → GitHub link, others → `docs.html` "Learn More". A `.mobile-notice` banner is injected after `.hero`. Don't author these variants manually.
- **Docs sidebar** (`docs.html`): `.docs-sidebar a[href="#id"]` are auto-highlighted based on scroll position of `.docs-content h2[id] / h3[id]`. Headings need `id`s to participate.
- **Smooth scroll**: any `a[href^="#"]` gets preventDefault + smooth scrollIntoView.

## Design System (css/style.css)

The CSS uses `@layer` for cascade management:
```
@layer reset, base, layout, components, utilities, animations;
```

All design tokens are CSS custom properties on `:root`:
- **Colors**: `--c-*` prefix — "Dark Roast" coffee theme (dark bg `#1A120E`, primary orange `#E8863C`, accent `#D4922E`)
- **Typography**: `--f-*` for font families, `--fs-*` for fluid sizes — Fraunces (display/headings), Sora (body), JetBrains Mono (code)
- **Spacing**: `--s-*` prefix (`xs` through `4xl`)
- **Layout**: `--max-w`, `--max-w-narrow`, `--max-w-wide`, `--gutter`
- **Radii/Shadows/Transitions**: `--r-*`, `--shadow-*`, `--dur-*`, `--ease-*`

## Conventions

- **BEM naming**: CSS classes follow `block__element--modifier` (e.g., `nav__link--external`, `nav__toggle`)
- **`.reveal` class**: Add to any element for scroll-triggered entrance animation (handled by IntersectionObserver in `main.js`)
- **`.container`**: Centering wrapper using `--max-w` and `--gutter`
- **Icons**: Use Lucide via `<i data-lucide="icon-name"></i>` — the vendored script auto-replaces them
- **No framework**: Vanilla HTML, CSS, JS only. Do not introduce build tools, preprocessors, or frameworks.
- **Nav is duplicated** across HTML files — changes to navigation must be made in every page file
- **Lucide re-render**: after dynamically swapping content that includes `<i data-lucide>` icons, call `lucide.createIcons()` again (the showcase scene switcher does this).
- **Reduced motion**: respect `prefers-reduced-motion` — the showcase already zeroes out `transitionDelay` when set.
