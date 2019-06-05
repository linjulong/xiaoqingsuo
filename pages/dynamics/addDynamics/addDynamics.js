const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgList: [],
    title: '',
    content: '',
    uploadImgArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  chooseImg: function() {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.imgList.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        that.data.imgList = res.tempFilePaths.concat(that.data.imgList);
        that.setData({
          imgList: that.data.imgList
        })
      }
    })
  },
  deleteImage: function(event) {
    var index = event.currentTarget.dataset.index;
    var that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.imgList.splice(index, 1);
    setTimeout(function() {
      that.setData({
        deleteIndex: -1,
        imgList: that.data.imgList
      });
    }, 500);
  },
  previewImage: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.imgList // 需要预览的图片http链接列表
    })
  },
  title: function(e) {
    this.data.title = e.detail.value;
  },
  content: function(e) {
    this.data.content = e.detail.value;
  },
  upload: function() {
    var that = this;
    if (that.data.title == '' || that.data.content == '') {
      wx.showModal({
        title: '提示',
        content: '标题或者内容不能为空',
        showCancel: false,
        confirmColor: '#F597B1',
      })
    } else {
      if (that.data.imgList.length > 0) {
        that.setData({
          loadModal: true
        })
        this.upLoadImg(that.data.imgList, 0);
      } else {
        var obj = {};
        obj.hadImage = false;
        obj.uploadImgArr = [];
        obj.title = that.data.title;
        obj.content = that.data.content;
        obj.senderInfo = app.globalData.myUserInfo;
        wx.request({
          url: request.url + '/user/savePhotoArrAndMsg/dynamics',
          data: obj,
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },
  upLoadImg: function(imgPath, i) { //imgPath是一个数组 实现的功能是多文件上传 要传完一个再下一个 complete是回调函数
    var that = this;
    var imgLength = imgPath.length;
    const uploadImgTask = wx.uploadFile({
      url: request.url + '/user/savePhoto/dynamics',
      filePath: imgPath[i],
      name: 'image',
      success: (res) => {
        i++;
        if (i == imgPath.length) {
          that.data.uploadImgArr.push(res.data);
          console.log("图片上传完毕");
          var obj = {};
          obj.hadImage = true;
          obj.uploadImgArr = that.data.uploadImgArr;
          obj.title = that.data.title;
          obj.content = that.data.content;
          obj.senderInfo = app.globalData.myUserInfo;
          wx.request({
            url: request.url + '/user/savePhotoArrAndMsg/dynamics',
            data: obj,
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success(res) {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          that.upLoadImg(imgPath, i);
          that.data.uploadImgArr.push(res.data);
        }
      }
    });
    uploadImgTask.onProgressUpdate((res) => { //监听上传进度
      that.setData({
        progress: res.progress
      })
      if (i == imgPath.length - 1 && res.progress == 100) {
        that.setData({
          loadModal: false
        })
      }
    })
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height1: res.windowHeight,
          width: (res.windowWidth - 5 * 10) / 4,
          height: (res.windowWidth - 5 * 10) / 4
        })
      }
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