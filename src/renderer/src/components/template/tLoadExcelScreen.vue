<script setup lang="ts" scoped>
import AExcelButton from '@atoms/aExcelButton.vue'
import XLSX from 'xlsx'
import { reactive, computed, onMounted } from 'vue'
import { store } from '../../store/store'
import dbIpcRenderer from '../../util/dbIpcRenderer'

const state = reactive({
  excelHeader: computed(() => {
    const reulst = store.excel.data[0] ? Object.keys(store.excel.data[0]) : []
    return reulst
  }),
  excelData: computed(() => store.excel.data)
})

onMounted(async () => {
  const { ok, msg, data } = await dbIpcRenderer.create()
  console.log(msg)
  store.excel.isExcelUpdated = data.length > 0
  if (ok) {
    store.excel.data = data
  }
})

const getEvent = async (e: DragEvent | Event) => {
  e.stopPropagation()
  e.preventDefault()

  console.log(e.type)
  switch (e.type) {
    case 'drop':
      break
    // case 'drop':
    // break
  }

  const files = e.type === 'drop' ? (e as DragEvent).dataTransfer.files : (e.target as any).files
  if (!files.length) return

  const file = files[0]

  if (e.type === 'drop') {
    const input = document.getElementById('xlf') as HTMLInputElement
    input.files = files
  }
  updateExcel(file)
}

const updateExcel = async (file) => {
  console.log('excel loading')
  await store.excel.manager.updateExcel(file)
  console.log('excel loaded')
}
</script>

<template>
  <div class="flex flex-col items-center gap-2 w-full">
    <div class="w-full h-full">
      <a-excel-button
        label="Drag & Drop A EXCEL FILE"
        @drop-in="getEvent"
        @update-excel="updateExcel"
      >
        <div
          v-if="store.excel.isExcelUpdated"
          class="relative overflow-auto w-full h-[calc(100vh-100px)] p-2 bg-white"
        >
          <div class="table w-full">
            <ul id="grid-header" class="table-row">
              <li
                v-for="(v, i) in state.excelHeader"
                :key="i"
                class="py-5 pl-2 pr-10 bg-sky-500 text-slate-100 border table-cell break-all max-w-200"
              >
                {{ v }}
              </li>
            </ul>
            <ul
              v-for="(v, i) in state.excelData"
              :key="i"
              class="grid-data table-row"
              :class="
                Boolean(store.excel.checked[i])
                  ? store.excel.checked[i]
                    ? 'bg-white'
                    : 'bg-red-200'
                  : 'bg-gray-200'
              "
            >
              <li
                v-for="(value, index) in v"
                :key="index"
                class="border py-5 pr-10 pl-2 text-black table-cell break-all max-w-200"
              >
                {{ value }}
              </li>
            </ul>
          </div>
        </div>
      </a-excel-button>
    </div>
  </div>
</template>
