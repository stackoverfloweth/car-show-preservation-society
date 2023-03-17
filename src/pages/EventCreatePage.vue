<template>
  <div class="event-create-page">
    <p-bread-crumbs :crumbs="[{ text: 'Event Information' }]" />

    <p-form class="event-form" @submit="submit">
      <EventForm
        v-model:values="values"
      />
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import EventForm from '@/components/EventFormFields.vue'
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

    await api.events.createEvent(values.value as EventRequest)

    showToast('Event Created!', 'success')
    router.push(routes.events())
  }

  watchEffect(() => {
    set({
      left: { title: 'Cancel', showChevron: false, callback: router.back },
      right: { title: 'Create', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.event-create-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-2);
}
</style>