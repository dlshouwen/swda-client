import { createI18n } from 'vue-i18n'
import cache from '@/cache'

import element_zh_cn from 'element-plus/es/locale/lang/zh-cn'
import element_en from 'element-plus/es/locale/lang/en'

import zh_cn from '@/i18n/lang/zh-cn'
import en from '@/i18n/lang/en'

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

export const i18n = createI18n({
	allowComposition: true,
	globalInjection: true,
	legacy: false,
	locale: cache.getLang(),
	messages: messages
})