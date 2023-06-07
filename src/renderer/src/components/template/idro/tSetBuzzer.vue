<script setup lang="ts" scoped>
import tSetWrap from '@template/idro/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'

const buzzer = async (buzzer: boolean) => {
  const { ok } = buzzer ? await TCPmanager.onBuzzer() : await TCPmanager.offBuzzer()
  if (ok) store.idro.onBuzzer = buzzer
}
</script>

<template>
  <t-set-wrap>
    <label>BUZZER</label>
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
