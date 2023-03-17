<template>
  <div class="event-form-fields">
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
  import { useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    name: string | undefined,
    description: string | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:name' | 'update:description', value: string | undefined): void,
  }>()

  const name = computed({
    get() {
      return props.name
    },
    set(value) {
      emit('update:name', value)
    },
  })


  const description = computed({
    get() {
      return props.description
    },
    set(value) {
      emit('update:description', value)
    },
  })

  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [stringHasValue])
</script>

<style>
.event-form-fields {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
}
</style>