<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { reactive } from 'vue'

const state = reactive({ pcInfo: '' })
const read = async () => {
  state.pcInfo = '시도 중...'
  const { ok, msg } = await TCPmanager.onEPCReadPC()
  state.pcInfo = ok ? msg : 'error'
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1 w-full h-40">
      <div class="flex flex-wrap gap-20">
        <label>READ EPC(PC번지)</label>
      </div>
      <div class="flex gap-1 items-center">
        <p class="text-2xs">PC번지:</p>
        <p class="text-white">[ {{ state.pcInfo }} ]</p>
      </div>
    </div>

    <a-button @on-parent-event="read">READ EPC(PC 번지) </a-button>
  </t-set-wrap>
</template>
