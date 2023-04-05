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
        <SizedImage :image="image" class="vehicle-page__gallery-image" @click="fullScreenImage = image" />
      </template>
    </div>

    <p-modal v-model:show-modal="showModal" class="vehicle-page__full-screen-modal">
      <SizedImage :image="fullScreenImage" class="vehicle-page__full-screen-image" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useRouteParam, useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import ContactCard from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import VehicleLabel from '@/components/VehicleLabel.vue'
  import { useApi, useNavigation } from '@/compositions'
  import { Image } from '@/models'
  import { routes } from '@/router/routes'

  const route = useRoute()
  const vehicleId = useRouteParam('vehicleId')
  const api = useApi()
  const fullScreenImage = ref<Image>()

  const showModal = computed({
    get() {
      return fullScreenImage.value !== undefined
    },
    set(value) {
      if (!value) {
        fullScreenImage.value = undefined
      }
    },
  })

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

.vehicle-page__full-screen-modal .p-modal__card {
  width: 100%;
  max-width: unset;
}

.vehicle-page__full-screen-modal .p-modal__body {
  padding: 0;
}

.vehicle-page__full-screen-image {
  padding-top: 50%;
  width: 100%;
}
</style>