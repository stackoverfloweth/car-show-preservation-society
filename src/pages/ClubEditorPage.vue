<template>
  <p-form class="club-editor-page" @submit="submit">
    <div class="club-editor-page__general">
      <PageHeader heading="General" />
      <ClubFormFields v-if="values" v-model:values="values" />
    </div>

    <div class="club-editor-page__gallery">
      <PageHeader heading="Gallery" />
      <ClubGalleryForm :club-id="clubId" />
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useRouteParam, useSubscription, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, watchEffect } from 'vue'
  import { useRouter } from 'vue-router'
  import ClubFormFields from '@/components/ClubFormFields.vue'
  import ClubGalleryForm from '@/components/ClubGalleryForm.vue'
  import PageHeader from '@/components/PageHeader.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { ClubRequest } from '@/models'
  import { routes } from '@/router/routes'

  const clubId = useRouteParam('clubId')
  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  clubSubscription.promise().then(({ response }) => {
    values.value = { ...response, image: undefined }
  })

  const values = ref<Partial<ClubRequest>>({})

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.clubs.updateClub(values.value as ClubRequest)

    showToast('Saved!', 'success')
    clubSubscription.refresh()
    router.push(routes.club(clubId.value))
  }

  watchEffect(() => {
    set({
      left: { title: 'Club', route: routes.club(clubId.value) },
      right: { title: 'Save', pending: pending.value, callback: submit },
    })
  })
</script>

<style>
.club-editor-page {
  padding: var(--space-4);
}
</style>