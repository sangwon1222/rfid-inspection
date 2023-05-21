<script setup lang="ts" scoped>
import { ref, reactive, computed } from 'vue'
import CustomIpcRenderer from '../../util/ipcRenderer'
import { onMounted } from 'vue'
import aSettingAtn from '@atoms/aSettingAtn.vue'
import aButton from '@atoms/aButton.vue'
import aPowerGain from '@atoms/aPowerGain.vue'
import aIdroHeader from '@atoms/aIdroHeader.vue'
import { store } from '../../store/store'

const emit = defineEmits(['drag-pop-up', 'start-drag-pop-up', 'stop-drag-pop-up'])
const controllerRef = ref(null)
const state = reactive({
  isFold: false,
  isMinimal: false,
  isDragEventStop: false,
  popupPos: [0, 0],
  statusInfo: computed(() => {
    const { connect, connectMsg } = store.print
    return { ok: connect, msg: connectMsg }
  }),
  writedRFID: [],
  readedRFID: [],
  rfidOk: [],
  oneRFIDcheckCNT: 2,
  isError: false
})

onMounted(async () => {
  fold()
  await CustomIpcRenderer.connectPrint()
  await CustomIpcRenderer.connectInspector()
})

const error = () => {
  state.writedRFID = []
  state.readedRFID = []
  state.rfidOk = []
  state.isError = false
}

const startCheckProcess = async (excelData: any) => {
  const { length } = excelData
  state.rfidOk = []
  for (let i = 0; i < length; i++) {
    console.log(i)
    state.writedRFID = []
    state.readedRFID = []
    await checkRFID(excelData[i].barcode, i)
    if (state.isError) {
      error()
      break
    }
    const status = state.rfidOk[i] ? 'passed' : 'defective'
    const rfidInfo = await CustomIpcRenderer[status]()
    console.log(
      `%c ${i + 1}번째 RFID: ${rfidInfo}`,
      `padding:5px; background:${state.rfidOk[i] ? 'blue' : 'red'}; color: #fff;`
    )
  }
}

const checkRFID = async (barcode: string, index: number) => {
  if (state.writedRFID.length < 2) {
    await writeRFID(barcode, index)
  }
}

const readRFID = async (barcode: string, index: number) => {
  const { ok, msg } = (await CustomIpcRenderer.onScan()) as { ok: boolean; msg: string }
  if (!ok) return
  state.readedRFID.push(msg)
  const checkCnt = state.writedRFID.length - 1
  state.rfidOk[index] = state.readedRFID[checkCnt] === state.writedRFID[checkCnt]

  if (state.writedRFID.length <= state.oneRFIDcheckCNT) {
    await writeRFID(barcode, index)
  }
}

const writeRFID = async (barcode: string, index: number) => {
  const { ok, msg } = (await CustomIpcRenderer.onWrite(barcode)) as { ok: boolean; msg: string }
  if (!ok) {
    state.isError = true
    alert(msg)
    return
  }
  console.log(msg)
  state.writedRFID.push(msg)
  if (state.writedRFID.length <= state.oneRFIDcheckCNT) {
    await readRFID(barcode, index)
  }
}

const fold = () => {
  state.isFold = !state.isFold
  const height = state.isFold ? '24px' : '300px'
  const wrapDiv = controllerRef.value as HTMLDivElement

  wrapDiv.style.height = height
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

defineExpose({ startCheckProcess })
</script>

<template>
  <div ref="controllerRef" class="overflow-hidden bg-white w-180 transition-all">
    <a-idro-header
      :drag-stop="state.isDragEventStop"
      :status-info="state.statusInfo"
      @drag-start="dragStart"
      @fold="fold"
      @minimalize="minimalize"
    />

    <div class="overflow-y-auto w-full h-full pt-6 scroll-teal-900">
      <div class="col-grid gap-1 p-2">
        <a-button
          add-style="w-full"
          label="CONNECT PRINT"
          @on-parent-event="CustomIpcRenderer.connectPrint"
        />
        <a-button
          add-style="w-full"
          label="ON BUZZER"
          @on-parent-event="CustomIpcRenderer.onBuzzer"
        />
        <a-button
          add-style="w-full"
          label="OFF BUZZER"
          @on-parent-event="CustomIpcRenderer.offBuzzer"
        />
        <a-button add-style="w-full" label="STOP" @on-parent-event="CustomIpcRenderer.onStop" />
        <a-button add-style="w-full" label="SCAN" @on-parent-event="CustomIpcRenderer.onScan" />
        <a-button
          add-style="w-full"
          label="WRITE"
          @on-parent-event="CustomIpcRenderer.onWrite('test1a1234567899')"
        />

        <div class="customBtn">
          POWERGAIN_WEEK
          <a-power-gain />
          <a-button
            add-style="w-full"
            label="set"
            @on-parent-event="CustomIpcRenderer.onPowerGain"
          />
        </div>

        <div class="customBtn">
          ANTENNA
          <a-setting-atn @antenna="CustomIpcRenderer.antenna" />
          <a-button add-style="w-full" label="set" @on-parent-event="CustomIpcRenderer.antenna" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.customBtn {
  @apply flex flex-col gap-3 text-center border border-gray-400 py-4 px-1 rounded-xl w-full;
}
</style>
