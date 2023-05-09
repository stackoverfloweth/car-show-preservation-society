<template>
  <div class="club-photo-gallery">
    <template v-if="images.length === 0">
      <p-button :to="routes.clubEditor(clubId)">
        Add Photos
      </p-button>
    </template>
    <PhotoGallery :images="images" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi, useImageResultsSubscription } from '@/compositions'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    clubId: string,
  }>()

  const api = useApi()
  const { clubId } = toRefs(props)

  const { images, hasMore, loadMore } = useImageResultsSubscription(api.clubImages.getClubImages, clubId)
</script>