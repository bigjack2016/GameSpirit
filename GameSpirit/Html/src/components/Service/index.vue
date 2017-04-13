<template>
    <div id="service" class="wapper">
        <div class="components_container service-container">
            <component :is='service_cNumber'></components>
        </div>
    </div>
</template>
<style lang='sass'>
    @import './../../../static/scss/function.scss';
    #service{
        color:#fff;
        .service-container{
            padding-top:px2em(60px);
        }
    }
</style>
<script>
    import CommonPorblem from './commonProblem.vue';
    import SubmitQuestion from './submitQuestion.vue';
    import DefaultComponent from './defaultComponent.vue';
    export default{
        data(){
            return {
                msg:111,
                common_data:{},
                service_cNumber:'default_component'
            }
        },
        components:{
            'common_problem':CommonPorblem,
            'submit_question':SubmitQuestion,
            'default_component':DefaultComponent
        },
        ready:function(){
            this.$root.$data.record = 2; //控制根组件的record的值，以达到改变导航类名的作用
        }
    }
</script>
