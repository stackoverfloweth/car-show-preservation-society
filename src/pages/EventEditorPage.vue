<template>
  <div class="event-editor-page">
    <div v-if="menuVisible" class="event-editor-page__sidebar">
      <template v-for="entry in titles" :key="entry.title">
        <p-overflow-menu-item
          :to="entry.to"
          class="event-editor-page__sidebar-item"
          :class="{ 'event-editor-page__sidebar-item--active': entry.to.name === route.name }"
          @click="hideMenu"
        >
          {{ entry.title }}
        </p-overflow-menu-item>
      </template>
    </div>
    <div class="event-editor-page__title" @click.stop="toggleMenu">
      <p-icon class="event-editor-page__toggle-button" icon="MenuIcon" />
      <p-bread-crumbs :crumbs="crumbs" />
    </div>
    <div class="event-editor-page__content" @click="hideMenu">
      <suspense>
        <router-view />
      </suspense>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Crumb, media } from '@prefecthq/prefect-design'
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const eventId = useRouteParam('eventId')

  const menuVisible = ref(media.hover)

  const titles = computed(() => [
    { title: 'General', to: routes.eventsEditorGeneral(eventId.value) },
    { title: 'Judging', to: routes.eventsEditorJudging(eventId.value) },
    { title: 'Registration', to: routes.eventsEditorRegistration(eventId.value) },
    { title: 'Sponsors', to: routes.eventsEditorSponsors(eventId.value) },
    { title: 'Preview', to: routes.eventsEditorPreview(eventId.value) },
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
.event-editor-page {
  display: grid;
  grid-template-areas:
    'sidebar title'
    'sidebar content';
  grid-template-columns: min-content minmax(0, 1fr);
  padding: var(--space-4);
  gap: var(--space-4);
  overflow: hidden;
}

.event-editor-page__sidebar {
  grid-area: sidebar;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
}

.event-editor-page__content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex-grow: 1;
  flex-shrink: 0;
}

.event-editor-page__title {
  grid-area: title;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.event-editor-page__sidebar-item--active {
  color: var(--blue-400);
}

@media(hover) {
  .event-editor-page__toggle-button {
    display: none;
  }
}

@media(max-width: 768px){
  .event-editor-page {
    grid-template-areas:
      'title'
      'sidebar'
      'content';
    grid-template-columns: minmax(0, 1fr);
  }

  .event-editor-page__sidebar {
    border-radius: var(--rounded);
    border: 1px solid var(--slate-700);
    background-color: var(--slate-800);
  }
}
</style>