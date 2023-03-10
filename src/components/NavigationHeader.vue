<template>
  <div v-if="left || right" class="navigation-header">
    <div class="navigation-header__back">
      <template v-if="left">
        <p-link class="navigation-header__link" :to="left.route">
          <p-icon icon="ChevronLeftIcon" />
          {{ left.name }}
        </p-link>
      </template>
    </div>
    <div class="navigation-header__forward">
      <template v-if="right">
        <p-link class="navigation-header__link" :to="right.route">
          {{ right.name }}
        </p-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useNavigation } from '@/compositions'

  const { left, right } = useNavigation()
</script>

<style>
.navigation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--slate-800);
    padding: var(--space-3);
}

.navigation-header__link {
    display: flex;
    align-items: center;
    gap: var(--space-1);
}
</style>