<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { onMounted, reactive } from 'vue'
import { store } from '@renderer/store/store'
import { filter, findIndex } from 'lodash-es'

const state = reactive({ error: '', byte: '0' })
const write = async () => {
  state.error = '시도 중...'
  const { ok, msg } = await TCPmanager.onEPCWritePC(+state.byte)
  console.log(ok, msg)
  state.error = msg
}

const select = (e: Event) => {
  const target = e.target as HTMLSelectElement
  state.byte = target.options[target.options.selectedIndex].value
}

onMounted(() => {
  const target = document.getElementById('byteList') as HTMLSelectElement
  const selected = filter(target.options, (e) => {
    return +e.value === store.idro.byteLength
  })
  state.byte = target.options[selected[0].index].value
  target.options[selected[0].index].selected = true
})
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1 w-full h-40">
      <div class="flex flex-wrap gap-20">
        <label>WRITE EPC(PC번지)</label>
        <p class="text-2xs text-red-400">{{ state.error }}:</p>
      </div>
      <div class="flex gap-1 items-center">
        <p class="text-2xs">PC번지:</p>
      </div>
      <select id="byteList" class="text-bold" @change="select">
        <!-- src/main/util/tcpPrinter.ts => onEPCWritePC함수 안에 목록 동기화 필요 -->
        <option v-for="(v, i) in store.idro.epcPcList" :key="i" :value="v.value">
          {{ v.label }}
        </option>
      </select>
    </div>

    <a-button @on-parent-event="write">SET EPC(PC 번지) </a-button>
  </t-set-wrap>
</template>
