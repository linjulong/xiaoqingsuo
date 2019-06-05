const app = getApp();
const request = require('../../utils/request.js');
const utils = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    scrollViewHeight: 0,
    show: true
  },
  onLoad: function() {
    
  },
  add: function() {
    wx.navigateTo({
      url: 'addcalendar/addcalendar',
    })
  },
  getDetail: function(e) {
    var canItDelete = e.currentTarget.dataset.canitdelete == 'true' ? true : false;
    if (canItDelete) {
      var data = JSON.stringify(e.currentTarget.dataset.data);
    } else {
      var data = {};
      data.datedifference = this.data.day;
      data.dateStr = this.data.lovesDate;
      data.msg = '我们相爱';
      data = JSON.stringify(data);
    }
    wx.navigateTo({
      url: 'calendarDetail/calendarDetail?data=' + data + '&canItDelete=' + canItDelete,
    })
  },
  onShow: function() {
    var that = this;
    if (app.globalData.state) {
      that.setData({
        day: app.globalData.day,
        lovesDate: app.globalData.lovesDate
      })
      if (!that.data.calendar){
        wx.showLoading({
          title: '加载中',
        })
      }
      request.getCalendar({
        "bothOpenid": app.globalData.bothOpenid
      }, function(data) {
        var tempCalendar = data.calendar;
        for (var i = 0; i < tempCalendar.length; i++) {
          if (tempCalendar[i].dateType == '农历') { //如果日期为农历则需要经过转换
            var dateArr = utils.toChineseNum(tempCalendar[i].dateStr); //取到一个数组
            var newDate = utils.Lunar.toSolar(dateArr[0], dateArr[1], dateArr[2]); //新历  真机上有问题
            if (tempCalendar[i].remindFlag) { //纪念日设置了提醒
              if (tempCalendar[i].remindTxt == '每年重复提醒') {
                tempCalendar[i].datedifference = utils.datedifference(utils.getOldAnnual(newDate, dateArr), utils.formatTime(new Date()));
              } else {
                tempCalendar[i].datedifference = utils.datedifference(utils.getOldMonthly(dateArr), utils.formatTime(new Date()));
              }
            } else {
              tempCalendar[i].datedifference = utils.datedifference(newDate, utils.formatTime(new Date()));
            }
          } else {
            if (tempCalendar[i].remindFlag) { //纪念日设置了提醒
              if (tempCalendar[i].remindTxt == '每年重复提醒') {
                tempCalendar[i].datedifference = utils.datedifference(utils.getNewAnnual(tempCalendar[i].dateStr), utils.formatTime(new Date()));
              } else {
                tempCalendar[i].datedifference = utils.datedifference(utils.getNewMonthly(tempCalendar[i].dateStr), utils.formatTime(new Date()))
              }
            } else {
              tempCalendar[i].datedifference = utils.datedifference(tempCalendar[i].dateStr, utils.formatTime(new Date()));
            }
          }
        }
        that.setData({
          calendar: utils.sortarr(tempCalendar),
          show: false
        })
        wx.hideLoading()
      })
    }else{
      wx.showModal({
        title: '未解锁',
        content: '请先去牵手再来解锁此功能',
        showCancel: false,
        confirmText: '去牵手',
        confirmColor: '#F597B1',
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }
        },
      })
    }
  },
  onReady: function() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        const query = wx.createSelectorQuery()
        query.select('.header').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec(function(res1) {
          that.setData({
            scrollViewHeight: res.windowHeight - res1[0].height - that.data.CustomBar
          })
        })
      }
    })
  }
})