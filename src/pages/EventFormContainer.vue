<template>
  <p-form class="event-form-container">
    <component :is="formComponent" v-model:event="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { PButton, showToast } from '@prefecthq/prefect-design'
  import { useIsSame, useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watchEffect, h } from 'vue'
  import { NavigationGuard, onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import EventFormFields from '@/components/EventFormFields.vue'
  import EventJudgingFormFields from '@/components/EventJudgingFormFields.vue'
  import EventRegistrationFormFields from '@/components/EventRegistrationFormFields.vue'
  import EventSponsorsFormFields from '@/components/EventSponsorsFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Event } from '@/models'
  import { NamedRoute, routes } from '@/router/routes'

  const eventId = useRouteParam('eventId')

  const router = useRouter()
  const route = useRoute()
  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  const { response: event } = await eventSubscription.promise()
  const values = ref<Event | undefined>(event)
  const isSame = useIsSame(event, values)
  const confirmToastId = ref<number>()

  const formComponent = computed(() => {
    switch (route.name as NamedRoute) {
      case 'events.editor.general':
        return EventFormFields
      case 'events.editor.judging':
        return EventJudgingFormFields
      case 'events.editor.registration':
        return EventRegistrationFormFields
      case 'events.editor.sponsors':
        return EventSponsorsFormFields
      default:
        return null
    }
  })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.events.updateEvent(values.value)

    showToast('Event Created!', 'success')
    router.push(routes.events())
  }

  const unsavedChangesCheck: NavigationGuard = () => {
    if (isSame.value) {
      return true
    }

    if (confirmToastId.value !== undefined) {
      return Promise.resolve(false)
    }

    return new Promise(resolve => {
      const { id, dismiss } = showToast(h(
        'div',
        { class: 'event-form-container__confirm-unsaved' },
        [
          h('p', { innerText: 'You have unsaved changes!' }),
          h('div', { class: 'event-form-container__confirm-unsaved-options' }, [
            h(PButton, {
              size: 'sm',
              flat: true,
              innerText: 'Cancel',
              onClick: () => {
                confirmToastId.value = undefined
                dismiss()
                resolve(false)
              },
            }),
            h(PButton, {
              size: 'sm',
              danger: true,
              innerText: 'Discard',
              onClick: () => {
                values.value = event
                confirmToastId.value = undefined
                dismiss()
                resolve(true)
              },
            }),
          ]),
        ],
      ), 'error', { timeout: false })

      confirmToastId.value = id
    })
  }

  onBeforeRouteLeave(unsavedChangesCheck)

  watchEffect(() => {
    set({
      left: { title: 'Cancel', showChevron: false, route: routes.events() },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.event-form-container__confirm-unsaved-options {
  display: flex;
  gap: var(--space-2);
}
</style>