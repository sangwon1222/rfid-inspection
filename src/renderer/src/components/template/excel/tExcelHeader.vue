<script setup lang="ts" scoped>
import dbManager from '@util/dbManager'
import { store } from '@store/store'

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
  }
}

const updateExcel = async (e: Event) => {
  e.stopPropagation()
  e.preventDefault()
  const target = e.target as any
  if (!target.files.length) return

  store.loading.isLoading = true
  await store.excel.manager.updateExcel(target.files[0])
  store.loading.init()
}
</script>

<template>
  <div
    class="relative flex items-center flex-wrap gap-2 px-4 h-80 w-full bg-main border-b-2 border-gray-600"
  >
    <div class="filebox">
      <button
        class="w-60 h-60 rounded border text-white hover:bg-gray-200 hover:text-gray-800"
        for="xlf"
      >
        <input id="xlf" type="file" name="xlfile" @change="updateExcel" />
        EXCEL UPLOAD
      </button>
    </div>

    <div class="filebox">
      <button
        class="w-60 h-60 rounded border text-white bg-red-500 hover:bg-red-800"
        @click="deleteAll"
      >
        DELETE ALL
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.filebox {
  @apply relative flex w-60 h-60 box-border border-b-2 border-gray-600;
  input[type='file'] {
    /* 파일 필드 숨기기 */
    @apply absolute top-0 left-0 w-60 h-60 opacity-0 cursor-pointer;
  }
}
</style>