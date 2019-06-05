const app = getApp();
const request = require('../../utils/request.js');
const utils = require('../../utils/util.js');
import {
  $wuxCountUp
} from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    myUserInfo: null,
    partnerUserInfo: null,
    state: true,
    myCond_code: '', //实况天气状况代码
    myCond_txt: '', //实况天气状况描述
    myFl: '', //体感温度，默认单位：摄氏度
    partnerCond_code: '', //实况天气状况代码
    partnerCond_txt: '', //实况天气状况描述
    partnerFl: '', //体感温度，默认单位：摄氏度
    hadMyWeather: false,
    hadpartnerWeather: false,
    bgImg: '',
    buttons: [{
        label: '合影设置',
        icon: '/images/utils_camera.png'
      },
      {
        label: '日期设置',
        icon: '/images/utils_calendar.png'
      },
      {
        label: '秀恩爱',
        icon: '/images/utils_share.png'
      },
      {
        label: '相册',
        icon: '/images/utils_photo.png'
      },
      {
        label: '日记',
        icon: '/images/utils_diary.png'
      }
    ],
  },
  update(day) { //恋爱天数小特效
    this.day.update(day)
  },
  formSubmit: function(e) {
    if (e.detail.formId != 'the formId is a mock one') {
      let obj = {};
      obj.formId = e.detail.formId;
      obj.expire = new Date().getTime() + 604800000; // 7天后的过期时间戳
      obj.openid = app.globalData.openid;
      request.uploadFormIds(obj); //上传推送码
    }
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
    app.myUserInfoReadyCallback = myUserInfo => { //等待app的onLaunch执行完成之后再执行 确保获取到用户信息
      that.setData({
        state: app.globalData.state
      })
      if (!app.globalData.state) { //单身
        wx.showModal({
          title: '未解锁',
          content: '请先去牵手再来解锁此功能',
          showCancel: false,
          confirmText: '去牵手',
          confirmColor: '#F597B1',
          success: function(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/my/my',
              })
            }
          },
        })
      } else {
        that.day = new $wuxCountUp(0, 520, 0, 2, {
            printValue(value) {
              that.setData({
                day: value,
              })
            }
          }),
          that.setData({
            myUserInfo: app.globalData.myUserInfo,
            partnerUserInfo: app.globalData.partnerUserInfo
          })
        that.getLocation(); //获取天气
        that.getLovesDateAndBgImg();
      }
    }
  },
  changeBgImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showLoading({
          title: '正在上传',
        })
        request.updateBgImg(tempFilePaths[0], app.globalData.bothOpenid, function(bgImg) {
          wx.hideLoading();
          wx.showToast({
            title: '成功',
          })
          that.setData({
            bgImg: bgImg
          })
          app.globalData.bgImg = bgImg;
        })
      }
    })
  },
  getLocation: function() {
    var that = this
    wx.getLocation({ //弹出授权用户确认后获取其地理位置
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.getCity(latitude, longitude)
      },
      fail: function(res) {
        //判断是否获得了用户地理位置授权
        wx.getSetting({
          success: (res) => {
            if (!res.authSetting['scope.userLocation'])
              that.openConfirm()
          }
        })
      }
    })
  },
  getCity: function(latitude, longitude) {
    var that = this
    var url = "https://api.map.baidu.com/geocoder/v2/";
    var params = {
      ak: "UCEgGbAkZT11Ke4nFFF8BnOEClYgO2qy",
      output: "json",
      location: latitude + "," + longitude
    }
    wx.request({
      url: url,
      data: params,
      success: function(res) {
        var city = res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district; //市区
        var street = res.data.result.addressComponent.street; //街道
        var descCity = city.substring(0, city.length - 1);
        that.getWeahter(descCity);
      }
    })
  },

  //获取天气信息
  getWeahter: function(city) {
    var that = this
    var url = "https://free-api.heweather.net/s6/weather/now?"
    console.log(city);
    var params = {
      location: city,
      key: "642c0480fecc4abd8c8b89e916a604c2"
    }
    wx.request({
      url: url,
      data: params,
      success: function(res) {
        console.log(res);
        that.setData({
          myCond_code: res.data.HeWeather6[0].now.cond_code,
          myCond_txt: res.data.HeWeather6[0].now.cond_txt,
          myFl: res.data.HeWeather6[0].now.fl,
          hadMyWeather: true
        })
        var weather = {};
        weather.openid = app.globalData.openid;
        weather.cond_code = res.data.HeWeather6[0].now.cond_code;
        weather.cond_txt = res.data.HeWeather6[0].now.cond_txt;
        weather.fl = res.data.HeWeather6[0].now.fl;
        Promise.all([request.updateWeather(weather), request.getPartnerWeather(app.globalData.partnerUserInfo.openid)])
          .then(function(results) {
            that.setData({
              partnerCond_code: results[1].cond_code,
              partnerCond_txt: results[1].cond_txt,
              partnerFl: results[1].fl,
              hadpartnerWeather: true
            })
          })
          .catch(function(reason) {
            console.log(reason);
          })
      }
    })
  },
  getLovesDateAndBgImg: function() {
    var that = this;
    request.getLovesInfo(app.globalData.myUserInfo.openid, app.globalData.partnerUserInfo.openid)
      .then(function(results) {
        app.globalData.bothOpenid = results.bothOpenid; //情侣id

        if (results.lovesDateType == '公历') {
          that.setData({
            bgImg: results.bgImg
          })
          app.globalData.day = utils.datedifference(results.lovesDate, utils.formatTime(new Date())),
            that.update(parseInt(app.globalData.day));
        } else {
          var dateArr = utils.toChineseNum(results.lovesDate); //取到一个数组
          var newDate = utils.Lunar.toSolar(dateArr[0], dateArr[1], dateArr[2]); //新历
          app.globalData.day = utils.datedifference(newDate, utils.formatTime(new Date()));
          that.update(parseInt(app.globalData.day));
          that.setData({
            bgImg: results.bgImg
          })
        }
        app.globalData.lovesDate = results.lovesDate;
        app.globalData.bgImg = results.bgImg;
      })
      .catch(function(reason) {
        console.log(reason);
      })
  },
  openConfirm: function() { //重新授权
    var that = this;
    wx.showModal({
      content: '没有授权将无法使用定位和天气功能',
      confirmText: "去授权",
      confirmColor: '#F597B1',
      showCancel: false,
      success: function(res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              if (!res.authSetting['scope.userLocation']) {
                that.openConfirm();
              } else {
                that.getLocation();
              }
            }
          })
        }
      }
    })
  },
  saveImageToPhotosAlbum: function(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.showModal({
      title: '提示',
      content: '是否保存背景图',
      confirmColor: '#F597B1',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '保存中...'
          })
          wx.downloadFile({
            url: url,
            success: function(res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '保存成功',
                    showCancel: false,
                    confirmColor: '#F597B1',
                  })
                },
                fail: function(err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                    wx.showModal({
                      title: '提示',
                      content: '需要您授权保存相册',
                      showCancel: false,
                      confirmColor: '#F597B1',
                      success: modalSuccess => {
                        wx.openSetting({
                          success(settingdata) {
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次点击图片即可保存',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存到相册哦~',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                },
                complete(res) {
                  wx.hideLoading()
                }
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    if (!that.data.state) {
      request.checkUserState({
        "openid": app.globalData.openid
      }, function(myUserInfo) {
        if (!myUserInfo.state) {
          that.setData({
            state: myUserInfo.state
          })
          wx.showModal({
            title: '未解锁',
            content: '请先去牵手再来解锁此功能',
            showCancel: false,
            confirmText: '去牵手',
            confirmColor: '#F597B1',
            success: function(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/my/my',
                })
              }
            },
          })
        }
      })
    } else {
      that.setData({
        myUserInfo: app.globalData.myUserInfo,
        partnerUserInfo: app.globalData.partnerUserInfo,
        state: app.globalData.state,
        day: app.globalData.day,
        lovesDate: app.globalData.lovesDate,
        bgImg: app.globalData.bgImg
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this;
    request.updateUserInfo(app.globalData.myUserInfo, function(data) {
      if (data.state) {
        that.setData({
          partnerUserInfo: data,
          state: data.state
        })
        app.globalData.state = data.state;
        app.globalData.partnerUserInfo = data;
        app.globalData.bgImg = data.bgImg;
        that.getLocation(); //获取天气
        that.getLovesDateAndBgImg();
        request.getPhotoAndMsg({ //获取下恋爱日期
          "bothOpenid": data.bothOpenid
        }, function(data) {
          app.globalData.lovesDate = data.lovesDate;
          wx.stopPullDownRefresh(); //关闭下拉刷新
          wx.showToast({
            title: '成功',
          })
        })
      } else {
        wx.stopPullDownRefresh(); //关闭下拉刷新
        wx.showToast({
          title: '成功',
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

  }
})