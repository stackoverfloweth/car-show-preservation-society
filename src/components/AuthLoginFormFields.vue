<template>
  <div class="auth-login-form-fields">
    <p-label label="Email Address" :message="emailAddressError" :state="emailAddressState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="emailAddress" :state="emailAddressState" />
      </template>
    </p-label>

    <p-label label="Password" :message="passwordError" :state="passwordState">
      <template #default="{ id }">
        <p-text-input :id="id" v-model="password" :state="passwordState" />
      </template>
    </p-label>

    <p-label label="Remember Me">
      <template #default="{ id }">
        <p-toggle :id="id" v-model="remember" />
      </template>
    </p-label>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { LoginRequest } from '@/models/api'
  import { stringHasValue } from '@/services'

  const props = defineProps<{
    values: Partial<LoginRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<LoginRequest>): void,
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
  const remember = usePatchRef(values, 'remember')

  const { error: emailAddressError, state: emailAddressState } = useValidation(emailAddress, 'Email Address', [stringHasValue])
  const { error: passwordError, state: passwordState } = useValidation(password, 'Password', [stringHasValue])
</script>

<style>
.auth-login-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>