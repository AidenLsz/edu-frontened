<template>
  <div style="min-width: 1240px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="head">
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >个人中心</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: black">账号信息</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="title">
      <div class="line"></div>
      <div class="text">基本信息</div>
    </div>
    <div class="main">
      <div class="key" style="left: 70px; top: 64px">账号昵称：</div>
      <div class="key" style="left: 580px; top: 64px">用户名：</div>
      <div class="key" style="left: 70px; top: 126px">联系手机：</div>
      <div class="key" style="left: 580px; top: 126px">账号邮箱：</div>
      <div class="key" style="left: 70px; top: 188px">注册日期：</div>

      <div class="value" style="left: 170px; top: 64px" v-show="!change">
        {{ full_name }}
      </div>
      <div class="value" style="left: 675px; top: 64px">{{ user_name }}</div>
      <div class="value" style="left: 170px; top: 126px">{{ phone }}</div>
      <div class="value" style="left: 675px; top: 126px">
        {{ mail }}
      </div>
      <div class="value" style="left: 170px; top: 188px">
        {{ register_date }}
      </div>
      <el-link
        v-show="!change"
        icon="el-icon-edit"
        type="primary"
        class="change"
        @click="ChangeName"
        >修改</el-link
      >
      <el-input
        v-show="change"
        class="input"
        v-model="new_full_name"
        ref="inputRef"
        @blur="confirm"
      >
      </el-input>
      <el-link
        v-show="change"
        type="primary"
        class="change"
        style="left: 400px"
        @click="confirm"
        >完成</el-link
      >
    </div>
  </div>
</template>

<script>
// import { commonAjax } from "@/common/utils/ajax";
import Axios from "axios";
export default {
  mounted() {
    this.ToTop();
    Axios.get("https://ailab-api-275-production.env.bdaa.pro/v1/user/profile", {
      headers: {
        Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
      },
    }).then((data) => {
      if (data.data.success) {
        this.data = data.data;
        console.log(this.data);
        this.mail = this.data.email;
        this.user_name = this.data.user_name;
        this.full_name = this.data.full_name;
        this.new_full_name = this.full_name;
        this.phone = this.data.phone_number;
        let temp = this.data.register_date.split(" ");
        let month;
        switch (temp[2]) {
          case "Jan":
            month = "01";
            break;
          case "Feb":
            month = "02";
            break;
          case "Mar":
            month = "03";
            break;
          case "Apr":
            month = "04";
            break;
          case "May":
            month = "05";
            break;
          case "Jun":
            month = "06";
            break;
          case "Jul":
            month = "07";
            break;
          case "Agu":
            month = "08";
            break;
          case "Sep":
            month = "09";
            break;
          case "Oct":
            month = "10";
            break;
          case "Nov":
            month = "11";
            break;
          case "Dec":
            month = "12";
            break;
        }
        this.register_date = temp[3] + "-" + month + "-" + temp[1];
      } else {
        console.log(data.data.errMsg);
        this.$message({
          showClose: true,
          message: data.data.errMsg,
          type: "error",
        });
      }
    });
    // let cookie = document.cookie;
    // console.log(cookie);
  },
  data() {
    return {
      full_name: "",
      user_name: "",
      new_full_name: "",
      // ID: "123456",
      // APPID: "123456",
      // APPKEY: "abcd",
      phone: "",
      mail: "",
      register_date: "",
      change: false,
      data: {},
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
    ChangeName() {
      this.change = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
      }); //这里需要使用nextTick是因为要让el-input先show出来才能让它focus
    },
    confirm() {
      if (this.new_full_name != this.full_name) {
        Axios.post(
          "https://ailab-api-275-production.env.bdaa.pro/v1/user/newName",
          { new_full_name: this.new_full_name },
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
            },
          }
        ).then((data) => {
          if (data.data.success) {
            this.$message({
              showClose: true,
              message: "昵称修改成功",
              type: "success",
            });
            this.full_name = this.new_full_name;
          } else {
            console.log(data.data.errMsg);
            this.$message({
              showClose: true,
              message: "昵称修改失败",
              type: "error",
            });
          }
        });
      }
      console.log("confirm");
      this.change = false;
    },
  },
};
</script>

<style scoped lang="scss">
.head {
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  padding-left: 40px;
}

.title {
  position: relative;
  margin-top: 35px;
  height: 22px;
  width: 100%;
  .line {
    position: absolute;
    width: 5.56px;
    height: 22px;
    left: 40px;

    background-color: #000000;
  }
  .text {
    position: absolute;
    width: 88.89px;
    height: 22px;
    left: 51.11px;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 22px;
    /* identical to box height, or 110% */

    color: #000000;
  }
}

.main {
  position: relative;
  width: calc(100% - 80px);
  height: 278px;
  margin: 20px 40px;
  background: #ffffff;
  border: 1px solid #a6a6a6;
  border-radius: 8px;
  .key {
    position: absolute;
    width: 80px;
    height: 22px;
    text-align: right;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    /* identical to box height, or 137% */

    color: #7f8485;
  }
  .value {
    position: absolute;
    // width: 50px;
    height: 22px;
    text-align: left;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    /* identical to box height, or 137% */

    color: #000000;
  }
  .input {
    position: absolute;
    width: 200px;
    height: 22px;
    left: 170px;
    top: 58px;
  }
  .change {
    position: absolute;
    width: 62px;
    height: 22px;
    left: 268px;
    top: 64px;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 22px;
    /* identical to box height, or 137% */
    color: #5d5fef;
  }
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>