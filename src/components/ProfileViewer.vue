<template>
  <div class="profile-viewer">
    <div class="profile-viewer__header">
      <template v-if="canEditProfile">
        <p-icon-button-menu>
          <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.profileEditor()" />
        </p-icon-button-menu>
      </template>
    </div>

    <div class="profile-viewer__details">
      <SizedImage v-if="user.profileImage" class="profile-viewer__image" :image="user.profileImage" />

      <div class="profile-viewer__contact">
        <div class="profile-viewer__name">
          {{ user.firstName }} {{ user.lastName }}
        </div>

        <div class="profile-viewer__email-address">
          {{ user.emailAddress }}
        </div>
        <template v-if="user.phoneNumber">
          <div class="profile-viewer__phone-number">
            {{ formatPhoneNumber(user.phoneNumber) }}
          </div>
        </template>
        <div class="profile-viewer__location">
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

  const canEditProfile = true
</script>

<style>
.profile-viewer__header {
  display: flex;
  justify-content: end;
  align-items: center;
}

.profile-viewer__details {
  display: flex;
  justify-content:center;
  gap: var(--space-4);
}

.profile-viewer__name {
  font-size: 1.25rem;
  font-weight: bold;
}

.profile-viewer__image {
  flex-shrink: 0;
  flex-grow: 1;
  padding-top: 33.33%;
  max-width: 50%;
}

.profile-viewer__contact {
  flex-grow: 0;
  max-width: 50%;
  overflow-x: auto;
}

.profile-viewer__location {
  margin-top: var(--space-4);
  white-space: pre-line;
}
</style>