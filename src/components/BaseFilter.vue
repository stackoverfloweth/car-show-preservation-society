<template>
  <div class="base-filter" :class="classes">
    <template v-if="!isOpen">
      <p-button class="base-filter__mobile" inset icon="FunnelIcon" @click="open" />
    </template>
    <template v-else>
      <p-button class="base-filter__mobile" inset icon="XMarkIcon" @click="close" />
    </template>

    <div class="base-filter__filter">
      <div class="base-filter__mobile">
        Filter
      </div>
      <slot name="filter" />
    </div>

    <div class="base-filter__sort">
      <div class="base-filter__mobile">
        Sort
      </div>
      <slot name="sort" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'

  const isOpen = ref(false)

  const classes = computed(() => ({
    'base-filter--open': isOpen.value,
  }))

  function open(): void {
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }
</script>

<style>
.base-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.base-filter__mobile {
  display: none;
  font-size: .9rem;
  justify-content: space-around;
  align-items: center;
}

.base-filter__input {
  border: none;
}

.base-filter .p-select-button,
.base-filter .p-native-select,
.base-filter .p-select-button:focus {
  border: none !important;
  box-shadow: none;
  padding: 1px 0;
}

.base-filter .p-select-button:active,
.base-filter .p-select--open {
  outline-offset: 2px;
  outline: 2px solid var(--blue-500);
}

.base-filter__filter,
.base-filter__sort {
  display: flex;
  gap: var(--space-3);
}

@media(max-width: 768px){
  .base-filter {
    justify-content: end;
    align-items: start;
  }

  .base-filter__filter,
  .base-filter__sort {
    display: none;
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .base-filter--open .base-filter__filter,
  .base-filter--open .base-filter__sort {
    display: flex;
  }

  .base-filter__mobile {
    display: flex;
  }

  .base-filter .p-button__content {
    justify-content: start;
  }

  .base-filter__input {
    max-width: unset;
  }
}
</style>