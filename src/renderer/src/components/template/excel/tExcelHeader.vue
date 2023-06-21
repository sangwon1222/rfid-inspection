<script setup lang="ts" scoped>
import serialManager from '@util/serialManager'
import excelManager from '@util/excelManager'
import aButton from '@atoms/aButton.vue'
import dbManager from '@util/dbManager'
import { store } from '@store/store'
import { debounce, map } from 'lodash-es'

const initExcel = async () => {
  store.excel.isExcelUpdated = false
  store.excel.data = []
  const input = document.getElementById('xlf') as HTMLInputElement
  input.value = ''
}

const deleteAll = async () => {
  const { ok, msg } = await dbManager.deleteAll()
  if (ok) {
    await initExcel()
    const { data } = await dbManager.read()
    dbManager.setExcelData(data)
  } else {
    alert(msg)
  }
}

const updateExcel = async (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  const target = e.target as any
  if (!target.files.length) return

  store.loading.isLoading = true
  await excelManager.updateExcel(target.files[0])
  store.loading.init()
}

const inspectStart = async () => {
  await serialManager.inspectStart()
}
const inspectStop = debounce(async () => await serialManager.inspectStop('검수 정지'), 1000, {
  trailing: false,
  leading: true
})
</script>

<template>
  <div class="relative flex flex-wrap items-center gap-4 px-6 w-full h-60 bg-main border-gray-600">
    <a-button
      custom-style="w-60 h-60 rounded border text-white bg-red-500 hover:bg-red-800"
      label="DELETE ALL"
      @on-parent-event="deleteAll"
    />

    <div class="filebox">
      <button
        class="w-60 h-60 rounded border text-white hover:bg-gray-200 hover:text-gray-800"
        for="xlf"
        label="EXCEL UPLOAD"
      >
        <input id="xlf" type="file" name="xlfile" @change="updateExcel" />
        EXCEL UPLOAD
      </button>
    </div>

    <div class="flex flex-wrap gap-4">
      <a-button
        custom-style="w-60 h-60 rounded border text-white"
        :add-style="`${store.inspector.isInspecting ? 'bg-teal-400' : 'bg-gray-200'}`"
        label="검수"
        @on-parent-event="inspectStart"
      />
      <a-button
        custom-style="w-60 h-60 rounded border text-white"
        add-style="bg-gray-200"
        label="검수 정지"
        @on-parent-event="inspectStop"
      />
    </div>
    <div class="flex flex-col justify-end px-2 h-full text-red-400">
      <p>{{ store.idro.connect ? '' : 'IDRO[ TCP ] 연결 에러' }}</p>
      <p>{{ store.inspector.connect ? '' : '검수기[ 시리얼포트 ] 연결 에러' }}</p>
      <p><span class="text-white">상태: </span> {{ store.inspector.isInspectMsg }}</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filebox {
  @apply relative flex w-60 h-60 box-border border-gray-600 cursor-pointer;
  input[type='file'] {
    @apply absolute top-0 left-0 w-60 h-60 opacity-0;
  }
}
</style>
