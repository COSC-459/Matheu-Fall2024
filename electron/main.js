const { app, BrowserWindow, ipcMain, globalShortcut, clipboard } = require("electron")
const path = require("path")
const { machineIdSync } = require("node-machine-id")
const os = require("os")

const { exec } = require("child_process")

let win
let text

function createWindow() {
  win = new BrowserWindow({
    width: 320,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  })

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:3000")
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"))
  }

  const shortcutRegistered = globalShortcut.register("CommandOrControl+Shift+C", () => {
    simulateCopyCommand()

    setTimeout(() => {
      const copiedText = clipboard.readText()

      const modifiedText = `${copiedText}`
      if (text !== modifiedText) {
        text = modifiedText
        console.log("eletr", modifiedText)
        win.webContents.send("copy-text", modifiedText)
      }
    }, 500)
  })

  if (!shortcutRegistered) {
    console.log("Shortcut registration failed")
  }

  app.on("will-quit", () => globalShortcut.unregisterAll())
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.handle("get-device-id", () => {
  return machineIdSync({ original: true })
})

ipcMain.handle("get-device-info", () => {
  return { name: os.hostname(), os: os.type() }
})

ipcMain.handle("copy-text", () => {
  return text
})

function simulateCopyCommand() {
  let command

  if (process.platform === "win32") {
    command = "powershell.exe -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.SendKeys]::SendWait('^c')\""
  } else if (process.platform === "darwin") {
    command = 'osascript -e \'tell application "System Events" to keystroke "c" using {command down}\''
  } else {
    console.error("Unsupported platform for copy simulation.")
    return
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error simulating copy command:", error.message)
    } else if (stderr) {
      console.error("Command error output:", stderr)
    } else {
      console.log("Copy command simulated successfully:", stdout)
    }
  })
}
