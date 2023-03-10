<template>
  <div class="menu-header">
    <div class="menu-header__logo">
      <a href="/">
        <img class="menu-header__logo-image" src="/vite.svg">
      </a>
    </div>
    <div class="menu-header__links">
      <a href="/">Home</a>
      <p-icon icon="BellIcon" @click="test" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const { push } = useNavigation()

  function test(): void {
    push(routes.home(), 'Something')
  }
</script>

<style>
.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--slate-700);
    padding: var(--space-4);
}

.menu-header__links {
    display: flex;
    gap: var(--space-4);
}
</style>