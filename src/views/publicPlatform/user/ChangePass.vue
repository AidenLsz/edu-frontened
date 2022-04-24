<template>
  <div style="min-width: 760px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="head">
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >个人中心</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: black">修改密码</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="dialogue">
      <div class="inputbox">
        <p class="text">原密码</p>
        <el-input
          v-model="old_pwd"
          placeholder="请输入原密码"
          show-password
        ></el-input>
      </div>
      <div class="inputbox">
        <p class="text">新密码</p>
        <el-input
          v-model="new_pwd"
          placeholder="请输入新密码"
          show-password
        ></el-input>
      </div>
      <div class="inputbox">
        <p class="text">重复新密码</p>
        <el-input
          v-model="repeat_new_pwd"
          placeholder="请再次输入新密码"
          show-password
        ></el-input>
      </div>
      <div class="buttonbox">
        <el-button type="success" class="confirm_btn" @click="confirm"
          ><span style="font-family: Roboto; font-weight: bold; color: white"
            >确定</span
          ></el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import sha1 from "sha1";
export default {
  name: "ChangePass",
  data() {
    return {
      old_pwd: "",
      new_pwd: "",
      repeat_new_pwd: "",
    };
  },
  methods: {
    ToTop() {
      document.getElementById("Top_Nav").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    confirm() {
      if (this.new_pwd == this.old_pwd) {
        this.$message({
          showClose: true,
          message: "新密码不能与原密码相同",
          type: "error",
        });
      } else if (this.new_pwd != this.repeat_new_pwd) {
        this.$message({
          showClose: true,
          message: "两次输入的新密码不同",
          type: "error",
        });
      } else {
        Axios.post(
          "https://ailab-api-275-production.env.bdaa.pro/v1/user/newPwd",
          { old_pwd: sha1(this.old_pwd), new_pwd: sha1(this.new_pwd) },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
            },
          }
        ).then((data) => {
          if (data.data.success) {
            this.$message({
              showClose: true,
              message: "密码修改成功",
              type: "success",
            });
            location.reload();
          } else {
            this.$message({
              showClose: true,
              message: data.data.errMsg,
              type: "error",
            });
          }
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.head {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
}

.dialogue {
  position: relative;
  width: 504px;
  height: 427px;
  margin: 100px auto;
  padding-top: 42px;

  background: #ffffff;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;
  box-shadow: 0px 6px 36px rgba(59, 72, 83, 0.16);
  border-radius: 8px;
}

.inputbox {
  position: relative;
  /* Inside auto layout */
  margin-left: 42px;
  margin-right: 42px;
  margin-bottom: 28px;
}

.buttonbox {
  position: relative;
  text-align: center;
}

.el-input ::v-deep .el-input__inner {
  background-color: #eff1f3;
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>