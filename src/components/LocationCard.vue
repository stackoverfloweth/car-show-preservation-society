<template>
  <div class="location-card">
    <p-bread-crumbs :crumbs="[{ text: 'Location' }]" />
    <p-pop-over v-if="location.place" :placement="placement" auto-close>
      <template #target="{ open }">
        <p-link @click="open">
          <p class="location-card__place">
            {{ location.place }}
          </p>
        </p-link>
      </template>
      <template #default="{ close }">
        <p-overflow-menu>
          <p-overflow-menu-item label="Open with Apple Maps" :to="`https://maps.apple.com/maps?q=${location.place}`" @click="close" />
          <p-overflow-menu-item label="Open with Google Maps" :to="`https://maps.google.com/?q=${location.place}`" @click="close" />
        </p-overflow-menu>
      </template>
    </p-pop-over>
    <template v-else>
      Location Not Set
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { PositionMethod } from '@prefecthq/prefect-design'
  import { Location } from '@/models'

  defineProps<{
    location: Location,
  }>()

  const placement: PositionMethod = (target, content, container) => {
    const top = target.top - container.top - content.height
    const left = target.right - container.left - target.width + content.width / 2

    return { top, left }
  }
</script>

<style>
.location-card__place {
  white-space: pre-line;
}
</style>