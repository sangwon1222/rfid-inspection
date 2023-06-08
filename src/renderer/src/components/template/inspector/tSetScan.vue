<script setup lang="ts" scoped>
import serialManager from '@util/serialManager'
import tSetWrap from '@template/tSetWrap.vue'
import aButton from '@atoms/aButton.vue'
import { useRouter } from 'vue-router'
import { store } from '@store/store'
const router = useRouter()

const scanStart = async () => {
  router.push('excel')
  await serialManager.inspectStart()
}
</script>

<template>
  <t-set-wrap>
    <div class="flex flex-col gap-1">
      <div class="flex gap-4">
        <label>SCAN START</label>
      </div>
    </div>
    <a-button
      :add-style="store.inspector.isInspecting ? 'bg-teal-200' : 'bg-gray-200'"
      @on-parent-event="scanStart"
      >검수
    </a-button>
  </t-set-wrap>
</template>
