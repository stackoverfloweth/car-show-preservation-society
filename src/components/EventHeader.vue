<template>
  <div class="event-overview-header">
    <div class="event-overview-header__heading">
      <p-link class="event-overview-header__club-name" @click="emit('club:click', event!.clubId)">
        {{ club?.name }}
      </p-link>
      <p-bread-crumbs :crumbs="[{ text: event.name }]" />
    </div>

    <div class="event-overview-header__header-actions">
      <div class="event-overview-header__start">
        <strong>
          {{ startDate }}
        </strong>
        <p>{{ startTime }}</p>
      </div>
      <p-button inset icon="ShareIcon" />
      <template v-if="eventIsUpcoming">
        <p-button>Register</p-button>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { format, isFuture } from 'date-fns'
  import { computed, toRefs } from 'vue'
  import { useApi } from '@/compositions'
  import { Event } from '@/models'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'club:click', value: string): void,
  }>()

  const { event } = toRefs(props)
  const api = useApi()
  const eventIsUpcoming = computed(() => isFuture(props.event.end))

  const clubSubscription = useSubscription(api.clubs.getClub, [event.value.clubId])
  const club = computed(() => clubSubscription.response)

  const startDate = computed(() => format(event.value.start, 'PPPP'))
  const startTime = computed(() => format(event.value.start, 'pp'))
</script>

<style>
.event-overview-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-2);
}

.event-overview-header__event-name {
  font-size: 1.25rem;
}

.event-overview-header__header-actions {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.event-overview-header__start {
  display: flex;
  flex-direction: column;
  align-items: end;
  margin: 0 var(--space-4);
}
</style>