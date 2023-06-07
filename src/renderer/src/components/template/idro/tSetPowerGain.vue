<script setup lang="ts" scoped>
import { map } from 'lodash'
import { reactive } from 'vue'
import { store } from '@store/store'
import TCPmanager from '@util/tcpManager'
import tSetWrap from '@template/tSetWrap.vue'

const state = reactive({ errorPowerGain: false })

/**
 * @param antennaIndex 1,2,3,4,0
 * @description 0일 경우, 모든 안테나 set power
 */
const setPowerGain = async (antennaIndex: number) => {
  const power = store.idro.powerGain[`atn${antennaIndex}`]

  try {
    if (antennaIndex === 0) {
      const keys = Object.keys(store.idro.powerGain)
      map(keys, (key) => (store.idro.powerGain[key] = power))
    } else {
      store.idro.powerGain[`atn${antennaIndex}`] = power
    }
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
    target.value = store.idro.powerGain[`atn${atnIndex}`]
  } else {
    store.idro.powerGain[`atn${atnIndex}`] = inputvalue
    setPowerGain(atnIndex)
  }
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col">
      <label> ANTENNA POWER GAIN</label>
      <label class="text-xs"> min:50 max: 310</label>
    </div>
    <div class="flex flex-col flex-wrap gap-2">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(v, i) in [1, 2, 3, 4, 0]"
          :key="i"
          :tabindex="i"
          class="flex flex-col w-50 items-center border rounded p-2"
          :class="store.idro.atnInfo[`atn${v}`] ? 'bg-teal-300' : 'bg-gray-200'"
        >
          {{ v === 0 ? 'ALL' : `Atn${v}` }}
          <input
            :value="store.idro.powerGain[`atn${v}`]"
            type="number"
            class="w-full"
            @click="(e) => (e.currentTarget as HTMLInputElement).select()"
            @blur="onBlur($event, v)"
            @keydown.enter="(e) => (e.currentTarget as HTMLInputElement).blur()"
          />
        </button>
      </div>
      <div v-if="state.errorPowerGain" class="text-gray-100 text-xs">
        power gain range
        <label class="text-red-400"> [ 50 ~ 310 ] </label>
        <label class="text-2xs">( 5dBm ~ 31dBm )</label>
      </div>
    </div>
  </t-set-wrap>
</template>
