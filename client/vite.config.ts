import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')

  return {
    // 插件配置
    plugins: [vue()],

    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      // 扩展名解析
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },

    // 开发服务器配置
    server: {
      // 服务器端口
      port: Number(env.VITE_PORT) || 5173,
      // 是否自动打开浏览器
      open: true,
      // 是否允许跨域
      cors: true,
      // 代理配置
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // 预热文件以提高初始页面加载速度
      warmup: {
        clientFiles: ['./src/main.ts', './src/App.vue']
      }
    },

    // 构建配置
    build: {
      // 构建输出目录
      outDir: 'dist',
      // 静态资源目录
      assetsDir: 'assets',
      // 小于此阈值的导入或引用资源会内联为 base64，避免额外的 HTTP 请求
      assetsInlineLimit: 4096,
      // 启用/禁用 CSS 代码拆分
      cssCodeSplit: true,
      // 构建后是否生成 source map 文件
      sourcemap: false,
      // 压缩配置
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境移除 console
          drop_console: true,
          // 生产环境移除 debugger
          drop_debugger: true
        }
      },
      // 代码分割配置
      rollupOptions: {
        output: {
          // 手动分包
          manualChunks: {
            // 将 Vue 相关库打包成一个单独的 chunk
            vue: ['vue', 'vue-router'],
            // 将 Leafer 相关库打包成一个单独的 chunk
            leafer: [
              'leafer-ui',
              'leafer-editor',
              'leafer-draw',
              '@leafer-in/editor',
              '@leafer-in/text-editor',
              '@leafer-in/viewport'
            ],
            // 将 axios 打包成一个单独的 chunk
            axios: ['axios']
          },
          // 输出文件命名
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || []
            const ext = info[info.length - 1]
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `assets/media/[name]-[hash].${ext}`
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `assets/images/[name]-[hash].${ext}`
            }
            if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name || '')) {
              return `assets/fonts/[name]-[hash].${ext}`
            }
            return `assets/[ext]/[name]-[hash].${ext}`
          }
        }
      },
      // 设置 chunk 大小警告的限制（单位：kb）
      chunkSizeWarningLimit: 1000
    },

    // CSS 配置
    css: {
      // 预处理器配置
      preprocessorOptions: {
        scss: {
          // 全局注入 SCSS 变量和混入（使用 @use 语法）
          additionalData: `@use "@/styles/variables.scss" as *;`
        }
      },
      // 开发时启用 sourcemap
      devSourcemap: true
    },

    // 预览服务器配置
    preview: {
      port: Number(env.VITE_PREVIEW_PORT) || 4173,
      open: true,
      cors: true
    },

    // 优化配置
    optimizeDeps: {
      // 预构建的依赖
      include: ['vue', 'vue-router', 'axios'],
      // 排除的依赖
      exclude: []
    },

    // 环境变量前缀
    envPrefix: 'VITE_',

    // 定义全局常量替换
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
    }
  }
})
