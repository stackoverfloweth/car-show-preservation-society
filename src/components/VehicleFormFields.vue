<template>
  <div class="vehicle-form-fields">
    <div class="vehicle-form-fields__column">
      <p-label label="Year" :message="yearError" :state="yearState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="year" :state="yearState" />
        </template>
      </p-label>

      <p-label label="Make" :message="makeError" :state="makeState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="make" :state="makeState" />
        </template>
      </p-label>

      <p-label label="Model" :message="modelError" :state="modelState">
        <template #default="{ id }">
          <p-text-input :id="id" v-model="model" :state="modelState" />
        </template>
      </p-label>

      <p-label label="Color" :message="colorError" :state="colorState">
        <template #description>
          Exterior body primary paint color
        </template>
        <template #default="{ id }">
          <p-text-input :id="id" v-model="color" :state="colorState" />
        </template>
      </p-label>

      <div class="vehicle-form-fields__image-upload">
        <p-label label="Photo" :message="imageError" :state="imageState" />
        <ImageUpload v-model:image="image" />
      </div>
    </div>

    <div class="vehicle-form-fields__column">
      <p-label label="Description" class="vehicle-form-fields__description" :message="descriptionError" :state="descriptionState">
        <template #default="{ id }">
          <p-textarea :id="id" v-model="description" :state="descriptionState" rows="5" />
        </template>
      </p-label>

      <p-label label="Modifications">
        <template #description>
          The following fields are used for determining eligibility in "stock" vehicle classes. Depending on the event, some require fewer than 3 total modifications, while others consider if the vehicle is "visible stock".
        </template>
      </p-label>

      <div class="vehicle-form-fields__modifications">
        <p-label label="Total Modifications Count" :message="modificationCountError" :state="modificationCountState">
          <template #description>
            Total number of modifications including exterior, interior, performance.
          </template>
          <template #default="{ id }">
            <p-number-input :id="id" v-model="modificationCount" :min="0" :max="10" :state="modificationCountState" />
          </template>
        </p-label>

        <p-label label="Is Visibly Stock" class="vehicle-form-fields__visibly-stock" :message="visiblyStockError" :state="visiblyStockState">
          <template #description>
            <template v-if="visiblyStock === undefined">
              Do any of these modifications effect the appearance of the car in any way?
            </template>
            <template v-else-if="visiblyStock">
              None of the modifications effect the appearance of the vehicle.
            </template>
            <template v-else>
              The vehicles appearance has been modified from stock.
            </template>
          </template>
          <template #default="{ id }">
            <p-toggle :id="id" v-model="visiblyStock" />
          </template>
        </p-label>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { usePatchRef, useValidation } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'
  import { VehicleRequest } from '@/models/api'

  const props = defineProps<{
    values: VehicleRequest,
  }>()

  const emit = defineEmits<{
    (vehicle: 'update:values', value: VehicleRequest): void,
  }>()

  const vehicle = computed({
    get() {
      return props.values
    },
    set(value) {
      emit('update:values', value)
    },
  })

  const make = usePatchRef(vehicle, 'make')
  const model = usePatchRef(vehicle, 'model')
  const year = usePatchRef(vehicle, 'year')
  const description = usePatchRef(vehicle, 'description')
  const color = usePatchRef(vehicle, 'color')
  const modificationCount = usePatchRef(vehicle, 'modificationCount')
  const modifiedAppearance = usePatchRef(vehicle, 'modifiedAppearance')
  const image = usePatchRef(vehicle, 'image')

  const visiblyStock = computed({
    get() {
      if (modifiedAppearance.value === undefined) {
        return undefined
      }

      return !modifiedAppearance.value
    },
    set(value) {
      modifiedAppearance.value = !value
    },
  })

  const { error: makeError, state: makeState } = useValidation(make, 'Make', [])
  const { error: modelError, state: modelState } = useValidation(model, 'Model', [])
  const { error: yearError, state: yearState } = useValidation(year, 'Year', [])
  const { error: descriptionError, state: descriptionState } = useValidation(description, 'Description', [])
  const { error: colorError, state: colorState } = useValidation(color, 'Color', [])
  const { error: modificationCountError, state: modificationCountState } = useValidation(modificationCount, 'Modification Count', [])
  const { error: visiblyStockError, state: visiblyStockState } = useValidation(visiblyStock, 'Visibly Stock', [])
  const { error: imageError, state: imageState } = useValidation(image, 'Main Image', [])
</script>

<style>
.vehicle-form-fields {
  display: grid;
  grid-template-columns: 33% minmax(0, 1fr);
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.vehicle-form-fields__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.vehicle-form-fields__modifications {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: min-content 1fr;
  column-gap: var(--space-lg);
  row-gap: var(--space-md);
}

.vehicle-form-fields__visibly-stock .p-label__body {
  height: 100%;
  display: flex;
  align-items: end;
  padding-bottom: var(--space-sm);
}

.vehicle-form-fields__image-upload {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  max-height: 150px;
}

@media(max-width: 768px){
  .vehicle-form-fields {
    grid-template-columns: 1fr;
  }

  .vehicle-form-fields__modifications {
    grid-template-columns: 1fr;
    grid-template-rows: min-content;
  }
}
</style>