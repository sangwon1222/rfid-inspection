<script setup lang="ts" scoped>
import tSetWrap from '@template/tcp/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'

defineProps({ isActive: { type: Boolean, default: false } })

const buzzer = async (buzzer: boolean) => {
  const { ok, msg } = buzzer ? await TCPmanager.onBuzzer() : await TCPmanager.offBuzzer()
  console.log(ok, msg)
  store.print.buzzer = buzzer
}
</script>

<template>
  <t-set-wrap>
    <div v-if="!isActive" class="absolute top-0 left-0 w-full h-full opacity-50 bg-red-400" />
    <label>BUZZER</label>
    <div class="flex flex-wrap gap-2 mt-4">
      <a-button
        v-for="(v, i) in [true, false]"
        :key="i"
        :add-style="store.print.buzzer === v ? 'bg-teal-200' : 'bg-gray-200'"
        @on-parent-event="buzzer(v)"
      >
        {{ v ? 'ON' : 'OFF' }}
      </a-button>
    </div>
  </t-set-wrap>
</template>
