<template>
  <p-list-item class="club-members-list-item">
    <ContactCard :user="member" class="club-members-list-item__image" />
    <div class="club-members-list-item__body">
      <div class="club-members-list-item__name">
        {{ member.displayName }}
      </div>
      <div class="club-members-list-item__details">
        <p-tag class="club-members-list-item__member-type">
          {{ memberType }}
        </p-tag>
        <p-tag v-if="currentUser.userId === member.userId" class="club-members-list-item__is-current-user">
          You
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
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    member: User,
    isAdministrator?: boolean,
  }>()

  const memberType = computed(() => props.isAdministrator ? 'Administrator' : 'Member')

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

.club-members-list-item__is-current-user {
  background-color: var(--blue-700) !important;
}
</style>