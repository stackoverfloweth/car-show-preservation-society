<template>
  <div class="sized-image" :style="styles">
  &nbsp;
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = defineProps<{
    src: string,
  }>()

  const styles = computed(() => ({
    'backgroundImage': `url(${props.src})`,
  }))
</script>

<style>
.sized-image {
  background-color: var(--slate-100);
  border-radius: var(--rounded);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>