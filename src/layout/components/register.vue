<template>
  <el-dialog
      class="usr-card"
      :visible="visible"
      top="8vh"
      @close="hide"
  >
    <h2 class="usr-title">
      新用户注册
    </h2>
    <el-form
        :model="form"
        :rules="formRules"
        class="usr-form"
        ref="userRegister"
        name="userRegister"
    >
      <div class="usr-form-left">
        <label class="usr-label usr-required">用户名</label>
        <el-form-item prop="username">
          <el-input
              class="usr-input"
              v-model="form.username"
              ref="username"
              placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item prop="password">
          <label class="usr-label usr-required">密码</label>
          <el-input
              type="password"
              v-model="form.password"
              class="usr-input"
              placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item prop="checkPass">
          <label class="usr-label usr-required">确认密码</label>
          <el-input
              type="password"
              v-model="form.checkPass"
              class="usr-input"
              placeholder="请重新输入密码"
          />
        </el-form-item>

        <el-form-item prop="phone">
          <label class="usr-label usr-required">手机号码</label>
          <el-input
              v-model="form.phone"
              class="usr-input"
              placeholder="请输入手机号码"
          />
        </el-form-item>

        <el-form-item prop="mail">
          <label class="usr-label usr-required">邮箱</label>
          <el-input
              v-model="form.mail"
              class="usr-input"
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

      </div>

      <div class="usr-form-right">

        <el-form-item prop="inviteCode">
          <label class="usr-label usr-required">邀请码</label>
          <el-tooltip class="usr-tooltip" effect="dark" placement="right">
            <div class="instruction" slot="content">
              <p>
                1、请发送邮件至tongsw@mail.ustc.edu.cn获取邀请码。
              </p>
              <p>
                2、邮件中须说明申请人姓名，手机，邮箱，工作单位和用途等信息。
              </p>
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
          <el-input
              class="usr-input"
              v-model="form.inviteCode"
              placeholder="请输入邀请码"
          />
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

        <el-form-item prop="type">
          <label class="usr-label usr-required">用户类型</label>
          <div>
            <el-button-group>
              <el-button
                  class="usr-btn-group"
                  @click="()=>toggleUser('user')"
                  :class="form.type === 'user' ? 'usr-active' : ''"
              >个人用户</el-button>
              <el-button
                  class="usr-btn-group"
                  @click="()=>toggleUser('group')" :class="form.type === 'group' ? 'usr-active' : ''"
              >组织用户</el-button>
            </el-button-group>
          </div>
        </el-form-item>


        <el-form-item v-show="form.type === 'group'" prop="groupName">
          <label class="usr-label usr-required">组织名称</label>
          <el-input
              class="usr-input"
              v-model="form.groupName"
              placeholder="请输入组织名称"
          />
        </el-form-item>

        <div class="usr-float-bottom">
          <div class="usr-txt">
            <i class="el-icon-question"></i>已有帐号？<el-button @click="switchLogin" type="text">点此登录</el-button>
          </div>
          <div class="usr-txt">
            <el-checkbox v-model="form.ackUserAgreement"/>
            已完整阅读并同意 <el-button @click="()=>window.open('/Agreement', '_blank')" type="text" icon="el-icon-search">用户协议</el-button> 和 <el-button @click="()=>window.open('/privacyPolicy', '_blank')" type="text" icon="el-icon-search">隐私条款</el-button>
          </div>
          <el-button
              :class="isRegistering ? 'usr-logging' : ''" :loading="isRegistering"
              @click="register"
              type="info"
              class="usr-login usr-btn"
          >注册</el-button>
        </div>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import vueImgVerify from "@/common/components/vue-img-verify.vue";
import {commonAjax} from "@/common/utils/ajax";
import loginFormMixin from '@/layout/components/loginFormMixin';

export default {
  name: 'register',
  components: {
    vueImgVerify,
  },
  mixins: [loginFormMixin],
  data() {
    return {
      isRegistering: false,
      form: {
        username: '',
        password: '',
        checkPass: '',
        mail: '',
        mailCode: '',
        verifyCode: '',
        imgCode: '',
        phone: '',
        inviteCode: '',
        ackUserAgreement: true,
        groupName: '',
        type: 'user', // `user` and `group`
      },
      formRules: {
        username: [this.ruleGenerator('请输入用户名')],
        mail: [this.ruleGenerator('请输入邮箱地址'), {
          type: 'email',
          trigger: ['blur', 'change'],
          message: '请输入格式正确的邮箱地址'
        },],
        mailVerifyCode: [this.ruleGenerator('请输入邮箱验证码'), this.mailCodeValidator()],
        password: [this.ruleGenerator('请输入密码')],
        checkPass: [this.ruleGenerator('请输入之前输入的密码'), this.passValidator()],
        phone: [this.ruleGenerator('请输入手机号码'), this.phoneValidator()],
        verifyCode: [this.ruleGenerator('请输入图形验证码'), this.codeValidator()],
        groupName: [{
          validator: (rule, value, callback) => {
            if (this.form.type === 'group' && !this.form.groupName) {
              callback(new Error('请输入组织名称'));
            }
            callback();
          }
        }],
        inviteCode: [this.ruleGenerator('请输入邀请码'), {
          validator: (rule, value, callback) => {
            if (this.form.inviteCode !== 'luna') {
              callback(new Error('邀请码错误'));
            }
            callback();
          },
          trigger: ['blur'],
        }],
      }
    };
  },
  methods: {
    show() {
      this.visible=true;
      setTimeout(()=>{
        try {
          this.$refs.vueImgVerify.handleDraw();
          this.$refs.username.focus();
        } catch (e) {
          return;
        }
          },
  250);

      if (!window.enterRegCallback) {
        window.enterRegCallback = (e) => {
          if (e.code === 'Enter') {
            this.register();
          }
        }
        document.addEventListener('keydown', window.enterRegCallback);
      }
    },
    switchLogin() {
      this.$emit('login_show');
    },
    async sendMailCode() {
      let isError = false;
      this.$refs.userRegister.validateField(['mail', 'verifyCode', 'inviteCode'], (err) => {
          if (err !== '') {
            isError = true;
          }
      });
      if (isError) {
        this.$message.error('请在完成验证码与邀请码，并检查格式后尝试发送邮箱验证码');
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
    toggleUser(type = 'user') {
      this.form.type = type;
    },
    hide(){
      if (window.enterRegCallback) {
        document.removeEventListener('keydown', window.enterRegCallback);
        window.enterRegCallback = null;
      }
      this.visible = false;
    },
    async register() {
      await this.$refs.userRegister.validate(async (valid) => {
        if (valid) {
          if (!this.form.ackUserAgreement) {
            this.$message.error('请先阅读并同意用户协议与隐私条款');
            return;
          }
          const fd = {
            username: this.form.username,
            password: this.form.password,
            phone: this.form.phone,
            email: this.form.mail,
            type: this.form.type,
            groupname: this.form.groupName,
          };
          let data;
          try {
            data = await commonAjax(this.backendIP + "/api/register", fd);
            await this.$store.dispatch('user/setUserData', {
              token: data.access_token,
              name: this.form.username,
            });
            this.$router.go();
            this.hide();
          } catch (e) {
            let msg = '注册失败，请稍后重试';
            if (e.status === '403') {
              msg = '用户名，手机号或邮箱已被注册';
            } else if (e.status === '401') {
              msg = '请检查是否有漏填写表带';
            } else if (e.status === '402') {
              msg = '请填写组织名称';
            }
            this.$message.error(msg);
          }
        }
      });
    },
  }
}
</script>

<style scoped lang="scss">
$card-max-width: 1000px;
$form-gap: 16px;
@import "form";

.usr-form {
  display: flex;

  &-left, &-right {
    position: relative;
    flex: 1;
  }

  &-left {
    margin-right: 16px;
  }

  &-right {
    margin-left: 16px;
  }

  @media (max-width: 900px) {
    flex-direction: column;
    padding-bottom: 160px;
    position: relative;

    &-left, &-right {
      margin-left: 0;
      margin-right: 0;
      position: static;
    }
  }
}

.usr-float-bottom {
  position: absolute;
  width: 100%;
  bottom: 0;
}

.usr-txt {
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 1.5;

  >button {
    font-size: 16px!important;
    padding-top: 0;
    padding-bottom: 0;
  }

  ::v-deep .el-checkbox {
    margin-right: 4px!important;
  }

  >i {
    margin-right: 5px;
  }
}

.usr-tooltip {
  margin-left: 5px;
}
</style>
