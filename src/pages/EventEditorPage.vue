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
      <PageHeader :heading="activeTitle?.title" />
    </div>
    <div class="event-editor-page__content" @click="hideMenu">
      <suspense>
        <router-view />
      </suspense>
    </div>
    <div class="event-editor-page__bottom-navigation">
      <div class="event-editor-page__bottom-navigation-item">
        <template v-if="previous">
          <p-link :to="previous.to" class="event-editor-page__bottom-navigation-link">
            <p-icon icon="ChevronLeftIcon" />
            {{ previous.title }}
          </p-link>
        </template>
      </div>
      <div class="event-editor-page__bottom-navigation-item">
        <template v-if="next">
          <p-link :to="next.to" class="event-editor-page__bottom-navigation-link">
            {{ next.title }}
            <p-icon icon="ChevronRightIcon" />
          </p-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { media } from '@prefecthq/prefect-design'
  import { useRouteParam } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import PageHeader from '@/components/PageHeader.vue'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const eventId = useRouteParam('eventId')

  const menuVisible = ref(media.hover)

  const titles = computed(() => [
    { title: 'General', to: routes.eventEditorGeneral(eventId.value) },
    { title: 'Judging', to: routes.eventEditorJudging(eventId.value) },
    { title: 'Registration', to: routes.eventEditorRegistration(eventId.value) },
    { title: 'Sponsors', to: routes.eventEditorSponsors(eventId.value) },
    { title: 'Preview', to: routes.eventEditorPreview(eventId.value) },
  ])

  const activeTitle = computed(() => titles.value.find(({ to }) => to.name === route.name))
  const activeTitleIndex = computed(() => titles.value.findIndex(({ to }) => to.name === route.name))

  const previous = computed(() => titles.value[activeTitleIndex.value - 1])
  const next = computed(() => titles.value[activeTitleIndex.value + 1])

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
    'sidebar content'
    'navigation navigation';
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

.event-editor-page__bottom-navigation {
  grid-area: navigation;
  display: none;
  justify-content: space-between;
}

.event-editor-page__bottom-navigation-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
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
      'content'
      'navigation';
    grid-template-columns: minmax(0, 1fr);
  }

  .event-editor-page__bottom-navigation {
    display:flex;
  }

  .event-editor-page__sidebar {
    border-radius: var(--rounded);
    border: 1px solid var(--slate-700);
    background-color: var(--slate-800);
  }
}
</style>