// import i18n
import { createI18n } from 'vue-i18n'

// import config
import config from '@/config'

// import tools
import { local } from '@/utils/storage'

// import element i18n
import element_zh_cn from 'element-plus/es/locale/lang/zh-cn'
import element_en from 'element-plus/es/locale/lang/en'

// import sw i18n
import zh_cn from '@/i18n/lang/zh-cn'
import en from '@/i18n/lang/en'

// export messages
export const messages: { [key: string]:any } = {
	'zh-cn': {
		name: '简体中文',
		...zh_cn,
		el: { ...element_zh_cn }
	},
	'en': {
		name: 'English',
		...en,
		el: { ...element_en }
	}
}

// export i18n
export const i18n = createI18n({
	allowComposition: true,
	globalInjection: true,
	legacy: false,
	locale: local.get(config.key.lang) || config.default.lang,
	messages: messages
})