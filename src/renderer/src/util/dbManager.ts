import { store } from '@store/store'
import { groupLog } from '@util/common'
import { map } from 'lodash-es'

interface TypeUserSetting {
  host: string
  port: number
  antenna: number
  buzzer: number
  atn1: number
  atn2: number
  atn3: number
  atn4: number
  com: string
  baudRate: number
}

class DBmanager {
  async connectDB() {
    try {
      const { ok, msg, data } = await window.DBapi.connectDB()

      this.setExcelData(data)

      groupLog(ok, 'DB STATUS', [`${data.length}개의 데이터 ${msg}`])

      return { ok, msg, data }
    } catch (e) {
      store.excel.isExcelUpdated = false
      store.excel.data = []
      return { ok: false, msg: e, data: [] }
    }
  }

  setExcelData(rawData) {
    store.excel.isExcelUpdated = rawData.length > 0

    const data = store.excel.isExcelUpdated
      ? map(rawData, (e) => {
          e['result'] = ''
          return e
        })
      : []

    store.excel.data = data
  }

  async readUserSet() {
    try {
      const { ok, data, msg } = await window.DBapi.readUserSet()
      return { ok, data, msg }
    } catch (e) {
      console.error(e)
      return e
    }
  }

  async updateUserSet(params: TypeUserSetting) {
    try {
      const { ok, msg } = await window.DBapi.updateUserSet(params)
      return { ok, msg }
    } catch (e) {
      console.error(e)
      return e
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

  async insert(excelData: { [key: string]: string | number }) {
    try {
      const result = await window.DBapi.insert(excelData)
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
