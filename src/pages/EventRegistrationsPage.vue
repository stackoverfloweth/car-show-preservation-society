<template>
  <div class="event-registrations-page">
    <RegistrationsList :event-id="eventId" :registrations="registrations" />
    <p-button>assign registrations to their correct voting category</p-button>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import RegistrationsList from '@/components/RegistrationsList.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')
  const api = useApi()
  useNavigation({
    left: { title: 'Event', route: routes.event(eventId.value) },
    center: { title: 'Registrations' },
    right: { title: 'New', route: routes.eventRegister(eventId.value) },
  })

  const registrationsSubscription = useSubscription(api.registration.getRegistrations, [eventId])
  const registrations = computed(() => registrationsSubscription.response ?? [])
</script>

<style>
.event-registrations-page {
  padding: var(--space-4);
}
</style>