<script setup scoped lang="ts">
import { store } from '@store/store'
import { reactive } from 'vue'

const state = reactive({
  power: 50
})

const changeValue = () => {
  if (state.power >= 310) {
    state.power = 50
  } else {
    state.power = state.power === 300 ? (state.power = 310) : (state.power = state.power + 50)
  }
  store.print.powerGain = state.power
}
</script>

<template>
  <button @click="changeValue">
    {{ state.power }}
  </button>
</template>
