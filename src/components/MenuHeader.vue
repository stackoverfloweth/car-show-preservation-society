<template>
  <div class="menu-header">
    <div class="menu-header__logo">
      <a href="/">
        <img class="menu-header__logo-image" src="/vite.svg">
      </a>
    </div>
    <div class="menu-header__links">
      <p-icon icon="BellIcon" />
      <p-pop-over :placement="placement" auto-close>
        <template #target="{ toggle }">
          <p-icon icon="MenuIcon" @click="toggle" />
        </template>
        <template #default="{ close }">
          <p-overflow-menu class="menu-header__menu" @click="close">
            <p-overflow-menu-item label="Profile" />
            <p-overflow-menu-item label="Garage" />
            <p-overflow-menu-item label="Messages" />
            <p-overflow-menu-item label="Clubs" :to="routes.clubs()" />
            <p-overflow-menu-item label="Events" />
          </p-overflow-menu>
        </template>
      </p-pop-over>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PositionMethod } from '@prefecthq/prefect-design'
  import { routes } from '@/router/routes'

  const placement: PositionMethod = (target, content, container) => {
    const top = target.top + target.height + 4
    const left = container.right - content.width - 4

    return { top, left }
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

.menu-header__menu {
    border: 1px solid var(--blue-200);
}
</style>
