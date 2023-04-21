<template>
  <div class="page-header">
    <slot>{{ heading }}</slot>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    heading?: string,
  }>()
</script>

<style>
.page-header {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>