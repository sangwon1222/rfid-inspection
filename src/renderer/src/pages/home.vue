<script setup lang="ts" scoped>
import aButton from '@atoms/aButton.vue'
import { reactive, computed } from 'vue'
import loadExcel from '@template/loadExcel.vue'
import idroController from '@template/idroController.vue'

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

const startScan = () => {
  state.currentJob = 'waitExcel'
}

const changeExcel = async (data: { [key: string]: string }) => (state.excelData = data)
</script>

<template>
  <div class="col-grid flex-wrap pt-10 gap-10">
    <idro-controller class="fixed top-10 right-10" />

    <a-button :label="state.label" @on-parent-event="startScan" />

    <div v-if="state.currentJob === 'waitExcel'">
      <load-excel @change-excel="changeExcel" />
    </div>
  </div>
</template>
