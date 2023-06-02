<script setup lang="ts" scoped>
import { map } from 'lodash'
import { reactive } from 'vue'
import { store } from '@store/store'
import TCPmanager from '@util/tcpManager'

const state = reactive({
  errorPowerGain: false
})

const setPowerGain = async (antennaIndex: number) => {
  const power = store.print.powerGain[`atn${antennaIndex}`]

  if (antennaIndex === 0) {
    const keys = Object.keys(store.print.powerGain)
    map(keys, (key) => (store.print.powerGain[key] = power))
  } else {
    store.print.powerGain[`atn${antennaIndex}`] = power
  }

  try {
    await TCPmanager.onPowerGain(antennaIndex)
  } catch (e) {
    console.log(e)
  }
  state.errorPowerGain = false
}

const onBlur = (e, atnIndex: number) => {
  const target = e.currentTarget as HTMLInputElement
  const inputvalue = +target.value
  const valid = inputvalue < 50 || inputvalue > 310

  if (valid) {
    state.errorPowerGain = true
    target.value = store.print.powerGain[`atn${atnIndex}`]
  } else {
    store.print.powerGain[`atn${atnIndex}`] = inputvalue
    setPowerGain(atnIndex)
  }
}
</script>

<template>
  <!-- POWER GAIN -->
  <div class="flex flex-col p-1 border">
    <label> ANTENNA POWER GAIN</label>
    <label class="text-xs"> min:50 max: 310</label>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="(v, i) in [1, 2, 3, 4, 0]"
        :key="i"
        :tabindex="i"
        class="flex flex-col w-50 items-center border rounded p-2"
        :class="store.print.atnInfo[`atn${v}`] ? 'bg-teal-300' : 'bg-gray-200'"
      >
        {{ v === 0 ? 'ALL' : `Atn${v}` }}
        <input
          :value="store.print.powerGain[`atn${v}`]"
          type="number"
          class="w-full"
          @click="(e) => (e.currentTarget as HTMLInputElement).select()"
          @blur="onBlur($event, v)"
          @keydown.enter="(e) => (e.currentTarget as HTMLInputElement).blur()"
        />
      </button>
      <div v-if="state.errorPowerGain" class="text-gray-100 text-xs">
        power gain range
        <label class="text-red-400"> [ 50 ~ 310 ] </label>
        <label class="text-2xs">( 5dBm ~ 31dBm )</label>
      </div>
    </div>
  </div>
</template>
