<template>
  <div class="event-create-page">
    <p-bread-crumbs :crumbs="[{ text: 'Event Information' }]" />

    <p-form class="event-form" @submit="submit">
      <EventForm
        v-model:name="name"
        v-model:description="description"
      />
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidationObserver } from '@prefecthq/vue-compositions'
  import { reactive, ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import EventForm from '@/components/EventFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { EventRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const name = ref<string | undefined>()
  const description = ref<string | undefined>()

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const values = reactive({ name, description }) as EventRequest
    await api.events.createEvent(values)

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