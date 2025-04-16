// export handle theme style
export const handleThemeStyle = (theme: any) => {
}

/**
 * hex to rgb
 * @param hex
 * @returns rgb
 */
const hexToRgb = (hex: any) => {
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
const rgbToHex = (r: any, g: any, b: any) => {
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
const getLighterColor = (color: string, level: number) => {
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
const getDarkerColor = (color: string, level: number) => {
	let rgb = hexToRgb(color)
	for (let i = 0; i < 3; i++) {
		rgb[i] = Math.floor(rgb[i] * (1 - level))
	}
	return rgbToHex(rgb[0], rgb[1], rgb[2])
}
