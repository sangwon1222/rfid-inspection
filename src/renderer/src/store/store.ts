import { reactive, readonly } from 'vue'

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
    isExcelUpdated: false,
    focusCellIndex: 0
  },
  idro: {
    default: { host: '192.168.9.6', port: 5578 },
    connect: false,
    connectMsg: 'TCP 연결중..',
    reading: false,
    writing: false,
    timeout: 2000, //ms
    writeText: '',
    byteLength: 12,
    fixPc: false,
    atnInfo: { atn1: 1, atn2: 0, atn3: 0, atn4: 0 },
    atnPacket: () => {
      return readonly({
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
      })
    },
    powerGain: { atn1: 150, atn2: 150, atn3: 150, atn4: 150, atn0: 150 /**atn0=>모든 안테나**/ },
    onBuzzer: true,
    isInspectStop: false,
    epcPcList: [
      { value: 32, label: '32byte / pc: 8000' },
      { value: 30, label: '30byte / pc: 7800' },
      { value: 28, label: '28byte / pc: 7000' },
      { value: 26, label: '26byte / pc: 6800' },
      { value: 24, label: '24byte / pc: 6000' },
      { value: 20, label: '20byte / pc: 5000' },
      { value: 18, label: '18byte / pc: 4800' },
      { value: 16, label: '16byte / pc: 4000' },
      { value: 12, label: '12byte / pc: 3000' },
      { value: 10, label: '10byte / pc: 2800' },
      { value: 8, label: '8byte / pc: 2000' }
    ]
  },
  inspector: {
    connect: false,
    connectMsg: 'disconnect SERIAL PORT',
    default: { path: 'COM6', baudRate: 9600 },
    isInspecting: false,
    isInspectMsg: '검수 대기',
    status: {
      wait: '검수기 FEED 신호 대기',
      stop: '검수 정지',
      start: '검수 중',
      complete: '검수 완료'
    }
  }
})
