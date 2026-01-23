# store

## node版本16以上

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### 使用的element得ui框架

```sh
https://element-plus.org/zh-CN/component/button.html
```

### 项目部署
npm run build

scp -r ./dist/* root@139.224.101.218:/home/store/

密码：tao22Ting

<!-- 修改nginx配置 -->
sudo vim /etc/nginx/sites-available/vue-app
sudo nginx -t
sudo systemctl reload nginx