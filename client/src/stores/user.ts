import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { request } from '@/api'

// 用户信息接口
export interface UserInfo {
  id: string | number
  name: string
  email?: string
  avatar?: string
  nickname?: string
  [key: string]: any
}
/**
 * 用户 Store
 */
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // 计算属性
  const userName = computed(() => userInfo.value?.name || '')
  const userEmail = computed(() => userInfo.value?.email || '')

  // 操作
  /**
   * 设置 Token
   */
  function setToken(newToken: string) {
    token.value = newToken
    // 保存到 localStorage
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  /**
   * 设置用户信息
   */
  function setUserInfo(info: UserInfo | null) {
    userInfo.value = info
    isLoggedIn.value = !!info
  }

  /**
   * 登录
   */
  async function login(phone: string, password: string) {
    try {
      const result = await request.post('/manager/api/customers/authenticate', { phone, password, rememberMe: true, storeId: '1' })
      console.log(result)
      setToken(result.message)
      const info = await request.get<UserInfo>('/manager/api/customers/current')
      setUserInfo(info)
      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * 登出
   */
  async function logout() {
    setToken('')
    setUserInfo(null)
  }

  /**
   * 获取用户信息
   */
  async function fetchUserInfo() {
    try {
      const info = await request.get<UserInfo>('/manager/api/customers/current')
      setUserInfo(info)
      return info
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取失败，清除 token
      setToken('')
      setUserInfo(null)
      throw error
    }
  }

  /**
   * 初始化用户信息（从 localStorage 恢复）
   */
  function initUser() {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      token.value = savedToken
      // 如果有 token，尝试获取用户信息
      fetchUserInfo().catch(() => {
        // 如果获取失败，清除 token
        setToken('')
      })
    }
  }

  /**
   * 重置用户数据
   */
  function reset() {
    setToken('')
    setUserInfo(null)
  }

  return {
    // 状态
    token,
    userInfo,
    isLoggedIn,
    // 计算属性
    userName,
    userEmail,
    // 操作
    setToken,
    setUserInfo,
    login,
    logout,
    fetchUserInfo,
    initUser,
    reset
  }
})

