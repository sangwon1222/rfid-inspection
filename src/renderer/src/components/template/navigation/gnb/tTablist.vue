<script setup lang="ts" scoped>
import { useRoute, useRouter } from 'vue-router'
import { filter } from 'lodash-es'
import { computed } from 'vue'
import { TypeObject } from '@type/index'

const router = useRouter()
const route = useRoute()

const tabList = computed(() => {
  const { routes } = router.options
  return filter(routes, (e) => e.name !== 'notFound' && e.path !== '/') as TypeObject[]
})
</script>

<template>
  <div class="flex gap-2 pt-2">
    <button
      v-for="(v, i) in tabList"
      :key="i"
      class="tab-btn"
      :class="`${
        route.path === v.path || (route.path === '/' && v.name === 'excel')
          ? 'tab-btn-clicked bg-main'
          : 'tab-btn-none'
      } `"
      @click="router.push(v.name)"
    >
      {{ v.label }}
    </button>
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
