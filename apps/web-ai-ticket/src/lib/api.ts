import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // 后端接口前缀
  timeout: 5000,
})

// 请求拦截器：自动带上 token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// 响应拦截器：处理 401 错误（token 过期或未登录）
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token')
      window.location.href = '/login' // 踢回登录页
    }
    return Promise.reject(error)
  },
)

export default api
