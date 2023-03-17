<template>
  <div class="club-form-fields">
    <p-label label="Name" :message="nameError" :state="nameState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="name" :state="nameState" />
      </template>
    </p-label>

    <p-label label="Description" :message="descriptionError" :state="descriptionState">
      <template #default="{ id }">
        <p-textarea :id="id" v-model="description" rows="6" :state="descriptionState" />
      </template>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
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

  const name = usePatchRef(values, 'name')
  const description = usePatchRef(values, 'description')

  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
</script>

<style>
.club-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>