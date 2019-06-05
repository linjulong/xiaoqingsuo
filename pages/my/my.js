const app = getApp();
const request = require('../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    myUserInfo: null,
    partnerUserInfo: null,
    state: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModal: false,
    input_value: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  about: function() {
    wx.showModal({
      title: '提示',
      content: '此小程序属于个人大学学习专用，欢迎各大情侣使用！',
      showCancel: false,
      confirmColor: '#F597B1',
    })
  },
  showModal(e) {
    this.setData({
      showModal: true
    })
  },
  hideModal(e) {
    this.setData({
      showModal: false
    })
  },
  bind: function(that, myUserInfo, partnerUserInfo) {
    var userInfo = [];
    userInfo.push(myUserInfo);
    userInfo.push(partnerUserInfo);
    request.bind(userInfo, function(data) {
      wx.hideLoading();
      that.setData({
        partnerUserInfo: data[0],
        state: true
      })
      //牵手成功之后通知对方
      app.globalData.socket.emit("bindSuccess", data[0]);
      app.globalData.state = true;
      app.globalData.partnerUserInfo = data[0];
      app.globalData.bothOpenid = data[1].bothOpenid;
      app.globalData.bgImg = data[1].bgImg;
      app.globalData.lovesDate = data[1].lovesDate;
    })
  },
  jump: function() {
    wx.navigateTo({
      url: 'partnerData/partnerData',
    })
  },
  onLoad: function(options) {
    var that = this;
    if (app.globalData.hadShareData) { //牵手
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                var partnerUserInfo = app.globalData.shareData;
                app.globalData.myUserInfo = res.userInfo;
                wx.login({
                  success: function(ress) {
                    request.authorize({
                      code: ress.code
                    }, function(data) {
                      app.globalData.openid = data;
                      app.globalData.myUserInfo.openid = data;
                      request.checkUserState({
                        "openid": data
                      }, function(myUserInfo) {
                        app.globalData.state = myUserInfo.state;
                        if (app.globalData.state) {
                          wx.showModal({
                            title: '失败',
                            content: '不能包二奶哦！',
                            showCancel: false
                          })
                          request.getPartnerInfo({
                            "openid": myUserInfo.partnerOpenid
                          }, function(getPartnerInfo) {
                            that.setData({
                              partnerUserInfo: getPartnerInfo,
                              state: true
                            })
                            app.getUserInfo.getPartnerInfo = getPartnerInfo;
                          })
                        } else {
                          if (partnerUserInfo.openid != app.globalData.myUserInfo.openid) {
                            wx.showModal({
                              title: partnerUserInfo.nickName,
                              content: '听说，这世界上有几十亿人口。但某一瞬间，我发现有这么一个人，敌过了千军万马，四海潮王。',
                              cancelText: "残忍拒绝",
                              confirmText: "愿意牵手",
                              confirmColor: '#F597B1',
                              success: function(res) {
                                if (res.cancel) {
                                  //点击取消,默认隐藏弹框
                                  wx.showModal({
                                    title: '拒绝',
                                    content: '您与爱情擦肩而过',
                                    showCancel: false,
                                  })
                                } else {
                                  //点击确定
                                  wx.showLoading({
                                    title: '正在牵手',
                                    mask: true
                                  })
                                  that.bind(that, app.globalData.myUserInfo, partnerUserInfo);
                                }
                              }
                            })
                          } else {
                            wx.showModal({
                              title: '错误',
                              content: '不能跟自己谈恋爱哦',
                              showCancel: false,
                            })
                          }
                        }
                      })
                    })
                  }
                })
              }
            })


          } else {

          }
        }
      })
    }


    if (app.globalData.myUserInfo) { //获取用户自己的头像
      that.setData({
        myUserInfo: app.globalData.myUserInfo,
        partnerUserInfo: app.globalData.partnerUserInfo,
        state: app.globalData.state
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          myUserInfo: app.globalData.myUserInfo,
          partnerUserInfo: app.globalData.partnerUserInfo,
          state: app.globalData.state
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            myUserInfo: app.globalData.myUserInfo,
            partnerUserInfo: app.globalData.partnerUserInfo,
            state: app.globalData.state
          })
        }
      })
    }
  },
  onShow: function() {
    var that = this;
    if (app.globalData.state) {
      wx.showNavigationBarLoading();
      request.updateUserInfo(app.globalData.myUserInfo, function(data) {
        if (data.state) {
          that.setData({
            partnerUserInfo: data,
            state: data.state
          })
          app.globalData.state = data.state;
          app.globalData.partnerUserInfo = data;
          wx.hideNavigationBarLoading();
        } else {

        }
      })
    }

    if (app.globalData.hadNewMemory) { //询问用户是否保存记忆
      wx.showModal({
        title: '提示',
        content: '检测到您的情侣和您解除关系，是否保存以往双方信息',
        confirmText: "保存",
        cancelText: '舍弃',
        confirmColor: '#f199b1',
        success: function(res) {
          if (res.cancel) {
            var saveMemory = false;
            request.saveMemory(app.globalData.openid, saveMemory, function() {
              app.globalData.hadNewMemory = false;
            })
          } else {
            var saveMemory = true;
            wx.showLoading({
              title: '保存中',
            })
            request.saveMemory(app.globalData.openid, saveMemory, function() {
              app.globalData.hadNewMemory = false;
              wx.hideLoading();
            })
          }
        }
      })
    }
  },
  onPullDownRefresh: function() {
    this.setData({
      show: !this.data.show
    })
    var that = this;
    request.updateUserInfo(app.globalData.myUserInfo, function(data) {
      if (data.state) {
        that.setData({
          partnerUserInfo: data,
          state: data.state
        })
        app.globalData.state = data.state;
        app.globalData.partnerUserInfo = data;
        request.getPhotoAndMsg({ //获取下恋爱日期
          "bothOpenid": data.bothOpenid
        }, function(data) {
          app.globalData.lovesDate = data.lovesDate;
          app.globalData.bgImg = data.bgImg;
        })
        wx.stopPullDownRefresh(); //关闭下拉刷新
        wx.showToast({
          title: '成功',
        })
      } else {
        wx.stopPullDownRefresh(); //关闭下拉刷新
        wx.showToast({
          title: '成功',
        })
      }
    })
  },
  input: function(e) {
    this.setData({
      input_value: e.detail.value
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      if (this.data.input_value == '') {
        this.data.input_value = '余生请你 多多指教';
      }
      app.globalData.socket.on('receiveBindSuccess', function() {
        that.onPullDownRefresh();
      });
      return {
        title: this.data.input_value,
        desc: '接受即可和对方成为伴侣',
        path: '/pages/my/my?partnerUserInfo=' + JSON.stringify(app.globalData.myUserInfo),
        imageUrl: "/images/logo.jpg",
        success: function(res) {
          // 转发成功

        },
        fail: function(res) {
          // 转发失败
        }
      }
    } else {
      console.log("普通分享");
    }
  }
})