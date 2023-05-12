<template>
  <div class="page-header">
    <div class="page-heading__heading">
      <slot>{{ heading }}</slot>
    </div>
    <div class="page-heading__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    heading?: string,
  }>()
</script>

<style>
.page-header {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  column-gap: var(--space-md);
  align-items: center;
}

.page-heading__heading {
  font-size: var(--text-md);
  font-weight: bold;
  flex-grow: 1;
}

.page-heading__actions {
  display: flex;
  gap: var(--space-sm);
}
</style>