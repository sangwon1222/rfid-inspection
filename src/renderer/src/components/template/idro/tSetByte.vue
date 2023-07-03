<script setup lang="ts" scoped>
import tSetWrap from '@template/tSetWrap.vue'
import { store } from '@store/store'
import { reactive } from 'vue'
import { saveSetting } from '@renderer/util/common'

const state = reactive({ error: '' })

const onInputByteLength = (e: InputEvent) => {
  const target = e.currentTarget as HTMLInputElement

  if (isNaN(+e.data)) target.value = target.value.slice(0, target.value.length - 1)

  if (target.value.length > 2) target.value = target.value.slice(-2)
}

const save = async (e: FocusEvent) => {
  const target = e.currentTarget as HTMLInputElement
  state.error = '저장 중...'
  if (!+target.value) {
    target.value = `${store.idro.byteLength}`
    return
  }
  if (+target.value % 2 === 0) {
    store.idro.byteLength = +target.value / 2
    saveSetting()
    state.error = ''
  } else {
    state.error = 'byte는 짝수로 입력해야 합니다.'
    target.select()
  }
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1 w-full h-40">
      <label>write/read 자릿수 지정</label>
      <label v-if="state.error" class="text-2xs">
        <p class="text-red-400 text-xs">{{ state.error }}</p>
      </label>
    </div>

    <div class="flex flex-col gap-1 items-center text-white">
      <div class="flex gap-2">
        <input
          type="number"
          class="w-40 h-fit border-2 bg-gray-100 text-black rounded text-xl"
          :placeholder="`${store.idro.byteLength}`"
          :value="store.idro.byteLength"
          @input="onInputByteLength"
          @keydown.enter.self="(e) => (e.currentTarget as HTMLInputElement).blur()"
          @click="(e) => (e.currentTarget as HTMLInputElement).select()"
          @blur="save"
        />
        <p>byte /</p>
      </div>
    </div>
  </t-set-wrap>
</template>
