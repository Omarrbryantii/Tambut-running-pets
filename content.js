(function () {
  'use strict';

  if (document.getElementById('tambut-pet-host')) return;

  const CONFIG = { speed: 2, honkFrequency: 5000, footprintDuration: 3000 };
  let x = 200;
  let y = 300;
  let dx = CONFIG.speed;
  let dy = CONFIG.speed;
  let intervals = [];
  let host = null;
  let shadow = null;

  fetch(chrome.runtime.getURL('config.json'))
    .then(r => r.json())
    .then(data => Object.assign(CONFIG, data))
    .catch(() => {})
    .finally(() => {
      dx = CONFIG.speed;
      dy = CONFIG.speed;
      init();
    });

  function init() {
    chrome.storage.local.get({ petEnabled: true }, (result) => {
      if (result.petEnabled) createPet();
    });

    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'toggle') {
        if (msg.enabled) {
          createPet();
        } else {
          removePet();
        }
      }
    });
  }

  function createPet() {
    if (document.getElementById('tambut-pet-host')) return;

    // Use shadow DOM so page CSS cannot interfere
    host = document.createElement('div');
    host.id = 'tambut-pet-host';
    host.style.cssText = 'position:fixed!important;top:0!important;left:0!important;width:0!important;height:0!important;overflow:visible!important;z-index:2147483647!important;pointer-events:none!important;margin:0!important;padding:0!important;border:none!important;background:none!important;';
    shadow = host.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = `
      #goose {
        position: fixed;
        font-size: 64px;
        z-index: 2147483647;
        pointer-events: none;
        user-select: none;
        line-height: 1;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
        transition: none;
      }
      .footprint {
        position: fixed;
        font-size: 18px;
        opacity: 0.4;
        pointer-events: none;
        user-select: none;
        line-height: 1;
      }
    `;
    shadow.appendChild(style);

    const goose = document.createElement('div');
    goose.id = 'goose';
    goose.textContent = '\uD83E\uDD86';
    goose.style.left = x + 'px';
    goose.style.top = y + 'px';
    shadow.appendChild(goose);

    document.documentElement.appendChild(host);

    startBehavior(goose);
  }

  function removePet() {
    intervals.forEach(clearInterval);
    intervals = [];
    const el = document.getElementById('tambut-pet-host');
    if (el) el.remove();
    host = null;
    shadow = null;
  }

  function startBehavior(goose) {
    moveGoose(goose);

    intervals.push(setInterval(() => {
      if (Math.random() < 0.15) {
        dx = (Math.random() - 0.5) * CONFIG.speed * 2;
        dy = (Math.random() - 0.5) * CONFIG.speed * 2;
      }
    }, 1000));

    intervals.push(setInterval(() => {
      if (!shadow) return;
      const fp = document.createElement('div');
      fp.className = 'footprint';
      fp.textContent = '\uD83D\uDC3E';
      fp.style.left = x + 'px';
      fp.style.top = y + 'px';
      shadow.appendChild(fp);
      setTimeout(() => {
        if (fp.parentNode) fp.parentNode.removeChild(fp);
      }, CONFIG.footprintDuration);
    }, 500));
  }

  function moveGoose(goose) {
    if (!document.getElementById('tambut-pet-host')) return;

    x += dx;
    y += dy;

    const maxX = window.innerWidth - 64;
    const maxY = window.innerHeight - 64;

    if (x <= 0) { x = 0; dx = Math.abs(dx); }
    if (x >= maxX) { x = maxX; dx = -Math.abs(dx); }
    if (y <= 0) { y = 0; dy = Math.abs(dy); }
    if (y >= maxY) { y = maxY; dy = -Math.abs(dy); }

    goose.style.left = x + 'px';
    goose.style.top = y + 'px';

    setTimeout(() => {
      requestAnimationFrame(() => moveGoose(goose));
    }, 30);
  }
})();
