import { sm2 } from 'sm-crypto'

import config from '@/config';

/**
 * path to camel
 */
export const path2Camel = (path:string): string => {
	return path.replace(/\/(\w)/g, (all, letter)=>letter.toUpperCase())
}

export const isExternalLink = (url:string): boolean => {
	return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

export const parseUrl = (url: string): string => {
	return url.replace('{{url.api}}', config.url.api)
}

export const formatFileSize = (size: number, precision: number = 2): string => {
	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
	let index = Math.floor(Math.log(size)/Math.log(1024))
	return (size/Math.pow(1024, index)).toFixed(precision) + '' + units[index]
}

export const uuid = (split:string='-'):string => {
	let uuid = ''
	for (let i = 0; i < 32; i++) {
		let random = (Math.random() * 16) | 0
		if (i === 8 || i === 12 || i === 16 || i === 20) {
			uuid += split
		}
		uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
	}
	return uuid
}

/**
 * sm2加密
 * @param data 待加密数据
 * @return 加密后的数据
 */
export const sm2Encrypt = (data: string): string => {
	return '04' + sm2.doEncrypt(data, config.app.sm2, 1)
}