// API 配置文件
export const API_CONFIG = {
  // 基础 URL，可以根据环境变量配置
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // 请求超时时间（毫秒）
  timeout: 10000,
  // 是否在请求头中携带 token
  withCredentials: false
}

// 响应状态码
export enum ResponseCode {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERROR = 500
}

// 响应消息
export const ResponseMessage = {
  [ResponseCode.SUCCESS]: '请求成功',
  [ResponseCode.UNAUTHORIZED]: '未授权，请重新登录',
  [ResponseCode.FORBIDDEN]: '拒绝访问',
  [ResponseCode.NOT_FOUND]: '请求错误，未找到该资源',
  [ResponseCode.SERVER_ERROR]: '服务器错误'
}

