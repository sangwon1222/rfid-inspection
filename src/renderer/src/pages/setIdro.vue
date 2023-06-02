<script setup lang="ts" scoped>
import tSetPowerGain from '@template/tcp/tSetPowerGain.vue'
import tSetConnect from '@template/tcp/tSetConnect.vue'
import tSetAtn from '@template/tcp/tSetAtn.vue'
</script>

<template>
  <div class="relative flex flex-col gap-1 h-full">
    <t-set-connect class="absolute top-0 right-0" />
    <t-set-atn />
    <t-set-power-gain />
  </div>
</template>
