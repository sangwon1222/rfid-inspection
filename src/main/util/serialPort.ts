import { SerialPort } from 'serialport'
import { ipcMain } from 'electron'
import Common, { TypeMiddleware } from '../common'

class Serial implements TypeMiddleware {
  private mPort!: SerialPort
  private mPortConnected = false
  private mPortOption: { path: string; baudRate: number } = { path: '', baudRate: 0 }
  get list() {
    return SerialPort.list()
  }

  async _check() {
    return this.mPortConnected
  }
  async _disconnect() {
    if (this.mPort) this.mPort.close()
  }

  async _reConnect() {
    const { path, baudRate } = this.mPortOption
    const { ok, msg } = await this.connectSerialPort(path, baudRate)
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async connectSerialPort(path: string, baudRate: number) {
    if (path && baudRate) this.mPortOption = { path, baudRate }

    if (!this.mPort) {
      this.mPort = new SerialPort({ path, baudRate, autoOpen: false })
    }

    this.mPort.open((error) => {
      if (error) {
        this.mPortConnected = false
        return { ok: false, msg: error }
      }

      try {
        this.mPort.write('connect')
        this.mPortConnected = true
        console.log('SERIAL PORT 연결 성공')

        return { ok: true, msg: 'connect-serial' }
      } catch (e) {
        return { ok: false, msg: e }
      }
    })
    return { ok: true, msg: 'connect-serial' }
  }

  async getStartScan() {
    return new Promise((resolve, _reject) => {
      this.mPort.once('data', (data) => {
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
