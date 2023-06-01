import { reactive } from 'vue'
import excelManager from '@util/excelManager'

export const store = reactive({
  snbFold: false,
  loading: {
    isLoading: false,
    total: 0,
    progress: 0,
    init: () => {
      store.loading.isLoading = false
      store.loading.total = 0
      store.loading.progress = 0
    }
  },
  excel: {
    data: [],
    checkedRFID: [],
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
  },
  serial: {
    connect: false
  }
})
