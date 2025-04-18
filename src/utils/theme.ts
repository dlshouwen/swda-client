/**
 * set primary color
 * @param color
 */
export const setPrimaryColor = (color: string) => {
	// set primary color
	document.documentElement.style.setProperty('--el-color-primary', color)
	// for each level
	for (let i = 1; i <= 9; i++) {
		// set light color
		document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLighterColor(color, i / 10)}`)
		// set dark color
		document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkerColor(color, i / 10)}`)
	}
}

/**
 * hex to rgb
 * @param hex
 * @returns rgb
 */
export const hexToRgb = (hex: any) => {
	hex = hex.replace('#', '')
	let rgb = hex.match(/../g)
	for (let i = 0; i < 3; i++) {
		rgb[i] = parseInt(rgb[i], 16)
	}
	return rgb
}

/**
 * rgb to hex
 * @param r
 * @param g
 * @param b
 * @returns hex
 */
export const rgbToHex = (r: any, g: any, b: any) => {
	let hex = [r.toString(16), g.toString(16), b.toString(16)]
	for (let i = 0; i < 3; i++) {
		if (hex[i].length == 1) {
			hex[i] = `0${hex[i]}`
		}
	}
	return `#${hex.join('')}`
}

/**
 * get lighter color
 * @param color
 * @param level
 * @returns lighter color
 */
export const getLighterColor = (color: string, level: number) => {
	let rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) {
		rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
	}
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * get darker color
 * @param color
 * @param level
 * @returns darker color
 */
export const getDarkerColor = (color: string, level: number) => {
	let rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) {
		rgb[i] = Math.floor(rgb[i] * (1 - level))
	}
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}
