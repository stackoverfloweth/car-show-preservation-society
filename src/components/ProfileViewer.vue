<template>
  <div class="profile-viewer">
    <template v-if="canEditProfile">
      <div class="profile-viewer__header">
        <p-icon-button-menu>
          <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.profileEditor()" />
        </p-icon-button-menu>
      </div>
    </template>

    <div class="profile-viewer__details">
      <SizedImage v-if="user.profileImage" class="profile-viewer__image" :image="user.profileImage" />

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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import SizedImage from '@/components/SizedImage.vue'
  import { User } from '@/models'
  import { routes } from '@/router/routes'
  import { formatPhoneNumber } from '@/utilities'

  defineProps<{
    user: User,
  }>()

  const canEditProfile = false
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
  gap: var(--space-4);
}

.profile-viewer__name {
  font-size: 1.25rem;
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
  margin-top: var(--space-4);
  white-space: pre-line;
}

@media(max-width: 768px){
  .profile-viewer__details {
    flex-direction: column;
  }
}
</style>