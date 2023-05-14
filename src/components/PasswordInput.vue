<template>
  <p-text-input v-model="modelValue" :type="visible ? 'text' : 'password'" class="password-input">
    <template #append>
      <p-button class="password-input__toggle" inset size="sm" :icon="visible ? 'EyeSlashIcon' : 'EyeIcon'" @click="visible = !visible" />
    </template>
  </p-text-input>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'

  const props = defineProps<{
    modelValue: string | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: string | null): void,
  }>()

  const visible = ref(false)

  const modelValue = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })
</script>

<style>
.password-input__toggle {
  margin-right: var(--space-xxxs);
}
</style>