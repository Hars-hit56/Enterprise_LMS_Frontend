import axios from 'axios'
import { authTokenStorageKey } from '../utils/constants'
import {
  API_ENDPOINT_AUTH_LOGIN,
  API_ENDPOINT_AUTH_SIGNUP,
} from './apiTypes'

const apiBaseUrl = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  'https://enterprise-lms-backend.onrender.com/'
).replace(/\/$/, '')

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

const publicAuthPaths = [API_ENDPOINT_AUTH_LOGIN, API_ENDPOINT_AUTH_SIGNUP]
const authCookieName = 'token'

function saveAuthCookie(token: string) {
  document.cookie = `${authCookieName}=${encodeURIComponent(
    token,
  )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `${authCookieName}=; path=/; max-age=0; SameSite=Lax`
}

export function getAuthToken() {
  return localStorage.getItem(authTokenStorageKey)
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem(authTokenStorageKey, token)
    saveAuthCookie(token)
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  localStorage.removeItem(authTokenStorageKey)
  clearAuthCookie()
  delete apiClient.defaults.headers.common.Authorization
}

apiClient.interceptors.request.use((config) => {
  if (config.url && publicAuthPaths.includes(config.url)) {
    return config
  }

  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

setAuthToken(getAuthToken())
