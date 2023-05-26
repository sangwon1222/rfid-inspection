import { SerialPort } from 'serialport'
import { ipcMain } from 'electron'
import Common from './common'
import MiddleWare from './middleWare'

class Inspector extends MiddleWare {
  private mPort!: SerialPort
  get list() {
    return SerialPort.list()
  }

  async _connectInspector() {
    if (this.mPort) {
      this.mPort.close()
    } else {
      this.mPort = new SerialPort({
        path: 'COM6',
        baudRate: 9600,
        autoOpen: false
      })
    }

    this.mPort.once('close', () => {
      console.log('close')
    })
    this.mPort.open((error) => {
      if (error) return console.log(error)
      this.mPort.write('connect')
      console.log('open')
      ipcMain.once('connect-inspector', (event, _response) => {
        event.reply('connect-inspector', { ok: true, msg: 'success connect inspector' })
      })
    })
    // Read data that is available but keep the stream in "paused mode"
    this.mPort.on('readable', () => {
      const read = this.mPort.read()
      if (read) console.log('readable', read)
    })
  }

  async getStartScanCode() {
    return new Promise((resolve, _reject) => {
      this.mPort.on('data', (data) => {
        // H02 H45 H53 H03
        const hex = Buffer.from([0x02, 0x45, 0x53, 0x03])
        const feed = Common.hex_to_hexa(hex)
        console.log(data)
        console.log(feed)
        if (feed === '02455303') {
          return resolve('feedStart')
        }
      })
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      const cmd = Buffer.from([0x02, 0x15, 0x03])
      // 'H02  H15 H03'
      this.mPort.write(cmd)
      return resolve(`불량`)
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      const cmd = Buffer.from([0x02, 0x06, 0x03])
      // 'H02  H06 H03'
      this.mPort.write(cmd)
      return resolve(`양품`)
    })
  }
}

export default new Inspector()
