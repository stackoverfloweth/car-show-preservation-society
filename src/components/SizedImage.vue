<template>
  <div class="sized-image" :class="classes" :style="styles" :aria-label="caption">
    <template v-if="src">
      <img :alt="caption" class="sized-image__img">
    </template>
    <template v-else>
      <p-icon class="sized-image__icon" icon="PhotoIcon" size="large" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Image } from '@/models'

  const props = defineProps<{
    image?: Image | { src: string },
    rounded?: boolean,
  }>()

  const position = computed(() => props.image && 'position' in props.image && !!props.image.position ? props.image.position : 'center')
  const size = computed(() => props.image && 'size' in props.image && !!props.image.size ? props.image.size : 'cover')
  const caption = computed(() => props.image && 'caption' in props.image ? props.image.caption : undefined)
  const src = computed(() => props.image?.src)

  const styles = computed(() => ({
    backgroundImage: `url(${src.value})`,
  }))

  const classes = computed(() => ({
    'sized-image--rounded': props.rounded,
    'sized-image--empty': src.value === undefined,
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