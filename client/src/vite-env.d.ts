/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
}

// 扩展 ImportMeta 接口以支持 Vite 环境变量
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_SERVICE_API_BASE_URL?: string
  readonly VITE_MANAGER_API_BASE_URL?: string
  readonly VITE_PORT?: string
  readonly VITE_PREVIEW_PORT?: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
