<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import serialManager from '@util/serialManager'

const scanStart = async () => {
  console.log('scanStart')
  const { ok, msg } = await serialManager.getStartScan()
  console.log('검수기에서 받은 커멘드: ', msg)
  if (!ok) return
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1">
      <div class="flex gap-4">
        <label>SCAN START</label>
      </div>
    </div>
    <a-button
      :add-style="store.idro.writing ? 'bg-teal-200' : 'bg-gray-200'"
      @on-parent-event="scanStart"
      >SCAN
    </a-button>
  </t-set-wrap>
</template>
