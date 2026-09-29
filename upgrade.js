(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const desktop = $('#desktop');
  const menu = $('#upgrade-menu');
  const toast = $('#toast');
  let menuTimer;
  let hintTimer;

  function message(text) {
    if (typeof window.notify === 'function') { window.notify(text); return; }
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(menuTimer);
    menuTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function launch(id) {
    const button = document.querySelector(`[data-launch="${id}"]`) || document.querySelector(`[data-open="${id}"]`);
    if (button) { button.click(); return true; }
    return false;
  }

  function showHint(text) {
    let hint = $('.shortcut-hint');
    if (!hint) { hint = document.createElement('div'); hint.className = 'shortcut-hint'; document.body.appendChild(hint); }
    hint.textContent = text;
    hint.classList.add('show');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hint.classList.remove('show'), 1800);
  }

  function openLauncher() {
    const button = $('#start-button');
    if (button) button.click();
  }

  function openQuickNote() {
    if (!launch('notes')) return;
    message('Notes opened — your writing saves automatically');
  }

  function refreshDesktop() {
    document.querySelectorAll('.window').forEach((windowElement) => windowElement.classList.remove('focused'));
    message('Desktop refreshed');
  }

  function closeOverlays() {
    document.querySelectorAll('.launcher,.command-palette,.quick-panel').forEach((element) => element.classList.add('hidden'));
    menu.classList.add('hidden');
  }

  function focusNextWindow(reverse = false) {
    const windows = [...document.querySelectorAll('.window')];
    if (!windows.length) { message('No open windows'); return; }
    const current = windows.findIndex((windowElement) => windowElement.classList.contains('focused'));
    windows.forEach((windowElement) => windowElement.classList.remove('focused'));
    const next = (current + (reverse ? -1 : 1) + windows.length) % windows.length;
    const selected = windows[next];
    selected.classList.add('focused');
    selected.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const title = selected.querySelector('.window-title')?.textContent?.trim() || 'window';
    showHint(`Focused: ${title}`);
  }

  document.addEventListener('contextmenu', (event) => {
    if (event.target.closest('.window,input,textarea,button,select')) return;
    event.preventDefault();
    menu.style.left = `${Math.min(event.clientX, window.innerWidth - 240)}px`;
    menu.style.top = `${Math.min(event.clientY, window.innerHeight - 190)}px`;
    menu.classList.remove('hidden');
  });

  document.addEventListener('click', (event) => {
    const action = event.target.closest('[data-upgrade-action]')?.dataset.upgradeAction;
    if (action === 'launcher') openLauncher();
    if (action === 'notes') openQuickNote();
    if (action === 'refresh') refreshDesktop();
    if (action === 'about') message('WebOS — modular, browser-only, and safe');
    if (action) menu.classList.add('hidden');
    if (!event.target.closest('#upgrade-menu')) menu.classList.add('hidden');
  });

  document.addEventListener('dblclick', (event) => {
    if (event.target.closest('.desktop') && !event.target.closest('.window,.desktop-icon,.taskbar,.launcher,.command-palette,.quick-panel')) openLauncher();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeOverlays();
    if (event.key === 'F1') { event.preventDefault(); message('Shortcuts: Ctrl/⌘+K palette · Alt+Tab apps · Shift+Alt+F focus mode · right-click desktop menu'); }
    if (event.altKey && event.key === 'Tab') { event.preventDefault(); focusNextWindow(event.shiftKey); }
    if (event.shiftKey && event.altKey && event.key.toLowerCase() === 'f') {
      event.preventDefault(); desktop.classList.toggle('focus-mode'); showHint(desktop.classList.contains('focus-mode') ? 'Focus mode enabled' : 'Focus mode disabled');
    }
    if (event.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) { event.preventDefault(); openLauncher(); }
  });

  document.addEventListener('mousedown', (event) => {
    const windowElement = event.target.closest('.window');
    if (!windowElement) return;
    document.querySelectorAll('.window').forEach((item) => item.classList.remove('focused'));
    windowElement.classList.add('focused');
  });

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (prefersReduced?.matches) document.documentElement.classList.add('reduce-motion');
  window.addEventListener('online', () => message('Back online'));
  window.addEventListener('offline', () => message('Offline mode — local apps still work'));
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
  });
})();
