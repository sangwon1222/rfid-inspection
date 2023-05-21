import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Printer from './print'
import Inspector from './Inspector'

const init = async () => {
  const PrinterProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(Printer))
  for (let i = 1; i < PrinterProperties.length; i++) {
    const property = PrinterProperties[i]
    ipcMain.handle(property, async (_event, res) => {
      const result = await Printer.excute(property, res ? [...res] : null)
      return result
    })
  }

  const InspectorProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(Inspector))
  for (let i = 1; i < InspectorProperties.length; i++) {
    const property = InspectorProperties[i]
    ipcMain.handle(property, async (_event, res) => {
      const result = await Inspector.excute(property, res ? [...res] : null)
      return result
    })
  }
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    title: '검수 발행기',
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  await init()

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  require('@electron/remote/main').initialize()
  require('@electron/remote/main').enable(mainWindow.webContents)
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
