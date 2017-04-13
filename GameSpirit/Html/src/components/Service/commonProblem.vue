<template>
    <div>
        <dl>
            <dt>{{msg.Question}}</dt>
            <dd>{{msg.Answer}}</dd>
        </dl>
    </div>
</template>
<style>
</style>
<script>
    export default{
        data(){
            return{
                msg:{Question:'',Answer:''}
            }
        },
        ready:function(){
            this.msg = this.$parent.$data.common_data;
            console.log(this.msg)
        }
    }
</script>
