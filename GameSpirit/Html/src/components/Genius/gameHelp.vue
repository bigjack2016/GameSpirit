<template>
    <div class="gameHelp_contaniner">
        <div class="gameHelp_banner">
            <div class='swiper-wrapper'>
                <div class="swiper-slide" v-for="item in bannerPicArr">
                    {{{item.FigureContent}}}
                </div>
            </div>
        </div>
        <div class="gameHelp_select">
            <div class="gameHelp_selct_info">
                <input tyle="text" v-model="sercheText" placeholder="请输入搜索关键字"/>
                <button @click="serche" @touchstart="touchList($event,'button')" @touchend="touchList($event,'button')">搜索</button>
            </div>
            <div class="gameHelp_select_list">
                <span v-for="(index,item) in resolveArr" @click="serche_info(item.KId)" class="gameHelp_list_border" :style="item.IsRecommend?'color:red;border-color:red':''">
                    <em @touchstart="touchList($event,'em')" @touchend="touchList($event,'em')">{{ item.ProblemName }}</em>
                </span>
                <div v-if='noinfo_dialog' class="noinfo_dialog">
                    <span class="infor_dialog">抱歉 您的问题已经超出了小精灵的知识范畴啦</span><br />
                    您可以通过客户服务来解决此问题。<a style="color:#ffbf21;" class='app-nav' v-link="{path:'/Service'}" @click="picChange(1)">点击此处</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang='sass'>
    @import './../../../static/scss/function.scss';
    .gameHelp_contaniner{
        color:#ffffff;
            .gameHelp_banner{
                width:px2em(1050px);
                height:px2em(480px);
                overflow:hidden;
                border-radius:px2em(24px);
                   img{
                       display:block;
                       width:99.4%;
                       height:100%;
                       border:$borderLine;
                       border-radius:px2em(24px);
                    }
            }
            .gameHelp_select{
                margin-top:px2em(20px);
                clear:both;
                .gameHelp_selct_info{
                    height:px2em(60px);
                    border:$borderLine;
                    border-radius:px2em(30px);
                    background:$darkblue;
                    padding:1px;
                }
                input{
                    height:100%;
                    width:px2em(700px);
                    line-height:px2em(40px);
                    color::#fff;
                    text-indent:20px;
                    outline:none;
                    background:none;
                    border:none;
                    font-size:px2em(24px);
                }
                button{
                    float:right;
                    margin:px2em(2px);
                    height:px2em(56px);
                    width:px2em(180px);
                    font-size:10px;
                    background:url('./../../../static/images/sercheBtn.png') no-repeat;
                    background-size: cover;
                    color:#ffffff;
                    border:none;
                    outline:none;
                    line-height:px2em(30px);
                    font-size:px2em(24px);
                }
                .button_hover{
                    background:url('./../../../static/images/sercheBtn_active.png') no-repeat;
                    background-size:cover;
                }
                .gameHelp_select_list{
                    margin:px2em(16px) 0 px2em(20px) 0;
                    overflow:hidden;
                }
                .gameHelp_list_border{
                    float:left;
                    width:px2em(343px);
                    height:px2em(50px);
                    border:$borderLine;
                    text-align:center;
                    em{
                        display:block;
                        margin:px2em(3px);
                        line-height:px2em(44px);
                        background:url('./../../../static/images/listBtn.png') no-repeat;
                        background-size:cover;
                        overflow:hidden;
                        text-overflow: ellipsis;
                        font-size:px2em(24px);
                    }
                    .em_hover{
                        background:url('./../../../static/images/listBtn_active.png') no-repeat;
                    }
                }
                .noinfo_dialog{
                    margin-left:px2em(15px);
                    color:#fff;
                    font-size:px2em(20px);
                    line-height:2;
                    font-size:px2em(24px);
                    a{
                        text-decoration:underline;
                    }
                }
                .infor_dialog{
                    margin-bottom:px2em(10px);
                    color:#be3333;
                    font-size:px2em(24px);
                }
            }
    }
</style>
<script>
    import swiper from 'swiper';  //引入swiper插件，做轮播图
    const PIC_LIST_URL = "http://66.ourgame.com/GameSpirit/Complex/GetCarouselFigureQABase";
    const QUESTION_CONTIANER_URL = "http://66.ourgame.com/GameSpirit/Problem/GetProblemInfoById";
    const TOTAL_ISREAD = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/GetReadInfoTotal";
    const LIST_QUESTION_API = "http://66.ourgame.com/GameSpirit/ProblemSolve/GetProblemSolve";;
    export default{
        data(){
            //定义变量
            return{
                bannerPicArr:[],
                sercheText:'',
                oldListArr:[],  //存储从后台获取的问题列表
                resolveArr:[], //存储需要渲染到前台的问题列表
                noinfo_dialog:false,
                isResponse:[]
            }
        },
        methods:{ //定义方法
            serche:function(){
                //对aldListArr数组进行处理
                if(this.sercheText !== ''){  //如果搜索框的内容为不为空时进行检索
                    var arr = [],
                    oldArr = this.oldListArr,
                    i = 0,
                    text = this.sercheText;
                    for(;i<oldArr.length;i++){
                        var count = 0,
                            j = 0;
                        for(;j<text.length;j++){
                            if(oldArr[i].ProblemName.indexOf(text[j]) >= 0){
                                count++;
                            }
                        }
                        oldArr[i].cut = count;
                        arr[i] = oldArr[i];
                    }
                    //对数组进行排序
                    var k = 0;
                    this.resolveArr = [];
                    for(;k<text.length;k++){
                        var num = text.length - k;
                        for(var i = 0;i<arr.length;i++){
                            if(arr[i].cut == num && num != 0){
                                this.resolveArr.push(arr[i])
                            }
                        }
                    }
                    if(this.resolveArr.length === 0){
                        this.noinfo_dialog = true;  //搜索结果为空时，显示查找不到结果字样
                    }else{
                        this.noinfo_dialog = false; //搜索结果不为空时，隐藏
                    }
                }else{ //如果搜索框内容为空就设置其搜索结果为默认值
                    this.resolveArr = this.oldListArr;
                    this.noinfo_dialog = false;  //保证搜索结果为空时显示的字样隐藏
                }



            },
            serche_info:function(num){
                var un = this.$root.$data.userName;
                var rn = this.$root.$data.parsenName;
                var tk = this.$root.$data.token;
                this.$http.post(QUESTION_CONTIANER_URL,{
                    ProblemId:num,
                    RoleName: rn,
                    Token:tk
                }).then(function(response){
                    this.$parent.$data.question_object = response.data.Value;
                    this.$root.$data.control_help = true;
                    this.$parent.$data.control = true;
                    this.$root.$data.page_info = "游戏帮助";
                    this.$root.$data.control_close = false;

                });
                var flag = true;
                for(var i = 0;i<this.isResponse.length;i++){
                    if(this.isResponse[i].ProblemKId === num){
                        flag = false;
                    }
                }
                this.$parent.$data.problemKId = num;
                this.$parent.$data.control_isResponse = flag;



            },
            touchList:function(event,type){
                if(!event.target.className || event.target.className === ''){
                    event.target.className = type + '_hover';
                }else{
                    event.target.className = '';
                }
            },
            picChange:function(num){
                this.$parent.$parent.$data.record = 2;
            }
        },
        ready:function(){
            var un = this.$root.$data.userName;
            var rn = this.$root.$data.parsenName;
            var tk = this.$root.$data.token;

            //获取接口PIC_LIST_URL的内容
            this.$http.post(PIC_LIST_URL,{
                RoleName:rn,
                Token:tk
            }).then(function(response){
                this.$set('bannerPicArr',response.data.Value.Value1);  //value1里面是banner图的内容
                this.$set('oldListArr',response.data.Value.Value2); //value2里面是问题的列表内容
                this.$set('resolveArr',response.data.Value.Value2);
                console.log(this.oldListArr);
                //banner图的轮播
                if(this.bannerPicArr.length > 1){ //如果图片数量大于1就实例化swiper进行轮播
                    this.$nextTick(function(){
                        var mySwiper = new swiper('.gameHelp_banner',{
                               autoplay:3000,
                               loop:true,
                               effect:'flip'
                        })
                    })
                }else{
                    console.log("无图片")
                }
            });

            this.$http.post(LIST_QUESTION_API,{
                AccountName:un,
                RoleName:rn,
                Token:tk
            }).then(function(response){
                this.isResponse = response.data.Value;
                console.log(response.data.Value)
            });


        },
        init:function(){
        }
    }
</script>
