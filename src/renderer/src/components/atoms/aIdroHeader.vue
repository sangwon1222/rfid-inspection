<script setup lang="ts" scoped>
import aButton from '@atoms/aButton.vue'

const emit = defineEmits(['drag-start', 'fold', 'minimalize'])
const props = defineProps({
  statusInfo: {
    type: Object,
    default() {
      return { ok: false, msg: 'disconnected..' }
    }
  },
  isDragEventStop: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div
    class="absolute flex justify-between items-center px-1 w-full h-6 bg-gray-400 cursor-pointer"
    @pointerdown="emit('drag-start', $event)"
  >
    <div class="overflow-hidden">
      <p class="text-sm" :class="props.statusInfo.ok ? 'text-white' : 'text-red-800'">
        {{ props.statusInfo.msg }}
      </p>
    </div>

    <div class="flex gap-1">
      <a-button
        custom-style="w-4 h-4 p-2 flex justify-center items-center border text-white text-xs"
        label="▼"
        @pointerdown="emit('minimalize')"
      />
      <a-button
        custom-style="w-4 h-4 p-2 flex justify-center items-center border text-white"
        label="-"
        @pointerdown="emit('fold')"
      />
    </div>
  </div>
</template>
