<template>
  <div class="photo-gallery">
    <template v-for="image in images" :key="image.imageId">
      <SizedImage role="button" class="photo-gallery__image" :image="image" @click="fullScreenImage = image" />
    </template>
    <p-modal v-model:show-modal="showModal" class="photo-gallery__full-screen-modal" auto-close>
      <SizedImage :image="fullScreenImage" class="photo-gallery__full-screen-image" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Image } from '@/models'

  defineProps<{ images: Image[] }>()

  const fullScreenImage = ref<Image>()
  const showModal = computed({
    get() {
      return fullScreenImage.value !== undefined
    },
    set(value) {
      if (!value) {
        fullScreenImage.value = undefined
      }
    },
  })
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

.photo-gallery__full-screen-modal .p-modal__card {
  width: 100%;
  max-width: unset;
}

.photo-gallery__full-screen-modal .p-modal__body {
  padding: 0;
}

.photo-gallery__full-screen-image {
  padding-top: 50%;
  width: 100%;
}
</style>