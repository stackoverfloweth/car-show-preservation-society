<template>
  <p-form class="club-editor-page" @submit="submit">
    <div class="club-editor-page__general">
      <p-bread-crumbs :crumbs="[{ text: 'General' }]" />
      <ClubFormFields v-if="values" v-model:values="values" />
    </div>

    <div class="club-editor-page__gallery">
      <p-bread-crumbs :crumbs="[{ text: 'Gallery' }]" />
      <ClubGalleryForm v-if="values" :club-id="clubId" />
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
  import { useApi, useNavigation } from '@/compositions'
  import { IClub } from '@/models'
  import { routes } from '@/router/routes'

  const clubId = useRouteParam('clubId')
  const api = useApi()
  const router = useRouter()
  const { validate, pending } = useValidationObserver()
  const { set } = useNavigation()

  const clubSubscription = useSubscription(api.clubs.getClub, [clubId])
  clubSubscription.promise().then(({ response }) => {
    if (response) {
      values.value = response
    }
  })

  const values = ref<IClub | undefined>()

  async function submit(): Promise<void> {
    const isValid = await validate()

    if (!isValid || !values.value) {
      return
    }

    await api.clubs.updateClub(values.value)

    showToast('Saved!', 'success')
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