const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Chess } = require('chess.js'); // chess.js v1 compatibile con require

const game = new Chess(); // stato globale della partita

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  }

  // handler: riceve una mossa e risponde con il nuovo FEN
    ipcMain.handle("make-move", (event, move) => {
      const result = game.move(move);
      if (result === null) return { error: "Illegal move" };
      return { fen: game.fen(), move: result };
    });

    ipcMain.handle("get-fen", () => {
      return game.fen();
    });

}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

