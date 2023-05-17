<script setup lang="ts" scoped>
import AExcelButton from '@atoms/aExcelButton.vue'
import XLSX from 'xlsx'
import { reactive } from 'vue'
import { computed } from 'vue'
import { excel } from '@store/excel'

const emit = defineEmits(['changeExcel'])
const state = reactive({
  excelHeader: computed(() => Object.keys(excel.data[0])),
  excelData: computed(() => excel.data),
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
    excel.data = excelData

    console.timeEnd('load excel')
    emit('changeExcel', excelData)
    state.isExcelUpdated = true
    setTimeout(() => {
      changeGrid()
    }, 50)
  }
  reader.readAsArrayBuffer(file)
}

const deleteExcelData = () => {
  state.isExcelUpdated = false
  excel.data = []
  const input = document.getElementById('xlf') as HTMLInputElement
  input.value = ''
}

const changeGrid = () => {
  // const header = document.getElementById('grid-header') as HTMLUListElement
  // header.classList.remove('grid')
  // header.classList.add(`grid`)
  // header.classList.add(`grid-cols-${state.excelHeader.length}`)
  // const data = document.getElementsByClassName('grid-data')
  // for (let i = 0; i < data.length; i++) {
  //   const d = data[i] as HTMLUListElement
  //   console.log(d.classList)
  //   d.classList.remove('grid')
  //   d.classList.add(`grid`)
  //   d.classList.add(`grid-cols-${state.excelHeader.length}`)
  // }
}
</script>

<template>
  <div class="col-grid gap-2">
    <div>
      <input id="xlf" type="file" name="xlfile" @change="updateExcel" />
      <button v-if="state.isExcelUpdated" @click="deleteExcelData">DELETE EXCEL</button>
    </div>

    <AExcelButton
      v-if="!state.isExcelUpdated"
      label="Drag & Drop a excel file"
      @drop-in="updateExcel"
    />

    <div v-if="state.isExcelUpdated" class="table">
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
          class="border py-5 pr-10 pl-2 table-cell break-all max-w-200"
        >
          {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>
