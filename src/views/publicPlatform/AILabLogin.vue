<template>
  <el-row type="flex" justify="center">
    <div class="dialogue">
      <el-row class="title"> LUNA-AI </el-row>
      <div class="input-box">
        <div class="username-input">
          <p class="text">用户名</p>
          <el-input
            v-model="username"
            placeholder="请输入用户名或手机号"
          ></el-input>
        </div>
        <div class="password-input">
          <p class="text">密码</p>
          <el-input
            v-model="password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </div>
      </div>
      <div class="button-box">
        <el-button type="primary" class="LoginButton" @click="Login"
          ><span style="font-family: Roboto; font-weight: bold; color: white"
            >登录</span
          ></el-button
        >
        <div class="text_forget">忘记密码?</div>
        <el-button type="text" class="Register" @click="goToRegister"
          ><span style="font-family: Roboto; font-weight: bold; color: #3e89e0"
            >新用户注册</span
          ></el-button
        >
      </div>
    </div>
  </el-row>
</template>

<script>
import { commonAjax } from "@/common/utils/ajax";
import sha1 from "sha1"

export default {
  name: "AILabLogin",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    ToTop() {
      window.scrollTo(0, 0);
    },
    goToRegister() {
      this.$router.push({
        path: "/PublicPlatform/AILabRegister",
      });
      this.ToTop();
    },
    Login() {
      commonAjax(
        "https://ailab-api-275-production.env.bdaa.pro/v1/user/login",
        {
          user_name: this.username,
          password: sha1(this.password),
        }
      ).then((data) => {
        console.log("login", data);
      });
    },
  },
};
</script>


<style scoped>
.dialogue {
  position: absolute;
  width: 444px;
  height: 386px;
  top: 180px;

  background: #ffffff;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;
  box-shadow: 0px 6px 36px rgba(59, 72, 83, 0.16);
  border-radius: 8px;
}

.title {
  position: absolute;
  height: 28px;
  left: 170px;
  top: 42px;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  display: flex;
  align-items: flex-end;

  color: #566b94;
}

.input-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  position: absolute;
  width: 360px;
  height: 199px;
  left: 42px;
  top: 102px;
}

.username-input,
.password-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;

  position: static;
  width: 360px;
  height: 67px;
  left: 0px;
  top: 0px;
  margin-bottom: 32px;
}

.text {
  position: static;
  width: 48px;
  height: 19px;
  left: 0px;
  top: 0px;

  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #353739;

  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 4px 0px;
}

.el-input ::v-deep .el-input__inner {
  width: 360px;
  height: 44px;
  left: 0px;
  top: 23px;

  background: #eff1f3;
  border-radius: 6px;
}

.el-input ::v-deep input::-webkit-input-placeholder {
  position: static;
  height: 19px;
  left: 16px;
  top: 12.5px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: rgba(75, 79, 82, 0.4);

  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 10px;
}

.button-box {
  position: absolute;
  width: 360px;
  height: 44px;
  left: 42px;
  top: 300px;
}

.LoginButton {
  position: absolute;
  width: 115px;
  height: 44px;
  left: 0px;
  top: 0px;

  background: #3e89e0;
  border-radius: 6px;
}

.text_forget {
  position: absolute;
  width: 72px;
  height: 19px;
  left: 131px;
  top: 13px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  /* identical to box height */

  color: #535353;
}

.Register {
  position: absolute;
  width: 123px;
  height: 44px;
  left: 237px;
  top: 0px;

  background: #f1f7fd;
  border: 2px solid #3e89e0;
  box-sizing: border-box;
  border-radius: 6px;
}
</style>