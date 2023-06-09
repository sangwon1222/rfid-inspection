interface TypeObject {
  [key: string]: any
}

export default class TCPApi {
  private mIpcRenderer: any
  constructor(ipcRenderer: Electron.IpcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }

  async connectPrint({ host, port }: TypeObject) {
    return new Promise((resolve, _reject) => {
      const params = { host, port }
      this.mIpcRenderer.invoke('_connectTCP', params).then((result) => resolve(result))
    })
  }

  async disconnect() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('_disconnectTCP').then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async antenna({ atn1, atn2, atn3, atn4 }: TypeObject) {
    return new Promise((resolve, _reject) => {
      const params = { atn1, atn2, atn3, atn4 }
      this.mIpcRenderer.invoke('antenna', params).then((result: any) => resolve(result))
    })
  }

  async onPowerGain(arg?: any[]) {
    return new Promise((resolve, _reject) => {
      const params = arg ? arg : null
      this.mIpcRenderer.invoke('onPowerGain', params).then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async onBuzzer() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('onBuzzer').then((result: any) => resolve(result))
    })
  }

  async offBuzzer() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('offBuzzer').then((result: any) => resolve(result))
    })
  }

  async onStop() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('onStop').then((result) => resolve(result))
    })
  }

  async getReaderState() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('getReaderState').then((result: unknown) => resolve(result))
    })
  }

  async onMemoryRead(byteLength: number) {
    return new Promise((resolve, _reject) => {
      const params = [byteLength]
      this.mIpcRenderer.invoke('onMemoryRead', params).then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }

  async onMemoryWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer
        .invoke('onMemoryWrite', [encode])
        .then(({ ok, msg }) => resolve({ ok, msg }))
    })
  }
}
