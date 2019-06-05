const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    comment: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  upload: function() {
    if (this.data.action == "leaveMsg") {
      var data = {};
      data.msg = this.data.msg;
      data.bothOpenid = app.globalData.bothOpenid;
      data.senderInfo = app.globalData.myUserInfo,
      data.id = this.data.id;
      data.type = this.data.type;
      data.action = this.data.action;
      data.partnerOpenid = app.globalData.partnerUserInfo.openid;
    } else {
      var data = this.data.data;
      data.msg = this.data.msg;
      data.partnerOpenid = app.globalData.partnerUserInfo.openid;
    }
    wx.showLoading({
      title: '发表中',
    })
    request.addComments(data, function () {
      wx.hideLoading();
      app.globalData.socket.emit('sendNewComment',app.globalData.partnerUserInfo);
      wx.switchTab({
        url: '/pages/dynamics/dynamics'
      })
    })
  },
  input: function(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    if (options.action == "leaveMsg") {
      that.data.action = "leaveMsg";
      that.data.id = options.id;
      that.data.type = options.type;
      that.data.action = options.action;
    } else {
      that.data.action = "reply";
      that.data.data = JSON.parse(options.data);
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})