<script setup lang="ts" scoped>
import { store } from '@renderer/store/store'
import { computed, watch } from 'vue'

const total = computed(() => store.loading.total)
const progress = computed(() => store.loading.progress)

watch(progress, () => {
  console.log(progress)
  const bar = document.getElementById('progress-bar') as HTMLDivElement
  bar.style.width = `${Math.ceil((progress.value / total.value) * 800)}px`
})
</script>

<template>
  <div class="fixed t-0 l-0 z-100 w-screen h-screen">
    <div class="w-full h-full bg-black opacity-50">
      <div class="circle" />
    </div>
    <div id="progress-bar-wrap">
      <div id="progress-bar" ref="progressBar" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.circle {
  @apply fixed left-1/2 w-200 h-200 border-20 border-transparent border-t-white rounded-full;
  top: calc(50% - 100px);
  animation: rotate infinite 2s linear;
}
@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

#progress-bar-wrap {
  @apply overflow-hidden fixed left-1/2 w-800 h-40 border-2 rounded bg-white;
  top: calc(50% + 200px);
  transform: translate(-50%, -50%);
  #progress-bar {
    @apply bg-sky-500 h-full;
  }
}
</style>
