import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);  //在vue上挂载vue-router
import Http from 'vue-resource'
Vue.use(Http);  //在vue上挂载vue-resource
import './../static/js/flexible.js';
Vue.http.options.emulateJSON = true; //开启vue-resource的json传递数据功能

//组件的引用
import App from './App.vue'
import GeniusComponent from './components/Genius/index.vue';
import PlatformComponent from './components/Platform/index.vue';
import RecordComponent from './components/Record/index.vue';
import ServiceComponent from './components/Service/index.vue';


//实例化vue-router
var router = new VueRouter();


//vue-router的配置
router.map({
  '/Genius':{
    component:GeniusComponent
  },
  '/Service':{
    component:ServiceComponent
  },
  '/Record':{
    component:RecordComponent
  },
  '/Platform':{
    component:PlatformComponent
  }
})

//默认路由设置
router.redirect({
  '/':'/Genius'
})


//启动路由
router.start(App,'app')