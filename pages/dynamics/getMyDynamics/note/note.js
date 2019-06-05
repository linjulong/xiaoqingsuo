const app = getApp();
const request = require('../../../../utils/request.js');
const utils = require('../../../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },
  getDetail: function (e) {
    wx.navigateTo({
      url: '../../detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: (res.windowWidth - 30) / 3,
          height: (res.windowWidth - 30) / 3
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    request.getLeaveMessageInfo({
      'openid': app.globalData.openid
    }, function(data) {
      //多久前
      var data = data.dynamics;
      for (var i = 0; i < data.length; i++) {
        data[i].timeAgo = utils.timeFn(data[i].createDate);
        if (data[i].uploadImgCount > 3) {
          data[i].uploadImgArr.length = 3;
        }
      }
      that.setData({
        dataMany: data.reverse()
      })
      wx.hideLoading();
    })
  },
  onShow: function() {
    var that = this;
  },
});