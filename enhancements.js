(() => {
  const $ = (selector) => document.querySelector(selector);
  const desktop = $('#desktop');
  const launcher = $('#launcher');
  const palette = $('#command-palette');
  const quick = $('#quick-panel');
  const widgetLayer = $('#widgets');
  const toast = $('#toast');
  const appSearch = $('#app-search');
  const paletteSearch = $('#palette-search');
  const BRAVE_SEARCH = 'https://search.brave.com/search?q=';
  const appCatalog = {
    files: ['📁', 'Files'], notes: ['📝', 'Notes'], terminal: ['⌘', 'Terminal'], settings: ['⚙️', 'Settings'],
    browser: ['🌐', 'Browser'], calculator: ['🧮', 'Calculator'], music: ['🎵', 'Music'], gallery: ['🖼️', 'Gallery'],
    monitor: ['📊', 'System Monitor'], store: ['🛍️', 'App Store'], paint: ['🎨', 'Paint'], clock: ['⏰', 'Clock']
  };
  let paletteItems = [];
  let calc = { expression: '', result: '0' };
  let toastTimer;

  const say = (message) => {
    if (typeof window.notify === 'function') return window.notify(message);
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const open = (id) => { if (typeof window.openApp === 'function') window.openApp(id); };
  const toggle = (element) => element?.classList.toggle('hidden');

  function renderPalette(filter = '') {
    const query = filter.trim().toLowerCase();
    paletteItems = [
      ...Object.entries(appCatalog).map(([id, [icon, title]]) => ({ label: `Open ${title}`, icon, run: () => open(id) })),
      { label: 'Search with Brave', icon: '🦁', run: () => openBraveSearch() },
      { label: 'Change theme', icon: '🎨', run: () => cycleTheme() },
      { label: 'Toggle widgets', icon: '▦', run: () => toggleWidgets() },
      { label: 'Reset desktop layout', icon: '↺', run: () => resetDesktop() }
    ].filter((item) => item.label.toLowerCase().includes(query));
    const results = $('#palette-results');
    if (!results) return;
    results.innerHTML = paletteItems.length
      ? paletteItems.map((item, index) => `<button class="palette-item" data-palette-index="${index}"><span>${item.icon}</span>${item.label}<kbd>${index < 9 ? index + 1 : ''}</kbd></button>`).join('')
      : '<div class="empty-state">No matching commands</div>';
  }

  function runPalette(index = 0) {
    const item = paletteItems[index];
    if (!item) return;
    item.run();
    palette?.classList.add('hidden');
    if (paletteSearch) paletteSearch.value = '';
  }

  function openBraveSearch(query = '') {
    const target = query.trim() || 'WebOS';
    const url = `${BRAVE_SEARCH}${encodeURIComponent(target)}`;
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) say('Allow pop-ups to open Brave Search');
    else say('Opened Brave Search in a new tab');
  }

  function cycleTheme() {
    const themes = ['aurora', 'sunset', 'midnight', 'forest'];
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('webos-state') || '{}'); } catch { /* use default */ }
    const current = themes.includes(saved.theme) ? saved.theme : 'aurora';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    const themeButton = document.querySelector(`[data-theme="${next}"]`);
    if (themeButton) themeButton.click();
    else desktop.className = `desktop theme-${next}`;
    say(`Theme changed to ${next}`);
  }

  function toggleWidgets() {
    widgetLayer?.classList.toggle('widgets-hidden');
    say(widgetLayer?.classList.contains('widgets-hidden') ? 'Widgets hidden' : 'Widgets visible');
  }

  function resetDesktop() {
    if (!window.confirm('Reset open windows and desktop layout?')) return;
    localStorage.removeItem('webos-state');
    window.location.reload();
  }

  function calculatorInput(action) {
    const display = document.querySelector('.calculator-display');
    if (!display) return;
    if (/^\d$/.test(action) || action === 'dot') calc.expression += action === 'dot' ? '.' : action;
    else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) calc.expression += ({ add: '+', subtract: '-', multiply: '*', divide: '/' }[action]);
    else if (action === 'clear') calc = { expression: '', result: '0' };
    else if (action === 'delete') calc.expression = calc.expression.slice(0, -1);
    else if (action === 'percent') calc.expression = String(Number(calc.expression || 0) / 100);
    else if (action === 'toggle') calc.expression = calc.expression.startsWith('-') ? calc.expression.slice(1) : `-${calc.expression}`;
    else if (action === 'equals') {
      if (!/^[0-9+*/.%()\- ]+$/.test(calc.expression)) return say('Invalid calculation');
      try { calc.result = String(Function(`"use strict";return (${calc.expression})`)()); calc.expression = calc.result; } catch { calc.result = 'Error'; }
    }
    display.textContent = calc.expression || calc.result || '0';
  }

  function enhanceBrowser(windowElement) {
    const title = windowElement.querySelector('.window-title')?.textContent?.trim();
    if (!title?.includes('Browser')) return;
    const body = windowElement.querySelector('.window-body');
    if (!body || body.dataset.braveEnhanced === 'true') return;
    body.dataset.braveEnhanced = 'true';
    body.innerHTML = `
      <div class="browser brave-browser">
        <div class="browser-bar">
          <button type="button" data-brave-nav="back" title="Back">‹</button>
          <button type="button" data-brave-nav="forward" title="Forward">›</button>
          <button type="button" data-brave-nav="refresh" title="Refresh">↻</button>
          <form class="brave-search-form">
            <input id="brave-address" value="https://search.brave.com" aria-label="Brave Search" autocomplete="off">
          </form>
          <button type="button" class="brave-open" data-brave-external>Open externally ↗</button>
        </div>
        <div class="brave-home">
          <div class="brave-logo">🦁</div>
          <h1>Brave Search</h1>
          <p>Private search for your WebOS workspace.</p>
          <form class="brave-main-form">
            <input class="brave-query" placeholder="Search the web with Brave…" autocomplete="off">
            <button class="primary-button" type="submit">Search</button>
          </form>
          <small>Brave Search opens in a new tab because search providers may block embedded frames.</small>
        </div>
      </div>`;

    const go = (value) => {
      const query = value.trim();
      if (!query) return;
      const url = /^https?:\/\//i.test(query) ? query : `${BRAVE_SEARCH}${encodeURIComponent(query)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      say('Opened Brave Search in a new tab');
    };
    body.querySelector('.brave-search-form').addEventListener('submit', (event) => { event.preventDefault(); go(body.querySelector('#brave-address').value); });
    body.querySelector('.brave-main-form').addEventListener('submit', (event) => { event.preventDefault(); go(body.querySelector('.brave-query').value); });
    body.querySelector('[data-brave-external]').addEventListener('click', () => go('https://search.brave.com'));
    body.querySelector('[data-brave-nav="refresh"]').addEventListener('click', () => say('Brave Search is ready'));
    body.querySelector('[data-brave-nav="back"]').addEventListener('click', () => say('Use the browser tab for back navigation'));
    body.querySelector('[data-brave-nav="forward"]').addEventListener('click', () => say('Use the browser tab for forward navigation'));
  }

  function enhanceAllBrowsers() { document.querySelectorAll('.window').forEach(enhanceBrowser); }

  function wire() {
    $('#start-button')?.addEventListener('click', () => { launcher?.classList.remove('hidden'); if (appSearch) { appSearch.value = ''; appSearch.focus(); } });
    $('#launcher-close')?.addEventListener('click', () => launcher?.classList.add('hidden'));
    $('#palette-button')?.addEventListener('click', () => { palette?.classList.remove('hidden'); renderPalette(); paletteSearch?.focus(); });
    $('#palette-close')?.addEventListener('click', () => palette?.classList.add('hidden'));
    $('#quick-button')?.addEventListener('click', () => toggle(quick));
    $('#quick-close')?.addEventListener('click', () => quick?.classList.add('hidden'));
    paletteSearch?.addEventListener('input', (event) => renderPalette(event.target.value));
    $('#palette-results')?.addEventListener('click', (event) => { const button = event.target.closest('[data-palette-index]'); if (button) runPalette(Number(button.dataset.paletteIndex)); });
    quick?.addEventListener('click', (event) => { const action = event.target.closest('[data-quick]')?.dataset.quick; if (action === 'theme') cycleTheme(); if (action === 'widgets') toggleWidgets(); if (action === 'reset') resetDesktop(); if (action === 'about') say('WebOS — a safe, anime-free browser desktop'); });
    document.addEventListener('click', (event) => { const button = event.target.closest('[data-calc]'); if (button) calculatorInput(button.dataset.calc); });
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette?.classList.remove('hidden'); renderPalette(); paletteSearch?.focus(); }
      if (event.key === 'Escape') { launcher?.classList.add('hidden'); palette?.classList.add('hidden'); quick?.classList.add('hidden'); }
      if (!palette?.classList.contains('hidden')) { if (event.key === 'Enter') runPalette(0); if (/^[1-9]$/.test(event.key)) runPalette(Number(event.key) - 1); }
    });
    renderPalette();
    enhanceAllBrowsers();
  }

  function updateWidgets() {
    const now = new Date();
    const time = $('#widget-time');
    const date = $('#widget-date');
    if (time) time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  const observer = new MutationObserver(() => { enhanceAllBrowsers(); });
  observer.observe(document.body, { childList: true, subtree: true });
  wire();
  updateWidgets();
  setInterval(updateWidgets, 1000);
})();
