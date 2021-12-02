<template>
  <el-row type="flex" justify="center">
    <div class="dialogue">
      <el-row
        type="flex"
        justify="center"
        style="
          height: 28px;
          margin: 45px;
          font-family: Roboto;
          font-style: normal;
          font-weight: bold;
          font-size: 24px;
          line-height: 28px;
          display: flex;
          align-items: flex-end;
          color: #3e89e0;
        "
        >AI-lab用户注册</el-row
      >
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0px;
          position: absolute;
          width: 420px;
          height: 542px;
          left: 42px;
          top: 98px;
        "
      >
        <!-- 用户名 -->
        <div class="input">
          <p class="text">用户名</p>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 0px;
              position: static;
              width: 420px;
              height: 44px;
              left: 0px;
              top: 23px;
            "
          >
            <el-input
              v-model="username"
              placeholder="请设置用户名"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                position: static;
                width: 225px;
                height: 44px;
                left: 0px;
                top: 0px;
                background: #eff1f3;
                border-radius: 6px;
                flex: none;
                order: 0;
                flex-grow: 0;
              "
            ></el-input>
            <div
              style="
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 10px 16px;
                position: static;
                width: 187px;
                height: 44px;
                left: 233px;
                top: 0px;
                background: #f4eaea;
                border-radius: 6px;
                flex: none;
                order: 1;
                flex-grow: 0;
                margin: 0px 8px;
              "
            >
              <el-icon
                style="font-size: 20px; line-height: 24px; color: red"
                class="el-icon-warning"
              ></el-icon>
              <p
                style="
                  position: static;
                  width: 146px;
                  height: 20px;
                  left: 44px;
                  top: 10px;
                  font-family: Roboto;
                  font-style: normal;
                  font-weight: normal;
                  font-size: 12px;
                  line-height: 19px;
                  display: flex;
                  align-items: center;
                  color: rgba(98, 38, 38, 0.85);
                  padding-left: 10px;
                  padding-right: 10px;
                "
              >
                用户名只能由英文，数字和下划线组成
              </p>
            </div>
          </div>
        </div>
        <!-- 密码 -->
        <div class="input">
          <p class="text">密码</p>
          <el-input
            v-model="password"
            placeholder="请设置密码"
            style="width: 420px"
            show-password
          >
          </el-input>
        </div>
        <!-- 确认密码 -->
        <div class="input">
          <p class="text">确认密码</p>
          <el-input
            v-model="repeat_password"
            placeholder="请再次输入密码"
            style="width: 420px"
            show-password
          >
          </el-input>
        </div>
        <!-- 邮箱 -->
        <div class="input">
          <p class="text">
            邮箱<span
              v-if="SendCode"
              style="
                display: inline-block;
                margin-left: 120px;
                font-size: 10px;
                font-weight: bold;
              "
            >
              验证码已发送至您的邮箱，请于30分钟内填写
            </span>
          </p>
          <div
            style="
              display: flex;
              flex-direction: row;
              align-items: flex-start;
              padding: 0px;
              position: static;
              width: 420px;
              height: 44px;
              left: 0px;
              top: 23px;
              flex: none;
              order: 1;
              flex-grow: 0;
              margin: 4px 0px;
            "
          >
            <el-input
              v-model="mail"
              placeholder="建议填写国内邮箱"
              style="
                display: flex;
                flex-direction: row;
                align-items: center;
                position: static;
                width: 282px;
                height: 44px;
                left: 0px;
                top: 0px;
                background: #eff1f3;
                border-radius: 6px;
                flex: none;
                order: 0;
                flex-grow: 0;
              "
            >
            </el-input>
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                padding: 12px 24px;
                position: static;
                width: 126px;
                height: 44px;
                left: 324px;
                top: 0px;
                margin: 0px 12px;
              "
            >
              <!-- <p
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: flex-start;
                  padding: 10px 16px;
                  position: static;
                  height: 44px;
                  left: 233px;
                  top: 0px;
                  background: #f1f7fd;
                  border: 1px solid #66aae9;
                  border-radius: 6px;
                  flex: none;
                  order: 1;
                  flex-grow: 0;
                  margin: 0px 8px;
                  color: #447aab;
                  line-height: 22px;
                "
                @click="SendCaptcha"
              >
                发送验证码
              </p> -->
              <el-button
                v-if="!SendCode"
                type="primary"
                class="SendButton"
                @click="SendCaptcha"
                ><span style="font-family: Sarasa Gothic SC; color: #447aab"
                  >发送验证码</span
                ></el-button
              >
              <el-button v-else disabled class="SendButton"
                ><span style="font-family: Sarasa Gothic SC; color: #447aab"
                  >重新发送({{ resend_cntdown }}s)</span
                ></el-button
              >
            </div>
          </div>
        </div>
        <!-- 验证码 -->
        <div class="input">
          <p class="text">验证码</p>
          <el-input
            v-model="captcha"
            placeholder="请填写邮箱中的七位验证码"
            style="width: 420px"
          >
          </el-input>
        </div>
        <!-- 手机号码 -->
        <div class="input">
          <p class="text">手机号码</p>
          <el-input
            v-model="phone"
            placeholder="请输入手机号码"
            style="width: 420px"
          >
          </el-input>
        </div>
      </div>
      <!-- 复选框 -->
      <div class="checkbox">
        <el-checkbox
          v-model="checked"
          style="zoom: 150%; padding-left: 0"
        ></el-checkbox>
        <span
          style="
            position: static;
            width: 320px;
            left: 20px;
            padding-top: 3px;
            font-family: Roboto;
            font-size: 16px;
            color: #535353;
            flex: none;
            order: 1;
            flex-grow: 0;
            margin: 0px 2px;
          "
          >我已阅读并同意<el-link @click="goToService"
            ><b>《服务协议》</b></el-link
          >和<el-link @click="goToPrivacy"><b>《隐私政策》</b></el-link>
        </span>
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0px;
          position: absolute;
          width: 420px;
          height: 44px;
          left: 42px;
          top: 701px;
          background: #ffffff;
        "
      >
        <el-button
          type="primary"
          class="RegisterButton"
          :disabled="!checked"
          @click="Register"
          ><span style="font-family: Roboto; font-weight: bold; color: white"
            >注册</span
          ></el-button
        >
        <div style="padding-left: 12px">
          已有帐户？<el-link @click="goToLogin">点击登录</el-link>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import { commonAjax } from "@/common/utils/ajax";
import sha1 from "sha1";

export default {
  name: "AILabLogin",
  components: {},
  data() {
    return {
      // 是否选择同意《服务协议》
      checked: false,
      username: "",
      password: "",
      repeat_password: "",
      mail: "",
      captcha: "",
      phone: "",
      // 是否已经发送出去验证码
      SendCode: false,
      // 验证码重发倒计时
      resend_cntdown: 10,
    };
  },
  watch: {
    username(val) {
      var reg = /(_|[a-z]|[A-Z]|[0-9])*/;
      return reg.test(val);
    },
  },
  methods: {
    ToTop() {
      window.scrollTo(0, 0);
    },
    goToService() {
      this.$router.push({
        path: "/PublicPlatform/AILabServiceAgreement",
      });
      this.ToTop();
    },
    goToPrivacy() {
      this.$router.push({
        path: "/PublicPlatform/AILabPrivacyPolicy",
      });
      this.ToTop();
    },
    goToLogin() {
      this.$router.push({
        path: "/PublicPlatform/AILablogin",
      });
      this.ToTop();
    },
    SendCaptcha() {
      var emreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      if (this.username == "") {
        this.$message({
          showClose: true,
          message: "请输入用户名",
          type: "error",
        });
      } else if (this.mail == "") {
        this.$message({
          showClose: true,
          message: "请输入邮箱",
          type: "error",
        });
      } else if (emreg.test(this.mail) == false) {
        // 测试邮箱地址是否合法
        this.$message({
          showClose: true,
          message: "请输入正确的邮箱地址",
          type: "error",
        });
      } else {
        commonAjax(
          "https://ailab-api-275-production.env.bdaa.pro/v1/signup/captcha",
          {
            user_name: this.username,
            mail: this.mail,
          }
        ).then((data) => {
          console.log("SendCaptcha", data);
          if (data.success) {
            this.SendCode = true;
            this.resend_cntdown = 30;
            this.timer = setInterval(() => {
              this.resend_cntdown--;
            }, 1000);
            setTimeout(() => {
              this.SendCode = false;
              clearInterval(this.timer);
            }, 10000);
          } else {
            if (data.errMsg.slice(0, 4) == "Mail") {
              this.$message({
                showClose: true,
                message: "该邮箱已被注册",
                type: "error",
              });
            } else if (data.errMsg.slice(0, 4) == "User") {
              this.$message({
                showClose: true,
                message: "该用户名已被注册",
                type: "error",
              });
            }
          }
        });
      }
    },
    Register() {
      if (this.password != this.repeat_password) {
        this.$message({
          showClose: true,
          message: "两次输入的密码不相同",
          type: "error",
        });
      } else if (this.username == "") {
        this.$message({
          showClose: true,
          message: "请输入用户名",
          type: "error",
        });
      } else if (this.password == "") {
        this.$message({
          showClose: true,
          message: "请输入密码",
          type: "error",
        });
      } else if (this.mail == "") {
        this.$message({
          showClose: true,
          message: "请输入邮箱",
          type: "error",
        });
      } else if (this.captcha == "") {
        this.$message({
          showClose: true,
          message: "请输入验证码",
          type: "error",
        });
      } else {
        commonAjax(
          "https://ailab-api-275-production.env.bdaa.pro/v1/signup/signup",
          {
            user_name: this.username,
            password: sha1(this.password),
            mail: this.mail,
            captcha: this.captcha,
          }
        ).then((data) => {
          console.log("Register", data);
          if (data.success) {
            this.$message({
              showClose: true,
              message: "注册成功，3s后将跳转至登录界面",
              type: "success",
            });
            setTimeout(() => {
              this.goToLogin();
            }, 3000);
          } else {
            console.log(data.errMsg);
            this.$message({
              showClose: true,
              message: "注册失败，请尝试其他用户名",
              type: "error",
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.dialogue {
  position: relative;
  width: 504px;
  height: 790px;
  margin-top: 55px;
  margin-bottom: 55px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;
  box-shadow: 0px 6px 36px rgba(59, 72, 83, 0.16);
  border-radius: 8px;
}

.checkbox {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  position: absolute;
  width: 336px;
  height: 19px;
  left: 42px;
  top: 661px;
}
.input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  position: static;
  width: 420px;
  height: 67px;
  left: 0px;
  top: 0px;
  margin-bottom: 28px;
}

.text {
  float: left;
  height: 19px;
  font-family: Roboto;
  font-size: 16px;
  line-height: 19px;
}

.el-input ::v-deep .el-input__inner {
  width: 420px;
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

.RegisterButton {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10.5px 42px;
  position: static;
  width: 144px;
  height: 44px;
  left: 0px;
  top: 0px;
  /* background: #3e89e0; */
  border-radius: 6px;
}

.SendButton {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;

  position: static;
  width: 96px;
  height: 44px;
  left: 324px;
  top: 0px;

  background: #f1f7fd;
  /* border: 1px solid #66aae9;
  box-sizing: border-box;
  border-radius: 6px; */
}
</style>