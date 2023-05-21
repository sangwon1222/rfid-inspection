import { SerialPort } from 'serialport'
import { ipcMain } from 'electron'
class Inspector {
  private mPort!: SerialPort
  get list() {
    return SerialPort.list()
  }
  constructor() {
    this.mPort = new SerialPort({
      path: 'COM4',
      baudRate: 9600,
      autoOpen: false
    })
  }
  async excute(funcName: string, arg?: any) {
    const result = arg ? await this[funcName](...arg) : await this[funcName]()
    return result
  }

  async _connectInspector() {
    if (this.mPort) this.mPort.close()
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
    this.mPort.once('error', (err) => {
      console.log('Error: ', err.message)
    })
    // Read data that is available but keep the stream in "paused mode"
    this.mPort.once('readable', () => {
      const read = this.mPort.read()
      console.log('Data:', read)
    })
  }

  async defective() {
    return new Promise((resolve, _reject) => {
      const cmd = 'H02  H15 H03'
      this.mPort.write(cmd)
      return resolve(`${cmd} 불량`)
    })
  }

  async passed() {
    return new Promise((resolve, _reject) => {
      const cmd = 'H02  H06 H03'
      this.mPort.write(cmd)
      return resolve(`${cmd} 양품`)
    })
  }
}

export default new Inspector()
