<template>
  <div class="event-header">
    <p-link class="event-header__club" @click="emit('club:click', event!.clubId)">
      {{ club?.name }}
    </p-link>

    <div class="event-header__name">
      <p-bread-crumbs :crumbs="[{ text: event.name }]" />
    </div>

    <p class="event-header__date">
      {{ startDate }}
    </p>
    <p class="event-header__time">
      <template v-if="isHappening">
        <p-tag class="event-header__today-tag">
          Now
        </p-tag>
      </template>
      <template v-else-if="isToday">
        <p-tag class="event-header__today-tag">
          Today
        </p-tag>
      </template>
      {{ startTime }}
    </p>
    <div class="event-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { format, isSameDay, isWithinInterval } from 'date-fns'
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

  const clubSubscription = useSubscription(api.clubs.getClub, [event.value.clubId])
  const club = computed(() => clubSubscription.response)

  const isToday = computed(() => isSameDay(event.value.start, new Date()))
  const isHappening = computed(() => isWithinInterval(new Date, { start: event.value.start, end: event.value.end }))

  const startDate = computed(() => format(event.value.start, 'PPPP'))
  const startTime = computed(() => format(event.value.start, 'pp'))
</script>

<style>
.event-header {
  display: grid;
  grid-template-areas:
    'club date actions'
    'name date actions'
    'name time actions';
  grid-template-columns: minmax(0, 1fr) max-content max-content;
  column-gap: var(--space-4);
}

.event-header__club {
  grid-area: club;
  width: fit-content;
}

.event-header__name {
  grid-area: name;
  font-size: 1.25rem;
}

.event-header__actions {
  grid-area: actions;
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.event-header__date {
  grid-area: date;
  display: flex;
  flex-direction: start;
  align-items: end;
  justify-content: center;
  text-align: right;
}

.event-header__time {
  grid-area: time;
  display: flex;
  gap: var(--space-2);
  justify-content: end;
  text-align: right;
}

.event-header__today-tag {
  display: inline-block;
  background-color: var(--blue-600) !important;
}

.event-header__actions {
  grid-area: actions;
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .event-header {
    grid-template-areas:
      'club actions'
      'name actions'
      'date time';
    grid-template-columns: minmax(0, 1fr) max-content;
  }

  .event-header__date {
    align-items: start;
    justify-content: start;
    text-align: left;
  }

  .event-header__actions {
    justify-content: end;
    align-items: start;
  }
}
</style>