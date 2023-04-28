<template>
  <div class="event-photo-gallery">
    <PhotoGallery :images="images" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi, useImageResultsSubscription } from '@/compositions'

  const props = defineProps<{
    eventId: string,
  }>()

  const api = useApi()
  const { eventId } = toRefs(props)

  const { images, hasMore, loadMore } = useImageResultsSubscription(api.eventImages.getEventImages, eventId)
</script>