<template>
  <div v-if="left || right" class="navigation-header">
    <div class="navigation-header__left">
      <template v-if="left">
        <p-link class="navigation-header__link" :to="left.route">
          <template v-if="left.showChevron ?? true">
            <p-icon icon="ChevronLeftIcon" />
          </template>
          {{ left.name }}
        </p-link>
      </template>
    </div>
    <div class="navigation-header__title">
      {{ title }}
    </div>
    <div class="navigation-header__right">
      <template v-if="right">
        <p-link class="navigation-header__link" :to="right.route">
          {{ right.name }}
          <template v-if="right.showChevron ?? false">
            <p-icon icon="ChevronLeftIcon" />
          </template>
        </p-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useNavigation } from '@/compositions'

  const { left, title, right } = useNavigation()
</script>

<style>
.navigation-header {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(3, 1fr);
    background-color: var(--slate-800);
    padding: var(--space-4) var(--space-3);
}

.navigation-header__link {
    display: flex;
    align-items: center;
    gap: var(--space-1);
}

.navigation-header__left {
  display: flex;
  justify-content: start;
}

.navigation-header__title {
  display: flex;
  justify-content: center;
  font-weight: bold;
}

.navigation-header__right {
  display: flex;
  justify-content: end;
}
</style>