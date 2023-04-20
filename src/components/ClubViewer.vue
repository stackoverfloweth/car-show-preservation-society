<template>
  <div class="club-viewer">
    <div class="club-viewer__header">
      <p-button inset icon="ShareIcon" />

      <template v-if="!currentUserIsMember">
        <p-button v-if="club.joinableByAnyone" @click="joinPublicClub">
          Join
        </p-button>
        <p-button v-else-if="club.joinableByApplication" @click="openApplicationModal">
          Join
        </p-button>
      </template>

      <template v-if="canEditClub">
        <p-icon-button-menu>
          <MenuItemConfirm v-if="!currentUserIsOnlyAdmin" @confirm="leaveClub">
            <template #default="{ open: openConfirmation }">
              <p-overflow-menu-item label="Leave" icon="UserRemoveIcon" @click.stop="openConfirmation" />
            </template>
          </MenuItemConfirm>
          <p-overflow-menu-item label="Invite Member" icon="UserAddIcon" @click="openInviteMemberModal" />
          <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.clubEditor(clubId)" />
        </p-icon-button-menu>
      </template>
    </div>

    <div class="club-viewer__body">
      <div v-if="club.clubLogo" class="club-viewer__logo-container">
        <SizedImage :image="club.clubLogo" class="club-viewer__logo" />
      </div>

      <div class="club-viewer__details">
        <div class="club-viewer__heading">
          {{ club.name }}
        </div>
        <p-tag>{{ visibility }}</p-tag>
        <p>
          {{ club.description }}
        </p>
      </div>
    </div>
    <p-tabs v-model:selected="selectTab" :tabs="tabs">
      <template #events-heading>
        Upcoming Events <p-tag>{{ upcomingEventsCount.toLocaleString() }}</p-tag>
      </template>
      <template #events>
        <EventsList :events="events" />
      </template>
      <template #members-heading>
        Members <p-tag>{{ memberCount.toLocaleString() }}</p-tag>
      </template>
      <template #members>
        <ClubMembersList :club="club" :members="members" :admins="admins" :pending="pending" />
      </template>
      <template #photos-heading>
        Photos
      </template>
      <template #photos>
        <ClubPhotoGallery :club-id="clubId" />
      </template>
    </p-tabs>
    <p-modal v-model:show-modal="showApplicationModal" :title="`Join ${club.name}`" auto-close>
      <ClubApplicationForm :club="club" @close="closeApplicationModal" />
    </p-modal>
    <p-modal v-model:show-modal="showInviteMemberModal" title="Invite Member" auto-close>
      <ClubMemberInviteForm :club-id="clubId" @close="closeInviteMemberModal" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { kebabCase, showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import ClubApplicationForm from '@/components/ClubApplicationForm.vue'
  import ClubMemberInviteForm from '@/components/ClubMemberInviteForm.vue'
  import ClubMembersList from '@/components/ClubMembersList.vue'
  import ClubPhotoGallery from '@/components/ClubPhotoGallery.vue'
  import EventsList from '@/components/EventsList.vue'
  import MenuItemConfirm from '@/components/MenuItemConfirm.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useApi, useCanEditClub, useShowModal } from '@/compositions'
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
  const canEditClub = useCanEditClub()
  const route = useRoute()
  const router = useRouter()

  const tabs = [
    'events',
    'members',
    'photos',
  ]
  const selectTab = computed({
    get() {
      return route.hash.slice(1)
    },
    set(value) {
      router.push(`#${kebabCase(value)}`)
    },
  })

  const { showModal: showApplicationModal, open: openApplicationModal, close: closeApplicationModal } = useShowModal()
  const { showModal: showInviteMemberModal, open: openInviteMemberModal, close: closeInviteMemberModal } = useShowModal()

  const userIsMemberSubscription = useSubscription(api.users.isMemberOfClub, [currentUser.userId, clubId])
  const currentUserIsMember = computed(() => userIsMemberSubscription.response ?? false)

  const memberCountSubscription = useSubscription(api.clubMembership.getActiveMemberCount, [clubId])
  const memberCount = computed(() => memberCountSubscription.response ?? 0)

  const upcomingEventsCountSubscription = useSubscription(api.clubs.getUpcomingEventsCount, [clubId])
  const upcomingEventsCount = computed(() => upcomingEventsCountSubscription.response ?? 0)

  const adminsSubscription = useSubscription(api.clubMembership.getClubAdmins, [clubId])
  const admins = computed(() => adminsSubscription.response ?? [])

  const membersSubscription = useSubscription(api.clubMembership.getClubMembers, [clubId])
  const members = computed(() => membersSubscription.response ?? [])

  const pendingSubscription = useSubscription(api.clubMembership.getClubPendingMembers, [clubId])
  const pending = computed(() => pendingSubscription.response ?? [])

  const currentUserIsOnlyAdmin = computed(() => admins.value.every(admin => admin.userId === currentUser.userId))
  const visibility = computed(() => `${capitalize(props.club.visibility)} Club`)

  async function joinPublicClub(): Promise<void> {
    if (currentUserIsMember.value) {
      return
    }

    await api.clubMembership.joinClub(clubId.value, currentUser.userId)

    showToast('Joined!', 'success')
  }

  async function leaveClub(): Promise<void> {
    if (!currentUserIsMember.value) {
      return
    }

    await api.clubMembership.leaveClub(clubId.value, currentUser.userId)

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

.club-viewer__logo-container {
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  max-width: 50%;
}

.club-viewer__logo {
  padding-top: 50%;
}

.club-viewer__details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: start;
}

@media(max-width: 768px) {
  .club-viewer__body {
    flex-direction: column;
  }

  .club-viewer__logo-container {
    max-width: unset;
  }
}
</style>