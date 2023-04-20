<template>
  <div class="registration-form-fields">
    registration-form
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { RegistrationRequest } from '@/models/api'

  const props = defineProps<{
    values: RegistrationRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: RegistrationRequest): void,
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

  const { error: nameError, state: nameState } = useValidation(name, 'Name', [stringHasValue])
</script>