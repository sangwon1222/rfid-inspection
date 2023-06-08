<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import { reactive, ref } from 'vue'

const state = reactive({ error: '' })
const refWrite = ref(null)

const write = async () => {
  if (!store.idro.writeText) {
    refWrite.value.select()
    return
  }
  store.idro.writing = true
  store.idro.byteLength = store.idro.writeText.length
  const { ok, msg } = await TCPmanager.onMemoryWrite()
  if (!ok) state.error = msg
  store.idro.writing = false
}

const onInputWriteData = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  // if (target.value.length % 2) return
  store.idro.writeText = target.value
  state.error = ''
  if (store.idro.writeText.length > store.idro.byteLength)
    store.idro.byteLength = store.idro.writeText.length
}

const onInputByteLength = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  if (+target.value < 13) store.idro.byteLength = +target.value
  else target.value = ''
}

const setByteLength = () => {
  if (store.idro.writeText.length > store.idro.byteLength) {
    store.idro.writeText = store.idro.writeText.substring(0, store.idro.byteLength)
  }
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1">
      <div class="flex gap-4">
        <label>WRITE</label>
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
      <label class="text-red-400 text-2xs" :class="state.error ? 'opacity-1' : 'opacity-0'"
        >WRITE ERROR: {{ state.error }}</label
      >
    </div>
    <div class="flex flex-col flex-wrap gap-4">
      <a-button
        :add-style="store.idro.writing ? 'bg-teal-200' : 'bg-gray-200'"
        @on-parent-event="write"
        >WRITE
      </a-button>
      <input
        ref="refWrite"
        type="text"
        class="rounded"
        maxlength="12"
        :value="store.idro.writeText"
        @click="(e) => (e.currentTarget as HTMLInputElement).select()"
        @keydown.enter="write"
        @input="onInputWriteData"
      />
    </div>
  </t-set-wrap>
</template>
