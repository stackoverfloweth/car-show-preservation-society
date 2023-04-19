<template>
  <div class="contact-card">
    <template v-if="showLabel">
      <p-bread-crumbs :crumbs="[{ text: 'Contact' }]" />
    </template>
    <template v-if="user">
      <div class="contact-card__content">
        <SizedImage
          v-if="user.profileImage"
          class="contact-card__image"
          :role="!showDetails ? 'button' : 'img'"
          :image="user.profileImage"
          rounded
          :class="classes.image"
          @click="handleImageClick"
        />

        <template v-if="showDetails">
          <div class="contact-card__details">
            <div class="contact-card__name">
              {{ user.displayName }}
            </div>
            <div class="contact-card__email">
              <p-link v-if="user.emailAddress && !user.hideEmailAddress" :href="`mailto:${user.emailAddress}`">
                {{ user.emailAddress }}
              </p-link>
            </div>
            <div class="contact-card__phone">
              <p-link v-if="!user.hidePhoneNumber" :href="`tel:${user.phoneNumber}`">
                {{ formatPhoneNumber(user.phoneNumber) }}
              </p-link>
            </div>
          </div>
        </template>
      </div>
    </template>
    <p-modal v-model:show-modal="showModal" :title="user.displayName" auto-close>
      <div v-if="user" class="contact-card__details">
        <div class="contact-card__email">
          <p-link v-if="!user.hideEmailAddress" :href="`mailto:${user.emailAddress}`">
            {{ user.emailAddress }}
          </p-link>
        </div>
        <div class="contact-card__phone">
          <p-link v-if="!user.hidePhoneNumber" :href="`tel:${user.phoneNumber}`">
            {{ formatPhoneNumber(user.phoneNumber) }}
          </p-link>
        </div>
      </div>
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { computed, toRefs } from 'vue'
  import SizedImage from '@/components/SizedImage.vue'
  import { useShowModal } from '@/compositions'
  import { User } from '@/models'
  import { formatPhoneNumber } from '@/utilities'

  const props = defineProps<{
    user: User,
    showLabel?: boolean,
    showDetails?: boolean,
  }>()

  const { user } = toRefs(props)
  const { showModal, open } = useShowModal()

  const classes = computed(() => ({
    image: {
      'contact-card__image--clickable': !props.showDetails,
    },
  }))

  function handleImageClick(): void {
    if (!props.showDetails && (!user.value.hideEmailAddress || !user.value.hidePhoneNumber)) {
      open()
    }
  }
</script>

<style>
.contact-card__content {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.contact-card__image {
  height: 75px;
  width: 75px;
  flex-shrink: 0;
}

.contact-card__image--clickable {
  cursor: pointer;
}
</style>