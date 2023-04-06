<template>
  <div class="vehicle-viewer">
    <div class="vehicle-viewer__header">
      <VehicleLabel :vehicle="vehicle" />
      <template v-if="canEditVehicle">
        <p-icon-button-menu>
          <p-overflow-menu-item label="Share" icon="ShareIcon" />
          <p-overflow-menu-item label="Edit" icon="PencilIcon" :to="routes.vehicleEditor(vehicle.vehicleId)" />
        </p-icon-button-menu>
      </template>
      <template v-else>
        <ContactCard :user-id="vehicle.userId" />
      </template>
    </div>
    <SizedImage :image="vehicle.profileImage" class="vehicle-viewer__hero" />
    <div class="vehicle-viewer__gallery">
      <template v-for="image in images" :key="image.imageId">
        <SizedImage :image="image" class="vehicle-viewer__gallery-image" @click="fullScreenImage = image" />
      </template>
    </div>

    <p-modal v-model:show-modal="showModal" class="vehicle-viewer__full-screen-modal" auto-close>
      <SizedImage :image="fullScreenImage" class="vehicle-viewer__full-screen-image" />
    </p-modal>
  </div>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import ContactCard from '@/components/ContactCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import VehicleLabel from '@/components/VehicleLabel.vue'
  import { useApi } from '@/compositions'
  import { Image, Vehicle } from '@/models'
  import { routes } from '@/router/routes'

  const props = defineProps<{
    vehicle: Vehicle,
  }>()

  const api = useApi()
  const fullScreenImage = ref<Image>()
  const canEditVehicle = true

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

  const vehicleImagesSubscription = useSubscription(api.vehicles.getVehicleImages, [props.vehicle.vehicleId])
  const images = computed(() => vehicleImagesSubscription.response ?? [])
</script>

<style>
.vehicle-viewer {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.vehicle-viewer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.vehicle-viewer__hero {
  padding-top: 50%;
  margin: var(--space-3) var(--space-5);
}

.vehicle-viewer__gallery {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.vehicle-viewer__gallery-image {
  height: 100px;
  width: 100px;
  cursor: pointer;
}

.vehicle-viewer__full-screen-modal .p-modal__card {
  width: 100%;
  max-width: unset;
}

.vehicle-viewer__full-screen-modal .p-modal__body {
  padding: 0;
}

.vehicle-viewer__full-screen-image {
  padding-top: 50%;
  width: 100%;
}

@media(max-width: 768px){
  .vehicle-viewer__gallery {
    justify-content: center;
  }
}
</style>