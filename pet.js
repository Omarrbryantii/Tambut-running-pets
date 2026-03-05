(function () {
  const goose = document.getElementById('goose');
  let config = {};
  let x = 100;
  let y = 100;
  let dx = 0;
  let dy = 0;
  let animationId = null;

  // Resolve config path for both Electron and Chrome extension contexts
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
      config = { speed: 2, honkFrequency: 5000, footprintDuration: 3000 };
      dx = config.speed;
      dy = config.speed;
      startBehavior();
    });

  function startBehavior() {
    moveGoose();

    // Randomly change direction
    setInterval(() => {
      if (Math.random() < 0.1) {
        dx = (Math.random() - 0.5) * config.speed * 2;
        dy = (Math.random() - 0.5) * config.speed * 2;
      }
    }, 1000);

    // Honk
    setInterval(() => {
      console.log('Honk!');
    }, config.honkFrequency);

    // Footprints
    setInterval(() => {
      const footprint = document.createElement('div');
      footprint.className = 'footprint';
      footprint.textContent = '\uD83D\uDC3E';
      footprint.style.left = x + 'px';
      footprint.style.top = y + 'px';
      document.body.appendChild(footprint);
      setTimeout(() => {
        if (footprint.parentNode) {
          footprint.parentNode.removeChild(footprint);
        }
      }, config.footprintDuration);
    }, 500);
  }

  function moveGoose() {
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

    animationId = requestAnimationFrame(() => {
      setTimeout(moveGoose, 30);
    });
  }
})();
