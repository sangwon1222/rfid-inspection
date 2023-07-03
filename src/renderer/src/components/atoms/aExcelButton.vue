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

const onDropIn = (e: DragEvent) => emit('dropIn', e)
</script>

<template>
  <div
    ref="dragBoxRef"
    class="flex flex-wrap justify-center items-center w-full h-full z-10"
    @drop.prevent.stop="onDropIn($event)"
    @dragover.prevent.stop
  >
    <label class="absolute">{{ props.label }}</label>

    <slot />
  </div>
</template>
