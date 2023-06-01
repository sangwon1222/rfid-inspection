const sqlite3 = require('sqlite3').verbose()
import { TypeMiddleware } from '../common'
const fs = require('fs')
interface TypeDBResponse {
  ok: boolean
  msg: string
  data?: any | undefined
}
const createTableSQL =
  'CREATE TABLE IF NOT EXISTS epcData (' +
  'idx INTEGER NOT NULL UNIQUE, ' +
  'epc TEXT NOT NULL,' +
  'password TEXT DEFAULT "000000",' +
  'creteDate TEXT DEFAULT CURRENT_TIMESTAMP,' +
  'PRIMARY KEY(idx AUTOINCREMENT)' +
  ')'

class DBbase implements TypeMiddleware {
  private mDB: any

  async _check() {
    return this.mDB
  }
  async _disconnect() {
    if (this.mDB) this.mDB.close()
  }

  async _reConnect() {
    const { ok, msg } = await this.connectDB()
    if (!ok) console.error(msg)
    return { ok, msg }
  }

  async createTable(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const file = './db/test.db'

      const bindDB = async () => {
        this.mDB = new sqlite3.Database(file)
        this.mDB.run(createTableSQL, () => {
          resolve({ ok: true, data: [], msg: 'DB 생성 완료' })
        })
      }

      try {
        if (!fs.existsSync('./db')) {
          fs.mkdirSync('./db')
        }
        fs.writeFileSync(file, '', { flag: 'wx' })
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

  async connectDB(): Promise<TypeDBResponse> {
    try {
      const create = await this.createTable()
      if (create.ok) {
        const read = await this.read()
        return { ok: read.ok, data: read.data, msg: read.msg }
      } else {
        return { ok: false, data: [], msg: create.msg }
      }
    } catch (e: any) {
      this.mDB = null
      return { ok: false, data: [], msg: e.message }
    }
  }

  async read(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM epcData'
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

  async update(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      // const sql = 'UPDATE epcData '
      resolve({ ok: false, msg: '구현 중' })
    })
  }

  async insert(epc: string, pwd?: string): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const password = pwd ? pwd : '0000'

        const insertSQL = `
                  INSERT INTO epcData
                  (epc, password)
                  VALUES
                  ("${epc}","${password}")
                `
        this.mDB.run(insertSQL, (err) => {
          if (err) {
            return console.error(err.message)
          }
        })
        resolve({ ok: true, msg: '데이터 추가 성공' })
      } catch (e: any) {
        resolve({ ok: false, msg: e.message })
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
