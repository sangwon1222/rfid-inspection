import idroPacket from './idroPacket'
import MiddleWare from './middleWare'
import { ipcMain } from 'electron'
import Common from './common'
import net from 'net'

class Printer extends MiddleWare {
  private mTcp!: net.Socket

  async _connectTCP(host: string, port: number) {
    console.log(host, port)

    this.mTcp = net.createConnection({ host, port })
    this.mTcp.setMaxListeners(50)
    this.mTcp.on('connect', () => {
      ipcMain.once('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: true, msg: 'success connect' })
      })
    })
    this.mTcp.on('end', () => {
      ipcMain.once('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'end connect' })
      })
    })
    this.mTcp.on('close', () => {
      ipcMain.once('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'close connect' })
      })
    })
    this.mTcp.on('error', () => {
      ipcMain.once('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'error connect' })
      })
    })
    const ok = this.mTcp ? this.mTcp.connecting : false
    const msg = ok ? 'connected' : 'disconnected..'
    return { ok, msg }
  }

  async _check() {
    return Boolean(this.mTcp)
  }

  antenna(atn1: number, atn2: number, atn3: number, atn4: number) {
    const atn1Name = atn1 ? 'Atn1' : ''
    const atn2Name = atn2 ? 'Atn2' : ''
    const atn3Name = atn3 ? 'Atn3' : ''
    const atn4Name = atn4 ? 'Atn4' : ''
    const antennaCmd = `on${atn1Name}${atn2Name}${atn3Name}${atn4Name}`.trim()

    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket[antennaCmd])
    return { info: antennaCmd, cmd: idroPacket[antennaCmd] }
  }

  onBuzzer() {
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket['onBuzzer'])
    return 'ON_BUZZER'
  }

  offBuzzer() {
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket['offBuzzer'])
    return 'OFF_BUZZER'
  }

  getReaderState() {
    return new Promise((resolve, _reject) => {
      this.mTcp.write(idroPacket['getReaderState'])
      this.mTcp.once('data', (data) => {
        console.log(data)
        console.log(data.toString('ascii'))
        return resolve(data.toString('ascii'))
      })
    })
  }

  onMemoryRead() {
    return new Promise((resolve, _reject) => {
      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(idroPacket['memoryRead'])

      this.mTcp.once('data', (data) => {
        const hex = data.slice(3).toString()
        const result = Common.hex_to_ascii(hex)
        console.log({ read: result, length: result.length })
        return resolve(result)

        // const hex = data.slice(3, -4).toString() // 판교용
        // return resolve(Common.hex_to_ascii(hex))
      })
    })
  }

  onWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      const hex = Common.ascii_to_hexa(encode)
      const cmd = `${idroPacket['notPassWriteTag2']} ${hex} \r\n`

      this.mTcp.write(cmd)

      this.mTcp.once('data', (data) => {
        console.log(data.toString().slice(3, -2))
        const result = {
          '00': '정의되지 않은 에러',
          '01': 'success',
          '03': 'Memory Overrun',
          '04': 'Memory Locked'
        }
        return resolve({
          encode,
          result: result[data.toString().slice(3, -2)],
          command: data.toString()
        })
      })
    })
  }

  onStop() {
    this.mTcp.write(idroPacket['allStop'])
    return 'ON_STOP'
  }

  onPowerGain(power: number, antennaIndex: number) {
    const antennaCmd = antennaIndex <= 4 ? `p${antennaIndex}` : 'p'
    const gainCmd = `${idroPacket['powerGain']} ${antennaCmd} ${power} \r\n`

    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(gainCmd)
    return {
      info: `atn: [${antennaCmd[1] ? 'atn' + antennaCmd[1] : 'atn all'}],power: [${power}]`,
      cmd: gainCmd
    }
  }
}

export default new Printer()
