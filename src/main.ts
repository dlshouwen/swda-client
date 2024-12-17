/** import vue */
import { createApp } from 'vue'
/** import element plus */
import ElementPlus from 'element-plus'
/** import element plus icons vue */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
/** import app */
import App from './App.vue'
/** import pinia */
import { createPinia } from 'pinia'

// create app
const app = createApp(App)

// use pinia
app.use(createPinia())

// regist element plus icon
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
	app.component(key, component)
}

// use element plug
app.use(ElementPlus)

// mount app
app.mount('#app')