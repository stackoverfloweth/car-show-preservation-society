<template>
  <div class="club-viewer">
    <div class="club-viewer__header">
      <div class="club-viewer__heading">
        {{ club.name }}
      </div>
      <p-icon-button-menu>
        <p-overflow-menu-item label="Share" icon="ShareIcon" />
        <template v-if="!currentUserIsMember">
          <p-overflow-menu-item v-if="club.joinableByAnyone" label="Join" icon="UserAddIcon" @click="joinPublicClub" />
          <p-overflow-menu-item v-else-if="club.joinableByApplication" label="Join" icon="UserAddIcon" @click="openClubApplication" />
        </template>
        <p-overflow-menu-item v-if="canEditClub" label="Edit" icon="PencilIcon" :to="routes.clubEditor(club.clubId)" />
      </p-icon-button-menu>
    </div>

    <div class="club-viewer__body">
      <ClubOverview :club="club" />

      <div class="club-viewer__events">
        <p-bread-crumbs :crumbs="[{ text: 'Upcoming Events' }]" />
        <EventsList :events="events" />
      </div>
    </div>
    <p-modal v-model:show-modal="showModal" :title="`Join ${club.name}`" auto-close>
      <ClubApplicationForm :club="club" @close="closeClubApplication" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ClubApplicationForm from '@/components/ClubApplicationForm.vue'
  import ClubOverview from '@/components/ClubOverview.vue'
  import EventsList from '@/components/EventsList.vue'
  import { useApi, useShowModal } from '@/compositions'
  import { Club, Event } from '@/models'
  import { routes } from '@/router/routes'
  import { userId } from '@/services/auth'

  const props = defineProps<{
    club: Club,
    events: Event[],
  }>()

  const api = useApi()
  const { showModal, open: openClubApplication, close: closeClubApplication } = useShowModal()

  const userIsMemberSubscription = useSubscription(api.users.isMemberOfClub, [userId, props.club.clubId])
  const currentUserIsMember = computed(() => userIsMemberSubscription.response ?? false)

  const canEditClub = false

  async function joinPublicClub(): Promise<void> {
    if (!currentUserIsMember.value) {
      await api.clubs.joinClub(props.club.clubId, userId)

      showToast('Joined!', 'success')
    }
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
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.club-viewer__heading {
  font-size: 1.25rem;
  font-weight: bold;
}

.club-viewer__body {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

@media(max-width: 768px) {
  .club-viewer__body {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>