const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("chessApi", {
  makeMove: (move) => ipcRenderer.invoke("make-move", move),
  getFen: () => ipcRenderer.invoke("get-fen"),
  getHistory: () => ipcRenderer.invoke("get-history"),
});
