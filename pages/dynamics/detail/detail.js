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
    showData: false,
    value: '',
    checked: false,
    showInput: false,
    itemId: 0,
    placeholder: '发表评论...',
    sort: false,
    state: false, //是否被收藏了
    reply: false, //当前是留言还是回复
    senderInfo: null //评论的发送者，回复留言用
  },
  concern: function() {
    wx.showModal({
      title: '提示',
      content: '改功能未开放',
      showCancel: false,
      confirmColor: '#F597B1',
    })
  },
  addCollection: function() {
    var that = this;
    wx.showLoading({
      title: '操作中',
    })
    if (that.data.state) { //已经收藏了得就取消收藏
      request.deleteCollection(app.globalData.openid, that.data.itemId, function() {
        wx.hideLoading();
        wx.showToast({
          title: '已取消收藏'
        })
        that.setData({
          state: !that.data.state
        })
      })
    } else {
      that.data.data.openid = app.globalData.openid;
      request.addCollection(that.data.data, function() {
        wx.hideLoading();
        wx.showToast({
          title: '已收藏'
        })
        that.setData({
          state: !that.data.state
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  sort: function() {
    this.data.data.comments.reverse();
    this.setData({
      sort: !this.data.sort,
      data: this.data.data
    })
  },
  toComment: function() {
    var that = this;
    const query = wx.createSelectorQuery()
    query.select('#toComment').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res) {
      wx.pageScrollTo({
        scrollTop: res[0].height,
        duration: 300
      })
    })
  },
  previewImage: function(e) {
    var that = this;
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      urls: that.data.data.uploadImgArr
    })
  },
  radioChange: function() {
    this.setData({
      checked: !this.data.checked,
      focus: true
    })
  },
  bindinput: function(e) {
    this.data.value = e.detail.value;
  },
  createComment: function() {
    var that = this;
    var obj = {};
    obj.type = 'dynamics';
    obj.itemId = this.data.itemId;
    obj.msg = this.data.value;
    obj.senderInfo = app.globalData.myUserInfo;
    if (that.data.reply) { //如果是回复
      obj.action = 'reply';
      obj.replyer = that.data.senderInfo;
    } else {
      obj.action = "leaveMsg";
    }

    wx.showLoading({
      title: '发表中',
    })
    this.setData({
      value: '',
      focus: false
    })
    request.createDynamicsComments(obj, function(data) {
      wx.hideLoading();
      data.timeAgo = utils.timeFn(data.createDate);
      that.data.data.comments.push(data);
      that.data.data.commentCount++;
      that.setData({
        data: that.data.data
      })
      wx.showToast({
        title: '成功',
        icon: 'none'
      })
      if (that.data.checked) { //通知对方
        app.globalData.socket.emit('sendNewCommentDyns', app.globalData.partnerUserInfo, obj);
      }
    })
  },
  addReply: function(e) {
    var that = this;
    if (app.globalData.openid == e.currentTarget.dataset.senderinfo.openid) {
      wx.showActionSheet({
        itemList: ['删除'],
        success(res) {
          if (res.tapIndex == 0) {
            var obj = {};
            obj.itemId = that.data.itemId;
            obj.commentId = e.currentTarget.dataset.id;
            wx.showLoading({
              title: '删除中',
            })
            request.deleteDynamicsComments(obj, function() {
              wx.hideLoading();
              for (var i = 0; i < that.data.data.comments.length; i++) {
                if (that.data.data.comments[i].id == e.currentTarget.dataset.id) {
                  that.data.data.comments.splice(i, 1);
                  that.data.data.commentCount--;
                  that.setData({
                    data: that.data.data
                  })
                  break;
                }
              }
              wx.showToast({
                title: '成功',
                icon: 'none'
              })
            })
          }
        }
      })
    } else {
      that.setData({
        focus: true,
        placeholder: '回复' + e.currentTarget.dataset.senderinfo.nickName
      })
      that.data.reply = true;
      that.data.senderInfo = e.currentTarget.dataset.senderinfo;
    }
  },
  bindconfirm: function(e) {
    this.createComment();
  },
  send: function() {
    this.createComment();
  },
  bindblur: function() {
    var that = this;
    this.setData({
      showInput: false,
      placeholder: '发表评论...'
    })
    setTimeout(function() {
      that.setData({
        reply: false
      })
    }, 500)
  },
  bindfocus: function() {
    if (!this.data.reply) {
      this.setData({
        showInput: true,
      })
    }
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: res.windowWidth
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    request.getDynamicsDetail(options.id, function(data) {
      for (var i = 0; i < data.comments.length; i++) {
        data.comments[i].timeAgo = utils.timeFn(data.comments[i].createDate);
      }
      request.checkHadCollection(app.globalData.openid, options.id, function(state) {
        that.setData({
          data: data,
          itemId: options.id,
          showData: true,
          state: state
        })
        wx.hideLoading();
      })
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