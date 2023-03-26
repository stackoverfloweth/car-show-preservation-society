<template>
  <div class="judging-categories-table">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <p-list-item class="judging-categories-table__category">
        <div class="judging-categories-table__name">
          <p>{{ category.name }}</p>
        </div>
        <p class="judging-categories-table__description">
          {{ category.description }}
        </p>
        <div class="judging-categories-table__info-badges">
          <template v-if="mocker.create('boolean')">
            <p-icon-text class="judging-categories-table__info-badge judging-categories-table__info-badge--green" icon="CurrencyDollarIcon">
              +40
            </p-icon-text>
          </template>
          <template v-if="category.maxCapacity">
            <template v-if="category.maxCapacity > 5">
              <p-icon-text class="judging-categories-table__info-badge judging-categories-table__info-badge--yellow" icon="ExclamationIcon" :text="`Only ${category.maxCapacity} ${toPluralString('spot', category.maxCapacity)} open`" />
            </template>
            <template v-else>
              <p-icon-text class="judging-categories-table__info-badge judging-categories-table__info-badge--red" icon="BanIcon" text="Full" />
            </template>
          </template>
        </div>
      </p-list-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { VotingCategory } from '@/models'
  import { mocker } from '@/services'
  import { toPluralString } from '@/utilities'

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

.judging-categories-table__category {
  display: grid;
  grid-template-areas:
    'name info-badges'
    'description description';
  grid-template-columns: minmax(0, 1fr) min-content;
  column-gap: var(--space-4);
  row-gap: var(--space-2);
}

.judging-categories-table__name {
  grid-area: name;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.judging-categories-table__info-badges {
  display: flex;
  align-items: center;
  grid-area: info-badges;
  gap: var(--space-2);
}

.judging-categories-table__info-badge {
  white-space: nowrap;
  border-radius: var(--rounded);
  padding: var(--space-2) var(--space-3);
}

.judging-categories-table__info-badge--red {
  background-color: var(--red-800);
}

.judging-categories-table__info-badge--yellow {
  background-color: var(--yellow-800);
}

.judging-categories-table__info-badge--green {
  background-color: var(--green-800);
}

.judging-categories-table__description {
  grid-area: description;
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
}
</style>