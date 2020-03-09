
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

export function dataToTree(data) {
  const result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  data.forEach(item => {
    delete item.lowerMenu;
  });
  const map = {};
  data.forEach(item => {
    map[item.id] = item;
  });
  data.forEach(item => {
    const parent = map[item.parentId];
    if (parent) {
      (parent.lowerMenu || (parent.lowerMenu = [])).push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
export function delWeight(current, table) {
  var tempArray1 = [];
  var tempArray2 = [];

  for (var i = 0; i < table.length; i++) {
    tempArray1[table[i]] = true;
  }

  for (var i = 0; i < current.length; i++) {
    if (tempArray1[current[i]]) {
      tempArray2.push(current[i]);
    }
  }

  return tempArray2;
}

function timestampToTime (timestamp) {
  var date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D =
    (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D;
}

// 导出excel
function formatJson (filterVal, jsonData) {
  return jsonData.map(v =>
    filterVal.map(j => {
      if (j === "enddate" || j === "stadate") {
        return this.timestampToTime(v[j]);
      } else {
        return v[j];
      }
    })
  );
}
export function donwnloadExcel(filename, tHeader, filterVal, exceldata) {
  filename = filename + timestampToTime(new Date())
  import("@/vendor/Export2Excel").then(excel => {
    const list = exceldata;
    const data = formatJson(filterVal, list);
    excel.export_json_to_excel({
      header: tHeader,
      data,
      filename: filename,
      autoWidth: true,
      bookType: 'xlsx'
    });
  });
}

// // 获取员工信息
// import { getholiday } from '@/api/ntahl'
// export function getEmployeeInfo(data, info) {
//   // console.log(data)
//   // 页面展示部门代码及姓名工号
//   this.dept = data.depName + ' - ' + data.dep
//   this.name = data.name + ' - ' + data.empNum;
//   // this.position = data.title;

//   // this.item.name = data.name;
//   // this.item.position = data.title;
//   // 需要参数为部门id及员工id
//   this.item.employeeName = data.name;
//   this.item.employeeId = data.id;
//   this.item.departName = data.depName;
//   this.item.departId = data.dep;
//   // 根据员工信息查询假种
//   if (info === '请假') {
//     console.log(data)
//     var depart_id = data.dep;
//     var employee_id = data.id;
//     var doc_date = this.item.docDate;
//     var para = { depart_id: depart_id, employee_id: employee_id, doc_date };
//     console.log(para)
//     getholiday(para).then(res => {
//       // console.log('假种', res);
//       this.holidayType = res.data;
//     })
//   }
// }

// 计算时间间隔（最小单位0.5天）
export function getdays(startTime, endTime) {
  var begin = new Date(startTime);
  var end = new Date(endTime);
  // 判断请假时间是否为上午；
  var beginTime = startTime.split(" ")[1].split(":")[0];
  var stopTime = endTime.split(" ")[1].split(":")[0];
  if (beginTime[0] == '0') {
    beginTime = beginTime[1]
  }
  if (stopTime[0] == '0') {
    stopTime = stopTime[1]
  }
  beginTime = Number(beginTime);
  stopTime = Number(stopTime);
  // console.log(beginTime, stopTime);

  var span = end.getTime() - begin.getTime();
  var result = 0;
  var days = Math.floor(span / (24 * 3600 * 1000));
  result = Number(days);
  if (beginTime !== 0 && stopTime !== 0) {
    if (beginTime <= 13 && stopTime <= 13) { result += 0.5 } else if (beginTime <= 13 && stopTime > 13) { result += 1 } else if (beginTime > 13 && stopTime > 13) { result += 0.5 }
  } else if (beginTime === 0 && stopTime !== 0) {
    if (stopTime <= 13) { result += 0.5 } else if (stopTime > 13) { result += 1 }
  } else if (beginTime !== 0 && stopTime === 0) {
    if (beginTime <= 13) { result += 1 } else if (beginTime > 13) { result += 0.5 }
  } else { result += 1 }
  console.log(result)
  return result;
}

// 判断两个对象是否相同
export function isObjectValueEqual(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  // console.log(aProps,bProps)

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    if (a[propName] !== b[propName]) {
      return false;
    }
  }
  return true;
}

// 多表单验证
export function getFormPromise(form) {
  return new Promise(resolve => {
    this.$refs[form].validate(valid => {
      if (valid) resolve();
    })
  })
}
