const app = getApp();
const request = require('../../../utils/request.js');
const utils = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    showMore: false,
    count: 0,
    showMoreTxt: '查看更早的消息...',
    showing: false
  },
  getDetail: function(e) {
    var itemId = e.currentTarget.dataset.itemid;
    var type = e.currentTarget.dataset.type;
    if (type != "dynamics") {
      request.getPhotoAndMsg({
        "bothOpenid": app.globalData.bothOpenid
      }, function(data) {
        for (var i = 0; i < data[type].length; i++) {
          if (data[type][i].id == itemId) {
            var data = data[type][i];
            break;
          }
        }
        wx.navigateTo({
          url: 'getCommentDetail/getCommentDetail?data=' + JSON.stringify(data),
        })
      })
    } else {
      wx.navigateTo({
        url: '../detail/detail?id=' + itemId,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  showMore: function() {
    var that = this;
    var currentCount = that.data.count + that.data.comments.length;
    that.setData({
      showing: true
    })
    setTimeout(function() {
      if (currentCount == that.data.allComment.length) {
        that.setData({
          showMoreTxt: '没有更多信息了'
        })
      } else {
        if ((that.data.allComment.length - currentCount) >= 5) {
          that.setData({
            comments: that.data.comments.concat(that.data.allComment.slice(currentCount, currentCount + 5))
          })
        } else {
          that.setData({
            comments: that.data.comments.concat(that.data.allComment.slice(currentCount, that.data.allComment.length))
          })
        }
      }
      that.setData({
        showing: false
      })
    }, 1500)
  },
  onLoad: function(options) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    request.getLeaveMessageInfo({
      'openid': app.globalData.openid
    }, function(data) {
      //多久前
      for (var i = 0; i < data.comments.length; i++) {
        data.comments[i].timeAgo = utils.timeFn(data.comments[i].createDate)
      }
      data.comments = data.comments.reverse();
      that.data.allComment = data.comments.concat();
      data.comments.length = app.globalData.commentCount;
      that.setData({
        comments: data.comments,
        showMore: true
      })
      wx.hideLoading();
      //数据渲染成功之后
      request.clearNewComments({
        'openid': app.globalData.openid
      }, function() {
        app.globalData.commentCount = '0';
      });
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