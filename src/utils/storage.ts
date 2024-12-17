/**
 * local
 */
export const local = {
	/**
	 * set
	 * @params key
	 * @params value
	 */
	set(key: string, value: any) {
		if (value === undefined) {
			return
		}
		window.localStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * get
	 * @params key
	 * @returns value
	 */
	get(key: string) {
		let value: any = window.localStorage.getItem(key)
		return JSON.parse(value)
	},
	/**
	 * remove
	 * @params key
	 */
	remove(key: string) {
		window.localStorage.removeItem(key)
	},
	/**
	 * clear
	 */
	clear() {
		window.localStorage.clear()
	}
}

/**
 * session
 */
export const session = {
	/**
	 * set
	 * @params key
	 * @params value
	 */
	set(key: string, value: any) {
		if (value === undefined) {
			return
		}
		window.sessionStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * get
	 * @params key
	 * @returns value
	 */
	get(key: string) {
		let json: any = window.sessionStorage.getItem(key)
		return JSON.parse(json)
	},
	/**
	 * remove
	 * @params key
	 */
	remove(key: string) {
		window.sessionStorage.removeItem(key)
	},
	/**
	 * clear
	 */
	clear() {
		window.sessionStorage.clear()
	}
}
