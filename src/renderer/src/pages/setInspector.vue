<script setup lang="ts" scoped>
import tSetConnect from '@template/inspector/tSetConnect.vue'
import tSetScan from '@template/inspector/tSetScan.vue'
import { store } from '@store/store'

defineProps({ isRemote: { type: Boolean, default: false } })
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <p :class="store.inspector.connect ? 'opacity-0' : 'opacity-1'" class="text-white p-2 z-15">
      검수기가 연결되어 있지 않습니다.
    </p>
    <t-set-connect v-show="!isRemote" class="absolute top-0 right-0 z-15" />

    <div class="flex flex-wrap items-center gap-4">
      <div
        v-if="!store.inspector.connect"
        class="absolute top-0 left-0 w-full h-full opacity-50 bg-red-400 z-10"
      />
      <t-set-scan />
    </div>
  </div>
</template>
