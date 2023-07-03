const sqlite3 = require('sqlite3').verbose()
import { TypeMiddleware } from '../common'
const fs = require('fs')
interface TypeDBResponse {
  ok: boolean
  msg?: string
  data?: any | undefined
  user?: any | undefined
}
const createTableSQL =
  'CREATE TABLE IF NOT EXISTS epcData (' +
  'idx INTEGER NOT NULL UNIQUE, ' +
  'excelindex INTEGER NOT NULL,' +
  'epc TEXT NOT NULL,' +
  'password TEXT DEFAULT "000000",' +
  'PRIMARY KEY(idx AUTOINCREMENT)' +
  ')'

const excelFilePath = './db/excel-data.db'
const userSetingFilePath = './db/user-data.txt'

class DBbase implements TypeMiddleware {
  private mDB: any

  async _check() {
    return this.mDB
  }

  async _reConnect() {
    const { ok, msg } = await this._connectDB()
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async _disconnectDB() {
    this.mDB?.close()
  }

  async _connectDB(): Promise<TypeDBResponse> {
    try {
      const createExcelDB = await this.createExcelTable()
      const createUserSetDB = await this.createUserTable()

      if (createExcelDB.ok && createUserSetDB.ok) {
        const read = await this.read()
        return { ok: read.ok, data: read.data, msg: read.msg, user: createUserSetDB }
      } else {
        return { ok: false, data: createExcelDB.msg, msg: createUserSetDB.msg }
      }
    } catch (e: any) {
      this.mDB = null
      return { ok: false, data: [], msg: e.message }
    }
  }

  async createExcelTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const bindDB = () => {
        this.mDB = new sqlite3.Database(excelFilePath)
        this.mDB.run(createTableSQL, () => {
          resolve({ ok: true, data: [], msg: 'DB 생성 완료' })
        })
      }

      try {
        if (!fs.existsSync('./db')) fs.mkdirSync('./db')

        fs.writeFileSync(excelFilePath, 'create', { flag: 'wx' })
        bindDB()
      } catch (e) {
        const error = e as any

        switch (error.code) {
          case 'EEXIST':
            bindDB()
            break
          default:
            this.mDB = null
            resolve({ ok: false, msg: error.message })
            break
        }
      }
    })
  }

  async createUserTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        if (!fs.existsSync(userSetingFilePath)) {
          fs.writeFileSync(userSetingFilePath, '', { flag: 'w' })
        }
        resolve({ ok: true })
      } catch (e) {
        const error = e as any

        switch (error.code) {
          case 'EEXIST':
            resolve({ ok: true, msg: error.message })
            break
          default:
            this.mDB = null
            resolve({ ok: false, msg: error.message })
            break
        }
      }
    })
  }

  async updateUserSet({
    host,
    port,
    antenna,
    buzzer,
    atn1,
    atn2,
    atn3,
    atn4,
    com,
    baudRate,
    byteLength
  }): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        fs.writeFileSync(
          userSetingFilePath,
          `{"host": "${host}","port": ${port},"antenna": ${antenna},"buzzer": ${buzzer},"atn1": ${atn1},"atn2": ${atn2},"atn3": ${atn3},"atn4": ${atn4},"com": "${com}","baudRate": ${baudRate},"byteLength":${byteLength}}`,
          { flag: 'w' }
        )
        resolve({ ok: true })
      } catch (e) {
        const error = e as any
        console.log(error)

        switch (error.code) {
          case 'EEXIST':
            resolve({ ok: true, msg: error.message })
            break
          default:
            this.mDB = null
            resolve({ ok: false, msg: error.message })
            break
        }
      }
    })
  }

  async dropTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const sql = 'DROP TABLE epcData'
        this.mDB.run(sql)
        resolve({ ok: true, msg: '테이블 삭제 성공' })
      } catch (e: any) {
        resolve({ ok: false, msg: e.message })
      }
    })
  }

  async read(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const sql = 'SELECT excelindex, epc FROM epcData ORDER BY excelindex ASC'
      const data = []
      try {
        this.mDB.all(sql, [], (err: any, rows: []) => {
          if (err) {
            return resolve({ ok: false, data, msg: err })
          }

          rows.forEach((row) => {
            data.push(row)
          })
          resolve({ ok: true, data, msg: 'DB조회 성공' })
        })
      } catch (e: any) {
        const msg = this.mDB ? e.message : 'DB연결이 안되어 있습니다.'
        resolve({ ok: false, msg, data: [] })
      }
    })
  }

  async readUserSet(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const data = fs.readFileSync(userSetingFilePath).toString()
        console.log(data)
        resolve({ ok: true, msg: 'USER SET', data })
      } catch (e) {
        console.log(e)
      }
    })
  }

  async update(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      // const sql = 'UPDATE epcData '
      resolve({ ok: false, msg: '구현 중' })
    })
  }

  async insert(excelData: { [key: string]: string | number }): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const insertSQL = `
          INSERT INTO epcData
          ( excelindex, epc )
          VALUES
          ( "${excelData.excelindex}", "${excelData.epc}" )
        `
        this.mDB.run(insertSQL, (err) => {
          if (err) {
            return console.error(err.message)
          } else {
            resolve({ ok: true, msg: '데이터 추가 성공' })
          }
        })
      } catch (e: any) {
        resolve({ ok: false, msg: `${excelData.excelindex}번째 데이터 손실,${e.message}` })
      }
    })
  }

  async deleteAll() {
    try {
      const sql = 'DELETE FROM epcData'
      this.mDB.run(sql)

      return { ok: true, msg: '데이터 삭제 성공' }
    } catch (e: any) {
      return { ok: false, msg: e.message }
    }
  }
}

export default new DBbase()
