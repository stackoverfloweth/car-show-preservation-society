<template>
  <div class="result-place" :class="classes.parent">
    <p class="result-place__number">
      <span>{{ place }}</span>
      <sup class="result-place__ordinal">{{ getOrdinal(place) }}</sup>
    </p>
    <component :is="trophy" class="result-place__trophy" :class="classes.trophy" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import trophy from '@/icons/trophy.svg'
  import { getOrdinal } from '@/utilities'

  const props = defineProps<{
    place: number,
  }>()

  const classes = computed(() => ({
    parent: [`result-place--place-${props.place}`],
    trophy: [`result-place__trophy--place-${props.place}`],
  }))
</script>

<style>
.result-place {
  position: relative;
  display: flex;
  justify-content: center;
  width: 60px;
  padding: var(--space-2);
  text-align: center;
}

.result-place--place-1 {
  color: var(--yellow-400);
}

.result-place--place-2 {
  color: var(--zinc-400);
}

.result-place--place-3 {
  color: var(--orange-700);
}

.result-place__trophy--place-1,
.result-place__trophy--place-2,
.result-place__trophy--place-3{
  display: unset !important;
}

.result-place__trophy {
  display: none;
  width: 60px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.result-place__number {
  font-size: 2rem;
}

.result-place__ordinal {
  font-size: 0.7rem;
  vertical-align: .7em;
}
</style>