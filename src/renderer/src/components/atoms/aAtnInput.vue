<script setup lang="ts" scoped>
import { print } from '../../store/print'

const emit = defineEmits(['antenna'])
const list = [1, 2, 3, 4]

const onEnter = (e: KeyboardEvent) => {
  e.preventDefault()
  const target = e.target as HTMLInputElement
  const list = target.form.elements

  const atnInfo = []
  let isFindNextInput = false
  for (let i = 0; i < list.length; i++) {
    const nextInput = list[i] as HTMLInputElement
    if (+nextInput.value > 1) nextInput.value = '1'
    if (+nextInput.value < 0) nextInput.value = '0'
    atnInfo.push(+nextInput.value)
    if (nextInput.tabIndex === target.tabIndex + 1) {
      nextInput.select()
      isFindNextInput = true
      break
    }
  }

  if (!isFindNextInput) {
    print.atnInfo = atnInfo
    emit('antenna')
  }
}
</script>

<template>
  <div class="atn-input-wrap">
    <form id="antenna-form" class="flex gap-1 justify-center">
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
        @keydown.enter="onEnter($event)"
        @keydown.tab="onEnter($event)"
      />
    </form>
  </div>
</template>
