// pages/my/album/album.js
const app = getApp();
const request = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    list: [],
    showEdit: true, //是否可点击管理
    apply: false, //编辑删除框显示
    disabled: true,
    newArray: [], //未选初始状态数组
    tag: [], //判断选择删除时的数组
    count: 0, //删除选中的数量
    deleteArr: [] //确定删除的数组中的id和url对象，传后端使用
  },

  edit: function() {
    var that = this;
    if (that.data.showEdit) { //可点击管理
      wx.showActionSheet({
        itemList: ['上传', '编辑'],
        success(res) {
          if (res.tapIndex == 0) { //点击了上传
            wx.navigateTo({
              url: 'uploadPicture/uploadPicture',
            })
          } else if (res.tapIndex == 1) { //点击了编辑
            that.setData({
              showEdit: false,
              apply: true
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },


  cancelApply: function() {
    var that = this;
    // 编辑中恢复未选状态数组
    var newArray = that.data.newArray;
    that.setData({
      tag: newArray,
      count: 0,
      showEdit: true,
      apply: false,
      disabled: false,
      deleteArr: []
    })
  },

  previewImage: function(e) { //预览图片
    var that = this;
    if (that.data.apply == false) { //编辑框未打开时
      var current = e.currentTarget.dataset.url;
      var tempUrlsArr = [];
      for (var i = 0; i < that.data.list.length; i++) {
        tempUrlsArr = tempUrlsArr.concat(that.data.list[i].uploadImgArr);
      }
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: tempUrlsArr // 需要预览的图片http链接列表
      })
    }
  },

  selectDelete: function(e) {
    var that = this;
    var i = e.currentTarget.dataset.i;
    var j = e.currentTarget.dataset.j;
    var id = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var newTag = that.data.tag; //选择图片的i和j
    var newCount = that.data.count
    var objs = that.data.deleteArr; //存储id和url
    var Exit = false; //判断是否存在相同id
    var ele = { //点击产生的对象
      id: id,
      index: [url]
    }
    if (newTag[i][j] == 0) {
      newTag[i][j] = 1; //选择
      newCount = newCount + 1;
      for (var i = 0; i < objs.length; i++) {
        if (objs[i].id == id) { //存在相同id
          objs[i].index.push(url);
          Exit = true;
          break;
        }
      }
      if (!Exit) { //不存在相同id
        objs.push(ele);
      }
    } else {
      newTag[i][j] = 0; //取消选择
      if (that.data.count > 0) { //当前选择数量不为0
        newCount = newCount - 1;
      }
      for (var w = 0; w < objs.length; w++) { //删除传送的对应数组
        if (objs[w].id == id && objs[w].index.length > 1) { //此对象不只有一张图片
          for (var h = 0; h < objs[w].index.length; h++) {
            if (objs[w].index[h] == url) {
              objs[w].index.splice(h, 1)
            }
          }
        } else if (objs[w].id == id && objs[w].index.length <= 1) { //只有一张图片
          objs.splice(w, 1); //删除整个对象
        }
      }
    };


    that.setData({
      tag: newTag,
      count: newCount,
      deleteArr: objs
    })

    if (that.data.count == 0) { //按钮是否可以点击
      that.setData({
        disabled: true
      })
    } else {
      that.setData({
        disabled: false
      })
    }
  },

  deleteSelete: function() { //删除选择的
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      confirmColor: '#F597B1',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除..',
          })
          request.deletePhoto({
            bothOpenid: app.globalData.bothOpenid,
            obj: that.data.deleteArr,
          }, function(res) {
            wx.hideLoading();
            that.setData({ //恢复状态
              tag: that.data.newArray,
              count: 0,
              deleteArr: [],
              showEdit: true,
              apply: false,
              disabled: true,
              list: res.reverse()
            });
          })
        }
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
          width: (res.windowWidth * 17 / 24 - 6 * 5) / 3,
          height: (res.windowWidth * 17 / 24 - 6 * 5) / 3,
          windowHeight: res.windowHeight - app.globalData.CustomBar
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    request.getPhotoAndMsg({
      "bothOpenid": app.globalData.bothOpenid
    }, function(data) {
      var newArray = []; //一维数组
      for (var i = 0; i < data.photo.length; i++) {
        newArray[i] = [] //二维数组
        for (var j = 0; j < 9; j++) {
          newArray[i][j] = 0
        }
      }
      that.setData({
        newArray: newArray,
        list: data.photo.reverse(), //顺序
        tag: newArray
      })
      wx.hideLoading();
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