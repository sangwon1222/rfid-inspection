<script setup lang="ts" scoped>
import tGnb from '@template/navigation/tGlobalNaviBar.vue'
import tSnb from '@template/navigation/tSideNaviBar.vue'
import serialManager from '@util/serialManager'
import tLoading from '@template/tLoading.vue'
import tcpManager from '@util/tcpManager'
import { store } from './store/store'
import { computed } from 'vue'
import { onMounted } from 'vue'
const isLoading = computed(() => store.loading.isLoading)

onMounted(async () => {
  await tcpManager.connectPrint()
  await serialManager.connectSerialPort()
})
</script>

<template>
  <t-loading v-if="isLoading" />
  <t-gnb />
  <div class="w-full h-full pt-40 grid grid-cols-8 border-box">
    <div
      class="overflow-hidden h-[calc(100vh-40px)] p-1"
      :class="store.snbFold ? 'col-span-4 md:col-span-6' : 'col-span-8'"
    >
      <router-view />
    </div>

    <div
      class="sticky top-0 min-h-full col-span-4 md:col-span-2"
      :class="store.snbFold ? 'col-span-0 md:col-span-0' : 'col-span-4 md:col-span-2'"
    >
      <button
        class="fold-btn"
        :class="store.snbFold ? 'after:rotate-45' : 'after:rotate-225'"
        @click="store.snbFold = !store.snbFold"
      />
      <t-snb v-if="store.snbFold" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.fold-btn {
  @apply fixed 
  top-1/2 
  right-60 
  z-10 
  duration-150  
  translate-y-2/4 
  translate-x-2/4
  before:content-[''] 
  before:absolute 
  before:block 
  before:w-60 
  before:h-60 
  before:rounded-full
  before:opacity-5
  after:content-['']
  after:absolute 
  after:block 
  after:w-35
  after:h-35 
  after:border-t-4 
  after:border-r-4 
  after:mt-14
  after:ml-2;
}
</style>
