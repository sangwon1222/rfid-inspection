<script setup lang="ts" scoped>
import tIdroSetting from '@pages/setIdro.vue'
</script>

<template>
  <div class="overflow-y-auto absolute w-full h-full box-border border">
    <t-idro-setting :is-remote="true" />
  </div>
</template>
