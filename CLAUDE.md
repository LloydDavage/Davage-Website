# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server with hot reload (opens http://localhost automatically)
npm run build    # Production bundle → /dist
npm run deploy   # Build, then upload /dist to davage.co.uk over FTPS (scripts/deploy.sh; login in ~/.netrc)
```

No test framework is configured.

## Architecture

Static single-page portfolio site for Lloyd Davage. No backend, no framework — vanilla HTML/CSS/JS bundled by Webpack.

### Page Navigation Pattern

`index.html` contains four hidden content panels (`#home`, `#experience`, `#skills`, `#hobbies`). `js/main.js` shows/hides them by toggling a `.active` class based on sidebar nav clicks. The sidebar also has a hamburger toggle for mobile. Webpack's entry point is `js/app.js`, which imports `main.js`; the bundle is injected by `html-webpack-plugin`.

### Styling Conventions

All styles live in `css/style.css`. The color scheme is driven by CSS custom properties defined on `:root`:

| Variable | Value | Role |
|---|---|---|
| `--ink` | `#1a1612` | Primary text |
| `--paper` | `#f5f0e8` | Background |
| `--rust` | `#b5421a` | Primary accent |
| `--gold` | `#c8922a` | Secondary accent |
| `--forest` | `#2d4a2a` | Green accent |
| `--slate` | `#3a4a5c` | Blue-grey accent |

Typography: **Playfair Display** (headings), **Source Serif 4** (body), **JetBrains Mono** (labels/metadata) — all loaded from Google Fonts in `index.html`.

Mobile breakpoint is **820px** (sidebar collapses, hamburger appears).

### Webpack Split

`webpack.common.js` defines the entry/output. `webpack.config.dev.js` adds `devServer` + source maps. `webpack.config.prod.js` adds `copy-webpack-plugin` to copy `css/`, `img/`, `favicon.ico`, `robots.txt`, `404.html`, and `site.webmanifest` into `dist/`.

### Deployment

`/dist` is the production artifact. See `SETUP.md` for SFTP/FTP deployment steps to davage.co.uk.
