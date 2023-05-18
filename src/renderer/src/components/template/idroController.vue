<script setup lang="ts" scoped>
import { ref, reactive, computed } from 'vue'
import CustomIpcRenderer from '../../util/ipcRenderer'
import { onMounted } from 'vue'
import aAtnInput from '@atoms/aAtnInput.vue'
import aButton from '@atoms/aButton.vue'
import { print } from '../../store/print'

const emit = defineEmits(['drag-pop-up', 'start-drag-pop-up', 'stop-drag-pop-up'])
const controllerRef = ref(null)
const state = reactive({
  isFold: false,
  height: 0,
  status: computed(() => print.connect),
  statusMsg: computed(() => print.connectMsg)
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
  } else {
    wrapDiv.style.height = `24px`
  }
  state.isFold = !state.isFold
}
const dragStart = (e) => {
  emit('start-drag-pop-up', { x: e.layerX, y: e.layerY })
}
</script>

<template>
  <div ref="controllerRef" class="overflow-hidden transition-all whitespace-nowrap bg-white w-180">
    <div
      class="flex justify-between items-center px-1 mb-2 w-full h-6 bg-gray-400 cursor-pointer"
      @mousedown="dragStart"
      @touchstart="dragStart"
    >
      <div class="overflow-hidden">
        <p class="text-sm" :class="state.status ? 'text-white' : 'text-red-800'">
          {{ state.statusMsg }}
        </p>
      </div>
      <a-button
        custom-style="w-4 h-4 p-2 flex justify-center items-center border text-white"
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

      <div class="flex flex-col gap-2 text-center border border-gray-400 p-4 rounded-xl w-full">
        ANTENNA
        <a-atn-input @antenna="CustomIpcRenderer.antenna" />
        <a-button add-style="w-full p-1" label="set" @on-parent-event="CustomIpcRenderer.antenna">
        </a-button>
      </div>
    </div>
  </div>
</template>
