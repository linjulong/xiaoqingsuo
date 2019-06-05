//var url = 'http://172.16.102.69:3000'; //网络请求的地址
var url = 'https://luodaye.club';

function authorize(object, callback) { //用户授权 获取openid
  wx.request({
    url: url + '/user/authorize',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback(res.data);
    }
  })
}

function addSingleUser(object, callback) {
  wx.request({
    url: url + '/user/addSingleUser',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback(res.data);
    }
  })
}

function updateUserInfo(object, callback) {
  wx.request({
    url: url + '/user/updateUserInfo',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback(res.data);
    }
  })
}

function bind(userInfo, callback) {
  wx.request({
    url: url + '/user/bind',
    data: userInfo,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback(res.data);
    }
  })
}

function getPartnerInfo(partnerOpenid, callback) {
  wx.request({
    url: url + '/user/getPartnerInfo',
    data: partnerOpenid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function checkUserState(openid, callback) {
  wx.request({
    url: url + '/user/checkUserState',
    data: openid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function updateWeather(weather) {
  var p = new Promise(function(resolve, reject) {
    wx.request({
      url: url + '/user/updateWeather',
      data: weather,
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        console.log("更新用户天气信息成功！");
        resolve();
      }
    })
  })
  return p;
}

function getPartnerWeather(partnerOpenid) {
  var p = new Promise(function(resolve, reject) {
    wx.request({
      url: url + '/user/getPartnerWeather',
      data: {
        "openid": partnerOpenid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success(res) {
        console.log("获取伴侣天气信息成功！");
        resolve(res.data);
      }
    })
  })
  return p;
}

function getLovesInfo(openid1, openid2) {
  var bothOpenid = {};
  bothOpenid.openid1 = openid1;
  bothOpenid.openid2 = openid2;
  var p = new Promise(function(resolve, reject) {
    wx.request({
      url: url + '/user/getLovesInfo',
      data: bothOpenid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success(res) {
        console.log("获取恋爱天数成功！");
        console.log("获取背景图成功！");
        resolve(res.data);
      }
    })
  })
  return p;
}

function updateBgImg(bgImg, bothOpenid, callback) {
  wx.uploadFile({
    url: url + '/user/updateBgImg',
    filePath: bgImg,
    name: 'bgImg',
    formData: {
      bothOpenid: bothOpenid
    },
    success(res) {
      callback(res.data);
    }
  })
}

function getLeaveMessageInfo(openid, callback) {
  wx.request({
    url: url + '/user/getLeaveMessageInfo',
    data: openid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function clearLeaveMessageInfo(openid) {
  wx.request({
    url: url + '/user/clearLeaveMessageInfo',
    data: openid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {

    }
  })
}

function clearNewComments(openid, callback) {
  wx.request({
    url: url + '/user/clearNewComments',
    data: openid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback();
    }
  })
}

function breakship(data, callback) {
  wx.request({
    url: url + '/user/breakship',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function addCalendar(object, callback) {
  wx.request({
    url: url + '/user/addCalendar',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function getCalendar(bothOpenid, callback) {
  wx.request({
    url: url + '/user/getCalendar',
    data: bothOpenid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function deleteCalendar(object, callback) {
  wx.request({
    url: url + '/user/deleteCalendar',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function savePhotoArrAndMsg(object, callback) {
  wx.request({
    url: url + '/user/savePhotoArrAndMsg',
    data: object,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function getPhotoAndMsg(bothOpenid, callback) {
  wx.request({
    url: url + '/user/getPhotoAndMsg',
    data: bothOpenid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function deletePhoto(obj, callback) {
  wx.request({
    url: url + '/user/deletePhoto',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback(res.data);
    }
  })
}

function editCalendar(obj, callback) {
  wx.request({
    url: url + '/user/editCalendar',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function addDiary(obj, callback) {
  wx.request({
    url: url + '/user/addDiary',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function deleteDiary(obj, callback) {
  wx.request({
    url: url + '/user/deleteDiary',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function getAccessToken() {
  wx.request({
    url: url + '/user/getAccessToken',
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {

    }
  })
}

function templateSend(obj, callback) {
  wx.request({
    url: url + '/user/templateSend',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {
      callback(res.data)
    }
  })
}

function uploadFormIds(obj) {
  wx.request({
    url: url + '/user/uploadFormIds',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {

    }
  })
}

function addComments(obj, callback) {
  wx.request({
    url: url + '/user/addComments',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {
      callback()
    }
  })
}

function deleteComment(bothOpenid, type, itemId, commentId, callback) {
  wx.request({
    url: url + '/user/deleteComment',
    header: {
      'content-type': 'application/json'
    },
    data: {
      bothOpenid: bothOpenid,
      type: type,
      itemId: itemId,
      commentId: commentId
    },
    method: 'POST',
    success(res) {
      callback()
    }
  })
}

function getComments(obj, callback) {
  wx.request({
    url: url + '/user/addComments',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {
      callback()
    }
  })
}

function getDynamics(type, page, callback) {
  wx.request({
    url: url + '/user/getDynamics',
    header: {
      'content-type': 'application/json'
    },
    data: {
      type: type,
      page: page
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function getDynamicsDetail(id, callback) {
  wx.request({
    url: url + '/user/getDynamics/detail',
    header: {
      'content-type': 'application/json'
    },
    data: {
      id: id
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function createDynamicsComments(obj, callback) {
  wx.request({
    url: url + '/user/getDynamics/detail/createDynamicsComments',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {
      callback(res.data)
    }
  })
}

function addCollection(obj, callback) {
  wx.request({
    url: url + '/user/collection/addCollection',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'POST',
    success(res) {
      callback()
    }
  })
}

function getCollection(openid, callback) {
  wx.request({
    url: url + '/user/collection/getCollection',
    header: {
      'content-type': 'application/json'
    },
    data: obj,
    method: 'GET',
    success(res) {
      callback(res.data)
    }
  })
}

function checkHadCollection(openid, id, callback) {
  wx.request({
    url: url + '/user/collection/checkHadCollection',
    header: {
      'content-type': 'application/json'
    },
    data: {
      openid: openid,
      id: id
    },
    method: 'GET',
    success(res) {
      callback(res.data.state)
    }
  })
}

function deleteCollection(openid, id, callback) {
  wx.request({
    url: url + '/user/collection/deleteCollection',
    header: {
      'content-type': 'application/json'
    },
    data: {
      openid: openid,
      id: id
    },
    method: 'GET',
    success(res) {
      callback();
    }
  })
}

function getMenses(bothOpenid, callback) {
  wx.request({
    url: url + '/user/getMenses',
    data: bothOpenid,
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    success(res) {
      callback(res.data);
    }
  })
}

function setMenses(obj, callback) {
  wx.request({
    url: url + '/user/setMenses',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function saveMemory(openid, saveMemory, callback) {
  wx.request({
    url: url + '/user/memory/saveMemory',
    data: {
      openid: openid,
      saveMemory: saveMemory
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

function deleteDynamicsComments(obj, callback) {
  wx.request({
    url: url + '/user/getDynamics/detail/deleteDynamicsComments',
    data: obj,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success(res) {
      callback();
    }
  })
}

module.exports = {
  url: url,
  authorize: authorize,
  addSingleUser: addSingleUser,
  updateUserInfo: updateUserInfo,
  bind: bind,
  getPartnerInfo: getPartnerInfo,
  checkUserState: checkUserState,
  updateWeather: updateWeather,
  getPartnerWeather: getPartnerWeather,
  getLovesInfo: getLovesInfo,
  updateBgImg: updateBgImg,
  getLeaveMessageInfo: getLeaveMessageInfo,
  clearLeaveMessageInfo: clearLeaveMessageInfo,
  breakship: breakship,
  addCalendar: addCalendar,
  getCalendar: getCalendar,
  deleteCalendar: deleteCalendar,
  savePhotoArrAndMsg: savePhotoArrAndMsg,
  getPhotoAndMsg: getPhotoAndMsg,
  deletePhoto: deletePhoto,
  editCalendar: editCalendar,
  addDiary: addDiary,
  deleteDiary: deleteDiary,
  getAccessToken: getAccessToken,
  templateSend: templateSend,
  uploadFormIds: uploadFormIds,
  addComments: addComments,
  deleteComment: deleteComment,
  clearNewComments: clearNewComments,
  getDynamics: getDynamics,
  getDynamicsDetail: getDynamicsDetail,
  createDynamicsComments: createDynamicsComments,
  addCollection: addCollection,
  getCollection: getCollection,
  checkHadCollection: checkHadCollection,
  deleteCollection: deleteCollection,
  getMenses: getMenses,
  setMenses: setMenses,
  saveMemory: saveMemory,
  deleteDynamicsComments: deleteDynamicsComments
}