<template>
  <div class="club-photo-gallery">
    <PhotoGallery :images="clubImages" />
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, toRefs } from 'vue'
  import PhotoGallery from '@/components/PhotoGallery.vue'
  import { useApi } from '@/compositions'

  const props = defineProps<{
    clubId: string,
  }>()

  const api = useApi()
  const { clubId } = toRefs(props)

  const clubImagesSubscription = useSubscription(api.clubs.getClubImages, [clubId])
  const clubImages = computed(() => clubImagesSubscription.response ?? [])
</script>