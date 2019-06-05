const app = getApp();
const request = require('../../utils/request.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function() {

  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.myUserInfo = e.detail.userInfo;
      //用户数据 插进数据库
      app.globalData.myUserInfo.openid = app.globalData.openid;
      request.addSingleUser(app.globalData.myUserInfo, function(data) {
        console.log("添加用户成功");
        app.globalData.state = data;
        //app.onLaunch();
        if (app.globalData.hadShareData) {
          wx.reLaunch({
            url: '/pages/my/my'
          })
          app.onLaunch();//index页面需要
        } else {
          wx.reLaunch({
            url: '/pages/index/index'
          })
          app.onLaunch();//index页面需要
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('返回授权')
          }
        }
      })
    }
  },
  onShow: function() {

  }
})