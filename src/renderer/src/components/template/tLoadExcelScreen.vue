<script setup lang="ts" scoped>
import AExcelButton from '@atoms/aExcelButton.vue'
import { computed, onMounted } from 'vue'
import { store } from '@store/store'

const excelHeader = computed(() => (store.excel.data[0] ? Object.keys(store.excel.data[0]) : []))
const excelData = computed(() => store.excel.data)

const getEvent = async (e: DragEvent | Event) => {
  const files = (e as DragEvent).dataTransfer.files
  if (!files.length) return
  const input = document.getElementById('xlf') as HTMLInputElement
  input.files = files
  updateExcel(files[0])
}

const updateExcel = async (file) => {
  await store.excel.manager.updateExcel(file)
}

const getCssStyle = (i: number) => {
  switch (store.excel.checkedRFID[i]) {
    case true:
      return 'bg-blue-200'
    case false:
      return 'bg-red-200'
    default:
      return 'bg-white'
  }
}
</script>

<template>
  <div class="excel-screen-wrap">
    <div class="w-full h-full">
      <a-excel-button
        label="Drag & Drop A EXCEL FILE"
        @drop-in.stop.self="getEvent"
        @update-excel="updateExcel"
      >
        <div v-if="store.excel.isExcelUpdated" class="table-wrap">
          <div class="table w-full">
            <ul class="table-row">
              <li
                v-for="(v, i) in excelHeader"
                :key="i"
                class="py-5 pl-2 pr-10 bg-sky-500 text-slate-100 border table-cell break-all max-w-200"
              >
                {{ v }}
              </li>
            </ul>
            <ul v-for="(v, i) in excelData" :key="i" class="table-row" :class="getCssStyle(i)">
              <li v-for="(value, index) of v" :key="index" class="table-cell">
                {{ value }}
              </li>
            </ul>
          </div>
        </div>
      </a-excel-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.excel-screen-wrap {
  @apply flex w-full h-full;
  .table-wrap {
    @apply relative overflow-auto w-full p-2 bg-white;
    height: calc(100vh - 100px);
  }
  .table-cell {
    @apply border py-5 pr-10 pl-2 text-black break-all max-w-200;
  }
}
</style>
