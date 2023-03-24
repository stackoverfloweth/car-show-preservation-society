<template>
  <div class="sponsors-form-fields">
    <div class="sponsors-form-fields__top-left">
      <p-form @submit="addEventAdvertisement">
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

        <div class="event-form-fields__image-upload">
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
      </p-form>
    </div>

    <div class="sponsors-form-fields__top-right">
      <p-label label="Size" :state="sizeState" :message="sizeError">
        <SponsorSizeSelect v-model="size" />
      </p-label>

      <div class="sponsors-form-fields__actions">
        <p-button type="submit" :loading="pending">
          Add Sponsor
        </p-button>
      </div>
    </div>

    <div class="sponsors-form-fields__bottom">
      <template v-if="!isPristine">
        <div class="sponsors-form-fields__sponsor-card">
          <div class="sponsors-form-fields__sponsor-card-actions">
            <TrashConfirm @confirmed="clearNewAdvertisementValues" />
          </div>
          <SponsorCard class="sponsors-form-fields__sponsor-card-preview" :advertisement="newAdvertisementValues" />
        </div>
      </template>

      <template v-for="advertisement in advertisements" :key="advertisement.advertisementId">
        <div class="sponsors-form-fields__sponsor-card">
          <div class="sponsors-form-fields__sponsor-card-actions">
            <TrashConfirm @confirmed="removeAdvertisement(advertisement)" />
          </div>
          <SponsorCard :advertisement="advertisement" disabled />
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useIsSame, usePatchRef, useSubscription, useValidation, useValidationObserver } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import SponsorCard from '@/components/SponsorCard.vue'
  import SponsorSizeSelect from '@/components/SponsorSizeSelect.vue'
  import TrashConfirm from '@/components/TrashConfirm.vue'
  import { useApi } from '@/compositions'
  import { Advertisement, Event } from '@/models'
  import { AdvertisementRequest } from '@/models/api'

  const props = defineProps<{
    event: Event,
  }>()

  const emit = defineEmits<{
    (event: 'update:event', value: Event): void,
  }>()

  const event = computed({
    get() {
      return props.event
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

  const isPristine = useIsSame(newAdvertisementValues, ref<AdvertisementRequest>({}))

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

  async function addEventAdvertisement(): Promise<void> {
    const isValid = await validate()

    if (!isValid) {
      return
    }

    await api.advertisements.createAdvertisement(newAdvertisementValues.value)

    advertisementsSubscription.refresh()
  }

  async function removeAdvertisement(advertisement: Advertisement): Promise<void> {
    await api.advertisements.deleteAdvertisement(advertisement.advertisementId)

    advertisementsSubscription.refresh()
  }

  function clearNewAdvertisementValues(): void {
    newAdvertisementValues.value = {}
  }
</script>

<style>
.sponsors-form-fields {
  display: grid;
  grid-template-areas:
  'top-left top-right top-right'
  'bottom bottom bottom';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-5);
}

.sponsors-form-fields__top-left{
  grid-area: top-left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.sponsors-form-fields__top-right {
  grid-area: top-right;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.sponsors-form-fields__bottom {
  grid-area: bottom;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: var(--space-4);
  row-gap: var(--space-4);
}

.sponsors-form-fields__sponsor-card {
  position: relative;
}

.sponsors-form-fields__sponsor-card-preview::after {
  content: "preview";
  border-radius: var(--rounded);
  margin: var(--space-3);
  text-align: center;
  display: block;
  color: var(--blue-800);
}

.sponsors-form-fields__sponsor-card-actions {
  position: absolute;
  display: flex;
  align-items: start;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  z-index: var(--z-front);
}

@media(max-width: 768px){
  .sponsors-form-fields {
    grid-template-areas:
    'top-left'
    'top-right'
    'bottom';
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>