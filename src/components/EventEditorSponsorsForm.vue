<template>
  <p-form @submit="createEventAdvertisement">
    <div class="event-editor-sponsors-form-fields">
      <div class="event-editor-sponsors-form-fields__left">
        <p-label label="Display Text" :state="titleState" :message="titleError">
          <template #default="{ id }">
            <p-text-input :id="id" v-model="title" />
          </template>
        </p-label>

        <p-label label="Additional Information" :message="descriptionError" :state="descriptionState">
          <template #default="{ id }">
            <p-textarea :id="id" v-model="description" rows="3" :state="descriptionState" />
          </template>
        </p-label>

        <div class="event-editor-sponsors-form-fields__image-upload">
          <p-label label="Advertisement Logo" :message="imageError" :state="imageState" />
          <ImageUpload v-model:image="image" :state="imageState" />
        </div>

        <p-label label="Advertisement Link" :state="hrefState" :message="hrefError">
          <template #description>
            Clicking on this advertisement can direct the user to the advertisements website.
          </template>
          <template #default="{ id }">
            <p-text-input :id="id" v-model="href" />
          </template>
        </p-label>
      </div>

      <div class="event-editor-sponsors-form-fields__center">
        <p-label label="Size" :state="sizeState" :message="sizeError">
          <SponsorSizeSelect v-model="size" :advertisement="newAdvertisementValues" />
        </p-label>

        <div class="event-editor-sponsors-form-fields__actions">
          <p-button inset @click="clearNewAdvertisementValues">
            Reset
          </p-button>

          <p-button type="submit" :loading="pending">
            Add Sponsor
          </p-button>
        </div>
      </div>

      <div class="event-editor-sponsors-form-fields__right">
        <template v-for="advertisement in advertisements" :key="advertisement.advertisementId">
          <div class="event-editor-sponsors-form-fields__sponsor-card">
            <div class="event-editor-sponsors-form-fields__sponsor-card-actions">
              <TrashConfirm @confirmed="deleteAdvertisement(advertisement)" />
            </div>
            <SponsorCard :advertisement="advertisement" disabled />
          </div>
        </template>
      </div>
    </div>
  </p-form>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { usePatchRef, useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import SponsorCard from '@/components/SponsorCard.vue'
  import SponsorSizeSelect from '@/components/SponsorSizeSelect.vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { useApi } from '@/compositions'
  import { Advertisement, IEvent } from '@/models'
  import { AdvertisementRequest } from '@/models/api'

  const props = defineProps<{
    event: IEvent,
  }>()

  const emit = defineEmits<{
    (event: 'update:event', value: IEvent): void,
  }>()

  const event = computed({
    get() {
      return { ...props.event }
    },
    set(value) {
      emit('update:event', value)
    },
  })

  const api = useApi()
  const { validate, pending } = useValidationObserver()
  const eventId = usePatchRef(event, 'eventId')

  const advertisementsSubscription = useSubscription(api.advertisements.getAdvertisementsForEvent, [eventId])
  const advertisements = computed(() => advertisementsSubscription.response ?? [])

  const newAdvertisementValues = ref<AdvertisementRequest>({})

  const image = usePatchRef(newAdvertisementValues, 'image')
  const title = usePatchRef(newAdvertisementValues, 'title')
  const description = usePatchRef(newAdvertisementValues, 'description')
  const href = usePatchRef(newAdvertisementValues, 'href')
  const size = usePatchRef(newAdvertisementValues, 'size')

  const { error: imageError, state: imageState } = useValidation(image, 'Image', [])
  const { error: titleError, state: titleState } = useValidation(title, 'Title', [])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [])
  const { error: hrefError, state: hrefState } = useValidation(href, 'Href', [])
  const { error: sizeError, state: sizeState } = useValidation(size, 'Size', [])

  async function createEventAdvertisement(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.advertisements.createAdvertisement(newAdvertisementValues.value)

    showToast('Sponsor Added!', 'success')
    clearNewAdvertisementValues()

    advertisementsSubscription.refresh()
  }

  async function deleteAdvertisement(advertisement: Advertisement): Promise<void> {
    await api.advertisements.deleteAdvertisement(advertisement.advertisementId)

    advertisementsSubscription.refresh()
  }

  function clearNewAdvertisementValues(): void {
    newAdvertisementValues.value = {}
  }
</script>

<style>
.event-editor-sponsors-form-fields {
  --form-cols: 3;
  display: grid;
  grid-template-areas:
  'left center right';
  grid-template-columns: repeat(var(--form-cols), minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-5);
}

.event-editor-sponsors-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-editor-sponsors-form-fields__center {
  grid-area: center;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-5);
}

.event-editor-sponsors-form-fields__right {
  grid-area: right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-editor-sponsors-form-fields__sponsor-card {
  position: relative;
}

.event-editor-sponsors-form-fields__sponsor-card-preview::after {
  content: "preview";
  border-radius: var(--rounded);
  margin: var(--space-3);
  text-align: center;
  display: block;
  color: var(--blue-800);
}

.event-editor-sponsors-form-fields__sponsor-card-actions {
  position: absolute;
  display: flex;
  align-items: start;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: var(--z-front);
}

.event-editor-sponsors-form-fields__actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
}

.event-editor-sponsors-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

@media(max-width: 1024px){
  .event-editor-sponsors-form-fields {
    grid-template-areas:
    'left right'
    'center right';
    --form-cols: 2;
  }
}

@media(max-width: 768px){
  .event-editor-sponsors-form-fields {
    grid-template-areas:
    'left'
    'center'
    'right';
    --form-cols: 1;
  }
}
</style>