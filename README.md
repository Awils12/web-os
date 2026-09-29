# WebOS

WebOS is a polished, modular browser desktop workspace built with plain HTML, CSS, and JavaScript.

## Highlights

- Draggable, minimizable, maximizable, focusable, and closable windows
- Searchable app launcher and `Ctrl/⌘ + K` command palette
- Desktop widgets, quick settings, themes, and persistent preferences
- Right-click desktop menu with quick actions
- Keyboard controls: `Alt+Tab` window switching, `Shift+Alt+F` focus mode, `/` launcher, `F1` help, `Escape` close overlays
- Files, Notes, Terminal, Settings, Browser, Calculator, Music, Gallery, System Monitor, App Store, Paint, and Clock tools
- Brave Search browser experience with in-window embedded-results attempt and safe fallback messaging
- Safe uploads limited to images, audio, text, Markdown, JSON, CSV, PDF, and ZIP
- No executable-file upload, storage, download, or execution support
- Custom SVG favicon and installable web manifest
- Offline-ready service worker when hosted over HTTP(S)
- Reduced-motion support for accessibility
- Responsive mobile layout

## Security

WebOS is browser-only. It does not execute uploaded files or start operating-system processes. Search providers may refuse iframe embedding; WebOS does not bypass their security headers.

## Run locally

```bash
npx serve .
```

Then open the local URL printed by the server. A service worker requires HTTP(S), so opening `index.html` directly will not enable offline caching.

## Deploy

Deploy the repository to GitHub Pages, Netlify, Vercel, or any static host.
