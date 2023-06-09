<script setup lang="ts" scoped>
import tGnb from '@template/navigation/tGlobalNaviBar.vue'
import tSnb from '@template/navigation/tSideNaviBar.vue'
import serialManager from '@util/serialManager'
import tLoading from '@template/tLoading.vue'
import tcpManager from '@util/tcpManager'
import dbManager from '@util/dbManager'
import { store } from '@store/store'
import { onMounted, computed } from 'vue'
const isLoading = computed(() => store.loading.isLoading)

onMounted(async () => {
  await dbManager.connectDB()
  await tcpManager.connectPrint()
  await serialManager.connectSerialPort()
})
</script>

<template>
  <t-loading v-if="isLoading" />
  <t-gnb />
  <div class="overflow-hidden flex w-full h-screen pt-40">
    <div :class="store.snbFold ? 'w-full' : 'w-[calc(100vw-310px)]'" class="h-full">
      <router-view />
    </div>

    <!-- <div
      class="fixed top-40 right-0 min-h-[calc(100vh-50px)] box-border duration-500 z-10"
      :class="store.snbFold ? 'w-0 p-0' : 'w-310 p-1'"
    >
      <button
        class="fold-btn"
        :class="store.snbFold ? 'after:rotate-225' : 'after:rotate-45'"
        @click="store.snbFold = !store.snbFold"
      />
      <t-snb />
    </div> -->
  </div>
</template>

<style lang="less" scoped>
.fold-btn {
  @apply fixed 
  top-1/2 
  right-60 
  z-20 
  duration-150  
  translate-y-2/4 
  translate-x-2/4
  after:content-['']
  after:absolute 
  after:block 
  after:w-35
  after:h-35 
  after:border-teal-600
  after:border-t-[calc(8px)]
  after:border-r-[calc(8px)]
  after:mt-14
  after:ml-2;
}
</style>
