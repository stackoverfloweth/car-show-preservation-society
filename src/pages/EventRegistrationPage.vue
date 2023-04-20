<template>
  <div class="event-registration-page">
    <template v-if="values">
      <EventRegistrationFormFields :event="values" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import EventRegistrationFormFields from '@/components/EventRegistrationFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { IEvent } from '@/models'
  import { routes } from '@/router/routes'

  const api = useApi()
  const { set } = useNavigation()
  const eventId = useRouteParam('eventId')
  const router = useRouter()
  const { validate, pending } = useValidationObserver()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  eventSubscription.promise().then(({ response }) => {
    if (response) {
      values.value = response
    }
  })

  const values = ref<IEvent | undefined>()

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.events.updateEvent(values.value)

    showToast('Saved!', 'success')
    router.push(routes.event(eventId.value))
  }

  watchEffect(() => {
    set({
      left: { title: 'Event', route: routes.event(eventId.value) },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.event-registration-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4);
}
</style>