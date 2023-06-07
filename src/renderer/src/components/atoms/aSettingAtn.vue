<script setup lang="ts" scoped>
import { store } from '../../store/store'
import { reactive, computed } from 'vue'

const state = reactive({
  atnInfo: computed(() => store.idro.atnInfo)
})

const changeValue = (e) => {
  const index = +e.currentTarget.value - 1
  store.idro.atnInfo[index] = state.atnInfo[index] === 1 ? 0 : 1
}
</script>

<template>
  <div>
    <div class="flex gap-1">
      <button
        v-for="(v, i) of 4"
        :key="i"
        :value="v"
        class="w-20 h-10 text-center border"
        @click="changeValue"
      >
        {{ state.atnInfo[i] }}
      </button>
    </div>

    <div class="grid grid-cols-4 w-full">
      <button v-for="(v, i) of 4" :key="i" :value="v" class="py-4" @click="changeValue">
        <div
          class="w-4 h-4 m-auto rounded-xl border-2 box-border bg-teal-500"
          :class="state.atnInfo[i] === 1 ? 'opacity-100' : 'opacity-20'"
        />
      </button>
    </div>
  </div>
</template>
