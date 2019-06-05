const app = getApp();
const request = require('../../../../utils/request.js');
const utils = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
  },
  answer: function(e) {
    var that = this;
    var senderInfo = e.currentTarget.dataset.senderinfo;
    var itemId = e.currentTarget.dataset.itemid;
    var commentId = e.currentTarget.dataset.commentid;
    var type = e.currentTarget.dataset.type;
    if (senderInfo.openid == app.globalData.openid) { //判断是不是自己的留言 如果是则显示删除
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) {
            wx.showLoading({
              title: '删除中',
            })
            request.deleteComment(app.globalData.bothOpenid, type, itemId, commentId, function() { //删除留言
              wx.hideLoading();
              for (var j = 0; j < that.data.data.comments.length; j++) {
                if (that.data.data.comments[j].id == commentId) {
                  that.data.data.comments.splice(j, 1);
                  that.setData({
                    data: that.data.data
                  })
                  break;
                }
              }
            })
          }
        }
      })
    } else { //回复
      var obj = {};
      obj.bothOpenid = app.globalData.bothOpenid;
      obj.type = type;
      obj.id = itemId;
      obj.action = "reply";
      obj.replyer = app.globalData.myUserInfo;
      obj.senderInfo = senderInfo;
      wx.navigateTo({
        url: '../../addComment/addComment?data=' + JSON.stringify(obj)
      })
    }
  },
  comment: function(e) {
    wx.navigateTo({
      url: '../../addComment/addComment?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&action=' + e.currentTarget.dataset.action,
    })
  },
  getComments: function() {
    wx.navigateTo({
      url: '../../getComment/getComment',
    })
  },
  getCalendar: function(e) {
    var canItDelete = e.currentTarget.dataset.canitdelete == 'true' ? true : false;
    var data = JSON.stringify(e.currentTarget.dataset.data);
    wx.navigateTo({
      url: '../../../calendar/calendarDetail/calendarDetail?data=' + data + '&canItDelete=' + canItDelete,
    })
  },
  getDiary: function(e) {
    var data = e.currentTarget.dataset.data;
    wx.navigateTo({
      url: '../../../my/diary/detail/detail?data=' + JSON.stringify(data),
    })
  },
  previewImage: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.data.uploadImgArr // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    console.log(data);
    if (data.dateType == '农历') { //如果日期为农历则需要经过转换
      var dateArr = utils.toChineseNum(data.dateStr); //取到一个数组
      var newDate = utils.Lunar.toSolar(dateArr[0], dateArr[1], dateArr[2]); //新历
      if (data.remindFlag) { //纪念日设置了提醒
        if (data.remindTxt == '每年重复提醒') {
          data.datedifference = utils.datedifference(utils.getOldAnnual(newDate, dateArr), utils.formatTime(new Date()));
        } else {
          data.datedifference = utils.datedifference(utils.getOldMonthly(dateArr), utils.formatTime(new Date()));
        }
      } else {
        data.datedifference = utils.datedifference(newDate, utils.formatTime(new Date()));
      }
    } else {
      if (data.remindFlag) { //纪念日设置了提醒
        if (data.remindTxt == '每年重复提醒') {
          data.datedifference = utils.datedifference(utils.getNewAnnual(data.dateStr), utils.formatTime(new Date()));
        } else {
          data.datedifference = utils.datedifference(utils.getNewMonthly(data.dateStr), utils.formatTime(new Date()))
        }
      } else {
        data.datedifference = utils.datedifference(data.dateStr, utils.formatTime(new Date()));
      }
    }
    data.timeAgo = utils.timeFn(data.createDate);
    this.setData({
      data: data
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