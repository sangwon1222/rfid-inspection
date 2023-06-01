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
  dragBoxRef.value.style.borderColor = '#57608C'
  dragBoxRef.value.style.color = '#57608C'
  dragBoxRef.value.style.fontSize = '1.2rem'
}

const defaultStyle = (e: DragEvent) => {
  dragBoxRef.value.style.borderColor = '#73778C'
  dragBoxRef.value.style.color = '#73778C'
  dragBoxRef.value.style.fontSize = '1rem'
}

const onDropIn = (e: DragEvent) => {
  emit('dropIn', e)
}
</script>

<template>
  <div
    ref="dragBoxRef"
    class="flex flex-wrap justify-center items-center w-full h-full z-10"
    @dragenter.prevent.stop="ableStyle"
    @dragleave.prevent.stop="defaultStyle"
    @dragend.prevent.stop="defaultStyle"
    @drop.prevent.stop="onDropIn($event)"
    @dragover.prevent.stop
  >
    <label class="absolute">{{ props.label }}</label>

    <slot />
  </div>
</template>
