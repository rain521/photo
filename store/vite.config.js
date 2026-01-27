import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
export default ({mode})=>{
  const env=loadEnv(mode, process.cwd());   // 获取.env文件里定义的环境变量
  return defineConfig({
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
    base: '/',
    resolve: {
      api: 'modern-compiler',
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: '0.0.0.0',
      port: 60120,
      proxy: {
        '/api/': { // 请求接口中要替换的标识
          target: 'http://localhost:3000', // 代理目标地址
        //   target: 'http://139.224.101.218:3000', // 代理目标地址
          changeOrigin: true, // 是否允许跨域
          secure: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          // additionalData: '@import "@/assets/css/main.scss";'
        }
      }
    }
  })
}

