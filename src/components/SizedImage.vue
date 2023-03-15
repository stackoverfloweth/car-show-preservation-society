<template>
  <div class="sized-image" :style="styles">
    <template v-if="slots.default">
      <div class="sized-image__content">
        <slot />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed, useSlots } from 'vue'

  const props = defineProps<{
    src: string,
  }>()

  const slots = useSlots()

  const styles = computed(() => ({
    backgroundImage: `url(${props.src})`,
  }))
</script>

<style>
.sized-image {
  position: relative;
  background-color: var(--slate-100);
  border-radius: var(--rounded);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.sized-image__content {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-2);
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>