<template>

  <div class="login">

    <!-- 处理忘记密码用的对话框 -->
    <el-dialog title="忘记密码" width="25%" :visible.sync="forgetPassword" @close="fPass_Close()">
      <el-row>
        <p>已发送验证码至您注册的邮箱</p>
        <p>请查看邮箱内容并填入正确验证码以重置密码</p>
      </el-row>
      <el-row style="margin-top:20px">
        <el-col :span="11" :offset="2">
          <el-input v-model="Qualified_Code_Input" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="4" :offset="3">
          <el-button @click="Resend_Qualified_Code()">重新发送</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:30px">
        <el-button @click="Check_To_Reset_Password()">确认重置密码</el-button>
      </el-row>
    </el-dialog>

    <!-- 处理重置密码时用的对话框 -->
    <el-dialog title="重置密码" width="25%" :visible.sync="resetPassword" @close="rPass_Close()">
      <el-row>
        <p>请输入您的新密码并重复一次以确认</p>
      </el-row>
      <el-row style="margin-top:20px">
        <el-col :span="6">
          <p style="padding-top: 12px">输入新密码</p>
        </el-col>
        <el-col :span="17" :offset="1">
          <el-input type="password" v-model="resetPassInput1" placeholder="请输入新密码"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top:10px">
        <el-col :span="6">
          <p style="padding-top: 11px">确认新密码</p>
        </el-col>
        <el-col :span="17" :offset="1">
          <el-input type="password" v-model="resetPassInput2" placeholder="请确认新密码"></el-input>
        </el-col>
      </el-row>
      <el-row v-if="hintShow">
        <p style="color: red">两次密码输入不一致，请修改</p>
      </el-row>
      <el-row style="margin-top:30px">
        <el-button @click="Check_To_Reset_Password()" :disabled="hintShow">确认重置密码</el-button>
      </el-row>
    </el-dialog>

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
        <el-row>
          <el-col :span="15">
            <el-input
              type="text"
              v-model="verifyCode"
              auto-complete="off"
              placeholder="请输入验证码"
            ></el-input>     
          </el-col>
          <el-col :span="8" :offset="1">
            <vue-img-verify @getImgCode="getImgCode" ref="vueImgVerify" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item class="contain">
        <el-row>
          <el-col :span="15">
            <el-button type="info" style="width:75%;" @click="login">
              登录
            </el-button>
          </el-col>
          <el-col :span="7" :offset="2">
            <el-link @click="Forget_Password()" :underline="false">
              忘记密码？
            </el-link>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import vueImgVerify from "../common/components/vue-img-verify.vue";
export default {
  components: { vueImgVerify },
  data() {
    return {
      account: "",
      pass: "",
      imgCode: "",
      verifyCode: "",
      // 显示忘记密码的对话框
      forgetPassword: false,
      // 显示重置密码的对话框
      resetPassword: false,
      // 重置密码框1,2
      resetPassInput1: "",
      resetPassInput2: "",
      // 提示两次重置密码输入不一致的标记
      hintShow: false,
      // 获取发送给用户的验证码
      Qualified_Code: "",
      // 获取发送给用户的验证码的时间戳
      Qualified_Code_Send_Time: "",
      // 记录用户输入的验证码
      Qualified_Code_Input: "",
      // 记录用户输入验证码的时候的时间戳，超时失效
      Qualified_Code_Input_Time: ""
    };
  },
  mounted() {
    this.handleClick();
  },
  watch:{
    resetPassInput1(newVal){
      if(newVal == this.resetPassInput2){
        this.hintShow = false;
      }else{
        this.hintShow = true;
      }
    },
    resetPassInput2(newVal){
      if(newVal == this.resetPassInput1){
        this.hintShow = false;
      }else{
        this.hintShow = true;
      }
    }
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
    },
    // 显示忘记密码对话框
    Forget_Password(){
      this.forgetPassword = true;
      this.Qualified_Code_Send_Time = Date.parse(new Date());
      console.log(this.Qualified_Code_Send_Time);
      console.log("open FPass Dialog")
    },
    // 重新发送验证码
    Resend_Qualified_Code(){
      console.log("Resending Qualified Code...")
    },
    fPass_Close(){
      this.forgetPassword = false;
      this.Qualified_Code = "";
      this.Qualified_Code_Input = "";
      this.Qualified_Code_Send_Time = "";
      this.Qualified_Code_Input_Time = "";
      console.log("Close FPass");
    },
    rPass_Close(){
      this.resetPassword = false;
      console.log("Close RPass");
    },
    // 检查是否可以重置密码
    Check_To_Reset_Password(){
      console.log("Code Right, Ready To Reset Password...")
      this.forgetPassword = false;
      this.resetPassword = true;
    },
    // 重置密码
    Reset_Password(){
      console.log("Reseting Password...");
      this.resetPassword = false;
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
