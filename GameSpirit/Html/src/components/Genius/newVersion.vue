<template>
    <div class="newVersion_container">
        <div v-for="item in msg">
            <h2><span>{{item.KId }}</span>{{item.VersionName}}</h2>
            {{{item.VersionContent}}}</div>
    </div>
</template>
<style lang="sass">
    @import './../../../static/scss/function.scss';
    .newVersion_container{
        padding-top:px2em(68px);
        color:#fff;
        font-size:px2em(24px);
        img{
            display:block;
            margin:0 auto;
            max-width:90%;
        }
    }
</style>
<script>
    //版本先知内容接口
    const NEW_VERSION_URL = 'http://66.ourgame.com/GameSpirit/VersionTrailer/GetVersiontrailerList';
    const RESPONSE_READY_API = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/AddBulletinReadRecordClient";
    const TOTAL_ISREAD = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/GetReadInfoTotal";
    export default{
        data(){
            return{
                msg:{KId:'',VersionName:'',VersionContent:''}
            }
        },
        ready:function(){
            var un = this.$root.$data.userName;
            var rn = this.$root.$data.parsenName;
            var tk = this.$root.$data.token;
            var flag = this.$root.$data.total_IsRead.m_Item1;
            //获取版本先知内容接口的内容，将内容设置给msg变量
            this.$http.post(NEW_VERSION_URL,{
                RoleName:rn,
                Token:tk
            }).then(function(response){
                if(response.data){
                    var arr = [];
                    for(var i = 0;i<response.data.Value.length;i++){
                        arr.push(response.data.Value[i].KId);
                    }
                    this.$set('msg',response.data.Value);
                    if(!flag){
                        this.$http.post(RESPONSE_READY_API,{
                            BulletinType:1,
                            BulletinKId:arr,
                            RoleName:rn,
                            Token:tk,
                            AccountName:un
                        }).then(function(response){
                            this.$http.post(TOTAL_ISREAD,{
                                RoleName:rn,
                                Token:tk,
                                AccountName:un
                            }).then(function(response){
                              this.$root.$data.total_IsRead = response.data.Value;
                              this.$root.$children[0].$data.total_IsRead = response.data.Value;
                            })
                        })
                    }
                }
            })
        }
    }
</script>
