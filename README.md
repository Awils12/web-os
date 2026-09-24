# WebOS

A polished browser desktop built with plain HTML, CSS, and JavaScript.

## Included apps

- Files
- Notes
- Terminal
- Settings
- Browser
- Calculator
- Music
- Gallery
- System Monitor
- App Store
- Paint
- Clock

## What works

- Draggable windows
- Minimize, maximize, and close controls
- Desktop shortcuts
- Taskbar launcher
- App search
- Notes autosave with localStorage
- Terminal commands: help, clear, date, whoami, ls, apps
- Files upload and download support
- EXE file safety handling (stored and downloaded, but not executed by the browser)
- Theme changing
- Browser mock navigation
- Music controls, gallery upload, system monitor, store, paint, and clock

## EXE support

Browsers cannot execute Windows `.exe` files for security reasons. WebOS supports the safe browser-side workflow:

- upload `.exe` files
- keep them in `localStorage` (for browser session persistence)
- display them in the Files app
- download them again
- warn the user instead of running them

To truly run an `.exe`, it must be handled by a native desktop wrapper such as Electron or Tauri with an explicit user confirmation flow.

## Run locally

Open `index.html` directly in a browser or serve it with a static server:

```bash
npx serve .
```

## Deploy

This project can be hosted anywhere static files are allowed, including GitHub Pages, Netlify, and Vercel.
