const { app, BrowserWindow, Tray, Menu, globalShortcut, screen } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    x: 0,
    y: 0,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: false,
    resizable: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Allow clicks to pass through the transparent areas
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Use a simple icon — falls back to Electron default
  tray = new Tray(path.join(__dirname, 'assets', 'icon.png'));
  tray.setToolTip('Tambut Running Pet');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Quit Tambut Pet', click: () => app.quit() },
  ]));
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  // ESC to quit
  globalShortcut.register('Escape', () => {
    app.quit();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});