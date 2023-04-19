<template>
  <div class="photo-gallery">
    <template v-for="image in images" :key="image.imageId">
      <SizedImage class="photo-gallery__image" :image="image" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Image } from '@/models'

  defineProps<{ images: Image[] }>()
</script>

<style>
.photo-gallery {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.photo-gallery__image {
  padding-top: 50%;
}
</style>