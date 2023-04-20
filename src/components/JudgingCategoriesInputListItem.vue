<template>
  <p-list-item-input
    v-model:selected="selected"
    class="judging-categories-input-list-item"
    :value="category.votingCategoryId"
  >
    <div class="judging-categories-input-list__category" @click="editCategory(category)">
      <div class="judging-categories-input-list__name">
        {{ category.name }}
      </div>
      <div class="judging-categories-input-list__description">
        {{ category.description }}
      </div>
      <div class="judging-categories-input-list__info-badges">
        <template v-if="category.stripePriceId">
          <p-icon-text class="judging-categories-input-list__info-badge" icon="CurrencyDollarIcon">
            2.00
          </p-icon-text>
        </template>
        <p-icon-text class="judging-categories-input-list__info-badge" icon="ClipboardCheckIcon">
          {{ category.driversOnly ? 'drivers only' : 'everyone' }}
        </p-icon-text>
        <template v-if="category.maxCapacity !== Infinity">
          <p-icon-text class="judging-categories-input-list__info-badge" icon="UserGroupIcon">
            max: {{ category.maxCapacity }}
          </p-icon-text>
        </template>
      </div>
    </div>
  </p-list-item-input>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { VotingCategory } from '@/models'

  const props = defineProps<{
    category: VotingCategory,
    selected?: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'edit:category', value: VotingCategory): void,
    (event: 'update:selected', value: boolean): void,
  }>()

  const selected = computed({
    get() {
      return props.selected
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  function editCategory(votingCategory: VotingCategory): void {
    emit('edit:category', votingCategory)
  }
</script>

<style>

</style>