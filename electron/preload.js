const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  electronAPI: {
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  },
  stockfish: {
    getBestMove: (fen) => ipcRenderer.invoke("get-best-move", fen),
    getMultipleMoves: (fen) => ipcRenderer.invoke("get-multiple-moves", fen),
  },
  chessApi: {
    makeMove: (move) => ipcRenderer.invoke("make-move", move),
    getFen: () => ipcRenderer.invoke("get-fen"),
    getHistory: () => ipcRenderer.invoke("get-history"),
    resetGame: () => ipcRenderer.invoke("reset-game"),
    getVersion: () => ipcRenderer.invoke("get-version"),
    setOpeningPosition: (moves) =>
      ipcRenderer.invoke("set-opening-position", moves),
  },
});
