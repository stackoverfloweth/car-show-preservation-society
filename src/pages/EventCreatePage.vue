<template>
  <p-form class="event-create-page" @submit="submit">
    <EventFormFields v-model:event="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import EventFormFields from '@/components/EventFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { EventRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()
  const values = ref<Partial<EventRequest>>({})

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const eventId = await api.events.createEvent(values.value as EventRequest)

    showToast('Event Created!', 'success')
    router.push(routes.event(eventId))
  }

  watchEffect(() => {
    set({
      left: { title: 'Cancel', showChevron: false, route: routes.events() },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.event-create-page {
  display: flex;
  padding: var(--space-md);
  gap: var(--space-md);
}
</style>