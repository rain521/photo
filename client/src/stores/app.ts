import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 应用全局 Store
 */
export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref<boolean>(false)
  const loadingText = ref<string>('加载中...')
  const sidebarCollapsed = ref<boolean>(false)
  const theme = ref<'light' | 'dark'>('light')

  // 计算属性
  const isLoading = computed(() => loading.value)

  // 操作
  /**
   * 显示加载状态
   */
  function showLoading(text?: string) {
    loading.value = true
    if (text) {
      loadingText.value = text
    }
  }

  /**
   * 隐藏加载状态
   */
  function hideLoading() {
    loading.value = false
    loadingText.value = '加载中...'
  }

  /**
   * 切换侧边栏
   */
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  /**
   * 设置侧边栏状态
   */
  function setSidebarCollapsed(collapsed: boolean) {
    sidebarCollapsed.value = collapsed
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    // 可以在这里添加主题切换的逻辑，比如更新 document 的 class
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  /**
   * 设置主题
   */
  function setTheme(newTheme: 'light' | 'dark') {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return {
    // 状态
    loading,
    loadingText,
    sidebarCollapsed,
    theme,
    // 计算属性
    isLoading,
    // 操作
    showLoading,
    hideLoading,
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme
  }
})

