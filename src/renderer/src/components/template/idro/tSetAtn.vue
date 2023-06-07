<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import TCPmanager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'

const setAntenna = async (antennaIndex: number) => {
  const atnName = `atn${antennaIndex}`
  store.idro.atnInfo[atnName] = store.idro.atnInfo[atnName] ? 0 : 1
  const { ok } = await TCPmanager.antenna()
  if (!ok) store.idro.atnInfo[atnName] = !store.idro.atnInfo[atnName]
}
</script>

<template>
  <t-set-wrap>
    <label> ANTENNA STATUS</label>
    <div class="flex flex-wrap gap-2">
      <a-button
        v-for="(v, i) in [1, 2, 3, 4]"
        :key="i"
        :class="store.idro.atnInfo[`atn${v}`] ? 'bg-teal-300' : 'bg-gray-200'"
        @on-parent-event="setAntenna(v)"
      >
        Atn{{ v }}
      </a-button>
    </div>
  </t-set-wrap>
</template>
