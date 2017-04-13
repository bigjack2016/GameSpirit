<template>

        <div id="genius" class="wapper">
            <div class="genius_container components_container" v-if="!control">
                <div class="genius_tables">
                    <a href="javascript:;" @click="tableChange(0)" v-bind:style="active===0?'#ffbf21':'#ffffff' | fontColor">
                        <img v-bind:src="active===0?backgroundArrActive[0]:backgroundArr[0]">
                        游戏帮助
                    </a>
                    <a href="javascript:;" @click="tableChange(1)" v-bind:style="active===1?'#ffbf21':'#ffffff' | fontColor">
                        <img v-bind:src="active===1?backgroundArrActive[1]:backgroundArr[1]"><strong id="read_dot" v-if="!total_IsRead.VersionTrailerRead"></strong>
                        版本先知
                    </a>
                    <a href="javascript:;" @click="tableChange(2)" v-bind:style="active===2?'#ffbf21':'#ffffff' | fontColor">
                        <img v-bind:src="active===2?backgroundArrActive[2]:backgroundArr[2]"><strong id="read_dot" v-if="!total_IsRead.GameListRead"></strong>
                        更多游戏
                    </a>
                </div>
                <components :is="active + ''"></components>
            </div>
            <div v-if="control" style="color:#fff" class="components_container">
                <div class="question_title question">{{question_object.ProblemName}}</div>
                <div class="question_answer question">{{{question_object.ProblemContent}}}</div>
                <div class="question_response" v-if="control_isResponse">
                    <div class="judge_response" v-if="!control_feedback">
                        是否解决问题？<div><span class="yes" @click="response(false)">未解决</span><span class="no" @click="response(true)">已解决</span></div>
                    </div>
                    <div class="judge_response" v-else>
                        感谢您的反馈！
                    </div>
                </div>
            </div>
        </div>

</template>
<style lang='sass'>
    @import './../../../static/scss/function.scss';
    $fontColor:#ffbf21;
    #genius{
        position:relative;
        .genius_container{
            position:relative;
            top:px2em(10px);
            clear:both;
        }
        .genius_tables{
            position:absolute;
            width:100%;
            z-index:2;
            overflow:hidden;
            a{
                @include font-dpr(22px);
                position:relative;
                display:block;
                float:left;
                width:px2em(349px);
                height:px2em(60px);
                color:#fff;
                text-decoration: none;
                text-align:center;
                line-height:px2em(60px);
                font-size:px2em(24px);
                    img{
                        position:absolute;
                        top:0;
                        left:0;
                        z-index:-1;
                        width:100%;
                    }
            }
        }
        .question_title{
            height:px2em(50px);
            margin-top:px2em(30px);
            background:url('./../../../static/images/question_title.png') left center no-repeat;
        }
        .question_answer{

            margin-top:px2em(14px);
            background:url('./../../../static/images/question_answer.png') left top no-repeat;
            img{
                max-width:80%;
            }
        }
        .question{

            text-indent:px2em(60px);
            background-size:px2em(48px) px2em(48px);
            line-height:px2em(50px);
            font-size:px2em(18px);
        }
        .question_response{
            position:relative;
            top:px2em(30px);
            width:100%;
            height:px2em(110px);
            background:url('./../../../static/images/mengban_2.png') center no-repeat;
            background-size:cover;
            margin:0 0 px2em(40px) 0;
            line-height:px2em(110px);
            .judge_response{
                text-indent:px2em(120px);
                font-size:px2em(24px);
                div{ text-indent:0;
                   width:px2em(416px);
                   height:px2em(58px);
                   line-height:px2em(58px);
                   position:absolute;
                   top:0;left:0;right:0;bottom:0;
                   margin:auto;
                   span{
                       height:100%;
                       width:px2em(185px);
                       text-align:center;
                       background:url('./../../../static/images/response.png') no-repeat;
                       background-size:cover;
                       font-size:px2em(28px);
                       &.yes{
                        float:left;
                       }
                       &.no{
                        float:right;
                       }
                   }
                }
            }
        }
    }
</style>
<script>

    import Swiper from 'swiper';  // 引入swiper做banner图的轮播
    // 子组件的引用
    import GameHelp from './gameHelp.vue';
    import NewVersion from './newVersion.vue';
    import MoreGame from './moreGame.vue';

    const response_question = "http://66.ourgame.com/GameSpirit/ProblemSolve/AddProblemSolveClient";

    export default{
        data(){
            return{
                backgroundArr:['./static/images/btn_left.png','./static/images/btn_center.png','./static/images/btn_right.png'],
                backgroundArrActive:['./static/images/btn_left_active.png','./static/images/btn_center_active.png','./static/images/btn_right_active.png'],
                active:0,
                infor_container:'',
                control:false,
                question_object:[],
                control_feedback:false,
                total_IsRead:{VersionTrailerRead:true,GameListRead:true,ServiceRecordRead:true},
                control_isResponse:true,
                problemKId:''
            }
        },
        methods:{
            tableChange:function(num){
                this.active = num;
            },
            response:function(yes_no){
                var un = this.$root.$data.userName;
                var rn = this.$root.$data.parsenName;
                var tk = this.$root.$data.token;

                this.$http.post(response_question,{
                    AccountName:un,
                    RoleName:rn,
                    Token:tk,
                    IsSolve:yes_no,
                    ProblemKId:this.problemKId
                }).then(function(response){
                    console.log(response.data)
                    this.control_feedback = true;
                })

            }
        },
        init:function(){

        },
        filters:{
            fontColor:function(value){  //将传递过来的16进制颜色值转换为 "color:#ffffff" 字符串格式
                return "color:" + value;
            }
        },
        components:{ // 配置子组件并命名
            '0':GameHelp,
            '1':NewVersion,
            '2':MoreGame
        },
        ready:function(){
            this.$root.$data.record = 1; //控制根组件的record的值，以达到改变导航类名的作用\
            this.total_IsRead = this.$root.$data.total_IsRead;
        }
    }
</script>
