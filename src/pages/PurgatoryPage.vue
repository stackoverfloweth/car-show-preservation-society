<template>
  <div class="purgatory-page">
    Site is under construction. To access beta, enter password

    <p-form @submit="submit">
      <p-label label="Password">
        <p-text-input v-model="password" />
      </p-label>

      <div class="purgatory-page__actions">
        <p-button type="submit">
          Submit
        </p-button>
      </div>
    </p-form>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { password } from '@/router/guards/saintPeter'
  import { routes } from '@/router/routes'

  const router = useRouter()

  function submit(): void {
    router.push(routes.home())
  }
</script>

<style>
.purgatory-page {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
</style>