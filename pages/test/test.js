Page({
  data: {
    testNo: 1,
    testNoComplete: 0,
    testLineNow: 0,
    subjects: [],
    id: '',
    loaded: false,
    next: true,
    fromLocal: false,
    shop_id: '',
    timeStamp: 0,
    timeStampSubmit: 0
  },

  onLoad (options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    // 本地读取
    if(options.localId != undefined){
      that.setData({ 
        id: options.localId, 
        subjects: wx.getStorageSync(options.localId),
        loaded: true,
        fromLocal: true,
      })
      // 获取机构id号
      let temp_shopId = wx.getStorageSync('temp');
      for (let j = 0; j < temp_shopId.length;j++){
        if (temp_shopId[j].id == options.localId){
          that.setData({
            shop_id: temp_shopId[j].shopId
          })
        }
      }
      let newLoad = wx.getStorageSync(options.localId);
      for (let i = 0; i < newLoad.length; i++) {
        if (newLoad[i].pick != undefined) {
          that.setData({
            testNo: i + 1,
            testLineNow: i * 92 / (newLoad.length - 1),
            testNoComplete: i,
          })
        }
      }
      setTimeout(()=>{  
        wx.hideLoading();
      },666)
    }else {
      that.setData({ id: options.id});
      let shopIdUpload;
      wx.getStorageSync('mechanismId') == '' ? shopIdUpload = '10097' : shopIdUpload = wx.getStorageSync('mechanismId');
      wx.request({
        url: 'https://xcx.cepingle.com/api/api/scaleDetail',
        method: 'POST',
        data: {
          scale_id: options.id
        },
        success(res) {
          if(res.data.code == 0){
            that.setData({
              subjects: res.data.data.subjects,
              loaded: true,
              shop_id: shopIdUpload
            })
            setTimeout(() => {
              wx.hideLoading();
            }, 666)
          }else {
            wx.showToast({
              title: '网络异常请重试',
              icon: 'none'
            })
          }
        }
      })
    }
  },

  // 上一题
  lastQ () {
    this.setData({
      next: false,
      testNo: parseInt(this.data.testNo) - 1,
      testNoComplete: parseInt(this.data.testNoComplete) - 1,
      testLineNow: (parseInt(this.data.testNoComplete) - 1) * 92 / parseInt(this.data.subjects.length - 1 )
    })
  },

  chooseAnswer (e) {
    var that = this;
    // console.log(e)
    if (e.timeStamp - this.data.timeStamp > 800){
      that.setData({
        timeStamp: e.timeStamp
      })
      let select_id = e.currentTarget.id -1;
      // console.log(select_id,e.currentTarget.dataset.select)
      // 修改score值
      that.data.subjects[select_id].pick = e.currentTarget.dataset.select;
      this.setData({ subjects: that.data.subjects, next: true })
      if (that.data.testNo < that.data.subjects.length) {
        that.setData({
          testNo: parseInt(that.data.testNo) + 1
        })
      } else {
        that.setData({
          testNo: that.data.testNo
        })
      }
      if (that.data.testNoComplete < that.data.subjects.length) {
        that.setData({
          testNoComplete: parseInt(that.data.testNoComplete) + 1,
          testLineNow: (parseInt(that.data.testNoComplete) + 1) * 100 / that.data.subjects.length
        })
      } else {
        wx.showToast({
          title: '已完成全部试题，请提交',
          icon: 'none'
        })
        that.setData({
          testNoComplete: that.data.testNoComplete,
          testLineNow: that.data.testLineNow
        })
      }
    }
  },

  // 提交
  submit (e) {
    var that = this;
    let answer_submit = '';
    wx.showLoading({
      title: '提交中,请等待',
      mask: true
    })
    // if(e.timeStamp - this.data.timeStampSubmit >= 4500){
      this.setData({ timeStampSubmit: e.timeStamp })
      if (this.data.testLineNow != 100){
        wx.showToast({
          title: '请先完成全部试题再提交',
          icon: 'none'
        })
      }else {
        for (let i = 0; i < this.data.subjects.length;i++){
          let this_anwser = this.data.subjects[i].subject_id + '_' + this.data.subjects[i].pick + ','
          answer_submit = answer_submit.concat(this_anwser)
        }
        setTimeout( ()=> {
          wx.request({
            url: 'https://xcx.cepingle.com/api/api/saveTestData',
            method: 'POST',
            data: {
              scale_id: that.data.id,
              user_id: wx.getStorageSync('psyUser').id,
              shop_id: that.data.shop_id,
              answers: answer_submit,
              exam_num: wx.getStorageSync('medicalId')
            },
            success(res) {
              if(res.data.code == 0){
                wx.hideLoading();
                that.setData({
                  answer_submit: []
                })
                wx.redirectTo({
                  url: '../success/success?id=' + res.data.data.id + '&result=' + res.data.data.is_show,
                })
                // 未完成提交删除本地数据
                if (that.data.fromLocal == true){
                  wx.removeStorageSync(that.data.id)
                  let deleteTemp = wx.getStorageSync('temp');
                  if (deleteTemp.length > 1){
                    for (let i = 0; i < deleteTemp.length; i++) {
                      if (deleteTemp[i].id == that.data.id) {
                        deleteTemp.splice(i, 1);
                        wx.setStorageSync('temp', deleteTemp)
                      }
                    }
                  }else {
                    wx.removeStorageSync('temp');
                  }
                }
              }else {
                wx.hideLoading();
                wx.showToast({
                  title: '网络异常，请重新点击提交!',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
            },
            fail () {
              wx.hideLoading();
              wx.showToast({
                title: '网络异常，请重新点击提交!',
                icon: 'none',
                duration: 2000,
                mask: true
              })
            }
          })
        }, 100)
      }
    // }
  },

  temporary () {
    var that = this;
    // 创建临时数组去除重复
    let temp = wx.getStorageSync('temp');
    let mechanismId;
    wx.getStorageSync('mechanismId') == '' ? mechanismId = '10097' : mechanismId = wx.getStorageSync('mechanismId');
    let preTest = wx.getStorageSync('preTest');
    preTest.shopId = mechanismId;
    let tempList_all;
    tempList_all = temp.concat(preTest);
    wx.setStorageSync('temp', tempList_all)
    wx.setStorageSync(this.data.id, this.data.subjects)
    wx.showToast({
      title: '保存成功',
    })
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1
      })
    },666)
  },

  // stopTouchMove () {
  //   return false
  // },

  onUnload () {
    let corTemp = wx.getStorageSync('temp');
    let arr1 = corTemp.filter(function (element, index, self) {
      return self.findIndex(el => el.shopId == element.shopId && el.id == element.id) === index
    })
    wx.setStorageSync('temp',arr1)

    // 删除体检号
    wx.removeStorageSync('medicalId');
  }
})