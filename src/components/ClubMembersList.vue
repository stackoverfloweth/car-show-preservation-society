<template>
  <div class="club-members-list">
    <template v-for="member in admins" :key="member.memberId">
      <router-link :to="routes.profile(member.userId)">
        <ClubMembersListItem :member="member" class="club-members-list__club-member" is-administrator />
      </router-link>
    </template>
    <template v-for="member in members" :key="member.memberId">
      <router-link :to="routes.profile(member.userId)">
        <ClubMembersListItem :member="member" class="club-members-list__club-member" />
      </router-link>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ClubMembersListItem from '@/components/ClubMembersListItem.vue'
  import { User } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    admins: User[],
    members: User[],
  }>()
</script>

<style>
.club-members-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>