<template>
  <div class="clubs-filter">
    <div class="clubs-filter__filter">
      <div class="clubs-filter__mobile-label">
        Filter
      </div>
      <p-button v-model="isPublic" :flat="!isPublic" :secondary="isPublic" @click="isPublic = !isPublic">
        Public
      </p-button>
      <p-button v-model="userIsMember" :flat="!userIsMember" :secondary="userIsMember" @click="userIsMember = !userIsMember">
        My Clubs
      </p-button>
    </div>
    <div class="clubs-filter__sort">
      <div class="clubs-filter__mobile-label">
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
  import SortOrderSelect from '@/components/SortOrderSelect.vue'
  import { ClubsFilter } from '@/models/api/clubsFilter'
  import { ClubsSort } from '@/models/api/clubsSort'

  const props = defineProps<{
    filter: ClubsFilter,
    sort: ClubsSort,
  }>()

  const emit = defineEmits<{
    (event: 'update:filter', value: ClubsFilter): void,
    (event: 'update:sort', value: ClubsSort): void,
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

  const isPublic = usePatchRef(filter, 'public')
  const userIsMember = usePatchRef(filter, 'userIsMember')

  const sortType = usePatchRef(sort, 'sort')
  const order = usePatchRef(sort, 'order')

  type SortTypeOption = SelectOption & { value: ClubsSort['sort'] }
  const sortTypeOptions: SortTypeOption[] = [
    { label: 'Name', value: 'name' },
    { label: 'Created', value: 'created' },
    { label: 'Members', value: 'members' },
    { label: 'Upcoming Events', value: 'upcoming-events' },
  ]
</script>

<style>
.clubs-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.clubs-filter__mobile-label {
  display: none;
  text-align: center;
}

.clubs-filter .p-select-button,
.clubs-filter .p-native-select,
.clubs-filter .p-select-button:focus {
  border: none !important;
  box-shadow: none;
  padding: 1px 0;
}

.clubs-filter .p-select-button:active,
.clubs-filter .p-select--open {
  outline-offset: 2px;
  outline: 2px solid var(--blue-500);
}

.clubs-filter__filter,
.clubs-filter__sort {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .clubs-filter__filter,
  .clubs-filter__sort {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .clubs-filter__mobile-label {
    display: inline-block;
  }

  .clubs-filter .p-button__content {
    justify-content: start;
  }
}
</style>