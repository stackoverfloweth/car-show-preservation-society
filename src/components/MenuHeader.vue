<template>
  <div class="menu-header">
    <div class="menu-header__logo">
      <router-link v-if="!isAlreadyHome" :to="routes.home()">
        <img class="menu-header__logo-image" width="100" src="/csps.svg">
      </router-link>
    </div>
    <div class="menu-header__links">
      <p-icon icon="BellIcon" />
      <p-pop-over :placement="placement" auto-close>
        <template #target="{ toggle }">
          <p-icon icon="Bars3Icon" @click="toggle" />
        </template>
        <template #default="{ close }">
          <p-overflow-menu class="menu-header__menu" @click="close">
            <p-overflow-menu-item label="Login" :to="routes.login()" />
            <p-overflow-menu-item label="Profile" :to="routes.profile()" />
            <p-overflow-menu-item label="Garage" :to="routes.vehicles()" />
            <p-overflow-menu-item label="Clubs" :to="routes.clubs()" />
            <p-overflow-menu-item label="Events" :to="routes.events()" />
            <p-overflow-menu-item label="Messages" disabled>
              <template #after>
                <p-tag class="menu-header__coming-soon-message" value="Coming Soon!" />
              </template>
            </p-overflow-menu-item>
          </p-overflow-menu>
        </template>
      </p-pop-over>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PositionMethod } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { NamedRoute, routes } from '@/router/routes'

  const route = useRoute()

  const placement: PositionMethod = (target, content, container) => {
    const top = target.top + target.height + 4
    const left = container.right - content.width - 4

    return { top, left }
  }

  const isAlreadyHome = computed(() => route.name as NamedRoute === 'home')
</script>

<style>
.menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--gray-700);
    padding: var(--space-md);
    height: 65px;
}

.menu-header__links {
    display: flex;
    gap: var(--space-md);
}

.menu-header__menu {
    border: 1px solid var(--blue-200);
}

.menu-header__coming-soon-message {
  color: white;
  background-color: var(--green-600) !important;
}

@media(max-width: 768px) {
  .menu-header__menu {
    position: fixed;
    top: 62px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
