<template>
  <ClubMembersListItem
    :name="member.displayName"
    :image="member.profileImage"
    :user-id="member.userId"
    member-type="administrator"
    class="club-members-list-item-admin"
  >
    <template v-if="canEditClub && member.userId !== currentUser.userId" #actions>
      <p-tooltip text="Coming Soon!">
        <p-button icon="MailIcon" disabled />
      </p-tooltip>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Demote to Member" icon="ChevronDoubleDownIcon" />

        <template v-if="member.userId !== club.contactUserId">
          <p-overflow-menu-item label="Set as Primary Contact" icon="StarIcon" />
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
  import ClubMembersListItem from '@/components/ClubMembersListItem.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import { useApi, useCanEditClub } from '@/compositions'
  import { Club, User } from '@/models'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    club: Club,
    member: User,
  }>()

  const api = useApi()
  const canEditClub = useCanEditClub()

  async function deleteMember(): Promise<void> {
    await api.clubMembership.deleteClubMember(props.club.clubId, props.member)
  }
</script>

<style>
.club-members-list-item__member-type--administrator {
  background-color: var(--blue-900) !important;
}
</style>