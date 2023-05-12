<template>
  <p-card class="ballot-list-item">
    <div class="ballot-list-item__document">
      Official Ballot
    </div>
    <div class="ballot-list-item__name">
      {{ ballot.name }}
    </div>
    <component :is="seal" class="ballot-list-item__seal" />
  </p-card>
</template>

<script lang="ts" setup>
  import seal from '@/icons/csps-seal.svg'
  import { Ballot } from '@/models'

  defineProps<{
    ballot: Ballot,
  }>()
</script>

<style>
.ballot-list-item {
  width: 200px;
  height: 270px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
}

.ballot-list-item__document {
  font-weight: bold;
}

.ballot-list-item__name {
  text-transform: uppercase;
}

.ballot-list-item__seal {
  color: var(--blue-600);
}
</style>