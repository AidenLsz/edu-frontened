<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>我的资料</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" style="margin-top: 30px; margin-bottom: 20px">
        <label style="font-size: 18px">个人信息</label>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="1">
        <el-row type="flex" justify="start">
          <label style="height: 40px; line-height: 40px;">用户名：</label>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row type="flex" justify="start">
          <el-input v-model="userName" style="width: 30%"></el-input>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="1">
        <el-row type="flex" justify="start">
          <label style="height: 40px; line-height: 40px;">邮箱：</label>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row type="flex" justify="start">
          <el-input v-model="mailAddress" style="width: 30%"></el-input>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="1">
        <el-row type="flex" justify="start">
          <label style="height: 40px; line-height: 40px;">手机号码：</label>
        </el-row>
      </el-col>
      <el-col :span="20">
        <el-row type="flex" justify="start">
          <el-input v-model="phoneNumber" style="width: 30%"></el-input>
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px; margin-bottom: 40px">
      <el-col :span="23" :offset="1">
        <el-row type="flex" justify="start">
          <el-button type="primary">确认保存</el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="center">
      <el-button type="primary" v-if="!securitySetting" @click="securitySetting = true">修改个人安全信息</el-button>
    </el-row>
    <div v-if="securitySetting">
      <el-row type="flex" justify="start" style="margin-top: 10px; margin-bottom: 20px">
          <label style="font-size: 18px">安全信息</label>
      </el-row>
      <el-row>
        <el-col :span="3" :offset="1">
          <el-row type="flex" justify="start">
            <label style="height: 40px; line-height: 40px;">输入旧密码：</label>
          </el-row>
        </el-col>
        <el-col :span="20">
          <el-row type="flex" justify="start">
            <el-input v-model="oldPassword" style="width: 30%" type="password"></el-input>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" :offset="1">
          <el-row type="flex" justify="start">
            <label style="height: 40px; line-height: 40px;">修改新密码：</label>
          </el-row>
        </el-col>
        <el-col :span="20">
          <el-row type="flex" justify="start">
            <el-input v-model="newPassword" style="width: 30%" type="password"></el-input>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3" :offset="1">
          <el-row type="flex" justify="start">
            <label style="height: 40px; line-height: 40px;">确认新密码：</label>
          </el-row>
        </el-col>
        <el-col :span="20">
          <el-row type="flex" justify="start">
            <el-input v-model="repPassword" style="width: 30%" type="password"></el-input>
          </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px; margin-bottom: 40px">
        <el-col :span="23" :offset="1">
          <el-row type="flex" justify="start">
            <el-button type="success" @click="Change_To_New_Password()" :disabled="(newPassword != repPassword) || newPassword.length == 0">确认修改密码</el-button>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'userInfo',
  props: {

  },
  data() {
    return {
      userName: "Username",
      mailAddress: "mailAddress@mail.ustc.edu.cn",
      phoneNumber: "13222337890",
      securitySetting: false,
      oldPassword: "12345678",
      newPassword: "",
      repPassword: ""
    }
  },
  watch:{

  },
  mounted() {

  },
  methods: {
      Check_My_Question(val){
        console.log(val.id + " is Checking...")
      },
      Edit_My_Question(val){
        console.log(val.stem + " is Editing...")
      },
      Delete_My_Question(val){
        console.log(val.id + " is Deleted.")
      },
      Input_New_Question(){
        alert("正要前往试题录入界面...")
      },
      Change_To_New_Password(){
        if(this.newPassword != this.repPassword){
          alert("两次新密码不一致，请重新输入。")
          return
        }
        if(this.oldPassword == this.newPassword){
          alert("这是您当前使用的密码，无需修改。")
          return
        }
        this.$message.success("修改成功。（未实际上传，仅本地修改）")
        this.oldPassword = this.newPassword;
        this.newPassword = "";
        this.repPassword = ""
      }
  }
}
</script>
<style >
</style>