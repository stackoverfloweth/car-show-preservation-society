<template>
  <div class="auth-request-recovery-form-fields">
    <p-label label="Email Address" :message="emailAddressError" :state="emailAddressState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="emailAddress" :state="emailAddressState" />
      </template>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { RecoveryRequest } from '@/models/api'
  import { stringHasValue } from '@/services/validation'

  const props = defineProps<{
    values: Partial<RecoveryRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<RecoveryRequest>): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const emailAddress = usePatchRef(values, 'emailAddress')

  const { error: emailAddressError, state: emailAddressState } = useValidation(emailAddress, 'EmailAddress', [stringHasValue])
</script>

<style>
.auth-request-recovery-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>