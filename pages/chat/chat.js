
const app = getApp();
const utils = require('../../utils/util.js');
const request = require('../../utils/request.js');
var tabBarBadge = 0;
const recorderManager = wx.getRecorderManager() //全局唯一的录音管理器
const innerAudioContext = wx.createInnerAudioContext() //全局唯一的语音播放管理器
var recordFlag = true; //表示是否发送录音
var recordId = ''; //标识当前音源的id
var isPlaying = false; //标识当前是否在播放语音
var timer = null; //音量小图标定时器
var isChooseIng = false;
var propelling = true; //当对方不在线时候 推送一次 因为formid有限

const options = {
  duration: 1000 * 60,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}
const {
  $Toast
} = require('../../dist/base/index');
import {
  $wuxToptips
} from '../../dist/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    partnerStateText: '',
    msg: [], //页面渲染聊天记录
    textValue: '',
    myUserInfo: null,
    partnerUserInfo: null,
    toView: 'id',
    openid: '',
    history: [], //本次会话的历史记录（没加上新进来的留言）方便按照长度取历史记录 不参与页面渲染
    showi_load_more: false,
    showLoading: false,
    voiceOrBoard: false,
    tip: "",
    windowWidth: 0,
    cross: false,
    input_bottom: 0,
    previewImageArray: [],
    recordTxt: '按住 说话',
    volume: 3, //音量图标
    moreItem1: [{
        img: '/images/picture.png',
        txt: '照片',
        id: 1
      },
      {
        img: '/images/takePic.png',
        txt: '拍摄',
        id: 2
      },
      {
        img: '/images/video.png',
        txt: '视频',
        id: 3
      },
    ],
    moreItem2: [{
        img: '/images/location.png',
        txt: '位置',
        id: 4
      },
      {
        img: '/images/col.png',
        txt: '收藏',
        id: 5
      },
      {
        img: '/images/location.png',
        txt: '照片',
        id: 6
      }
    ]
  },
  templateSend: function() {
    if (this.data.partnerStateText == 'offline') {
      if (propelling) {
        let obj = {};
        obj.sender = app.globalData.myUserInfo.nickName;
        obj.openId = app.globalData.partnerUserInfo.openid;
        request.templateSend(obj, function(data) {
          if (data == "success") { //推送成功 本次启动不再推送
            propelling = false;
          }
        });
      }
    }
  },
  more: function(e) { //功能框
    var id = e.currentTarget.dataset.id;
    switch (id) {
      case 1:
        this.chooseImage();
        break;
      case 2:
        this.openCamera();
        break;
      case 3:
        this.chooseVideo();
        break;
      case 4:
        this.shareLocation();
        break;
      case 5:
        this.navigateToCollection();
        break;
    }
  },
  voiceOrBoard: function() {
    if (!this.data.voiceOrBoard) {
      this.setData({
        voiceOrBoard: true
      })
    } else {
      this.setData({
        voiceOrBoard: false,
        focus: true
      })
    }
  },
  recording: function(e) {
    this.startPoint = e.touches[0].clientY; //记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
    recordFlag = true; //每次录音 重置该值
    $Toast({
      content: '手指上划,取消发送',
      image: '/images/microphone.png',
      duration: 0,
    });
    this.setData({
      recordTxt: '松开 停止'
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          recorderManager.start(options);
        } else {
          if (res.authSetting['scope.record'] === undefined) { //如果用户未曾触发
            recorderManager.start(options);
            recordFlag = false;
            recorderManager.stop();
          } else {
            wx.showModal({
              title: '提示',
              content: '需要您授权录音',
              showCancel: false,
              confirmColor: '#F597B1',
              success: function() {
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.record']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击即可录音',
                        showCancel: false,
                        confirmColor: '#F597B1',
                      })
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法使用录音功能~',
                        showCancel: false,
                        confirmColor: '#F597B1',
                      })
                    }
                  }
                })
              },
            })
          }
        }
      }
    })
  },
  recordingMove: function(e) {
    var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint; //移动距离
    if (Math.abs(moveLenght) > 50) {
      $Toast({
        content: '松开手指,取消发送',
        image: '/images/cancel.png',
        duration: 0,
      });
      recordFlag = false; //取消发送
    } else {
      $Toast({
        content: '手指上划,取消发送',
        image: '/images/microphone.png',
        duration: 0,
      });
      recordFlag = true;
    }
  },
  recordEnd: function() {
    this.setData({
      recordTxt: '按住 说话'
    })
    $Toast.hide();
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.record']) {
          recorderManager.stop();
        }
      }
    })
  },
  playRecord: function(e) {
    var url = e.currentTarget.dataset.url;
    if (isPlaying) {
      if (recordId === e.currentTarget.dataset.id) {
        innerAudioContext.stop();
      } else {
        innerAudioContext.src = url;
        innerAudioContext.play();
        recordId = e.currentTarget.dataset.id;
      }
    } else {
      innerAudioContext.src = url;
      innerAudioContext.play();
      recordId = e.currentTarget.dataset.id;
    }
  },
  requestFullScreen: function() { //全屏播放视频
    this.videoContext.requestFullScreen({
      direction: 0
    });
  },
  chooseImage: function() {
    var that = this;
    isChooseIng = true;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgArr = [];
        that.upLoadImg(res.tempFilePaths, 0, imgArr);
      },
      complete() {
        isChooseIng = false;
      }
    })
  },
  openCamera: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        let imgArr = [];
        that.upLoadImg(res.tempFilePaths, 0, imgArr);
      }
    })
  },
  upLoadImg: function(imgPath, i, imgArr) { //imgPath是一个数组 实现的功能是多文件上传 要传完一个再下一个 complete是回调函数
    var that = this;
    var imgLength = imgPath.length;
    var obj = that.sendImg(imgPath[i]);
    const uploadImgTask = wx.uploadFile({
      url: request.url + '/user/chatByImg',
      filePath: imgPath[i],
      name: 'image',
      complete: (res) => {
        that.templateSend();
        app.globalData.socket.emit('privateChatByImageToSever', app.globalData.partnerUserInfo, obj); //一张图片上传完成
        for (var j = 0; j < that.data.msg.length; j++) { //上传完成之后 把临时路径改了再存进缓存 下次路径才能用
          if (obj.id == that.data.msg[j].id) {
            that.data.msg[j].url = res.data;
            imgArr.push(that.data.msg[j]);
            break;
          }
        }
        i++;
        if (i == imgPath.length) {
          console.log("图片上传完毕"); //图片上传完 存进缓存
          setTimeout(function() {
            that.setData({
              msg: that.data.msg,
              toView: 'id_' + obj.id,
              input_bottom: 0,
              cross: false
            })
          }, 1000)
          var temp = wx.getStorageSync('history') || [];
          temp = temp.concat(imgArr);
          setTimeout(function() { //这里不能立马保存到缓存中 否则数组最后一项进度为0
            wx.setStorage({
              key: 'history',
              data: temp
            })
          }, 3000)
        } else {
          that.upLoadImg(imgPath, i, imgArr);
          that.setData({
            msg: that.data.msg,
            toView: 'id_' + obj.id,
            input_bottom: 0,
            cross: false
          })
        }
      }
    });
    uploadImgTask.onProgressUpdate((res) => { //监听上传进度
      for (var j = 0; j < that.data.msg.length; j++) {
        if (obj.id == that.data.msg[j].id) {
          that.data.msg[j].percent = res.progress;
          that.setData({
            msg: that.data.msg
          })
        }
      }
    })
  },
  uploadVoice: function(voiceUrl, callback) {
    wx.uploadFile({
      url: request.url + '/user/chatByVoice',
      filePath: voiceUrl,
      name: 'voice',
      success(res) {
        callback(res.data);
      }
    })
  },
  previewImage: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.url;
    for (var i = 0; i < that.data.msg.length; i++) {
      if (that.data.msg[i].type == 'image') {
        that.data.previewImageArray.push(that.data.msg[i].url);
      }
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: that.data.previewImageArray // 需要预览的图片http链接列表
    })
  },
  saveImageToPhotosAlbum: function(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.showModal({
      title: '提示',
      content: '是否保存图片',
      confirmColor: '#F597B1',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '保存中...'
          })
          wx.downloadFile({
            url: url,
            success: function(res) {
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '保存成功',
                    showCancel: false,
                    confirmColor: '#F597B1',
                  })
                },
                fail: function(err) {
                  if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                    wx.showModal({
                      title: '提示',
                      content: '需要您授权保存相册',
                      showCancel: false,
                      confirmColor: '#F597B1',
                      success: modalSuccess => {
                        wx.openSetting({
                          success(settingdata) {
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次长按图片即可保存',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存到相册哦~',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                },
                complete(res) {
                  wx.hideLoading()
                }
              })
            }
          })
        }
      }
    })
  },
  saveVideoToPhotosAlbum: function(e) {
    var that = this;
    var url = e.currentTarget.dataset.url;
    wx.showModal({
      title: '提示',
      content: '是否保存视频',
      confirmColor: '#F597B1',
      success: function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '保存中...'
          })
          wx.downloadFile({
            url: url,
            success: function(res) {
              console.log(res);
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(data) {
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: '保存成功',
                    showCancel: false,
                    confirmColor: '#F597B1',
                  })
                },
                fail: function(err) {
                  if (err.errMsg === "saveVideoToPhotosAlbum:fail:auth denied" || err.errMsg === "saveVideoToPhotosAlbum:fail auth deny") {
                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                    wx.showModal({
                      title: '提示',
                      content: '需要您授权保存视频',
                      showCancel: false,
                      confirmColor: '#F597B1',
                      success: modalSuccess => {
                        wx.openSetting({
                          success(res) {
                            if (res.authSetting['scope.writePhotosAlbum']) {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限成功,再次长按即可保存',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            } else {
                              wx.showModal({
                                title: '提示',
                                content: '获取权限失败，将无法保存视频哦~',
                                showCancel: false,
                                confirmColor: '#F597B1',
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                },
                complete(res) {
                  wx.hideLoading()
                }
              })
            }
          })
        }
      }
    })
  },
  chooseVideo: function() {
    var that = this;
    isChooseIng = true;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        that.uploadVideo(res.tempFilePath, res.width, res.height); //正式上传文件
      },
      complete() {
        isChooseIng = false;
      }
    })
  },
  uploadVideo: function(videoUrl, width, height) {
    var that = this;
    var obj = that.sendVideo(videoUrl, width, height); //上传之前先进行页面渲染
    const uploadVideoTask = wx.uploadFile({
      url: request.url + '/user/chatByVideo', // 仅为示例，非真实的接口地址
      filePath: videoUrl,
      name: 'video',
      success(res) {
        console.log('视频上传成功！');
        for (var j = 0; j < that.data.msg.length; j++) { //上传完成之后 把临时路径改了再存进缓存 下次路径才能用
          if (obj.id == that.data.msg[j].id) {
            that.data.msg[j].url = res.data;
            obj.url = res.data;
            break;
          }
        }
        that.templateSend();
        app.globalData.socket.emit('privateChatByVideoToSever', app.globalData.partnerUserInfo, obj); //视频上传完毕
        var temp = wx.getStorageSync('history') || [];
        wx.setStorage({
          key: 'history',
          data: temp.concat(obj)
        })
      }
    })

    uploadVideoTask.onProgressUpdate((res) => {
      console.log('上传进度', res.progress);
      for (var j = 0; j < that.data.msg.length; j++) {
        if (obj.id == that.data.msg[j].id) {
          that.data.msg[j].percent = res.progress;
          that.setData({
            msg: that.data.msg
          })
          break;
        }
      }
    })
  },
  navigateToCollection: function() {
    wx.navigateTo({
      url: '../collection/collection',
    })
  },
  shareLocation: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定获取双方的距离吗',
      confirmColor: '#F597B1',
      success: function(res) {
        if (res.confirm) {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              var latitude = res.latitude; //纬度
              var longitude = res.longitude //经度
              that.templateSend();
              app.globalData.socket.emit('shareLocationToSever', app.globalData.partnerUserInfo, that.sendLocation(latitude, longitude));
            }
          })
        }
      }
    })
  },
  sendLocation: function(latitude, longitude) {
    var that = this;
    var msg = that.data.msg;
    var length = msg.length;
    var obj = {};
    obj.type = 'location';
    obj.sender = app.globalData.openid;
    obj.id = parseInt((new Date()).valueOf());
    obj.latitude = latitude;
    obj.longitude = longitude;
    obj.hadDistance = false;
    obj.distance = '已发送距离...';

    if (length == 0) {
      obj.showTime = true;
    } else {
      if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
        obj.showTime = true;
      } else {
        obj.showTime = false;
      }
    }
    obj.time = utils.formatTime1(new Date());
    msg.push(obj);
    that.setData({
      msg: msg,
      toView: 'id_' + obj.id,
      input_bottom: 0,
      cross: false
    })
    var temp = wx.getStorageSync('history') || [];
    temp.push(obj);
    wx.setStorage({
      key: 'history',
      data: temp
    })
    return obj;
  },
  getDistance: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var latitude = res.latitude; //纬度
        var longitude = res.longitude //经度
        var distance = (utils.getFlatternDistance(latitude, longitude, e.currentTarget.dataset.latitude, e.currentTarget.dataset.longitude) / 1000).toFixed(1).toString();
        console.log(distance);
        for (var i = 0; i < that.data.msg.length; i++) {
          if (id == that.data.msg[i].id) { //页面渲染完成后再通知对方
            that.data.msg[i].hadDistance = true;
            that.data.msg[i].distance = '目前距离' + distance + '公里';
            that.setData({
              msg: that.data.msg
            })
            that.templateSend();
            app.globalData.socket.emit('returnDistanceToSever', app.globalData.partnerUserInfo, that.data.msg[i].distance, id);
            var temp = wx.getStorageSync('history');
            for (var j = 0; j < temp.length; j++) {
              if (id == temp[j].id) {
                temp[j].distance = '目前距离' + distance + '公里';
                wx.setStorage({
                  key: 'history',
                  data: temp,
                })
                break;
              }
            }
            break;
          }
        }
      }
    })
  },
  sendImg: function(imgUrl) {
    var that = this;
    var msg = that.data.msg;
    var length = msg.length;
    var obj = {};
    obj.type = 'image';
    obj.url = imgUrl;
    obj.sender = app.globalData.openid;
    obj.id = parseInt((new Date()).valueOf());
    obj.percent = 0;

    if (length == 0) {
      obj.showTime = true;
    } else {
      if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
        obj.showTime = true;
      } else {
        obj.showTime = false;
      }
    }
    obj.time = utils.formatTime1(new Date());
    msg.push(obj);
    that.setData({
      msg: msg,
      toView: 'id_' + obj.id,
      input_bottom: 0,
      cross: false
    })
    return obj;
  },
  sendVideo: function(videoUrl, width, height) {
    var that = this;
    var msg = that.data.msg;
    var length = msg.length;
    var obj = {};
    obj.type = 'video';
    obj.url = videoUrl;
    obj.sender = app.globalData.openid;
    obj.id = parseInt((new Date()).valueOf());
    obj.percent = 0;
    obj.width = width;
    obj.height = height;

    if (length == 0) {
      obj.showTime = true;
    } else {
      if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
        obj.showTime = true;
      } else {
        obj.showTime = false;
      }
    }
    obj.time = utils.formatTime1(new Date());
    msg.push(obj);
    that.setData({
      msg: msg,
      toView: 'id_' + obj.id,
      input_bottom: 0,
      cross: false
    })
    return obj;
  },
  sendTxt: function(e) { //输入框发送文字聊天
    var that = this;
    if (e.detail.value != '') {
      var msg = that.data.msg;
      var length = msg.length;
      var obj = {};
      obj.msg = e.detail.value;
      obj.type = 'txt';
      obj.sender = app.globalData.openid;
      obj.id = parseInt((new Date()).valueOf());
      if (length == 0) {
        obj.showTime = true;
      } else {
        if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
          obj.showTime = true;
        } else {
          obj.showTime = false;
        }
      }
      obj.time = utils.formatTime1(new Date());
      obj.sendState = false;
      msg.push(obj);
      that.templateSend();
      app.globalData.socket.emit('privateChatByTxtToSever', app.globalData.partnerUserInfo, obj);
      that.setData({
        textValue: '',
        msg: msg,
        toView: 'id_' + obj.id
      })
    }
  },
  showActionSheet: function(e) {
    //文字 语音 图片 视频 距离
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    var itemList;
    switch (type) {
      case 'txt':
        itemList = ['复制', '删除', '收藏'];
        break;
      case 'voice':
        itemList = ['删除', '收藏'];
        break;
      case 'image':
        itemList = ['保存', '删除', '收藏'];
        break;
      case 'location':
        itemList = ['删除', '收藏'];
        break;
      case 'video':
        itemList = ['保存', '删除', '收藏'];
        break;
    }
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        var tapIndex = res.tapIndex;
        switch (type) {
          case 'txt':
            if (tapIndex == 0) {
              that.setClipboardData(e.currentTarget.dataset.txt);
            } else if (tapIndex == 1) {
              that.deleteMsgItem(index);
              that.deleteStorageItem(id);
            } else {
              that.collectItem(item);
            }
            break;
          case 'voice':
            if (tapIndex == 0) {
              that.deleteMsgItem(index);
              that.deleteStorageItem(id);
            } else {
              that.collectItem(item);
            }
            break;
          case 'image':
            if (tapIndex == 0) {
              that.saveImageToPhotosAlbum(e);
            } else if (tapIndex == 1) {
              that.deleteMsgItem(index);
              that.deleteStorageItem(id);
            } else {
              that.collectItem(item);
            }
            break;
          case 'location':
            if (tapIndex == 0) {
              that.deleteMsgItem(index);
              that.deleteStorageItem(id);
            } else {
              that.collectItem(item);
            }
            break;
          case 'video':
            if (tapIndex == 0) {
              that.saveVideoToPhotosAlbum(e);
            } else if (tapIndex == 1) {
              that.deleteMsgItem(index);
              that.deleteStorageItem(id);
            } else {
              that.collectItem(item);
            }
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  deleteMsgItem: function(index) {
    this.data.msg.splice(index, 1);
    this.setData({
      msg: this.data.msg
    })
  },
  deleteStorageItem: function(id) {
    var temp = wx.getStorageSync('history');
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id == id) {
        temp.splice(i, 1);
        break;
      }
    }
    wx.setStorage({
      key: 'history',
      data: temp
    })
  },
  setClipboardData: function(txt) { //设置粘贴板
    wx.setClipboardData({
      data: txt
    })
  },
  collectItem: function(item) { //收藏聊天信息
    var temp = wx.getStorageSync('collectItem') || [];
    item.time = utils.formatTime(new Date());
    temp.unshift(item);
    wx.setStorage({
      key: 'collectItem',
      data: temp,
      success: function() {
        wx.showToast({
          title: '收藏成功',
        })
      }
    })
  },
  showInputIng: function() {
    app.globalData.socket.emit('showInputIngToSever', app.globalData.partnerUserInfo, '对方输入中...');
  },
  // 点击加号
  add_icon_click: function(e) {
    if (this.data.input_bottom == 0) {
      this.setData({
        input_bottom: 180,
        cross: true,
      })
    } else {
      this.setData({
        input_bottom: 0,
        cross: false,
      })
    }
  },
  // 获取到焦点
  focus: function(e) {
    this.setData({
      focus: true,
      cross: false,
      input_bottom: 0
    })
  },
  hideInputing: function() {
    app.globalData.socket.emit('hideInputIngToSever', app.globalData.partnerUserInfo);
    if (this.data.cross) {
      this.setData({
        focus: false,
        input_bottom: 180,
      })
    } else {
      this.setData({
        focus: false,
        input_bottom: 0,
      })
    }
  },
  getMessage: function() { //获取留言信息和10条历史信息
    var that = this;
    var history = wx.getStorageSync('history') || [];
    that.data.history = history.concat(); //方便去取历史记录  深拷贝
    if (that.data.history.length > 10) {
      history = history.slice(-10); //取数组后10条记录
      that.data.history.splice(-10); //加载更多的时候不重复
    } else {
      history = that.data.history.concat();
      that.data.history = [];
    }
    request.getLeaveMessageInfo({
      'openid': app.globalData.openid
    }, function(data) {
      console.log("获取聊天室留言信息成功！");
      if (data.leaveMessageCount > 0) { //如果有新的留言信息 就获取出来 然后去数据库清除
        //获取赋值操作
        //赋值留言信息给历史记录
        wx.setStorage({
          key: 'history',
          data: that.data.history.concat(data.leaveMessage)
        })
        //取出至多10条历史聊天记录和新进来的留言信息 参与页面渲染
        that.data.msg = history.concat(data.leaveMessage);
        that.setData({
          msg: that.data.msg,
          toView: 'id_' + that.data.msg[that.data.msg.length - 1].id
        })
        //数据库清除留言信息操作
        request.clearLeaveMessageInfo({
          'openid': app.globalData.openid
        });
      } else {
        that.data.msg = history.concat();
        if (that.data.msg.length != 0) {
          that.setData({
            msg: that.data.msg,
            toView: 'id_' + that.data.msg[that.data.msg.length - 1].id
          })
        }
      }
      if (data.returnDistanceCount > 0) { //刷新离线错过的距离值
        for (var k = 0; k < that.data.msg.length; k++) {
          for (var l = 0; l < data.returnDistanceCount; l++) {
            if (that.data.msg[k].id == data.returnDistance[l].id) {
              that.data.msg[k].distance = data.returnDistance[l].distance;
              that.data.msg[k].hadDistance = true;
            }
          }
        }
        that.setData({ //更新距离值
          msg: that.data.msg
        })
        var temp = wx.getStorageSync('history') || []; //存进缓存
        for (var i = 0; i < temp.length; i++) {
          for (var j = 0; j < data.returnDistanceCount; j++) {
            if (temp[i].id == data.returnDistance[j].id) {
              temp[i].distance = data.returnDistance[j].distance;
              temp[i].hadDistance = true;
            }
          }
        }
        wx.setStorage({
          key: 'history',
          data: temp
        })
      }
    })
  },
  bindscrolltoupper: function() {
    var that = this;
    that.setData({
      showi_load_more: true,
      showLoading: true,
      tip: "加载中"
    })
    if (that.data.history.length == 0) {
      setTimeout(function() {
        that.setData({
          showi_load_more: false
        })
      }, 200)
    } else {
      if (that.data.history.length > 10) {
        setTimeout(function() {
          var history = that.data.history.splice(-10).concat();
          that.setData({
            msg: history.concat(that.data.msg),
            showi_load_more: false,
          })
        }, 500)
      } else {
        setTimeout(function() {
          that.setData({
            msg: that.data.history.concat(that.data.msg),
            showi_load_more: true,
            showLoading: false,
            tip: "无更多数据"
          })
          that.data.history = [];
        }, 500)
      }
    }
  },
  showToptipsCome() {
    var that = this;
    $wuxToptips().info({
      hidden: true,
      text: 'Get online',
      duration: 3000,
      success() {},
    })
  },
  showToptipsLeave() {
    var that = this;
    $wuxToptips().error({
      hidden: true,
      text: 'Get offline',
      duration: 3000,
      success() {},
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
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
      }
    })
    if (!app.globalData.state) { //单身
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
    } else {
      that.setData({
        myUserInfo: app.globalData.myUserInfo,
        partnerUserInfo: app.globalData.partnerUserInfo,
        openid: app.globalData.openid
      })

      that.getMessage();
      var socket = app.globalData.socket;

      socket.emit('checkState', app.globalData.openid); //去服务器读取情侣的状态
      socket.on('partnerOnLine', function(data) { //判断情侣是否在线
        console.log(data);
        that.setData({
          partnerStateText: 'online'
        })
      })
      socket.on('partnerOffLine', function(data) { //判断情侣是否在线
        console.log(data);
        that.setData({
          partnerStateText: 'offline'
        })
      })
      socket.on('partnerHaveHadOnLine', function(data) { //情侣上线通知
        that.showToptipsCome();
        that.setData({
          partnerStateText: 'Get online',
        })
        setTimeout(function() {
          that.setData({
            partnerStateText: 'online',
          })
        }, 3000)
      })
      socket.on('partnerHaveHadOffLine', function(data) { //情侣下线通知
        that.showToptipsLeave();
        that.setData({
          partnerStateText: 'Get offline',
        })
        setTimeout(function() {
          that.setData({
            partnerStateText: 'offline',
          })
        }, 3000)
      })
      socket.on('privateChatByTxtToClient', function(message) { //文字聊天
        var msg = that.data.msg;
        var length = msg.length;
        var obj = {};
        obj.msg = message;
        obj.type = 'txt';
        obj.sender = app.globalData.partnerUserInfo.openid;
        obj.id = parseInt((new Date()).valueOf());
        obj.time = utils.formatTime1(new Date());
        if (length == 0) {
          obj.showTime = true;
        } else {
          if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
            obj.showTime = true;
          } else {
            obj.showTime = false;
          }
        }
        obj.sendState = false;
        msg.push(obj);
        var temp = wx.getStorageSync('history') || [];
        temp.push(obj);
        wx.setStorage({
          key: 'history',
          data: temp
        })
        that.setData({
          msg: msg,
          toView: 'id_' + obj.id
        })

        if (getCurrentPages().pop().__route__ != 'pages/chat/chat') {
          tabBarBadge += 1;
          wx.setTabBarBadge({
            index: 2,
            text: tabBarBadge.toString()
          })
        }
      })
      socket.on('privateChatByImageToClient', function(message) { //图片聊天
        var msg = that.data.msg;
        var length = msg.length;
        if (length == 0) {
          message.showTime = true;
        } else {
          if ((message.id - msg[length - 1].id) > 1000 * 60 * 2) {
            message.showTime = true;
          } else {
            message.showTime = false;
          }
        }
        msg.push(message);
        that.setData({
          msg: msg,
          toView: 'id_' + message.id
        })
        var temp = wx.getStorageSync('history') || [];
        temp.push(message);
        wx.setStorage({
          key: 'history',
          data: temp
        })
        if (getCurrentPages().pop().__route__ != 'pages/chat/chat') {
          tabBarBadge += 1;
          wx.setTabBarBadge({
            index: 2,
            text: tabBarBadge.toString()
          })
        }
      })
      socket.on('privateChatByVoiceToClient', function(voice) { //监听语音类型的信息
        var msg = that.data.msg;
        var length = msg.length;
        if (length == 0) {
          voice.showTime = true;
        } else {
          if ((voice.id - msg[length - 1].id) > 1000 * 60 * 2) {
            voice.showTime = true;
          } else {
            voice.showTime = false;
          }
        }
        msg.push(voice);
        that.setData({
          msg: msg,
          toView: 'id_' + voice.id
        })
        var temp = wx.getStorageSync('history') || [];
        temp.push(voice);
        wx.setStorage({
          key: 'history',
          data: temp
        })
        if (getCurrentPages().pop().__route__ != 'pages/chat/chat') {
          tabBarBadge += 1;
          wx.setTabBarBadge({
            index: 2,
            text: tabBarBadge.toString()
          })
        }
      })

      socket.on('privateChatByVideoToClient', function(video) { //监听视频类型的信息
        var msg = that.data.msg;
        var length = msg.length;
        if (length == 0) {
          video.showTime = true;
        } else {
          if ((video.id - msg[length - 1].id) > 1000 * 60 * 2) {
            video.showTime = true;
          } else {
            video.showTime = false;
          }
        }
        msg.push(video);
        that.setData({
          msg: msg,
          toView: 'id_' + video.id
        })
        var temp = wx.getStorageSync('history') || [];
        temp.push(video);
        wx.setStorage({
          key: 'history',
          data: temp
        })
        if (getCurrentPages().pop().__route__ != 'pages/chat/chat') {
          tabBarBadge += 1;
          wx.setTabBarBadge({
            index: 2,
            text: tabBarBadge.toString()
          })
        }
      })

      socket.on('privateChatByLocationToClient', function(location) {
        var msg = that.data.msg;
        var length = msg.length;
        if (length == 0) {
          location.showTime = true;
        } else {
          if ((location.id - msg[length - 1].id) > 1000 * 60 * 2) {
            location.showTime = true;
          } else {
            location.showTime = false;
          }
        }
        msg.push(location);
        that.setData({
          msg: msg,
          toView: 'id_' + location.id
        })
        var temp = wx.getStorageSync('history') || [];
        temp.push(location);
        wx.setStorage({
          key: 'history',
          data: temp
        })
        if (getCurrentPages().pop().__route__ != 'pages/chat/chat') {
          tabBarBadge += 1;
          wx.setTabBarBadge({
            index: 2,
            text: tabBarBadge.toString()
          })
        }
      })

      socket.on('returnDistanceToClient', function(distance, id) {
        for (var i = 0; i < that.data.msg.length; i++) {
          if (id == that.data.msg[i].id) { //页面渲染完成后再通知对方
            that.data.msg[i].hadDistance = true;
            that.data.msg[i].distance = distance;
            that.setData({
              msg: that.data.msg
            })
            break;
          }
        }
        var temp = wx.getStorageSync('history') || [];
        for (var j = 0; j < temp.length; j++) {
          if (id == temp[j].id) {
            temp[j].hadDistance = true;
            temp[j].distance = distance;
            wx.setStorage({
              key: 'history',
              data: temp
            })
            break;
          }
        }
      })

      socket.on('showInputIngToClient', function(message) { //显示正在输入中
        that.setData({
          partnerStateText: message,
        })
        setTimeout(function() {
          that.setData({
            partnerStateText: 'online'
          })
        }, 3000)
      })
      socket.on('hideInputIngToClient', function() { //隐藏正在输入中
        that.setData({
          partnerStateText: 'online'
        })
      })
      socket.on('hadSendByTxt', function(txtId) { //文字信息发送成功 隐藏加载中图标
        var msg = that.data.msg;
        for (var i = 0; i < msg.length; i++) {
          if (msg[i].id == txtId) {
            msg[i].sendState = true; //发送成功 存进缓存
            var temp = wx.getStorageSync('history') || [];
            temp.push(msg[i]);
            wx.setStorage({
              key: 'history',
              data: temp
            })
            setTimeout(function() {
              that.setData({
                msg: msg
              })
            }, 200)
            break;
          }
        }
      })

      recorderManager.onStart(() => {
        console.log('recorder start')
      })
      recorderManager.onStop((res) => {
        if (recordFlag) {
          console.log('recorder stop', res)
          var msg = that.data.msg;
          var length = msg.length;
          var obj = {};
          obj.url = res.tempFilePath;
          obj.type = 'voice';
          obj.duration = (res.duration / 1000).toFixed(0);
          obj.sender = app.globalData.openid;
          obj.id = parseInt((new Date()).valueOf());
          if (length == 0) {
            obj.showTime = true;
          } else {
            if ((obj.id - msg[length - 1].id) > 1000 * 60 * 2) {
              obj.showTime = true;
            } else {
              obj.showTime = false;
            }
          }
          obj.time = utils.formatTime1(new Date());
          obj.sendState = false;
          msg.push(obj);
          that.setData({
            msg: msg,
            toView: 'id_' + obj.id
          })
          that.uploadVoice(res.tempFilePath, function(url) { //上传语音文件成功后 存进缓存 修改状态
            for (var i = 0; i < msg.length; i++) {
              if (msg[i].id == obj.id) {
                msg[i].sendState = true;
                msg[i].url = url;
                obj.sendState = true;
                obj.url = url;
                that.setData({
                  msg: msg
                })
                break;
              }
            }
            var temp = wx.getStorageSync('history') || [];
            temp.push(obj);
            wx.setStorage({
              key: 'history',
              data: temp
            })
            that.templateSend();
            socket.emit('sendVoiceMessageToSever', app.globalData.partnerUserInfo, obj);
          });
        }
      })


      innerAudioContext.onPlay(() => { //监听语音播放
        console.log('开始播放');
        isPlaying = true;
        that.data.volume = 3;
        timer = setInterval(function() {
          that.data.volume++;
          if (that.data.volume == 4) {
            that.data.volume = 1;
          }
          that.setData({
            volume: that.data.volume
          })
        }, 500)
      })

      innerAudioContext.onStop(() => { //监听语音手动停止
        console.log('手动停止播放');
        isPlaying = false;
        that.setData({
          volume: 3
        })
        clearTimeout(timer);
      })

      innerAudioContext.onEnded(() => { //监听音频自然播放至结束的事件
        console.log('自然停止播放');
        isPlaying = false;
        that.setData({
          volume: 3
        })
        clearTimeout(timer);
      })
    }
  },
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo');
  },
  onShow: function() {
    var that = this;
    if (!isChooseIng) {
      wx.hideTabBar({
        animation: false //是否需要过渡动画
      })
    }
    if (app.globalData.state && !app.globalData.socket) { //如果用户状态为非单身而且没有socket
      that.onLoad();
    }
    wx.removeTabBarBadge({
      index: 2
    })
  },
  onHide: function() {
    if (!isChooseIng) {
      wx.showTabBar({
        animation: false //是否需要过渡动画
      })
    }
  }
})