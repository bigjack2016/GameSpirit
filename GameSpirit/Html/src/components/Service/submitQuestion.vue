<template>
    <ul class="submit_question_container">
        <li class="sq_li-text">手机号码（选填）</li>
        <li class="sq_li-telNumber sq_li-input"><input type="tel" name="telphone" v-model="telNumber"/></li>
        <li class="sq_li-text">遇到的问题（<span>必填</span>）</li>
        <li class="sq_li-telNumber sq_li-input">
            <textarea v-model="question_container">

            </textarea>
        </li>
        <li class="sq_li-upload sq_li-input" >

            <label><input type="file" hidden @change="uploadHandler($event)" multiple name="imgFile" id="imgFile"><span>上传截图（选填）</span></label>

            <div v-if="isUploadPic" class="upload_pic_view">
                <div v-for="(index,item) in uploadPicArr" class="uploadPic_box">
                    <img  :src="item" style="float:left" class="uploadPic"/>
                    <strong @click="removePic(index)"></strong>
                </div>
            </div>
        </li>
    </ul>
    <button class="sq_button-submit" @click="submitQuestion">提交</button>
</template>
<style lang='sass'>
    @import './../../../static/scss/function.scss';
    .submit_question_container{
        .sq_li-text{
            height:px2em(70px);
            line-height:px2em(70px);
            font-size:px2em(30px);
            text-indent:px2em(16px);
            span{
                color:#be3333;
            }
        }
        .sq_li-input{
            width:100%;
            min-height:px2em(70px);
            border:2px solid $borderColor;
            border-radius:px2em(25px);
            background:rgba(0,0,0,0.3);
            input{
                color:#fff;
                height:px2em(68px);
                width:90%;
                text-indent:20px;
                border:none;
                background:none;
                outline:none;
            }
            textarea{
                width:95%;
                margin:px2em(10px) 0 0 2%;
                height:120px;
                text-indent:none;
                resize:none;
                background:none;
                border:none;
                outline:none;
                color:#fff;

            }
        }
        .sq_li-upload{
            margin-top:px2em(20px);
            width:100%;
            span{
                display:block;
                height:px2em(45px);
                background:url('./../../../static/images/add_pic.png') no-repeat left center;
                text-indent:px2em(60px);
                line-height:px2em(45px);
                background-size:px2em(45px) px2em(45px);
                margin:px2em(12px) 0 0 px2em(20px);
            }
            .upload_pic_view{
                padding:px2em(20px) px2em(20px);
                overflow:hidden;
            }
            .uploadPic{
                max-width:px2em(300px);
                max-height:px2em(300px);
            }
            .uploadPic_box{
                margin-right:px2em(30px);

                float:left;
                position:relative;
                strong{
                    position:absolute;
                    top:px2em(5px);
                    right:px2em(5px);
                    width:px2em(30px);
                    height:px2em(30px);
                    background:url('./../../../static/images/close.png') no-repeat center;
                    background-size:px2em(30px) px2em(30px);
                }
            }
        }
    }
    .sq_button-submit{
        margin:px2em(20px) 0 px2em(20px) 0;
        width:px2em(240px);
        height:px2en(36px);
        line-height:px2em(36px);
        background:#3f2c6d;
        text-align:center;
        color:#fff;
        border:none;
        outline:none;
        border-radius:px2em(30px);
        margin-left:50%;
        position:relative;
        left:px2em(-120px);
    }
</style>
<script>
    const PIC_UPLOAD = "http://66.ourgame.com/GameSpirit/Complex/ImgUpload";
    const CONTAINER_UP = "http://66.ourgame.com/GameSpirit/ServiceRecord/AddServiceRecordClient";
    export default{
        data(){
            return{
                msg:'hello vue',
                uploadPicArr:[],
                telNumber:"",
                question_container:""

            }
        },
        computed:{
            isUploadPic:function(){
                var result = false
                if(this.uploadPicArr.length > 0){
                    result = true;
                }
                return result;
            }
        },
        methods:{
            removePic:function(index){
                this.uploadPicArr.splice(index,1);

            },
            submitQuestion:function(){
                var count = 0;  //计量图片上传到第几张
                var pic_url = ""; //存储图片路径，§开始   €结尾
                var arr_ = this.uploadPicArr;  //获取用户选择图片的路径
                var that = this;
                var Kid = this.$root.$data.qustion_type; //用户提交问题的问题类型
                var un = this.$root.$data.userName; //用户名
                var rn = this.$root.$data.parsenName; //用户角色名
                var tk = this.$root.$data.token;
                var telNumber = parseInt(this.telNumber);
                var questionContainer = this.question_container;
                var that = this;
                if(!telNumber){
                    telNumber = null;
                }
                if(!questionContainer){
                    questionContainer = null;
                }
                var p = /^1[3,4,5,7,8]\d{9}$/ //手机号正则验证
                if(telNumber && !p.test(telNumber)){
                    this.$root.$data.IsAlert = true;
                    this.$root.$data.Alert_info = "请输入正确的手机号";
                    return false;
                }

                //图片上传到图片服务器
                if(arr_.length > 0 && questionContainer){
                    for(var i = 0;i<arr_.length;i++){
                        imgHandler(arr_[i]);
                    }
                }else if(questionContainer && arr_.length === 0){
                    that.$http.post(CONTAINER_UP,{
                        TypeId:Kid,
                        AccountName:un,
                        RoleName:rn,
                        Phone:telNumber,
                        Content:questionContainer + pic_url,
                        IsReply:false,
                        IsSolve:false,
                        Token:tk
                    }).then(function(response){
                        if(response.data.Value){
                            that.$root.$data.IsAlert = true;
                            that.$root.$data.Alert_info = "提交成功";
                        }else{
                            that.$root.$data.IsAlert = true;
                            that.$root.$data.Alert_info = "提交问题失败，请稍后重试";
                        }
                        that.$parent.$data.service_cNumber = "default_component";
                    })
                }else{
                    this.$root.$data.IsAlert = true;
                    this.$root.$data.Alert_info = "内容不能为空";
                }
                function imgHandler(img){
                    var image = new Image();
                    image.src = img;
                    image.onload = function(){
                        var imgData = getBase64Image(image);
                        that.$http.post(PIC_UPLOAD,{Base64:imgData,extension:"png",RoleName:rn,Token:tk}).then(function(response){  //将图片上传到图片服务器中，获取图片路径
                            console.log(response);
                            pic_url += "§" + response.data +"€";

                            count++;
                            if(count === arr_.length){ //保证所有图片上传完成
                                //在这向后台提交数据
                                console.log(pic_url);
                                that.$http.post(CONTAINER_UP,{
                                    TypeId:Kid,
                                    AccountName:un,
                                    RoleName:rn,
                                    Phone:telNumber,
                                    Content:questionContainer + pic_url,
                                    IsReply:false,
                                    IsSolve:false,
                                    Token:tk
                                }).then(function(response){
                                    if(response.data.Value){
                                        that.$root.$data.IsAlert = true;
                                        that.$root.$data.Alert_info = "提交成功";
                                    }else{
                                        that.$root.$data.IsAlert = true;
                                        that.$root.$data.Alert_info = "提交问题失败，请稍后重试";
                                    }
                                    that.$parent.$data.service_cNumber = "default_component";
                                })
                            }
                        })
                    }
                }

                // 将图片转换为base64
                function getBase64Image(img) {
                    var canvas = document.createElement("canvas");
                    var width = img.width;
                    var height = img.height;
                    // calculate the width and height, constraining the proportions
                    if (width > height) {
                        if (width > 100) {
                            height = Math.round(height *= 100 / width);
                            width = 100;
                        }
                    } else {
                        if (height > 100) {
                            width = Math.round(width *= 100 / height);
                            height = 100;
                        }
                    }
                    canvas.width = width;   /*设置新的图片的宽度*/
                    canvas.height = height; /*设置新的图片的长度*/
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height); /*绘图*/
                    var dataURL = canvas.toDataURL("image/png", 0.8);
                    var result = dataURL.replace("data:image/png;base64,", "");
                    //var result = dataURL
                    return result;
                }
            },
            uploadHandler:function(event){
                const MAX_PIC = 3; //允许最多上传图片数量为3
                var input = event.target;
                var files = input.files;
                var arr = this.uploadPicArr;
                var length = MAX_PIC - arr.length;

                if(files.length > length){
                    that.$root.$data.IsAlert = true;
                    that.$root.$data.Alert_info = "图片数量上限为三张";
                    length = MAX_PIC - arr.length;
                }
                for(var i = 0;i<length;i++){
                    var objURL = getObjectURL(files[i]);
                }
                this.uploadPicArr = arr;
                //将图片渲染到页面中


                // 获取图片的路径
                function getObjectURL(file) {
                    var url = null;
                    if (window.createObjectURL != undefined) { // basic
                        url = window.createObjectURL(file);
                    } else if (window.URL != undefined) { // mozilla(firefox)
                        url = window.URL.createObjectURL(file);
                    } else if (window.webkitURL != undefined) { // webkit or chrome
                        url = window.webkitURL.createObjectURL(file);
                    }
                    arr.push(url);
                    return url;
                }
            }
        }
    }
</script>
