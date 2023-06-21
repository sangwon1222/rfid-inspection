import idroPacket from '../packet/idroPacket'
import Common, { TypeMiddleware, TypeResponse } from '../common'
import net from 'net'

// const buzzer = await getIdroStatus(this.mTcp, idroPacket['getBuzzer'])
// console.log({ buzzer })
// const getIdroStatus = (tcp: net.Socket, cmd: string) => {
//   return new Promise((resolve, _reject) => {
//     tcp.write(cmd)
//     tcp.once('data', (data) => {
//       setTimeout(() => {
//         resolve(data.toString())
//       }, 1000)
//     })
//   })
// }

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
        this.mTcp.once(status, (e) => {
          if (e) {
            this.mIsConnected = false
            const result = { ok: false, msg: `TCP STATUS [${status}]`, host, port }
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
      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(idroPacket['onBuzzer'])

      this.mTcp.write(idroPacket['getBuzzer'])
      this.mTcp.once('data', (data) => {
        const atnStatus = data.toString()
        resolve({ ok: true, msg: atnStatus })
      })
    })
  }

  offBuzzer() {
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket['offBuzzer'])
    return { ok: true, msg: idroPacket['offBuzzer'] }
  }

  getReaderState() {
    return new Promise((resolve, _reject) => {
      this.mTcp.write(idroPacket['getReaderState'])
      this.mTcp.once('data', (data) => {
        return resolve(data.toString('ascii'))
      })
    })
  }

  onMemoryRead(byteLength: number) {
    return new Promise((resolve, _reject) => {
      const cmd = idroPacket['memoryRead'].replace('??', `${Math.floor(byteLength / 4)}`)
      console.log(cmd)
      this.mTcp.write(idroPacket['allStop'])
      this.mTcp.write(cmd)

      this.mTcp.once('data', (data) => {
        // const hex = data.slice(3, 3 + byteLength * 2).toString()
        const hex = data.slice(3, -2).toString()
        const msg = Common.hex_to_ascii(hex)
        const status = data.toString().slice(-4, -2)
        switch (status) {
          case '00':
            return resolve({ ok: false, msg: '정의 되지 않은 다른 Error가 발생한 경우' })
          case '03':
            return resolve({ ok: false, msg: 'Access 하는 Tag의 Memory 범위를 벗어난 경우' })
          case '04':
            return resolve({ ok: false, msg: 'Access 하는 Tag의 Memory가 Lock되어 있을 경우' })
          default:
            return resolve({ ok: true, msg })
        }
      })
    })
  }

  onMemoryWrite(encode: string) {
    return new Promise((resolve, _reject) => {
      const format = encode.length % 2 ? `${encode}0` : encode
      const hex = Common.ascii_to_hex(format)
      const cmd = idroPacket['notPassWriteTag'].replace('??', hex)

      this.mTcp.write(cmd)
      this.mTcp.once('data', (data) => {
        const result = {
          '00': '정의되지 않은 에러',
          '01': 'success',
          '03': 'Memory Overrun',
          '04': 'Memory Locked'
        }
        const status = data.toString().slice(3, -2)
        resolve({
          ok: status === '01',
          msg: result[status]
        })
      })

      // setTimeout(() => {
      //   resolve({
      //     ok: false,
      //     msg: 'TIMEOUT 200ms'
      //   })
      // }, 200)
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
