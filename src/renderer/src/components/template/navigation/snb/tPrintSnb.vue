<script setup lang="ts" scoped>
import { onMounted, reactive } from 'vue'
import { store } from '../../../../store/store'
import PrintIpcRenderer from '../../../../util/printIpcRenderer'

const state = reactive({
  isError: false
})

onMounted(async () => {
  await PrintIpcRenderer.connectPrint()
})

const setAntenna = async (antennaIndex: number) => {
  const atnName = `atn${antennaIndex}`
  store.print.atnInfo[atnName] = store.print.atnInfo[atnName] ? 0 : 1
  await PrintIpcRenderer.antenna()

  setPowerGain(antennaIndex)
}

const setPowerGain = async (antennaIndex: number) => {
  const power = store.print.powerGain[`atn${antennaIndex}`]
  if (antennaIndex === 5) {
    store.print.powerGain = { atn1: power, atn2: power, atn3: power, atn4: power, atn5: power }
  }
  store.print.powerGain[`atn${antennaIndex}`] = power
  await PrintIpcRenderer.onPowerGain(antennaIndex)
  state.isError = false
}

const onPower = (e, antennaIndex: number) => {
  const target = e.currentTarget as HTMLInputElement
  if (+target.value < 50 || +target.value > 310) {
    // alert('power gain range [ 50 ~ 310 ] ( 5dBm ~ 31dBm ) ')
    state.isError = true
    const popup = document.getElementById('popup') as HTMLDivElement
    popup
    target.value = store.print.powerGain[`atn${antennaIndex}`]
    return false
  }
  store.print.powerGain[`atn${antennaIndex}`] = +target.value
  setPowerGain(antennaIndex)
}
</script>

<template>
  <div class="flex flex-col gap-1 h-full">
    {{ store.print.connectMsg }}
    <!-- ANTENNA -->
    <div class="flex flex-col p-1 border">
      <label> ANTENNA STATUS</label>
      <div class="flex gap-2 flex-wrap">
        <button
          v-for="(v, i) in [1, 2, 3, 4]"
          :key="i"
          class="flex flex-col w-50 items-center border rounded p-2"
          :class="store.print.atnInfo[`atn${v}`] ? 'bg-teal-300' : 'bg-gray-200'"
          @click="setAntenna(v)"
        >
          Atn{{ v }}
        </button>
      </div>
    </div>

    <!-- POWER GAIN -->
    <div class="flex flex-col p-1 border">
      <label> ANTENNA POWER GAIN</label>
      <label class="text-xs"> min:50 max: 310</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="(v, i) in [1, 2, 3, 4, 5]"
          :key="i"
          :tabindex="i"
          class="flex flex-col w-50 items-center border rounded p-2"
          :class="store.print.atnInfo[`atn${v}`] ? 'bg-teal-300' : 'bg-gray-200'"
        >
          {{ v <= 4 ? `Atn${v}` : 'ALL' }}
          <input
            :id="`power${v}`"
            :value="store.print.powerGain[`atn${v}`]"
            type="number"
            class="w-full"
            @click="
              (e) => {
                (e.currentTarget as HTMLInputElement).select()
              }
            "
            @blur="onPower($event, v)"
            @keydown.enter="(e) => (e.currentTarget as HTMLInputElement).blur()"
          />
        </button>
        <div v-if="state.isError" class="text-gray-100 text-xs">
          power gain range <label class="text-red-400"> [ 50 ~ 310 ] </label>
          <label class="text-2xs">( 5dBm ~ 31dBm )</label>
        </div>
      </div>
    </div>

    <!--  -->
  </div>
</template>
