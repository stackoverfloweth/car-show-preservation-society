<template>
  <MenuHeader />
  <NavigationHeader />
  <router-view />
</template>

<script lang="ts" setup>
  import { useColorTheme } from '@prefecthq/prefect-design'
  import MenuHeader from '@/components/MenuHeader.vue'
  import NavigationHeader from '@/components/NavigationHeader.vue'

  const { setTheme } = useColorTheme()
  setTheme('dark')
</script>

<style>
  html, body {
    background-color: var(--slate-900);
  }
</style>