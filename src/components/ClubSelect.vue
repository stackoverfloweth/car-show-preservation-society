<template>
  <p-combobox v-model="clubId" class="club-select" :options="options" @open="fetchResults">
    <template v-if="loading" #post-options>
      <div class="club-select__loading">
        <p-loading-icon />
      </div>
    </template>
  </p-combobox>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
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

  const clubSubscriptionArgs = ref<Parameters<typeof api.clubs.getClubs> | null>(clubId.value ? [] : null)
  const clubSubscription = useSubscriptionWithDependencies(api.clubs.getClubs, clubSubscriptionArgs)
  const loading = computed(() => !clubSubscription.executed && clubSubscription.loading)
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

  function fetchResults(): void {
    if (clubSubscriptionArgs.value === null) {
      clubSubscriptionArgs.value = []
    }
  }
</script>

<style>
.club-select__loading {
  padding: var(--space-md);
  display: flex;
  justify-content: center;
}
</style>