export default class SerialApi {
  private mIpcRenderer: any
  constructor(ipcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  async connectSerialPort(path: string, baudRate: number) {
    return new Promise((resolve, _reject) => {
      const parmas = [path, baudRate]
      const func = 'connectSerialPort'
      this.mIpcRenderer.invoke(func, parmas).then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async getStartScan() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('getStartScan').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('defective').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('passed').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }
}
