<template>
  <p-list-item
    class="judging-categories-list-item"
    :class="classes"
    @click="selected = !selected"
  >
    <div class="judging-categories-list-item__name">
      <p>{{ category.name }}</p>
    </div>
    <p class="judging-categories-list-item__description">
      {{ category.description }}
    </p>
    <div class="judging-categories-list-item__info-badges">
      <template v-if="category.featured">
        <p-icon-text class="judging-categories-list-item__info-badge judging-categories-list-item__info-badge--primary" icon="StarIcon" text="Featured" />
      </template>
      <template v-if="category.stripePriceId">
        <p-icon-text class="judging-categories-list-item__info-badge judging-categories-list-item__info-badge--green" icon="CurrencyDollarIcon">
          +40
        </p-icon-text>
      </template>
      <template v-if="!category.hasCapacity">
        <p-icon-text class="judging-categories-list-item__info-badge judging-categories-list-item__info-badge--red" icon="BanIcon" text="Full" />
      </template>
      <template v-else-if="category.openSlots < 5">
        <p-icon-text class="judging-categories-list-item__info-badge judging-categories-list-item__info-badge--yellow" icon="ExclamationIcon" :text="`Only ${category.openSlots} ${toPluralString('spot', category.openSlots)} open`" />
      </template>
    </div>
  </p-list-item>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { VotingCategory } from '@/models'
  import { toPluralString } from '@/utilities'

  const props = defineProps<{
    category: VotingCategory,
    selected?: boolean,
  }>()

  const emit = defineEmits<{
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

  const classes = computed(() => ({
    'judging-categories-list-item--selected': selected.value,
  }))
</script>

<style>
.judging-categories-list-item {
  display: grid;
  grid-template-areas:
    'name info-badges'
    'description description';
  grid-template-columns: minmax(0, 1fr) min-content;
  column-gap: var(--space-4);
  row-gap: var(--space-3);
}

.judging-categories-list-item--selected {
  background-color: var(--slate-600);
}

.judging-categories-list-item__name {
  grid-area: name;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.judging-categories-list-item__description {
  grid-area: description;
  color: var(--slate-400);
  font-size: .75rem;
  line-height: 0.95rem;
}

.judging-categories-list-item__info-badges {
  display: flex;
  align-items: center;
  grid-area: info-badges;
  gap: var(--space-2);
}

.judging-categories-list-item__info-badge {
  white-space: nowrap;
  border-radius: var(--rounded);
  padding: var(--space-2) var(--space-3);
}

.judging-categories-list-item__info-badge--red {
  background-color: var(--red-800);
}

.judging-categories-list-item__info-badge--yellow {
  background-color: var(--yellow-800);
}

.judging-categories-list-item__info-badge--green {
  background-color: var(--green-800);
}

.judging-categories-list-item__info-badge--primary {
  background-color: var(--blue-800);
}
</style>