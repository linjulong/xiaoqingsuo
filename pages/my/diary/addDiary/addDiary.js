const app = getApp();
const request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    msg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  upload: function() {
    var data = {};
    data.msg = this.data.msg;
    data.bothOpenid = app.globalData.bothOpenid;
    data.senderInfo = app.globalData.myUserInfo,
    data.type = 'diary';
    wx.showLoading({
      title: '保存中',
    })
    request.addDiary(data, function() {
      wx.hideLoading();
      wx.showToast({
        title: '成功',
        duration: 1500,
        success: function(){
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },2000)
        }
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
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
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