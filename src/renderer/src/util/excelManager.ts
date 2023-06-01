import XLSX from 'xlsx'
import { store } from '@store/store'
import dbManager from './dbManager'

class ExcelManager {
  private excelReader = new FileReader()
  async updateExcel(file) {
    return new Promise((resolve, _reject) => {
      this.excelReader.onloadend = async () => {
        const arrayBuffer = this.excelReader.result
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]

        const excelData = XLSX.utils.sheet_to_json(sheet)

        store.excel.isExcelUpdated = true
        store.loading.progress = 0
        store.loading.total = excelData.length
        for (let i = 0; i < store.loading.total; i++) {
          const { epc } = excelData[i] as { epc: string }
          await dbManager.insert(epc)
          store.loading.progress = i + 1
        }

        const { ok, data, msg } = await dbManager.read()
        if (ok) {
          store.excel.isExcelUpdated = data.length > 0
          store.excel.data = data
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
      store.excel.isExcelUpdated = data.length > 0
      store.excel.data = data
      console.log(data)
    } else {
      console.log(msg)
      store.excel.isExcelUpdated = false
      store.excel.data = []
    }
  }
}

export default new ExcelManager()
