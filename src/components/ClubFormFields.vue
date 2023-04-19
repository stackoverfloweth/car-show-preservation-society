<template>
  <div class="club-form-fields">
    <div class="club-form-fields__column">
      <p-label label="Name" :message="nameError" :state="nameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="name" :state="nameState" />
        </template>
      </p-label>

      <div class="club-form-fields__image-upload">
        <p-label label="Club Logo" :message="clubLogoError" :state="clubLogoState" />
        <ImageUpload v-model:image="clubLogo" :state="clubLogoState" />
      </div>

      <p-label label="Open to the Public">
        <template #description>
          You can always invite members to a club, even if it's private. By making this club public, you're allowing other users to join without being explicitly invited by a club admin.
        </template>
        <template #default="{ id }">
          <p-toggle :id="id" v-model="openToPublic" />
        </template>
      </p-label>

      <template v-if="openToPublic">
        <p-label label="Requests Must Be Reviewed">
          <template #description>
            When another wants to join this club, will you want a club admin to have to explicitly approve the request?
          </template>
          <template #default="{ id }">
            <p-toggle :id="id" v-model="joinableByApplication" />
          </template>
        </p-label>
      </template>
    </div>

    <div class="club-form-fields__column">
      <p-label label="Description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" rows="6" :state="descriptionState" />
        </template>
      </p-label>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed, ref, watch } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import { ClubRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: ClubRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: ClubRequest): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const openToPublic = ref((values.value.joinableByAnyone ?? false) || (values.value.joinableByApplication ?? false))

  const name = usePatchRef(values, 'name')
  const description = usePatchRef(values, 'description')
  const joinableByAnyone = usePatchRef(values, 'joinableByAnyone')
  const joinableByApplication = usePatchRef(values, 'joinableByApplication')
  const clubLogo = usePatchRef(values, 'clubLogo')

  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [])
  const { error: clubLogoError, state: clubLogoState } = useValidation(clubLogo, 'Club Logo', [])

  watch(openToPublic, value => {
    joinableByAnyone.value = value

    if (!value) {
      joinableByApplication.value = false
    }
  })
</script>

<style>
.club-form-fields {
  display: grid;
  grid-template-columns: minmax(0, 33.33%) minmax(0, 1fr);
  column-gap: var(--space-5);
  row-gap: var(--space-4);
}

.club-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}
</style>