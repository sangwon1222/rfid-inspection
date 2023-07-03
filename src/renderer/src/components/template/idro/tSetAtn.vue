<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import { saveSetting } from '@util/common'
import tcpManager from '@util/tcpManager'
import aButton from '@atoms/aButton.vue'
import { store } from '@store/store'

const setAntenna = async (antennaIndex: number) => {
  store.loading.isLoading = true
  const atn = `atn${antennaIndex}`
  store.idro.atnInfo[atn] = store.idro.atnInfo[atn] ? 0 : 1
  await tcpManager.antenna()
  saveSetting()
  store.loading.init()
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col w-full h-40">
      <label> ANTENNA STATUS</label>
    </div>
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
