<script setup lang="ts" scoped>
import tExcelHeader from '@template/excel/tExcelHeader.vue'
import tLoadExcelScreen from '@template/tLoadExcelScreen.vue'
</script>

<template>
  <div class="relative flex flex-col gap-10 pt-4 w-full h-full box-border">
    <t-excel-header />
    <t-load-excel-screen />
  </div>
</template>
