const app = getApp();
const utils = require('../../../../utils/util.js');
const request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    now: utils.formatTime(new Date()),
    msg: ''
  },
  showDatePickerPlus: function() {
    this.setData({
      show: true
    })
  },
  submit: function(e) {
    console.log(e.detail);
    this.setData({
      dateInfo: e.detail
    })
  },
  showTips: function() {
    wx.showLoading({
      title: '正在保存',
    })
    setTimeout(function() {
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 1000,
        success: function() {
          setTimeout(function() {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        }
      })
    }, 2000)
  },
  save: function() {
    if (this.data.canItDelete) { //可以删除的
      if (this.data.dateInfo) {
        this.data.dateInfo.canItDelete = this.data.canItDelete;
        this.data.dateInfo.msg = this.data.msg;
        this.data.dateInfo.remindTxt = this.data.remindTxt;
        this.data.dateInfo.detail = this.data.detail;
        if (this.data.remindTxt == '不重复提醒') {
          this.data.dateInfo.remindFlag = false;
        } else {
          this.data.dateInfo.remindFlag = true;
        }
        this.data.dateInfo.bothOpenid = app.globalData.bothOpenid;
        this.data.dateInfo.id = this.data.data.id;
        wx.showLoading({
          title: '保存中',
        })
        request.editCalendar(this.data.dateInfo, function() {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
            }
          })
        })
      } else {
        this.data.data.msg = this.data.msg;
        this.data.data.remindTxt = this.data.remindTxt;
        this.data.data.detail = this.data.detail;
        if (this.data.remindTxt == '不重复提醒') {
          this.data.data.remindFlag = false;
        } else {
          this.data.data.remindFlag = true;
        }
        this.data.data.canItDelete = this.data.canItDelete;
        wx.showLoading({
          title: '保存中',
        })
        request.editCalendar(this.data.data, function() {
          wx.hideLoading();
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 1000,
            success: function() {
              setTimeout(function() {
                wx.navigateBack({
                  delta: 2
                })
              }, 1500)
            }
          })
        })
      }
    } else {
      if (this.data.dateInfo) { //用户点击了日期插件
        if (this.data.dateInfo.dateStr == this.data.data.dateStr) { //日期没有修改
          this.showTips();
        } else { //修改数据库的信息
          wx.showLoading({
            title: '正在保存',
          })
          var obj = {};
          obj.bothOpenid = app.globalData.bothOpenid;
          obj.canItDelete = this.data.canItDelete;
          obj.dateStr = this.data.dateInfo.dateStr;
          obj.dateType = this.data.dateInfo.dateType;
          request.editCalendar(obj, function() {
            if (obj.dateType == '农历') {
              var dateArr = utils.toChineseNum(obj.dateStr); //取到一个数组
              var newDate = utils.Lunar.toSolar(dateArr[0], dateArr[1], dateArr[2]); //新历
            } else {
              var newDate = obj.dateStr
            }
            app.globalData.day = utils.datedifference(newDate, utils.formatTime(new Date()));
            app.globalData.lovesDate = obj.dateStr;
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000,
              success: function() {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 2
                  })
                }, 1500)
              }
            })
          })
        }
      } else {
        this.showTips();
      }
    }
  },
  onChange(e) {
    this.setData({
      msg: e.detail.value
    })
  },
  remind: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['不重复提醒', '每月重复提醒', '每年重复提醒'],
      success(res) {
        var temp = '不重复提醒';
        switch (res.tapIndex) {
          case 0:
            temp = '不重复提醒';
            break;
          case 1:
            temp = '每月重复提醒';
            break;
          case 2:
            temp = '每年重复提醒';
            break;
        }
        that.setData({
          remindTxt: temp
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  detail(e) {
    this.setData({
      detail: e.detail.value
    })
  },
  onLoad: function(options) {
    var data = JSON.parse(options.data);
    var canItDelete = options.canItDelete == 'true' ? true : false;
    this.setData({
      data: data,
      canItDelete: canItDelete,
      msg: data.msg,
      detail: data.detail
    })
    if (canItDelete) {
      this.setData({
        remindTxt: data.remindTxt
      })
    }
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