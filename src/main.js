import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import axiosInstance from './utils/axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Axios 인스턴스 Vue 앱에 추가
app.config.globalProperties.$http = axiosInstance

app.mount('#app')

