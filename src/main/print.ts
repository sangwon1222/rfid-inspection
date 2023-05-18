import { ipcMain } from 'electron'
import net from 'net'
import idroPacket from './idroPacket'

class MiddleWare {
  async excute(funcName: string, arg?: any) {
    const valid = funcName[0] === '_' ? true : await this._check()

    if (valid) {
      const result = arg ? await this[funcName](...arg) : await this[funcName]()
      return result
    } else {
      return 'DISCONNECT TCP'
    }
  }
  async _check(): Promise<boolean | any> {
    //
  }
}

class Printer extends MiddleWare {
  private mTcp!: net.Socket

  async _connectTCP(host: string, port: number) {
    this.mTcp = net.createConnection({ host, port })
    this.mTcp.setMaxListeners(50)
    this.mTcp.on('connect', () => {
      this.onStop()
      ipcMain.on('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: true, msg: 'success connect' })
      })
    })
    this.mTcp.on('end', () => {
      ipcMain.on('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'end connect' })
      })
    })
    this.mTcp.on('close', () => {
      ipcMain.on('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'close connect' })
      })
    })
    this.mTcp.on('error', () => {
      ipcMain.on('connect-status', (event, _response) => {
        event.reply('connect-status', { ok: false, msg: 'error connect' })
      })
    })
    this.mTcp.on('data', (data) => {
      console.log(data)
    })
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

    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket[antennaCmd])
    this.mTcp.write(idroPacket['startReadRFID'])
    return antennaCmd
  }

  onBuzzer() {
    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket['onBuzzer'])
    this.mTcp.write(idroPacket['startReadRFID'])
    return 'ON_BUZZER'
  }

  offBuzzer() {
    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket['offBuzzer'])
    this.mTcp.write(idroPacket['startReadRFID'])
    return 'OFF_BUZZER'
  }

  onScan() {
    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket['startReadRFID'])
    return 'ON_SCAN'
  }

  onStop() {
    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket['stop'])
    return 'ON_STOP'
  }
  onPowerGainWeek() {
    this.mTcp.write(idroPacket['stopReadRFID'])
    this.mTcp.write(idroPacket['powerGainWeek'])
    this.mTcp.write(idroPacket['startReadRFID'])
    return 'ON_POWER_GAIN_WEEK'
  }
}

export default new Printer()
