<template>
  <el-dialog
      class="usr-card"
      :visible="$store.getters.loginDialog.opened"
      @close="hide"
  >
    <h2 class="usr-title">
      LUNA 智慧教育知识图谱
    </h2>
    <el-form class="usr-form">
      <label class="usr-label">用户名</label>
      <el-input
          class="usr-input"
          v-model="account"
          ref="username"
          placeholder="用户名或手机号"
      />

      <label class="usr-label">密码</label>
      <el-input
          type="password"
          v-model="password"
          class="usr-input"
          placeholder="密码"
      />

        <label class="usr-label">验证码</label>
        <div class="usr-verification">
          <el-input
              class="usr-input"
              v-model="verifyCode"
              placeholder="验证码"
          />
          <div class="usr-verification-img">
            <vue-img-verify :ht="44" @getImgCode="getImgCode"/>
          </div>
        </div>

      <div class="usr-action">
        <el-button
            class="usr-re-pass"
            @click="forgetPwd"
            type="text"
        >忘记密码？</el-button>
        <el-button
            @click="registerNew"
            type="text"
        >新用户注册</el-button>
      </div>
      <el-button
          :class="isLogging ? 'usr-logging' : ''" :loading="isLogging"
          @click="login"
          type="info"
          class="usr-login usr-btn"
      >登录</el-button>
      </el-form>
  </el-dialog>
</template>

<script>
import vueImgVerify from "@/common/components/vue-img-verify.vue";
import { commonAjax } from "@/common/utils/ajax";

export default {
  name: 'login',
  components: { vueImgVerify },
  data() {
    return {
      account: '',
      password: '',
      verifyCode: '',
      imgCode: '',
      isLogging: false,
    };
  },
  methods: {
    show() {
      if (!window.enterCallback) {
        window.enterCallback = (e) => {
          if (e.code === 'Enter') {
            this.login();
          }
        }
        document.addEventListener('keydown', window.enterCallback);
      }
      this.$store.dispatch('app/openLoginDialog');
      setTimeout(()=>{
        this.$refs.username.focus();
      }, 250);
    },
    hide() {
      if (window.enterCallback) {
        document.removeEventListener('keydown', window.enterCallback);
        window.enterCallback = null;
      }
      this.enterCallback = false;
      this.$store.dispatch('app/closeLoginDialog');
      this.password = '';
    },
    getImgCode(code) {
      this.imgCode = code;
    },
    async login() {
      if (this.isLogging) return;
      if (!this.account || !this.password) {
        this.$message.error('用户名和密码不能为空');
        return;
      }
      if (this.verifyCode.toLowerCase() !== this.imgCode.toLowerCase()) {
        this.$message.error('验证码错误');
        return;
      }
      this.isLogging = true;

      let data = null;
      try {
        data = await commonAjax(`${this.backendIP}/api/login`, {
          username: this.account,
          password: this.password,
        });
      } catch (e) {
        if (e && e.status && e.status === 401) {
          this.$message.error('用户名或密码错误');
        } else {
          this.$message.error('服务器繁忙，请稍后再试');
        }

        this.isLogging = false;
        return;
      }

      await this.$store.dispatch('user/setUserData', {
        token: data.access_token,
        name: this.account,
      });
      this.$message.success('登录成功，跳转中');
      this.isLogging = false;
      setTimeout(()=>{
        this.$router.go();
        this.hide();
      }, 500);

      this.isLogging = false;
    },
    forgetPwd() {
      this.$emit('forget_pass_show');
    },
    registerNew() {
      this.$emit('register_show');
    },
  }
}
</script>

<style scoped lang="scss">
$form-gap: 24px;
$card-max-width: 500px;
@import "form";

.usr-action {
  margin-top: 20px;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
}
</style>
