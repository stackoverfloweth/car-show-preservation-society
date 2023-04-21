<template>
  <p-card class="ballot-list-item">
    <div class="ballot-list-item__document">
      Official Ballot
    </div>
    <div class="ballot-list-item__name">
      {{ ballotName }}
    </div>
    <img :src="seal">
  </p-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import seal from '@/icons/csps-seal.svg'
  import { currentUser } from '@/services/auth'

  const props = defineProps<{
    index: number,
  }>()

  const ballotName = computed(() => `${currentUser.displayName.slice(0, 2) }000${props.index + 1}`)
</script>

<style>
.ballot-list-item {
  width: 200px;
  height: 270px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.ballot-list-item__document {
  font-weight: bold;
}

.ballot-list-item__name {
  text-transform: uppercase;
}
</style>