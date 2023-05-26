import { reactive } from 'vue'
import excelManager from '../util/excelManager'

export const store = reactive({
  page: {
    tab: '/'
  },
  excel: {
    data: [],
    checked: [],
    isExcelUpdated: false,
    manager: excelManager
  },
  print: {
    connect: false,
    encodeColumn: 'epc',
    connectMsg: 'disconnect...',
    atnInfo: { atn1: 1, atn2: 0, atn3: 0, atn4: 0 },
    powerGain: { atn1: 300, atn2: 300, atn3: 300, atn4: 300, atn5: 300 /**모든 안테나**/ },
    isInspectStop: false
  }
})
