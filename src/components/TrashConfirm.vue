<template>
  <p-pop-over class="trash-confirm" auto-close>
    <template #target="{ open }">
      <div class="trash-confirm__target">
        <slot :open="open">
          <p-button size="sm" danger rounded icon="TrashIcon" @click="open" />
        </slot>
      </div>
    </template>
    <template #default="{ close }">
      <p-overflow-menu>
        <div class="trash-confirm__message">
          Are you sure?
        </div>
        <p-overflow-menu-item class="trash-confirm__yes" label="Yes" @click="confirm(close)" />
        <p-overflow-menu-item class="trash-confirm__no" label="No" @click="close" />
      </p-overflow-menu>
    </template>
  </p-pop-over>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{
    (event: 'confirmed'): void,
  }>()

  function confirm(close: () => void): void {
    emit('confirmed')
    close()
  }
</script>

<style>
.trash-confirm__message {
  color: var(--gray-400);
  padding: var(--space-md);
}

.trash-confirm__yes {
  color: var(--red-400);
}
</style>