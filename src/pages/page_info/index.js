import Vue from 'vue';
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './index.scss';

const data = {
  infoArr: []
};

const app = new Vue({
  el: '#app',
  data,
  beforeCreate() {},
  created() {
    this.infoArr.push({ name: 'userAgent', value: String(window.navigator.userAgent) });
    this.infoArr.push({ name: 'appVersion', value: String(window.navigator.appVersion) });
    this.infoArr.push({ name: 'pageSize', value: `${window.screen.width}*${window.screen.height}` });
  },
  methods: {}
});
