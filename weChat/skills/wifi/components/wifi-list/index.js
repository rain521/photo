function maskPassword(password) {
  if (!password) return '未填写'
  return '********'
}

Component({
  data: {
    total: 0,
    visibleItems: [],
    omittedCount: 0
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] wifi-list created')
      const { NotificationType } = wx.modelContext
      const modelCtx = wx.modelContext.getContext(this)
      const viewCtx = wx.modelContext.getViewContext(this)

      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data && data.result && data.result.structuredContent
        console.info('[ai-mode] wifi-list 收到 Result:', JSON.stringify(sc))
        const rawItems = sc && Array.isArray(sc.items) ? sc.items : []
        const items = rawItems.map((item) => ({
          id: item.id || item._id || item.name,
          name: item.name || '未命名 WiFi',
          maskedPassword: maskPassword(item.password)
        }))
        const maxVisible = 4
        const visibleItems = items.slice(0, maxVisible)
        this.setData({
          total: items.length,
          visibleItems,
          omittedCount: Math.max(0, items.length - visibleItems.length)
        })
        console.info(`[ai-mode] wifi-list setData total=${items.length} visible=${visibleItems.length}`)
      })

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info(`[ai-mode] wifi-list overflow overflowed=${overflowed} data=${JSON.stringify(data)}`)
      })
      console.info('[ai-mode] wifi-list overflow monitor=on')
    }
  },
  methods: {
    onTapCreate() {
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [{ type: 'text', text: '创建 WiFi' }]
      })
    }
  }
})
