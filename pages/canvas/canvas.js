Page({
  data: {
    x: 0,
    y: 0,
    src: '',
    photoSrc: '',
    scaleValue: 1,
    coverWidth: 50
  },

  onLoad: function (options) {

  },

  change(e) {
    this.setData({
      x: e.detail.x,
      y: e.detail.y
    })
  },

  bigger() {
    var that = this;
    this.setData({
      coverWidth: parseInt(that.data.coverWidth) + 2.5
    })
  },

  smaller() {
    var that = this;
    this.setData({
      coverWidth: parseInt(that.data.coverWidth) - 2.5
    })
  },

  tap () {
    var that = this;
    let ctx = wx.createCanvasContext('shareCanvas');
    let imgPath = this.data.photoSrc;
    let coverImg = '../../img/submitSuccess.png';
    ctx.fillRect(0, 0, 300, 240);
    ctx.drawImage(imgPath, 0, 0, 300, 240);
    ctx.drawImage(coverImg, parseInt(this.data.x) - 7, parseInt(this.data.y) -1, that.data.coverWidth, that.data.coverWidth)
    ctx.draw(false, function(){
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 240,
        destWidth: 600,
        destHeight: 480,
        quality: 0.9,
        fileType: 'jpg',
        canvasId: 'shareCanvas',
        success(res) {
          console.log(res.tempFilePath)
          that.setData({
            src: res.tempFilePath
          })
        }
      })
    })
  },

  pickPhoto() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log(res.tempFiles[0].path)
        that.setData({
          photoSrc: res.tempFiles[0].path
        })
      }
    })
  }
})