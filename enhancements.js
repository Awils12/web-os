(() => {
  const $ = (s) => document.querySelector(s);
  const desktop = $('#desktop');
  const launcher = $('#launcher');
  const palette = $('#command-palette');
  const quick = $('#quick-panel');
  const widgetLayer = $('#widgets');
  const toast = $('#toast');
  const appSearch = $('#app-search');
  const paletteSearch = $('#palette-search');
  const apps = {
    files: ['📁', 'Files'], notes: ['📝', 'Notes'], terminal: ['⌘', 'Terminal'], settings: ['⚙️', 'Settings'],
    browser: ['🌐', 'Browser'], calculator: ['🧮', 'Calculator'], music: ['🎵', 'Music'], gallery: ['🖼️', 'Gallery'],
    monitor: ['📊', 'System Monitor'], store: ['🛍️', 'App Store'], paint: ['🎨', 'Paint'], clock: ['⏰', 'Clock']
  };
  let paletteItems = [];
  let calc = { expression: '', result: '0' };
  let toastTimer;

  const say = (message) => {
    if (typeof window.notify === 'function') return window.notify(message);
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };
  const open = (id) => { if (typeof window.openApp === 'function') window.openApp(id); };
  const toggle = (el) => el.classList.toggle('hidden');

  function renderPalette(filter = '') {
    const query = filter.trim().toLowerCase();
    paletteItems = [
      ...Object.entries(apps).map(([id, [icon, title]]) => ({ id, label: `Open ${title}`, icon, run: () => open(id) })),
      { label: 'Change theme', icon: '🎨', run: () => cycleTheme() },
      { label: 'Toggle widgets', icon: '▦', run: () => toggleWidgets() },
      { label: 'Reset desktop layout', icon: '↺', run: () => resetDesktop() }
    ].filter((item) => item.label.toLowerCase().includes(query));
    $('#palette-results').innerHTML = paletteItems.length ? paletteItems.map((item, i) => `<button class="palette-item" data-palette-index="${i}"><span>${item.icon}</span>${item.label}<kbd>${i < 9 ? i + 1 : ''}</kbd></button>`).join('') : '<div class="empty-state">No matching commands</div>';
  }

  function runPalette(index = 0) {
    const item = paletteItems[index];
    if (!item) return;
    item.run();
    palette.classList.add('hidden');
    paletteSearch.value = '';
  }

  function cycleTheme() {
    const themes = ['aurora', 'sunset', 'midnight', 'forest'];
    const current = (localStorage.getItem('webos-state') || '').match(/"theme":"(.*?)"/)?.[1] || 'aurora';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    const buttons = document.querySelectorAll('[data-theme]');
    if (buttons.length) buttons[(themes.indexOf(next) + buttons.length) % buttons.length].click();
    else desktop.className = `desktop theme-${next}`;
    say(`Theme changed to ${next}`);
  }

  function toggleWidgets() {
    widgetLayer.classList.toggle('widgets-hidden');
    say(widgetLayer.classList.contains('widgets-hidden') ? 'Widgets hidden' : 'Widgets visible');
  }

  function resetDesktop() {
    if (!confirm('Reset open windows and desktop layout?')) return;
    localStorage.removeItem('webos-state');
    location.reload();
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

  function wire() {
    $('#start-button')?.addEventListener('click', () => { launcher.classList.remove('hidden'); appSearch.value = ''; appSearch.focus(); });
    $('#launcher-close')?.addEventListener('click', () => launcher.classList.add('hidden'));
    $('#palette-button')?.addEventListener('click', () => { palette.classList.remove('hidden'); renderPalette(); paletteSearch.focus(); });
    $('#palette-close')?.addEventListener('click', () => palette.classList.add('hidden'));
    $('#quick-button')?.addEventListener('click', () => toggle(quick));
    $('#quick-close')?.addEventListener('click', () => quick.classList.add('hidden'));
    paletteSearch?.addEventListener('input', (e) => renderPalette(e.target.value));
    $('#palette-results')?.addEventListener('click', (e) => { const button = e.target.closest('[data-palette-index]'); if (button) runPalette(Number(button.dataset.paletteIndex)); });
    quick?.addEventListener('click', (e) => { const action = e.target.closest('[data-quick]')?.dataset.quick; if (action === 'theme') cycleTheme(); if (action === 'widgets') toggleWidgets(); if (action === 'reset') resetDesktop(); if (action === 'about') say('WebOS — a safe, anime-free browser desktop'); });
    document.addEventListener('click', (e) => { const button = e.target.closest('[data-calc]'); if (button) calculatorInput(button.dataset.calc); });
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.classList.remove('hidden'); renderPalette(); paletteSearch.focus(); }
      if (e.key === 'Escape') { launcher.classList.add('hidden'); palette.classList.add('hidden'); quick.classList.add('hidden'); }
      if (palette.classList.contains('hidden')) return;
      if (e.key === 'Enter') runPalette(0);
      if (/^[1-9]$/.test(e.key)) runPalette(Number(e.key) - 1);
    });
    updateWidgets();
    setInterval(updateWidgets, 1000);
  }

  function updateWidgets() {
    const now = new Date();
    const time = $('#widget-time');
    const date = $('#widget-date');
    if (time) time.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (date) date.textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  const originalRender = window.render;
  if (typeof originalRender === 'function') {
    window.render = (...args) => { originalRender(...args); setTimeout(wire, 0); };
  }
  renderPalette();
  wire();
})();
