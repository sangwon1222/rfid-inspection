import { store } from '@store/store'

class Serialmanager {
  async connectSerialPort() {
    try {
      const { ok, msg } = await window.Serialapi.connectSerialPort()
      store.serial.connect = ok

      console.log('SERIAL', { ok, msg })
      return { ok, msg }
    } catch (e) {
      console.error(e)
      return { e }
    }
  }

  async getStartScanCode() {
    try {
      //
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
