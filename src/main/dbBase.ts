const sqlite3 = require('sqlite3').verbose()
const fs = require('fs')

interface TypeDBResponse {
  ok: boolean
  msg: string
  data?: any[]
}

class dbBase {
  private mDB: any

  async excute(funcName: string, arg?: any) {
    const result = arg ? await this[funcName](...arg) : await this[funcName]()
    return result
  }

  async create(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const file = './db/test.db'
      try {
        fs.writeFileSync(file, '', { flag: 'wx' })
        this.mDB = new sqlite3.Database(file)
        const createTableSQL =
          'CREATE TABLE IF NOT EXISTS inspectorData (' +
          'idx INTEGER NOT NULL UNIQUE, ' +
          'epc TEXT NOT NULL,' +
          'password TEXT DEFAULT "000000",' +
          'date TEXT DEFAULT CURRENT_TIMESTAMP,' +
          'PRIMARY KEY(idx AUTOINCREMENT)' +
          ')'
        this.mDB.run(createTableSQL)
        resolve({ ok: true, data: [], msg: 'DB 생성 완료' })
      } catch (e) {
        const error = e as any
        if (error.code === 'EEXIST') {
          this.mDB = new sqlite3.Database(file)
          const sql = 'SELECT * FROM inspectorData'
          const data = []
          this.mDB.all(sql, [], (err: any, rows: any[]) => {
            if (err) throw err

            rows.forEach((row: any) => {
              data.push(row)
            })
            resolve({ ok: true, data, msg: '기존 DB 파일이 있습니다.' })
          })
        } else {
          this.mDB = null
          resolve({ ok: false, data: [], msg: error.message })
        }
      }
    })
  }

  async read(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const sql = 'SELECT * FROM inspectorData'
      const data = []
      try {
        this.mDB.all(sql, [], (err: any, rows: any[]) => {
          if (err) throw err

          rows.forEach((row: any) => {
            data.push(row)
          })
          resolve({ ok: true, data, msg: 'DB조회 성공' })
        })
      } catch (e) {
        const msg = this.mDB ? e.message : 'DB연결이 안되어 있습니다.'
        resolve({ ok: false, msg, data: [] })
      }
    })
  }

  async isDuplicate(epc): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      const sql = `SELECT * FROM inspectorData WHERE epc = "${epc}"`
      try {
        this.mDB.get(sql, [], (err: any, row: any) => {
          if (err) throw err
          const ok = Boolean(row)
          const msg = '중복된 epc'
          resolve({ ok, msg })
        })
      } catch (e) {
        resolve({ ok: false, msg: e.message })
      }
    })
  }

  async update(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      // const sql = 'UPDATE inspectorData '
      resolve({ ok: false, msg: '구현 중' })
    })
  }

  async insert(epc: string, pwd?: string): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const password = pwd ? pwd : '0000'

        const insertSQL = `
                  INSERT INTO inspectorData
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
      } catch (e) {
        resolve({ ok: false, msg: e.message })
      }
    })
  }

  async deleteAll(): Promise<TypeDBResponse> {
    return new Promise((resolve, _reject) => {
      try {
        const sql = 'DELETE FROM inspectorData'
        this.mDB.run(sql)
        resolve({ ok: true, msg: '데이터 삭제 성공' })
      } catch (e) {
        resolve({ ok: false, msg: e.message })
      }
    })
  }
}

export default new dbBase()
