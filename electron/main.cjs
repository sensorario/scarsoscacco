const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // se lo usi
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // 👈 versione build
    win.webContents.openDevTools();
  } else {
    win.loadURL('http://localhost:5173'); // 👈 solo in dev
  }
}

app.whenReady().then(createWindow);

