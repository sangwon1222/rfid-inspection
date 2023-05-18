<script setup lang="ts" scoped>
import { reactive, computed } from 'vue'

const emit = defineEmits(['onParentEvent'])

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  customStyle: {
    type: String,
    default: ''
  },
  addStyle: {
    type: String,
    default: ''
  }
})
const defaultStyle = 'border border-gray-400 p-4 rounded-xl '

const state = reactive({
  style: computed(() => (props.customStyle ? props.customStyle : defaultStyle))
})

const onEvent = (e: MouseEvent | TouchEvent) => {
  e.preventDefault()
  emit('onParentEvent')
}
</script>

<template>
  <button :class="`${state.style} ${props.addStyle}`" @click="onEvent" @touchstart="onEvent">
    {{ props.label }}
    <slot />
  </button>
</template>
