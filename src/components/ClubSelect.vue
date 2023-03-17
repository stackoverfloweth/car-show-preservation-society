<template>
  <p-combobox v-model="clubId" class="club-select" :options="options" />
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    clubId: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:clubId', value: string | null): void,
  }>()

  const clubId = computed({
    get() {
      return props.clubId ?? null
    },
    set(value) {
      emit('update:clubId', value)
    },
  })

  const api = useApi()

  const clubSubscription = useSubscription(api.clubs.getClubs)
  const clubs = computed(() => clubSubscription.response ?? [])
  const options = computed<SelectOption[]>(() => clubs.value.map(club => ({
    value: club.clubId,
    label: club.name,
  })))
</script>