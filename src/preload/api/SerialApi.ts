export default class SerialApi {
  private mIpcRenderer: any
  constructor(ipcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  async connectSerialPort(path, baudRate) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer
        .invoke('connectSerialPort', [path, baudRate])
        .then((result) => resolve(result))
    })
  }

  async getStartScan() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('getStartScan').then((result) => resolve(result))
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('defective').then((result) => resolve(result))
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('passed').then((result) => resolve(result))
    })
  }
}
