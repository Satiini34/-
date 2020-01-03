Page({
  data: {
    src: ''
  },

  onLoad (options) {
    this.setData({
      src: options.src
    })
  }
})