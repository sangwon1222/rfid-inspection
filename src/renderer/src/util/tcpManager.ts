import { store } from '@store/store'

class TCPmanager {
  async connectPrint() {
    try {
      const { host, port } = store.print.default
      const { ok, msg } = await window.TCPapi.connectPrint({ host, port })
      store.print.connect = ok
      store.print.connectMsg = msg

      console.groupCollapsed(`%c TCP CONNECT`, 'padding: 4px; background: #bcbcbc;  font-bold:800;')
      console.log('통신메세지:', msg)
      console.log('host:', host)
      console.log('port:', port)
      console.groupEnd()
      return { ok, msg }
    } catch (e) {
      store.print.connect = false
      return { ok: false, msg: e.message }
    }
  }

  async antenna(): Promise<{ ok: boolean; msg: string; able?: string; cmd?: string }> {
    try {
      const { atn1, atn2, atn3, atn4 } = store.print.atnInfo
      if (!atn1 && !atn2 && !atn3 && !atn4) {
        store.print.atnInfo = { atn1: 0, atn2: 0, atn3: 0, atn4: 0 }
        return { ok: false, msg: '안테나 값 입력해주세요.' }
      }
      const { ok, msg, able, disable, cmd } = await window.TCPapi.antenna(store.print.atnInfo)
      console.groupCollapsed(`%c 안테나 설정`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      if (ok) {
        console.log('활성화 안테나:', able)
        console.log('비활성화 안테나:', disable)
        console.log('커맨드:', cmd)
      } else {
        console.log(msg)
      }
      console.groupEnd()
      return { ok, msg, able, cmd }
    } catch (e) {
      console.error(e)
      return { ok: false, msg: e.message }
    }
  }

  async onPowerGain(atnIndex: number) {
    const arg = [store.print.powerGain[`atn${atnIndex}`], atnIndex]
    const atnName = atnIndex == 0 ? 'atn-all' : `atn${atnIndex}`

    try {
      const result = await window.TCPapi.onPowerGain(arg)
      console.groupCollapsed(
        `%c ${atnName.toUpperCase()}-POWER-GAIN`,
        'padding: 4px; background: #bcbcbc; font-bold:800;'
      )
      console.log(result)
      console.groupEnd()
      return result
    } catch (e) {
      console.error(e)
    }
  }

  async onBuzzer(): Promise<{ ok: boolean; msg: string }> {
    try {
      const result = await window.TCPapi.onBuzzer()
      console.groupCollapsed(`%c BUZZER`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      console.log(result)
      console.groupEnd()
      return result
    } catch (e) {
      return { ok: false, msg: e.message }
    }
  }

  async offBuzzer(): Promise<{ ok: boolean; msg: string }> {
    try {
      const result = await window.TCPapi.offBuzzer()
      console.groupCollapsed(`%c BUZZER`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      console.log(result)
      console.groupEnd()
      return result
    } catch (e) {
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
    //
  }

  async onWrite(encode: string) {
    //
  }
}

export default new TCPmanager()
