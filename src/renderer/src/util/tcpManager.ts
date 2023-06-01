import { store } from '@store/store'

class TCPmanager {
  async connectPrint() {
    try {
      const { ok, msg } = await window.TCPapi.connectPrint()
      store.print.connect = ok
      store.print.connectMsg = msg

      console.groupCollapsed(`%c TCP CONNECT`, 'padding: 4px; background: #bcbcbc;  font-bold:800;')
      console.log({ ok, msg })
      console.groupEnd()
      return { ok, msg }
    } catch (e) {
      console.error(e)
      store.print.connect = false
      return e
    }
  }

  async antenna() {
    try {
      const { atn1, atn2, atn3, atn4 } = store.print.atnInfo
      if (!atn1 && !atn2 && !atn3 && !atn4) {
        store.print.atnInfo = { atn1: 0, atn2: 0, atn3: 0, atn4: 0 }
        return console.log('안테나 값 입력해주세요.')
      }
      const result = await window.TCPapi.antenna(store.print.atnInfo)
      console.groupCollapsed(`%c ANTENNA`, 'padding: 4px; background: #bcbcbc; font-bold:800;')
      console.log(result)
      console.groupEnd()
      return result
    } catch (e) {
      console.error(e)
    }
  }

  async onPowerGain(antennaIndex: number) {
    const atnName = `atn${antennaIndex}`
    const isAllAtn = antennaIndex > 4
    const status = isAllAtn ? 'atn-all' : atnName
    const arg = isAllAtn
      ? [store.print.powerGain[atnName]]
      : [store.print.powerGain[atnName], antennaIndex]

    try {
      const result = await window.TCPapi.onPowerGain(arg)
      console.groupCollapsed(
        `%c ${status.toUpperCase()}-POWER-GAIN`,
        'padding: 4px; background: #bcbcbc; font-bold:800;'
      )
      console.log(result)
      console.groupEnd()
      return result
    } catch (e) {
      console.error(e)
    }
  }

  async onBuzzer() {
    //
  }

  async offBuzzer() {
    //
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
