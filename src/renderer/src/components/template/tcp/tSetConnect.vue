<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import { store } from '@store/store'
import TCPmanager from '@util/tcpManager'

const setConnect = async () => {
  await TCPmanager.connectPrint()
}

const changeHost = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  console.log(target.value)
}

const changePort = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  console.log(target.value)
}
</script>

<template>
  <div class="flex flex-col p-1 border bg-gray-300 items-center">
    <label :class="store.print.connect ? 'text-teal-300' : 'text-gray-200'"> CONNECT STATUS</label>
    <button
      class="flex flex-col w-150 items-center border rounded p-2"
      :class="store.print.connect ? 'bg-teal-300' : 'bg-gray-200'"
      @click="setConnect()"
    >
      {{ store.print.connectMsg }}
    </button>

    <a-label-input label="host:" :value="store.print.default.host" @on-change="changeHost" />
    <a-label-input label="port:" :value="`${store.print.default.port}`" @on-change="changePort" />
  </div>
</template>
