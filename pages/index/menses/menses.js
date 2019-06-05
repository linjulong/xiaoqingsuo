// pages/index/menses/menses.js
const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    coming: true, //判断是否正处在姨妈期
    startDate: '', //最近来姨妈的时间
    endDate: '', //姨妈结束时间
    rate: 0, //频率
    countDown: '', //倒计时
  },
  doChange: function() { //判断改变显示状态
    var that = this;
    var pass1 = Date.parse(new Date()) - Date.parse(new Date(that.data.startDate)); //当前时间与开始时间相差的毫秒数
    var pass2 = Date.parse(new Date()) - Date.parse(new Date(that.data.endDate)); //当前时间与结束时间相差的毫秒数
    if (pass2 > 0) { //记录的结束在当前时间之前 1.很久没有设置 2.等待下一段开始的时间
      var rates = that.data.rate * 24 * 3600 * 1000; //毫秒数,间隔时间
      var multiple = Math.floor(pass1 / rates); //经过了多少个间隔
      if (multiple >= 1) { //超过一个间隔，自动更新数据库信息
        var newStartDate = that.changeFormat(Date.parse(new Date(that.data.startDate)) + multiple * rates); //新的开始时间的毫秒数
        var newEndDate = that.changeFormat(Date.parse(new Date(that.data.startDate)) + multiple * rates + 6 * 24 * 3600 * 1000); //新的结束时间的毫秒数
        request.setMenses({ //设置更新后的数据
          bothOpenid: app.globalData.bothOpenid,
          startDate: newStartDate,
          endDate: newEndDate,
          rate: that.data.rate
        }, function() {
          that.setData({
            startDate: newStartDate,
            endDate: newEndDate,
            rate: that.data.rate
          })
          wx.showToast({
            title: '依照您的设置已为您自动更新',
            icon: 'none'
          })
          that.doChange(); //重新刷新页面
        })
      } else {
        that.countDo();
        that.setData({
          coming: false
        })
      }
    } else if (pass2 <= 0) { //已经开始，未结束，正在来临的时候
      that.setData({
        coming: true
      })
    }
  },

  countDo: function() {
    var that = this;
    var nextComing = Date.parse(new Date(that.data.startDate)) + (that.data.rate * 24 * 3600 * 1000); //下次来临的日期的毫秒数,结束的时间+频率
    var text = this.formatDuring(nextComing - Date.parse(new Date())); //倒计天数
    this.setData({
      countDown: text,
    })
    setTimeout(this.countDo, 1000);
  },

  setEnd: function() { //提前结束，改变结束不改变开始
    var that = this;
    var newEnd = that.changeFormat(Date.parse(new Date()));
    request.setMenses({ //设置更新后的数据
      bothOpenid: app.globalData.bothOpenid,
      startDate: that.data.startDate, //最近来的时间不改变
      endDate: newEnd, //结束时间
      rate: that.data.rate
    }, function() {
      that.setData({ //变为等待
        coming: false,
        endDate: newEnd
      })
      that.countDo();
    })
  },

  setStart: function() { //提前来到，改变开始和结束
    var that = this;
    var newStart = that.changeFormat(Date.parse(new Date()));
    var newEnd = that.changeFormat(Date.parse(new Date()) + 6 * 24 * 3600 * 1000);
    request.setMenses({ //设置更新后的数据
      bothOpenid: app.globalData.bothOpenid,
      startDate: newStart, //最近来的时间改变
      endDate: newEnd,
      rate: that.data.rate
    }, function() {
      that.setData({ //变为来临
        coming: true,
        startDate: newStart, //最近来的时间改变
        endDate: newEnd
      })
      // that.onLoad(); //重新刷新页面
      // that.onShow()
    })
  },

  formatDuring: function(mss) { //倒计时格式转换
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 ";
  },

  changeFormat: function(time) { //time为毫秒数,把毫秒数转为YYYY-MM-DD格式
    var newTime = new Date(time);
    return newTime.getFullYear() + "-" + (newTime.getMonth() + 1).toString().padStart(2, '0') + "-" + (newTime.getDate()).toString().padStart(2, '0');
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
    request.getMenses({
      bothOpenid: app.globalData.bothOpenid,
    }, function(data) {
      var startDate = data.startDate;
      var endDate = data.endDate;
      var rate = parseInt(data.rate);

      if (!startDate || !rate) { //两者其一为空，从未设置，跳转设置
        wx.navigateTo({
          url: 'set/set',
        })
      } else { //已经有值
        that.setData({
          startDate: startDate,
          rate: rate,
          endDate: endDate
        })
        that.doChange();
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