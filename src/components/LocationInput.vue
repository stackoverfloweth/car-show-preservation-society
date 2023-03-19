<template>
  <template v-if="media.hover">
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

  <template v-else>
    <p-button class="location-input__modal-button" inset>
      <template v-if="search">
        {{ search }}
      </template>
      <template v-else>
        <span>Set Location</span>
      </template>
    </p-button>
  </template>
</template>

<script lang="ts" setup>
  import { SelectOption, media } from '@prefecthq/prefect-design'
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
      return []
    }

    return [{ label: search.value, value: search.value }]
  })

  const search = ref<string>()
</script>

<style>
.location-input__modal-button {
  width: 100%;
  color: var(--slate-400);
  border: 1px solid var(--slate-500);
}

.location-input__modal-button .p-button__content {
  justify-content: start;
}
</style>