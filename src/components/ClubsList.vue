<template>
  <div class="clubs-list">
    <template v-for="club in clubs" :key="club.clubId">
      <router-link :to="routes.club(club.clubId)">
        <ClubsListItem :club="club" class="clubs-list__item" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ClubsListItem from '@/components/ClubsListItem.vue'
  import { Club } from '@/models/club'
  import { routes } from '@/router/routes'

  defineProps<{
    clubs: Club[],
  }>()
</script>

<style>
.clubs-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  gap: var(--space-md);
}

.clubs-list__item:hover {
  background-color: var(--gray-700);
}

@media(max-width: 768px){
  .clubs-list {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>