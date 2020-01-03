Page({
  data: {
    msg_detail: '',
    isLogin: '',
    timeStamp: -9999
  },

  onLoad (options) {
    var that = this;
    // 判断是否授权
    wx.getStorageSync('psyUser') != '' ? this.setData({ isLogin: false }) : this.setData({ isLogin: true }) 
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('preTest').scale_name,
    })
    this.setData({
      msg_detail: wx.getStorageSync('preTest')
    })
  },

  testBtn (e) {
    var that = this;
    // console.log(e);
    let id = this.data.msg_detail.id;
    if(e.timeStamp - this.data.timeStamp >= 9999) {
      that.setData({timeStamp: e.timeStamp})
      wx.navigateTo({
        url: `../regis/regis?id=${id}`,
      })
    }
  },

  //授权
  bindgetuserinfo(e) {
    var that = this;
    wx.getUserInfo({
      success: res => {
        wx.request({
          url: 'https://xcx.cepingle.com/api/users/decryptData',
          method: 'POST',
          data: {
            iv: res.iv,
            data: res.encryptedData,
            session_key: wx.getStorageSync('session_key').session_key
          },
          success(res) {
            if (res.data.code == 0) {
              wx.setStorageSync('psyUser', res.data.data);
              that.setData({ isLogin: false });
              setTimeout(()=>{
                let id_ = that.data.msg_detail.id;
                wx.navigateTo({
                  url: `../regis/regis?id=${id_}`,
                })
              },200)
            }
          }
        })
      }
    })
  },

  onShareAppMessage() {
    var that = this;
    return {
      title: '一起来测试吧',
      path: 'pages/testDetail/testDetail?id=' + that.data.msg_detail.id
    }
  }
})