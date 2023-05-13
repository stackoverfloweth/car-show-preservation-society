<template>
  <MenuHeader />
  <NavigationHeader v-bind="{ left, center, right }" />
  <div>user: {{ user }}</div>
  <router-view :key="$route.fullPath" />
</template>

<script lang="ts" setup>
  import { useColorTheme } from '@prefecthq/prefect-design'
  import { provide } from 'vue'
  import MenuHeader from '@/components/MenuHeader.vue'
  import NavigationHeader from '@/components/NavigationHeader.vue'
  import { useNavigation, useNetlifyAuthTokens } from '@/compositions'
  import { ApiConfig, auth } from '@/services'
  import { apiKey, createApi } from '@/services/createApi'
  import { env } from '@/utilities'

  const { setTheme } = useColorTheme()
  setTheme('dark')

  useNetlifyAuthTokens()

  const user = auth.currentUser()

  const { left, center, right } = useNavigation()

  const config: ApiConfig = {
    baseUrl: env().baseApiUrl,
  }
  const api = createApi(config)
  provide(apiKey, api)
</script>

<style>
  html, body {
    min-height: 100%;
    scroll-behavior: smooth;
    background-color: var(--gray-900);
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>