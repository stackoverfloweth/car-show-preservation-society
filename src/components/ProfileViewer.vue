<template>
  <div class="profile-viewer">
    <template v-if="canEditProfile">
      <div class="profile-viewer__header">
        <p-icon-button-menu>
          <p-overflow-menu-item label="Edit Profile" icon="PencilIcon" :to="routes.profileEditor()" />
        </p-icon-button-menu>
      </div>
    </template>

    <div class="profile-viewer__details">
      <SizedImage v-if="user.image" class="profile-viewer__image" :image="user.image" />

      <div class="profile-viewer__columns">
        <div class="profile-viewer__contact">
          <div class="profile-viewer__name">
            <template v-if="user.displayNameOverride">
              {{ user.displayNameOverride }}
            </template>
            <template v-else>
              {{ user.firstName }} {{ user.lastName }}
            </template>
          </div>

          <div v-if="canEditProfile || !user.hideEmailAddress" class="profile-viewer__email-address">
            {{ user.emailAddress }}
          </div>
          <div v-if="canEditProfile || !user.hidePhoneNumber" class="profile-viewer__phone-number">
            {{ formatPhoneNumber(user.phoneNumber) }}
          </div>
          <div v-if="canEditProfile || !user.hideLocation" class="profile-viewer__location">
            {{ user.location?.place }}
          </div>
        </div>
        <div class="profile-viewer__best-placements">
          <template v-for="(placement, index) in bestPlacements" :key="index">
            <div class="profile-viewer__best-placement">
              <ResultPlace :place="placement.placeNumber" />
              <p>X</p>
              <div class="profile-viewer__best-placement-count">
                {{ placement.count }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import ResultPlace from '@/components/ResultPlace.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { User, VotingResultsCount } from '@/models'
  import { routes } from '@/router/routes'
  import { currentUser } from '@/services'
  import { formatPhoneNumber } from '@/utilities'

  const props = defineProps<{
    user: User,
    bestPlacements: VotingResultsCount[],
  }>()

  const canEditProfile = computed(() => props.user.userId === currentUser().id)
</script>

<style>
.profile-viewer__header {
  display: flex;
  justify-content: end;
  align-items: center;
}

.profile-viewer__details {
  display: flex;
  justify-content: center;
  align-items: start;
  gap: var(--space-md);
}

.profile-viewer__name {
  font-size: var(--text-md);
  font-weight: bold;
}

.profile-viewer__image {
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  padding-top: 33.33%;
  max-width: 40%;
}

.profile-viewer__contact {
  flex-grow: 0;
  overflow-x: auto;
}

.profile-viewer__location {
  margin-top: var(--space-md);
  white-space: pre-line;
}

.profile-viewer__columns {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.profile-viewer__best-placements {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.profile-viewer__best-placement {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.profile-viewer__best-placement-count {
  font-size: var(--text-md);
}

@media(max-width: 768px){
  .profile-viewer__details {
    flex-direction: column;
  }

  .profile-viewer__image {
    max-width: 80%;
    padding-top: 50%;
    align-self: center;
  }
}
</style>