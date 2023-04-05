<template>
  <div class="sized-image" :class="classes" :style="styles" :aria-label="image?.caption">
    <template v-if="image">
      <img :alt="image.caption" class="sized-image__img">
    </template>
    <template v-else>
      <p-icon class="sized-image__icon" icon="PhotographIcon" size="large" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Image } from '@/models'

  const props = defineProps<{
    image?: Image,
    rounded?: boolean,
  }>()

  const position = computed(() => props.image?.position ?? 'center')
  const size = computed(() => props.image?.size ?? 'contain')

  const styles = computed(() => ({
    backgroundImage: `url(${props.image?.src})`,
  }))

  const classes = computed(() => ({
    'sized-image--rounded': props.rounded,
    'sized-image--empty': props.image === undefined,
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

.sized-image--rounded {
  border-radius: 100%;
}

.sized-image--empty {
  background-color: var(--slate-700);
}

.sized-image__img {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  top: auto;
  overflow: hidden;
}

.sized-image__icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>