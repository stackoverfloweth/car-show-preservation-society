<template>
  <div class="vehicle-gallery-form">
    <div class="vehicle-gallery-form__left">
      <div class="vehicle-gallery-form__image-upload">
        <p-label label="Add Photo" :message="newImageError" :state="newImageState" />
        <ImageUpload v-model:image="newImage" />
      </div>
    </div>

    <div class="vehicle-gallery-form__right">
      <template v-for="image in images" :key="image.id">
        <div class="vehicle-gallery-form__gallery-item">
          <div class="vehicle-gallery-form__gallery-item-actions">
            <TrashConfirm @confirmed="deleteImage(image)" />
          </div>
          <SizedImage :image="image" class="vehicle-gallery-form__gallery-item-image" />
        </div>
      </template>
      <template v-if="hasMore">
        <div class="vehicle-gallery-form__load-more">
          <p-button inset @click="loadMore">
            Load More
          </p-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { ref, toRefs } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { useApi, useImageResultsSubscription } from '@/compositions'
  import { Image } from '@/models'
  import { ImageRequest } from '@/models/api'

  const props = defineProps<{
    vehicleId: string,
  }>()

  const { vehicleId } = toRefs(props)
  const newImage = ref<ImageRequest>({})
  const api = useApi()
  const { validate, pending } = useValidationObserver()

  const { error: newImageError, state: newImageState } = useValidation(newImage, 'Image', [])

  const { images, hasMore, loadMore } = useImageResultsSubscription(api.vehicles.getVehicleImages, vehicleId)

  async function createImage(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.vehicles.createVehicleImage(newImage.value)

    showToast('Sponsor Added!', 'success')
    clearNewImage()
  }

  async function deleteImage(image: Image): Promise<void> {
    await api.vehicles.deleteVehicleImage(image.imageId)
  }

  function clearNewImage(): void {
    newImage.value = {}
  }
</script>

<style>
.vehicle-gallery-form {
  display: grid;
  grid-template-areas:
    'left right right';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.vehicle-gallery-form__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.vehicle-gallery-form__right {
  grid-area: right;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.vehicle-gallery-form__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

.vehicle-gallery-form__gallery-item {
  position: relative;
}

.vehicle-gallery-form__gallery-item-actions {
  position: absolute;
  display: flex;
  align-items: start;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: var(--z-front);
}

.vehicle-gallery-form__gallery-item-image {
  padding-top: 50%;
  width: 100%;
}

.vehicle-gallery-form__load-more {
  display: flex;
  justify-content: center;
  grid-column: 1/-1;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .vehicle-gallery-form {
    display: grid;
    grid-template-areas:
      'left'
      'right';
    grid-template-columns: minmax(0, 1fr);
  }

  .vehicle-gallery-form__load-more {
    flex-direction: column;
  }
}
</style>