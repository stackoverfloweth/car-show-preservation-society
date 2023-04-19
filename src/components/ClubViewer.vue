<template>
  <div class="club-viewer">
    <div class="club-viewer__header">
      <p-button inset icon="ShareIcon" />

      <template v-if="!currentUserIsMember">
        <p-button v-if="club.joinableByAnyone" @click="joinPublicClub">
          Join
        </p-button>
        <p-button v-else-if="club.joinableByApplication" @click="openClubApplication">
          Join
        </p-button>
      </template>

      <template v-if="canEditClub">
        <p-icon-button-menu>
          <MenuItemConfirm @confirm="leaveClub">
            <template #default="{ open: openConfirmation }">
              <p-overflow-menu-item label="Leave" icon="UserRemoveIcon" @click.stop="openConfirmation" />
            </template>
          </MenuItemConfirm>
          <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.clubEditor(club.clubId)" />
        </p-icon-button-menu>
      </template>
    </div>

    <div class="club-viewer__body">
      <SizedImage v-if="club.clubLogo" :image="club.clubLogo" class="club-overview__logo" />

      <div class="club-viewer__details">
        <div class="club-viewer__heading">
          {{ club.name }}
        </div>
        <p>
          {{ club.description }}
        </p>
        <p-tag>{{ visibility }}</p-tag>
      </div>
    </div>
    <p-tabs :tabs="tabs">
      <template #upcoming-events>
        <EventsList :events="events" />
      </template>
      <template #members>
        <div class="club-viewer__members">
          <ClubMembersList :members="admins" is-administrator />
          <ClubMembersList :members="members" />
        </div>
      </template>
      <template #photos>
        <ClubPhotoGallery :club-id="club.clubId" />
      </template>
    </p-tabs>
    <p-modal v-model:show-modal="showModal" :title="`Join ${club.name}`" auto-close>
      <ClubApplicationForm :club="club" @close="closeClubApplication" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { Tab, showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubApplicationForm from '@/components/ClubApplicationForm.vue'
  import ClubMembersList from '@/components/ClubMembersList.vue'
  import ClubPhotoGallery from '@/components/ClubPhotoGallery.vue'
  import EventsList from '@/components/EventsList.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { Club, Event } from '@/models'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services/auth'
  import { capitalize } from '@/utilities'

  const props = defineProps<{
    club: Club,
    events: Event[],
  }>()

  const api = useApi()
  const clubId = computed(() => props.club.clubId)
  const { showModal, open: openClubApplication, close: closeClubApplication } = useShowModal()

  const userIsMemberSubscription = useSubscription(api.users.isMemberOfClub, [currentUser.userId, props.club.clubId])
  const currentUserIsMember = computed(() => userIsMemberSubscription.response ?? false)

  const adminsSubscription = useSubscription(api.clubs.getClubAdmins, [clubId])
  const admins = computed(() => adminsSubscription.response ?? [])

  const membersSubscription = useSubscription(api.clubs.getClubMembers, [clubId])
  const members = computed(() => membersSubscription.response ?? [])

  const canEditClub = true

  const visibility = computed(() => `${capitalize(props.club.visibility)} Club`)

  const tabs = computed<Tab[]>(() => {
    const value = [
      { label: 'Upcoming Events' },
      { label: 'Members' },
      { label: 'Photos' },
    ]

    return value
  })

  async function joinPublicClub(): Promise<void> {
    if (currentUserIsMember.value) {
      return
    }

    await api.clubs.joinClub(props.club.clubId, currentUser.userId)

    showToast('Joined!', 'success')
  }

  async function leaveClub(): Promise<void> {
    if (!currentUserIsMember.value) {
      return
    }

    await api.clubs.leaveClub(props.club.clubId, currentUser.userId)

    showToast('Left club', 'success')
  }
</script>

<style>
.club-viewer {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.club-viewer__header {
  display: flex;
  justify-content: end;
  gap: var(--space-3);
}

.club-viewer__heading {
  font-size: 1.25rem;
  font-weight: bold;
}

.club-viewer__body {
  display: flex;
  gap: var(--space-4);
}

.club-overview__logo {
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  padding-top: 33.33%;
  max-width: 40%;
  max-height: 250px;
}

.club-viewer__details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: start;
}

.club-viewer__members {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media(max-width: 768px) {
  .club-viewer__body {
    flex-direction: column;
  }
}
</style>