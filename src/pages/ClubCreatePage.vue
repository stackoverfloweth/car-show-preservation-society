<template>
  <div class="club-create-page">
    <p-bread-crumbs :crumbs="[{ text: 'Club Information' }]" />
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

      <template #footer>
        <p-button inset @click="cancel">
          Cancel
        </p-button>
        <p-button :loading="pending" @click="submit">
          Create Club
        </p-button>
      </template>
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useApi, useNavigation } from '@/compositions'
  import { ClubRequest } from '@/models/api'
  import { routes } from '@/router/routes'
  import { stringHasValue } from '@/services'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()

  const name = ref<string>()
  const description = ref<string>()
  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])

  useNavigation({
    left: { title: 'Clubs', route: routes.clubs() },
    center: { title: 'Create Club' },
  })

  function cancel(): void {
    router.back()
  }

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    const values = reactive({ name, description }) as ClubRequest
    await api.clubs.createClub(values)

    showToast('Club Created!', 'success')
    router.push(routes.clubs())
  }
</script>

<style>
.club-create-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}
</style>