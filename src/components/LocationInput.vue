<template>
  <template v-if="manualMode">
    <div class="location-input">
      <p-textarea v-model="place" @update:model-value="setLocationFromManual" />
      <p-link @click="manualMode = false">
        Search for Address
      </p-link>
    </div>
  </template>

  <template v-else-if="media.hover">
    <p-combobox v-model:search="search" :model-value="place" class="location-input" :options="options" @update:model-value="setLocationFromAutofill">
      <template #combobox-options-empty>
        <template v-if="locationsSubscription.loading">
          <p-loading-icon />
        </template>
        <template v-else-if="!search">
          <div class="location-input__no-results">
            <p>Start typing address to search.</p>
          </div>
        </template>
        <template v-else>
          <div class="location-input__no-results">
            <p>That address doesn't seem to exist.</p>
          </div>
        </template>
      </template>
      <template #post-options>
        <div class="location-input__post-options">
          <p-link @click="manualMode = true">
            Enter location manually
          </p-link>
        </div>
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
  import { SelectOption, media, SelectModelValue } from '@prefecthq/prefect-design'
  import { useDebouncedRef, useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { Location } from '@/models'
  import { mapBoxApi } from '@/services'

  const props = defineProps<{
    location: Location | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:location', value: Location | null): void,
  }>()

  const manualMode = ref(false)

  const location = computed({
    get() {
      return props.location ?? null
    },
    set(value) {
      emit('update:location', value)
    },
  })

  const place = computed(() => location.value?.place ?? '')

  const search = ref<string>()
  const searchDebounced = useDebouncedRef(search, 1500)

  const locationsSubscriptionArgs = computed<Parameters<typeof mapBoxApi.getLocations> | null>(() => searchDebounced.value ? [searchDebounced.value] : null)
  const locationsSubscription = useSubscriptionWithDependencies(mapBoxApi.getLocations, locationsSubscriptionArgs)
  const locations = computed(() => locationsSubscription.response ?? [])

  const options = computed<SelectOption[]>(() => {
    if (!search.value) {
      return [
        {
          label: place.value,
          value: place.value,
        },
      ]
    }

    return locations.value.map(location => ({
      value: location.place!,
      label: location.place!,
    }))
  })

  function setLocationFromAutofill(value: SelectModelValue | SelectModelValue[]): void {
    const matchingLocation = locations.value.find(location => location.place === value)

    location.value = matchingLocation ?? null
  }

  function setLocationFromManual(value: string | null): void {
    location.value = {
      place: value ?? undefined,
    }
  }
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

.location-input__post-options {
  padding: var(--space-2) var(--space-3);
}
</style>