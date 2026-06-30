const { requestWithAuth, errorMessage } = require('../utils/request')
const { errorResult, successResult } = require('../utils/result')

function normalizeWifi(item) {
  return {
    id: item && (item.id || item._id) ? item.id || item._id : null,
    name: item && item.name ? item.name : '',
    password: item && item.password ? item.password : ''
  }
}

async function listMyWifi(params = {}) {
  console.info('[ai-mode] listMyWifi 入口, params=', JSON.stringify(params))
  try {
    const res = await requestWithAuth({
      url: '/api/wifi/getAll',
      method: 'GET'
    })
    const items = Array.isArray(res) ? res.map(normalizeWifi) : []
    console.info('[ai-mode] listMyWifi 出口, total=', items.length)
    return successResult(items.length ? `共找到 ${items.length} 个 WiFi。` : '还没有创建 WiFi。', {
      total: items.length,
      items
    })
  } catch (err) {
    console.error('[ai-mode] listMyWifi 出错:', err)
    return errorResult(errorMessage(err, '列表加载失败。'))
  }
}

module.exports = listMyWifi
