import XLSX from 'xlsx'
import { store } from '@store/store'
import dbManager from './dbManager'
import { map } from 'lodash-es'

class ExcelManager {
  private excelReader = new FileReader()

  async updateExcel(file) {
    return new Promise((resolve, _reject) => {
      this.excelReader.onloadend = async () => {
        await dbManager.deleteAll()

        const arrayBuffer = this.excelReader.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const excelData = XLSX.utils.sheet_to_json(sheet)

        store.excel.isExcelUpdated = true
        store.loading.progress = 0
        store.loading.total = excelData.length
        for (let i = 0; i < store.loading.total; i++) {
          const data = {}
          map(Object.keys(excelData[i]), (name) => {
            data['excelindex'] = i + 1
            return (data[name.toLowerCase()] = excelData[i][name])
          })
          await dbManager.insert(data)
          store.loading.progress = i + 1
        }

        const { ok, data, msg } = await dbManager.read()
        if (ok) {
          dbManager.setExcelData(data)
        } else {
          console.log(msg)
          store.excel.isExcelUpdated = false
          store.excel.data = []
        }
        resolve(true)
      }
      this.excelReader.readAsArrayBuffer(file)
    })
  }

  async getExcel() {
    const { ok, data, msg } = await dbManager.read()
    if (ok) {
      dbManager.setExcelData(data)
    } else {
      console.log(msg)
      store.excel.isExcelUpdated = false
      store.excel.data = []
    }
  }
}

export default new ExcelManager()
