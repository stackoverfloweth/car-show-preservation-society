<template>
  <div class="sponsor-size-select">
    <template v-for="size in standardSizes" :key="getSizeKey(size)">
      <div class="sponsor-size-select__option" :class="classes.option(size)">
        <button type="button" class="sponsor-size-select__button" :class="classes.button(size)" @click="setSize(size)">
          <div class="sponsor-size-select__button-content">
            <template v-if="advertisementFormFields && !advertisementEmpty">
              <SponsorCard class="sponsor-size-select__sponsor-card" :advertisement="advertisementFormFields" />
            </template>
            <template v-else>
              {{ size.width.replace("px", "") }} x {{ size.height.replace("px", "") }}
            </template>
          </div>
        </button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
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

  const advertisementFormFields = computed(() => {
    if (!props.advertisement) {
      return undefined
    }

    const { image, title, description } = props.advertisement

    return { image, title, description }
  })

  const advertisementEmpty = computed(() => {
    if (!advertisementFormFields.value) {
      return true
    }

    const { image, title, description } = advertisementFormFields.value
    return !image && !title && !description
  })

  const classes = computed(() => ({
    option: (size: Size) => [`sponsor-size-select__option--${getSizeKey(size)}`],
    button: (size: Size) => ({
      'sponsor-size-select__button--active': getSizeKey(size) === modelValueKey.value,
      'sponsor-size-select__button--show-inactive': getSizeKey(size) !== modelValueKey.value && !advertisementEmpty.value,
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
.sponsor-size-select {
  display: grid;
  grid-template-areas:
    'TwoByThree TwoByTwo'
    'TwoFiftyByTwoFifty OneByThree'
    'TwoFiftyByTwoFifty FiftyByThree';
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: var(--space-lg);
  max-width: 600px;
}

.sponsor-size-select__option {
  display: flex;
  border: none;
  border-radius: var(--rounded);
  justify-content: center;
}

.sponsor-size-select__option--TwoByThree {
  grid-area: TwoByThree;
}

.sponsor-size-select__option--TwoByThree .sponsor-size-select__button {
  padding-top: 66.66%;
}

.sponsor-size-select__option--TwoByTwo {
  grid-area: TwoByTwo;
}

.sponsor-size-select__option--TwoByTwo .sponsor-size-select__button {
  margin-left: 33.33%;
  padding-top: 33.33%;
}

.sponsor-size-select__option--TwoFiftyByTwoFifty {
  grid-area: TwoFiftyByTwoFifty;
}

.sponsor-size-select__option--TwoFiftyByTwoFifty .sponsor-size-select__button {
  margin-right: 16.66%;
  padding-top: 82.68%;
}

.sponsor-size-select__option--OneByThree {
  grid-area: OneByThree;
}

.sponsor-size-select__option--OneByThree .sponsor-size-select__button {
  padding-top: 30%;
  margin-bottom: 12%;
}

.sponsor-size-select__option--FiftyByThree {
  grid-area: FiftyByThree;
}

.sponsor-size-select__option--FiftyByThree .sponsor-size-select__button {
  margin-top: 10%;
  padding-top: 15%
}

.sponsor-size-select__button {
  border-radius: var(--rounded);
  border: 1px solid var(--gray-500);
  outline-offset: var(--space-xxxs);
  background-color: var(--gray-800);
  color: var(--gray-500);
  overflow: hidden;
  width: 100%;
  position: relative;
}

.sponsor-size-select__button--active {
  outline: 2px solid var(--blue-600);
}

.sponsor-size-select__button--show-inactive {
  opacity: 0.5;
}

.sponsor-size-select__button-content {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sponsor-size-select__sponsor-card {
  border-radius: 0;
}
</style>