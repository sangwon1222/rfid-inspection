<script setup lang="ts" scoped>
import { ref, reactive, computed } from 'vue'
import InspectorIpcRenderer from '../../util/InspectorIpcRenderer'
import PrintIpcRenderer from '../../util/printIpcRenderer'
import { onMounted } from 'vue'
import aButton from '@atoms/aButton.vue'
import aPowerGain from '@atoms/aPowerGain.vue'
import aIdroHeader from '@atoms/aIdroHeader.vue'
import { store } from '../../store/store'

const emit = defineEmits(['drag-pop-up', 'start-drag-pop-up', 'stop-drag-pop-up'])
const controllerRef = ref(null)
const state = reactive({
  isFold: true,
  isMinimal: false,
  isDragEventStop: false,
  popupPos: [0, 0],
  statusInfo: computed(() => {
    const { connect, connectMsg } = store.idro
    return { ok: connect, msg: connectMsg }
  }),
  writedRFID: [],
  readedRFID: [],
  rfidOk: [],
  oneRFIDcheckCNT: 2,
  currentCheck: -1
})

onMounted(async () => {
  await PrintIpcRenderer.connectPrint()
  await InspectorIpcRenderer.connectSerialPort()

  await PrintIpcRenderer.getReaderState()
})

const stopScan = () => {
  state.writedRFID = []
  state.readedRFID = []
  state.rfidOk = []
  store.excel.checkedRFID = []
}

const startScan = async () => {
  const { length } = store.excel.data
  state.rfidOk = []

  store.idro.isInspectStop = false

  for (let i = 0; i < length; i++) {
    if (store.idro.isInspectStop) {
      stopScan()
      break
    }
    state.currentCheck = i
    state.writedRFID = []
    state.readedRFID = []

    const getStartScanCode = await InspectorIpcRenderer.getStartScanCode()
    console.log('검수기에서 받은 커멘드: ', getStartScanCode)
    const isStartScan = getStartScanCode === 'feedStart'
    if (!isStartScan) return
    // H02 H45 H53 H03
    console.log(
      `%c ${i + 1}번째 RFID => [write 대기중...]`,
      `padding:5px; background: #000; color: #fff;`
    )
    await checkRFID(store.excel.data[i].epc, i)
    if (store.idro.isInspectStop) {
      stopScan()
      break
    }
    const status = state.rfidOk[i] ? 'passed' : 'defective'
    const rfidInfo = await InspectorIpcRenderer[status]()
    console.log(
      `%c ${i + 1}번째 RFID: ${rfidInfo}`,
      `padding:5px; background:${state.rfidOk[i] ? 'blue' : 'red'}; color: #fff;`
    )

    store.excel.checkedRFID[i] = state.rfidOk[i]
  }
}

const checkRFID = async (epc: string, index: number) => {
  if (store.idro.isInspectStop) return
  if (state.writedRFID.length < 2) {
    await writeRFID(epc, index)
  }
}

const writeRFID = async (epc: string, index: number) => {
  if (store.idro.isInspectStop) return
  const { ok, msg } = (await PrintIpcRenderer.onWrite(epc)) as { ok: boolean; msg: string }
  if (!ok) {
    store.idro.isInspectStop = true
    alert(msg)
    return
  }
  state.writedRFID.push(msg)
  if (state.writedRFID.length <= state.oneRFIDcheckCNT) {
    await readRFID(epc, index)
  }
}

const readRFID = async (epc: string, index: number) => {
  const { ok, msg } = (await PrintIpcRenderer.onMemoryRead()) as { ok: boolean; msg: string }
  if (!ok) return
  state.readedRFID.push(msg)
  const checkCnt = state.writedRFID.length - 1
  state.rfidOk[index] = state.readedRFID[checkCnt] === state.writedRFID[checkCnt]

  console.groupCollapsed('check')
  console.log(`read: ${state.readedRFID[checkCnt]}`)
  console.log(`write: ${state.writedRFID[checkCnt]}`)
  console.log(`check: ${state.rfidOk[index]}`)
  console.groupEnd()

  if (state.writedRFID.length <= state.oneRFIDcheckCNT) {
    await writeRFID(epc, index)
  }
}

const fold = (e) => {
  state.isDragEventStop = true
  state.isFold = !state.isFold
  const height = state.isFold ? '24px' : '300px'
  const rotate = state.isFold ? '0deg' : '180deg'
  const wrapDiv = controllerRef.value as HTMLDivElement

  wrapDiv.style.height = height
  e.target.style.rotate = rotate
  setTimeout(() => (state.isDragEventStop = false), 500)
}

const dragStart = (e) => {
  if (state.isDragEventStop) return
  emit('start-drag-pop-up', { x: e.layerX, y: e.layerY })
}

const minimalize = () => {
  if (state.isMinimal) setMini()
  else setMax()

  state.isMinimal = !state.isMinimal
}

const setMini = () => {
  const wrapDiv = controllerRef.value as HTMLDivElement

  wrapDiv.style.width = `180px`
  wrapDiv.style.top = `${state.popupPos[1]}px`
  wrapDiv.style.left = `${state.popupPos[0]}px`
  setTimeout(() => (state.isDragEventStop = false), 500)
}

const setMax = () => {
  const wrapDiv = controllerRef.value as HTMLDivElement
  const { offsetTop, offsetLeft } = wrapDiv
  state.popupPos = [offsetLeft, offsetTop]

  wrapDiv.style.width = `100%`
  wrapDiv.style.top = `${window.innerHeight - 20}px`
  wrapDiv.style.left = `0px`
  state.isDragEventStop = true
}

const readOnce = async () => {
  const result = await PrintIpcRenderer.onMemoryRead()
  console.log('read_result', result)
}
const writeOnce = async () => {
  const result = await PrintIpcRenderer.onWrite('1testa4321')
  console.log('write_result', result)
}

const getControllerDivElement = () => {
  return controllerRef.value
}
defineExpose({ getControllerDivElement })
</script>

<template>
  <div ref="controllerRef" class="overflow-hidden bg-white w-180 h-24 transition-all z-10">
    <a-idro-header
      :drag-stop="state.isDragEventStop"
      :status-info="state.statusInfo"
      @drag-start="dragStart"
      @fold="fold"
      @minimalize="minimalize"
    />

    <div class="overflow-y-auto w-full h-full pt-6 scroll-teal-900">
      <div class="flex flex-col items-center gap-1 p-2">
        <a-button
          add-style="w-full"
          label="CONNECT PRINT"
          @on-parent-event="PrintIpcRenderer.connectPrint"
        />
        <a-button add-style="w-full" label="SCAN" @on-parent-event="startScan" />
        <a-button add-style="w-full" label="STOP" @on-parent-event="stopScan" />
        <a-button add-style="w-full" label="READ_ONCE" @on-parent-event="readOnce" />
        <a-button add-style="w-full" label="WRITE_ONCE" @on-parent-event="writeOnce" />

        <div class="customBtn">
          POWERGAIN
          <a-power-gain />
          <a-button
            add-style="w-full"
            label="set"
            @on-parent-event="PrintIpcRenderer.onPowerGain"
          />
        </div>

        <div class="customBtn">
          ANTENNA
          <a-setting-atn @antenna="PrintIpcRenderer.antenna" />
          <a-button add-style="w-full" label="set" @on-parent-event="PrintIpcRenderer.antenna" />
        </div>
        <a-button
          add-style="w-full"
          label="ON BUZZER"
          @on-parent-event="PrintIpcRenderer.onBuzzer"
        />
        <a-button
          add-style="w-full"
          label="OFF BUZZER"
          @on-parent-event="PrintIpcRenderer.offBuzzer"
        />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.customBtn {
  @apply flex flex-col gap-3 text-center border border-gray-400 py-4 px-1 rounded-xl w-full;
}
</style>
