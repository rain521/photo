const createWifi = require('./apis/createWifi')
const listMyWifi = require('./apis/listMyWifi')

console.info('[ai-mode] wifi skill register start')
wx.modelContext.registerAPI('createWifi', createWifi)
wx.modelContext.registerAPI('listMyWifi', listMyWifi)
console.info('[ai-mode] wifi skill register done')
