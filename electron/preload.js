// preload.js
const { contextBridge, ipcRenderer } = require("electron")

console.log("Preload script loaded")

contextBridge.exposeInMainWorld("electron", {
  getDeviceId: () => ipcRenderer.invoke("get-device-id"),
  getDeviceInfo: () => ipcRenderer.invoke("get-device-info"),
  onCopyText: (callback) =>
    ipcRenderer.on("copy-text", (event, text) => {
      callback(text)
    }),
})
