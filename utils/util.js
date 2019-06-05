var formatTime = date => {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

var formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTime1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber1).join('/') + ' ' + [hour, minute, second].map(formatNumber1).join(':')
}

const formatNumber1 = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

//两个时间相差天数 兼容firefox chrome
function datedifference(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式
  var dateSpan,
    iDays;
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays
}
//计算两点距离
var EARTH_RADIUS = 6378137.0; //单位M
var PI = Math.PI;

function getRad(d) {
  return d * PI / 180.0;
}

// function getFlatternDistance(lat1, lng1, lat2, lng2) {
//   var f = getRad((lat1 + lat2) / 2);
//   var g = getRad((lat1 - lat2) / 2);
//   var l = getRad((lng1 - lng2) / 2);

//   var sg = Math.sin(g);
//   var sl = Math.sin(l);
//   var sf = Math.sin(f);



//   var s, c, w, r, d, h1, h2;
//   var a = EARTH_RADIUS;
//   var fl = 1 / 298.257;

//   sg = sg * sg;
//   sl = sl * sl;
//   sf = sf * sf;

//   s = sg * (1 - sl) + (1 - sf) * sl;
//   c = (1 - sg) * (1 - sl) + sf * sl;

//   console.log(s,c);

//   w = Math.atan(Math.sqrt(s / c));
//   r = Math.sqrt(s * c) / w;
//   d = 2 * w * a;
//   h1 = (3 * r - 1) / 2 / c;
//   h2 = (3 * r + 1) / 2 / s;

//   console.log(w,r,d,h1,h2);

//   return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
// }


function getFlatternDistance(lon1, lat1, lon2, lat2) {
  var DEF_PI = 3.14159265359; // PI
  var DEF_2PI = 6.28318530712; // 2*PI
  var DEF_PI180 = 0.01745329252; // PI/180.0
  var DEF_R = 6370693.5; // radius of earth
  var ew1, ns1, ew2, ns2;
  var dx, dy, dew;
  var distance;
  // 角度转换为弧度
  ew1 = lon1 * DEF_PI180;
  ns1 = lat1 * DEF_PI180;
  ew2 = lon2 * DEF_PI180;
  ns2 = lat2 * DEF_PI180;
  // 经度差
  dew = ew1 - ew2;
  // 若跨东经和西经180 度，进行调整
  if (dew > DEF_PI)
    dew = DEF_2PI - dew;
  else if (dew < -DEF_PI)
    dew = DEF_2PI + dew;
  dx = DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
  dy = DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
  // 勾股定理求斜边长
  distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
  console.log(distance)
  return distance;
}

function search(list, keyWord) {
  var len = list.length;
  var arr = [];
  for (var i = 0; i < len; i++) {
    //如果字符串中不包含目标字符会返回-1
    if (list[i].type == 'txt') {
      if (list[i].msg.indexOf(keyWord) >= 0) {
        arr.push(list[i]);
      }
    } else {
      continue
    }
  }
  return arr;
}

//阴历转阳历
/**用法
 * Lunar.toSolar(2016, 6, 3); 农历转化公历
 * Lunar.toLunar(2016, 7, 6); 公历转化农历
 */
var Lunar = {
  MIN_YEAR: 1891,
  MAX_YEAR: 2100,
  lunarInfo: [
    [0, 2, 9, 21936],
    [6, 1, 30, 9656],
    [0, 2, 17, 9584],
    [0, 2, 6, 21168],
    [5, 1, 26, 43344],
    [0, 2, 13, 59728],
    [0, 2, 2, 27296],
    [3, 1, 22, 44368],
    [0, 2, 10, 43856],
    [8, 1, 30, 19304],
    [0, 2, 19, 19168],
    [0, 2, 8, 42352],
    [5, 1, 29, 21096],
    [0, 2, 16, 53856],
    [0, 2, 4, 55632],
    [4, 1, 25, 27304],
    [0, 2, 13, 22176],
    [0, 2, 2, 39632],
    [2, 1, 22, 19176],
    [0, 2, 10, 19168],
    [6, 1, 30, 42200],
    [0, 2, 18, 42192],
    [0, 2, 6, 53840],
    [5, 1, 26, 54568],
    [0, 2, 14, 46400],
    [0, 2, 3, 54944],
    [2, 1, 23, 38608],
    [0, 2, 11, 38320],
    [7, 2, 1, 18872],
    [0, 2, 20, 18800],
    [0, 2, 8, 42160],
    [5, 1, 28, 45656],
    [0, 2, 16, 27216],
    [0, 2, 5, 27968],
    [4, 1, 24, 44456],
    [0, 2, 13, 11104],
    [0, 2, 2, 38256],
    [2, 1, 23, 18808],
    [0, 2, 10, 18800],
    [6, 1, 30, 25776],
    [0, 2, 17, 54432],
    [0, 2, 6, 59984],
    [5, 1, 26, 27976],
    [0, 2, 14, 23248],
    [0, 2, 4, 11104],
    [3, 1, 24, 37744],
    [0, 2, 11, 37600],
    [7, 1, 31, 51560],
    [0, 2, 19, 51536],
    [0, 2, 8, 54432],
    [6, 1, 27, 55888],
    [0, 2, 15, 46416],
    [0, 2, 5, 22176],
    [4, 1, 25, 43736],
    [0, 2, 13, 9680],
    [0, 2, 2, 37584],
    [2, 1, 22, 51544],
    [0, 2, 10, 43344],
    [7, 1, 29, 46248],
    [0, 2, 17, 27808],
    [0, 2, 6, 46416],
    [5, 1, 27, 21928],
    [0, 2, 14, 19872],
    [0, 2, 3, 42416],
    [3, 1, 24, 21176],
    [0, 2, 12, 21168],
    [8, 1, 31, 43344],
    [0, 2, 18, 59728],
    [0, 2, 8, 27296],
    [6, 1, 28, 44368],
    [0, 2, 15, 43856],
    [0, 2, 5, 19296],
    [4, 1, 25, 42352],
    [0, 2, 13, 42352],
    [0, 2, 2, 21088],
    [3, 1, 21, 59696],
    [0, 2, 9, 55632],
    [7, 1, 30, 23208],
    [0, 2, 17, 22176],
    [0, 2, 6, 38608],
    [5, 1, 27, 19176],
    [0, 2, 15, 19152],
    [0, 2, 3, 42192],
    [4, 1, 23, 53864],
    [0, 2, 11, 53840],
    [8, 1, 31, 54568],
    [0, 2, 18, 46400],
    [0, 2, 7, 46752],
    [6, 1, 28, 38608],
    [0, 2, 16, 38320],
    [0, 2, 5, 18864],
    [4, 1, 25, 42168],
    [0, 2, 13, 42160],
    [10, 2, 2, 45656],
    [0, 2, 20, 27216],
    [0, 2, 9, 27968],
    [6, 1, 29, 44448],
    [0, 2, 17, 43872],
    [0, 2, 6, 38256],
    [5, 1, 27, 18808],
    [0, 2, 15, 18800],
    [0, 2, 4, 25776],
    [3, 1, 23, 27216],
    [0, 2, 10, 59984],
    [8, 1, 31, 27432],
    [0, 2, 19, 23232],
    [0, 2, 7, 43872],
    [5, 1, 28, 37736],
    [0, 2, 16, 37600],
    [0, 2, 5, 51552],
    [4, 1, 24, 54440],
    [0, 2, 12, 54432],
    [0, 2, 1, 55888],
    [2, 1, 22, 23208],
    [0, 2, 9, 22176],
    [7, 1, 29, 43736],
    [0, 2, 18, 9680],
    [0, 2, 7, 37584],
    [5, 1, 26, 51544],
    [0, 2, 14, 43344],
    [0, 2, 3, 46240],
    [4, 1, 23, 46416],
    [0, 2, 10, 44368],
    [9, 1, 31, 21928],
    [0, 2, 19, 19360],
    [0, 2, 8, 42416],
    [6, 1, 28, 21176],
    [0, 2, 16, 21168],
    [0, 2, 5, 43312],
    [4, 1, 25, 29864],
    [0, 2, 12, 27296],
    [0, 2, 1, 44368],
    [2, 1, 22, 19880],
    [0, 2, 10, 19296],
    [6, 1, 29, 42352],
    [0, 2, 17, 42208],
    [0, 2, 6, 53856],
    [5, 1, 26, 59696],
    [0, 2, 13, 54576],
    [0, 2, 3, 23200],
    [3, 1, 23, 27472],
    [0, 2, 11, 38608],
    [11, 1, 31, 19176],
    [0, 2, 19, 19152],
    [0, 2, 8, 42192],
    [6, 1, 28, 53848],
    [0, 2, 15, 53840],
    [0, 2, 4, 54560],
    [5, 1, 24, 55968],
    [0, 2, 12, 46496],
    [0, 2, 1, 22224],
    [2, 1, 22, 19160],
    [0, 2, 10, 18864],
    [7, 1, 30, 42168],
    [0, 2, 17, 42160],
    [0, 2, 6, 43600],
    [5, 1, 26, 46376],
    [0, 2, 14, 27936],
    [0, 2, 2, 44448],
    [3, 1, 23, 21936],
    [0, 2, 11, 37744],
    [8, 2, 1, 18808],
    [0, 2, 19, 18800],
    [0, 2, 8, 25776],
    [6, 1, 28, 27216],
    [0, 2, 15, 59984],
    [0, 2, 4, 27424],
    [4, 1, 24, 43872],
    [0, 2, 12, 43744],
    [0, 2, 2, 37600],
    [3, 1, 21, 51568],
    [0, 2, 9, 51552],
    [7, 1, 29, 54440],
    [0, 2, 17, 54432],
    [0, 2, 5, 55888],
    [5, 1, 26, 23208],
    [0, 2, 14, 22176],
    [0, 2, 3, 42704],
    [4, 1, 23, 21224],
    [0, 2, 11, 21200],
    [8, 1, 31, 43352],
    [0, 2, 19, 43344],
    [0, 2, 7, 46240],
    [6, 1, 27, 46416],
    [0, 2, 15, 44368],
    [0, 2, 5, 21920],
    [4, 1, 24, 42448],
    [0, 2, 12, 42416],
    [0, 2, 2, 21168],
    [3, 1, 22, 43320],
    [0, 2, 9, 26928],
    [7, 1, 29, 29336],
    [0, 2, 17, 27296],
    [0, 2, 6, 44368],
    [5, 1, 26, 19880],
    [0, 2, 14, 19296],
    [0, 2, 3, 42352],
    [4, 1, 24, 21104],
    [0, 2, 10, 53856],
    [8, 1, 30, 59696],
    [0, 2, 18, 54560],
    [0, 2, 7, 55968],
    [6, 1, 27, 27472],
    [0, 2, 15, 22224],
    [0, 2, 5, 19168],
    [4, 1, 25, 42216],
    [0, 2, 12, 42192],
    [0, 2, 1, 53584],
    [2, 1, 21, 55592],
    [0, 2, 9, 54560]
  ],
  //是否闰年
  isLeapYear: function(year) {
    return ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0));
  },
  //天干地支年
  lunarYear: function(year) {
    var gan = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'],
      zhi = ['申', '酉', '戌', '亥', '子', '丑', '寅', '卯', '辰', '巳', '午', '未'],
      str = year.toString().split("");
    return gan[str[3]] + zhi[year % 12];
  },
  //生肖年
  zodiacYear: function(year) {
    var zodiac = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'];
    return zodiac[year % 12];
  },
  //公历月份天数
  //@param year 阳历-年
  //@param month 阳历-月
  solarMonthDays: function(year, month) {
    var FebDays = this.isLeapYear(year) ? 29 : 28;
    var monthHash = ['', 31, FebDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthHash[month];
  },
  //农历月份天数
  lunarMonthDays: function(year, month) {
    var monthData = this.lunarMonths(year);
    return monthData[month - 1];
  },
  //农历月份天数数组
  lunarMonths: function(year) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var leapMonth = yearData[0];
    var bit = (+yearData[3]).toString(2);
    var months = [];
    for (var i = 0; i < bit.length; i++) {
      months[i] = bit.substr(i, 1);
    }

    for (var k = 0, len = 16 - months.length; k < len; k++) {
      months.unshift('0');
    }

    months = months.slice(0, (leapMonth == 0 ? 12 : 13));
    for (var i = 0; i < months.length; i++) {
      months[i] = +months[i] + 29;
    }
    return months;
  },
  //农历每年的天数
  //@param year 农历年份
  lunarYearDays: function(year) {
    var monthArray = this.lunarYearMonths(year);
    var len = monthArray.length;
    return (monthArray[len - 1] == 0 ? monthArray[len - 2] : monthArray[len - 1]);
  },
  //
  lunarYearMonths: function(year) {
    var monthData = this.lunarMonths(year);
    var res = [];
    var temp = 0;
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var len = (yearData[0] == 0 ? 12 : 13);
    for (var i = 0; i < len; i++) {
      temp = 0;
      for (var j = 0; j <= i; j++) {
        temp += monthData[j];
      }
      res.push(temp);
    }
    return res;
  },
  //获取闰月
  //@param year 农历年份
  leapMonth: function(year) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    return yearData[0];
  },
  //计算农历日期与正月初一相隔的天数
  betweenLunarDays: function(year, month, day) {
    var yearMonth = this.lunarMonths(year);
    var res = 0;
    for (var i = 1; i < month; i++) {
      res += yearMonth[i - 1];
    }
    res += day - 1;
    return res;
  },
  //计算2个阳历日期之间的天数
  //@param year 阳历年
  //@param month
  //@param day
  //@param l_month 阴历正月对应的阳历月份
  //@param l_day  阴历初一对应的阳历天
  betweenSolarDays: function(year, month, day, l_month, l_day) {
    var time1 = new Date(year + "-" + month + "-" + day).getTime(),
      time2 = new Date(year + "-" + l_month + "-" + l_day).getTime();
    return Math.ceil((time1 - time2) / 24 / 3600 / 1000);
  },
  //根据距离正月初一的天数计算阴历日期
  //@param year 阳历年
  //@param between 天数
  lunarByBetween: function(year, between) {
    var lunarArray = [],
      yearMonth = [],
      t = 0,
      e = 0,
      leapMonth = 0,
      m = '';
    if (between == 0) {
      t = 1;
      e = 1;
      m = '正月';
    } else {
      year = between > 0 ? year : (year - 1);
      yearMonth = this.lunarYearMonths(year);
      leapMonth = this.leapMonth(year);
      between = between > 0 ? between : (this.lunarYearDays(year) + between);
      for (var i = 0; i < 13; i++) {
        if (between == yearMonth[i]) {
          t = i + 2;
          e = 1;
          break;
        } else if (between < yearMonth[i]) {
          t = i + 1;
          e = between - ((yearMonth[i - 1]) ? yearMonth[i - 1] : 0) + 1;
          break;
        }
      }

      m = (leapMonth != 0 && t == leapMonth + 1) ?
        ('闰'.this.chineseMonth(t - 1)) :
        this.chineseMonth(((leapMonth != 0 && leapMonth + 1 < t) ? (t - 1) : t));
    }
    lunarArray.push(year, t, e); //年 月 日
    lunarArray.push(this.lunarYear(year),
      this.zodiacYear(year),
      m,
      this.chineseNumber(e)); //天干地支年 生肖年 月份 日
    lunarArray.push(leapMonth); //闰几月
    return lunarArray;
  },
  //中文月份
  chineseMonth: function(month) {
    var monthHash = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
    return monthHash[month];
  },
  //中文日期
  chineseNumber: function(num) {
    var dateHash = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    if (num <= 10) {
      var res = '初' + dateHash[num];
    } else if (num > 10 && num < 20) {
      res = '十' + dateHash[num - 10];
    } else if (num == 20) {
      res = "二十";
    } else if (num > 20 && num < 30) {
      res = "廿" + dateHash[num - 20];
    } else if (num == 30) {
      res = "三十";
    }
    return res;
  },
  //转换农历
  toLunar: function(year, month, day) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    if (year == this.MIN_YEAR && month <= 2 && day <= 9) {
      return [1891, 1, 1, '辛卯', '兔', '正月', '初一'];
    }
    return this.lunarByBetween(year, this.betweenSolarDays(year, month, day, yearData[1], yearData[2]));
  },
  //转换公历
  //@param year 阴历-年
  //@param month 阴历-月，闰月处理：例如如果当年闰五月，那么第二个五月就传六月，相当于阴历有13个月
  //@param date 阴历-日
  toSolar: function(year, month, day) {
    var yearData = this.lunarInfo[year - this.MIN_YEAR];
    var between = this.betweenLunarDays(year, month, day);
    var ms = new Date(year + "-" + formatNumber1(yearData[1]) + "-" + formatNumber1(yearData[2])).getTime(); //真机有问题
    var s = ms + between * 24 * 60 * 60 * 1000;
    var d = new Date();
    d.setTime(s);
    year = d.getFullYear();
    month = d.getMonth() + 1;
    day = d.getDate();

    return [year, month, day].map(formatNumber).join('-')
  }
};

//中文字符的农历转数字字符
function toChineseNum(str) {
  var year = parseInt(str.substr(0, 4)); //年
  str = str.slice(9); //取剩下的月份和日
  var nlMonth = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];
  var lnMonth = ["闰正月", "闰二月", "闰三月", "闰四月", "闰五月", "闰六月", "闰七月", "闰八月", "闰九月", "闰十月", "闰冬月", "闰腊月"];
  var month = 0;
  if (str.indexOf('闰') != -1) { //闰月
    for (var i = 0; i < lnMonth.length; i++) {
      if (nlMonth[i] == str.substr(0, 3)) {
        month = i + 1;
        str = str.slice(3); //日
        break;
      }
    }
  } else {
    for (var i = 0; i < nlMonth.length; i++) {
      if (nlMonth[i] == str.substr(0, 2)) {
        month = i + 1;
        str = str.slice(2); //日
        break;
      }
    }
  }

  var nlDay = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];
  var day = 0;
  for (var i = 0; i < nlDay.length; i++) {
    if (nlDay[i] == str) {
      day = i + 1;
      break;
    }
  }
  return [year, month, day];
}
//旧历
function getOldAnnual(newDate, oldDate) { //需要日期的旧历和新历 旧历知道下一年的生日 新历计算相差天数
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var nowDay = nowDate.getDate(); //获取当前日(1-31)
  if (nowMonth > newDate.substr(5, 2)) { //今年的已经过了
    nowYear++;
    oldDate[0] = nowYear;
  } else if (nowMonth == newDate.substr(5, 2)) {
    if (nowDay > newDate.substr(8, 2)) {
      nowYear++;
      oldDate[0] = nowYear;
    } else {
      oldDate[0] = nowYear;
    }
  } else {
    oldDate[0] = nowYear;
  }
  return Lunar.toSolar(oldDate[0], oldDate[1], oldDate[2]);
}
//旧历
function getOldMonthly(oldDate) {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var nowDay = nowDate.getDate(); //获取当前日(1-31)

  var nowOldDate = Lunar.toLunar(nowYear, nowMonth, nowDay);
  if (nowOldDate[2] > oldDate[2]) { //本月已经过了
    if (nowOldDate[1] == 12) {
      nowOldDate[0]++;
      nowOldDate[1] = 1;
    } else {
      nowOldDate[1]++;
    }
  }
  nowOldDate[2] = oldDate[2];
  return Lunar.toSolar(nowOldDate[0], nowOldDate[1], nowOldDate[2]);
}

function getNewAnnual(newDate) {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var nowDay = nowDate.getDate(); //获取当前日(1-31)
  var flagDate = newDate.slice(5); //取剩下的月份和日
  var returnDate = '';
  if (nowMonth > newDate.substr(5, 2)) {
    nowYear++;
  } else if (nowMonth == newDate.substr(5, 2)) {
    if (nowDay > newDate.substr(8, 2)) {
      nowYear++;
    } else {}
  }
  returnDate = nowYear.toString() + '-' + flagDate;
  return returnDate;
}

function getNewMonthly(newDate) {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var nowMonth = nowDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
  var nowDay = nowDate.getDate(); //获取当前日(1-31)
  var flagDate = newDate.slice(8); //取剩下日
  if (nowDay > flagDate) {
    if (nowMonth == 12) {
      nowYear++;
      return nowYear.toString() + '-' + '01-' + flagDate;
    } else {
      var tempMonth = nowMonth + 1;
      if (tempMonth < 10) {
        tempMonth = tempMonth.toString()
        tempMonth = tempMonth[1] ? tempMonth : '0' + tempMonth
      }
      return nowYear.toString() + '-' + tempMonth.toString() + '-' + flagDate;
    }
  } else {
    if (nowMonth < 10) {
      nowMonth = nowMonth.toString()
      nowMonth = nowMonth[1] ? nowMonth : '0' + nowMonth
    }
    return nowYear.toString() + '-' + nowMonth.toString() + '-' + flagDate;
  }
}

function sortarr(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j].datedifference > arr[j + 1].datedifference) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

function timeFn(d1) { //di作为一个变量传进来
  //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
  var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
  var dateEnd = new Date(); //获取当前时间
  var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  //console.log(" 相差 " + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
  //console.log(dateDiff + "时间差的毫秒数", dayDiff + "计算出相差天数", leave1 + "计算天数后剩余的毫秒数", hours + "计算出小时数", minutes + "计算相差分钟数", seconds + "计算相差秒数");
  if (dateDiff < 1000) {
    return "刚刚"
  } else if (dateDiff < 1000 * 60) {
    return seconds + "秒前"
  } else if (dateDiff < 1000 * 60 * 60) {
    return minutes + "分钟前"
  } else if (dateDiff < 1000 * 60 * 60 * 24) {
    return hours + "小时前"
  } else if (dateDiff < 1000 * 60 * 60 * 24 * 30) {
    return dayDiff + "天前"
  } else {
    return d1.slice(0, 10);
  }
}



module.exports = {
  formatTime: formatTime,
  datedifference: datedifference,
  formatTime1: formatTime1,
  getFlatternDistance: getFlatternDistance,
  search: search,
  Lunar: Lunar,
  toChineseNum: toChineseNum,
  getOldAnnual: getOldAnnual,
  getOldMonthly: getOldMonthly,
  getNewAnnual: getNewAnnual,
  getNewMonthly: getNewMonthly,
  sortarr: sortarr,
  timeFn: timeFn
}