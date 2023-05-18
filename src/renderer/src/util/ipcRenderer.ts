import { IpcRenderer } from 'electron'
import { print } from '../store/print'
const { ipcRenderer } = require('electron')

class CustomIpcRenderer {
  connectPrint = async () => {
    await ipcRenderer.invoke('_connectTCP', ['192.168.9.6', 5578]).then((_result) => {
      ipcRenderer.send('connect-status')
      ipcRenderer.on('connect-status', (_event, { ok, msg }) => {
        print.connect = ok
        print.connectMsg = msg
      })
    })
  }

  async antenna(e: SubmitEvent) {
    if (!e) return
    const atn1 = +e.target['atn1'].value
    const atn2 = +e.target['atn2'].value
    const atn3 = +e.target['atn3'].value
    const atn4 = +e.target['atn4'].value

    if (!atn1 && !atn2 && !atn3 && !atn4) {
      e.target['atn1'].select()
      return console.log('안테나 값 채워주세요.')
    }

    try {
      await ipcRenderer.invoke('antenna', [atn1, atn2, atn3, atn4]).then((result) => {
        console.log(result)
      })
    } catch (e) {
      console.error(e)
    }
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
    await ipcRenderer.invoke('onScan').then((result) => {
      console.log(result)
    })
  }

  async onPowerGainWeek() {
    await ipcRenderer.invoke('onPowerGainWeek').then((result) => {
      console.log(result)
    })
  }
}

export default new CustomIpcRenderer()
