<script setup lang="ts" scoped>
import { useRouter } from 'vue-router'
import { store } from '../../../store/store'
import tExcelHeader from '@template/header/tExcelHeader.vue'

const router = useRouter()
const tabList = [
  { en: '/', kor: '엑셀 업로드' },
  { en: 'excel2', kor: '엑셀 업로드2' }
]

const changeTab = (tab: string) => {
  if (store.page.tab === tab) return
  store.page.tab = tab
  router.push(tab)
}
</script>

<template>
  <div class="fixed z-10 top-0 left-0 flex flex-col pt-2 w-full box-border bg-gnb">
    <div class="flex gap-1 w-full px-4">
      <button
        v-for="(v, i) in tabList"
        :key="i"
        :class="`${store.page.tab === v.en ? 'tab-btn-clicked bg-main' : 'tab-btn-none'}`"
        class="tab-btn"
        @click="changeTab(v.en)"
      >
        {{ v.kor }}
      </button>
    </div>
    <div class="flex gap-1 w-full">
      <t-excel-header v-if="store.page.tab === '/'" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-btn {
  @apply w-100 h-30 px-1 rounded-t cursor-pointer box-border border-gray-400 border-2 border-b-0 text-white;
}
.tab-btn-clicked {
  @apply border-none;
}
.tab-btn-none {
  @apply bg-gray-500 
  hover:bg-gray-300 hover:text-black;
}
</style>
