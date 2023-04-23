<template>
  <p-modal v-model:showModal="showModal" title="Check In" class="check-in-modal" auto-close>
    <ul>
      <li>Show Registration Info</li>
      <li>Show if paid, what is owed, option to complete payment</li>
      <li>If event.isHappening, option to "check-in"</li>
      <li>"check-in" includes option to change vehicle/category</li>
    </ul>
  </p-modal>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    showModal: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'update:showModal', value: boolean): void,
  }>()

  const showModal = computed({
    get() {
      return props.showModal
    },
    set(value) {
      emit('update:showModal', value)
    },
  })
</script>