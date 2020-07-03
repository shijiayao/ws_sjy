const method = {
  // 生成随机数，范围 x - y
  randomNumber(x, y) {
    return Math.floor(Math.random() * (y - x + 1) + x);
  },
  // 随机打乱数组
  randomArray(arr) {
    let _this = this;

    let tempArr = _this.getType(arr) === 'Array' ? arr.slice() : [];
    let resultArr = [];
    let random = 0;

    while (tempArr.length > 0) {
      random = Math.floor(Math.random() * tempArr.length);
      resultArr.push(tempArr[random]);
      tempArr.splice(random, 1);
    }

    return resultArr;
  },
  /**
   * 获取变量详细类型
   * @param {type} unknown
   * @return Function Object Array String Number Boolean ...
   */
  getType(unknown) {
    let ret = Object.prototype.toString.call(unknown);
    ret = ret.slice(8, -1);
    return ret;
  },
  // 时间戳转为序列化日期
  timestampSerialize(timestamp) {
    let dateNum = 0;
    let dateNumLength = 0;

    if (!isNaN(new Date(timestamp).getTime())) {
      // 字符串日期 或者 数字时间戳
      dateNum = new Date(timestamp).getTime();
    } else if (!isNaN(new Date(Number(timestamp)).getTime())) {
      // 字符串时间戳
      dateNum = new Date(Number(timestamp)).getTime();
    } else {
      return timestamp;
    }

    dateNumLength = String(dateNum).length;

    if (dateNumLength < 10) {
      // 小于 10 位数，默认不是时间戳
      return timestamp;
    } else if (dateNumLength < 13) {
      // 补齐时间戳位数
      dateNum = Number(dateNum) * Math.pow(10, 13 - dateNumLength);
    }

    let D = new Date(dateNum);

    let year = D.getFullYear();
    let month = D.getMonth() + 1;
    let day = D.getDate();
    let hour = D.getHours();
    let minute = D.getMinutes();
    let second = D.getSeconds();

    let dateArr = [year, month, day];
    let timeArr = [hour, minute, second];

    // 2019/08/19
    let dateStr = dateArr.map((element, index) => (element < 10 ? '0' + element : element)).join('/');

    // 11:38:36
    let timeStr = timeArr.map((element, index) => (element < 10 ? '0' + element : element)).join(':');

    return `${dateStr} ${timeStr}`;
  }
};

module.exports = method;
