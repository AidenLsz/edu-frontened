<template lang="html">
  <!-- 登录 -->
  <el-dialog :visible.sync="visible" width="70%">
    <el-row>
      <el-col :span="10" :offset="2">
        <el-row>
          <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
            欢迎使用LUNA智慧教育知识图谱
          </span>
        </el-row>
        <el-row style="margin: 50px 0px 30px 0px;">
          <el-input
            type="text"
            v-model="account"
            auto-complete="off"
            placeholder="账号"
          ></el-input>
        </el-row>
        <el-row style="margin: 30px 0px">
          <el-input
            type="password"
            v-model="password"
            auto-complete="off"
            placeholder="密码"
          ></el-input>
        </el-row>
        <el-row style="margin: 30px 0px">
          <el-col :span="15">
            <el-input
              type="text"
              v-model="verifyCode"
              auto-complete="off"
              placeholder="请输入验证码"
            ></el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-row type="flex" justify="end" >
              <vue-img-verify @getImgCode="getImgCode" ref="vueImgVerify" />
            </el-row>
          </el-col>
        </el-row>
        <el-row style="margin: 30px 0px">
          <el-col :span="8">
            <el-button type="primary" style="width: 8vw" round @click="login">登录</el-button>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-button type="text" style="color: #aaa">忘记密码？</el-button>
          </el-col>
          <el-col :span="6" :offset="3">
            <el-row type="flex" justify="end" >
              <el-button type="text" @click="register_show">注册新用户</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <img src="@/assets/login.png" width="350vh" height="350vh"/>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import vueImgVerify from "@/common/components/vue-img-verify.vue";
<<<<<<< HEAD
// import md5 from 'js-md5'
=======
import md5 from 'js-md5'
>>>>>>> ig
import {commonAjax} from "@/common/utils/ajax";
import {Message } from 'element-ui'
export default {
  components: { vueImgVerify },
  data(){
    return {
      account:"",
      password:"",
      verifyCode:"",
      visible:false,
      imgCode: "",
    }
  },
  watch:{
    visible(newVal){
      if(!newVal){
        this.imgCode = "";
        this.account = "";
        this.password = "";
      }
      this.visible = newVal;
    },
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
    register_show(){
      this.$emit('register_show');
    },
    login() {
      if(!this.account||!this.password){
        alert("用户名和密码不能为空");
        return;
      }
      if (this.verifyCode.toUpperCase() !== this.imgCode.toUpperCase()) {
        alert("验证码错误");
        return;
      }
      // console.log(md5(this.password))
      commonAjax(this.backendIP + "/api/login",{
        username: this.account,
<<<<<<< HEAD
        // password: md5(this.password)
        password: this.password
=======
        password: md5(this.password)
        // password: this.password
>>>>>>> ig
      }).then((data)=>{
        let userInfo={
          token:data.access_token,
          name:this.account,
          // isAdmin:data.body.isAdmin,
        }
        this.$store.dispatch('user/setUserData', userInfo).then(() => {
          this.$router.push("/dashboard");
          this.visible = false;
        })
      }).catch(()=>{
        Message({
          message: '用户名或密码不正确！',
          type: 'error',
          duration: 5 * 1000
        })
      })
      // this.$http
      //   .post(
      //     this.backendIP + "/api/login",
      //     {
      //       username: this.account,
      //       // password: md5(this.password)
      //       password: this.password
      //     },
      //     {
      //       emulateJSON: true,
      //     }
      //   )
      //   .then(function(data) {
      //     if (data.status != 200) { //eslint-disable-line
      //       alert("登录失败");
      //       return;
      //     }
      //     let userInfo={
      //       token:data.body.access_token,
      //       name:this.account,
      //       // isAdmin:data.body.isAdmin,
      //     }
      //     this.$store.dispatch('user/setUserData', userInfo).then(() => {
      //       this.$router.push("/dashboard");
      //       this.visible = false;
      //     }).catch((err) => {
      //       alert(err)
      //     })
      //   });
    },
    getImgCode(code) {
      this.imgCode = code;
    },

  }
}
</script>

<style lang="css" scoped>
</style>
