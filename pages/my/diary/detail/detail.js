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
  del: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      confirmColor: '#F597B1',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '删除中',
          })
          request.deleteDiary(that.data.data, function() {
            wx.hideLoading();
            wx.showToast({
              title: '成功',
              duration: 1500,
              success: function() {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    this.setData({
      data: data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        const query = wx.createSelectorQuery()
        query.select('#btn').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res1) {
          that.setData({
            scrollViewHeight: res.windowHeight - res1[0].height - that.data.CustomBar
          })
        })
      }
    })
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