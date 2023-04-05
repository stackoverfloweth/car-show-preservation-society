<template>
  <div class="vehicle-page">
    <div class="vehicle-page__header">
      <template v-if="vehicle">
        <VehicleLabel :vehicle="vehicle" />
        <ContactCard :user-id="vehicle.userId" />
      </template>
    </div>
    <SizedImage :image="vehicle?.profileImage" class="vehicle-page__hero" />
    <div class="vehicle-page__gallery">
      <template v-for="image in images" :key="image.imageId">
        <SizedImage :image="image" class="vehicle-page__gallery-image" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import ContactCard from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import VehicleLabel from '@/components/VehicleLabel.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const vehicleId = useRouteParam('vehicleId')
  const api = useApi()

  const vehicleSubscription = useSubscription(api.vehicles.getVehicle, [vehicleId])
  const vehicle = computed(() => vehicleSubscription.response)

  const vehicleImagesSubscription = useSubscription(api.vehicles.getVehicleImages, [vehicleId])
  const images = computed(() => vehicleImagesSubscription.response ?? [])

  useNavigation({
    left: route.name === 'vehicles.view' ? { title: 'Garage', route: routes.vehicles() } : undefined,
  })
</script>

<style>
.vehicle-page {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.vehicle-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vehicle-page__hero {
  padding-top: 50%;
  margin: var(--space-3) var(--space-5);
}

.vehicle-page__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.vehicle-page__gallery-image {
  height: 100px;
  width: 100px;
}
</style>