import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI, ElectronAPI } from '@electron-toolkit/preload'
import DBApi from './api/DBApi'
import SerialApi from './api/SerialApi'
import TCPApi from './api/TCPApi'

const DBapi = new DBApi(ipcRenderer)
const Serialapi = new SerialApi(ipcRenderer)
const TCPapi = new TCPApi(ipcRenderer)

interface TypdApi {
  [key: string]: any
}

declare global {
  interface Window {
    electron?: ElectronAPI
    api?: any
    DBapi: TypdApi
    Serialapi: TypdApi
    TCPapi: TypdApi
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('DBapi', DBapi)
    contextBridge.exposeInMainWorld('Serialapi', Serialapi)
    contextBridge.exposeInMainWorld('TCPapi', TCPapi)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI as ElectronAPI
  window.DBapi = DBapi as TypdApi
  window.Serialapi = Serialapi as TypdApi
  window.TCPapi = TCPapi as TypdApi
}
