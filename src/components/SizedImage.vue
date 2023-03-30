<template>
  <div class="sized-image" :style="styles" :aria-label="image.caption">
    <img :alt="image.caption" class="sized-image__img">
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Image } from '@/models'

  const props = defineProps<{
    image: Image,
  }>()

  const position = computed(() => props.image.position ?? 'center')
  const size = computed(() => props.image.size ?? 'contain')

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
  background-position: v-bind(position);
}

.sized-image__img {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  top: auto;
  overflow: hidden;
}
</style>