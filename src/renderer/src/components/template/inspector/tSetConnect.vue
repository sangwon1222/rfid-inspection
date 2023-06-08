<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import serialManager from '@util/serialManager'
import { reactive, computed } from 'vue'
import { store } from '@store/store'

const state = reactive({ isFold: false })
const statusColor = computed(() => {
  switch (store.inspector.connect) {
    case true:
      return 'bg-teal-300 text-gray-600'
    case false:
      return 'bg-red-400 text-white'
    default:
      return 'bg-gray-600 text-white'
  }
})

const setConnect = async () => {
  await serialManager.connectSerialPort()
}

const changePath = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.inspector.default.path = target.value
  await serialManager.connectSerialPort()
}

const changeBaud = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.inspector.default.baudRate = +target.value
  await serialManager.connectSerialPort()
}

const fold = () => (state.isFold = !state.isFold)
</script>

<template>
  <div
    class="overflow-hidden flex flex-col items-center px-1 pb-1 gap-3 border bg-gray-300 duration-100"
    :class="state.isFold ? 'h-40' : 'h-200'"
  >
    <div class="grid grid-cols-1">
      <button class="p-2 w-full border text-center font-bold" :class="statusColor" @click="fold">
        INSPECTOR STATUS
      </button>
      <label class="text-2xs text-black">
        {{ store.inspector.connectMsg }}
      </label>
    </div>

    <button
      class="flex flex-col w-150 items-center border rounded p-2"
      :class="statusColor"
      @click="setConnect"
    >
      TRY CONNECT
    </button>

    <a-label-input label="COM:" :value="store.inspector.default.path" @on-change="changePath" />
    <a-label-input
      label="Baud:"
      :value="`${store.inspector.default.baudRate}`"
      @on-change="changeBaud"
    />
  </div>
</template>
