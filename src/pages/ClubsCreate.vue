<template>
  <div class="clubs-create">
    club create
  </div>
</template>

<script lang="ts" setup>
  import { useNavigation } from '@/compositions'
  import { routes } from '@/router/routes'

  useNavigation({ name: 'clubs', route: routes.clubs() }, 'Create Club')
</script>

<style>

</style>