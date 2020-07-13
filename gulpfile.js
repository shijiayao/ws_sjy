const { src, dest, series, parallel } = require('gulp');
const del = require('del');

const compressed_time = timestampSerialize(); // 压缩代码时的时间

function delete_file() {
  return del(['./dist']);
}

function vue() {
  return src(['./node_modules/vue/dist/vue.js']).pipe(dest('./src/vendor/vue/'));
}

function jquery() {
  return src(['./node_modules/jquery/dist/jquery.js']).pipe(dest('./src/vendor/jquery/'));
}

function favicon_icon() {
  return src(['./src/favicon.ico']).pipe(dest('./dist/'));
}

function vendor_file() {
  return src(['./src/vendor/**']).pipe(dest('./dist/vendor/'));
}

// 将当前时间序列化重新输出
function timestampSerialize() {
  const CURRENT_TIME = new Date();

  let year = CURRENT_TIME.getFullYear();
  let month = CURRENT_TIME.getMonth() + 1;
  let day = CURRENT_TIME.getDate();
  let hour = CURRENT_TIME.getHours();
  let minute = CURRENT_TIME.getMinutes();
  let second = CURRENT_TIME.getSeconds();

  let dateArr = [year, month, day].map((element, index) => (element >= 10 ? element : `0${element}`));
  let timeArr = [hour, minute, second].map((element, index) => (element >= 10 ? element : `0${element}`));

  return `${dateArr.join('-')} ${timeArr.join(':')}`; // 2020-06-10 14:54:30
}

function compressed_end(cb) {
  cb();

  // gulp 任务结束后输出信息
  console.log('\n');
  console.log('============================================================');
  console.log('\n');
  console.log('\x1B[33m%s\x1B[39m \x1B[34m%s\x1B[39m', 'compressed time', compressed_time);
  console.log('\n');
  console.log('============================================================');
}

const import_file = parallel(vue, jquery);
const prelogic = series(delete_file, import_file); // 顺序执行预处理任务
const compressed_task = parallel(favicon_icon, vendor_file); // 最大并发性执行任务
const end_phase = series(compressed_end); // 顺序执行结束任务

exports.default = series(prelogic, compressed_task, end_phase);
