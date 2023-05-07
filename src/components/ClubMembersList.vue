<template>
  <div class="club-members-list">
    <template v-for="member in members" :key="member.memberId">
      <template v-if="isClubMembership(member)">
        <ClubMembersListItemMember :club="club" :member="member" />
      </template>
      <template v-else-if="isClubInvite(member)">
        <ClubMembersListItemPending :club="club" :invitation="member" />
      </template>
      <template v-else>
        <ClubMembersListItemApplication :club="club" :application="member" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import ClubMembersListItemApplication from '@/components/ClubMembersListItemApplication.vue'
  import ClubMembersListItemMember from '@/components/ClubMembersListItemMember.vue'
  import ClubMembersListItemPending from '@/components/ClubMembersListItemPending.vue'
  import { Club, ClubApplication, ClubInvite, ClubMembership, isClubMembership, isClubInvite } from '@/models'

  defineProps<{
    club: Club,
    members: (ClubMembership | ClubInvite | ClubApplication)[],
  }>()
</script>

<style>
.club-members-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>