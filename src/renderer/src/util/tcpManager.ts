import { store } from '@store/store'

class TCPmanager {
  async connectPrint() {
    try {
      const { host, port } = store.idro.default
      const { ok, msg } = await window.TCPapi.connectPrint({ host, port })
      store.idro.connect = ok
      store.idro.connectMsg = msg

      return { ok, msg }
    } catch (e) {
      store.idro.connect = false
      return { ok: false, msg: e.message }
    }
  }

  async antenna(): Promise<{ ok: boolean; msg: string; able?: string; cmd?: string }> {
    try {
      store.idro.reading = false
      store.idro.writing = false
      const { atn1, atn2, atn3, atn4 } = store.idro.atnInfo
      if (!atn1 && !atn2 && !atn3 && !atn4) {
        store.idro.atnInfo = { atn1: 0, atn2: 0, atn3: 0, atn4: 0 }
        return { ok: false, msg: '안테나 값 입력해주세요.' }
      }
      const { ok, msg, able, disable, cmd } = await window.TCPapi.antenna(store.idro.atnInfo)
      console.groupCollapsed(`%c 안테나 설정`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      if (ok) {
        console.log('활성화 안테나:', able)
        console.log('비활성화 안테나:', disable)
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
    }
  }

  async onPowerGain(atnIndex: number) {
    store.idro.reading = false
    store.idro.writing = false
    const arg = [store.idro.powerGain[`atn${atnIndex}`], atnIndex]
    const atnName = atnIndex == 0 ? 'atn-all' : `atn${atnIndex}`

    try {
      const { ok, msg, power } = await window.TCPapi.onPowerGain(arg)

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
        console.log('READ DATA', msg)
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
        console.log('WRITE', msg)
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
