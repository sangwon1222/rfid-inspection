<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import serialManager from '@util/serialManager'
import { store } from '@store/store'

let isFold = false
const setConnect = async () => {
  if (store.inspector.connect) return
  await serialManager.connectSerialPort()
}

const changeCom = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.inspector.default.path = target.value
}

const changeBaud = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  store.inspector.default.baudRate = +target.value
}

const fold = (e) => {
  const target = e.currentTarget.parentElement as HTMLDivElement
  isFold = !isFold
  if (isFold) {
    target.classList.remove('h-160')
    target.classList.add('h-40')
  } else {
    target.classList.add('h-160')
    target.classList.remove('h-40')
  }
}
</script>

<template>
  <div
    class="overflow-hidden flex flex-col items-center px-1 gap-2 h-160 duration-100 border bg-gray-300"
  >
    <button
      class="absolute top-0 p-2 w-full border text-center font-bold"
      :class="store.idro.connect ? 'text-teal-600' : 'text-red-400'"
      @click="fold"
    >
      INSPECTOR STATUS
    </button>

    <button
      class="flex flex-col w-150 items-center border rounded p-2 mt-50"
      :class="store.idro.connect ? 'bg-teal-300 text-gray-600' : 'bg-red-400 text-white'"
      @click="setConnect"
    >
      {{ store.idro.connectMsg }}
    </button>

    <a-label-input label="COM:" :value="store.inspector.default.path" @on-change="changeCom" />
    <a-label-input
      label="Baud:"
      :value="`${store.inspector.default.baudRate}`"
      @on-change="changeBaud"
    />
  </div>
</template>
