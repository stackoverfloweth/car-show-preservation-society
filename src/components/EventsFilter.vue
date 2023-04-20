<template>
  <div class="events-filter">
    <div class="events-filter__filter">
      <div class="events-filter__mobile-label">
        Filter
      </div>
      <ClubSelect v-model:clubId="clubId" null-option-label="Any Club" />
      <p-select v-model="distanceInMiles" :options="distanceOptions" />
      <p-button v-model="hasCapacity" :flat="!hasCapacity" :secondary="hasCapacity" @click="hasCapacity = !hasCapacity">
        Has Capacity
      </p-button>
    </div>
    <div class="events-filter__sort">
      <div class="events-filter__mobile-label">
        Sort
      </div>
      <p-select v-model="sortType" :options="sortTypeOptions" />
      <SortOrderSelect v-model:order="order" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { usePatchRef } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
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

<style>
.events-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.events-filter__mobile-label {
  display: none;
  text-align: center;
}

.events-filter__input {
  border: none;
  max-width: 150px;
}

.events-filter .p-select-button,
.events-filter .p-native-select,
.events-filter .p-select-button:focus {
  border: none !important;
  box-shadow: none;
  padding: 1px 0;
}

.events-filter .p-select-button:active,
.events-filter .p-select--open {
  outline-offset: 2px;
  outline: 2px solid var(--blue-500);
}

.events-filter__filter,
.events-filter__sort {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .events-filter {
    align-items: start;
  }

  .events-filter__filter,
  .events-filter__sort {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .events-filter__mobile-label {
    display: inline-block;
  }

  .events-filter .p-button__content {
    justify-content: start;
  }

  .events-filter__input {
    max-width: unset;
  }
}
</style>