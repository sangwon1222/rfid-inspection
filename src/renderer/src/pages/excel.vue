<script setup lang="ts" scoped>
import tExcelHeader from '@template/excel/tExcelHeader.vue'
import tLoadExcelScreen from '@template/tLoadExcelScreen.vue'
</script>

<template>
  <div class="relative flex flex-col w-full h-full">
    <t-excel-header />
    <t-load-excel-screen />
  </div>
</template>
