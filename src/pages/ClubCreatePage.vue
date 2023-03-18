<template>
  <div class="club-create-page">
    <p-bread-crumbs :crumbs="[{ text: 'Club Information' }]" />

    <p-form @submit="submit">
      <ClubFormFields
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
  import ClubFormFields from '@/components/ClubFormFields.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { ClubRequest } from '@/models/api'
  import { routes } from '@/router/routes'

  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const values = ref<Partial<ClubRequest>>({})

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.clubs.createClub(values.value as ClubRequest)

    showToast('Club Created!', 'success')
    router.push(routes.clubs())
  }

  watchEffect(() => {
    const backEnabled = window.history.length > 1

    set({
      left: backEnabled ? { title: 'Cancel', showChevron: false, callback: router.back } : { title: 'Clubs', route: routes.clubs() },
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