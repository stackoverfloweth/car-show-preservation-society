<template>
  <p-select v-model="order" :options="options" />
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { SortOrder } from '@/types'

  const props = defineProps<{
    order: SortOrder | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:order', value: SortOrder | null): void,
  }>()

  const order = computed({
    get() {
      return props.order ?? null
    },
    set(value) {
      emit('update:order', value)
    },
  })

  type SortOrderOption = SelectOption & { value: SortOrder }
  const options: SortOrderOption[] = [
    { label: 'Asc', value: 'asc' },
    { label: 'Desc', value: 'desc' },
  ]
</script>