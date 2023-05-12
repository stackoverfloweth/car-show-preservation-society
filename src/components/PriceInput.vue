<template>
  <p-number-input v-model="price" class="price-input" prepend="$">
    <template v-if="isFree && !hideFree" #append>
      <span class="price-input__append">
        Free
      </span>
    </template>
  </p-number-input>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue: number | null | undefined,
    hideFree?: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: number | null): void,
  }>()

  const price = computed({
    get() {
      return props.modelValue ?? null
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const isFree = computed(() => (price.value ?? 0) === 0)
</script>

<style>
.price-input__append {
  border-radius: var(--rounded);
  padding: var(--space-xxs) var(--space-xs);
  margin-right: var(--space-sm);
  background-color: var(--green-700);
}
</style>