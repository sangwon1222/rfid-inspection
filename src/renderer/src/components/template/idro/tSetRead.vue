<script setup lang="ts" scoped>
import tSetWrap from '@template/idro/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'

const read = async () => {
  store.idro.reading = true
  const { ok, msg } = await TCPmanager.onMemoryRead()
  store.idro.reading = false
}

const onInputByteLength = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  if (+target.value <= 12) {
    store.idro.byteLength = +target.value
  } else {
    target.value = ''
    store.idro.byteLength = 0
  }
}

const setByteLength = () => {
  if (store.idro.writeText.length > store.idro.byteLength) {
    store.idro.writeText = store.idro.writeText.substring(0, store.idro.byteLength)
  }
}
</script>

<template>
  <t-set-wrap>
    <div class="flex gap-4">
      <label>READ</label>
      <input
        :value="store.idro.byteLength"
        type="number"
        class="w-30 border bg-transparent rounded"
        @input="onInputByteLength"
        @keydown.enter.self="(e) => (e.currentTarget as HTMLInputElement).blur()"
        @click="(e) => (e.currentTarget as HTMLInputElement).select()"
        @blur="setByteLength"
      />
    </div>
    <a-button
      :add-style="store.idro.reading ? 'bg-teal-200' : 'bg-gray-200'"
      @on-parent-event="read"
      >READ
    </a-button>
  </t-set-wrap>
</template>
