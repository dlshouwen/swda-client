// import cookies
import Cookies from 'js-cookie'

// const token key
const TOKEN_KEY = 'token'

/**
 * get cookies
 * @param key
 * @param defaultValue
 * @returns cookies
 */
export const getCookies = (key, defaultValue) => Cookies.get(key) ? JSON.parse(Cookies.get(key)) : defaultValue

/**
 * set cookies
 * @param key
 * @param value
 */
export const setCookies = (key, value) => Cookies.set(key, JSON.stringify(value))

/**
 * remove cookies
 * @param key
 */
export const removeCookies = (key) => Cookies.remove(key)

/**
 * get token
 * @returns token
 */
export const getToken = () => getCookies(TOKEN_KEY)

/**
 * set token
 * @param token
 */
export const setToken = (token) => setCookies(TOKEN_KEY, token)

/**
 * remove token
 */
export const removeToken = () => removeCookies(TOKEN_KEY)