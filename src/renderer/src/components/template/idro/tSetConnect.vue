<script setup lang="ts" scoped>
import aLabelInput from '@atoms/aLabelInput.vue'
import TCPmanager from '@util/tcpManager'
import { store } from '@store/store'
import { reactive, computed } from 'vue'
import { saveSetting } from '@util/common'
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

const disconnect = async () => {
  await TCPmanager.disconnect()
}

const changeHost = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  saveSetting()
}

const changePort = async (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement
  saveSetting()
}
const fold = () => (state.isFold = !state.isFold)

const hoverNotFixPc = (e) => {
  const target = e.currentTarget.lastChild as HTMLParagraphElement
  target.classList.remove('opacity-0')
  target.classList.add('opacity-1')
}
const leaveNotFixPc = (e) => {
  const target = e.currentTarget.lastChild as HTMLParagraphElement
  target.classList.remove('opacity-1')
  target.classList.add('opacity-0')
}
</script>

<template>
  <div
    class="overflow-hidden flex flex-col items-center gap-3 w-180 border bg-gray-300 duration-100"
    :class="state.isFold ? 'h-40' : 'h-380'"
  >
    <button
      class="grid grid-cols-1p-2 w-full border text-center font-bold"
      :class="statusColor"
      @click="fold"
    >
      IDRO STATUS
      <label class="text-2xs text-black">
        {{ store.idro.connectMsg }}
      </label>
    </button>

    <button
      class="flex flex-col w-150 items-center border rounded p-2 bg-teal-400 text-black"
      @click="setConnect"
    >
      IDRO 연결
    </button>
    <button
      class="flex flex-col w-150 items-center border rounded p-2 bg-red-400 text-white"
      @click="disconnect"
    >
      연결 끊기
    </button>

    <a-label-input label="host:" :value="store.idro.default.host" @on-change="changeHost" />
    <a-label-input label="port:" :value="`${store.idro.default.port}`" @on-change="changePort" />

    <div class="grid grid-cols-2 border">
      <button
        class="border p-4"
        :class="store.idro.fixPc ? 'bg-teal-300' : ''"
        @click="store.idro.fixPc = true"
      >
        PC 고정
      </button>
      <button
        class="border relative"
        :class="store.idro.fixPc ? '' : 'bg-teal-300'"
        @click="store.idro.fixPc = false"
        @mouseenter="hoverNotFixPc"
        @mouseleave="leaveNotFixPc"
      >
        PC 변동
        <p
          class="flex items-center justify-center absolute top-full left-[-80px] w-160 h-60 bg-white opacity-0"
        >
          write data 길이에 <br />따라 자동으로 EPC PC값 변경
        </p>
      </button>
    </div>
  </div>
</template>
