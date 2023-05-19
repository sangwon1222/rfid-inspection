import { store } from '../store/store'
const { ipcRenderer } = require('electron')

class CustomIpcRenderer {
  connectPrint = async () => {
    await ipcRenderer.invoke('_connectTCP', ['192.168.9.6', 5578]).then((_result) => {
      ipcRenderer.send('connect-status')
      ipcRenderer.once('connect-status', (_event, { ok, msg }) => {
        store.print.connect = ok
        store.print.connectMsg = msg
        console.log(`connect : [ ${ok} ]`)
      })
    })
  }

  async antenna() {
    const [atn1, atn2, atn3, atn4] = store.print.atnInfo
    if (!atn1 && !atn2 && !atn3 && !atn4) {
      return console.log('안테나 값 입력해주세요.')
    }

    try {
      await ipcRenderer.invoke('antenna', [atn1, atn2, atn3, atn4]).then((result) => {
        console.log(result)
      })
    } catch (e) {
      console.error(e)
    }
  }

  async onPowerGain() {
    console.log(store.print.powerGain)
    await ipcRenderer.invoke('onPowerGain', [+store.print.powerGain]).then((result) => {
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
    await ipcRenderer.invoke('onStop').then((result) => {
      console.log(result)
    })
  }

  async onScan() {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('onScan').then((result) => {
        resolve(result)
      })
    })
  }

  async onWrite(barcode: string) {
    return new Promise((resolve, _reject) => {
      ipcRenderer.invoke('onWrite', [barcode]).then((result) => {
        resolve(result)
      })
    })
  }

  async onPowerGainWeek() {
    await ipcRenderer.invoke('onPowerGainWeek').then((result) => {
      console.log(result)
    })
  }
}

export default new CustomIpcRenderer()
