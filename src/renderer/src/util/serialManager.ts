import { store } from '@store/store'

class Serialmanager {
  async connectSerialPort() {
    try {
      store.inspector.connect = true
      const { path, baudRate } = store.inspector.default
      const { ok, msg } = await window.Serialapi.connectSerialPort(path, baudRate)
      store.inspector.connect = ok

      console.groupCollapsed(
        `%c SERIAL STATUS`,
        'padding: 4px; background: #bcbcbc;  font-bold:800;'
      )
      console.log('path: ', store.inspector.default.path)
      console.log('baudRate: ', store.inspector.default.baudRate)
      console.groupEnd()

      return { ok, msg }
    } catch (e) {
      console.error(e)
      return { e }
    }
  }

  async getStartScan(): Promise<{ ok: boolean; msg: string }> {
    try {
      const { ok, msg } = await window.Serialapi.connectSerialPort()
      return { ok, msg }
    } catch (e) {
      console.error(e)
    }
  }

  async defective() {
    //
  }

  async passed() {
    //
  }
}

export default new Serialmanager()
