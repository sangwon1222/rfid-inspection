<script setup lang="ts" scoped>
import { ascii_to_hex, hex2a } from '@util/common'
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import { reactive, ref } from 'vue'
import { isNaN } from 'lodash-es'

const state = reactive({ error: '', info: '', asciiInput: '' })
const refWrite = ref(null)

const write = async () => {
  state.error = ''
  state.info = ''

  if (!store.idro.writeText) {
    refWrite.value.select()
    return
  }

  store.idro.writing = true
  const { ok, msg } = await TCPmanager.onMemoryWrite()
  state.error = ok ? '' : msg
  state.info = ok ? msg : ''
  store.idro.writing = false
}

const onInputWriteData = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  state.info = ''

  if (isNaN(+e.data)) {
    target.value = target.value.slice(0, store.idro.byteLength)
    state.error = `숫자만 입력해주세요.`
    return
  }

  const isOverByte = store.idro.byteLength * 2 < target.value.length
  const errorTxt = isOverByte
    ? `${store.idro.byteLength}byte를 초과했습니다. [현재 ${target.value.length * 2} byte]`
    : ''

  state.error = errorTxt
  store.idro.writeText = target.value

  state.asciiInput = hex2a(target.value)
}

const onInputAscii = (e) => {
  const target = e.currentTarget as HTMLInputElement
  store.idro.writeText = ascii_to_hex(target.value)
  state.asciiInput = target.value
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1 w-full">
      <div class="flex gap-20">
        <label>WRITE</label>
        <div class="flex gap-1 items-center text-white">
          <p class="rounded text-xs">{{ store.idro.byteLength }} byte /</p>
        </div>
      </div>
      <label v-if="state.error" class="text-2xs">
        <p class="text-red-400 text-xs">{{ state.error }}</p>
      </label>
      <label v-if="state.info" class="text-2xs">
        <p class="text-teal-400 text-xs">{{ state.info }}</p>
      </label>
    </div>

    <div class="flex flex-col flex-wrap">
      <a-button
        :add-style="store.idro.writing ? 'bg-teal-200' : 'bg-gray-200'"
        @on-parent-event="write"
        >WRITE
      </a-button>

      <div class="flex flex-col">
        <label> HEX</label>
        <input
          ref="refWrite"
          type="text"
          class="rounded"
          :value="store.idro.writeText"
          @click="(e) => (e.currentTarget as HTMLInputElement).select()"
          @keydown.enter="write"
          @input="onInputWriteData"
        />
      </div>

      <div class="flex flex-col">
        <label>ASCII</label>
        <input
          ref="refWriteAscii"
          type="text"
          class="rounded"
          :value="state.asciiInput"
          @click="(e) => (e.currentTarget as HTMLInputElement).select()"
          @keydown.enter="write"
          @input="onInputAscii"
        />
      </div>
    </div>
  </t-set-wrap>
</template>
