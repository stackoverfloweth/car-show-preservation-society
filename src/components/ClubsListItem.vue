<template>
  <p-card class="clubs-list-item">
    <template v-if="club.image">
      <SizedImage class="clubs-list-item__logo" :image="club.image" />
    </template>
    <div class="clubs-list-item__name">
      {{ club.name }}
    </div>
    <div class="clubs-list-item__tags">
      <template v-if="club.visibility === 'public'">
        <p-tag icon="GlobeAltIcon" class="clubs-list-item__tag">
          Public Club
        </p-tag>
      </template>
      <template v-else>
        <p-tag icon="LockClosedIcon" class="clubs-list-item__tag">
          Private Club
        </p-tag>
      </template>
      <p-tag icon="UsersIcon" class="clubs-list-item__tag">
        {{ memberCount.toLocaleString() }}
      </p-tag>
      <p-tag icon="CalendarIcon" class="clubs-list-item__tag">
        {{ upcomingEventsCount.toLocaleString() }}
      </p-tag>
    </div>
  </p-card>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi } from '@/compositions'
  import { Club } from '@/models/club'

  const props = defineProps<{
    club: Club,
  }>()

  const api = useApi()

  const clubId = computed(() => props.club.clubId)

  const memberCountSubscription = useSubscription(api.clubMembership.getActiveMemberCount, [clubId])
  const memberCount = computed(() => memberCountSubscription.response ?? 0)

  const upcomingEventsCountSubscription = useSubscription(api.clubs.getUpcomingEventsCount, [clubId])
  const upcomingEventsCount = computed(() => upcomingEventsCountSubscription.response ?? 0)
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

.clubs-list-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.clubs-list-item__tag {
  border: 1px solid var(--slate-600);
}
</style>