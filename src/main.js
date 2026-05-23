import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './permission' // permission control
import '@/assets/styles/style.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as echarts from 'echarts'
import './error'; // 日志

Vue.use(ElementUI);
Vue.prototype.$echarts = echarts
Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
