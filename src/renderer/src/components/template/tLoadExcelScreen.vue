<script setup lang="ts" scoped>
import excelManager from '@renderer/util/excelManager'
import AExcelButton from '@atoms/aExcelButton.vue'
import { computed, watch } from 'vue'
import { store } from '@store/store'

const excelHeader = computed(() => (store.excel.data[0] ? Object.keys(store.excel.data[0]) : []))
const excelData = computed(() => store.excel.data)
const excelTable = computed(() => document.getElementsByClassName('excel-table') as HTMLCollection)
const focusIndex = computed(() => store.excel.focusCellIndex)

watch(focusIndex, () => {
  if (focusIndex.value < 5) return
  const target = excelTable.value[focusIndex.value] as HTMLUListElement
  target?.focus()
})

const dropInExcelFile = async (e: DragEvent | Event) => {
  const files = (e as DragEvent).dataTransfer.files
  if (!files.length) return
  const input = document.getElementById('xlf') as HTMLInputElement
  input.files = files
  updateExcel(files[0])
}

const updateExcel = async (file) => {
  await excelManager.updateExcel(file)
}

const getCssStyle = (i: number) => {
  switch (store.excel.checkedRFID[i]) {
    case true:
      return 'bg-blue-200'
    case false:
      return 'bg-red-200'
    default:
      return ''
  }
}
</script>

<template>
  <div class="excel-screen-wrap">
    <a-excel-button
      label="Drag & Drop A EXCEL FILE"
      @drop-in.stop.self="dropInExcelFile"
      @update-excel="updateExcel"
    >
      <div v-if="store.excel.isExcelUpdated" class="table-wrap h-[calc(100vh-130px)]">
        <div class="relative table table-auto w-full">
          <ul class="sticky top-0 left-0 table-row">
            <li
              v-for="(v, i) in excelHeader"
              :key="i"
              class="table-cell bg-sky-800"
              :class="i ? '' : 'w-50'"
            >
              <label class="text-white">{{ i ? v : 'idx' }}</label>
            </li>
          </ul>
          <ul
            v-for="(v, i) in excelData"
            :key="i"
            :tabindex="i"
            class="table-row excel-table"
            :class="getCssStyle(i)"
          >
            <li v-for="(value, key) of v" :key="key" class="table-cell">
              {{ value }}
            </li>
          </ul>
        </div>
      </div>
    </a-excel-button>
  </div>
</template>

<style scoped lang="less">
.excel-screen-wrap {
  @apply flex w-full h-full px-6 box-border;
  .table-wrap {
    @apply relative overflow-y-auto w-full bg-white cursor-pointer;
  }
  .table-row {
    @apply h-32;
  }
  .table-cell {
    @apply px-2 break-all border align-middle text-black;
  }
}
</style>
