import { store } from '@store/store'
import { groupLog } from '@util/common'

class DBmanager {
  async connectDB() {
    try {
      const { ok, msg, data } = await window.DBapi.connectDB()

      store.excel.data = ok ? data : []
      store.excel.isExcelUpdated = store.excel.data.length > 0

      groupLog(ok, 'DB STATUS', [`${data.length}개의 데이터 ${msg}`])

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
