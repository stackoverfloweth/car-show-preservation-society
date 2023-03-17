<template>
  <div class="event-form-fields">
    <div class="event-form-fields__top">
      <p-label label="Start" :message="startError" :state="startState">
        <template #default="{ id }">
          <p-date-input :id="id" v-model="start" :state="startState" show-time clearable />
        </template>
      </p-label>

      <p-label label="End" :message="endError" :state="endState">
        <template #default="{ id }">
          <p-date-input :id="id" v-model="end" :state="endState" show-time clearable />
        </template>
      </p-label>
    </div>

    <div class="event-form-fields__left">
      <p-label label="Club" :message="clubError" :state="clubState">
        <template #default="{ id }">
          <ClubSelect :id="id" v-model:clubId="clubId" :state="clubState" />
        </template>
      </p-label>

      <p-label label="Name" :message="nameError" :state="nameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="name" :state="nameState" />
        </template>
      </p-label>

      <div class="event-form-fields__location">
        <p-label label="Event Location" :message="locationError" :state="locationState" />
        <LocationInput v-model:location="location" :state="locationState" />
      </div>

      <p-label label="Registration Price" :message="priceError" :state="priceState">
        <template #default="{ id }">
          <PriceInput :id="id" v-model="price" :state="priceState" />
        </template>
      </p-label>
    </div>

    <div class="event-form-fields__middle">
      <p-label label="Description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" rows="8" :state="descriptionState" />
        </template>
      </p-label>

      <div class="event-form-fields__image-upload">
        <p-label label="Event Image" :message="eventLogoError" :state="eventLogoState" />
        <ImageUpload v-model:image="eventLogo" :state="eventLogoState" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubSelect from '@/components/ClubSelect.vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import LocationInput from '@/components/LocationInput.vue'
  import PriceInput from '@/components/PriceInput.vue'
  import { EventRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: Partial<EventRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<EventRequest>): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const clubId = usePatchRef(values, 'clubId')
  const name = usePatchRef(values, 'name')
  const description = usePatchRef(values, 'description')
  const start = usePatchRef(values, 'start')
  const end = usePatchRef(values, 'end')
  const eventLogo = usePatchRef(values, 'eventLogo')
  const location = usePatchRef(values, 'location')
  const price = usePatchRef(values, 'priceInPennies')

  const { error: clubError, state: clubState } = useValidation(clubId, 'Club', [stringHasValue])
  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
  const { error: startError, state: startState } = useValidation(start, 'Start', [])
  const { error: endError, state: endState } = useValidation(end, 'End', [])
  const { error: eventLogoError, state: eventLogoState } = useValidation(eventLogo, 'EventLogo', [])
  const { error: locationError, state: locationState } = useValidation(location, 'Location', [])
  const { error: priceError, state: priceState } = useValidation(price, 'Price', [])
</script>

<style>
.event-form-fields {
  display: grid;
  grid-template-areas:
  'left top top'
  'left middle middle'
  'left middle middle'
  'left bottom bottom';
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.event-form-fields__top {
  grid-area: top;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.event-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: var(--space-4);
}

.event-form-fields__middle {
  grid-area: middle;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.event-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

@media(max-width: 768px){
  .event-form-fields {
    grid-template-areas:
    'left'
    'top'
    'middle'
    'bottom';
    grid-template-columns: 1fr;
  }

  .event-form-fields__middle {
    grid-template-columns: 1fr;
  }
}
</style>