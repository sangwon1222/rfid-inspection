<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import { saveSetting } from '@util/common'

let isBusy = false
const buzzer = async (buzzer: boolean) => {
  if (isBusy) return
  isBusy = true

  setTimeout(() => {
    isBusy = false
  }, 3000)

  const { ok } = buzzer ? await TCPmanager.onBuzzer() : await TCPmanager.offBuzzer()
  if (ok) {
    store.idro.onBuzzer = buzzer
    saveSetting()
  }

  isBusy = false
}
</script>

<template>
  <t-set-wrap>
    <div class="flex w-full h-40">
      <label>BUZZER</label>
      <p v-if="isBusy">시도 중...</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <a-button
        v-for="(v, i) in [true, false]"
        :key="i"
        :add-style="store.idro.onBuzzer === v ? 'bg-teal-200' : 'bg-gray-200'"
        @on-parent-event="buzzer(v)"
      >
        {{ v ? 'ON' : 'OFF' }}
      </a-button>
    </div>
  </t-set-wrap>
</template>
