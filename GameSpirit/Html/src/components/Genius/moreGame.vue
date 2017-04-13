<template>
    <div class="moreGame_container">
        <div class="jjdl">{{msg}}</div>
    </div>
</template>
<style lang="sass">
    @import './../../../static/scss/function.scss';
    .moreGame_container{
        position:relative;
        height:100%;
        padding-top:px2em(68px);
        color:#fff;
        .jjdl{
            width:100%;
            height:px2em(40px);
            position:absolute;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin:auto;
            font-size:px2em(60px);
            text-align:center;
        }
    }
</style>
<script>
    const MOREGAME_CONTAINER_API = "http://66.ourgame.com/GameSpirit/GameList/GetSpiritGameList";
    const RESPONSE_READY_API = "http://66.ourgame.com/GameSpirit/BulletinReadRecord/AddBulletinReadRecordClient";
    export default{
        data(){
            return{
                msg:'即将到来'
            }
        },
        ready:function(){

            /*var un = this.$root.$data.userName;
            var rn = this.$root.$data.parsenName;
            var tk = this.$root.$data.token;
            if(num !== 0){
                this.$http.post(RESPONSE_READY_API,{
                    BulletinType:2,
                    RoleName:rn,
                    Token:tk
                }).then(function(response){
                    console.log(response.data);
                })
            }*/
        }
    }
</script>
