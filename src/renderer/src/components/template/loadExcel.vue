<script setup lang="ts">
import AExcelButton from '@atoms/aExcelButton.vue'
import XLSX from 'xlsx'
import { excel } from '@store/excel'
import { reactive } from 'vue'
import { computed } from 'vue'
// const { ipcRenderer } = require('electron')

const emit = defineEmits(['changeExcel'])
const state = reactive({
  excelHeader: computed(() => Object.keys(excel.data[0])),
  excelData: computed(() => excel.data),
  isExcelUpdated: false
})

const updateExcel = async (e: DragEvent | Event) => {
  e.stopPropagation()
  e.preventDefault()

  const files = (e.target as any).files
  console.log(e.target)
  if (!files.length) return
  const file = files[0]

  console.time('load excel')
  const reader = new FileReader()
  reader.onloadend = async () => {
    const arrayBuffer = reader.result
    // debugger

    const workbook = XLSX.read(arrayBuffer, { type: 'array' })

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const exceldata = XLSX.utils.sheet_to_json(sheet)
    excel.data = exceldata

    console.timeEnd('load excel')
    emit('changeExcel', exceldata)
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
  console.log(input)
  console.log(input.value)
  input.value = ''
}

const changeGrid = () => {
  const tag = document.getElementsByClassName('grid')
  for (let i = 0; i < tag.length; i++) {
    const target = tag[i] as HTMLUListElement
    target.style.gridTemplateColumns = `repeat(${state.excelHeader.length}, 1fr)`
  }
}
</script>

<template>
  <div class="load-excel-wrap">
    <div>
      <input id="xlf" type="file" name="xlfile" @change="updateExcel" />
      <button v-if="state.isExcelUpdated" @click="deleteExcelData">DELETE EXCEL</button>
    </div>
    <AExcelButton
      v-if="!state.isExcelUpdated"
      label="Drag & Drop a excel file"
      @drop-in="updateExcel"
    />
    <div v-if="state.isExcelUpdated">
      <ul class="grid header">
        <li v-for="(v, i) in state.excelHeader" :key="i">{{ v }}</li>
      </ul>
      <ul v-for="(v, i) in state.excelData" :key="i" class="grid">
        <li v-for="(value, index) in v" :key="index">{{ value }}</li>
      </ul>
    </div>
  </div>
</template>

<style lang="less" scoped>
.load-excel-wrap {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  animation: fadeIn 1s forwards;
  > li {
    padding: 0.5rem;
    border: 1px #fff solid;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.header {
  > li {
    padding: 1rem 0.5rem;
    background-color: bisque;
    color: #000;
  }
}
</style>
