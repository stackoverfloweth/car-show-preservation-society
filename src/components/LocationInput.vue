<template>
  <p-combobox v-model="search" v-model:search="search" class="location-input" :options="options">
    <template #combobox-options-empty>
      <template v-if="search">
        <p-loading-icon />
      </template>
      <template v-else>
        Start typing address
      </template>
    </template>
  </p-combobox>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import { Location } from '@/models'

  const props = defineProps<{
    location: Location | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:location', value: Location | undefined): void,
  }>()

  const location = computed({
    get() {
      return props.location
    },
    set(value) {
      emit('update:location', value)
    },
  })

  const options = computed<SelectOption[]>(() => {
    if (!search.value) {
      console.log('nope', search.value)
      return []
    }

    return [{ label: search.value, value: search.value }]
  })

  const search = ref<string>()
</script>