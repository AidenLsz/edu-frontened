<template>
  <div style="min-width: 1240px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <div class="head">
      <div class="text">个人中心 / 账户信息</div>
    </div>
    <div class="main">
      <div class="line"></div>
      <div class="text">基本信息</div>
      <div class="key" style="left: 70px; top: 82px">账号昵称：</div>
      <div class="key" style="left: 70px; top: 144px">账号ID：</div>
      <div class="key" style="left: 70px; top: 206px">APPID：</div>
      <div class="key" style="left: 580px; top: 82px">APPKEY：</div>
      <div class="key" style="left: 580px; top: 144px">联系手机：</div>
      <div class="key" style="left: 580px; top: 206px">账号邮箱：</div>
      <div class="value" style="left: 170px; top: 82px" v-show="!change">
        {{ name }}
      </div>
      <div class="value" style="left: 170px; top: 144px">{{ ID }}</div>
      <div class="value" style="left: 170px; top: 206px">{{ APPID }}</div>
      <div class="value" style="left: 675px; top: 82px">{{ APPKEY }}</div>
      <div class="value" style="left: 675px; top: 144px">{{ phone }}</div>
      <div class="value" style="left: 675px; top: 206px">{{ mail }}</div>
      <el-link
        icon="el-icon-edit"
        type="primary"
        class="change"
        @click="ChangeName"
        >修改</el-link
      >
      <el-input
        v-show="change"
        class="input"
        v-model="name"
        ref="inputRef"
        @blur="confirm"
      >
      </el-input>
      <el-link v-show="change" type="primary" class="change" style="left:400px;" @click="confirm">完成</el-link>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.ToTop();
  },
  data() {
    return {
      name: "小明",
      ID: "123456",
      APPID: "123456",
      APPKEY: "abcd",
      phone: "123****4567",
      mail: "123456@aaa.com",
      change: false,
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
  background: #bfdbfe;
  .text {
    position: absolute;
    width: 150px;
    height: 22px;
    left: 40px;
    top: 9px;

    font-family: Roboto;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
    /* identical to box height, or 137% */
    color: #000000;
    // border: 0.3px solid #000000;
  }
}

.main {
  position: relative;
  width: 1150px;
  height: 278px;
  margin: 20px auto;
  background: #f7fbff;
  border: 1px solid rgba(62, 137, 224, 0.25);
  .line {
    position: absolute;
    width: 5.56px;
    height: 22px;
    left: 40px;
    top: 30px;

    background-color: #000000;
  }
  .text {
    position: absolute;
    width: 88.89px;
    height: 22px;
    left: 51.11px;
    top: 30px;

    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 22px;
    /* identical to box height, or 110% */

    color: #000000;
  }
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
    top: 72px;
  }
  .change {
    position: absolute;
    width: 62px;
    height: 22px;
    left: 268px;
    top: 82px;

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