const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showModal: false,
  },
  hideModal: function() {
    this.setData({
      showModal: false
    })
  },
  getDetail: function(e) {
    var data = e.currentTarget.dataset.data;
    wx.navigateTo({
      url: 'detail/detail?data=' + JSON.stringify(data),
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    request.getPhotoAndMsg({
      "bothOpenid": app.globalData.bothOpenid
    }, function (data) {
      that.setData({
        list: data.diary.reverse()
      })
      wx.hideLoading();
      if (that.data.list.length == 0) { //显示提示框
        that.setData({
          showModal: true
        })
      }
    })
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
    wx.showLoading({
      title: '刷新中',
    })
    request.getPhotoAndMsg({
      "bothOpenid": app.globalData.bothOpenid
    }, function(data) {
      that.setData({
        list: data.diary.reverse()
      })
      wx.hideLoading();
      wx.showToast({
        title: '成功',
      })
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
  onShareAppMessage: function() {

  }
})