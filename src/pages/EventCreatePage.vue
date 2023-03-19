<template>
  <div class="event-create-page">
    <div v-if="menuVisible" class="event-create-page__sidebar">
      <template v-for="entry in titles" :key="entry.title">
        <p-overflow-menu-item
          :to="entry.to"
          class="event-create-page__sidebar-item"
          :class="{ 'event-create-page__sidebar-item--active': entry.to.name === route.name }"
          @click="hideMenu"
        >
          {{ entry.title }}
        </p-overflow-menu-item>
      </template>
    </div>
    <div class="event-create-page__title" @click.stop="toggleMenu">
      <p-icon class="event-create-page__toggle-button" icon="MenuIcon" />
      <p-bread-crumbs :crumbs="crumbs" />
    </div>
    <div class="event-create-page__content" @click="hideMenu">
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
    { title: 'General', to: routes.eventsCreateGeneral() },
    { title: 'Judging', to: routes.eventsCreateJudging() },
    { title: 'Registration', to: routes.eventsCreateRegistration() },
  ])

  const crumbs = computed<Crumb[]>(() => {
    const activeTitle = titles.value.find(({ to }) => to.name === route.name)

    if (!activeTitle) {
      return []
    }

    return [{ text: activeTitle.title }]
  })

  function toggleMenu(): void {
    if (!media.hover) {
      menuVisible.value = !menuVisible.value
    }
  }

  function hideMenu(): void {
    if (!media.hover) {
      menuVisible.value = false
    }
  }
</script>

<style>
.event-create-page {
  display: grid;
  grid-template-areas:
    'sidebar title'
    'sidebar content';
  grid-template-columns: min-content 1fr;
  padding: var(--space-4);
  gap: var(--space-4);
  overflow: hidden;
}

.event-create-page__sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.event-create-page__content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex-grow: 1;
  flex-shrink: 0;
}

.event-create-page__title {
  grid-area: title;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.event-create-page__sidebar-item--active {
  color: var(--blue-400);
}

@media(hover) {
  .event-create-page__toggle-button {
    display: none;
  }
}

@media(max-width: 768px){
  .event-create-page {
    grid-template-areas:
      'title'
      'sidebar'
      'content';
    grid-template-columns: 1fr;
  }

  .event-create-page__sidebar {
    border-radius: var(--rounded);
    border: 1px solid var(--slate-700);
    background-color: var(--slate-800);
  }
}
</style>