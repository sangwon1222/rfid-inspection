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
    if (store.inspector.isInspecting) {
      store.inspector.isInspecting = false
      store.inspector.inspectError = true
      return
    }
    store.inspector.isInspecting = true
    try {
      const start = await window.Serialapi.getStartScan()
      store.inspector.isInspecting = start.ok
      const { ok, msg } = await this.inspect()
      return { ok, msg }
    } catch (e) {
      console.log(e)
      return { ok: false, msg: e.message }
    } finally {
      store.idro.writeText = ''
      store.inspector.isInspectMsg = ''
      store.inspector.isInspecting = false
    }
  }

  async inspect() {
    store.inspector.isInspectMsg = '검수중..'
    const { data } = store.excel
    const { length } = data
    for (let i = 0; i < length; i++) {
      if (!store.inspector.isInspecting) return { ok: false, msg: '검수 중지' }

      store.idro.writeText = data[i].epc
      store.idro.byteLength = data[i].epc.length

      await tcpManager.onMemoryWrite()
      const read = await tcpManager.onMemoryRead()

      if (!store.inspector.isInspecting) return { ok: false, msg: '검수 중지' }
      if (!read.ok) return { ok: false, msg: `READ 기능 에러${read.msg}` }

      const result = data[i].epc === read.msg
      store.excel.checkedRFID[i] = result
      store.excel.focusCellIndex = i
      if (result) {
        this.passed()
      } else {
        this.defective()
      }
      const start = await window.Serialapi.getStartScan()
      if (start.ok) continue
      if (i === length - 1) return { ok: true, msg: '검수 완료' }
    }
  }

  async defective() {
    try {
      const { ok, msg } = await window.Serialapi.defective()
      return { ok, msg }
    } catch (e) {
      console.error(e)
      return { ok: false, msg: e.message }
    }
  }

  async passed() {
    try {
      const { ok, msg } = await window.Serialapi.passed()
      return { ok, msg }
    } catch (e) {
      console.error(e)
      return { ok: false, msg: e.message }
    }
  }
}

export default new Serialmanager()
