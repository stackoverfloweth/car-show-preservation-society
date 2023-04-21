<template>
  <div class="event-header">
    <div class="event-header__name">
      <p-link @click="emit('club:click', event!.clubId)">
        {{ club?.name }}
      </p-link>
      <page-header :heading="event.name" />
      <p>{{ startDate }}</p>
      <p>{{ startTime }}</p>
      <template v-if="event.isHappening">
        <p-tag class="event-header__today-tag">
          Now
        </p-tag>
      </template>
      <template v-else-if="event.isToday">
        <p-tag class="event-header__today-tag">
          Today
        </p-tag>
      </template>
    </div>

    <div class="event-header__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { format } from 'date-fns'
  import { computed, toRefs } from 'vue'
  import PageHeader from '@/components/PageHeader.vue'
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

  const startDate = computed(() => format(event.value.start, 'PPPP'))
  const startTime = computed(() => format(event.value.start, 'pp'))
</script>

<style>
.event-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: start;
  column-gap: var(--space-4);
}

.event-header__timing {
  display: flex;
  align-items: start;
  gap: var(--space-3);
}

.event-header__actions {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}

.event-header__today-tag {
  display: inline-block;
  background-color: var(--blue-600) !important;
}

.event-header__actions {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .event-header__actions {
    justify-content: end;
    align-items: start;
  }
}
</style>