<template>
  <div class="clubs-list">
    <template v-for="club in clubs" :key="club.clubId">
      <router-link :to="routes.club(club.clubId)">
        <p-card class="clubs-list__club">
          <template v-if="club.clubLogo">
            <SizedImage class="clubs-list__club-logo" :image="club.clubLogo" />
          </template>
          <div class="clubs-list__club-name">
            {{ club.name }}
          </div>
        </p-card>
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { Club } from '@/models/club'
  import { routes } from '@/router/routes'

  defineProps<{
    clubs: Club[],
  }>()
</script>

<style>
.clubs-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.clubs-list__club {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
  width: 300px;
}

.clubs-list__club-logo {
  height: 140px;
  width: 100%;
}

.clubs-list__club-name {
  text-align: center;
}

@media(max-width: 768px){
  .clubs-list {
    flex-direction: column;
  }

  .clubs-list__club {
    width: 100%;
  }

  .clubs-list__club-logo {
    height: 200px;
  }
}
</style>