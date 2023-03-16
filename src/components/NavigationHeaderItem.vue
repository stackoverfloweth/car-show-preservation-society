<template>
  <div class="navigation-header-item">
    <component
      :is="component"
      v-if="title"
      class="navigation-header-item__link"
      :to="route"
      :disabled="disabled"
      @click="handleClick"
    >
      <template v-if="pending">
        <p-loading-icon />
      </template>

      <template v-else>
        <slot>
          {{ title }}
        </slot>
      </template>
    </component>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { RouteLocationRaw } from 'vue-router'
  import { MaybePromise } from '@/types'

  const props = defineProps<{
    title?: string,
    route?: RouteLocationRaw,
    pending?: boolean,
    disabled?: boolean,
    callback?: (() => MaybePromise<void>),
  }>()

  const component = computed(() => {
    if (!!props.route || !!props.callback) {
      return 'p-link'
    }

    return 'span'
  })

  function handleClick(): void {
    if (props.callback) {
      props.callback()
    }
  }
</script>

<style>
.navigation-header-item__link {
    display: flex;
    align-items: center;
    gap: var(--space-1);
}
</style>