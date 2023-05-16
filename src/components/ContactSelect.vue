<template>
  <p-combobox v-model="userId" class="user-select" :options="options">
    <template #combobox-options-empty>
      <template v-if="clubId">
        <!--
          <template v-if="membersSubscription.loading">
          Loading club members
          </template>
          <template v-else>
          Club has no members
          </template>
        -->
      </template>
      <template v-else>
        No club selected!
      </template>
    </template>
  </p-combobox>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs } from 'vue'
  import { useApi } from '@/compositions'
  import { User } from '@/models'

  const props = defineProps<{
    userId: string | null | undefined,
    clubId: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:userId', value: string | null): void,
  }>()

  const { clubId } = toRefs(props)

  const userId = computed({
    get() {
      return props.userId ?? null
    },
    set(value) {
      emit('update:userId', value)
    },
  })

  const api = useApi()

  // todo: rework now that users come from netlify
  const members = ref<{ user: User }[]>([])
  // const membersSubscriptionArgs = computed<Parameters<typeof api.users.getUsersFromClub> | null>(() => clubId.value ? [clubId.value] : null)
  // const membersSubscription = useSubscriptionWithDependencies(api.users.getUsersFromClub, membersSubscriptionArgs)
  // const members = computed(() => membersSubscription.response ?? [])

  const options = computed<SelectOption[]>(() => members.value.map(({ user }) => ({
    value: user!.userId,
    label: user!.displayName,
  })))
</script>