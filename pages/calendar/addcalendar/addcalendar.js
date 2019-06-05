const app = getApp();
const utils = require('../../../utils/util.js');
const request = require('../../../utils/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    show: false,
    dateInfo: {},
    now: utils.formatTime(new Date()),
    remindTxt: '不重复提醒',
    msg: '',
    detail: ''
  },
  onChange(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  detail: function(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  add: function() {
    var that = this;
    if (that.data.msg == '') {
      wx.showToast({
        title: '纪念内容不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.detail == '') {
      wx.showToast({
        title: '详细记录时刻更能回味哦~',
        icon: 'none',
        duration: 2000
      })
    } else {
      var defaultDateInfo = {
        dateType: '公历',
        dateStr: that.data.now,
        showYear: true
      };
      if (JSON.stringify(that.data.dateInfo) == "{}") {
        var obj = defaultDateInfo;
      } else {
        var obj = that.data.dateInfo;
      }
      obj.msg = that.data.msg;
      obj.detail = that.data.detail;
      obj.remindTxt = that.data.remindTxt;
      obj.remindFlag = that.data.remindTxt == '不重复提醒' ? false : true;
      obj.bothOpenid = app.globalData.bothOpenid;
      obj.senderInfo = app.globalData.myUserInfo;
      obj.type = 'calendar';
      wx.showLoading({
        title: '添加中',
      })
      request.addCalendar(obj, function() {
        wx.hideLoading();
        wx.navigateBack({
          delta: 1
        })
      })
    }
  },
  remind: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['不重复提醒', '每月重复提醒', '每年重复提醒'],
      success(res) {
        var temp = '不重复提醒';
        switch (res.tapIndex) {
          case 0:
            temp = '不重复提醒';
            break;
          case 1:
            temp = '每月重复提醒';
            break;
          case 2:
            temp = '每年重复提醒';
            break;
        }
        that.setData({
          remindTxt: temp
        })
      }
    })
  },
  submit: function(e) {
    this.setData({
      dateInfo: e.detail
    })
  },
  showDatePickerPlus: function() {
    this.setData({
      show: true
    })
  },
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