import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import { i18n } from './i18n/index'
import { vueQueryPluginOptions } from './tanstack/index'
import { useAuthStore } from './stores/auth'

import './assets/main.css'

const app = createApp(App)

// Register all Element Plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// Create Pinia store
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.use(VueQueryPlugin, vueQueryPluginOptions)

// Initialize auth store after all plugins are loaded
const authStore = useAuthStore()

// Initialize authentication
authStore.checkAuth().then(() => {
  console.log('Authentication initialized')
})

app.mount('#app')