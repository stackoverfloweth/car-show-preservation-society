<template>
  <component
    :is="component"
    :href="advertisement.href"
    target="_blank"
    class="sponsor-card"
    :class="classes"
  >
    <template v-if="advertisement.image">
      <SizedImage class="sponsor-card__image" :image="advertisement.image" />
    </template>

    <template v-if="advertisement.title || advertisement.description">
      <div class="sponsor-card__content">
        <div class="sponsor-card__title">
          {{ advertisement.title }}
        </div>
        <div class="sponsor-card__description">
          {{ advertisement.description }}
        </div>
      </div>
    </template>
  </component>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { defaultSize } from '@/models/advertisement'
  import { AdvertisementRequest } from '@/models/api'

  const props = defineProps<{
    advertisement: AdvertisementRequest,
    disabled?: boolean,
  }>()

  const component = computed(() => props.advertisement.href && !props.disabled ? 'a' : 'div')
  const height = computed(() => props.advertisement.size?.height ?? defaultSize.height)
  const width = computed(() => props.advertisement.size?.width ?? defaultSize.width)
  const isClickable = computed(() => !!props.advertisement.href)

  const classes = computed(() => ({
    'sponsor-card--clickable': !props.disabled && isClickable.value,
    'sponsor-card--disabled': props.disabled,
  }))
</script>

<style>
.sponsor-card {
  position: relative;
  display: block;
  color: var(--slate-900);
  background-color: var(--slate-100);
  border-radius: var(--rounded);
  height: v-bind(height);
  width: v-bind(width);
  overflow: hidden;
  border: 2px solid transparent;
}

.sponsor-card--clickable:hover {
  border: 2px solid var(--blue-500);
}

.sponsor-card--clickable:hover .sponsor-card__title,
.sponsor-card--clickable:hover .sponsor-card__description {
  color: var(--blue-500);
}

.sponsor-card--clickable:hover .sponsor-card__content {
  background-color: rgba(255, 255, 255, 0.65)
}

.sponsor-card__content,
.sponsor-card__image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.sponsor-card__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-5);
  background-color: rgba(255, 255, 255, 0.5);
}

.sponsor-card__image {
  border-radius: 0;
}

.sponsor-card__title {
  font-weight: bold;
}
</style>