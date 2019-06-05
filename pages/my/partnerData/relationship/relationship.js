const app = getApp();
const request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },
  breakship: function() {
    var saveMemory = false;
    wx.showModal({
      title: '提示',
      content: '是否解除关系？',
      confirmText: "继续",
      confirmColor: '#f199b1',
      success: function(res) {
        if (!res.cancel) {
          wx.showModal({
            title: '提示',
            content: '是否为您保存情侣数据（不包括聊天记录）方便日后恢复？',
            confirmText: "保存",
            cancelText: '不保存',
            confirmColor: '#f199b1',
            success: function(res) {
              if (res.cancel) {
                wx.showLoading({
                  title: '操作中...',
                })
                app.globalData.partnerUserInfo.saveMemory = saveMemory;
                request.breakship(app.globalData.partnerUserInfo, function() {
                  app.globalData.state = false;
                  app.globalData.partnerUserInfo = null;
                  app.globalData.bothOpenid = '';
                  wx.hideLoading();
                  wx.reLaunch({
                    url: '/pages/my/my'
                  })
                })
              } else {
                wx.showLoading({
                  title: '操作中...',
                })
                saveMemory = true;
                app.globalData.partnerUserInfo.saveMemory = saveMemory;
                request.breakship(app.globalData.partnerUserInfo, function() {
                  app.globalData.state = false;
                  app.globalData.partnerUserInfo = null;
                  app.globalData.bothOpenid = '';
                  wx.hideLoading();
                  wx.reLaunch({
                    url: '/pages/my/my'
                  })
                })
              }
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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