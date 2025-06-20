const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Chess } = require("chess.js"); // chess.js v1 compatibile con require
const StockfishFactory = require("stockfish.wasm");

const game = new Chess(); // stato globale della partita
let stockfishEngine = null;

ipcMain.handle("make-move", (_, move) => {
  const result = game.move(move);
  if (result === null) return { error: "Illegal move" };
  return { fen: game.fen(), move: result };
});

ipcMain.handle("get-fen", () => {
  return game.fen();
});

ipcMain.handle("get-history", () => {
  return game.history();
});

ipcMain.handle("reset-game", () => {
  game.reset();
  return { fen: game.fen() };
});

// Inizializza Stockfish
async function initStockfish() {
  try {
    stockfishEngine = await StockfishFactory();
    stockfishEngine.postMessage("uci");
    stockfishEngine.postMessage("ucinewgame");
    console.log("Stockfish WASM inizializzato");
  } catch (error) {
    console.error("Errore inizializzazione Stockfish:", error);
  }
}

ipcMain.handle("get-best-move", (_, fen) => {
  return new Promise((resolve, reject) => {
    if (!stockfishEngine) {
      reject(new Error("Stockfish non inizializzato"));
      return;
    }

    const onMessage = (line) => {
      if (typeof line === "string" && line.includes("bestmove")) {
        stockfishEngine.removeMessageListener(onMessage);
        const move = line.split("bestmove ")[1].split(" ")[0];
        resolve(move);
      }
    };

    stockfishEngine.addMessageListener(onMessage);
    stockfishEngine.postMessage(`position fen ${fen}`);
    stockfishEngine.postMessage("go depth 10");

    // Timeout dopo 5 secondi
    setTimeout(() => {
      stockfishEngine.removeMessageListener(onMessage);
      reject(new Error("Timeout"));
    }, 5000);
  });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  initStockfish();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
