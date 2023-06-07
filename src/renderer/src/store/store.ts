import { reactive } from 'vue'
import excelManager from '@util/excelManager'

export const store = reactive({
  snbFold: true,
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
    isExcelUpdated: false
  },
  idro: {
    default: { host: '192.168.9.6', port: 5578 },
    changedInfo: { host: '', port: 0 },
    connect: false,
    reading: false,
    writing: false,
    writeText: '',
    byteLength: 12,
    connectMsg: 'disconnect...',
    atnInfo: { atn1: 1, atn2: 0, atn3: 0, atn4: 0 },
    atnPacket: {
      1: { atn1: 1, atn2: 0, atn3: 0, atn4: 0 },
      2: { atn1: 0, atn2: 1, atn3: 0, atn4: 0 },
      3: { atn1: 1, atn2: 1, atn3: 0, atn4: 0 },
      4: { atn1: 0, atn2: 0, atn3: 1, atn4: 0 },
      5: { atn1: 1, atn2: 0, atn3: 1, atn4: 0 },
      6: { atn1: 0, atn2: 1, atn3: 1, atn4: 0 },
      7: { atn1: 1, atn2: 1, atn3: 1, atn4: 0 },
      8: { atn1: 0, atn2: 0, atn3: 0, atn4: 1 },
      9: { atn1: 1, atn2: 0, atn3: 0, atn4: 1 },
      10: { atn1: 0, atn2: 1, atn3: 0, atn4: 1 },
      11: { atn1: 1, atn2: 1, atn3: 0, atn4: 1 },
      12: { atn1: 0, atn2: 0, atn3: 1, atn4: 1 },
      13: { atn1: 1, atn2: 0, atn3: 1, atn4: 1 },
      14: { atn1: 0, atn2: 1, atn3: 1, atn4: 1 },
      15: { atn1: 1, atn2: 1, atn3: 1, atn4: 1 }
    },
    powerGain: { atn1: 300, atn2: 300, atn3: 300, atn4: 300, atn0: 300 /**atn0=>모든 안테나**/ },
    onBuzzer: true,
    isInspectStop: false
  },
  inspector: {
    connect: false,
    default: { path: 'COM6', baudRate: 9600 }
  }
})
