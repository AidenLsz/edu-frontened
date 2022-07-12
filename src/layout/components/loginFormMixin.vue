<template>
  <div></div>
</template>

<script>
import md5 from 'js-md5';

export default {
  name: 'loginFormMixin',
  data() {
    return {
      imgCode: '',
      visible: false,
      window,
      mailCodeValid: {
        enable: true,
        coolDown: 0,
        emailCodeOrigin: '',
        timer: null,
      },
    }
  },
  computed: {
    mailBtnCaption() {
      if (this.mailCodeValid.enable) {
        return '获取验证码';
      } else {
        return `重新发送(${this.mailCodeValid.coolDown}s)`;
      }
    }
  },
  methods: {
    getImgCode(code) {
      this.imgCode = code;
    },
    ruleGenerator(message) {
      return {
        required: true,
        message,
        trigger: ['blur'],
      }
    },
    passValidator() {
      return {
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请输入之前输入的密码'));
          } else if (value !== this.form.password) {
            callback(new Error('请保证两次输入密码一致'));
          } else {
            callback();
          }
        },
        trigger: ['blur', 'change'],
      }
    },
    phoneValidator() {
      return {
        pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[01235678]|18[0-9]|19[89])\d{8}$/,
        message: "请输入正确的手机号码"
      }
    },
    codeValidator() {
      return {
        validator: (rule, value, callback) => {
          if (value.toLowerCase() !== this.imgCode.toLowerCase()) {
            callback(new Error('验证码错误'));
            this.$refs.vueImgVerify.handleDraw();
          } else {
            callback();
          }
        },
        trigger: ['blur']
      }
  },
    mailCodeValidator() {
      return {
        validator: (rule, value, callback) => {
          if (md5(value) !== this.mailCodeValid.emailCodeOrigin) {
            callback(new Error('邮箱验证码错误'));
          }
          callback();
        },
        trigger: ['blur'],
      }
    },
    tackCoolDown() {
      this.mailCodeValid.coolDown = 60;
      this.mailCodeValid.enable = false;
      this.mailCodeValid.timer = setInterval(() => {
        if (this.mailCodeValid.coolDown <= 0) {
          clearInterval(this.mailCodeValid.timer);
          this.mailCodeValid.enable = true;
        } else {
          this.mailCodeValid.enable = false;
          this.mailCodeValid.coolDown -= 1;
        }
      }, 1000);
    },
  },

}
</script>

<style scoped>

</style>
