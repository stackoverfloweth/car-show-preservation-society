<template>
  <div class="club-members-list">
    <template v-for="member in members" :key="member.memberId">
      <template v-if="isClubMembership(member)">
        <ClubMembersListItemMember :club="club" :member="member" class="club-members-list__club-member" />
      </template>
      <template v-if="isClubInvite(member)">
        <ClubMembersListItemPending :club="club" :invitation="member" class="club-members-list__club-member" />
      </template>
      <template v-else>
        <!-- <ClubMembersListItemAdmin :club="club" :member="member" class="club-members-list__club-member" is-admin /> -->
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
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