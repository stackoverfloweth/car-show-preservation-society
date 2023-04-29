<template>
  <p-form class="event-form-container">
    <component :is="component" v-if="values" v-model:event="values" />
  </p-form>
</template>

<script lang="ts" setup>
  import { PButton, showToast } from '@prefecthq/prefect-design'
  import { useIsSame, useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, watchEffect, h } from 'vue'
  import { NavigationGuard, onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
  import EventEditorJudgingFormFields from '@/components/EventEditorJudgingFormFields.vue'
  import EventEditorRegistrationFormFields from '@/components/EventEditorRegistrationFormFields.vue'
  import EventFormFields from '@/components/EventFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { EventRequest } from '@/models'
  import { NamedRoute, routes } from '@/router/routes'
  import { mapper } from '@/services'

  const eventId = useRouteParam('eventId')

  const router = useRouter()
  const route = useRoute()
  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const eventSubscription = useSubscription(api.events.getEvent, [eventId])
  eventSubscription.promise().then(({ response }) => {
    event.value = mapper.map('Event', response, 'EventRequest')
    values.value = mapper.map('Event', response, 'EventRequest')
  })
  const event = ref<EventRequest>()
  const values = ref<EventRequest>()
  const isSame = useIsSame(event, values)
  const confirmToastId = ref<number>()

  const component = computed(() => {
    switch (route.name as NamedRoute) {
      case 'events.editor.general':
        return EventFormFields
      case 'events.editor.judging':
        return EventEditorJudgingFormFields
      case 'events.editor.registration':
        return EventEditorRegistrationFormFields
      default:
        throw `No form fields assignable to route ${route.name?.toString()}`
    }
  })

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.events.updateEvent(values.value as EventRequest)

    showToast('Saved!', 'success')
    router.push(routes.event(eventId.value))
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
                values.value = event.value
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
      left: { title: 'Event', route: routes.event(eventId.value) },
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