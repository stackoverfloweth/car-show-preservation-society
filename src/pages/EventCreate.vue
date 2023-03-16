<template>
  <div class="event-create">
    <p-bread-crumbs :crumbs="[{ text: 'Event Information' }]" />
    <p-form @submit="submit">
      <p-label label="Name" :message="nameError" :state="nameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="name" :state="nameState" />
        </template>
      </p-label>
      <p-label label="Description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" rows="6" :state="descriptionState" />
        </template>
      </p-label>
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { reactive, ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApi, useNavigation } from '@/compositions'
  import { EventRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { stringHasValue } from '@/services'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()

  const name = ref<string>()
  const description = ref<string>()
  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
  const { set } = useNavigation()

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
      right: { title: 'Create', disabled: true, pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.event-create {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}
</style>