<script setup lang="ts" scoped>
import tGnb from './components/template/navigation/tGlobalNaviBar.vue'
import tSnb from './components/template/navigation/tSideNaviBar.vue'
import page from './page.vue'
</script>

<template>
  <t-gnb />
  <div class="w-full h-full pt-100 grid grid-cols-8 border-box">
    <div class="h-full min-h-[calc(100vh-100px)] col-span-4 md:col-span-6">
      <page />
    </div>
    <div class="sticky top-0 min-h-full col-span-4 md:col-span-2">
      <t-snb />
    </div>
  </div>
</template>
