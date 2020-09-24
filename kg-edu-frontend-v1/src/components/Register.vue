<template>
  <div class="register">
    <h4 class="title">注册</h4>
    <el-row>
      <el-col :span="4">
        <p style="margin-top: 10px;">账号：</p>
      </el-col>
      <el-col :span="20">
        <el-input
          type="text"
          v-model="account"
          auto-complete="off"
          placeholder="请输入账号名称"
        ></el-input>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row>
      <el-col :span="4">
        <p style="margin-top: 10px;">密码：</p>
      </el-col>
      <el-col :span="20">
        <el-input
          type="password"
          v-model="password"
          auto-complete="off"
          placeholder="请输入初始密码"
        ></el-input>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row>
      <el-col :span="4">
        <p style="margin-top: 10px;">邮箱：</p>
      </el-col>
      <el-col :span="20">
        <el-input
          type="text"
          v-model="email"
          auto-complete="off"
          placeholder="请输入您的邮箱"
        ></el-input>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row>
      <el-col :span="4">
        <p style="margin-top: 10px;">工作单位：</p>
      </el-col>
      <el-col :span="20">
        <el-input
          type="text"
          v-model="school"
          auto-complete="off"
          placeholder="请输入您的工作单位（学校）"
        ></el-input>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row>
      <el-col :span="4">
        <p style="margin-top: 10px;">职业：</p>
      </el-col>
      <el-col :span="20">
        <el-input
          type="text"
          v-model="profession"
          auto-complete="off"
          placeholder="请输入您的职业"
        ></el-input>
      </el-col>
    </el-row>
    <div style="margin-top: 10px;"></div>
    <el-row>
      <el-button type="success" style="width:100%;" @click="register"
        >注册</el-button
      >
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      account: "",
      password: "",
      email: "",
      school: "",
      profession: ""
    };
  },

  methods: {
    register() {}
  }
};
</script>

<style lang="scss" scoped>
.register {
  width: 550px;
  margin: 100px auto;
}
</style>
