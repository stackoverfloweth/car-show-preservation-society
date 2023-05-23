<template>
  <div class="auth-set-password-form-fields">
    <p-label label="Password" :message="passwordError" :state="passwordState">
      <template #default="{ id }">
        <PasswordInput :id="id" v-model="password" :state="passwordState" />
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
  import PasswordInput from '@/components/PasswordInput.vue'
  import { SetPasswordRequest } from '@/models/api'
  import { stringHasValue } from '@/services/validation'

  const props = defineProps<{
    values: Partial<SetPasswordRequest>,
  }>()

  const emit = defineEmits<{
    (event: 'update:values', value: Partial<SetPasswordRequest>): void,
  }>()

  const values = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const password = usePatchRef(values, 'password')
  const remember = usePatchRef(values, 'remember')

  const { error: passwordError, state: passwordState } = useValidation(password, 'Password', [stringHasValue])
</script>

<style>
.auth-set-password-form-fields {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>