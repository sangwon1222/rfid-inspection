<script setup lang="ts" scoped>
import { useRoute, useRouter } from 'vue-router'
import { filter } from 'lodash-es'
import { computed } from 'vue'
import { TypeObject } from '@type/index'
import { store } from '@renderer/store/store'

const router = useRouter()
const route = useRoute()

const tabList = computed(() => {
  const { routes } = router.options
  return filter(routes, (e) => e.name !== 'notFound' && e.path !== '/') as TypeObject[]
})
</script>

<template>
  <div
    class="overflow-hidden fixed z-10 top-0 left-0 flex flex-wrap justify-between px-4 w-full h-40 box-border bg-gnb"
  >
    <div class="flex gap-2 pt-2">
      <button
        v-for="(v, i) in tabList"
        :key="i"
        class="tab-btn"
        :class="`${route.path === v.path ? 'tab-btn-clicked bg-main' : 'tab-btn-none'}`"
        @click="router.push(v.name)"
      >
        {{ v.label }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-2 width-fit">
      <button
        class="border-2 rounded px-4"
        :class="store.print.connect ? 'bg-teal-300' : 'bg-red-500 text-white'"
        @click="router.push('set-idro')"
      >
        TCP (IDRO)
      </button>
      <button
        class="border-2 rounded px-4"
        :class="store.serial.connect ? 'bg-teal-300' : 'bg-red-500 text-white'"
        @click="router.push('set-serial')"
      >
        SERIAL (검수기)
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-btn {
  @apply w-100 h-32 px-1 rounded-t cursor-pointer box-border border-gray-400 border-2 border-b-0 text-white;
}
.tab-btn-clicked {
  @apply border-none;
}
.tab-btn-none {
  @apply bg-gray-500 
  hover:bg-gray-300 hover:text-black;
}
</style>
