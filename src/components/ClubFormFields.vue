<template>
  <div class="club-form-fields">
    <div class="club-form-fields__column">
      <p-label label="Name" :message="nameError" :state="nameState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="name" :state="nameState" />
        </template>
      </p-label>

      <div class="club-form-fields__image-upload">
        <p-label label="Club Logo" :message="imageError" :state="imageState" />
        <ImageUpload v-model:image="image" />
      </div>
    </div>

    <div class="club-form-fields__column">
      <p-label label="Description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" rows="6" :state="descriptionState" />
        </template>
      </p-label>

      <div class="club-form-fields__visibility">
        <p-label label="Open to the Public">
          <template #description>
            You can always invite members to a club, even if it's private. By making this club public, you're allowing other users to join without being explicitly invited by a club admin.
          </template>
          <template #default="{ id }">
            <p-toggle :id="id" v-model="openToPublic" />
          </template>
        </p-label>

        <p-label label="Requests Must Be Reviewed">
          <template #description>
            When another wants to join this club, will you want a club admin to have to explicitly approve the request?
            <p>(only applies if club is open to the public)</p>
          </template>
          <template #default="{ id }">
            <p-toggle :id="id" v-model="joinableByApplication" />
          </template>
        </p-label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ValidationRule, useDebouncedRef, usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import { useApi } from '@/compositions'
  import { ClubRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: Partial<ClubRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<ClubRequest>): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const openToPublic = computed({
    get() {
      return (values.value.joinableByAnyone ?? false) || values.value.joinableByApplication
    },
    set(value) {
      if (value) {
        joinableByAnyone.value = true
      } else {
        values.value = {
          ...values.value,
          joinableByAnyone: false,
          joinableByApplication: false,
        }
      }
    },
  })

  const name = usePatchRef(values, 'name')
  const description = usePatchRef(values, 'description')
  const joinableByAnyone = usePatchRef(values, 'joinableByAnyone')
  const joinableByApplication = usePatchRef(values, 'joinableByApplication')
  const image = usePatchRef(values, 'image')

  const nameDebounced = useDebouncedRef(name, 750)
  const api = useApi()

  const nameIsUnique: ValidationRule<string | undefined> = async (value) => {
    if (!value) {
      return false
    }

    const valid = await api.clubs.getClubNameUnique(value)

    if (!valid) {
      return 'Club name must be unique'
    }

    return valid
  }

  const { error: nameError, state: nameState } = useValidation(nameDebounced, 'Name', [stringHasValue, nameIsUnique])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [])
  const { error: imageError, state: imageState } = useValidation(image, 'Club Logo', [])
</script>

<style>
.club-form-fields {
  display: grid;
  grid-template-columns: minmax(0, 33.33%) minmax(0, 1fr);
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.club-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.club-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

.club-form-fields__visibility {
  display: flex;
  gap: var(--space-md);
}
</style>