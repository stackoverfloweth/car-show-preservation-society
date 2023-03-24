<template>
  <div class="advertisement-size-select">
    <template v-for="size in standardSizes" :key="size.height.toString() + size.width.toString()">
      {{ size }}
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { standardSizes } from '@/models/advertisement'
  import { Size } from '@/models/size'

  const props = defineProps<{
    modelValue: Size | undefined | null,
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: Size | null): void,
  }>()

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })
</script>

<style>

</style>