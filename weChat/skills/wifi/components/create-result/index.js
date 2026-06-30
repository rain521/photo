Component({
  data: {
    title: '创建成功',
    wifiName: '',
    description: '已保存到你的 WiFi 列表。'
  },
  lifetimes: {
    created() {
      console.info('[ai-mode] create-result created')
      const { NotificationType } = wx.modelContext
      const modelCtx = wx.modelContext.getContext(this)
      const viewCtx = wx.modelContext.getViewContext(this)

      modelCtx.on(NotificationType.Result, (data) => {
        const sc = data && data.result && data.result.structuredContent
        console.info('[ai-mode] create-result 收到 Result:', JSON.stringify(sc))
        const wifi = sc && sc.wifi ? sc.wifi : {}
        this.setData({
          title: sc && sc.message ? sc.message : '创建成功',
          wifiName: wifi.name || '',
          description: wifi.name ? '已保存到你的 WiFi 列表。' : '可以继续查看我的 WiFi 列表。'
        })
        console.info('[ai-mode] create-result setData name=', wifi.name || '')
      })

      viewCtx.on(NotificationType.Overflow, (data) => {
        const overflowed = !!(data && data.overflowHeight > 0)
        console.info(`[ai-mode] create-result overflow overflowed=${overflowed} data=${JSON.stringify(data)}`)
      })
      console.info('[ai-mode] create-result overflow monitor=on')
    }
  },
  methods: {
    onTapList() {
      const args = {}
      console.info(`[ai-mode] create-result send api/call name=listMyWifi args=${JSON.stringify(args)}`)
      wx.modelContext.getContext(this).sendFollowUpMessage({
        content: [
          { type: 'text', text: '查看列表' },
          { type: 'api/call', data: { name: 'listMyWifi', arguments: args } }
        ]
      })
    }
  }
})
