<template>
  <div class="event-create-page">
    <div v-if="menuVisible" class="event-create-page__sidebar">
      <template v-for="entry in titles" :key="entry.title">
        <p-overflow-menu-item
          :to="entry.to"
          class="event-create-page__sidebar-item"
          :class="{ 'event-create-page__sidebar-item--active': entry.to.name === route.name }"
          @click="maybeHideMenu"
        >
          {{ entry.title }}
        </p-overflow-menu-item>
      </template>
    </div>
    <div class="event-create-page__content" @click="maybeHideMenu">
      <div class="event-create-page__title-with-menu">
        <p-button size="sm" flat icon="MenuIcon" @click.stop="toggleMenu" />
        <p-bread-crumbs :crumbs="crumbs" />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Crumb, media } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { routes } from '@/router/routes'

  const route = useRoute()

  const menuVisible = ref(media.hover)

  const titles = computed(() => [
    { title: 'Event Information', to: routes.eventsCreateEvent() },
    { title: 'Judging', to: routes.eventsCreateJudging() },
    { title: 'Registration', to: routes.clubs() },
  ])

  const crumbs = computed<Crumb[]>(() => {
    const activeTitle = titles.value.find(({ to }) => to.name === route.name)

    if (!activeTitle) {
      return []
    }

    return [{ text: activeTitle.title }]
  })

  function toggleMenu(): void {
    menuVisible.value = !menuVisible.value
  }

  function maybeHideMenu(): void {
    if (!media.hover) {
      menuVisible.value = false
    }
  }
</script>

<style>
.event-create-page {
  display: flex;
  padding: var(--space-4);
  gap: var(--space-4);
  overflow: hidden;
}

.event-create-page__sidebar {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.event-create-page__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex-grow: 1;
  flex-shrink: 0;
}

.event-create-page__title-with-menu {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.event-create-page__sidebar-item--active {
  color: var(--blue-400);
}
</style>