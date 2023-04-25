<template>
  <BaseFilter>
    <template #filter>
      <ClubSelect v-model:clubId="clubId" null-option-label="Any Club" />
      <p-select v-model="distanceInMiles" :options="distanceOptions" />
      <p-button v-model="hasCapacity" :flat="!hasCapacity" :secondary="hasCapacity" @click="hasCapacity = !hasCapacity">
        Has Capacity
      </p-button>
      <p-button v-model="hasPast" :flat="!hasPast" :secondary="hasPast" @click="hasPast = !hasPast">
        Has Past
      </p-button>
    </template>
    <template #sort>
      <p-select v-model="sortType" :options="sortTypeOptions" />
      <SortOrderSelect v-model:order="order" />
    </template>
  </BaseFilter>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { usePatchRef } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import BaseFilter from '@/components/BaseFilter.vue'
  import ClubSelect from '@/components/ClubSelect.vue'
  import SortOrderSelect from '@/components/SortOrderSelect.vue'
  import { EventsFilter } from '@/models/api/eventsFilter'
  import { EventsSort } from '@/models/api/eventsSort'

  const props = defineProps<{
    filter: EventsFilter,
    sort: EventsSort,
  }>()

  const emit = defineEmits<{
    (event: 'update:filter', value: EventsFilter): void,
    (event: 'update:sort', value: EventsSort): void,
  }>()

  const filter = computed({
    get() {
      return props.filter
    },
    set(value) {
      emit('update:filter', value)
    },
  })

  const sort = computed({
    get() {
      return props.sort
    },
    set(value) {
      emit('update:sort', value)
    },
  })

  const clubId = usePatchRef(filter, 'clubId')
  const hasCapacity = usePatchRef(filter, 'hasCapacity')
  const hasPast = usePatchRef(filter, 'hasPast')
  const distanceInMiles = usePatchRef(filter, 'distanceInMiles')

  const sortType = usePatchRef(sort, 'sort')
  const order = usePatchRef(sort, 'order')

  const distanceOptions: SelectOption[] = [
    { label: 'Any Distance', value: null },
    { label: 'Within 50 Miles', value: 50 },
    { label: 'Within 100 Miles', value: 100 },
    { label: 'Within 200 Miles', value: 500 },
  ]

  type SortTypeOption = SelectOption & { value: EventsSort['sort'] }
  const sortTypeOptions: SortTypeOption[] = [
    { label: 'Date', value: 'date' },
    { label: 'Name', value: 'name' },
    { label: 'Location', value: 'location' },
  ]
</script>