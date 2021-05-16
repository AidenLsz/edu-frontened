<template lang="html">
  <!-- 注册 -->
  <el-dialog :visible.sync="visible"  width="70%" style="margin-top: -13vh;">
    <el-row>
      <el-col :span="10" :offset="2">
        <el-row>
          <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
            欢迎使用LUNA智慧教育知识图谱
          </span>
        </el-row>
        <!-- <el-row style="margin: 50px 0px 20px 0px;">
          <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
            <span style="font-weight: bold">账号</span>
          </el-col>
          <el-col :span="18" :offset="1">
            <el-input
              type="text"
              v-model="account_reg"
              auto-complete="off"
              placeholder="请输入账号名称"
            ></el-input>
          </el-col>
        </el-row> -->
        <el-form :model="ruleForm" status-icon :rules="rules" :ref="formName" label-position="left" label-width="80px" class="demo-ruleForm"
        style="margin-top:50px">
          <el-form-item label="账号"  prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              auto-complete="off"
              placeholder="请输入账号名称"
            />
          </el-form-item>
          <el-form-item label="密码"  prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input
              type="text"
              v-model="ruleForm.email"
              auto-complete="off"
              placeholder="请输入您的邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input
              type="text"
              v-model="ruleForm.phone"
              auto-complete="off"
              placeholder="请输入您的手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="" label-width="0px" prop="imgCode">
            <el-col :span="15">
              <el-input
                type="text"
                v-model="ruleForm.imgCode"
                auto-complete="off"
                placeholder="请输入图片验证码"
              ></el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-row type="flex" justify="end" >
                <vue-img-verify @getImgCode="getimgCodeOrigin" ref="vueImgVerify"/>
              </el-row>
            </el-col>
          </el-form-item>
          <el-form-item label="" label-width="0px" prop="phoneCode">
            <el-col :span="15">
              <el-input type="text" maxlength="6" suffix-icon="el-icon-lock" placeholder="请输入手机验证码" v-model="ruleForm.phoneCode"/>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-row type="flex" justify="end" >
                <el-button class="btn-orange" :disabled="disabled" @click="getPhoneCode">{{valiBtn}}</el-button>
              </el-row>
            </el-col>
          </el-form-item>
        </el-form>
        <el-row style="margin: 20px 0px">
          <el-button type="primary" @click="register()" >注册新用户</el-button>
        </el-row>
      </el-col>
      <el-col :span="12" style="padding-top: 12vh">
        <img src="@/assets/login.png" width="350vh" height="350vh"/>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import vueImgVerify from "@/common/components/vue-img-verify.vue";
import axios from 'axios'
import {commonAjax} from "@/common/utils/ajax";
import {Message } from 'element-ui'
// import md5 from 'js-md5'
// import qs from 'qs'
export default {
  components: { vueImgVerify },
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs[this.formName].validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    var validateImgCode =(rule,value,callback) =>{
      if (value.toUpperCase() !== this.imgCodeOrigin.toUpperCase()) {
        callback(new Error('图片验证码错误！'));
      }else{
        callback()
      }
    }
    var validatePhoneCode =(rule,value,callback) =>{
      if (value !== this.phoneCodeOrigin) {
        callback(new Error('手机验证码错误！'));
      }else{
        callback()
      }
    }
    return {
      visible:false,
      imgCodeOrigin:"",
      phoneCodeOrigin:'',
      disabled:false,
      phoneCode:"",
      valiBtn:'获取验证码',
      formName:'loginForm',
      getPhoneCodeUrl:'https://send-message-service-166-production.env.bdaa.pro/v1',
      // getPhoneCodeUrl:'http://localhost:2025',
      ruleForm: {
        username: '',
        password: '',
        email: '',
        phone: '',
        // phone: '19916935265'
      },
      rules: {
        username:[
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: validatePass2, trigger: ['blur', 'change'] }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          { min: 11, max: 11, message: "请输入11位手机号码", trigger: "blur" },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码"
          }
        ],
        imgCode: [
          { required: true, message: '请输入图形验证码', trigger: 'blur' },
          { validator: validateImgCode, trigger: ['blur'] }
        ],
        phoneCode:[
          { required: true, message: '请输入手机验证码', trigger: 'blur' },
          // { required: false, message: '请输入手机验证码', trigger: 'blur' },
          { validator: validatePhoneCode, trigger: ['blur'] }
        ]
      }
    }
  },
  watch:{
    visible(newVal){
      if(!newVal){
        this.$refs[this.formName].resetFields();
      }
      this.visible = newVal;
    }
  },
  computed:{

  },
  methods:{
    show(){
      this.visible=true
      setTimeout(()=>{
        this.$refs.vueImgVerify.handleDraw();},
      1)
    },
    hide(){
      this.visible=false
    },
    getPhoneCode(){
       this.$refs[this.formName].validateField('phone', (err) =>{
          if(err){
              return;
          }
          this.$refs[this.formName].validateField('imgCode', (err) =>{
             if(err){
                 return;
             }
             this.tackBtn();   //验证码倒数60秒
             this.phoneCodeOrigin=this.getRandomCode(4)
             let fd ={
               'phoneNumber':['+86'+this.ruleForm.phone],
               'code':[this.phoneCodeOrigin]
             }
             // let postCfg = {
             //    headers: {'Content-Type': 'application/json;charset=UTF-8'}
             // };
             axios.post(this.getPhoneCodeUrl,
               JSON.stringify(fd),
               // qs.stringify(fd),
               // { emulateJSON: true }
             )
             .then( res => {
                 // console.log(res);
                 if (res.status==200) {
                   // let data =JSON.parse(res.data[0])
                   console.log('发送成功');
                 }
             })
          })
      })
    },
    getRandomCode(count=6){
      const arr=['0','1','2','3','4','5','6','7','8','9']
      var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min).join("")
    },
    tackBtn(){       //验证码倒数60秒
      let time = 60;
      let timer = setInterval(() => {
          if(time == 0){
              clearInterval(timer);
              this.valiBtn = '获取验证码';
              this.disabled = false;
          }else{
              this.disabled = true;
              this.valiBtn = time + '秒后重试';
              time--;
          }
      }, 1000);
    },
    register() {
      this.$refs[this.formName].validate((valid) => {
        if (!valid) {
          return false;
        }
        let fd={
          username:this.ruleForm.username,
          password:this.ruleForm.password,
          // password:md5(this.ruleForm.password),
          phone:this.ruleForm.phone,
          email:this.ruleForm.email,
        }
        commonAjax(this.backendIP + "/api/register",fd).then((data)=>{
          let userInfo={
            token:data.access_token,
            name:this.ruleForm.username,
            // isAdmin:data.body.isAdmin,
          }
          this.$store.dispatch('user/setUserData', userInfo).then(() => {
            this.$router.push("/dashboard");
            this.visible = false;
          })
        }).catch(()=>{
          Message({
            message: '注册失败！',
            type: 'error',
            duration: 5 * 1000
          })
        })
        // this.$http
        //   .post(
        //     this.backendIP + "/api/register",
        //     fd,
        //     { emulateJSON: true }
        //   )
        //   .then(function(data) {
        //     if (data.status != 200) { //eslint-disable-line
        //       alert("注册失败");
        //       return;
        //     }
        //     sessionStorage.accessToken = data.body.access_token;
        //     sessionStorage.user = this.account_reg;
        //     sessionStorage.isAdmin = true;
        //     this.visible = false;
        //     this.$router.push("/dashboard");
        //   })
        //   .catch(()=>{
        //     alert('用户名或手机号已注册！');
        //   })
      });
    },
    getimgCodeOrigin(code){
      this.imgCodeOrigin = code;
    },
  }
}
</script>

<style lang="css" scoped>
</style>
