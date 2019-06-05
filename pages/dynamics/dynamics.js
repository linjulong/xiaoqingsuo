function sortarr(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j].id < arr[j + 1].id) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}
const app = getApp();
const request = require('../../utils/request.js');
const utils = require('../../utils/util.js');
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0, //热门新鲜关注
    current: 0, //二人和社区
    showMore: true,
    hadReachBottom: false,
    noMore: false,
    showMoreTxt: '玩命加载中',
    page: 0,
    dataMany: [],
    tab: [{
        name: '热门',
        index: 0
      },
      {
        name: '新鲜',
        index: 1
      },
      {
        name: '关注',
        index: 2
      }, {
        name: '广告',
        index: 3
      }
    ],
    connectemojiO: ['😊', '😅', '😲', '😭', '😂', '😄', '😩', '😞', '😵', '😒', '😍',
      '😤', '😜', '😝', '😋', '😘', '😚', '😷', '😳', '😃', '😆', '😁', '😢', '😨',
      '😠', '😣', '😌', '😖', '😔', '😰', '😱', '😪', '😏', '😓', '☀', '☁',
    ],
  },
  getDetail: function(e) {
    wx.navigateTo({
      url: 'detail/detail?id=' + e.currentTarget.dataset.id,
    })
  },
  more: function() {
    var that = this;
    var itemList = ['发新帖', '消息', '我的社区'];
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: 'addDynamics/addDynamics',
          })
        } else if (res.tapIndex == 1) {
          request.getLeaveMessageInfo({
            'openid': app.globalData.openid
          }, function(data) {
            if (data.comments.length >= 5) {
              that.globalData.commentCount = 5;
            } else {
              app.globalData.commentCount = data.comments.length;
              wx.navigateTo({
                url: 'getComment/getComment',
              })
            }
          })
        } else if (res.tapIndex == 2) { //获取我的帖子
          wx.navigateTo({
            url: 'getMyDynamics/getMyDynamics',
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      noMore: false,
      dataMany: [],
      showMore: true,
      showMoreTxt: '玩命加载中...'
    })
    this.data.page = 0; //切换了面板page赋值0
    this.getMang(this.data.TabCur, this.data.page);
  },
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          width: (res.windowWidth - 30) / 3,
          height: (res.windowWidth - 30) / 3
        })
      }
    })
    app.globalData.socket.on('haveNewComment', function() {
      if (app.globalData.commentCount) {
        var count = parseInt(app.globalData.commentCount);
      } else {
        var count = 0;
      }
      count++;
      wx.setTabBarBadge({
        index: 1,
        text: count.toString()
      })
      that.setData({
        commentCount: count
      })
      app.globalData.commentCount = count;
    })
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
              for (var i = 0; i < that.data.dataTwo.length; i++) {
                if (that.data.dataTwo[i].id == itemId) {
                  for (var j = 0; j < that.data.dataTwo[i].comments.length; j++) {
                    if (that.data.dataTwo[i].comments[j].id == commentId) {
                      that.data.dataTwo[i].comments.splice(j, 1);
                      that.setData({
                        dataTwo: that.data.dataTwo
                      })
                      break;
                    }
                  }
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
        url: 'addComment/addComment?data=' + JSON.stringify(obj)
      })
    }
  },
  comment: function(e) {
    wx.navigateTo({
      url: 'addComment/addComment?id=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&action=' + e.currentTarget.dataset.action,
    })
  },
  getComments: function() {
    wx.removeTabBarBadge({
      index: 1
    })
    wx.navigateTo({
      url: 'getComment/getComment',
    })
  },
  getCalendar: function(e) {
    var canItDelete = e.currentTarget.dataset.canitdelete == 'true' ? true : false;
    var data = JSON.stringify(e.currentTarget.dataset.data);
    wx.navigateTo({
      url: '../calendar/calendarDetail/calendarDetail?data=' + data + '&canItDelete=' + canItDelete,
    })
  },
  getDiary: function(e) {
    var data = e.currentTarget.dataset.data;
    wx.navigateTo({
      url: '../my/diary/detail/detail?data=' + JSON.stringify(data),
    })
  },
  previewImage: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.url;
    var tempUrlsArr = [];
    for (var i = 0; i < that.data.dataTwo.length; i++) {
      if (that.data.dataTwo[i].type == 'photo') {
        tempUrlsArr = tempUrlsArr.concat(that.data.dataTwo[i].uploadImgArr)
      }
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: tempUrlsArr // 需要预览的图片http链接列表
    })
  },
  getTwo: function() {
    var that = this;
    request.getPhotoAndMsg({
      "bothOpenid": app.globalData.bothOpenid
    }, function(data) {
      //日期相差数
      var tempCalendar = data.calendar;
      for (var i = 0; i < tempCalendar.length; i++) {
        if (tempCalendar[i].dateType == '农历') { //如果日期为农历则需要经过转换
          var dateArr = utils.toChineseNum(tempCalendar[i].dateStr); //取到一个数组
          var newDate = utils.Lunar.toSolar(dateArr[0], dateArr[1], dateArr[2]); //新历
          if (tempCalendar[i].remindFlag) { //纪念日设置了提醒
            if (tempCalendar[i].remindTxt == '每年重复提醒') {
              tempCalendar[i].datedifference = utils.datedifference(utils.getOldAnnual(newDate, dateArr), utils.formatTime(new Date()));
            } else {
              tempCalendar[i].datedifference = utils.datedifference(utils.getOldMonthly(dateArr), utils.formatTime(new Date()));
            }
          } else {
            tempCalendar[i].datedifference = utils.datedifference(newDate, utils.formatTime(new Date()));
          }
        } else {
          if (tempCalendar[i].remindFlag) { //纪念日设置了提醒
            if (tempCalendar[i].remindTxt == '每年重复提醒') {
              tempCalendar[i].datedifference = utils.datedifference(utils.getNewAnnual(tempCalendar[i].dateStr), utils.formatTime(new Date()));
            } else {
              tempCalendar[i].datedifference = utils.datedifference(utils.getNewMonthly(tempCalendar[i].dateStr), utils.formatTime(new Date()))
            }
          } else {
            tempCalendar[i].datedifference = utils.datedifference(tempCalendar[i].dateStr, utils.formatTime(new Date()));
          }
        }
      }


      var arr = (data.diary.concat(data.photo)).concat(tempCalendar);

      //多久前
      for (var i = 0; i < arr.length; i++) {
        arr[i].timeAgo = utils.timeFn(arr[i].createDate)
      }
      that.setData({
        dataTwo: sortarr(arr)
      })
      that.setData({
        showMore: false
      })
    })
  },
  getMang: function(type, page) {
    var that = this;
    that.setData({
      showing: true
    })
    if (type == 2) {
      wx.showToast({
        title: '该功能未开放',
        icon: 'none'
      })
      return;
    }
    request.getDynamics(type, page, function(data) {
      //多久前
      if (type == 0 || type == 1) {
        for (var i = 0; i < data.length; i++) {
          data[i].timeAgo = utils.timeFn(data[i].createDate);
          if (data[i].uploadImgCount > 3) {
            data[i].uploadImgArr.length = 3;
          }
        }
      } else if (type == 2) {

      } else {
        console.log(data);
      }
      that.setData({
        dataMany: that.data.dataMany.concat(data)
      })
      if (data.length == 0) {
        that.setData({
          showMoreTxt: '已无更多数据...',
          noMore: true,
        })
      } else {
        that.setData({
          showMore: false
        })
      }
    })
  },
  onShow: function() {
    var that = this;
    if (app.globalData.commentCount) {
      this.setData({
        commentCount: app.globalData.commentCount
      })
    }
    if (app.globalData.state) {
      that.getTwo();
    } else {
      wx.showModal({
        title: '未解锁',
        content: '请先去牵手再来解锁此功能',
        showCancel: false,
        confirmText: '去牵手',
        confirmColor: '#F597B1',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/my/my',
            })
          }
        },
      })
    }
    //this.getMang(this.data.TabCur, this.data.page);
  },
  onChange(e) {
    var key = e.detail.key;
    var that = this;
    that.setData({
      current: key,
    })
    if (that.data.dataMany.length == 0 && key == 1) { //页面刚进来
      that.setData({
        showMore: true
      })
      that.getMang(that.data.TabCur, that.data.page);
    }
  },
  onReachBottom() {
    if (this.data.showMoreTxt != '已无更多数据...') {
      if (!this.data.hadReachBottom && this.data.current != 0) {
        this.setData({
          showMore: true
        })
        this.data.page++;
        this.getMang(this.data.TabCur, this.data.page);
      }
    }
  }
});