<script setup lang="ts" scoped>
import { store } from '@renderer/store/store'
import tTablist from './gnb/tTablist.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import tcpManager from '@renderer/util/tcpManager'
import serialManager from '@renderer/util/serialManager'

const router = useRouter()
const idroStatusColor = computed(() => {
  return statusColor(store.idro.connect)
})
const serialStatusColor = computed(() => {
  return statusColor(store.inspector.connect)
})

const statusColor = (status: boolean | any) => {
  switch (status) {
    case true:
      return 'bg-teal-300 text-gray-600'
    case false:
      return 'bg-red-400 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
}

const connectTcp = () => {
  tcpManager.connectPrint()
  router.push('set-idro')
}
const connectSerial = () => {
  serialManager.connectSerialPort()
  router.push('set-serial')
}
</script>

<template>
  <div
    class="overflow-hidden fixed z-10 top-0 left-0 flex flex-wrap justify-between px-4 w-full h-40 box-border bg-gnb"
  >
    <t-tablist />

    <div class="grid grid-cols-2 gap-2 width-fit">
      <button class="border-2 rounded px-4" :class="idroStatusColor" @click="connectTcp">
        TCP (IDRO)
      </button>
      <button class="border-2 rounded px-4" :class="serialStatusColor" @click="connectSerial">
        SERIAL (검수기)
      </button>
    </div>
  </div>
</template>
