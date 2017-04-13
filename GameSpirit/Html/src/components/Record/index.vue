<template>
    <div id="record" class="wapper">
        <div v-if="!control">
            <div class="record_title"><span v-if="total_question !== 0">共{{total_question}}个问题，已解决{{total_response}}个问题</span><span v-else>你还未提问，快去提个问题吧</span></div>
            <div class="components_container">
                <div v-for="(index,item) in user_Record" class="record_response" :class="item.IsReply?'record_response_yes':'record_response_no'" @click="record_info(item,index)">
                    <span>{{item.Content}}</span><br />
                    <em>{{item.CreateDate | deal_Date}}</em>
                    <strong id="read_dot" v-if="item.IsRead  === false"></strong>
                </div>
            </div>
        </div>
        <div v-if="control" style="color:#fff" class="components_container">
            <div class="question_title question">{{{deal_content}}}</div>
            <div class="question_answer question" v-if="Reply">{{{question_object.Value2.Content}}}</div>
            <img />
            <div class="question_response" v-if="question_object.Value1.IsSolve === null">
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
<style lang="sass">
    @import './../../../static/scss/function.scss';
    #record{
        color:#fff;
        .record_title{
            height:px2em(60px);
            width:100%;
            font-size:px2em(24px);
            line-height:px2em(60px);
            background:url('./../../../static/images/mengban_2.png') no-repeat;
            background-size:cover;
            text-align:center;
        }
        .record_response{
            position:relative;
            margin-top:px2em(20px);
            padding:px2em(10px) px2em(20px);
            border:2px solid #3b405a;
            border-radius:px2em(30px);
            span{
                font-size:px2em(24px);
            }
            em{
                color:#33374e;
                font-size:px2em(20px);
            }
        }
        .record_response_no{
            background:url('./../../../static/images/question_no.png') 97% center no-repeat rgba(0,0,0,0.2);
            background-size:px2em(50px) px2em(50px);
        }
        .record_response_yes{
            background:url('./../../../static/images/question_yes.png') 97% center no-repeat rgba(0,0,0,0.2);
            background-size:px2em(50px) px2em(50px);
        }
        .question_title{
            position:relative;
            margin-top:px2em(30px);
            background:url('./../../../static/images/question_title.png') left px2em(2px) no-repeat;
        }
        .question_answer{
            margin-top:px2em(14px);
            background:url('./../../../static/images/question_answer.png') left px2em(2px) no-repeat;
            img{
                max-width:80%;
            }
        }
        .question{
            min-height:px2em(50px);
            text-indent:px2em(60px);
            background-size:px2em(48px) px2em(48px);
            line-height:px2em(50px);
            font-size:px2em(18px);
        }
        .response_img{
            margin:15px;
        }
        .question_response{
            position:relative;
            top:px2em(30px);
            width:100%;
            height:px2em(110px);
            background:url('./../../../static/images/mengban_2.png') center no-repeat;
            background-size:cover;
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
    const USER_RECORD = "http://66.ourgame.com/GameSpirit/ServiceRecord/GetServiceRecordNewsletter";
    const QUSTION_RECORD = "http://66.ourgame.com/GameSpirit/ServiceRecord/GetServiceRecordKId";
    const USER_RESPONSE = "http://66.ourgame.com/GameSpirit/ServiceRecord/UpdataSolveState";
    const USER_READY = "http://66.ourgame.com/GameSpirit/ServiceRecord/UpdataReadState";
    const TOTAL_ISREAD = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/GetReadInfoTotal";
    export default{
        data(){
            return{
                msg:'hello vue',
                total_question:0,
                total_response:0,
                requstion:false,
                control:false,
                control_feedback:false,
                question_object:{},
                user_Record:[],
                Reply:false,
                Solve:null
            }
        },
        computed:{
            className_computed:function(){
                var cl = '';
                if(this.requstion){
                    cl = 'record_response_yes';
                }else{
                    cl = 'record_response_no';
                }
                return cl;
            },
            deal_content:function(){
                if(this.question_object.Value1.Content){
                    var arr = this.question_object.Value1.Content.split("§");
                    arr[0] += "<br />";
                    var str = arr.join("§");
                    str = str.replace(/§/g,"<img class='response_img' src='").replace(/€/g,"'/>");
                    return str;
                }
            }

        },
        methods:{
            record_info:function(object,index){
                var num = object.KId;
                var isReply = object.IsReply;
                console.log(object);
                var isRead = object.IsRead;
                var un = this.$root.$data.userName;
                var rn = this.$root.$data.parsenName;
                var tk = this.$root.$data.token;
                this.$http.post(QUSTION_RECORD,{
                    KId:num,
                    AccountName:null,
                    RoleName:rn,
                    Token:tk
                }).then(function(response){
                    var Data = response.data;
                    if(Data.Value){
                        this.question_object = Data.Value;
                        this.Reply = object.IsReply;
                        this.Solve = object.IsSolve;
                        this.$root.$data.control_close = false;
                        this.$root.$data.page_info = "服务记录";
                        this.control = true;
                    }else{
                        alert("获取数据失败，请稍后再试")
                    }

                })
                if(!isRead){
                    this.user_Record[index].IsRead = true;
                    this.$http.post(USER_READY,{
                        AccountName:un,
                        KId:num,
                        RoleName:rn,
                        Token:tk
                    }).then(function(response){
                        this.$http.post(TOTAL_ISREAD,{
                            AccountName:un,
                            RoleName:rn,
                            Token:tk
                        }).then(function(response){
                            this.$root.$data.total_IsRead = response.data.Value;
                            console.log(response.data.Value);
                        })
                    })

                }
            },
            response:function(type){
                var un = this.$root.$data.userName;
                var rn = this.$root.$data.parsenName;
                var tk = this.$root.$data.token;
                var id = this.question_object.Value1.KId;
                var an = this.question_object.Value1.AccountName;
                console.log("{KId:" + id + "/AccountName:" + an + "/RoleName:" + rn + "/Token:" + tk + "/IsSolve:" + type + "}");
                this.$http.post(USER_RESPONSE,{
                    IsSolve:type,
                    KId:id,
                    AccountName:an,
                    RoleName:rn,
                    Token:tk
                }).then(function(response){
                    console.log(response.data);
                    this.control_feedback = true;
                })

            }
        },
        filters:{
            deal_Date:function(val){
                return val.replace("T"," ");
            }
        },
        ready:function(){
            var un = this.$root.$data.userName;
            var rn = this.$root.$data.parsenName;
            var tk = this.$root.$data.token;
            this.$root.$data.record = 3; //控制根组件的record的值，以达到改变导航类名的作用
            this.$http.post(USER_RECORD,{
                KId:null,
                AccountName:un,
                RoleName:rn,
                Token:tk
            }).then(function(response){
                var Data = response.data.Value;
                console.log(Data);
                if(Data.length > 0){
                    this.total_question = Data.length;
                    this.user_Record = Data;

                    // 计算有多少个问题被回复
                    var count = 0;
                    for(var i = 0;i<Data.length;i++){
                        if(Data[i].IsReply){
                            count ++;
                        }
                    }
                    this.total_response = count;
                }
            })
        }
    }
</script>
