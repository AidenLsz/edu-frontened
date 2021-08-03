<template>
  <!-- 登录 -->
  <el-dialog :visible="$store.getters.loginDialog.opened"
    width="70%" @close="hide()" @opened="draw()"
    :show-close="isLuna"
    :close-on-click-modal="isLuna"
    :close-on-press-escape="isLuna"
    @open="draw()"
    >
    <el-row>
      <el-col :span="10" :offset="2">
        <el-row>
          <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
            欢迎使用
            <template v-if="isLuna">
              LUNA智慧教育知识图谱
            </template>
            <template v-else>
              智慧考试管理系统
            </template>
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
          <el-col v-if="isLuna" :span="6" :offset="3">
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
import {commonAjax} from "@/common/utils/ajax";
export default {
  components: { vueImgVerify },
  data(){
    return {
      account:"",
      password:"",
      verifyCode:"",
      imgCode: "",
    }
  },
  computed: {
    isLuna() {
      return this.$store.getters.isLuna;
    },

  },
  methods:{
    show(){
      this.$store.dispatch('app/openLoginDialog')
    },
    draw(){
      this.$refs.vueImgVerify.handleDraw();
    },
    hide(){
      this.$store.dispatch('app/closeLoginDialog')
      this.account = "";
      this.password = "";
      this.imgCode = "";
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
        console.log(1,this.verifyCode.toUpperCase(),2,this.imgCode.toUpperCase());
        alert("验证码错误");
        return;
      }
      // console.log(md5(this.password))
      commonAjax(this.backendIP + "/api/login",{
        username: this.account,
        // password: md5(this.password)
        password: this.password
      }).then((data)=>{
        let userInfo={
          token:data.access_token,
          name:this.account,
          // isAdmin:data.body.isAdmin,
        }
        this.$store.dispatch('user/setUserData', userInfo).then(() => {
          this.$router.go()
          this.hide()
        })
      }).catch((err)=>{
        if(err&&err.response&&err.response.status==401){
          this.$message.error('用户名或密码不正确！')
        }else {
          this.$message.error('网络或服务器发生错误！')
        }
      })
    },
    getImgCode(code) {
      this.imgCode = code;
    },

  }
}
</script>

<style lang="css" scoped>
</style>
