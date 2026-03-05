const btn = document.getElementById('toggle');

chrome.storage.local.get({ petEnabled: true }, (result) => {
  updateButton(result.petEnabled);
});

btn.addEventListener('click', () => {
  chrome.storage.local.get({ petEnabled: true }, (result) => {
    const newState = !result.petEnabled;
    chrome.storage.local.set({ petEnabled: newState });
    updateButton(newState);

    // Send toggle to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: 'toggle', enabled: newState }).catch(() => {});
      });
    });
  });
});

function updateButton(enabled) {
  btn.textContent = enabled ? 'Pet is ON' : 'Pet is OFF';
  btn.className = enabled ? 'on' : 'off';
}
