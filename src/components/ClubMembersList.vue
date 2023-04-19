<template>
  <div class="club-members-list">
    <template v-for="member in pending" :key="member.memberId">
      <ClubMembersListItem :member="member" class="club-members-list__club-member" member-type="pending" />
    </template>
    <template v-for="member in admins" :key="member.memberId">
      <ClubMembersListItem :member="member" class="club-members-list__club-member" member-type="administrator" />
    </template>
    <template v-for="member in members" :key="member.memberId">
      <ClubMembersListItem :member="member" class="club-members-list__club-member" member-type="member" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ClubMembersListItem from '@/components/ClubMembersListItem.vue'
  import { User } from '@/models'

  defineProps<{
    pending: User[],
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