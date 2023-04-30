<template>
  <div class="vehicle-viewer">
    <div class="vehicle-viewer__header">
      <VehicleLabel :vehicle="vehicle" />
      <template v-if="canEditVehicle">
        <p-icon-button-menu>
          <p-overflow-menu-item label="Share" icon="ShareIcon" />
          <p-overflow-menu-item label="Edit Vehicle" icon="PencilIcon" :to="routes.vehicleEditor(vehicle.vehicleId)" />
        </p-icon-button-menu>
      </template>
      <template v-else>
        <ContactIdCard :user-id="vehicle.userId" />
      </template>
    </div>
    <SizedImage :image="vehicle.image" class="vehicle-viewer__hero" />
    <VehiclePhotoGallery :vehicle-id="vehicle.vehicleId" />
  </div>
</template>

<script lang="ts" setup>
  import ContactIdCard from '@/components/ContactIdCard.vue'
  import SizedImage from '@/components/SizedImage.vue'
  import VehicleLabel from '@/components/VehicleLabel.vue'
  import VehiclePhotoGallery from '@/components/VehiclePhotoGallery.vue'
  import { useCanEditVehicle } from '@/compositions'
  import { Vehicle } from '@/models'
  import { routes } from '@/router/routes'

  defineProps<{
    vehicle: Vehicle,
  }>()

  const canEditVehicle = useCanEditVehicle()
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
</style>