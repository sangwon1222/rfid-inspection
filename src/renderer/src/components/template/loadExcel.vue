<script setup lang="ts" scoped>
import AExcelButton from '@atoms/aExcelButton.vue'
import XLSX from 'xlsx'
import { reactive, computed } from 'vue'
import aButton from '@atoms/aButton.vue'
import { store } from '../../store/store'

const emit = defineEmits(['changeExcel'])
const state = reactive({
  excelHeader: computed(() => Object.keys(store.excel.data[0])),
  excelData: computed(() => store.excel.data),
  isExcelUpdated: false
})

const updateExcel = async (e: DragEvent | Event) => {
  e.stopPropagation()
  e.preventDefault()

  const files = e.type === 'drop' ? (e as DragEvent).dataTransfer.files : (e.target as any).files
  if (!files.length) return
  const file = files[0]

  if (e.type === 'drop') {
    const input = document.getElementById('xlf') as HTMLInputElement
    input.files = files
  }

  console.time('load excel')
  const reader = new FileReader()
  reader.onloadend = async () => {
    const arrayBuffer = reader.result
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const excelData = XLSX.utils.sheet_to_json(sheet)
    store.excel.data = excelData

    console.timeEnd('load excel')
    emit('changeExcel', excelData)
    state.isExcelUpdated = true
  }
  reader.readAsArrayBuffer(file)
}

const deleteExcelData = () => {
  state.isExcelUpdated = false
  store.excel.data = []
  const input = document.getElementById('xlf') as HTMLInputElement
  input.value = ''
}
</script>

<template>
  <div class="col-grid gap-2">
    <div class="flex items-center max-w-600 gap-2">
      <input id="xlf" type="file" name="xlfile" @click="deleteExcelData" @change="updateExcel" />
      <a-button v-if="state.isExcelUpdated" @click="deleteExcelData"> DELETE </a-button>
    </div>

    <div class="relative w-full h-full mt-4">
      <AExcelButton
        label="Drag & Drop a excel file"
        :class="`opacity-${state.isExcelUpdated ? '0' : '1'}`"
        @drop-in="updateExcel"
      />

      <div v-if="state.isExcelUpdated" class="table p-10">
        <ul id="grid-header" class="table-row">
          <li
            v-for="(v, i) in state.excelHeader"
            :key="i"
            class="py-5 pl-2 pr-10 bg-sky-500 text-slate-100 border table-cell break-all max-w-200"
          >
            {{ v }}
          </li>
        </ul>
        <ul v-for="(v, i) in state.excelData" :key="i" class="grid-data table-row">
          <li
            v-for="(value, index) in v"
            :key="index"
            class="border py-5 pr-10 pl-2 bg-white text-black table-cell break-all max-w-200"
          >
            {{ value }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
