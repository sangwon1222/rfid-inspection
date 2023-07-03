import { store } from '@store/store'
import { groupLog } from '@util/common'
import tcpManager from './tcpManager'
import { debounce } from 'lodash-es'

class Serialmanager {
  private mIsBusy = false
  private mInspectIndex = 0
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
    if (this.mIsBusy) return

    const { data } = store.excel
    if (this.mInspectIndex >= data.length - 1) {
      this.mInspectIndex = 0
      store.excel.checkedRFID = []
    }
    try {
      if (this.mIsBusy || store.inspector.isInspecting) return
      const { length } = data
      this.mIsBusy = true

      for (let i = this.mInspectIndex; i < length; i++) {
        store.inspector.isInspectMsg = 'FEED 신호 대기'
        const start = await window.Serialapi.getStartScan()
        store.inspector.isInspecting = start.ok
        store.inspector.isInspectMsg = start.msg

        if (!start.ok) return { ok: false, msg: 'FEED 신호 불량' }

        // 개별 RFID 검사 결과
        this.mInspectIndex = i
        const { msg } = await this.inspect()
        store.inspector.isInspectMsg = msg
        // if (!ok) return { ok, msg }
      }
    } catch (e) {
      console.log(e)
      this.inspectStop()
      return { ok: false, msg: e.message }
    } finally {
      this.mIsBusy = false
      store.inspector.isInspecting = false
    }
  }

  async inspect() {
    const { data } = store.excel
    const { epc } = data[this.mInspectIndex]

    store.excel.data[this.mInspectIndex].write = ''
    store.excel.data[this.mInspectIndex].read = ''
    store.excel.data[this.mInspectIndex].result = ''

    if (!store.inspector.isInspecting) return this.inspectStop()
    store.inspector.isInspectMsg = store.inspector.status.start

    store.idro.writeText = epc
    store.idro.byteLength = epc.length

    store.inspector.isInspectMsg = `[${epc}] WRITE 시도 중`

    const write = await tcpManager.onMemoryWrite()
    store.inspector.isInspectMsg = `write: [ ${write.msg} ] ${write.ok ? '성공' : '실패'},`
    store.excel.data[this.mInspectIndex].write = write.msg

    const read = await tcpManager.onMemoryRead()
    const isPassRfid = write.msg === read.msg
    store.inspector.isInspectMsg = `read: [ ${read.msg} ] / [ ${isPassRfid ? '양품' : '불량'} ]`
    store.excel.data[this.mInspectIndex].read = read.msg

    console.log(this.mInspectIndex + 1, write.msg, read.msg)

    await this.setRFIDQuality(isPassRfid)
    store.excel.data[this.mInspectIndex].result = isPassRfid ? '양품' : '불량'

    const status = store.inspector.isInspecting ? '완료' : '정지'

    if (!store.inspector.isInspecting) this.inspectStop()
    return { ok: store.inspector.isInspecting, msg: `검수 ${status}` }
  }

  async setRFIDQuality(isPass: boolean) {
    const status = isPass ? 'passed' : 'defective'
    await window.Serialapi[status]()

    store.excel.checkedRFID[this.mInspectIndex] = isPass
    store.excel.focusCellIndex = this.mInspectIndex
  }

  async inspectStop(message?: string) {
    const msg = message ? message : store.inspector.status.stop
    store.inspector.isInspectMsg = msg
    store.idro.writeText = ''
    store.inspector.isInspecting = false
    this.mIsBusy = false

    return { ok: false, msg }
  }
}

export default new Serialmanager()
