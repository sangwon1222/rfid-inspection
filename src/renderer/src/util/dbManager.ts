import { store } from '@store/store'

class DBmanager {
  async connectDB() {
    try {
      const { ok, msg, data } = await window.DBapi.connectDB()

      if (ok) {
        store.excel.isExcelUpdated = data.length > 0
        store.excel.data = data
      } else {
        store.excel.isExcelUpdated = false
        store.excel.data = []
      }

      console.groupCollapsed(`%c DB STATUS`, 'padding: 4px; background: #bcbcbc;  font-bold:800;')
      console.log({ ok, msg, data })
      console.groupEnd()

      return { ok, msg, data }
    } catch (e) {
      store.excel.isExcelUpdated = false
      store.excel.data = []
      return { ok: false, msg: e, data: [] }
    }
  }

  async read() {
    try {
      const result = await window.DBapi.read()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async update() {
    try {
      const result = await window.DBapi.update()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async insert(epc: any) {
    try {
      const result = await window.DBapi.insert(epc)
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async deleteAll() {
    try {
      const result = await window.DBapi.deleteAll()
      return result
    } catch (e) {
      console.error(e)
      return e
    }
  }
}

export default new DBmanager()
