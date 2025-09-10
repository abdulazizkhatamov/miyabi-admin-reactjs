// src/shared/lib/api.ts
import axios from 'axios'
import { env } from '@/config/env.config'

// In-memory storage for CSRF token
let csrfToken: string | null = null

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: env.VITE_SERVER_URL,
  withCredentials: true, // send cookies with requests
})

// Function to fetch CSRF token
const fetchCsrfToken = async () => {
  try {
    const response = await axiosInstance.get('/auth/csrf-token')
    // Adjust if your backend returns token in 'token'
    csrfToken = response.data.token
    return csrfToken
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error)
    throw error
  }
}

// Request interceptor to add CSRF token for state-changing requests
axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase() ?? ''
    const url = config.url ?? ''

    // Don't add CSRF token for safe methods or for CSRF token endpoint itself
    if (method === 'get' || url.endsWith('/auth/csrf-token')) {
      return config
    }

    // If token is missing, fetch it before proceeding
    if (!csrfToken) {
      await fetchCsrfToken()
    }

    // Add CSRF token header
    config.headers['x-csrf-token'] = csrfToken!

    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor to handle CSRF token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 403 && // Forbidden - likely CSRF token invalid
      !originalRequest._retry && // prevent infinite retry loops
      !originalRequest.url?.endsWith('/auth/csrf-token')
    ) {
      originalRequest._retry = true
      try {
        // Refresh CSRF token
        await fetchCsrfToken()
        // Update request with new token
        originalRequest.headers['x-csrf-token'] = csrfToken!
        // Retry original request
        return axiosInstance(originalRequest)
      } catch (retryError) {
        console.error('Retry after CSRF token fetch failed:', retryError)
        return Promise.reject(retryError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
