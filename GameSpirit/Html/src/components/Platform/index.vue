<template>
    <div id="platform" class="wapper">
        <div class="components_container platform-container">{{msg}}</div>
    </div>
</template>
<style lang="sass">
    @import './../../../static/scss/function.scss';
    #platform{
        position:relative;
        font-family: "微软雅黑";
        color:#fff;
        font-size:px2em(60px);
        text-align:center;
    }
    .platform-container{
        position:absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        margin:auto;
        width:100%;
        height:px2em(60px);
        line-height:px2em(60)px;
    }
</style>
<script>
    export default{
        data(){
            return{
                msg:'即将到来'
            }
        },
        ready:function(){
            this.$root.$data.record = 4; //控制根组件的record的值，以达到改变导航类名的作用
        }
    }
</script>
