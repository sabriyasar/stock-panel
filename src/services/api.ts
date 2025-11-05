import axios from 'axios'
import { message } from 'antd'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('userToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken')
      localStorage.removeItem('userInfo')
      message.error('Oturum süreniz doldu, lütfen tekrar giriş yapın.')
      if (typeof window !== 'undefined') {
        window.location.href = '/login' // yönlendirme
      }
    }
    return Promise.reject(error)
  }
)

export default api
