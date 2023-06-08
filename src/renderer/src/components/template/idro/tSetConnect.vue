<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'
import { reactive, computed } from 'vue'

const state = reactive({ isFold: false })
const statusColor = computed(() => {
  switch (store.idro.connect) {
    case true:
      return 'bg-teal-300 text-gray-600'
    case false:
      return 'bg-red-400 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
})
const setConnect = async () => {
  if (store.idro.connect) return
  await TCPmanager.connectPrint()
}

const changeHost = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.idro.changedInfo.host = target.value
  await TCPmanager.connectPrint()
}

const changePort = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.idro.changedInfo.port = +target.value
  await TCPmanager.connectPrint()
}
const fold = () => (state.isFold = !state.isFold)
</script>

<template>
  <div
    class="overflow-hidden flex flex-col items-center gap-3 border bg-gray-300 duration-100 font-bold"
    :class="state.isFold ? 'h-40' : 'h-200'"
  >
    <div class="grid grid-cols-1">
      <a-button
        :custom-style="`py-2 w-full border ${statusColor}`"
        label="IDRO STATUS"
        @pointerdown="fold"
      >
      </a-button>
      <label class="text-2xs text-black">
        {{ store.idro.connectMsg }}
      </label>
      <button
        class="flex flex-col w-150 items-center border rounded p-2"
        :class="statusColor"
        @click="setConnect"
      >
        TRY CONNECT
      </button>
    </div>

    <a-label-input label="host:" :value="store.idro.default.host" @on-change="changeHost" />
    <a-label-input label="port:" :value="`${store.idro.default.port}`" @on-change="changePort" />
  </div>
</template>
