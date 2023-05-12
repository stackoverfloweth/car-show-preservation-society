<template>
  <div class="photo-gallery">
    <template v-for="image in images" :key="image.imageId">
      <SizedImage role="button" class="photo-gallery__image" :image="image" @click="fullScreenImage = image" />
    </template>
    <template v-if="hasMore">
      <div class="photo-gallery__actions">
        <p-button inset @click="loadMore">
          Load More
        </p-button>
      </div>
    </template>
    <p-modal v-model:show-modal="showModal" :title="fullScreenImage?.caption" class="photo-gallery__full-screen-modal" auto-close>
      <SizedImage :image="fullScreenImage" class="photo-gallery__full-screen-image" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Image } from '@/models'

  defineProps<{
    images: Image[],
    hasMore?: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'load-more'): void,
  }>()

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

  function loadMore(): void {
    emit('load-more')
  }
</script>

<style>
.photo-gallery {
  --gallery-columns: 5;
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(var(--gallery-columns), minmax(0, 1fr));
}

.photo-gallery__image {
  padding-top: 50%;
}

.photo-gallery__actions {
  grid-column: 1/-1;
  display: flex;
  justify-content: center;
}

.photo-gallery__full-screen-modal .p-modal__header {
  border: 0;
}

.photo-gallery__full-screen-modal .p-modal__card {
  width: 100%;
  max-width: unset;
}

.photo-gallery__full-screen-modal .p-modal__body {
  padding: var(--space-sm);
}

.photo-gallery__full-screen-image {
  padding-top: 50%;
  width: 100%;
}

@media(max-width: 1280px){
  .photo-gallery {
    --gallery-columns: 4;
  }
}

@media(max-width: 1024px){
  .photo-gallery {
    --gallery-columns: 3;
  }
}

@media(max-width: 768px){
  .photo-gallery {
    --gallery-columns: 2;
  }
}
</style>