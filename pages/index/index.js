Page({
  data: {
    html: [{
      name: 'span',
      attrs: {
        class: 'span_class',
        style: 'font-size:20px; background-color:#666;'
      },
    }],
    testList: [],
  },

  onLoad (options) {
    var that = this;
    wx.removeStorageSync('mechanismId');
    if (options.scene == undefined){
      that.setData({ listShow: false })
      this.ScanList(10097)
    }else {
      this.ScanList(options.scene)
      setTimeout( () =>{
        wx.setStorageSync('mechanismId', options.scene)
      },100)
    }
    // 若临时保存文件为空创建临时保存数组
    if(wx.getStorageSync('temp') == '') wx.setStorageSync('temp',[]);
  },

  toTest (e) {
    // let allMsg = JSON.stringify(e.currentTarget.dataset.msg);
    wx.setStorageSync('preTest', e.currentTarget.dataset.msg)
    wx.navigateTo({
      // url: `../preTest/preTest?msg=${allMsg}`,
      url: `../testDetail/testDetail`,
    })
  },

  scanNow () {
    var that = this;
    wx.scanCode({
      success (res){
        let scanCode = res.path.split('=')[1];
        that.ScanList(scanCode)
      }
    })
  },

  ScanList (e) {
    var that = this;
    wx.request({
      url: 'https://xcx.cepingle.com/api/api/scaleList',
      method: 'POST',
      data: {
        shop_id: e
      },
      success(res) {
        if (res.data.code == 0) {
          that.setData({ testList: res.data.data })
        } else {
          wx.showToast({
            title: '网络异常请重试',
            icon: 'none'
          })
        }
      }
    })
  },

  onUnload () {
    wx.removeStorageSync('mechanismId');
  },

  onShareAppMessage () {
    return {
      
    }
  }
})