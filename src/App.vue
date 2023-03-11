<template>
  <MenuHeader />
  <NavigationHeader />
  <router-view />
</template>

<script lang="ts" setup>
  import { useColorTheme } from '@prefecthq/prefect-design'
  import { provide } from 'vue'
  import MenuHeader from '@/components/MenuHeader.vue'
  import NavigationHeader from '@/components/NavigationHeader.vue'
  import { ApiConfig } from '@/services'
  import { apiKey, createApi } from '@/services/createApi'

  const { setTheme } = useColorTheme()
  setTheme('dark')

  const config: ApiConfig = {
    baseUrl: 'localhost:4200',
  }
  const api = createApi(config)
  provide(apiKey, api)
</script>

<style>
  html, body {
    background-color: var(--slate-900);
  }
</style>