const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  chessApi: {
    makeMove: (move) => ipcRenderer.invoke("make-move", move),
    getFen: () => ipcRenderer.invoke("get-fen"),
    getHistory: () => ipcRenderer.invoke("get-history"),
    resetGame: () => ipcRenderer.invoke("reset-game"),
  },
});
