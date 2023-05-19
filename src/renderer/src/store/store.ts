import { reactive } from 'vue'

export const store = reactive({
  excel: {
    data: []
  },
  print: {
    connect: false,
    connectMsg: 'disconnect...',
    atnInfo: [1, 0, 0, 0],
    powerGain: 50
  }
})
