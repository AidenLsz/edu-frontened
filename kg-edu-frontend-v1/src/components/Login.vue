<template>
  <div class="login">
    <el-form
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm login-container"
    >
      <h4 class="title">系统用户登录</h4>
      <el-form-item prop="account" class="contain">
        <el-input
          type="text"
          v-model="account"
          auto-complete="off"
          placeholder="账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pass" class="contain">
        <el-input
          type="password"
          v-model="pass"
          auto-complete="off"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="verifyCode" class="contain">
        <el-input
          type="text"
          v-model="verifyCode"
          auto-complete="off"
          placeholder="请输入下方验证码"
        ></el-input>
        <div style="margin-top:10px;"></div>
        <el-row>
          <el-col :span="14">
            <vue-img-verify @getImgCode="getImgCode" ref="vueImgVerify" />
          </el-col>
          <el-col :span="10">
            <p style="font-size: 12px;">(看不清？请点击图片切换)</p>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="contain">
        <el-button type="info" style="width:100%;" @click="login"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import vueImgVerify from "./vue-img-verify.vue";
export default {
  components: { vueImgVerify },
  data() {
    return {
      account: "",
      pass: "",
      imgCode: "",
      verifyCode: ""
    };
  },
  mounted() {
    this.handleClick();
  },
  methods: {
    login() {
      if (this.verifyCode === this.imgCode) {
        this.$http
          .post(
            this.backendIP + "/api/login",
            {
              user: this.account,
              password: this.pass
            },
            { emulateJSON: true }
          )
          .then(function(data) {
            console.log(data.data);
          if (data.data == 1) { //eslint-disable-line
              sessionStorage.user = this.account;
              this.$router.push("/");
              location.reload();
            } else {
              alert("登录失败");
            }
          });
      } else {
        alert("验证码错误");
      }
    },
    // 点击图片获取验证码
    getImgCode(code) {
      this.imgCode = code;
      // console.log("验证码: " + this.imgCode);
    },
    // 点击按钮获取验证码
    handleClick() {
      this.imgCode = this.$refs.vueImgVerify.draw();
      // console.log("验证码: " + this.imgCode);
    }
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 120px auto 180px auto;
  width: 450px;
  padding: 35px 35px 15px 0px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
  .title {
    margin: 0px 0px 40px 40px;
    text-align: center;
    color: #505458;
  }
  .contain {
    margin: 15px 0px 15px -60px;
  }
}
</style>
