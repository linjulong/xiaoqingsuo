// pages/index/menses/set/set.js
const app = getApp();
const request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    startDate: null, //姨妈开始的时间
    picker: [], //姨妈间隔中的range数组
    index: null, //姨妈间隔被选择的数组下标
    button_txt: '保存',
    loading: false
  },

  DateChange(e) {
    this.setData({
      startDate: e.detail.value
    })
  },

  PickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  saveMenses: function() {
    var that = this;
    var endDate = that.changeEnd(that.data.startDate);
    this.setData({
      button_txt: '保存中',
      loading: true
    })
    request.setMenses({
      bothOpenid: app.globalData.bothOpenid,
      startDate: that.data.startDate,
      endDate: endDate,
      rate: that.data.picker[that.data.index]
    }, function() {
      wx.navigateBack({
        delta: 1
      })
    })
  },

  changeEnd: function(time) { //时间加6获得结束时间
    //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(time));
    var endDate = new Date(time1 + 5 * 24 * 3600 * 1000); //共6天
    return endDate.getFullYear() + "-" + (endDate.getMonth() + 1).toString().padStart(2, '0') + "-" + (endDate.getDate()).toString().padStart(2, '0');
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
    var days = [];
    for (var i = 15; i < 91; i++) { //15-90天
      var str = i + '天';
      days.push(str);
    }
    that.setData({
      picker: days
    })

    request.getMenses({
      bothOpenid: app.globalData.bothOpenid,
    }, function(data) {
      var startDate = data.startDate;
      var rate = parseInt(data.rate) - 15;
      console.log('当前开始时间：' + startDate)
      if (startDate && rate >= 0) { //两者不为空
        that.setData({
          startDate: startDate,
          index: rate
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