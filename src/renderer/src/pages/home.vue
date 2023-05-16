<script setup lang="ts">
import aButton from '@atoms/aButton.vue'
import { reactive, computed } from 'vue'
import loadExcel from '@template/loadExcel.vue'
import XLSX from 'xlsx'

const state = reactive({
  currentJob: 'startScan',
  label: computed(() => list[state.currentJob].label),
  excelData: []
})
const list = {
  startScan: { label: '작업 시작' },
  waitExcel: { label: '엑셀을 로드해주세요.' },
  excelLoad: { label: '엑셀 로드' }
}

const startScan = () => (state.currentJob = 'waitExcel')

const changeExcel = async (data: { [key: string]: string }) => (state.excelData = data)
</script>

<template>
  <div class="home-wrap">
    <a-button :label="state.label" @on-parent-event="startScan" />
    <div v-if="state.currentJob === 'waitExcel'">
      <load-excel @change-excel="changeExcel" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-wrap {
  display: flex;
  padding: 6rem 0 0 0;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
</style>
