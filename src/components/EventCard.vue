<template>
  <div class="event-card">
    <template v-if="showTitle">
      <PageHeader :heading="event.name" />
    </template>

    <template v-if="event.image">
      <SizedImage class="event-card__image" :image="event.image" />
    </template>

    <div class="event-card__description">
      <p>{{ event.description }}</p>
    </div>

    <div class="event-card__details">
      <p>{{ formatRelative(event.start, new Date()) }}</p>
      <p>{{ mocker.create('number', [1, 100]) }} miles away</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { formatRelative } from 'date-fns'
  import PageHeader from '@/components/PageHeader.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Event } from '@/models'
  import { mocker } from '@/services/mocker'

  defineProps<{
    event: Event,
    showTitle?: boolean,
  }>()
</script>

<style>
.event-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.event-card__image {
  padding-top: 50%;
}

.event-card__details {
  color: var(--gray-400);
  font-size: var(--text-xs);
  line-height: 0.95rem;
}
</style>