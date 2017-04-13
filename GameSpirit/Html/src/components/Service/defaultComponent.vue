<template>
    <dl class="service_default">
        <dt>常见问题</dt>
        <dd><span @click="dealWithClick('common_problem',item.KId)" v-for="item in question_type1" :style="item.IsRecommend?'color:red':''">{{item.Question}}</span></dd>
    </dl>
    <dl class="service_default">
        <dt>提交问题</dt>
        <dd><span @click="dealWithClick('submit_question',item.KId)" v-for="item in question_type">{{item.TypeName}}</span></dd>
    </dl>
</template>
<style lang="sass">
    @import './../../../static/scss/function.scss';
    .service_default{
        margin-bottom:px2em(120px);
    }
    .service_default dt{
        height:px2em(50px);
        font-size:px2em(26px);
        line-height:px2em(50px);
        font-weight:600;
        text-indent:px2em(60px);
        background:url('./../../../static/images/question_mark.png') no-repeat center left;
        background-size:px2em(50px) px2em(50px);
    }
    .service_default dd{
        font-size:px2em(26px);
        text-indent:px2em(70px);
        span{
            font-size:px2em(20px);
            margin:px2em(20px) px2em(60px) 0 0;
            text-indent:0;
            display:inline-block;
            min-width:px2em(180px);
            height:px2em(60px);
            background:#3f2c6d;
            border-radius:px2em(30px);
            text-align:center;
            padding:0 px2em(20px);
            line-height:px2em(60px);
    }
    }
</style>
<script>
    const QUESTION_TYPE_API = "http://66.ourgame.com/GameSpirit/FeedbackType/GetFeedbackTypeList";
    const QUESTION_TYPE1_API = "http://66.ourgame.com/GameSpirit/QABase/GetQABaseQuestionList";
    const QUESTION_CONTAINER_API = "http://66.ourgame.com/GameSpirit/QABase/GetQABaseInfoById";
    export default{
        data(){
            return{
                question_type:[],
                question_type1:[]
            }
        },
        methods:{
            dealWithClick:function(type,num){
                var un = this.$root.$data.userName;
                var rn = this.$root.$data.parsenName;
                var tk = this.$root.$data.token;
                this.$http.post(QUESTION_CONTAINER_API,{
                    QABaseId: num,
                    RoleName:rn,
                    Token:tk
                }).then(function(response){
                    console.log(response.data)
                    this.$parent.$data.common_data = response.data.Value;
                    this.$parent.$data.service_cNumber = type;
                    this.$root.$data.control_close = false;
                    this.$root.$data.page_info = "客户服务";
                    this.$root.$data.qustion_type = num;
                })
            }
        },
        ready:function(){
            var un = this.$root.$data.userName;
            var rn = this.$root.$data.parsenName;
            var tk = this.$root.$data.token;
            this.$http.post(QUESTION_TYPE_API,{
                RoleName:rn,
                Token:tk
            }).then(function(response){
                this.question_type = response.data.Value;
            })
            this.$http.post(QUESTION_TYPE1_API,{
                RoleName:rn,
                Token:tk
            }).then(function(response){
                this.question_type1 = response.data.Value;
                console.log(response.data.Value)
            })
        }
    }
</script>
