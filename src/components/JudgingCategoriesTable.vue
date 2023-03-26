<template>
  <div class="judging-categories-table">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <p-list-item>
        <span>{{ category.name }}</span>
        <p-icon :icon="category.maxCapacity ? 'CheckIcon' : 'XIcon'" />
        <span>{{ category.stripePriceId }}</span>
      </p-list-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { VotingCategory } from '@/models'

  defineProps<{
    categories: VotingCategory[],
  }>()
</script>

<style>
.judging-categories-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 518px;
  overflow-y: auto;
}
</style>