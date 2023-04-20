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
    nullOptionLabel?: string,
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
  const options = computed(() => {
    const value: SelectOption[] = clubs.value.map(club => ({
      value: club.clubId,
      label: club.name,
    }))

    if (props.nullOptionLabel) {
      value.unshift({ label: props.nullOptionLabel, value: null })
    }

    return value
  })
</script>