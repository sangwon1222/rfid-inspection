<script setup lang="ts" scoped>
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['dropIn'])
const dragBoxRef = ref(null)

const ableStyle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragBoxRef.value.style.borderColor = '#57608C'
  dragBoxRef.value.style.color = '#57608C'
  dragBoxRef.value.style.fontSize = '1.2rem'
}

const defaultStyle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragBoxRef.value.style.borderColor = '#73778C'
  dragBoxRef.value.style.color = '#73778C'
  dragBoxRef.value.style.fontSize = '1rem'
}

const onDropIn = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('dropIn', e)
}
</script>

<template>
  <div
    ref="dragBoxRef"
    class="flex flex-wrap justify-center items-center w-full h-full z-10"
    @dragenter.prevent="ableStyle"
    @dragleave.prevent="defaultStyle"
    @dragend.prevent="defaultStyle"
    @drop.prevent="onDropIn($event)"
    @dragover.prevent
  >
    <label class="absolute">{{ props.label }}</label>

    <slot />
  </div>
</template>
