<template>
  <div class="club-members-list">
    <template v-for="emailAddress in pending" :key="emailAddress">
      <ClubMembersListItemPending :club="club" :email-address="emailAddress" class="club-members-list__club-member" />
    </template>
    <template v-for="member in admins" :key="member.memberId">
      <ClubMembersListItemAdmin :club="club" :member="member" class="club-members-list__club-member" is-admin />
    </template>
    <template v-for="member in members" :key="member.memberId">
      <ClubMembersListItemMember :club="club" :member="member" class="club-members-list__club-member" member-type="member" />
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ClubMembersListItemAdmin from '@/components/ClubMembersListItemAdmin.vue'
  import ClubMembersListItemMember from '@/components/ClubMembersListItemMember.vue'
  import ClubMembersListItemPending from '@/components/ClubMembersListItemPending.vue'
  import { Club, User } from '@/models'

  defineProps<{
    club: Club,
    pending: string[],
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