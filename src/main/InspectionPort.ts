import { SerialPort } from 'serialport'

class InspectionPort {
  private mPort: SerialPort
  get list() {
    return SerialPort.list()
  }
  constructor() {
    this.mPort = new SerialPort({
      path: 'com3',
      baudRate: 9600
    })
  }
  async init() {
    this.mPort.open((error) => {
      // if (error) return console.log(error)
      this.mPort.write('connect')
    })
  }

  async open() {
    this.mPort.on('open', () => {
      // console.log('open logic')
      this.mPort.on('data', function (data) {
        console.log('Data:', data)
      })
    })
  }
}

export default new InspectionPort()
