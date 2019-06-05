// pages/my/album/uploadPicture/uploadPicture.js
const app = getApp();
const request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    msg: '',
    imgList: [],
    loadModal: false, //上传状态
    uploadImgArr: [] //上传图片返回数组
  },

  msg: function(e) {
    this.setData({
      msg: e.detail.value
    })
  },

  chooseImg: function() {
    var that = this;
    wx.chooseImage({ //从本地相册选择图片或使用相机拍照
      count: 9 - that.data.imgList.length, //最多可以选择的图片张数
      // sizeType: ['original', 'compressed'],//默认，所选的图片的尺寸
      // sourceType: ['album', 'camera'],//默认，选择图片的来源
      success(res) {
        that.data.imgList = res.tempFilePaths.concat(that.data.imgList);
        that.setData({
          imgList: that.data.imgList
        })
      }
    })
  },

  previewImage: function(e) { //当前浏览
    var that = this;
    var current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.imgList // 需要预览的图片http链接列表
    })
  },

  deleteImage: function(event) { //删除
    var index = event.currentTarget.dataset.index;
    var that = this;
    that.setData({
      deleteIndex: index //通过判定，用于修改图片样式
    });
    that.data.imgList.splice(index, 1);

    setTimeout(function() { //延时消失效果
      that.setData({
        deleteIndex: -1,
        imgList: that.data.imgList
      });
    }, 500);
  },

  upload: function() { //保存上传
    this.setData({ //显示上传框
      loadModal: true
    })
    // console.log(this.data.imgList)
    this.upLoadImg(this.data.imgList, 0);
  },
  upLoadImg: function(imgPath, i) { //imgPath是一个数组 实现的功能是多文件上传 要传完一个再下一个 complete是回调函数
    var that = this;
    var imgLength = imgPath.length; //照片数量
    const uploadImgTask = wx.uploadFile({
      url: request.url + '/user/savePhoto',
      filePath: imgPath[i], //上传文件路径
      name: 'image',
      success: (res) => {
        i++;
        if (i == imgPath.length) { //最后一个上传时
          that.data.uploadImgArr.push(res.data);
          console.log("图片上传完毕");
          request.savePhotoArrAndMsg({
            uploadImgArr: that.data.uploadImgArr,
            msg: that.data.msg,
            bothOpenid: app.globalData.bothOpenid,
            senderInfo: app.globalData.myUserInfo,
            type: 'photo'
          }, function() {
            wx.navigateBack({
              delta: 1
            })
          })
        } else { //递归
          // console.log(res.data);
          that.upLoadImg(imgPath, i);
          that.data.uploadImgArr.push(res.data);
        }
      }
    });

    uploadImgTask.onProgressUpdate((res) => { //监听上传进度
      that.setData({
        progress: res.progress
      })
      if (i == imgPath.length - 1 && res.progress == 100) { //最后一张并且进度为100
        that.setData({
          loadModal: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
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