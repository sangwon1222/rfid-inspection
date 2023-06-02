<script setup lang="ts" scoped>
defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' }
})

defineEmits(['onChange'])
</script>

<template>
  <div class="flex gap-2">
    <label for="">{{ label }}</label>
    <input
      type="text"
      class="w-120 px-1 border-2"
      :value="value"
      @keydown.self="(e) => (e.currentTarget as HTMLInputElement).blur()"
      @blur.self="$emit('onChange', $event)"
    />
  </div>
</template>
