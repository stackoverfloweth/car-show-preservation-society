<template>
  <div class="club-photo-gallery">
    <PhotoGallery :images="images" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi, useImageResultsSubscription } from '@/compositions'

  const props = defineProps<{
    clubId: string,
  }>()

  const api = useApi()
  const { clubId } = toRefs(props)

  const { images, hasMore, loadMore } = useImageResultsSubscription(api.clubImages.getClubImages, clubId)
</script>