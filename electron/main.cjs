const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { Chess } = require("chess.js"); // chess.js v1 compatibile con require
const StockfishFactory = require("stockfish.wasm");
const packageJson = require("../package.json");
const { setTimeout } = require("timers");

const game = new Chess(); // stato globale della partita
let stockfishEngine = null;
let authenticatedUser = null;
let mainWindow = null;

const buildMainWin = ({ preloadPath }) => {
  return new BrowserWindow({
    width: 1024,
    height: 674,
    icon: app.isPackaged
      ? path.join(__dirname, "../assets/icon.png")
      : path.join(__dirname, "../assets/icon.png"),
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
    // resizable: false,
  });
};

const buildAuthWindows = () => {
  return new BrowserWindow({
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
    },
  });
};

ipcMain.handle("get-authenticated-user", () => {
  return authenticatedUser; // può essere null o un oggetto utente
});

ipcMain.handle("open-google-login", async () => {
  const preloadPath = app.isPackaged
    ? path.join(__dirname, "preload.js")
    : path.join(__dirname, "preload.js");

  const authWindow = buildAuthWindows();

  // @todo move client_id in a configuration file
  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?client_id=15368719510-up1i58aamuvdvu1u49lerh8lamrrapfj.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fsimonegentili.com%2Fapi%2Fchess%2Foauth%2Fcallback&response_type=code&scope=email%20profile&access_type=offline&prompt=consent";

  authWindow.loadURL(authUrl);

  async function waitForAuthData(win, timeout = 10000, interval = 200) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      const content = await win.webContents.executeJavaScript(`
        document.getElementById('auth-data')?.innerText;
      `);

      if (content && content !== "undefined") return content;
      await new Promise((r) => setTimeout(r, interval));
    }

    return null; // timeout
  }

  authWindow.webContents.on("did-finish-load", async () => {
    try {
      const rawUser = await waitForAuthData(authWindow);
      if (!rawUser) {
        console.error("❌ Auth data non disponibile dopo timeout");
        return;
      }

      const user = JSON.parse(rawUser);
      console.log("✅ Utente autenticato:", user);
      authenticatedUser = user;
      authWindow.close();

      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("auth-success", user);
      } else {
        console.error("❌ mainWindow non definita");
      }
    } catch (err) {
      console.error("❌ Errore durante l'attesa di auth-data:", err);
    }
  });
});

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

ipcMain.handle("get-version", () => {
  return packageJson.version;
});

// Set opening position by applying a sequence of moves
ipcMain.handle("set-opening-position", (_, moves) => {
  try {
    game.reset(); // Start from initial position

    const appliedMoves = [];
    for (const moveStr of moves) {
      const result = game.move(moveStr);
      if (result === null) {
        // If move is invalid, reset and return error
        game.reset();
        return {
          error: `Invalid move in opening: ${moveStr}`,
          fen: game.fen(),
          appliedMoves: [],
        };
      }
      appliedMoves.push(result);
    }

    return {
      success: true,
      fen: game.fen(),
      appliedMoves: appliedMoves,
      history: game.history(),
    };
  } catch (error) {
    game.reset();
    return {
      error: `Error applying opening: ${error.message}`,
      fen: game.fen(),
      appliedMoves: [],
    };
  }
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

ipcMain.handle("get-multiple-moves", (_, fen) => {
  return new Promise((resolve, reject) => {
    if (!stockfishEngine) {
      reject(new Error("Stockfish non inizializzato"));
      return;
    }

    const moves = [];
    let finished = false;

    const onMessage = (line) => {
      if (typeof line === "string") {
        if (
          line.includes("info") &&
          line.includes("pv") &&
          line.includes("multipv")
        ) {
          // Parse multipv line to extract move
          const pvMatch = line.match(/pv\s+([a-h][1-8][a-h][1-8][qrbn]?)/);
          const multipvMatch = line.match(/multipv\s+(\d+)/);

          if (pvMatch && multipvMatch) {
            const move = pvMatch[1];
            const index = parseInt(multipvMatch[1]) - 1;
            moves[index] = move;
          }
        } else if (line.includes("bestmove") && !finished) {
          finished = true;
          stockfishEngine.removeMessageListener(onMessage);
          // Return up to 3 moves, filtering out any undefined values
          resolve(moves.filter((move) => move).slice(0, 3));
        }
      }
    };

    stockfishEngine.addMessageListener(onMessage);
    stockfishEngine.postMessage("setoption name MultiPV value 3");
    stockfishEngine.postMessage(`position fen ${fen}`);
    stockfishEngine.postMessage("go depth 10");

    // Timeout dopo 5 secondi
    setTimeout(() => {
      if (!finished) {
        finished = true;
        stockfishEngine.removeMessageListener(onMessage);
        stockfishEngine.postMessage("setoption name MultiPV value 1"); // Reset MultiPV
        reject(new Error("Timeout"));
      }
    }, 5000);
  });
});

function createWindow() {
  // Percorso corretto per preload in dev e production
  const preloadPath = app.isPackaged
    ? path.join(__dirname, "preload.js")
    : path.join(__dirname, "preload.js");

  console.log("Preload path:", preloadPath);
  console.log("App is packaged:", app.isPackaged);
  console.log("__dirname:", __dirname);

  const win = buildMainWin({ preloadPath });
  mainWindow = win;

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
    // Only open DevTools in development
    if (!app.isPackaged) {
      win.webContents.openDevTools();
    }
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
