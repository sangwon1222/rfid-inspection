<script setup lang="ts" scoped>
const emit = defineEmits(['antenna'])
const list = [1, 2, 3, 4]
</script>

<template>
  <div class="atn-input-wrap">
    <form id="antenna-form" class="flex gap-1 justify-center" @submit="emit('antenna')">
      <input
        v-for="(v, i) of list"
        :key="i"
        type="number"
        :name="`atn${v}`"
        class="w-5 text-center border"
        min="0"
        max="1"
        required
        :value="`${v === 1 ? 1 : 0}`"
      />
    </form>
  </div>
</template>
