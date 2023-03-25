<template>
  <div class="advertisement-size-select">
    <template v-for="size in standardSizes" :key="getSizeKey(size)">
      <div class="advertisement-size-select__option" :style="styles.option(size)">
        <button type="button" class="advertisement-size-select__button" :class="classes.button(size)" :style="styles.button(size)" @click="setSize(size)">
          <template v-if="advertisementWithoutSize && !advertisementEmpty">
            <SponsorCard class="advertisement-size-select__sponsor-card" :advertisement="advertisementWithoutSize" />
          </template>
          <template v-else>
            {{ size.height }} x {{ size.width }}
          </template>
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { useIsSame } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import SponsorCard from '@/components/SponsorCard.vue'
  import { defaultSize, standardSizes } from '@/models/advertisement'
  import { AdvertisementRequest } from '@/models/api'
  import { Size } from '@/models/size'

  const props = defineProps<{
    modelValue: Size | undefined | null,
    advertisement?: AdvertisementRequest,
  }>()

  const emit = defineEmits<{
    (event: 'update:modelValue', value: Size | null): void,
  }>()

  const modelValue = computed({
    get() {
      return props.modelValue ?? defaultSize
    },
    set(value) {
      emit('update:modelValue', value)
    },
  })

  const modelValueKey = computed(() => getSizeKey(modelValue.value))

  const advertisementWithoutSize = computed(() => {
    if (!props.advertisement) {
      return undefined
    }

    return {
      ...props.advertisement,
      size: undefined,
    }
  })

  const advertisementEmpty = useIsSame(advertisementWithoutSize, {})

  const classes = computed(() => ({
    button: (size: Size) => ({
      'advertisement-size-select__button--active': getSizeKey(size) === modelValueKey.value,
      'advertisement-size-select__button--show-inactive': getSizeKey(size) !== modelValueKey.value && !advertisementEmpty.value,
    }),
  }))

  const styles = computed(() => ({
    option: (size: Size) => ({
      'grid-area': getSizeKey(size),
    }),
    button: (size: Size) => ({
      height: size.height,
      width: size.width,
    }),
  }))

  function setSize(size: Size): void {
    modelValue.value = size
  }

  function getSizeKey(size: Size): string {
    const lookup: Record<string, string> = {
      '200px300px': 'TwoByThree',
      '200px200px': 'TwoByTwo',
      '250px250px': 'TwoFiftyByTwoFifty',
      '100px300px': 'OneByThree',
      '50px300px': 'FiftyByThree',
    }

    return lookup[size.height.toString() + size.width.toString()]
  }
</script>

<style>
.advertisement-size-select {
  display: grid;
  grid-template-areas:
    'TwoByThree TwoByTwo'
    'TwoFiftyByTwoFifty OneByThree'
    'TwoFiftyByTwoFifty FiftyByThree';
  grid-template-columns: 300px 300px;
  grid-template-rows: 200px 100px 1fr;
  row-gap: var(--space-5);
}

.advertisement-size-select__option {
  display: flex;
  border: none;
  border-radius: var(--rounded);
  justify-content: center;
}

.advertisement-size-select__button {
  border-radius: var(--rounded);
  border: 1px solid var(--slate-500);
  outline-offset: var(--space-1);
  background-color: var(--slate-800);
  color: var(--slate-500);
  overflow: hidden;
}

.advertisement-size-select__button--active {
  outline: 2px solid var(--blue-600);
}

.advertisement-size-select__button--show-inactive {
  opacity: 0.5;
}

.advertisement-size-select__sponsor-card {
  border-radius: 0;
}
</style>