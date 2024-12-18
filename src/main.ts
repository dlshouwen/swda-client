/** import vue */
import { createApp } from 'vue'
/** import element plus */
import ElementPlus from 'element-plus'
/** import element plus icons vue */
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { router } from './router'

/** import app */
import App from './App.vue'
/** import pinia */
import { createPinia } from 'pinia'

import { i18n } from './i18n'

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

app.use(router)

app.use(i18n)

// mount app
app.mount('#app')