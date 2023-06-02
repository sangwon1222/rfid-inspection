import { SerialPort } from 'serialport'
import { ipcMain } from 'electron'
import Common, { TypeMiddleware } from '../common'

class Serial implements TypeMiddleware {
  private mPort!: SerialPort
  private mPortOption: { path: string; baudRate: number } = { path: '', baudRate: 0 }
  get list() {
    return SerialPort.list()
  }

  async _check() {
    return Boolean(this.mPort)
  }
  async _disconnect() {
    if (this.mPort) this.mPort.close()
  }

  async _reConnect() {
    const { ok, msg } = await this.connectSerialPort()
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async connectSerialPort(path?: string, baudRate?: number) {
    if (path && baudRate) this.mPortOption = { path, baudRate }

    if (!this.mPort) {
      this.mPort = new SerialPort({
        path: 'COM6',
        baudRate: 9600,
        autoOpen: false
      })
    }

    this.mPort.open((error) => {
      if (error) {
        ipcMain.once('connect-serial', (event, _response) => {
          event.reply('connect-serial', { ok: false, msg: error })
        })
        return { ok: false, msg: error }
      }

      try {
        this.mPort.write('connect')
        ipcMain.once('connect-serial', (event, _response) => {
          event.reply('connect-serial', { ok: true, msg: 'success connect serial port' })
        })
        return { ok: true, msg: 'connect-serial' }
      } catch (e) {
        return { ok: false, msg: e }
      }
    })
    return { ok: true, msg: 'connect-serial' }
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

export default new Serial()
