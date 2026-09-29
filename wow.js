(() => {
  'use strict';
  const style = document.createElement('style');
  style.textContent = `
    .wow-stars{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1;opacity:.8}
    .wow-star{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;box-shadow:0 0 8px 2px #93c5fd;animation:wow-twinkle var(--duration) ease-in-out infinite;animation-delay:var(--delay)}
    @keyframes wow-twinkle{0%,100%{opacity:.1;transform:scale(.6)}50%{opacity:1;transform:scale(1.8)}}
    .wow-scanlines{position:absolute;inset:0;z-index:2;pointer-events:none;opacity:0;transition:opacity .3s;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0,rgba(255,255,255,.025) 1px,transparent 1px,transparent 4px)}
    .desktop.wow-cinematic .wow-scanlines{opacity:1}
    .desktop.wow-cinematic .window{box-shadow:0 0 0 1px rgba(96,165,250,.25),0 25px 80px rgba(0,0,0,.6),0 0 35px rgba(96,165,250,.12) !important}
    .wow-badge{position:absolute;right:28px;bottom:78px;z-index:3;padding:7px 10px;border:1px solid rgba(255,255,255,.15);border-radius:999px;background:rgba(15,23,42,.48);backdrop-filter:blur(12px);color:#bfdbfe;font:10px 'Space Mono',monospace;letter-spacing:.08em;text-transform:uppercase;opacity:.7}
    .wow-cursor{position:fixed;z-index:30000;width:18px;height:18px;border:2px solid rgba(147,197,253,.8);border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);mix-blend-mode:screen;transition:width .15s,height .15s,background .15s}
    .wow-cursor.active{width:34px;height:34px;background:rgba(96,165,250,.12);box-shadow:0 0 12px rgba(96,165,250,.6)}
    .wow-notice{position:fixed;left:50%;top:18px;z-index:30001;transform:translate(-50%,-20px);opacity:0;pointer-events:none;padding:10px 16px;border:1px solid rgba(147,197,253,.35);border-radius:999px;background:rgba(15,23,42,.78);backdrop-filter:blur(16px);color:#dbeafe;font-size:12px;box-shadow:0 10px 35px rgba(0,0,0,.3);transition:.25s ease}
    .wow-notice.show{transform:translate(-50%,0);opacity:1}
    .wow-shortcuts{position:fixed;right:20px;top:72px;z-index:29999;width:280px;padding:18px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:rgba(15,23,42,.82);backdrop-filter:blur(20px);box-shadow:0 20px 60px rgba(0,0,0,.45);color:#cbd5e1;font-size:11px;max-height:70vh;overflow-y:auto}
    .wow-shortcuts h3{margin:0 0 14px;color:#fff;font-size:14px;font-weight:600}.wow-shortcuts p{display:flex;justify-content:space-between;align-items:center;margin:10px 0;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)}.wow-shortcuts p:last-child{border:0}.wow-shortcuts kbd{padding:4px 7px;border:1px solid rgba(255,255,255,.18);border-radius:5px;background:rgba(96,165,250,.15);color:#93c5fd;font-family:'Space Mono',monospace;font-size:10px;font-weight:600}
    .wow-shortcuts.hidden{display:none}
    .reduce-motion .wow-star{animation:none}.reduce-motion .wow-cursor{display:none}
    @media (max-width:768px){.wow-shortcuts{width:240px;right:10px;top:62px;font-size:10px}.wow-badge{font-size:9px;right:16px}}
  `;
  document.head.appendChild(style);
  
  const desktop = document.querySelector('#desktop');
  if (!desktop) return;
  
  // Create starfield
  const stars = document.createElement('div');
  stars.className = 'wow-stars';
  for (let i = 0; i < 90; i++) {
    const star = document.createElement('i');
    star.className = 'wow-star';
    star.style.left = `${Math.random()*100}%`;
    star.style.top = `${Math.random()*100}%`;
    star.style.setProperty('--duration', `${2 + Math.random()*5}s`);
    star.style.setProperty('--delay', `${Math.random()*5}s`);
    stars.appendChild(star);
  }
  desktop.prepend(stars);
  
  // Create scanlines
  const scanlines = document.createElement('div');
  scanlines.className = 'wow-scanlines';
  desktop.appendChild(scanlines);
  
  // Create status badge
  const badge = document.createElement('div');
  badge.className = 'wow-badge';
  badge.textContent = '✦ WebOS / online';
  desktop.appendChild(badge);
  
  // Create custom cursor
  const cursor = document.createElement('div');
  cursor.className = 'wow-cursor';
  document.body.appendChild(cursor);
  
  // Create notifications
  const notice = document.createElement('div');
  notice.className = 'wow-notice';
  document.body.appendChild(notice);
  
  let noticeTimer;
  const say = (text) => {
    notice.textContent = text;
    notice.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.classList.remove('show'), 2200);
  };
  
  // Cursor tracking
  document.addEventListener('mousemove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  
  document.addEventListener('mouseover', (event) => {
    if (event.target.closest('button,a,input,textarea,select')) cursor.classList.add('active');
  });
  
  document.addEventListener('mouseout', (event) => {
    if (event.target.closest('button,a,input,textarea,select')) cursor.classList.remove('active');
  });
  
  // Create shortcuts panel
  const shortcuts = document.createElement('div');
  shortcuts.className = 'wow-shortcuts hidden';
  shortcuts.innerHTML = `
    <h3>⚡ WebOS Shortcuts</h3>
    <p><span>Command Palette</span><kbd>Ctrl K</kbd></p>
    <p><span>Focus Mode</span><kbd>Shift Alt F</kbd></p>
    <p><span>Cycle Windows</span><kbd>Alt Tab</kbd></p>
    <p><span>App Launcher</span><kbd>/</kbd></p>
    <p><span>Cinematic Mode</span><kbd>Alt C</kbd></p>
    <p><span>Close Overlays</span><kbd>Esc</kbd></p>
    <p><span>Help</span><kbd>F1</kbd></p>
    <p><span>Toggle Shortcuts</span><kbd>?</kbd></p>
  `;
  document.body.appendChild(shortcuts);
  
  // Keyboard controls
  document.addEventListener('keydown', (event) => {
    if (event.key === '?' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      shortcuts.classList.toggle('hidden');
      say(shortcuts.classList.contains('hidden') ? 'Shortcuts hidden' : 'Shortcuts revealed ⚡');
    }
    if (event.altKey && event.key.toLowerCase() === 'c') {
      desktop.classList.toggle('wow-cinematic');
      say(desktop.classList.contains('wow-cinematic') ? '🎬 Cinematic mode enabled' : '🎬 Cinematic mode disabled');
    }
    if (event.key === 'Escape') shortcuts.classList.add('hidden');
  });
  
  // Network status
  const updateBadge = () => {
    if (navigator.onLine) {
      badge.textContent = '✦ WebOS / online';
      badge.style.color = '#bfdbfe';
    } else {
      badge.textContent = '✦ WebOS / offline';
      badge.style.color = '#fca5a5';
    }
  };
  
  window.addEventListener('online', () => {
    updateBadge();
    say('🌐 Back online — all features available');
  });
  
  window.addEventListener('offline', () => {
    updateBadge();
    say('📡 Offline mode — local apps still work');
  });
  
  updateBadge();
  say('✨ WebOS enhanced! Press ? for shortcuts');
})();
