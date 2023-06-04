<script setup lang="ts" scoped>
import tSetPowerGain from '@template/tcp/tSetPowerGain.vue'
import tSetConnect from '@template/tcp/tSetConnect.vue'
import tSetAtn from '@template/tcp/tSetAtn.vue'
import tSetBuzzer from '@template/tcp/tSetBuzzer.vue'
import { store } from '@store/store'
import { computed } from 'vue'

defineProps({ isRemote: { type: Boolean, default: false } })
const isActive = computed(() => store.print.connect)
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <p v-show="!store.print.connect" class="text-red-400 p-2">IDRO가 연결되어 있지 않습니다.</p>
    <t-set-connect v-if="!isRemote" class="absolute top-0 right-0 z-10" />

    <div class="flex flex-wrap items-center gap-4">
      <t-set-atn :is-active="isActive" />
      <t-set-power-gain :is-active="isActive" />
      <t-set-buzzer :is-active="isActive" />
    </div>
  </div>
</template>
