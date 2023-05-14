<template>
  <div class="auth-signup-form-fields">
    <p-label label="Email Address" :message="emailAddressError" :state="emailAddressState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="emailAddress" :state="emailAddressState" />
      </template>
    </p-label>

    <p-label label="Password" :message="passwordError" :state="passwordState">
      <template #default="{ id }">
        <PasswordInput :id="id" v-model="password" :state="passwordState" />
      </template>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import PasswordInput from '@/components/PasswordInput.vue'
  import { SignupRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: Partial<SignupRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<SignupRequest>): void,
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
  const password = usePatchRef(values, 'password')

  const { error: emailAddressError, state: emailAddressState } = useValidation(emailAddress, 'Email Address', [stringHasValue])
  const { error: passwordError, state: passwordState } = useValidation(password, 'Password', [stringHasValue])
</script>

<style>
.auth-signup-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>