<template>
  <div class="judging-categories-input-table">
    <template v-for="category in categories" :key="category.votingCategoryId">
      <p-list-item-input
        v-model:selected="selected"
        :value="category.votingCategoryId"
      >
        <div class="judging-categories-input-table__category" @click="editCategory(category)">
          <div class="judging-categories-input-table__name">
            {{ category.name }}
          </div>
          <div class="judging-categories-input-table__description">
            {{ category.description }}
          </div>
          <div class="judging-categories-input-table__info-badges">
            <template v-if="mocker.create('boolean')">
              <p-icon-text class="judging-categories-input-table__info-badge" icon="CurrencyDollarIcon">
                {{ category.stripePriceId ?? '+2.00' }}
              </p-icon-text>
            </template>
            <p-icon-text class="judging-categories-input-table__info-badge" icon="ClipboardCheckIcon">
              {{ category.driversOnly ? 'drivers only' : 'everyone' }}
            </p-icon-text>
            <template v-if="category.maxCapacity">
              <p-icon-text class="judging-categories-input-table__info-badge" icon="UserGroupIcon">
                max: {{ category.maxCapacity }}
              </p-icon-text>
            </template>
          </div>
        </div>
      </p-list-item-input>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { VotingCategory } from '@/models'
  import { mocker } from '@/services'

  const props = defineProps<{
    categories: VotingCategory[],
    selected: string[],
  }>()

  const emit = defineEmits<{
    (event: 'edit:category', value: VotingCategory): void,
    (event: 'update:selected', value: string[]): void,
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
.judging-categories-input-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.judging-categories-input-table .p-list-item-input__content {
  padding: 0;
}

.judging-categories-input-table__category:hover {
  cursor: pointer;
  background-color: var(--slate-700);
}

.judging-categories-input-table__category {
  display: grid;
  grid-template-areas:
    'name info-badges'
    'description description';
  grid-template-columns: minmax(0, 1fr) min-content;
  padding: var(--space-4);
}

.judging-categories-input-table__name {
  grid-area: name;
}

.judging-categories-input-table__description {
  grid-area: description;
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
}

.judging-categories-input-table__info-badges {
  display: flex;
  align-items: center;
  grid-area: info-badges;
  gap: var(--space-2);
}

.judging-categories-input-table__info-badge {
  white-space: nowrap;
  border-radius: var(--rounded);
  padding: var(--space-2) var(--space-3);
  background-color: var(--slate-600);
}
</style>