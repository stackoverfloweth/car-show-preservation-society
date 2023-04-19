<template>
  <p-card class="clubs-list-item">
    <template v-if="club.clubLogo">
      <SizedImage class="clubs-list-item__logo" :image="club.clubLogo" />
    </template>
    <div class="clubs-list-item__name">
      {{ club.name }}
    </div>
    <div class="clubs-list-item__visibility">
      <p-tag>{{ visibility }}</p-tag>
    </div>
  </p-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { Club } from '@/models/club'
  import { capitalize } from '@/utilities'

  const props = defineProps<{
    club: Club,
  }>()

  const visibility = computed(() => `${capitalize(props.club.visibility)} Club`)
</script>

<style>
.clubs-list-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
}

.clubs-list-item__logo {
  padding-top: 50%;
  width: 100%;
  margin-bottom: var(--space-2);
}

.clubs-list-item__name {
  text-align: center;
}
</style>