<script setup lang="ts" scoped>
import { reactive } from 'vue'

const emit = defineEmits(['onParentEvent'])

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})

const state = reactive({
  isAvtive: true
})
const onEvent = (e: PointerEvent) => {
  e.preventDefault()
  if (state.isAvtive) emit('onParentEvent')
  state.isAvtive = false
}
</script>

<template>
  <button class="btn-wrap" @click="onEvent">
    {{ props.label }}
  </button>
</template>

<style lang="less" scoped>
.btn-wrap {
  padding: 20px;
  border: 2px rgba(0, 0, 0, 0.3) solid;
  background-color: beige;
}
</style>
