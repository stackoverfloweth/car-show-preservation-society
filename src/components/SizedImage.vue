<template>
  <div class="sized-image" :style="styles" />
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
</style>