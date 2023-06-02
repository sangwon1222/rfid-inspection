<script setup lang="ts" scoped>
import { store } from '@store/store'
import TCPmanager from '@util/tcpManager'

const setAntenna = async (antennaIndex: number) => {
  const atnName = `atn${antennaIndex}`
  store.print.atnInfo[atnName] = store.print.atnInfo[atnName] ? 0 : 1
  await TCPmanager.antenna()
}
</script>

<template>
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
</template>
