App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true,
      // 如果报错，在下面填入你的环境ID，例如 env: 'my-env-id'
    })
  }
})