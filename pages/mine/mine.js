Page({
  data: {
    isLogin: '',
    choice: 1,
    userInfo: '',
    undone: '',
    havedone: '',
    undoneList: [],
    havedoneList: []
  },

  onLoad: function (options) {
    var that = this;
  },

  // 编辑个人资料
  setting () {
    wx.navigateTo({
      url: '../regis/regis',
    })
  },

  complete () {
    this.setData({ choice: 1 })
  },

  toComplete () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  nocomplete() {
    this.setData({ choice: 2 })
  },

  //授权
  bindgetuserinfo (e) {
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
          success (res) {
            if(res.data.code == 0){
              wx.setStorageSync('psyUser', res.data.data);
              that.setData({ isLogin: true, userInfo: res.data.data });
            }
          }
        })
      }
    })
  },

  onShow () {
    var that = this;
    // 已完成测评
    wx.request({
      url: 'https://xcx.cepingle.com/api/api/myScaleList',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('psyUser').id
      },
      success(res) {
        if (res.data.code == 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].create_time = res.data.data[i].create_time.slice(0, 16)
          }
          res.data.data.length == 0 ? that.setData({ havedone: false, havedoneShow: true }) : that.setData({ havedoneList: res.data.data, havedone: true, havedoneShow: true })
        } else {
          wx.showToast({
            title: '网络异常请重试',
            icon: 'none'
          })
        }
      }
    })

    wx.getStorageSync('psyUser') != '' ? that.setData({ isLogin: true, userInfo: wx.getStorageSync('psyUser') }) : that.setData({ isLogin: false })
    if(wx.getStorageSync('temp') !=''){
      that.setData({
        undone: true,
        undoneList: wx.getStorageSync('temp').reverse()
      })
    }else {
      that.setData({
        undone: false
      })
    }
  },

  toTest (e) {
    let chooseId = e.currentTarget.dataset.msg.id.toString();
    let chooseMsg = wx.getStorageSync('temp');
    setTimeout(()=>{
      wx.navigateTo({
        url: '../test/test?localId=' + chooseId,
      })
    },100)
  },

  // 查看测评结果
  testDetail (e) {
    let testDetailId = e.currentTarget.dataset.all.id;
    if (e.currentTarget.dataset.all.is_show == 0){
      wx.showToast({
        title: '请向医生咨询测试结果',
        icon: 'none'
      })
    }else {
      wx.navigateTo({
        url: '../result/result?src=https://xcx.cepingle.com/api/api/getresultforwap/id/' + testDetailId + '.html',
      }) 
    }
  },

  onShareAppMessage() {
    return {
      path: 'pages/index/index'
    }
  }
})