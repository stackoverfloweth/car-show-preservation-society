<template>
  <ClubMembersListItem
    :name="application.user?.displayName ?? ''"
    :image="application.user?.image"
    member-type="application"
    class="club-members-list-item-application"
  >
    <template v-if="canEditClub" #actions>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Accept" icon="UserPlusIcon" @click="accept" />
        <p-overflow-menu-item label="Remove" icon="UserMinusIcon" @click.stop="deny" />
      </p-icon-button-menu>
    </template>
  </ClubMembersListItem>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubMembersListItem from '@/components/ClubMembersListItem.vue'
  import { useApi, useCanEditClub } from '@/compositions'
  import { Club, ClubApplication } from '@/models'

  const props = defineProps<{
    club: Club,
    application: ClubApplication,
  }>()

  const api = useApi()
  const canEditClub = useCanEditClub()
  const clubId = computed(() => props.club.clubId)

  const membersSubscription = useSubscription(api.clubMembership.getAllClubMembers, [clubId])

  async function accept(): Promise<void> {
    await api.clubInvitations.acceptApplication(props.application.clubApplicationId)

    membersSubscription.refresh()
  }

  async function deny(): Promise<void> {
    await api.clubInvitations.deleteInvitation(props.application.clubApplicationId)

    membersSubscription.refresh()
  }
</script>

<style>
.club-members-list-item__member-type--application {
  color: var(--gray-800);
  background-color: var(--green-300) !important;
}
</style>