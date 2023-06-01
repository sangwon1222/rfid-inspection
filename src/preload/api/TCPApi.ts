export default class TCPApi {
  private mIpcRenderer: any
  constructor(ipcRenderer) {
    this.mIpcRenderer = ipcRenderer
  }
  async connectPrint() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('connectTCP', ['192.168.9.6', 5578]).then((result) => {
        return resolve(result)
      })
    })
  }

  async antenna({ atn1, atn2, atn3, atn4 }: { [key: string]: number }) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('antenna', [atn1, atn2, atn3, atn4]).then((result) => {
        return resolve(result)
      })
    })
  }

  async onPowerGain(arg?: any[]) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('onPowerGain', arg ? arg : null).then((result) => {
        return resolve(result)
      })
    })
  }

  async onBuzzer() {
    await this.mIpcRenderer.invoke('onBuzzer').then((result) => {
      console.log(result)
    })
  }

  async offBuzzer() {
    await this.mIpcRenderer.invoke('offBuzzer').then((result) => {
      console.log(result)
    })
  }

  async onStop() {
    // store.print.isInspectStop = true
    // await this.mIpcRenderer.invoke('onStop').then((result) => {
    //   console.log('onStop', store.print.isInspectStop)
    //   console.log(result)
    // })
  }

  async getReaderState() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('getReaderState').then((result) => {
        console.log(result)
        return resolve(result)
      })
    })
  }

  async onMemoryRead() {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('onMemoryRead').then((result) => {
        return resolve({ ok: true, msg: result })
      })
    })
  }

  async onWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      this.mIpcRenderer.invoke('onWrite', [encode]).then((result) => {
        return resolve({ ok: true, msg: result })
      })
    })
  }
}
