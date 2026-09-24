# WebOS

WebOS is a clean, modular browser desktop built with plain HTML, CSS, and JavaScript. It uses a modern desktop layout with retro-futurist styling and contains no anime characters, anime artwork, or anime branding.

## Included apps

Files, Notes, Terminal, Settings, Browser, Calculator, Music, Gallery, System Monitor, App Store, Paint, and Clock.

## Workspace features

- Draggable, minimizable, maximizable, and closable windows
- Searchable app launcher and command palette
- `Ctrl+K` / `Cmd+K` command palette
- Desktop widgets and quick settings
- Four themes with persistent preferences
- Notes autosave and safe file uploads
- Calculator, Music, Gallery, Monitor, Store, Paint, Browser, and Terminal tools
- No executable-file upload, storage, download, or execution support

## Brave Search browser

The Browser app now provides a Brave Search experience. It includes a search box, an address/search bar, refresh and navigation feedback, and an **Open externally** button.

Brave Search and Google can block iframe embedding with browser security headers. For that reason, WebOS opens searches in a normal new browser tab instead of trying to bypass those protections. This is more reliable and respects the search provider's security policy.

## Security

WebOS is browser-only and contains no native executable files. It does not execute uploaded files or start operating-system processes. The file picker only accepts images, audio, text, Markdown, JSON, CSV, PDF, and ZIP files.

## Run locally

Open `index.html` directly or use a static server:

```bash
npx serve .
```

## Deploy

The project can be hosted on GitHub Pages, Netlify, Vercel, or any static host.
