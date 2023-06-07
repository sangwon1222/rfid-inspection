<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import TCPmanager from '@util/tcpManager'
import { store } from '@store/store'

let isFold = false
const setConnect = async () => {
  await TCPmanager.connectPrint()
}

const changeHost = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  console.log(target.value)
  store.idro.changedInfo.host = target.value
}

const changePort = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  console.log(target.value)
  store.idro.changedInfo.port = +target.value
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
      class="absolute top-0 p-2 w-full border text-center"
      :class="store.idro.connect ? 'text-teal-300' : 'text-red-400'"
      @click="fold"
    >
      CONNECT STATUS
    </button>

    <button
      class="flex flex-col w-150 items-center border rounded p-2 mt-50"
      :class="store.idro.connect ? 'bg-teal-300 text-gray-600' : 'bg-red-400 text-white'"
      @click="setConnect()"
    >
      {{ store.idro.connectMsg }}
    </button>

    <a-label-input label="host:" :value="store.idro.default.host" @on-change="changeHost" />
    <a-label-input label="port:" :value="`${store.idro.default.port}`" @on-change="changePort" />
  </div>
</template>
