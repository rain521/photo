const BASE_URL = 'https://www.cytp.cc'
const LOGIN_URL = '/api/auth/loginWx'

let token = ''
let loginPromise = null

function errorMessage(err, fallback) {
  if (!err) return fallback
  if (err.message) return err.message
  if (err.data && err.data.message) return err.data.message
  if (err.errMsg) return err.errMsg
  return fallback
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          resolve(res.code)
          return
        }
        reject(new Error(`wx.login 失败：${res.errMsg || '缺少 code'}`))
      },
      fail: reject
    })
  })
}

function rawRequest(options) {
  return new Promise((resolve, reject) => {
    const url = options.url.indexOf('http') === 0 ? options.url : BASE_URL + options.url
    console.info('[ai-mode] request start', options.method || 'GET', url)
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || 15000,
      success(res) {
        console.info('[ai-mode] request success status=', res.statusCode)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
          return
        }
        const msg = res.data && res.data.message ? res.data.message : `HTTP ${res.statusCode}`
        const err = new Error(msg)
        err.statusCode = res.statusCode
        err.data = res.data
        reject(err)
      },
      fail: reject
    })
  })
}

async function ensureLogin() {
  if (token) return token
  if (loginPromise) return loginPromise

  loginPromise = (async () => {
    console.info('[ai-mode] ensureLogin start')
    const code = await wxLogin()
    const res = await rawRequest({
      url: LOGIN_URL,
      method: 'POST',
      data: { code },
      header: { 'Content-Type': 'application/json' }
    })
    if (!res || !res.access_token) {
      throw new Error('登录失败：后端未返回 access_token')
    }
    token = res.access_token
    console.info('[ai-mode] ensureLogin success')
    return token
  })()

  try {
    return await loginPromise
  } finally {
    loginPromise = null
  }
}

async function requestWithAuth(options, retry) {
  const currentToken = await ensureLogin()
  try {
    return await rawRequest({
      ...options,
      header: Object.assign(
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`
        },
        options.header || {}
      )
    })
  } catch (err) {
    if (err.statusCode === 401 && !retry) {
      console.info('[ai-mode] request unauthorized, relogin')
      token = ''
      await ensureLogin()
      return requestWithAuth(options, true)
    }
    throw err
  }
}

module.exports = {
  ensureLogin,
  requestWithAuth,
  errorMessage
}
