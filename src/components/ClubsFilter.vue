<template>
  <BaseFilter>
    <template #filter>
      <p-button v-model="isPublic" :flat="!isPublic" :secondary="isPublic" @click="isPublic = !isPublic">
        Public
      </p-button>
      <p-button v-model="userIsMember" :flat="!userIsMember" :secondary="userIsMember" @click="userIsMember = !userIsMember">
        My Clubs
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