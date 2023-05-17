<script setup lang="ts" scoped>
import { ref, reactive } from 'vue'
import CustomIpcRenderer from '@util/ipcRenderer'
import { onMounted } from 'vue'
import aAtnInput from '@atoms/aAtnInput.vue'

const controllerRef = ref(null)
const state = reactive({
  isFold: false,
  height: 0
})

onMounted(async () => {
  const wrapDiv = controllerRef.value as HTMLDivElement
  state.height = +wrapDiv.offsetHeight

  await CustomIpcRenderer.connectPrint()

  const ptototype = Object.getOwnPropertyNames(Object.getPrototypeOf(CustomIpcRenderer))
  console.log(ptototype)

  console.log(ptototype)
  console.log(ptototype.length)
  for (let i = 1; i < ptototype.length; i++) {
    console.log(ptototype[i])
  }
})

const fold = () => {
  const wrapDiv = controllerRef.value as HTMLDivElement
  if (state.isFold) {
    wrapDiv.style.height = `${state.height}px`
  } else {
    wrapDiv.style.height = `40px`
  }
  state.isFold = !state.isFold

  const ptototype = Object.getOwnPropertyNames(CustomIpcRenderer)
  console.log(ptototype)
  console.log(ptototype.length)
  for (let i = 0; i < ptototype.length; i++) {
    console.log(ptototype[i])
  }
}
</script>

<template>
  <div ref="controllerRef" class="overflow-hidden transition-all rounded-xl">
    <button
      class="w-full h-40 mb-2 bg-cyan-500 hover:bg-cyan-600 text-red-50"
      value="fold"
      @click="fold"
    >
      {{ state.isFold ? 'Spread' : 'Fold' }}
    </button>

    <div class="col-grid gap-1">
      <button class="w-full bg-amber-50 hover:bg-amber-100" @click="CustomIpcRenderer.connectPrint">
        CONNECT PRINT
      </button>
      <button class="w-full" @click="CustomIpcRenderer.onBuzzer">ON BUZZER</button>
      <button class="w-full" @click="CustomIpcRenderer.offBuzzer">OFF BUZZER</button>
      <button class="w-full" @click="CustomIpcRenderer.stop">STOP</button>

      <div class="flex flex-col gap-2 text-center border rounded-xl p-2 w-full">
        <label class="font-extrabold"> ANTENNA </label>
        <a-atn-input @antenna="CustomIpcRenderer.antenna" />
        <button form="antenna-form" type="submit" class="cursor-pointer">set</button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped></style>
