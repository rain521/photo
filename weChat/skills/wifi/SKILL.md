# WiFi 技能

## 能力域定位

用于帮助用户在小程序 AI 中创建 WiFi 记录、查看当前账号已创建的 WiFi 列表。能力来自小程序页面 `pages/index/index` 和 `pages/list/list`。

## 触发场景

- 用户说“帮我创建一个 WiFi”
- 用户说“保存这个 WiFi 名称和密码”
- 用户说“查看我的 WiFi”
- 用户说“我创建过哪些 WiFi”

## 不适用范围

- 不处理编辑 WiFi、连接 WiFi、下载二维码。
- 不处理扫码连接、相册保存、页面跳转类操作。
- 不创建没有名称或密码的 WiFi。

## 前置条件

- 用户需要处于可调用 `wx.login` 的微信小程序环境。
- 后端登录接口 `/api/auth/loginWx` 需要返回 `access_token`。
- WiFi 创建和列表接口需要接受 `Authorization: Bearer <token>` 鉴权头。

## 使用顺序

- 创建 WiFi 时，需要先从用户处获得 WiFi 名称和密码。
- 创建成功后，可以继续查看我的 WiFi 列表。
