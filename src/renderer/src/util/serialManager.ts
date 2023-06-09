import { store } from '@store/store'
import { groupLog } from '@util/common'
import tcpManager from './tcpManager'

class Serialmanager {
  async connectSerialPort() {
    if (store.inspector.connect === null) return
    store.inspector.connect = null
    store.inspector.connectMsg = 'SERIAL_PORT 연결중...'
    try {
      const { path, baudRate } = store.inspector.default
      const { ok, msg } = await window.Serialapi.connectSerialPort(path, baudRate)

      store.inspector.connect = ok
      store.inspector.connectMsg = msg

      groupLog(ok, 'SERIAL STATUS', [msg, `path: [${path}]`, `baudRate: [${baudRate}]`])

      return { ok, msg }
    } catch (e) {
      store.inspector.connect = false
      return { ok: false, msg: e.message }
    }
  }

  async disconnect() {
    try {
      const { ok, msg } = await window.Serialapi.disconnect()
      store.inspector.connect = false
      store.inspector.connectMsg = '연결 해제'

      return { ok, msg }
    } catch (e) {
      return { ok: false, msg: e.message }
    }
  }

  async getStartScan(): Promise<{ ok: boolean; msg: string }> {
    try {
      const { ok, msg } = await window.Serialapi.getStartScan()
      return { ok, msg }
    } catch (e) {
      console.error(e)
      return { ok: false, msg: e.message }
    }
  }

  async inspectStart() {
    try {
      if (store.inspector.isInspecting) return
      store.inspector.isInspecting = true

      const start = await window.Serialapi.getStartScan()
      store.inspector.isInspecting = start.ok
      if (start.ok) {
        const { ok, msg } = await this.inspect()
        return { ok, msg }
      } else {
        return { ok: false, msg: start.msg }
      }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e.message }
    } finally {
      this.stopInspect()
    }
  }

  async inspect() {
    const { data } = store.excel
    const { length } = data

    for (let i = 0; i < length; i++) {
      if (!store.inspector.isInspecting) return this.stopInspect()
      store.inspector.isInspectMsg = store.inspector.status.start

      const { epc } = data[i]
      store.idro.writeText = epc
      store.idro.byteLength = epc.length

      store.inspector.isInspectMsg = `write [${epc}]`
      await tcpManager.onMemoryWrite()
      const read = await tcpManager.onMemoryRead()
      store.inspector.isInspectMsg = `read ${read.msg}`

      if (read.ok) {
        const isPassRfid = epc === read.msg
        await this.setRFIDQuality(i, isPassRfid)
      } else {
        return this.stopInspect(`READ 기능 에러 [${read.msg}]`)
      }

      if (!store.inspector.isInspecting) return this.stopInspect()

      store.inspector.isInspectMsg = store.inspector.status.wait
      const feed = await window.Serialapi.getStartScan()
      if (feed.ok) continue
    }

    store.inspector.isInspectMsg = store.inspector.status.complete
    return { ok: true, msg: '검수 완료' }
  }

  async setRFIDQuality(index: number, isPass: boolean) {
    const status = isPass ? 'passed' : 'defective'
    await window.Serialapi[status]()

    store.excel.checkedRFID[index] = isPass
    store.excel.focusCellIndex = index
  }

  stopInspect(message?: string) {
    const msg = message ? message : store.inspector.status.stop
    store.inspector.isInspectMsg = msg
    store.idro.writeText = ''
    store.inspector.isInspecting = false
    return { ok: false, msg }
  }
}

export default new Serialmanager()
