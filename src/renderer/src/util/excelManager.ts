import XLSX from 'xlsx'
import { store } from '../store/store'
import dbIpcRenderer from './dbIpcRenderer'

class ExcelManager {
  private excelReader = new FileReader()
  async updateExcel(file) {
    console.time('load excel')
    this.excelReader.onloadend = async () => {
      const arrayBuffer = this.excelReader.result
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]

      const excelData = XLSX.utils.sheet_to_json(sheet)
      console.timeEnd('load excel')

      store.excel.isExcelUpdated = true
      for (let i = 0; i < excelData.length; i++) {
        const epc = (excelData[i] as any).epc
        const { ok, msg } = await dbIpcRenderer.isDuplicate(epc)
        console.log('duplicate:' + msg)
        if (ok) await dbIpcRenderer.update(epc)
        else await dbIpcRenderer.insert(epc)
      }

      const { ok, data, msg } = await dbIpcRenderer.read()
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
    this.excelReader.readAsArrayBuffer(file)
  }

  async getExcel() {
    const { ok, data, msg } = await dbIpcRenderer.read()
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
