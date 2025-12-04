# Vite 配置说明

## 已配置的功能

### 1. 路径别名
- `@` → `./src` 目录

### 2. 开发服务器
- 端口：可通过 `VITE_PORT` 环境变量配置，默认 5173
- 自动打开浏览器
- 支持跨域（CORS）
- API 代理：`/api` → 后端服务器
- 文件预热：提升初始加载速度

### 3. 构建优化
- **代码分割**：自动将 Vue、Leafer、axios 等库分离打包
- **文件命名**：使用 hash 确保缓存更新
- **资源分类**：
  - JS 文件：`assets/js/`
  - CSS 文件：`assets/css/`
  - 图片：`assets/images/`
  - 字体：`assets/fonts/`
  - 媒体：`assets/media/`
- **压缩**：使用 terser 压缩，移除 console 和 debugger
- **Chunk 大小警告**：超过 1000KB 时提示

### 4. CSS 配置
- 全局注入 SCSS 变量（使用 `@use` 语法）
- 开发时启用 sourcemap

### 5. 环境变量
- 前缀：`VITE_`
- 支持 `.env`、`.env.local`、`.env.[mode]` 等文件

### 6. 全局常量
- `__APP_VERSION__`：应用版本号

## 环境变量示例

创建 `.env` 文件：

```env
# 开发服务器端口
VITE_PORT=5173

# API 基础 URL
VITE_API_BASE_URL=http://localhost:3000/api

# 预览服务器端口
VITE_PREVIEW_PORT=4173
```

## 代理配置

开发环境下，所有 `/api` 开头的请求会被代理到后端服务器：

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 构建输出

- 输出目录：`dist/`
- 静态资源：`dist/assets/`
- 代码分割后的文件会自动分离，提升加载性能

## 注意事项

1. **Sass 警告**：当前使用的是 Sass 的 legacy API，会有弃用警告，但不影响功能
2. **Terser**：已安装为开发依赖，用于生产环境代码压缩
3. **空 Chunk**：如果某个库没有被使用，可能会生成空的 chunk 文件，这是正常的

