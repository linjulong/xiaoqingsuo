const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    data: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  deleteCalendar: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除纪念日',
      confirmColor: '#F597B1',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          request.deleteCalendar(that.data.data, function() {
            wx.hideLoading();
            wx.showToast({
              title: '成功',
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1800)
          })
        }
      }
    })
  },
  editCalendar: function() {
    var that = this;
    wx.navigateTo({
      url: 'editCalendar/editCalendar?data=' + JSON.stringify(that.data.data) + '&canItDelete=' + that.data.canItDelete,
    })
  },
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    var canItDelete = options.canItDelete == 'true' ? true : false;
    this.setData({
      bgImg: app.globalData.bgImg,
      data: data,
      canItDelete: canItDelete
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