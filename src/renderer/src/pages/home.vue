<script setup lang="ts">
import aButton from '@atoms/aButton.vue'
import { reactive, computed } from 'vue'

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
const dropInTag = (e) => {
  console.log(e)
}
const dropInputTag = (e) => {
  console.log(e)
}
</script>

<template>
  <div class="wrap">
    <a-button :label="state.label" @on-parent-event="startScan" />
    <div
      v-if="state.currentJob === 'waitExcel'"
      class="dragAndDrop"
      draggable
      @dragenter.prevent="dropInTag($event)"
      @drop.prevent="dropInputTag($event)"
      @dragover.prevent
    >
      엑셀 파일 업로드
    </div>
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
  .dragAndDrop {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    top: 200px;
    border: 2px rgba(255, 255, 255, 0.3) solid;
    width: 400px;
    height: 400px;
    border-radius: 40px;
  }
}
</style>
