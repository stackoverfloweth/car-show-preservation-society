<template>
  <div class="vehicle-photo-gallery">
    <PhotoGallery :images="vehicleImages" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    vehicleId: string,
  }>()

  const api = useApi()
  const { vehicleId } = toRefs(props)

  const vehicleImagesSubscription = useSubscription(api.vehicles.getVehicleImages, [vehicleId])
  const vehicleImages = computed(() => vehicleImagesSubscription.response ?? [])
</script>