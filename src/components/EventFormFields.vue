<template>
  <div class="event-form-fields">
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
  import ClubSelect from '@/components/ClubSelect.vue'
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

  const { error: clubError, state: clubState } = useValidation(clubId, 'Club', [stringHasValue])
  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
</script>

<style>
.event-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>