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
  import { Image } from '@/models'

  const props = defineProps<{
    image: Image,
  }>()

  const slots = useSlots()

  const position = computed(() => props.image.position ?? 'center')
  const size = computed(() => props.image.size ?? 'contain')
  const backdrop = computed(() => props.image.backdrop ?? true ? 'var(--slate-100)' : 'unset')

  const styles = computed(() => ({
    backgroundImage: `url(${props.image.src})`,
  }))
</script>

<style>
.sized-image {
  position: relative;
  border-radius: var(--rounded);
  background-size: v-bind(size);
  background-repeat: no-repeat;
  background-color: v-bind(backdrop);
  background-position: v-bind(position);
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