<template>
  <p-list-item class="club-members-list-item">
    <ContactCard :user="member" class="club-members-list-item__image" disabled />
    <div class="club-members-list-item__body">
      <router-link :to="routes.profile(member.userId)">
        <div class="club-members-list-item__name">
          {{ member.displayName }}
        </div>
      </router-link>
      <div class="club-members-list-item__details">
        <p-tag class="club-members-list-item__member-type" :class="classes.memberType">
          {{ memberType }}
        </p-tag>
      </div>
    </div>
  </p-list-item>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import { useCanEditClub } from '@/compositions'
  import { User } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    member: User,
    memberType: string,
  }>()

  const classes = computed(() => ({
    memberType: `club-members-list-item__member-type--${props.memberType}`,
  }))

  const canEditClub = useCanEditClub()
</script>

<style>
.club-members-list-item {
  display: flex;
  gap: var(--space-4);
}

.club-members-list-item__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-2);
}

.club-members-list-item__name {
  grid-area: name;
  font-weight: bold;
}

.club-members-list-item__details {
  display: flex;
  gap: var(--space-2);
}

.club-members-list-item__member-type {
  text-transform: capitalize;
}

.club-members-list-item__member-type--pending {
  color: var(--slate-800);
  background-color: var(--blue-300) !important;
}

.club-members-list-item__member-type--administrator {
  background-color: var(--blue-900) !important;
}
</style>