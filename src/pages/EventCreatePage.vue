<template>
  <div class="event-create-page">
    <div class="event-create-page__title">
      <template v-for="entry in titles" :key="entry.title">
        <p-button
          :to="entry.to"
          :flat="entry.to.name !== route.name"
          class="event-create-page__title-item"
        >
          {{ entry.title }}
        </p-button>
      </template>
    </div>
    <div class="event-create-page__content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { routes } from '@/router/routes'

  const route = useRoute()

  const titles = computed(() => [
    { title: 'General', to: routes.eventsCreateGeneral() },
    { title: 'Judging', to: routes.eventsCreateJudging() },
    { title: 'Registration', to: routes.eventsCreateRegistration() },
  ])
</script>

<style>
.event-create-page {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  gap: var(--space-4);
  overflow: hidden;
}

.event-create-page__title {
  display: flex;
  justify-items: start;
  align-items: start;
  gap: var(--space-4);
}

.event-create-page__title-item {
  font-size: 1rem;
  line-height: 1.75rem;
  font-weight: 700;
  padding: var(--space-3) var(--space-4);
}

.event-create-page__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>