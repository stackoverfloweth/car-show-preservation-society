<template>
  <p-list-item class="club-members-list-item">
    <SizedImage :image="image" class="club-members-list-item__image" rounded />
    <div class="club-members-list-item__body">
      <router-link v-if="userId" class="club-members-list-item__name" :to="routes.profile(userId)">
        <strong>{{ name }}</strong>
      </router-link>
      <div v-else class="club-members-list-item__name">
        {{ name }}
      </div>
      <div class="club-members-list-item__details">
        <p-tag class="club-members-list-item__member-type" :class="`club-members-list-item__member-type--${memberType}`">
          {{ memberType }}
        </p-tag>
        <p-tag v-if="primary" class="club-members-list-item__primary-contact">
          <p-icon size="small" icon="StarIcon" /> Primary
        </p-tag>
      </div>
    </div>
    <div class="club-members-list-item__actions">
      <slot name="actions" />
    </div>
  </p-list-item>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Image } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    name: string,
    userId?: string,
    image?: Image,
    memberType: string,
    primary?: boolean,
  }>()
</script>

<style>
.club-members-list-item {
  display: flex;
  gap: var(--space-md);
}

.club-members-list-item__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  gap: var(--space-sm);
}

.club-members-list-item__actions {
  display: flex;
  align-items: start;
  gap: var(--space-sm);
}

.club-members-list-item__image {
  height: 75px;
  width: 75px;
  flex-shrink: 0;
}

.club-members-list-item__details {
  display: flex;
  gap: var(--space-sm);
}

.club-members-list-item__primary-contact {
  background-color: var(--yellow-700) !important;
}

.club-members-list-item__member-type {
  text-transform: capitalize;
}
</style>