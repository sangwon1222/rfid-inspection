<script setup lang="ts" scoped></script>

<template>
  <div class="wrap">
    <router-view />
  </div>
</template>

<style lang="less" scoped>
.wrap {
  min-height: calc(100vh - 200px);
  padding: 10px;
}
</style>
