import idroPacket from '../packet/idroPacket'
import Common, { TypeMiddleware } from '../common'
import net from 'net'

class TCPprinter implements TypeMiddleware {
  private mTcp!: net.Socket
  private mTcpHost: { host: string; port: number } = { host: '', port: 0 }
  private mIsConnected = false

  async _check() {
    return this.mIsConnected
  }

  async _disconnect() {
    await this.mTcp.end()
    await this.mTcp.destroy()
  }

  async _reConnect() {
    const { host, port } = this.mTcpHost
    const { ok, msg } = (await this.connectTCP({ host, port })) as { ok: boolean; msg: string }
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  connectTCP({ host, port }: { host: string; port: number }) {
    return new Promise((resolve, _reject) => {
      this.mTcpHost = { host, port }

      this.mTcp = net.connect({ port, host, timeout: 3000 }, () => {
        const result = { ok: true, msg: 'success connect', host, port }
        this.mIsConnected = true
        resolve(result)
      })

      this.mTcp.on('timeout', () => {
        const result = { ok: false, msg: 'timeout connect', host, port }
        this.mIsConnected = false
        resolve(result)
      })
      this.mTcp.on('end', () => {
        const result = { ok: false, msg: 'idro에서 연결끊김.(end connect)', host, port }
        this.mIsConnected = false
        resolve(result)
      })
      this.mTcp.on('close', () => {
        const result = { ok: false, msg: 'close connect', host, port }
        this.mIsConnected = false
        resolve(result)
      })
      this.mTcp.on('error', () => {
        const result = { ok: false, msg: 'error connect', host, port }
        this.mIsConnected = false
        resolve(result)
      })
    })
  }

  antenna(setting: { atn1: number; atn2: number; atn3: number; atn4: number }) {
    const keys = Object.keys(setting) as string[]
    const values = Object.values(setting) as number[]

    let able = 'on'
    let disable = ''
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        able += keys[i][0].toUpperCase() + keys[i].slice(1)
      } else disable += keys[i][0].toUpperCase() + keys[i].slice(1)
    }

    const cmd = idroPacket[able]
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(cmd)
    return { ok: true, able: able.substring(2), disable, cmd }
  }

  onBuzzer() {
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket['onBuzzer'])
    this.mTcp.once('data', (data) => {
      return { ok: true, msg: data.toString('ascii') }
    })
  }

  offBuzzer() {
    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(idroPacket['offBuzzer'])
    this.mTcp.once('data', (data) => {
      return { ok: true, msg: data.toString('ascii') }
    })
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
    const cmd = idroPacket['allStop']
    this.mTcp.write(cmd)
    return { status: 'stop', cmd }
  }

  onPowerGain(power: number, antennaIndex: number) {
    const atnCmd = antennaIndex === 0 ? 'p' : `p${antennaIndex}`
    const gainCmd = `${idroPacket['powerGain']} ${atnCmd} ${power} \r\n`

    this.mTcp.write(idroPacket['allStop'])
    this.mTcp.write(gainCmd)
    return {
      atn: `[${atnCmd[1] ? atnCmd[1] : 'all antenna'}]`,
      power: `[${power}]`,
      cmd: gainCmd
    }
  }
}

export default new TCPprinter()
