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
    showDelete: false,
    i: -1, //图片的x和y坐标 用来删除一张具体的图片
    j: -1,
    showModal: false
  },
  edit: function() {
    var that = this;
    if (that.data.showDelete) {
      var itemList = ['取消编辑'];
      wx.showActionSheet({
        itemList: itemList,
        success(res) {
          if (res.tapIndex == 0) {
            that.setData({
              showDelete: !that.data.showDelete
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    } else {
      var itemList = ['上传', '编辑'];
      wx.showActionSheet({
        itemList: itemList,
        success(res) {
          if (res.tapIndex == 0) {
            wx.navigateTo({
              url: 'uploadPhoto/uploadPhoto',
            })
          } else if (res.tapIndex == 1) {
            that.setData({
              showDelete: !that.data.showDelete
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  deleteImage: function(event) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      confirmColor: '#F597B1',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          var i = event.currentTarget.dataset.i;
          var j = event.currentTarget.dataset.j;
          if (that.data.list[i].uploadImgArr.length > 1) {
            request.deletePhoto({
              bothOpenid: app.globalData.bothOpenid,
              id: that.data.list[i].id,
              index: j,
              deleteItem: false
            }, function() {
              wx.hideLoading();
              that.setData({
                i: i,
                j: j
              });
              that.data.list[i].uploadImgArr.splice(j, 1);
              setTimeout(function() {
                that.setData({
                  i: -1,
                  j: -1,
                  list: that.data.list
                });
              }, 500);
            })
          } else { //当只剩下一张图片 则删除整项
            request.deletePhoto({
              bothOpenid: app.globalData.bothOpenid,
              id: that.data.list[i].id,
              deleteItem: true
            }, function() {
              wx.hideLoading();
              that.data.list.splice(i, 1);
              that.setData({
                list: that.data.list
              });
            })
          }
        }
      }
    })
  },
  deleteItemArr: function(event) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      confirmColor: '#F597B1',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
          })
          var index = event.currentTarget.dataset.index;
          request.deletePhoto({
            bothOpenid: app.globalData.bothOpenid,
            id: that.data.list[index].id,
            deleteItem: true
          }, function() {
            wx.hideLoading();
            that.data.list.splice(index, 1);
            that.setData({
              list: that.data.list
            });
          })
        }
      }
    })
  },
  hideModal: function() {
    this.setData({
      showModal: false
    })
  },
  previewImage: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.url;
    var tempUrlsArr = [];
    for (var i = 0; i < that.data.list.length; i++) {
      tempUrlsArr = tempUrlsArr.concat(that.data.list[i].uploadImgArr);
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: tempUrlsArr // 需要预览的图片http链接列表
    })
  },
  onLoad: function(options) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: (res.windowWidth - 5 * 3) / 4,
          height: (res.windowWidth - 5 * 3) / 4
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
      that.setData({
        list: data.photo.reverse()
      })
      wx.hideLoading();
      if (that.data.list.length == 0) { //显示提示框
        that.setData({
          showModal: true
        })
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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    request.getPhotoAndMsg({
      "bothOpenid": app.globalData.bothOpenid
    }, function(data) {
      that.setData({
        list: data.photo.reverse()
      })
      wx.hideLoading();
      wx.showToast({
        title: '成功',
      })
    })
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