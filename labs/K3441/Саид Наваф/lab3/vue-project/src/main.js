import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/assets/main.css'
import App from '@/App.vue'
import router from '@/router'
import { setUnauthorizedHandler } from '@/api'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const auth = useAuthStore()
setUnauthorizedHandler(() => {
  const redirect = router.currentRoute.value.fullPath
  auth.logout()
  router.push({ name: 'login', query: { redirect } })
})

app.mount('#app')
