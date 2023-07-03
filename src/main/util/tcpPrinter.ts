import idroPacket from '../packet/idroPacket'
import Common, { TypeMiddleware, TypeResponse } from '../common'
import net from 'net'

// renderer/src/components/template/idro/tSetWriteEpcPc.vue HTML selected 동기화 필요
const list = {
  8: '2000',
  10: '2800',
  12: '3000',
  16: '4000',
  18: '4800',
  20: '5000',
  24: '6000',
  26: '6800',
  28: '7000',
  30: '7800',
  32: '8000'
}

class TCPprinter implements TypeMiddleware {
  private mTcp!: net.Socket
  private mTcpHost: { host: string; port: number } = { host: '', port: 0 }
  private mIsConnected = false

  async _check() {
    return this.mIsConnected
  }

  async _reConnect() {
    const { host, port } = this.mTcpHost
    const { ok, msg } = (await this._connectTCP({ host, port })) as TypeResponse
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async _disconnectTCP() {
    this.mTcp?.end()
    this.mTcp?.destroy()
    return { ok: true }
  }

  _connectTCP({ host, port }: { host: string; port: number }) {
    return new Promise((resolve, _reject) => {
      if (this.mTcp) this.mTcp.destroy()
      this.mTcpHost = { host, port }
      this.mTcp = net.createConnection({ port, host })
      this.mTcp.once('connect', async () => {
        const msg = 'IDRO TCP 연결 성공'
        const result = { ok: true, msg, host, port }
        this.mIsConnected = true
        resolve(result)
      })
      this.mTcp.once('data', () => null)
      const list = ['timeout', 'end', 'close', 'error', 'connect']
      for (const status of list) {
        this.mTcp.on(status, (e) => {
          if (e) {
            this.mIsConnected = false
            const result = { ok: false, msg: e.message, host, port }
            resolve(result)
            return
          }
        })
      }
    })
  }

  antenna(setting: { atn1: number; atn2: number; atn3: number; atn4: number }) {
    return new Promise((resolve, _reject) => {
      const keys = Object.keys(setting) as string[]
      const values = Object.values(setting) as number[]

      let able = 'on'
      for (let i = 0; i < values.length; i++) {
        if (values[i]) {
          able += keys[i][0].toUpperCase() + keys[i].slice(1)
        }
      }

      const cmd = idroPacket[able]

      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(cmd)

      resolve({ ok: true, able, cmd })
    })
  }

  onBuzzer() {
    return new Promise((resolve, _reject) => {
      const cmd = idroPacket['onBuzzer']
      console.log(cmd)

      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(cmd)
      return resolve({ ok: true, msg: cmd })
    })
  }

  offBuzzer() {
    return new Promise((resolve, _reject) => {
      const cmd = idroPacket['offBuzzer']
      console.log(cmd)

      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(cmd)
      return resolve({ ok: true, msg: cmd })
    })
  }

  getReaderState() {
    return new Promise((resolve, _reject) => {
      this.mTcp.write(idroPacket['getReaderState'])
      this.mTcp.once('data', (data) => {
        return resolve(data.toString('ascii'))
      })
    })
  }
  onEPCWritePC(byte: number) {
    return new Promise((resolve, _reject) => {
      if (list[byte]) {
        const cmd = `>w 1 1 ${list[byte]}\r\n`
        this.mTcp.write(cmd)

        this.mTcp.once('data', (data) => {
          console.log(cmd)
          console.log(data.toString())

          const status = data.toString().slice(2, 5).toUpperCase()
          console.log(status)
          switch (status) {
            case 'C00':
              return resolve({ ok: false, msg: 'EPC read로 확인 필요' })
            case 'C01':
              return resolve({ ok: true, msg: data.toString() })
            case 'C03':
              return resolve({ ok: false, msg: 'write Memory Overrun' })
            case 'C04':
              return resolve({ ok: false, msg: 'write Memory Locked' })
            default:
              return resolve({ ok: true, msg: data.toString() })
          }
        })
      } else {
        resolve({ ok: false, msg: '없는 자리수' })
      }
    })
  }

  onEPCReadPC() {
    return new Promise((resolve, _reject) => {
      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write('>r 1 1 1\r\n')

      this.mTcp.once('data', (data) => {
        const raw = data.toString().slice(3, -2)
        const msg = raw.slice(0, 4)
        const status = data.toString().slice(-4, -2)

        switch (status) {
          // case '00':
          //   return resolve({ ok: false, msg: '정의 되지 않은 다른 Error가 발생한 경우' })
          // case '03':
          //   return resolve({ ok: false, msg: 'Access 하는 Tag의 Memory 범위를 벗어난 경우' })
          // case '04':
          //   return resolve({ ok: false, msg: 'Access 하는 Tag의 Memory가 Lock되어 있을 경우' })
          default:
            return resolve({ ok: true, msg })
        }
      })
    })
  }

  onMemoryRead(byteLength: number, timeout: number) {
    return new Promise((resolve, _reject) => {
      const cmd = idroPacket['memoryRead'].replace('??', `8`)

      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(cmd)
      console.log(cmd)

      this.mTcp.once('data', (data) => {
        const msg = data.slice(3, 3 + byteLength * 2).toString()
        const status = data.toString().slice(2, 5).toUpperCase()

        switch (status) {
          case 'C00':
            return resolve({ ok: false, msg: 'read 정의되지 않은 에러' })
          case 'C03':
            return resolve({ ok: false, msg: 'read Memory Overrun' })
          case 'C04':
            return resolve({ ok: false, msg: 'read Memory Locked' })
          default:
            return resolve({ ok: true, msg })
        }
      })

      if (timeout) {
        setTimeout(() => {
          resolve({
            ok: false,
            msg: `[READ timeout ${timeout}ms]  `
          })
        }, timeout)
      }
    })
  }

  onMemoryWrite(hex: string, timeout: number) {
    return new Promise((resolve, _reject) => {
      const ascii = Common.hex_to_ascii(hex)

      const calcHex = 2 % ascii.length ? `${hex}30` : hex
      const pc = list[ascii.length] ? `${list[ascii.length]}` : `4000`
      const cmd = idroPacket['writeTag'].replace('??', `${pc}${calcHex}`)

      this.mTcp.write(cmd)
      console.log(cmd)

      this.mTcp.once('data', (data) => {
        const status = data.toString().slice(2, 5).toUpperCase()
        switch (status) {
          case 'C00':
            return resolve({ ok: false, msg: 'write 정의되지 않은 에러' })
          case 'C01':
            return resolve({ ok: true, msg: hex })
          case 'C03':
            return resolve({ ok: false, msg: 'write Memory Overrun' })
          case 'C04':
            return resolve({ ok: false, msg: 'write Memory Locked' })
          default:
            return resolve({ ok: true, msg: hex })
        }
      })
      if (timeout) {
        setTimeout(() => {
          return resolve({
            ok: false,
            msg: `[WRITE timeout ${timeout}ms]  `
          })
        }, timeout)
      }
    })
  }

  onStop() {
    const cmd = idroPacket['allStop']
    this.mTcp.write(cmd)
    return { status: 'stop', cmd }
  }

  onPowerGain(power: number, antennaIndex: number) {
    const atnCmd = antennaIndex === 0 ? 'p' : `p${antennaIndex}`
    const gainCmd = idroPacket['powerGain'].replace('??', atnCmd).replace('??', power.toString())

    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(gainCmd)

    const atn = atnCmd[1] ? `${atnCmd[1]}번` : '모든'
    const msg = `[${atn} 안테나]: POWER [ ${power} ] / cmd: ${gainCmd}`
    return { ok: true, msg }
  }
}

export default new TCPprinter()
