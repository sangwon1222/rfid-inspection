<script setup lang="ts" scoped>
const emit = defineEmits(['antenna'])
const list = [1, 2, 3, 4]

const onEnter = (e: KeyboardEvent, index: number) => {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  const list = target.form.elements

  let isFindNextInput = false
  const inputs = { target: {} }
  for (let i = 0; i < list.length; i++) {
    const nextInput = list[i] as HTMLInputElement
    inputs.target[nextInput.name] = nextInput
    if (nextInput.tabIndex === target.tabIndex + 1) {
      nextInput.select()
      isFindNextInput = true
      break
    }
  }

  if (!isFindNextInput) {
    emit('antenna', inputs)
  }
}
</script>

<template>
  <div class="atn-input-wrap">
    <form id="antenna-form" class="flex gap-1 justify-center" @submit="emit('antenna', $event)">
      <input
        v-for="(v, i) of list"
        :key="i"
        type="number"
        :name="`atn${v}`"
        class="w-5 text-center border"
        min="0"
        max="1"
        required
        :tabIndex="i"
        :value="`${v === 1 ? 1 : 0}`"
        @keydown.enter="onEnter($event, i)"
        @keydown.tab="onEnter($event, i)"
      />
    </form>
  </div>
</template>
