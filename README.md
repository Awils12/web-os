# WebOS

A browser desktop built with plain HTML, CSS, and JavaScript. No build step is required.

## What works

- Draggable, minimizable, maximizable, and closable windows
- Launcher search and taskbar app buttons
- Files app with working locations, upload, new-folder feedback, file downloads, and local persistence
- Notes app with automatic localStorage saving
- Terminal commands: `help`, `clear`, `date`, `whoami`, `ls`, and `apps`
- Browser mockup with working navigation, refresh, address changes, and Explore button
- Settings with four working wallpapers, language feedback, and animation toggle feedback
- Desktop shortcuts, clock, toast notifications, keyboard-friendly buttons, and responsive layout

## EXE support

A normal website **cannot execute `.exe` files**. Browsers intentionally block arbitrary native program execution for security reasons. WebOS now supports the safe parts:

- Uploading `.exe` files through the Files app
- Showing them with an executable icon
- Persisting them locally in browser storage
- Downloading them again by double-clicking
- Clearly warning instead of attempting unsafe execution

To actually run a Windows executable, WebOS needs a separately installed native desktop wrapper or helper, such as an Electron/Tauri app with an explicit user-approved IPC bridge. That helper must validate file paths, require confirmation, and never execute uploads automatically. A GitHub Pages deployment will never be able to run EXE files directly.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

For reliable file-storage testing, use a local server because browser storage quotas and `file://` permissions vary between browsers.

## Deploy

The repository can be deployed to GitHub Pages, Netlify, Vercel, or any static host. No compilation is required.
