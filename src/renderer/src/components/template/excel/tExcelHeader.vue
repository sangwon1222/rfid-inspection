<script setup lang="ts" scoped>
import serialManager from '@renderer/util/serialManager'
import excelManager from '@renderer/util/excelManager'
import aButton from '@atoms/aButton.vue'
import dbManager from '@util/dbManager'
import { store } from '@store/store'
import { useRouter } from 'vue-router'

const router = useRouter()
const initExcel = async () => {
  store.excel.isExcelUpdated = false
  store.excel.data = []
  const input = document.getElementById('xlf') as HTMLInputElement
  input.value = ''
}

const deleteAll = async () => {
  const { ok, msg } = await dbManager.deleteAll()
  if (ok) {
    const { data } = await dbManager.read()
    initExcel()
    store.excel.data = data
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
  const routeName =
    (store.idro.connect ? '' : 'set-idro') || (store.inspector.connect ? '' : 'set-serial')

  if (store.inspector.connect && store.idro.connect) {
    await serialManager.inspectStart()
  } else {
    router.push(routeName)
  }
}
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

    <div class="flex items-end">
      <a-button
        custom-style="w-60 h-60 rounded border text-white"
        :add-style="`${store.inspector.isInspecting ? 'bg-teal-400' : 'bg-gray-200'}`"
        label="검수"
        @on-parent-event="inspectStart"
      />

      <label v-if="store.inspector.isInspecting">{{ store.inspector.isInspectMsg }}</label>
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
