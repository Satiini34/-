Page({
  data: {
    mobileValue: '请点击右边按钮授权',
    mobileColor: 'rgb(128 ,128, 128)',
    pickerValue: '请填写性别',
    pickerValue1: '请填写学历',
    pickerColor: 'rgb(128, 128, 128)',
    pickerColor1: 'rgb(128, 128, 128)',
    array: ['男', '女'],
    array1: ['高中及以下','大专','本科','研究生及以上'],
    array2:['123456789','0123456789'],
    mobileText: '点击授权手机',
    canNotSkip: '',
    id: '',
    realName: '',
    age: ''
  },

  onLoad: function (options) {
    var that = this;
    options.id != undefined ? this.setData({ canNotSkip: false, id: options.id }) : this.setData({ canNotSkip: true })
    if(wx.getStorageSync('psyUser').mobile != '' || undefined){
      that.setData({
        mobileValue: wx.getStorageSync('psyUser').mobile,
        mobileColor: '#333',
        mobileText: '修改号码'
      })
    }
    if(wx.getStorageSync('psyUser').real_name != '') this.setData({ realName: wx.getStorageSync('psyUser').real_name })
    if(wx.getStorageSync('psyUser').age != '') this.setData({ age: wx.getStorageSync('psyUser').age })
    if (wx.getStorageSync('psyUser').education != '') this.setData({ pickerValue1: wx.getStorageSync('psyUser').education, pickerColor1: '#333' })
    wx.getStorageSync('psyUser').sex == 1 ? that.setData({ pickerValue: '男', pickerColor: '#333' }) : that.setData({ pickerValue: '女', pickerColor: '#333' })
  },

  bindPickerChange (e) {
    var that = this;
    if(e.detail.value == 0){
      that.setData({ 
        pickerValue: '男',
        pickerColor: '#333'
      })
    }else{
      that.setData({ 
        pickerValue: '女',
        pickerColor: '#333'
      })
    }
  },

  bindPickerChange_education (e) {
    var that = this;
    if (e.detail.value == 0){
      that.setData({
        pickerValue1: '高中',
        pickerColor1: '#333'
      })
    } else if (e.detail.value == 1) {
      that.setData({
        pickerValue1: '专科',
        pickerColor1: '#333'
      })
    } else if (e.detail.value == 2) {
      that.setData({
        pickerValue1: '本科',
        pickerColor1: '#333'
      })
    }else {
      that.setData({
        pickerValue1: '研究生及以上',
        pickerColor1: '#333'
      })
    }
    // switch (e.detail.value) {
    //   case 0:
    //     that.setData({
    //       pickerValue1: '高中',
    //       pickerColor1: '#333'
    //     });
    //   break;
    //   case 1:
    //     that.setData({
    //       pickerValue1: '专科',
    //       pickerColor1: '#333'
    //     });
    //   break;
    //   case 2: 
    //     that.setData({
    //       pickerValue1: '本科',
    //       pickerColor1: '#333'
    //     });
    //   break;
    //   case 3:
    //     that.setData({
    //       pickerValue1: '研究生及以上',
    //       pickerColor1: '#333'
    //     });
    //   break;
    // }
  },
 
  //获取用户手机号码
  getPhoneNumber: function (i) {
    var that = this;
    let mobile;
    wx.request({
      url: 'https://xcx.cepingle.com/api/users/decryptData',
      method: 'POST',
      data: {
        session_key: wx.getStorageSync('session_key').session_key,
        data: i.detail.encryptedData,
        iv: i.detail.iv
      },
      success: function (res) {
        mobile = res.data.data.phoneNumber;
        wx.request({
          url: 'https://xcx.cepingle.com/api/users/bindMobile',
          method: 'POST',
          data: {
            open_id: wx.getStorageSync('session_key').openid,
            mobile: mobile
          },
          success (res){
            if(res.data.code == 0){
              that.setData({ mobileValue: mobile })
            }
          }
        })
      }
    })
  }, 

  skip () {
    var that = this;
    if (that.data.canNotSkip == false) {
      wx.showModal({
        content: wx.getStorageSync('preTest').info,
        success(res) {
          if (res.confirm) {
            if (that.data.canNotSkip == false) {
              wx.redirectTo({
                url: '../test/test?id=' + that.data.id,
              })
            } 
          }
        }
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  formSubmit (e) {
    var that = this;
    if (that.data.pickerValue != '' && e.detail.value.name != '' && that.data.mobileValue != '请授权手机号码'){
      let education;
      that.data.pickerValue1 == "请填写学历" ? education = '' : education = that.data.pickerValue1;
      wx.request({
        url: 'https://xcx.cepingle.com/api/api/saveUserInfo',
        method: 'POST',
        data: {
          user_id: wx.getStorageSync('psyUser').id,
          real_name: e.detail.value.name,
          age: e.detail.value.age,
          education,
          gender: that.data.pickerValue
        },
        success(res) {
          if (that.data.canNotSkip == true) {
            if (res.data.code == 0){
              wx.showToast({
                title: '提交成功',
              })
              wx.request({
                url: 'https://xcx.cepingle.com/api/api/getUserInfo',
                method: 'POST',
                data: {
                  user_id: wx.getStorageSync('psyUser').id
                },
                success: function (res) {
                  if (res.data.code == 0) {
                    wx.setStorageSync('psyUser', res.data.data)
                  }
                }
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }else {
              wx.showToast({
                title: '请修改信息后提交！',
                icon: 'none'
              })
            }
          }else {
            wx.setStorage({
              key: "medicalId",
              data: e.detail.value.medical,
              success () {
                wx.showModal({
                  content: wx.getStorageSync('preTest').info,
                  success(res) {
                    if (res.confirm) {
                      if (that.data.canNotSkip == false) {
                        wx.redirectTo({
                          url: '../test/test?id=' + that.data.id,
                        })
                      }
                    }
                  }
                })
              }
            })
          }
        }
      })
    }else {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      })
    }
  },

  onUnload () {
    wx.request({
      url: 'https://xcx.cepingle.com/api/api/getUserInfo',
      method: 'POST',
      data: {
        user_id: wx.getStorageSync('psyUser').id
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('psyUser', res.data.data)
        }
      }
    })
  }
})