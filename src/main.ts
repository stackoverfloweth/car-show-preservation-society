import '@prefecthq/prefect-design/dist/style.css'
import '@/styles/index.css'

import { plugin as PrefectDesign } from '@prefecthq/prefect-design'
import { createApp } from 'vue'
import App from '@/App.vue'
import { router } from '@/router'

const app = createApp(App)
  .use(PrefectDesign)
  .use(router)

app.mount('#app')