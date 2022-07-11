<template>
  <el-dialog
      class="usr-card"
      :visible="visible"
      @close="hide"
      top="10vh"
  >
    <h2 class="usr-title">
      找回密码
    </h2>
    <el-form
        class="usr-form"
        :model="form"
        v-show="verifyVisible"
        :rules="formRules"
        ref="userForgetPass"
        name="userForgetPass"
    >
      <label class="usr-label usr-required">用户名</label>
      <el-form-item prop="username">
        <el-input
            class="usr-input"
            v-model="form.username"
            ref="username"
            placeholder="请输入用户名"
        />
      </el-form-item>
      <label class="usr-label usr-required">邮箱</label>
      <el-form-item prop="mail">
        <el-input
            class="usr-input"
            v-model="form.mail"
            ref="mail"
            placeholder="请输入邮箱"
        />
      </el-form-item>


      <el-form-item prop="mailCode">
        <label class="usr-label usr-required">邮箱验证码</label>
        <div class="usr-mail-verification">
          <el-input
              v-model="form.mailCode"
              ref=""
              class="usr-input"
              placeholder="请输入邮箱验证码"
          />

          <el-button
              :class="mailCodeValid.enable ? 'usr-btn' : ''"
              :disabled="!mailCodeValid.enable"
              class="usr-send-mail usr-btn"
              @click="sendMailCode"
          >{{mailBtnCaption}}</el-button>
        </div>
      </el-form-item>

      <el-form-item prop="verifyCode">
        <label class="usr-label usr-required">验证码</label>
        <div class="usr-verification">
          <el-input
              class="usr-input"
              v-model="form.verifyCode"
              placeholder="请输入验证码"
          />
          <div class="usr-verification-img">
            <vue-img-verify ref="vueImgVerify" :ht="44" @getImgCode="getImgCode"/>
          </div>
        </div>
      </el-form-item>

      <el-button
          :class="isFinding ? 'usr-logging' : ''" :loading="isFinding"
          @click="verify"
          type="info"
          class="usr-login usr-btn"
      >找回密码</el-button>

    </el-form>

    <el-form
        class="usr-form"
        :model="resetPassForm"
        v-show="resetPassVisible"
        :rules="resetPassRules"
        ref="userForgetPassReset"
        name="userForgetPassReset"
    >

      <el-form-item prop="password">
        <label class="usr-label usr-required">密码</label>
        <el-input
            type="password"
            v-model="resetPassForm.password"
            class="usr-input"
            placeholder="请输入密码"
        />
      </el-form-item>

      <el-form-item prop="checkPass">
        <label class="usr-label usr-required">确认密码</label>
        <el-input
            type="password"
            v-model="resetPassForm.checkPass"
            class="usr-input"
            placeholder="请重新输入密码"
        />
      </el-form-item>

      <el-button
          :class="isResetting ? 'usr-logging' : ''" :loading="isResetting"
          @click="resetPass"
          type="info"
          class="usr-login usr-btn"
      >找回密码</el-button>
    </el-form>

  </el-dialog>
</template>

<script>
import vueImgVerify from "@/common/components/vue-img-verify.vue";
import {commonAjax} from '@/common/utils/ajax';
import loginFormMixin from '@/layout/components/loginFormMixin';

export default {
  name: 'forgetPass',
  components: {vueImgVerify},
  mixins: [loginFormMixin],
  data() {
    return {
      verifyVisible: true,
      resetPassVisible: false,
      isFinding: false,
      isResetting: false,
      form: {
        username: '',
        mail: '',
        verifyCode: '',
        mailCode: '',
      },
      formRules: {
        username: [this.ruleGenerator('请输入用户名')],
        mail: [
            this.ruleGenerator('请输入邮箱地址'),
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          }
        ],
        verifyCode: [
            this.ruleGenerator('请输入验证码'),
            this.codeValidator()
        ],
        mailCode: [
            this.ruleGenerator('请输入邮箱验证码'),
            this.mailCodeValidator(),
        ]
      },
      access_token: '',
      resetPassForm: {
        password: '',
        checkPass: '',
      },
      resetPassRules: {
        password: [this.ruleGenerator('请输入密码')],
        checkPass: [this.ruleGenerator('请再次输入密码'),
          {
            validator: (rule, value, callback) => {
              if (value !== this.resetPassForm.password) {
                callback(new Error('两次输入密码不一致'));
              }
              callback();
            },
            trigger: ['blur', 'change'],
          }
        ]
      },
    }
  },
  methods: {
    show() {
      this.visible = true;
      this.resetPassVisible = false;
      this.verifyVisible = true;
      setTimeout(()=>{
            try {
              this.$refs.vueImgVerify.handleDraw();
              this.$refs.username.focus();
            } catch (e) {
              return;
            }
          },
          250);

      if (!window.forgetCallback) {
        window.forgetCallback = (e) => {
          if (e.code === 'Enter') {
            if (this.resetPassVisible) {
              this.resetPass()
            } else if (this.verifyVisible) {
              this.verify();
            }
          }
        }
        document.addEventListener('keydown', window.forgetCallback);
      }
    },
    hide() {
      if (window.forgetCallback) {
        document.removeEventListener('keydown', window.forgetCallback);
        window.forgetCallback = null;
      }
      this.visible = false;
    },
    async sendMailCode() {
      let isError = false;
      this.$refs.userForgetPass.validateField(['mail', 'verifyCode'], (err) => {
        if (err !== '') {
          isError = true;
        }
      });
      if (isError) {
        this.$message.error('请在完成验证码并检查格式后尝试发送邮箱验证码');
        return;
      }

      this.tackCoolDown();
      let data;
      try {
        data = await commonAjax(this.backendIP + '/api/send_email_code', {
          'dest_email': this.form.mail,
        });
      } catch (e) {
        this.$message.error('验证码发送失败，请稍后再试');
      }
      this.mailCodeValid.emailCodeOrigin = data.code;
    },
    async verify() {
      this.$refs.userForgetPass.validate(async (valid) => {
        if (valid) {
          let data;
          try {
            data = await commonAjax(`${this.backendIP}/api/forget_pass_check`, {
              username: this.form.username,
              email: this.form.mail,
            });
          } catch (e) {
            this.$message.error('用户名或邮箱错误')
          }
          this.access_token = data.access_token;
          this.resetPassVisible = true;
          this.verifyVisible = false;
        }
      })
    },
    resetPass() {
      this.resetPassForm.validate(async (valid) => {
        if (valid) {
          try {
            commonAjax(`${this.backendIP}/api/reset_password`, {
              password: this.resetPassForm.password,
            });
            this.resetPassVisible = false;
            this.verifyVisible = true;
            await this.$store.dispatch('app/openLoginDialog');
          } catch (e) {
            this.$message.error('重置密码失败，请稍后再试');
          }
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
  $form-gap: 24px;
  $card-max-width: 500px;
  @import "form";

  .usr-login {
    margin-top: $form-gap;
  }
</style>
