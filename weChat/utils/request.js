// utils/request.js

// 基础配置
// const BASE_URL = 'http://www.cytp.cc';
const BASE_URL = 'http://localhost:3000';
const LOGIN_URL = '/api/auth/loginWx';

// 获取本地 Token
function getToken() {
  return uni.getStorageSync('token') || '';
}

// 存储 Token
function setToken(token) {
  uni.setStorageSync('token', token);
}

// 是否正在刷新 Token
let isRefreshing = false;
// 等待刷新的请求队列
let refreshSubscribers = [];

// 将请求加入等待队列，返回一个 Promise（会在刷新完成后 resolve）
function subscribeTokenRefresh(callback) {
  return new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject, callback });
  });
}

// 刷新完成后，用新 Token 重试所有排队请求
function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach(({ resolve, reject, callback }) => {
    callback(newToken).then(resolve).catch(reject);
  });
  refreshSubscribers = [];
}

// 刷新 Token 失败时，拒绝所有排队请求并清空
function onTokenRefreshFailed(error) {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
}

/**
 * 登录（获取 Token）
 * 在微信小程序中通过 wx.login 获取 code，调后端接口换取 Token
 */
function loginAndGetToken() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin', // 小程序可省略，默认微信
      success: (loginRes) => {
        if (loginRes.code) {
          // 请求后端登录接口
          uni.request({
            url: BASE_URL + LOGIN_URL,
            method: 'POST',
            data: { code: loginRes.code },
            success: (res) => {
              if (res.statusCode === 200 && res.data.access_token) {
                const token = res.data.access_token;
                setToken(token);
                resolve(token);
              } else {
                reject(new Error('登录失败：' + JSON.stringify(res.data)));
              }
            },
            fail: (err) => {
              reject(err);
            }
          });
        } else {
          reject(new Error('wx.login 失败：' + loginRes.errMsg));
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

/**
 * 刷新 Token（本项目里等同于重新登录）
 * 可根据业务加入 refresh_token 机制，此处简化为直接走登录流程
 */
async function refreshToken() {
  // 如果已经有刷新正在进行，直接返回该 Promise
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      // 这里较为特殊：refreshToken 本身在外部调用时也需要拿到新 token，
      // 但为了防止并发调用 refreshToken 方法本身，我们可以复用 isRefreshing 标记，
      // 并将 resolve/reject 暂存，等待刷新完成再统一返回。
      // 更好的做法是使用同一份 “刷新 Promise”
    });
  }
  isRefreshing = true;
  try {
    const newToken = await loginAndGetToken();
    onTokenRefreshed(newToken);
    return newToken;
  } catch (error) {
    onTokenRefreshFailed(error);
    throw error;
  } finally {
    isRefreshing = false;
  }
}

// 缓存当前的刷新 Promise，保证多个并发请求只调用一次 loginAndGetToken
let refreshPromise = null;

function getRefreshTokenPromise() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = loginAndGetToken()
    .then((token) => {
      onTokenRefreshed(token);
      return token;
    })
    .catch((error) => {
      onTokenRefreshFailed(error);
      throw error;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });
  return refreshPromise;
}

/**
 * 核心请求方法
 * @param {Object} options - uni.request 参数（url, method, data, header 等）
 * @param {boolean} retry - 内部使用，标记是否已经重试过（避免无限循环）
 */
function request(options, retry = false) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    
    // 合并 headers
    const header = {
      'Content-Type': 'application/json',
      ...options.header,
    };
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    // 实际发起请求
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header,
      success: async (res) => {
        // 如果返回 401，说明 Token 无效或过期
        if (res.statusCode === 401 && !retry) {
          // 如果没有 Token 且从未刷新过，也要走刷新流程
          // 此时将当前请求入队，等待刷新
          const retryRequest = (newToken) => {
            // 用新 Token 重新发起原请求（retry=true 防止再次刷新）
            return request({ ...options, header: { ...options.header } }, true);
          };

          // 将重试函数加入队列，并获取一个 Promise
          const retryPromise = subscribeTokenRefresh(retryRequest);

          // 如果当前没有在刷新，启动刷新流程
          if (!isRefreshing) {
            getRefreshTokenPromise();
          }

          // 等待重试完成
          try {
            const data = await retryPromise;
            resolve(data);
          } catch (err) {
            reject(err);
          }
          return;
        }

        // 正常情况 or 已经重试过，直接返回结果
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}

// 封装一个不带 Token 自动获取的独立函数（如果本地无 Token 直接触发刷新）
async function requestWithAuth(options) {
  const token = getToken();
  if (!token) {
    // 没有 Token，主动获取
    if (!isRefreshing) {
      // 启动刷新，并将当前请求排队
      const retryRequest = (newToken) => {
        return request({ ...options }, true);
      };
      const retryPromise = subscribeTokenRefresh(retryRequest);
      getRefreshTokenPromise();
      return retryPromise;
    } else {
      // 已经在刷新中，只需排队
      const retryRequest = (newToken) => {
        return request({ ...options }, true);
      };
      return subscribeTokenRefresh(retryRequest);
    }
  }
  // 有 Token 正常发请求（可能会触发 401 分支）
  return request(options);
}

export { request, requestWithAuth };