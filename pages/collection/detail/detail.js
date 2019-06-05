// pages/collection/detail/detail.js
const app = getApp();
const innerAudioContext = wx.createInnerAudioContext() //全局唯一的语音播放管理器
var isPlaying = false; //标识当前是否在播放语音
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    data: {}
  },
  previewImage: function(e) {
    let arr = [];
    arr.push(e.currentTarget.dataset.url);
    wx.previewImage({
      current: arr[0], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  playRecord: function(e) {
    var url = e.currentTarget.dataset.url;
    innerAudioContext.src = url;
    if (isPlaying) {
      innerAudioContext.stop();
    } else {
      innerAudioContext.play();
    }
  },
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    var that = this;
    if (data.type === 'image') {
      wx.getImageInfo({
        src: data.url,
        success(res) {
          that.setData({
            data: data,
            height: res.height
          })
        }
      })
    } else {
      that.setData({
        data: data
      })
    }

    innerAudioContext.onPlay(() => { //监听语音播放
      console.log('开始播放');
      isPlaying = true;
    })

    innerAudioContext.onStop(() => { //监听语音手动停止
      console.log('手动停止播放');
      isPlaying = false;
    })

    innerAudioContext.onEnded(() => { //监听音频自然播放至结束的事件
      console.log('自然停止播放');
      isPlaying = false;
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