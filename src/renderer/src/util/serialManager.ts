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
    try {
      if (this.mIsBusy || store.inspector.isInspecting) return
      const { data } = store.excel
      const { length } = data
      store.excel.checkedRFID = []
      this.mIsBusy = true

      for (let i = 0; i < length; i++) {
        store.inspector.isInspectMsg = 'FEED 신호 대기'
        const start = await window.Serialapi.getStartScan()

        store.inspector.isInspecting = start.ok
        if (!start.ok) return { ok: false, msg: 'FEED 신호 불량' }

        // 개별 RFID 검사 결과
        this.mInspectIndex = i
        const { ok, msg } = await this.inspect()
        store.inspector.isInspecting = start.ok
        store.inspector.isInspectMsg = msg
        if (!ok) return { ok, msg }
      }
    } catch (e) {
      console.log(e)
      this.inspectStop()
      return { ok: false, msg: e.message }
    } finally {
      this.mInspectIndex = 0
      this.mIsBusy = false
    }
  }

  async inspect() {
    const { data } = store.excel
    const { epc } = data[this.mInspectIndex]

    if (!store.inspector.isInspecting) return this.inspectStop()
    store.inspector.isInspectMsg = store.inspector.status.start

    store.idro.writeText = epc
    store.idro.byteLength = epc.length

    store.inspector.isInspectMsg = `[${epc}] WRITE 시도 중`
    const write = await tcpManager.onMemoryWrite()
    if (write.ok) store.inspector.isInspectMsg = `[${epc}] WRITE 성공, READ 시도 중`
    else {
      store.inspector.isInspecting = false
      this.inspectStop(`[${epc}] WRITE 실패 / ${write.msg} / 검수 정지`)
      return
    }
    const read = await tcpManager.onMemoryRead()

    if (read.ok) {
      const isPassRfid = epc === read.msg
      store.inspector.isInspectMsg = `READ 결과 : [${read.msg}] / [${isPassRfid ? '양품' : '불량'}]`
      await this.setRFIDQuality(isPassRfid)
    } else {
      return this.inspectStop(`READ 실패 : [${read.msg}]`)
    }

    if (!store.inspector.isInspecting) {
      this.inspectStop()
      return { ok: false, msg: '검수 정지' }
    }

    return { ok: true, msg: '검수 완료' }
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
    this.mInspectIndex = 0
    return { ok: false, msg }
  }
}

export default new Serialmanager()
