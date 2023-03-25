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
      <p-label label="Name" :message="nameError" :state="nameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="name" :state="nameState" />
        </template>
      </p-label>

      <p-label label="Club" :message="clubError" :state="clubState">
        <template #default="{ id }">
          <ClubSelect :id="id" v-model:clubId="clubId" :state="clubState" />
        </template>
      </p-label>

      <p-label label="Primary Contact" :message="contactUserIdError" :state="contactUserIdState">
        <template v-if="!clubId" #description>
          First select Club to fetch contacts list.
        </template>
        <template #default="{ id }">
          <ContactSelect :id="id" v-model:userId="contactUserId" :disabled="!clubId" :club-id="clubId" :state="contactUserIdState" />
        </template>
      </p-label>

      <div class="event-form-fields__location">
        <p-label label="Event Location" :message="locationError" :state="locationState" />
        <LocationInput v-model:location="location" :state="locationState" />
      </div>

      <div class="event-form-fields__image-upload">
        <p-label label="Event Image" :message="eventLogoError" :state="eventLogoState" />
        <ImageUpload v-model:image="eventLogo" :state="eventLogoState" />
      </div>
    </div>

    <div class="event-form-fields__middle">
      <p-label label="Description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" rows="8" :state="descriptionState" />
        </template>
      </p-label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubSelect from '@/components/ClubSelect.vue'
  import ContactSelect from '@/components/ContactSelect.vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import LocationInput from '@/components/LocationInput.vue'
  import { EventRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    event: EventRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:event', value: EventRequest): void,
  }>()

  const event = computed({
    get() {
      return props.event
    },
    set(value) {
      emit('update:event', value)
    },
  })

  const clubId = usePatchRef(event, 'clubId')
  const contactUserId = usePatchRef(event, 'contactUserId')
  const name = usePatchRef(event, 'name')
  const description = usePatchRef(event, 'description')
  const start = usePatchRef(event, 'start')
  const end = usePatchRef(event, 'end')
  const eventLogo = usePatchRef(event, 'eventLogo')
  const location = usePatchRef(event, 'location')

  const { error: clubError, state: clubState } = useValidation(clubId, 'Club', [stringHasValue])
  const { error: contactUserIdError, state: contactUserIdState } = useValidation(contactUserId, 'Primary Contact', [stringHasValue])
  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [])
  const { error: startError, state: startState } = useValidation(start, 'Start', [])
  const { error: endError, state: endState } = useValidation(end, 'End', [])
  const { error: eventLogoError, state: eventLogoState } = useValidation(eventLogo, 'Event Logo', [])
  const { error: locationError, state: locationState } = useValidation(location, 'Location', [])
</script>

<style>
.event-form-fields {
  display: grid;
  grid-template-areas:
  'left top top'
  'left middle middle'
  'left middle middle'
  'left bottom bottom';
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-form-fields__top {
  grid-area: top;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-form-fields__left {
  grid-area: left;
  display: flex;
  flex-direction: column;
  justify-content: start;
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.event-form-fields__middle {
  grid-area: middle;
  display: grid;
  grid-template-columns: repeat(2, minmax(1fr));
  column-gap: var(--space-5);
  row-gap: var(--space-4);
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
    grid-template-columns: minmax(1fr);
  }
}
</style>