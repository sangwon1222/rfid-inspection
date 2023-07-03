<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import { reactive } from 'vue'
import { hex2a } from '@renderer/util/common'

const state = reactive({ error: '', info: '' })

const read = async () => {
  state.error = ''
  state.info = ''

  store.idro.reading = true
  const { ok, msg } = await TCPmanager.onMemoryRead()
  state.error = ok ? '' : msg
  state.info = msg
  store.idro.reading = false
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1 w-full">
      <div class="flex flex-wrap gap-20">
        <label>READ</label>
        <div class="flex gap-1 items-center text-white">
          <p class="rounded text-xs">{{ store.idro.byteLength }} byte /</p>
        </div>
      </div>

      <label v-if="state.error" class="text-2xs">
        <p class="text-red-400 text-xs">{{ state.error }}</p>
      </label>
      <label v-if="state.info" class="text-2xs">
        <p class="text-teal-400 text-xs">{{ state.info }}</p>
        <div class="flex">
          hex=>
          <p class="text-teal-400 text-xs">{{ hex2a(state.info) }}</p>
        </div>
      </label>
    </div>

    <a-button
      :add-style="store.idro.reading ? 'bg-teal-200' : 'bg-gray-200'"
      @on-parent-event="read"
    >
      READ
    </a-button>
  </t-set-wrap>
</template>
