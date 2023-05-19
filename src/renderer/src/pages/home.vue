<script setup lang="ts" scoped>
import aButton from '@atoms/aButton.vue'
import { reactive, computed, ref } from 'vue'
import loadExcel from '@template/loadExcel.vue'
import idroController from '@template/idroController.vue'

const idroControllerRef = ref(null)
const state = reactive({
  currentJob: 'startScan',
  label: computed(() => list[state.currentJob].label),
  excelData: [],
  isDraggingPopup: false,
  dragRelativePos: { x: 0, y: 0 },
  idro: null
})

const list = {
  startScan: { label: '작업 시작' },
  waitExcel: { label: '엑셀을 로드해주세요.' },
  excelLoad: { label: '엑셀 로드' }
}

const startScan = () => {
  state.currentJob = 'waitExcel'
}

const changeExcel = async (data: { [key: string]: string }) => {
  state.excelData = data
  await idroControllerRef.value.startCheckProcess(data)
}

const dragging = (e: any) => {
  if (!state.isDraggingPopup) return
  const { x, y } = state.dragRelativePos
  if (!state.idro) state.idro = document.getElementById('idroController')

  state.idro.style.top = `${e.pageY - y}px`
  state.idro.style.left = `${e.pageX - x}px`
}

const startDrag = (pos: { x: number; y: number }) => {
  state.dragRelativePos = pos
  state.isDraggingPopup = true
}
const stopDrag = () => (state.isDraggingPopup = false)
</script>

<template>
  <div
    class="relative col-grid flex-wrap gap-10 w-full h-full min-h-screen"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
    @touchend="stopDrag"
    @touchcancel="stopDrag"
    @mousemove="dragging"
    @touchmove="dragging"
  >
    <idro-controller
      id="idroController"
      ref="idroControllerRef"
      class="absolute top-4 right-4"
      @start-drag-pop-up="startDrag"
    />

    <div class="flex flex-col items-center gap-10 py-10">
      <a-button :label="state.label" @on-parent-event="startScan" />

      <div v-if="state.currentJob === 'waitExcel'">
        <load-excel @change-excel="changeExcel" />
      </div>
    </div>
  </div>
</template>
