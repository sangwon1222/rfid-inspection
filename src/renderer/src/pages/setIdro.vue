<script setup lang="ts" scoped>
import tSetPowerGain from '@template/idro/tSetPowerGain.vue'
import tSetConnect from '@template/idro/tSetConnect.vue'
import tSetBuzzer from '@template/idro/tSetBuzzer.vue'
import tSetWrite from '@template/idro/tSetWrite.vue'
import tSetRead from '@template/idro/tSetRead.vue'
import tSetAtn from '@template/idro/tSetAtn.vue'
import { store } from '@store/store'

defineProps({ isRemote: { type: Boolean, default: false } })
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <p :class="store.idro.connect ? 'opacity-0' : 'opacity-1'" class="text-white z-15 p-2">
      IDRO가 연결되어 있지 않습니다.
    </p>
    <t-set-connect v-show="!isRemote" class="absolute top-0 right-0 z-15" />

    <div class="flex flex-wrap items-center gap-4">
      <div
        v-if="!store.idro.connect"
        class="absolute top-0 left-0 w-full h-full opacity-50 bg-red-400 z-10"
      />
      <t-set-atn />
      <t-set-power-gain />
      <t-set-buzzer />
      <t-set-read />
      <t-set-write />
    </div>
  </div>
</template>
