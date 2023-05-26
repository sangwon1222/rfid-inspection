import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, ipcMain, clipboard } from 'electron'
import icon from '../../resources/icon.png?asset'
const { Menu } = require('electron')
import Inspector from './Inspector'
import Printer from './print'
import dbBase from './dbBase'
import { join } from 'path'
import tray from './tray'

const init = async () => {
  const DBProperties = Object.getOwnPropertyNames(Object.getPrototypeOf(dbBase))
  for (let i = 2; i < DBProperties.length; i++) {
    const property = DBProperties[i]
    ipcMain.handle(property, async (_event, res) => {
      const result = await dbBase.excute(property, res ? [...res] : null)
      return result
    })
  }

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
    show: true,
    title: '검수 발행기',
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    icon: icon,
    // frame: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  tray.init(mainWindow, icon)

  mainWindow.on('close', function (event) {
    event.preventDefault()
    if (tray.quitMode) {
      app.exit()
    } else {
      mainWindow.hide()
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.moveTop()
    mainWindow.setKiosk(true)
    // mainWindow.maximize()
    mainWindow.setMinimumSize(800, 600)
    mainWindow.show()
    const menu = Menu.buildFromTemplate([
      { label: app.name.toUpperCase(), icon: clipboard.readImage() },
      { type: 'separator' },
      {
        label: 'Excel',
        submenu: [
          {
            label: 'upload',
            click: () => {
              console.log('upload')
            }
          },
          {
            label: 'delete',
            click: () => {
              console.log('delete')
            }
          }
        ]
      },
      {
        label: 'Mode',
        submenu: [
          {
            label: 'kiosk',
            click: () => {
              mainWindow.setKiosk(true)
            }
          },
          {
            label: 'dev',
            click: () => {
              mainWindow.setKiosk(false)
            }
          }
        ]
      },
      { role: 'reload' }
    ])
    Menu.setApplicationMenu(menu)
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
