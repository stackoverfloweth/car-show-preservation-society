<template>
  <div class="vehicle-photo-gallery">
    <PhotoGallery :images="images" :has-more="hasMore" @load-more="loadMore" />
  </div>
</template>

<script lang="ts" setup>
  import { toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi, useImageResultsSubscription } from '@/compositions'

  const props = defineProps<{
    vehicleId: string,
  }>()

  const api = useApi()
  const { vehicleId } = toRefs(props)

  const { images, hasMore, loadMore } = useImageResultsSubscription(api.vehicleImages.getVehicleImages, vehicleId)
</script>