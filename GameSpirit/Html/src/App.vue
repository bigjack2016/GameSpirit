<template>
  <div id="doc">
  <div id="app">
    <div v-if="control_close">
      <a class='app-nav' v-link="{path:'/Genius'}" v-on:click="picChange(1)"><img v-bind:src="record===1?picArrActive[0]:picArr[0]" class="list_pic"/><strong id="read_dot" v-if="!total_IsRead.VersionTrailerRead || !total_IsRead.VersionTrailerRead"></strong></a>
      <a class='app-nav' v-link="{path:'/Service'}" v-on:click="picChange(2)"><img v-bind:src="record===2?picArrActive[1]:picArr[1]" class="list_pic"/></a>
      <a class='app-nav' v-link="{path:'/Record'}" v-on:click="picChange(3)"><img v-bind:src="record===3?picArrActive[2]:picArr[2]" class="list_pic"/><strong id="read_dot" v-if="!total_IsRead.ServiceRecordRead"></strong></a>
      <a class='app-nav' v-link="{path:'/Platform'}" v-on:click="picChange(4)"><img v-bind:src="record===4?picArrActive[3]:picArr[3]" class="list_pic"/></a>
    </div>
    <div class="close_page" v-else>
      <span class="close_page_btn" @click="close_twoPage"></span>
      <div class="page2info">{{page_info}}</div>
    </div>
  </div>
  <router-view></router-view>
  <div id="slide-bar">
    <div class="slide-top" @touchstart="touchList($event,'slide-top_hover')" @touchend="touchList($event,'slide-top')" @click="touchList($event,'click')"></div>
    <div class="slide-bottom" @click="reTop" @touchstart="touchList($event,'slide-bottom_hover')" @touchend="touchList($event,'slide-bottom')"></div>
  </div>
  <div id="alert_info" v-if="IsAlert">
    <p>{{Alert_info}}</p>
    <span @click="close_alert">确定</span>
  </div>
  </div>
</template>

<script>
const TOTAL_ISREAD = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/GetReadInfoTotal";
import Base64 from "./../static/js/BaseDecode.js";
export default {
  data () {
    return {
      picArr:['./static/images/gamegenius.png','./static/images/service.png','./static/images/record.png','./static/images/platform.png'],  //导航默认样式的图片路径数组
      picArrActive:['./static/images/gamegenius_active.png','./static/images/service_active.png','./static/images/record_active.png','./static/images/platform_active.png'], //导航激活的样式图片路径数组
      record:1, // 控制导航显示样式
      userName:"",  //用户名
      parsenName:"",  //角色名
      token:"",
      page_info:"关闭二级页面",
      qustion_type:null,
      IsAlert:false,
      Mode:0,
      total_IsRead:{VersionTrailerRead:true,GameListRead:true,ServiceRecordRead:true},
      Alert_info:"提交问题失败，请稍后重试",
      control_close:true, //控制关闭按钮是关闭内容还是关闭窗口，子集组件如果打开多个窗口的时候会将值改为1
      control_help:false  //控制游戏精灵中游戏帮助的问题解答界面的显示或隐藏
    }
  },
  methods:{
    picChange:function(num){
      this.record = num;  //根据点击激活的导航条目不同，对应的图片改为激活后的图片
      this.$children[0].$data.control = false;  //同时关闭子组件的二级窗口
    },
    reTop:function(){
      this.$nextTick(function(){
          //将类名为wapper的内容框的top值改为0，达到回到顶部的作用
          document.querySelector('.wapper').scrollTop = 0;
      })
    },
    touchList:function(event,name){
        event.target.className = name; // 改变关闭按钮的类名，以改变其对应的背景图
        var close = "";
        if(name == "slide-top" || name == "click"){
          if(this.Mode == 0){
            parent.hideWeb();
          }else if(this.Mode == 1){
            window.jscallback.closeWebView();
          }else{
            console.log('关闭ios的webview');
          };
        };
    },
    close_twoPage:function(){
      this.control_close = true;
      this.$children[0].$data.control = false;  //关闭子组件的二级窗口
      this.$children[0].$data.control_feedback = false;
      this.$children[0].$data.service_cNumber = 'default_component';  //将Service/index.vue的serviece_cNumber设置为default_componet
    },
    close_alert:function(){
      this.IsAlert = false;
    }
  },
  ready:function(){
    // 获取url传递过来的参数，进行赋值

    var user_info = window.location.href.split("#")[0].split("?")[1];
    var arr = user_info.split("&");
    var ob = {};
    for(var i = 0;i<arr.length;i++){
      ob[arr[i].split("=")[0]] = arr[i].split("=")[1];
    };
    if(ob.DisplayName){
      this.userName = decodeURIComponent(ob.DisplayName);
    };
    if(ob.RoleName){
      this.parsenName = decodeURIComponent(ob.RoleName);
    };
    if(ob.IDCertificate){
      this.token = decodeURIComponent(ob.IDCertificate);
    };
    if(ob.Mode){
      this.Mode = decodeURIComponent(ob.Mode);
    }
    console.log(this.token + "/" + this.parsenName + "/" + this.userName);
    /*this.userName = "admin";
    this.token = "CAEQxb/0wQUaATAikATH6UXs1tZa8d3DfBrgK+Q4nddmnSnqQFaqSklLcXuKIOPIRCD6Dm2xwFpLtphAUbdYMRAO0powh14k3XWexOu3HANSd3c+bE/sH+8084n+CkutK8UJ5EP3eK7hsGjvlfmef6ERaXidFfPO/ufCVs+dnBLlh6KtPLjYeEomaJNFECc7ga0RsPMrUVTiJN00jT1vkU+wC6MAji4ttXYkoS6I3p7lt/pfvzvenuW3+l+/OyEsupBfw8v3nEPL7mhx7lwsrT1yv64uSaiD4j4k7u4uDqzHyPSN+GwjKlXXd8OF296e5bf6X787kcl3CSPo/8Mu5FU78C1SAZYqeqorPWMghy0zTP/Y4Epnc95Xv+izhRmV91q8OGM8f0Q92XEZImOdumxaV8xHqAuMl0pxgKUbqgRtG6wMKkLjdDvOYrI2k2Z4d4hHtIn34odZTTkcgLRwz6cTR7UK0RODmQxw2taM3p7lt/pfvzuRdRT8/Bab5yMqVdd3w4Xb3p7lt/pfvzsHhDV5ZXpa1xqnmsrYAChP4UbAw/dCrKTlu5ftKnT3CviQlMqgaNes4HusNOr9vcESCFUtYQ2J8s77EMGcO56lVo3ydfSmab2iJjyjZWZYrG4yuW1Lo4Tf4SkddnEYNL//4v5TEGjJkRhEBqOxLcXOzl9nJV3FsYjmUNaoGZoCrddl1IAYoLj15+V3b0cfQ=";
    this.parsenName = "roseBlue";*/
    this.$http.post(TOTAL_ISREAD,{
        RoleName:this.parsenName,
        Token:this.token,
        AccountName:this.userName
    }).then(function(response){
      this.total_IsRead = response.data.Value;
      this.$children[0].$data.total_IsRead = response.data.Value;
      document.getElementById('doc').style.left = '0';
    });
  }
}
</script>

<style lang="sass">
  @import './../static/css/base.css';
  @import './../static/scss/function.scss';
  @import './../static/css/swiper-3.4.0.min.css';

html{
  height:100%;
  background:rgba(0,0,0,0);
}
body {
    font-family: Microsoft YaHei;
    height:100%;
    overflow:hidden;
    position:relative;
    background:rgba(0,0,0,0);
}
#doc{
  position:relative;
  width:100%;
  height:100%;
  left:-100%;
  top:0;
  transition:all .8s;
  background:url(./../static/images/background.png) repeat;
}
#app{
  position:absolute;
  top:0;
  left:0;
  width:px2em(160px);
  height:100%;
  background:$darkblue;
  animation:all .5;
    .close_page{
      position:relative;
      width:100%;
      height:100%;
      color:#fff;
      .close_page_btn{
        display:block;
        width:px2em(60px);
        height:px2em(60px);
        background:url("./../static/images/close_2page.png") no-repeat center;
        background-size:cover;
        margin:px2em(30px) auto;
      }
      .page2info{
        position:absolute;
        top:50%;
        left:50%;
        width:px2em(40px);
        font-size:px2em(40px);
        -webkit-transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
      }
    }
    .app-nav{
      position:relative;
      display:block;
      width:100%;
      height:25%;
      color:#fff;
      text-decoration:none;
      text-align:center;
      background:url(./../static/images/left_line.png) repeat-x bottom;
        .list_pic{
          position:absolute;
          top:0;
          left:0;
          bottom:0;
          right:0;
          margin:auto;
          width:px2em(100px);
        }
    }
}
.wapper{
  margin:0 px2em(80px) 0 px2em(160px);
  height:100%;
  overflow-y:scroll;
}
#slide-bar{
  position:absolute;
  top:0;
  right:0;
  width:px2em(80px);
  height:100%;
  background:black;
    .slide-top{
      margin:px2em(10px) auto;
      width:px2em(60px);
      height:px2em(60px);
      background:url('./../static/images/close.png') no-repeat center;
      background-size:cover;
    }
    .slide-top_hover{
      margin:px2em(10px) auto;
      width:px2em(60px);
      height:px2em(60px);
      background:url('./../static/images/close_active.png') no-repeat center;
      background-size:cover;
    }
    .slide-bottom{
      position:absolute;
      bottom:px2em(16px);
      left:px2em(10px);
      width:px2em(60px);
      height:px2em(60px);
      background:url('./../static/images/reTop.png') no-repeat;
      background-size:cover;
    }
    .slide-bottom_hover{
      position:absolute;
      bottom:px2em(16px);
      left:px2em(10px);
      width:px2em(60px);
      height:px2em(60px);
      background:url('./../static/images/reTop_active.png') no-repeat;
      background-size:cover;
    }
}
.components_container{
  margin:0 auto;
  width:px2em(1051px);
  position:relative;
}
#alert_info{
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  top:0;
  margin:auto;
  width:px2em(400px);
  height:px2em(200px);
  background:#14141f;
  border-radius:px2em(30px);
  color:#fff;
  font-size:px2em(24px);
  span{
    position:absolute;
    bottom:px2em(20px);
    left:px2em(125px);
    display:block;
    width:px2em(150px);
    height:px2em(50px);
    line-height:px2em(50px);
    text-align:center;
    background:#3f2c6d;
    border-radius:px2em(30px);
  }
  p{
    display:block;
    width:90%;
    margin:px2em(50px) auto;
    text-align:center;
  }
}
#read_dot{
  position:absolute;
  top:px2em(6px);
  right:px2em(8px);
  display:block;
  width:px2em(20px);
  height:px2em(20px);
  border-radius:50%;
  background:red;
}
</style>
