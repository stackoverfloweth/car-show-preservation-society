<template>
  <div class="navigation-header-item">
    <component
      :is="component"
      v-if="title"
      :to="route"
      v-bind="componentProps"
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
      return 'p-button'
    }

    return 'span'
  })

  const componentProps = computed(() => {
    if (!!props.route || !!props.callback) {
      return {
        flat: true,
        disabled: props.disabled,
        class: 'navigation-header-item__action',
        to: props.route,
      }
    }

    return {}
  })

  function handleClick(): void {
    if (props.callback) {
      props.callback()
    }
  }
</script>

<style>
.navigation-header-item__action {
    display: flex;
    align-items: center;
    color: var(--blue-500);
    gap: var(--space-xs);
}

.navigation-header-item__action:hover {
  color: var(--blue-500);
}
</style>