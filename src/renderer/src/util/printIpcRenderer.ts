import { store } from '../store/store'
const { ipcRenderer } = require('electron')

class PrintIpcRenderer {
  // ------------------PRINTER
  connectPrint = async () => {
    await ipcRenderer.invoke('_connectTCP', ['192.168.9.6', 5578]).then((result) => {
      const { ok, msg } = result
      store.print.connect = ok
      store.print.connectMsg = msg
    })
  }

  async antenna() {
    try {
      const { atn1, atn2, atn3, atn4 } = store.print.atnInfo
      if (!atn1 && !atn2 && !atn3 && !atn4) {
        store.print.atnInfo = { atn1: 0, atn2: 0, atn3: 0, atn4: 0 }
        return console.log('안테나 값 입력해주세요.')
      }

      await ipcRenderer.invoke('antenna', [atn1, atn2, atn3, atn4]).then((result) => {
        console.log(result)
      })
    } catch (e) {
      console.error(e)
    }
  }

  async onPowerGain(attenaIndex: number) {
    const atnName = `atn${attenaIndex}`
    const arg = []
    if (attenaIndex <= 4) arg.push(store.print.powerGain[atnName], attenaIndex)
    else arg.push(store.print.powerGain[atnName])

    await ipcRenderer.invoke('onPowerGain', arg).then((result) => {
      console.log(result)
    })
  }

  async onBuzzer() {
    await ipcRenderer.invoke('onBuzzer').then((result) => {
      console.log(result)
    })
  }

  async offBuzzer() {
    await ipcRenderer.invoke('offBuzzer').then((result) => {
      console.log(result)
    })
  }

  async onStop() {
    store.print.isInspectStop = true
    await ipcRenderer.invoke('onStop').then((result) => {
      console.log('onStop', store.print.isInspectStop)
      console.log(result)
    })
  }

  async getReaderState() {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('getReaderState').then((result) => {
        console.log(result)
        return resolve(result)
      })
    })
  }

  async onMemoryRead() {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('onMemoryRead').then((result) => {
        return resolve({ ok: true, msg: result })
      })
    })
  }

  async onWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('onWrite', [encode]).then((result) => {
        return resolve({ ok: true, msg: result })
      })
    })
  }
}

export default new PrintIpcRenderer()
