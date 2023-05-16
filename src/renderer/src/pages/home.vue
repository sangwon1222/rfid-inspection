<script setup lang="ts">
import aButton from '@atoms/aButton.vue'
import { reactive, computed } from 'vue'
import AExcelButton from '../components/atoms/aExcelButton.vue'

interface IFileTypes {
  id: number // 파일들의 고유값 id
  object: File
}

const state = reactive({
  currentJob: 'startScan',
  label: computed(() => list[state.currentJob].label)
})

const list = {
  startScan: { label: '작업 시작' },
  waitExcel: { label: '엑셀을 로드해주세요.' },
  excelLoad: { label: '엑셀 로드' }
}

const startScan = () => {
  state.currentJob = 'waitExcel'
  console.log(state.currentJob)
}

const dropIn = (e: DragEvent) => {
  console.log(e.dataTransfer.files)
}
</script>

<template>
  <div class="wrap">
    <a-button :label="state.label" @on-parent-event="startScan" />
    <a-excel-button
      v-if="state.currentJob === 'waitExcel'"
      label="Drag & Drop a excel file"
      @drop-in="dropIn"
    />
  </div>
</template>

<style lang="less" scoped>
.wrap {
  position: relative;
  display: flex;
  padding: 6rem 0 0;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
</style>
