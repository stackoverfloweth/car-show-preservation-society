<template>
  <ClubMembersListItem
    :name="invitation.emailAddress"
    member-type="pending"
    class="club-members-list-item-pending"
  >
    <template v-if="canEditClub" #actions>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Resend Invitation" icon="PaperAirplaneIcon" @click="resendInvitation" />

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
  import { Club, ClubInvite } from '@/models'

  const props = defineProps<{
    club: Club,
    invitation: ClubInvite,
  }>()

  const api = useApi()
  const canEditClub = useCanEditClub()

  async function resendInvitation(): Promise<void> {
    await api.clubInvitations.resendInvitation(props.club.clubId, props.invitation.emailAddress)
  }

  async function deleteMember(): Promise<void> {
    await api.clubInvitations.deleteInvitation(props.invitation.clubInviteId)
  }
</script>

<style>
.club-members-list-item__member-type--pending {
  color: var(--slate-800);
  background-color: var(--blue-300) !important;
}
</style>