(function () {
  'use strict';

  // Prevent double-injection
  if (document.getElementById('tambut-pet-container')) return;

  const CONFIG = { speed: 2, honkFrequency: 5000, footprintDuration: 3000 };
  let x = 100;
  let y = window.innerHeight - 120;
  let dx = CONFIG.speed;
  let dy = CONFIG.speed;
  let enabled = true;
  let intervals = [];

  // Load config from extension bundle
  fetch(chrome.runtime.getURL('config.json'))
    .then(r => r.json())
    .then(data => Object.assign(CONFIG, data))
    .catch(() => {})
    .finally(() => init());

  function init() {
    // Check storage for enabled state
    chrome.storage.local.get({ petEnabled: true }, (result) => {
      enabled = result.petEnabled;
      if (enabled) createPet();
    });

    // Listen for toggle messages from popup
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg.action === 'toggle') {
        enabled = msg.enabled;
        if (enabled) {
          createPet();
        } else {
          removePet();
        }
      }
    });
  }

  function createPet() {
    if (document.getElementById('tambut-pet-container')) return;

    const container = document.createElement('div');
    container.id = 'tambut-pet-container';

    const goose = document.createElement('div');
    goose.id = 'tambut-goose';
    goose.textContent = '\uD83E\uDD86';
    goose.style.left = x + 'px';
    goose.style.top = y + 'px';

    container.appendChild(goose);
    document.body.appendChild(container);

    dx = CONFIG.speed;
    dy = CONFIG.speed;
    startBehavior(container, goose);
  }

  function removePet() {
    const container = document.getElementById('tambut-pet-container');
    if (container) container.remove();
    intervals.forEach(clearInterval);
    intervals = [];
  }

  function startBehavior(container, goose) {
    moveGoose(goose);

    // Random direction changes
    intervals.push(setInterval(() => {
      if (Math.random() < 0.15) {
        dx = (Math.random() - 0.5) * CONFIG.speed * 2;
        dy = (Math.random() - 0.5) * CONFIG.speed * 2;
      }
    }, 1000));

    // Footprints
    intervals.push(setInterval(() => {
      const fp = document.createElement('div');
      fp.className = 'tambut-footprint';
      fp.textContent = '\uD83D\uDC3E';
      fp.style.left = x + 'px';
      fp.style.top = y + 'px';
      container.appendChild(fp);
      setTimeout(() => {
        if (fp.parentNode) fp.parentNode.removeChild(fp);
      }, CONFIG.footprintDuration);
    }, 500));
  }

  function moveGoose(goose) {
    if (!document.getElementById('tambut-pet-container')) return;

    x += dx;
    y += dy;

    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

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
