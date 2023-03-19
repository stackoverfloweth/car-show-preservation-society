<template>
  <p-form class="event-form-container">
    <component :is="formComponent" v-model:values="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watchEffect } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import EventFormFields from '@/components/EventFormFields.vue'
  import EventJudgingFormFields from '@/components/EventJudgingFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { EventRequest } from '@/models/api'
  import { NamedRoute, routes } from '@/router/routes'

  // could be editing existing
  // const {eventId} = useRouteParam('eventId')

  const router = useRouter()
  const route = useRoute()
  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()
  const values = ref<Partial<EventRequest>>({})

  const formComponent = computed(() => {
    switch (route.name as NamedRoute) {
      case 'events.create.event':
        return EventFormFields
      case 'events.create.judging':
        return EventJudgingFormFields
      default:
        return null
    }
  })

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
    const backEnabled = window.history.length > 1

    set({
      left: backEnabled ? { title: 'Cancel', showChevron: false, callback: router.back } : { title: 'Events', route: routes.events() },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>