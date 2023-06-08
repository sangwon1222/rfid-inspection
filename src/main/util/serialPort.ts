import { SerialPort } from 'serialport'
import Common, { TypeMiddleware, TypeResponse } from '../common'

class Serial implements TypeMiddleware {
  private mPort!: SerialPort
  private mPortConnected = false
  private mPortOption: { path: string; baudRate: number } = { path: '', baudRate: 0 }
  get list() {
    return SerialPort.list()
  }

  async _check() {
    // console.log(this.mPort?.isOpen)
    return this.mPortConnected
  }
  async _disconnect() {
    if (this.mPort) this.mPort.destroy()
  }

  async _reConnect() {
    const { path, baudRate } = this.mPortOption
    const { ok, msg } = (await this.connectSerialPort(path, baudRate)) as TypeResponse
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async connectSerialPort(path: string, baudRate: number) {
    return new Promise((resolve, _reject) => {
      this.mPortOption = { path, baudRate }

      this.mPort?.destroy()

      this.mPort = new SerialPort({ path, baudRate, autoOpen: false })
      this.mPort.open((error) => {
        try {
          if (error) {
            this.mPortConnected = false
            this.mPort?.destroy()
            return resolve({ ok: false, msg: error })
          }

          this.mPort.write('connect')
          this.mPortConnected = true

          const msg = 'SERIAL PORT 연결 성공'
          console.log(msg)
          resolve({ ok: true, msg })
        } catch (e) {
          this.mPort?.destroy()
          resolve({ ok: false, msg: e })
        }
      })
    })
  }

  async getStartScan() {
    return new Promise((resolve, _reject) => {
      console.log('getStartScan', this.mPort.isOpen)

      this.mPort.once('data', (data) => {
        // H02 H45 H53 H03
        const feedHex = Buffer.from([0x02, 0x45, 0x53, 0x03])
        const feedCmd = Common.hex_to_hexa(feedHex) //'02455303'
        const receiveData = Common.hex_to_hexa(data)
        if (feedCmd === receiveData) resolve({ ok: true, msg: 'feed-start' })
        else resolve({ ok: false, msg: '검수기에서 FEED를 눌러주세요' })
      })
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      // 'H02  H15 H03'
      const cmd = Buffer.from([0x02, 0x15, 0x03])
      this.mPort.write(cmd)
      console.log(cmd)
      return resolve({ ok: true, msg: `불량` })
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      const cmd = Buffer.from([0x02, 0x06, 0x03])
      // 'H02  H06 H03'
      this.mPort.write(cmd)
      console.log(cmd)
      return resolve({ ok: true, msg: `양품` })
    })
  }
}

export default new Serial()
