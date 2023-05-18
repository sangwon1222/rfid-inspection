<script setup lang="ts" scoped>
import { ref, reactive, computed } from 'vue'
import CustomIpcRenderer from '../../util/ipcRenderer'
import { onMounted } from 'vue'
import aAtnInput from '@atoms/aAtnInput.vue'
import aButton from '@atoms/aButton.vue'
import { print } from '../../store/print'

const emit = defineEmits(['move-pop-up'])
const controllerRef = ref(null)
const state = reactive({
  isFold: false,
  height: 0,
  status: computed(() => print.connect),
  statusMsg: computed(() => print.connectMsg),
  dragStart: false,
  dragLayer: { x: 0, y: 0 }
})

onMounted(async () => {
  const wrapDiv = controllerRef.value as HTMLDivElement
  state.height = +wrapDiv.offsetHeight

  await CustomIpcRenderer.connectPrint()
})

const fold = () => {
  const wrapDiv = controllerRef.value as HTMLDivElement
  if (state.isFold) {
    wrapDiv.style.height = `${state.height}px`
    wrapDiv.style.width = `180px`
  } else {
    wrapDiv.style.width = `24px`
    wrapDiv.style.height = `24px`
  }
  state.isFold = !state.isFold
}

const dragStart = (e) => {
  state.dragLayer = { x: e.layerX, y: e.layerY }
  state.dragStart = true
}
const dragStop = () => {
  state.dragStart = false
}
// const dragging = (e: MouseEvent | TouchEvent) => {
const dragging = (e: any) => {
  if (!state.dragStart) return
  console.log(e)
  const pos =
    e.type === 'mousemove'
      ? { x: e.pageX - state.dragLayer.x, y: e.pageY - state.dragLayer.y }
      : { x: e.touches[0].pageX - state.dragLayer.x, y: e.touches[0].pageY - state.dragLayer.y }
  emit('move-pop-up', controllerRef.value, pos)
}
</script>

<template>
  <div
    ref="controllerRef"
    class="overflow-hidden transition-all whitespace-nowrap bg-white w-180"
    @mouseup="dragStop"
    @mouseout="dragStop"
    @touchend="dragStop"
    @touchcancel="dragStop"
    @mousemove="dragging"
    @touchmove="dragging"
  >
    <div
      class="flex justify-between items-center px-1 mb-2 w-full h-6 bg-gray-500 cursor-pointer"
      @mousedown="dragStart"
      @touchstart="dragStart"
    >
      <div class="overflow-hidden" :class="state.isFold ? 'w-0' : ''">
        <p class="text-sm" :class="state.status ? 'text-white' : 'text-red-800'">
          {{ state.statusMsg }}
        </p>
      </div>
      <a-button
        custom-style="w-4 h-4 p-0 flex justify-center items-center border"
        label="-"
        @click="fold"
      />
    </div>

    <div class="col-grid gap-1 p-2 font-extrabold">
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
        label="POWERGAIN_WEEK"
        @on-parent-event="CustomIpcRenderer.onPowerGainWeek"
      />

      <a-button
        add-style="flex flex-col gap-2 w-full"
        label="ANTENNA"
        @on-parent-event="CustomIpcRenderer.antenna"
      >
        <a-atn-input @antenna="CustomIpcRenderer.antenna" />
        <button form="antenna-form" type="submit" class="cursor-pointer">set</button>
      </a-button>
    </div>
  </div>
</template>
