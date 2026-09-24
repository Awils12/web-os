# WebOS

WebOS is a clean, modular browser desktop built with plain HTML, CSS, and JavaScript. It uses a modern desktop layout with retro-futurist styling and contains no anime characters, anime artwork, or anime branding.

## Included apps

Files, Notes, Terminal, Settings, Browser, Calculator, Music, Gallery, System Monitor, App Store, Paint, and Clock.

## Desktop features

- Draggable, minimizable, maximizable, and closable windows
- Searchable app launcher and command palette
- `Ctrl+K` / `Cmd+K` command palette
- Desktop widgets and quick settings
- Four themes with persistent preferences
- Notes autosave and safe file uploads
- Calculator, Music, Gallery, Monitor, Store, Paint, Browser, and Terminal tools
- Brave Search browser experience with an in-window embedded-results attempt
- Fallback messaging when a search provider blocks iframe embedding
- New custom WebOS favicon and installable web app manifest
- No executable-file upload, storage, download, or execution support

## Browser behavior

WebOS tries to keep searches inside the Browser app window. Brave Search and other sites may block iframe embedding with security headers, so the app displays a clear in-window fallback instead of bypassing those protections or automatically opening a new tab.

## Security

WebOS is browser-only and contains no native executable files. It does not execute uploaded files or start operating-system processes. The file picker only accepts images, audio, text, Markdown, JSON, CSV, PDF, and ZIP files.

## Run locally

Open `index.html` directly or use a static server:

```bash
npx serve .
```

## Deploy

The project can be hosted on GitHub Pages, Netlify, Vercel, or any static host.
