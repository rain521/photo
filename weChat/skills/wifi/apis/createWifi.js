const { requestWithAuth, errorMessage } = require('../utils/request')
const { errorResult, successResult } = require('../utils/result')

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

async function getUserProfile() {
  console.info('[ai-mode] createWifi get user profile')
  return requestWithAuth({
    url: '/api/user/getUser',
    method: 'GET'
  })
}

async function createWifi(params = {}) {
  console.info('[ai-mode] createWifi 入口, params=', JSON.stringify(params))
  try {
    const name = normalizeText(params.name)
    const password = normalizeText(params.password)

    if (!name || !password) {
      return errorResult('请提供 WiFi 名称和密码。')
    }

    const user = await getUserProfile()
    if (!user || user.id === undefined || user.id === null) {
      return errorResult('未能获取用户信息，请稍后重试。')
    }

    const payload = {
      name,
      password,
      userId: user.id
    }
    console.info('[ai-mode] createWifi request payload=', JSON.stringify({ name, userId: user.id }))

    const created = await requestWithAuth({
      url: '/api/wifi',
      method: 'POST',
      data: payload
    })

    const wifi = Object.assign({}, created || {}, payload)
    console.info('[ai-mode] createWifi 出口, wifi=', JSON.stringify({ id: wifi.id, name: wifi.name }))
    return successResult(`已创建 WiFi：${name}`, {
      message: '创建成功',
      wifi: {
        id: wifi.id || wifi._id || null,
        name: wifi.name || name,
        userId: wifi.userId || user.id
      }
    })
  } catch (err) {
    console.error('[ai-mode] createWifi 出错:', err)
    return errorResult(errorMessage(err, '创建 WiFi 失败，请稍后重试。'))
  }
}

module.exports = createWifi
