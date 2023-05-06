<template>
  <ClubMembersListItem
    :name="member.user?.displayName ?? ''"
    :image="member.user?.image"
    :user-id="member.userId"
    member-type="administrator"
    class="club-members-list-item-admin"
  >
    <template v-if="canEditClub && member.userId !== currentUser.userId" #actions>
      <p-tooltip text="Coming Soon!">
        <p-button icon="MailIcon" disabled />
      </p-tooltip>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Demote to Member" icon="ChevronDoubleDownIcon" @click="setUserRoleMember" />

        <template v-if="member.userId !== club.contactUserId">
          <p-overflow-menu-item label="Set as Primary Contact" icon="StarIcon" @click="setPrimaryMember" />
        </template>

        <MenuItemConfirm @confirm="deleteMember">
          <template #default="{ open: openConfirmation }">
            <p-overflow-menu-item label="Remove" icon="UserRemoveIcon" @click.stop="openConfirmation" />
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
  const clubId = computed(() => props.member.clubId)

  const membersSubscription = useSubscription(api.clubMembership.getAllClubMembers, [clubId])

  async function setUserRoleMember(): Promise<void> {
    await api.clubMembership.setUserRoleMember(props.member.clubMembershipId)

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

<style>
.club-members-list-item__member-type--administrator {
  background-color: var(--blue-900) !important;
}
</style>