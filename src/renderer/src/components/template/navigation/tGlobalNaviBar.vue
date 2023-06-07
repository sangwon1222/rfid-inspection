<script setup lang="ts" scoped>
import { store } from '@renderer/store/store'
import tTablist from './gnb/tTablist.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="overflow-hidden fixed z-10 top-0 left-0 flex flex-wrap justify-between px-4 w-full h-40 box-border bg-gnb"
  >
    <t-tablist />

    <div class="grid grid-cols-2 gap-2 width-fit">
      <button
        class="border-2 rounded px-4"
        :class="store.idro.connect ? 'bg-teal-300' : 'bg-red-500 text-white'"
        @click="router.push('set-idro')"
      >
        TCP (IDRO)
      </button>
      <button
        class="border-2 rounded px-4"
        :class="store.inspector.connect ? 'bg-teal-300' : 'bg-red-500 text-white'"
        @click="router.push('set-serial')"
      >
        SERIAL (검수기)
      </button>
    </div>
  </div>
</template>
