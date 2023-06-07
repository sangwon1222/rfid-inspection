<script setup lang="ts" scoped>
import tSetConnect from '@template/inspector/tSetConnect.vue'
import tSetScan from '@template/inspector/tSetScan.vue'

import { store } from '@store/store'
import { computed } from 'vue'

defineProps({ isRemote: { type: Boolean, default: false } })
const isActive = computed(() => store.idro.connect)
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <p :class="store.inspector.connect ? 'opacity-0' : 'opacity-1'" class="text-red-400 p-2">
      검수기가 연결되어 있지 않습니다.
    </p>
    <t-set-connect v-show="!isRemote" class="absolute top-0 right-0 z-10" />

    <div class="flex flex-wrap items-center gap-4">
      <div v-if="!isActive" class="absolute top-0 left-0 w-full h-full opacity-50 bg-red-400" />
      <t-set-scan />
    </div>
  </div>
</template>
