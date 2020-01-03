Page({
  data: {
    id: '',
    result: ''
  },

  onLoad(options){
    var that = this;
    // console.log(options)
    if (options.id != undefined){
      this.setData({ 
        id: options.id,
      })
    }
    //判断是否显示结果页
    options.result == 1 ? this.setData({ result: true }) : this.setData({ result: false })
  },

  back () {
    wx.switchTab({
      url: '../index/index',
    })
  },

  result () {
    wx.navigateTo({
      url: '../result/result?src=https://xcx.cepingle.com/api/api/getresultforwap/id/' + this.data.id + '.html',
    }) 
  }
})