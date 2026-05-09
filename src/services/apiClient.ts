import axios from 'axios'
import { authTokenStorageKey } from '../utils/constants'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'https://enterprise-lms-backend.onrender.com/').replace(
  /\/$/,
  '',
)

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (config.url === '/api/auth/login' || config.url === '/api/auth/signup') {
    return config
  }

  const token = localStorage.getItem(authTokenStorageKey)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
