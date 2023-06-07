interface TypeObjectValueNumber {
  [key: string]: number
}
interface TypeObjectValueAny {
  [key: string]: any
}

export default class TCPApi {
  private mIpcRenderer: any
  constructor(ipcRenderer: Electron.IpcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  async connectPrint({ host, port }: TypeObjectValueAny) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('connectTCP', { host, port }).then((result) => resolve(result))
    })
  }

  async antenna({ atn1, atn2, atn3, atn4 }: TypeObjectValueNumber) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer
        .invoke('antenna', { atn1, atn2, atn3, atn4 })
        .then((result: any) => resolve(result))
    })
  }

  async onPowerGain(arg?: any[]) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer
        .invoke('onPowerGain', arg ? arg : null)
        .then(({ ok, msg }: TypeObjectValueAny) => resolve({ ok, msg }))
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
      this.mIpcRenderer
        .invoke('onMemoryRead', [byteLength])
        .then(({ ok, msg }: TypeObjectValueAny) => resolve({ ok, msg }))
    })
  }

  async onMemoryWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer
        .invoke('onMemoryWrite', [encode])
        .then(({ ok, msg }: TypeObjectValueAny) => resolve({ ok, msg }))
    })
  }
}
