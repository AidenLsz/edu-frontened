<template>

  <!-- 忘记密码 -->
  <div class="">
    <el-dialog :visible.sync="CheckAuthorityVisible" width="70%" style="margin-top: -13vh;">
      <el-row>
        <el-col :span="10" :offset="2">
          <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
              身份验证
            </span>
          <el-form :model="ruleForm"
                   status-icon
                   :rules="rules"
                   ref="checkAuthorityForm"
                   label-position="left"
                   label-width="90px"
                   class="demo-ruleForm"
                   style="margin-top:30px">
            <el-form-item label="账号" prop="username" style="margin-bottom: 15px">
              <el-input type="text"
                        v-model="ruleForm.username"
                        auto-complete="off"
                        placeholder="请输入您的账号" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email" style="margin-bottom: 15px">
              <el-input type="text"
                        v-model="ruleForm.email"
                        auto-complete="off"
                        placeholder="请输入您的邮箱"></el-input>
            </el-form-item>
            <el-form-item label="" label-width="0px" prop="imgCode" style="margin-bottom: 15px">
              <el-col :span="15">
                <el-input type="text"
                          v-model="ruleForm.imgCode"
                          auto-complete="off"
                          placeholder="请输入图片验证码"></el-input>
              </el-col>
              <el-col :span="8" :offset="1">
                <el-row type="flex" justify="end">
                  <vue-img-verify @getImgCode="getimgCodeOrigin" ref="vueImgVerify" />
                </el-row>
              </el-col>
            </el-form-item>
            <el-form-item label="" label-width="0px" prop="emailCode" style="margin-bottom: 15px">
              <el-col :span="15">
                <el-input type="text" maxlength="8" suffix-icon="el-icon-lock" placeholder="请输入邮箱验证码" v-model="ruleForm.emailCode" />
              </el-col>
              <el-col :span="8" :offset="1">
                <el-row type="flex" justify="end">
                  <el-button class="btn-orange" :disabled="disabled" @click="sendEmailCode">{{valiBtn}}</el-button>
                </el-row>
              </el-col>
            </el-form-item>
          </el-form>
          <el-row style="float:right">
            <el-button type="primary" @click="CheckAuthority">确 定</el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <img src="@/assets/login.png" width="350vh" height="350vh" />
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog :visible="resetPassVisible"
               width="70%"
               @close="hide()">
      <el-row>
        <el-col :span="10" :offset="2">
          <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
              密码重置
            </span>
          <el-form :model="passRuleForm"
                   status-icon
                   :rules="passRules"
                   ref="resetPassForm"
                   label-position="left"
                   label-width="90px"
                   class="demo-ruleForm"
                   style="margin-top:80px">
            <el-form-item label="密码" prop="password" style="margin-bottom: 15px">
              <el-input type="password" v-model="passRuleForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass" style="margin-bottom: 15px">
              <el-input type="password" v-model="passRuleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-row style="float:right">
            <el-button type="primary" @click="resetPass">确 定</el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <img src="@/assets/login.png" width="350vh" height="350vh" />
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>

<script>

  // import {commonAjax} from "@/common/utils/ajax";
  import vueImgVerify from '@/common/components/vue-img-verify.vue'
  import axios from 'axios'
  import { commonAjax } from '@/common/utils/ajax'
  import { Message } from 'element-ui'
  import md5 from 'js-md5'
  export default {
    components: { vueImgVerify },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.passRuleForm.checkPass !== '') {
            this.$refs['resetPassForm'].validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.passRuleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      var validateImgCode = (rule, value, callback) => {
        if (value.toUpperCase() !== this.imgCodeOrigin.toUpperCase()) {
          callback(new Error('图片验证码错误！'))
        } else {
          callback()
        }
      }
      var validateEmailCode = (rule, value, callback) => {
        if (md5(value) !== this.emailCodeOrigin) {
          callback(new Error('邮箱验证码错误！'))
        } else {
          callback()
        }
      }
      return {
        access_token: '',
        CheckAuthorityVisible: false,
        resetPassVisible: false,
        imgCodeOrigin: '',
        emailCodeOrigin: '',
        disabled: false,
        valiBtn: '获取验证码',
        ruleForm: {
          // email: '',
          username: '',
          email: ''
        },
        rules: {
          username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          imgCode: [
            { required: true, message: '请输入图形验证码', trigger: 'blur' },
            { validator: validateImgCode, trigger: ['blur'] }
          ],
          emailCode: [
            { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
            { validator: validateEmailCode, trigger: ['blur'] }
            // { required: false, message: '请输入手机验证码', trigger: 'blur' },
            // { validator: validatePhoneCode, trigger: ['blur'] }
          ]
        },
        passRuleForm: {
          password: '',
          checkPass: ''
        },
        passRules: {
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validatePass2, trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    computed: {
      isLuna() {
        return this.$store.getters.isLuna
      },
      systemType() {
        return this.$store.getters.systemType
      }
    },
    methods: {
      show() {
        this.CheckAuthorityVisible = true
        // this.resetPassVisible = true
      },
      getimgCodeOrigin(code) {
        this.imgCodeOrigin = code
      },
      resetPass() {
        this.$refs['resetPassForm'].validate(valid => {
          if (!valid) {
            return false
          }
          let fd = new FormData()
          fd.append('password', this.passRuleForm.password)
          axios({
            url: this.backendIP + '/api/reset_password',
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${this.access_token}`
            },
            data: fd
          })
            .then(res => {
              console.log(res)
              this.resetPassVisible = false
              this.$store.dispatch('app/openLoginDialog')
            })
            .catch(err => {
              console.log(err)
            })
        })
      },
      CheckAuthority() {
        this.$refs['checkAuthorityForm'].validate(valid => {
          if (!valid) {
            return false
          }
          let fd = {
            username: this.ruleForm.username,
            email: this.ruleForm.email
          }
          commonAjax(this.backendIP + '/api/forget_pass_check', fd)
            .then(res => {
              this.access_token = res.access_token
              this.CheckAuthorityVisible = false
              this.resetPassVisible = true
            })
            .catch(err => {
              console.log(err)
              Message({
                message: '用户名或邮箱错误，身份验证失败！',
                type: 'error',
                duration: 5 * 1000
              })
            })
        })
      },
      sendEmailCode() {
        let validateList = []
        this.$refs['checkAuthorityForm'].validateField(['email', 'imgCode'], err => {
          validateList.push(err)
        })
        if (validateList.every(err => err === '')) {
          this.tackBtn() //验证码倒数60秒
          commonAjax(this.backendIP + '/api/send_email_code', { dest_email: this.ruleForm.email })
            .then(data => {
              this.emailCodeOrigin = data.code
            })
            .catch(err => {
              console.log(err)
              Message({
                message: '验证码发送失败！',
                type: 'error',
                duration: 5 * 1000
              })
            })
        }
      },
      tackBtn() {
        //验证码倒数60秒
        let time = 60
        let timer = setInterval(() => {
          if (time == 0) {
            clearInterval(timer)
            this.valiBtn = '获取验证码'
            this.disabled = false
          } else {
            this.disabled = true
            this.valiBtn = time + '秒后重试'
            time--
          }
        }, 1000)
      }
    }
  }

</script>

<style lang="scss" scoped>
</style>
