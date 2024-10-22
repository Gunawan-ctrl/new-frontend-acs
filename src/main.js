import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'boxicons/css/boxicons.min.css'
import { createPinia } from 'pinia'

// styling
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import './index.css'

// fa icon
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
const pinia = createPinia()
app.component('font-awesome-icon', FontAwesomeIcon)
library.add(fas)

app.use(pinia)
app.use(router)
app.use(Antd)

app.mount('#app')
