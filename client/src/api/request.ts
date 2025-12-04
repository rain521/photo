import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { API_CONFIG, ResponseCode, ResponseMessage } from './config'

// 响应数据接口
export interface ApiResponse<T = any> {
  status?: number
  message?: string
  data?: T
  success?: boolean
}

// 扩展 AxiosRequestConfig
export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示 loading
  showLoading?: boolean
  // 是否显示错误提示
  showError?: boolean
  // 是否跳过响应拦截器的错误处理
  skipErrorHandler?: boolean
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    // 在发送请求之前做些什么
    // 可以在这里添加 token
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 显示 loading（如果需要）
    if (config.showLoading !== false) {
      // 这里可以调用全局 loading 方法
      // showLoading()
    }

    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const res = response.data

    // 如果返回的状态码不是 200，则判断为错误
    if (response.status !== ResponseCode.SUCCESS) {
      // 处理业务错误
      const message = res.message || ResponseMessage[res.status as ResponseCode] || '请求失败'
      
      // 特殊状态码处理
      if (res.status === ResponseCode.UNAUTHORIZED) {
        // 清除 token 并跳转到登录页
        removeToken()
        // router.push('/login')
      }

      // 显示错误提示
      console.error('请求失败:', message)
      
      return Promise.reject(new Error(message))
    }

    // 隐藏 loading
    // hideLoading()

    // 返回数据
    return res
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    console.error('响应错误:', error)

    let message = '请求失败'
    
    if (error.response) {
      // 检查响应数据中是否有 message 字段
      const responseData = error.response.data as any
      if (responseData && typeof responseData === 'object' && 'message' in responseData) {
        message = responseData.message
      } else {
        // 服务器返回了错误状态码
        const status = error.response.status
        message = ResponseMessage[status as ResponseCode] || `请求失败，状态码: ${status}`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      message = '网络错误，请检查您的网络连接'
    } else {
      // 发送请求时出了点问题
      message = error.message || '请求失败'
    }

    // 隐藏 loading
    // hideLoading()

    return Promise.reject(new Error(message))
  }
)

// Token 管理（可以根据实际项目调整）
function getToken(): string | null {
  return localStorage.getItem('token') || sessionStorage.getItem('token')
}

function removeToken(): void {
  localStorage.removeItem('token')
  sessionStorage.removeItem('token')
}

// 封装请求方法
class Request {
  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.get<ApiResponse<T>>(url, config).then(res => res as unknown as T)
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.post<ApiResponse<T>>(url, data, config).then(res => res as unknown as T)
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.put<ApiResponse<T>>(url, data, config).then(res => res as unknown as T)
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return service.delete<ApiResponse<T>>(url, config).then(res => res as unknown as T)
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return service.patch<ApiResponse<T>>(url, data, config).then(res => res as unknown as T)
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, file: File | FormData, config?: RequestConfig): Promise<T> {
    const formData = file instanceof FormData ? file : (() => {
      const fd = new FormData()
      fd.append('file', file)
      return fd
    })()

    return service.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    }).then(res => res as unknown as T)
  }

  /**
   * 下载文件
   */
  download(url: string, config?: RequestConfig): Promise<Blob> {
    return service.get(url, {
      ...config,
      responseType: 'blob'
    }).then(res => res as unknown as Blob)
  }
}

// 导出请求实例
export const request = new Request()

// 导出 axios 实例（用于特殊需求）
export default service

