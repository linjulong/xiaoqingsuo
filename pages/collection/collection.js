// pages/collection/collection.js
const app = getApp();
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    inputShowed: false,
    inputVal: "",
    allData: [],
    dataList: []
  },
  onLoad: function(options) {
    var that = this;
    that.data.allData = wx.getStorageSync('collectItem') || [];
    that.setData({
      dataList: that.data.allData.concat()
    })
  },
  del: function(e) {
    for (var i = 0; i < this.data.dataList.length; i++) { //先去更新视图层
      if (e.currentTarget.dataset.id == this.data.dataList[i].id) {
        this.data.dataList.splice(i, 1);
        this.setData({
          dataList: this.data.dataList
        })
      }
    }
    for (var j = 0; j < this.data.allData.length; j++) { //对记录的全部数据进行操作
      if (e.currentTarget.dataset.id == this.data.allData[j].id) {
        this.data.allData.splice(j, 1);
        wx.setStorage({
          key: 'collectItem',
          data: this.data.allData
        })
      }
    }
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false,
      dataList: this.data.allData
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: "",
      dataList: this.data.allData
    });
  },
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value,
      dataList: utils.search(this.data.allData, e.detail.value)
    });
  },
  sort: function(e) {
    let type = e.currentTarget.dataset.type;
    let arr = [];
    for (var i = 0; i < this.data.allData.length; i++) {
      if (this.data.allData[i].type == type) {
        arr.push(this.data.allData[i]);
      }
    }
    this.setData({
      dataList: arr
    })
  },
  getDetail: function(e) {
    wx.navigateTo({
      url: 'detail/detail?data=' + JSON.stringify(e.currentTarget.dataset.item),
    })
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})