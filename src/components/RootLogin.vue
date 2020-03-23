<template>
  <div class="login">
    <el-form
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm login-container"
    >
      <h4 class="title">用户登录</h4>
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
      <el-form-item class="contain">
        <el-button type="info" style="width:100%;" @click="login"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: "",
      pass: ""
    };
  },

  methods: {
    login(formName) {
      this.$http
        .post(
          this.backendIP + "/api/root_login",
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
            this.$router.push({ path: "/ku" });
            location.reload();
          } else {
            alert("登录失败");
          }
        });
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
