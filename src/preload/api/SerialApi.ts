export default class SerialApi {
  private mIpcRenderer: any
  constructor(ipcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  async connectSerialPort() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('connectSerialPort').then((_result) => {
        this.mIpcRenderer.send('connect-serial', 'serial')
        this.mIpcRenderer.once('connect-serial', (_evt, payload) => {
          resolve(payload)
        })
      })
    })
  }

  async getStartScanCode() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('getStartScanCode').then((result) => {
        return resolve(result)
      })
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('defective').then((result) => {
        return resolve(result)
      })
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('passed').then((result) => {
        return resolve(result)
      })
    })
  }
}