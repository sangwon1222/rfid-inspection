import { SerialPort } from 'serialport'

class InspectionPort {
  private mPort: SerialPort
  get list() {
    return SerialPort.list()
  }
  constructor() {
    this.mPort = new SerialPort({
      path: 'COM3',
      baudRate: 9600
    })
  }
  async init() {
    console.log(await SerialPort.list())
    this.mPort.open((error) => {
      if (error) return console.log(error)
      this.mPort.write('connect')
    })
  }

  async open() {
    this.mPort.on('open', () => {
      console.log('open logic')
      console.log(this.mPort)
      this.mPort.on('data', function (data) {
        console.log('Data:', data)
      })
    })
  }
}

export default new InspectionPort()
