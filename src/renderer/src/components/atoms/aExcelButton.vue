<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['dropIn'])
const dragBoxRef = ref(null)

const ableStyle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragBoxRef.value.style.borderColor = '#57608C'
  dragBoxRef.value.style.color = '#57608C'
  dragBoxRef.value.style.fontSize = '1.2rem'
}

const defaultStyle = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  dragBoxRef.value.style.borderColor = '#73778C'
  dragBoxRef.value.style.color = '#73778C'
  dragBoxRef.value.style.fontSize = '1rem'
}

const onDropIn = (e: DragEvent) => {
  e.preventDefault()
  e.stopPropagation()
  emit('dropIn', e)
}
</script>

<template>
  <div
    ref="dragBoxRef"
    class="dragAndDrop"
    @dragenter.prevent="ableStyle"
    @dragleave.prevent="defaultStyle"
    @dragend.prevent="defaultStyle"
    @drop.prevent="onDropIn($event)"
    @dragover.prevent
  >
    {{ props.label }}
  </div>
</template>

<style lang="less" scoped>
.dragAndDrop {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  top: 200px;
  border: 2px #73778c solid;
  color: #73778c;
  width: 400px;
  height: 400px;
  border-radius: 40px;
  transition: all 0.25s;
}
</style>
