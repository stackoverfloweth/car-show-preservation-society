<template>
  <div class="registrations-list">
    <template v-for="registration in registrations" :key="registration.registrationId">
      <RegistrationListItem class="registration-list__registration" :class="classes" :registration="registration" @click="selected = registration" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import RegistrationListItem from '@/components/RegistrationsListItem.vue'
  import { Registration } from '@/models'

  const props = defineProps<{
    registrations: Registration[],
    selected?: Registration | null | undefined,
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: Registration | null): void,
  }>()

  const selected = computed({
    get() {
      return props.selected ?? null
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  const classes = computed(() => ({
    'registration-list__registration--selectable': props.selected !== undefined,
  }))
</script>

<style>
.registrations-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.registration-list__registration--selectable {
  cursor: pointer;
}

.registration-list__registration--selectable:hover {
  background-color: var(--slate-600);
}
</style>