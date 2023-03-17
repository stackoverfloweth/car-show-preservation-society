<template>
  <div class="club-create-page">
    <p-bread-crumbs :crumbs="[{ text: 'Club Information' }]" />

    <p-form @submit="submit">
      <ClubFormFields
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
  import ClubFormFields from '@/components/ClubFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { ClubRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const name = ref<string>()
  const description = ref<string>()

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

  watchEffect(() => {
    set({
      left: { title: 'Cancel', showChevron: false, callback: router.back },
      right: { title: 'Create', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.club-create-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-2);
}
</style>