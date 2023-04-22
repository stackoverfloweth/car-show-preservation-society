<template>
  <div v-if="shouldShowHeader" class="navigation-header">
    <NavigationHeaderItem v-bind="left" class="navigation-header__left">
      <template v-if="left.showChevron ?? true">
        <p-icon icon="ChevronLeftIcon" />
      </template>

      {{ left.title }}
    </NavigationHeaderItem>
    <NavigationHeaderItem v-bind="center" class="navigation-header__title" />
    <NavigationHeaderItem v-bind="right" class="navigation-header__right">
      {{ right.title }}

      <template v-if="right.showChevron ?? false">
        <p-icon icon="ChevronRightIcon" />
      </template>
    </NavigationHeaderItem>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import NavigationHeaderItem from '@/components/NavigationHeaderItem.vue'
  import { NavigationRecord } from '@/compositions'

  const props = defineProps<{
    left: NavigationRecord,
    center: NavigationRecord,
    right: NavigationRecord,
  }>()

  const shouldShowHeader = computed(() => !!props.left.title || !!props.center.title || !!props.right.title)
</script>

<style>
.navigation-header {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    background-color: var(--slate-800);
    padding: var(--space-2) var(--space-3);
}

.navigation-header__left {
  display: flex;
  justify-content: start;
}

.navigation-header__title {
  display: flex;
  justify-content: center;
  font-weight: bold;
  text-align: center;
}

.navigation-header__right {
  display: flex;
  justify-content: end;
}
</style>