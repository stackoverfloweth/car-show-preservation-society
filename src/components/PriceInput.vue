<template>
  <p-number-input v-model="price" class="price-input" prepend="$">
    <template #append>
      <p-button class="price-input__append" size="sm" flat :class="classes" @click="price = 0">
        Free
      </p-button>
    </template>
  </p-number-input>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue: number | null | undefined,
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

  const classes = computed(() => ({
    'price-input__append--free': price.value === 0,
  }))
</script>

<style>
.price-input {
  overflow: hidden;
}

.price-input__append {
  border-radius: 0;
  align-self: stretch;
}

.price-input__append--free:hover {
  background-color: var(--green-800) !important;
}

.price-input__append--free {
  background-color: var(--green-700);
}
</style>