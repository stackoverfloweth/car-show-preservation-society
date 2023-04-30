<template>
  <p-list-item-input
    v-model:selected="selected"
    class="judging-categories-input-list-item"
    :value="category.votingCategoryId"
  >
    <div class="judging-categories-input-list-item__category" @click="editCategory(category)">
      <div class="judging-categories-input-list-item__name">
        {{ category.name }}
      </div>
      <div class="judging-categories-input-list-item__description">
        {{ category.description }}
      </div>
      <div class="judging-categories-input-list-item__info-badges">
        <template v-if="category.featured">
          <p-tag class="judging-categories-input-list-item__info-badge judging-categories-input-list-item__info-badge--featured" icon="StarIcon" label="Featured" />
        </template>
        <template v-if="category.stripePriceId">
          <p-tag class="judging-categories-input-list-item__info-badge" icon="CurrencyDollarIcon" label="2.00" />
        </template>
        <template v-if="category.automaticEntry">
          <p-tag class="judging-categories-input-list-item__info-badge" icon="LightningBoltIcon" label="Automatic Entry" />
        </template>
        <p-tag v-if="category.restricted" class="judging-categories-input-list-item__info-badge" icon="ClipboardCheckIcon">
          <template v-if="category.driversOnly">
            Drivers Only
          </template>
          <template v-else>
            Members Only
          </template>
        </p-tag>
        <template v-if="category.maxCapacity">
          <p-tag class="judging-categories-input-list-item__info-badge" icon="UserGroupIcon">
            max: {{ category.maxCapacity }}
          </p-tag>
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
.judging-categories-input-list-item__category:hover {
  cursor: pointer;
  background-color: var(--slate-700);
}

.judging-categories-input-list-item__category {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.judging-categories-input-list-item__description {
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
}

.judging-categories-input-list-item__info-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.judging-categories-input-list-item__info-badge {
  border: 1px solid var(--slate-500)
}

.judging-categories-input-list-item__info-badge--featured {
  background-color: var(--blue-600) !important;
  border: 1px solid var(--blue-500)
}
</style>