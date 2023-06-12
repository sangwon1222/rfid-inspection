import { store } from '@store/store'
import { groupLog } from '@util/common'

class TCPmanager {
  async connectPrint() {
    if (store.idro.connect === null) return
    store.idro.connect = null
    store.idro.connectMsg = 'TCP 연결중..'
    try {
      const { host, port } = store.idro.default
      const { ok, msg } = await window.TCPapi.connectPrint({ host, port })
      store.idro.connect = ok
      store.idro.connectMsg = msg

      groupLog(ok, 'TCP STATUS', [msg])

      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    }
  }

  async disconnect() {
    try {
      store.inspector.isInspecting = false
      const { ok, msg } = await window.TCPapi.disconnect()
      store.idro.connect = false
      store.idro.connectMsg = '연결 해제'

      return { ok, msg }
    } catch (e) {
      return { ok: false, msg: e.message }
    }
  }

  async antenna(): Promise<{ ok: boolean; msg: string; able?: string; cmd?: string }> {
    store.inspector.isInspecting = false
    try {
      store.idro.reading = false
      store.idro.writing = false

      const { atn1, atn2, atn3, atn4 } = store.idro.atnInfo
      if (!atn1 && !atn2 && !atn3 && !atn4) {
        store.idro.atnInfo = { atn1: 0, atn2: 0, atn3: 0, atn4: 0 }
        return { ok: false, msg: '안테나 값 입력해주세요.' }
      }

      const { ok, msg, able, cmd } = await window.TCPapi.antenna(store.idro.atnInfo)
      console.groupCollapsed(`%c 안테나 설정`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      if (ok) {
        console.log('활성화 안테나:', able)
        console.log('커맨드:', cmd)
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      console.groupEnd()
      return { ok, msg, able, cmd }
    } catch (e) {
      console.error(e)
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    } finally {
      store.loading.init()
    }
  }

  async onPowerGain(atnIndex: number) {
    store.inspector.isInspecting = false
    store.idro.reading = false
    store.idro.writing = false
    const arg = [store.idro.powerGain[`atn${atnIndex}`], atnIndex]
    const atnName = atnIndex == 0 ? 'atn-all' : `atn${atnIndex}`

    try {
      const { ok, msg } = await window.TCPapi.onPowerGain(arg)

      if (ok) {
        console.groupCollapsed(
          `%c ${atnName.toUpperCase()}-POWER-GAIN`,
          'padding: 4px; background: #bcbcbc; font-bold:800;'
        )
        console.log(msg)
        console.groupEnd()
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
    }
  }

  async onBuzzer(): Promise<{ ok: boolean; msg: string }> {
    store.inspector.isInspecting = false
    store.idro.reading = false
    store.idro.writing = false
    try {
      const { ok, msg } = await window.TCPapi.onBuzzer()
      if (ok) {
        console.groupCollapsed(`%c ON BUZZER`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
        console.log(msg)
        console.groupEnd()
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    }
  }

  async offBuzzer(): Promise<{ ok: boolean; msg: string }> {
    store.inspector.isInspecting = false
    store.idro.reading = false
    store.idro.writing = false
    try {
      const { ok, msg } = await window.TCPapi.offBuzzer()
      if (ok) {
        console.groupCollapsed(`%c OFF BUZZER`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
        console.log(msg)
        console.groupEnd()
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    }
  }

  async onStop() {
    //
  }

  async getReaderState() {
    //
  }

  async onMemoryRead() {
    store.idro.writing = false
    try {
      const { ok, msg } = await window.TCPapi.onMemoryRead(store.idro.byteLength)
      if (ok) {
        console.log('READ: ', msg)
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    }
  }

  async onMemoryWrite() {
    store.idro.reading = false
    try {
      const { ok, msg } = await window.TCPapi.onMemoryWrite(store.idro.writeText)
      if (ok) {
        console.log('WRITE: ', store.idro.writeText)
        console.log(ok, msg)
      } else {
        store.idro.connect = false
        store.idro.connectMsg = msg
      }
      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      store.idro.connectMsg = e.message
      return { ok: false, msg: e.message }
    }
  }
}

export default new TCPmanager()
