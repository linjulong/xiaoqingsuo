var request = require("utils/request.js");
//const ip = 'ws://172.16.102.69:3000';
const ip = 'wss://luodaye.club';
const io = require('libs/index.js')
App({
  onLaunch: function(options) {
    var that = this;
    request.getAccessToken(); //服务器获取access_token
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    that.userLogin(function() {
      that.getUserInfo(function(myUserInfo) {
        if (that.myUserInfoReadyCallback) { //确保获取到用户信息再运行index.onload里面的回调
          that.myUserInfoReadyCallback(myUserInfo)
        }
        if (that.globalData.state) { //去取留言信息
          request.getLeaveMessageInfo({
            'openid': that.globalData.openid
          }, function(data) {
            console.log("获取聊天室留言信息成功！");
            if (data.leaveMessageCount > 0) {
              wx.setTabBarBadge({
                index: 2,
                text: data.leaveMessageCount.toString()
              })
            }
            if (data.commentCount > 0) {
              that.globalData.commentCount = data.commentCount;
              wx.setTabBarBadge({
                index: 1,
                text: data.commentCount.toString()
              })
            }
          })
        }
        wx.hideLoading();
      });
    });

    // 获取系统状态栏信息 UI test
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        this.globalData.CustomBar = e.platform == 'android' ? e.statusBarHeight + 50 : e.statusBarHeight + 45;
      }
    })
  },
  onShow: function(options) {
    //console.log(options);
    if (options.scene == 1007 || options.query.partnerUserInfo) {
      this.globalData.shareData = JSON.parse(options.query.partnerUserInfo);
      this.globalData.hadShareData = true;
    }
  },
  connectSocket: function() { //拿到openid之后再去连接
    var that = this;
    var socket = io(ip, {
      reconnectionAttempts: 5 //重连次数
    });
    that.globalData.socket = socket;
    socket.on('connect', function() {
      console.log("connect事件，连接成功");
      socket.emit('openid', that.globalData.openid, that.globalData.myUserInfo.nickName);
    })
    socket.on('connect_failed', function(data) {
      console.log("connect_failed to Server");
    });
    socket.on('disconnect', function(reason) {
      console.log("disconnect事件", reason);
      wx.showToast({
        title: '断开连接',
        icon: 'none'
      })
    })
    socket.on('reconnect', function(attempt) { // 重连成功会触发此事件
      console.log("reconnect事件", attempt);
      wx.hideLoading();
      wx.showToast({
        title: '重新连接成功',
        icon: 'none'
      })
    })
    socket.on('reconnect_attempt', function() {
      console.log("reconnect_attempt事件");
    })
    socket.on('reconnecting', function(attempt) { // 正在重连时会触发此事件
      console.log("reconnecting事件", attempt);
      wx.showLoading({
        title: '进行第' + attempt + '次重连',
      })
    })
    socket.on('reconnect_error', function() {
      console.log("reconnect_error事件");

    })
    socket.on('ping', function() {
      //console.log("ping事件");
    })
    socket.on('pong', function(latency) {
      //console.log("pong事件", latency);
    })
    socket.on('connect_timeout', function(data) {
      console.log('connect_timeout事件', data);
    });
    socket.on('error', function(err) {
      console.log("error事件", err);
    })
    socket.on('reconnect_failed', function() {
      console.log("reconnect_failed事件");
      wx.hideLoading();
      wx.showModal({
        title: '失败',
        content: '重新连接失败，是否继续进行重连',
        confirmText: "是",
        cancelText: "否",
        success: function(res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击确定
            that.connectSocket();
          }
        }
      })
    })
    socket.on('beBreakship')
  },
  userLogin: function(callback) { //获取openid 因为更新用户信息表需要opeind 所以一定是获取到了openid才去更新
    var that = this;
    wx.login({
      success: function(res) {

        request.authorize({
          code: res.code
        }, function(data) {
          that.globalData.openid = data;
          callback();
        })
      }
    })
  },
  getUserInfo: function(callback) { //获取用户信息
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              that.globalData.myUserInfo = res.userInfo;
              that.globalData.myUserInfo.openid = that.globalData.openid;
              that.connectSocket();
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              //用户已经授权 去更新用户最新的信息 取数据库获取数据判断是否为单身 不是的话修改状态和获取情侣的数据
              request.updateUserInfo(that.globalData.myUserInfo, function(data) {
                console.log("更新用户信息成功");
                if (data.state) {
                  that.globalData.state = data.state;
                  that.globalData.partnerUserInfo = data;
                  that.globalData.bothOpenid = data.bothOpenid;
                  console.log("获取情侣数据成功");
                  callback(that.globalData.myUserInfo);

                } else if (data.state === false) {
                  console.log("单身狗");
                  callback(that.globalData.myUserInfo);
                  that.globalData.hadNewMemory = data.hadNewMemory;
                }
              })
            }
          })
        } else {
          wx.reLaunch({
            url: '/pages/authorize/authorize',
          })
        }
      }
    })
  },
  globalData: {
    myUserInfo: null,
    partnerUserInfo: null,
    openid: '',
    state: false, //用户状态
    shareData: null, //分享的信息
    hadShareData: false, //表示是否是分享进入的小程序
    bothOpenid: '', //情侣id
    socket: null,
    day: 0, //相爱天数
    lovesDate: '', //恋爱纪念日
    bgImg: '',
    hadNewMemory: false //被分手的用户提示是否保存记忆
  }
})