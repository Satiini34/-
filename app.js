//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: function (res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://xcx.cepingle.com/api/users/returnOpenid',
          method: 'POST',
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            code: res.code
          },
          success: (res) => {
            if (res.data.code == 0) {
              wx.setStorageSync('session_key', res.data.data);
              if (res.data.userInfo != 0) {
                wx.setStorageSync('psyUser', res.data.userInfo);
              }
            }
          } 
        })
      }
    })
  }
})