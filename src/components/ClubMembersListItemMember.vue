<template>
  <ClubMembersListItem
    :name="member.user?.displayName ?? ''"
    :image="member.user?.image"
    :user-id="member.userId"
    member-type="Member"
    class="club-members-list-item-member"
  >
    <template v-if="canEditClub && member.userId !== currentUser.userId" #actions>
      <p-tooltip text="Coming Soon!">
        <p-button icon="EnvelopeIcon" disabled />
      </p-tooltip>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Promote to Administrator" icon="ChevronDoubleUpIcon" @click="setUserRoleAdmin" />

        <template v-if="member.userId !== club.contactUserId">
          <p-overflow-menu-item label="Set as Primary Contact" icon="StarIcon" @click="setPrimaryMember" />
        </template>

        <MenuItemConfirm @confirm="deleteMember">
          <template #default="{ open: openConfirmation }">
            <p-overflow-menu-item label="Remove" icon="UserMinusIcon" @click.stop="openConfirmation" />
          </template>
        </MenuItemConfirm>
      </p-icon-button-menu>
    </template>
  </ClubMembersListItem>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubMembersListItem from '@/components/ClubMembersListItem.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import { useApi, useCanEditClub } from '@/compositions'
  import { Club, ClubMembership } from '@/models'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    club: Club,
    member: ClubMembership,
  }>()

  const api = useApi()
  const canEditClub = useCanEditClub()
  const clubId = computed(() => props.club.clubId)

  const membersSubscription = useSubscription(api.clubMembership.getAllClubMembers, [clubId])

  async function setUserRoleAdmin(): Promise<void> {
    await api.clubMembership.setUserRoleAdmin(props.member.clubMembershipId)

    membersSubscription.refresh()
  }

  async function setPrimaryMember(): Promise<void> {
    await api.clubMembership.setPrimaryMember(props.member.clubMembershipId)

    membersSubscription.refresh()
  }

  async function deleteMember(): Promise<void> {
    await api.clubMembership.deleteClubMember(props.member.clubMembershipId)

    membersSubscription.refresh()
  }
</script>