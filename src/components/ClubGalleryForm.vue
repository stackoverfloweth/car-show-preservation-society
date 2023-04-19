<template>
  <div class="club-gallery-form">
    <div class="club-gallery-form__left">
      <div class="club-gallery-form__image-upload">
        <p-label label="Add Photo" :message="newImageError" :state="newImageState" />
        <ImageUpload v-model:image="newImage" :state="newImageState" />
      </div>
    </div>

    <div class="club-gallery-form__right">
      <template v-for="image in clubImages" :key="image.id">
        <div class="club-gallery-form__gallery-item">
          <div class="club-gallery-form__gallery-item-actions">
            <TrashConfirm @confirmed="deleteImage(image)" />
          </div>
          <SizedImage :image="image" class="club-gallery-form__gallery-item-image" />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref, toRefs } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { useApi } from '@/compositions'
  import { Image } from '@/models'
  import { ImageRequest } from '@/models/api'

  const props = defineProps<{
    clubId: string,
  }>()

  const { clubId } = toRefs(props)
  const newImage = ref<ImageRequest>({})
  const api = useApi()
  const { validate, pending } = useValidationObserver()

  const { error: newImageError, state: newImageState } = useValidation(newImage, 'Image', [])

  const clubImagesSubscription = useSubscription(api.clubs.getClubImages, [clubId])
  const clubImages = computed(() => clubImagesSubscription.response ?? [])

  async function createImage(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.clubs.createClubImage(newImage.value)

    showToast('Sponsor Added!', 'success')
    clearNewImage()

    clubImagesSubscription.refresh()
  }

  async function deleteImage(image: Image): Promise<void> {
    await api.clubs.deleteClubImage(image.imageId)

    clubImagesSubscription.refresh()
  }

  function clearNewImage(): void {
    newImage.value = {}
  }
</script>

<style>
.club-gallery-form {
  display: grid;
  grid-template-areas:
    'left right right';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.club-gallery-form__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-gallery-form__right {
  grid-area: right;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.club-gallery-form__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

.club-gallery-form__gallery-item {
  position: relative;
}

.club-gallery-form__gallery-item-actions {
  position: absolute;
  display: flex;
  align-items: start;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: var(--z-front);
}

.club-gallery-form__gallery-item-image {
  padding-top: 50%;
  width: 100%;
}

@media(max-width: 768px){
  .club-gallery-form {
    display: grid;
    grid-template-areas:
      'left'
      'right';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>