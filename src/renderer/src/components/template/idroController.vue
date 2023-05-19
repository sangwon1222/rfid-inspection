<script setup lang="ts" scoped>
import { ref, reactive, computed } from 'vue'
import CustomIpcRenderer from '../../util/ipcRenderer'
import { onMounted } from 'vue'
import aSettingAtn from '@atoms/aSettingAtn.vue'
import aButton from '@atoms/aButton.vue'
import aPowerGain from '@atoms/aPowerGain.vue'
import aIdroHeader from '@atoms/aIdroHeader.vue'
import { store } from '../../store/store'
import { resolve } from 'path'

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
  rfidInfo: []
})

onMounted(async () => {
  await CustomIpcRenderer.connectPrint()
})

const startCheckProcess = async (excelData: any) => {
  const { length } = excelData
  for (let i = 0; i < length; i++) {
    console.error(i)
    await readRFID(excelData[i].barcode)
  }
  console.log('end')
}

const readRFID = async (barcode: string) => {
  const read = await CustomIpcRenderer.onScan()

  if (state.rfidInfo.length === 2) {
    state.rfidInfo = []
    state.rfidInfo.push(read)
  } else {
    state.rfidInfo.push(read)
    await writeRFID(barcode, read as string)
  }
  console.log('rfidInfo', state.rfidInfo)
}

const writeRFID = async (barcode: string, readed: string) => {
  console.log('in write')
  const write = await CustomIpcRenderer.onWrite(barcode)
  console.log('write', write)
  console.log('barcode', barcode)
  console.log('readed', readed)
  if (state.rfidInfo.length === 2) {
    return
  } else {
    await readRFID(barcode)
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
  <div ref="controllerRef" class="overflow-hidden bg-white w-180 h-300 transition-all">
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
