const goose = document.getElementById('goose');
let config = {};
let x = 100;
let y = 100;
let dx, dy;

// Use chrome.runtime.getURL if running as extension, otherwise fallback for Electron
const configUrl =
  typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
    ? chrome.runtime.getURL('config.json')
    : 'config.json';

fetch(configUrl)
  .then(response => response.json())
  .then(data => {
    config = data;
    dx = config.speed;
    dy = config.speed;
    startBehavior();
  })
  .catch(err => {
    console.error('Failed to load config:', err);
    config = { speed: 2, honkFrequency: 5000, footprintDuration: 3000, mouseDragChance: 0.1 };
    dx = config.speed;
    dy = config.speed;
    startBehavior();
  });

function startBehavior() {
  moveGoose();
  setInterval(() => {
    if (Math.random() < 0.1) {
      dx = (Math.random() - 0.5) * config.speed * 2;
      dy = (Math.random() - 0.5) * config.speed * 2;
    }
  }, 1000);

  setInterval(() => {
    console.log('Honk!');
  }, config.honkFrequency);

  setInterval(() => {
    const footprint = document.createElement('div');
    footprint.className = 'footprint';
    footprint.textContent = '\uD83D\uDC3E';
    footprint.style.left = x + 'px';
    footprint.style.top = y + 'px';
    document.body.appendChild(footprint);
    setTimeout(() => {
      document.body.removeChild(footprint);
    }, config.footprintDuration);
  }, 500);
}

function moveGoose() {
  x += dx;
  y += dy;

  if (x <= 0 || x >= window.innerWidth - 50) dx = -dx;
  if (y <= 0 || y >= window.innerHeight - 50) dy = -dy;

  goose.style.left = x + 'px';
  goose.style.top = y + 'px';

  setTimeout(moveGoose, 50);
}
