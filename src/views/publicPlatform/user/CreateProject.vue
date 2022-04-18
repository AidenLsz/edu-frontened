<template>
  <div style="min-width: 600px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="head">
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >项目管理</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: rgba(0, 0, 0, 0.5)"
          >我的项目</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item
        ><span style="color: black">新建项目</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="title">
      <div class="line"></div>
      <div class="text">项目名称</div>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="name_input_box"
      label-width="20px"
    >
      <el-form-item label=" " prop="project_name">
        <el-input
          type="text"
          placeholder="请填写项目名称"
          v-model="form.project_name"
          maxlength="20"
          show-word-limit
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="title">
      <div class="line"></div>
      <div class="text">项目描述</div>
    </div>
    <el-input
      type="textarea"
      placeholder="请输入项目描述"
      v-model="form.description"
      maxlength="200"
      show-word-limit
      rows="15"
      style="
        position: relative;
        margin: 20px 73px 0 70px;
        width: calc(100% - 143px);
      "
    >
    </el-input>
    <el-row type="flex" justify="center" style="margin-top: 40px">
      <el-button type="success" style="margin-right: 35px" @click="submit()"
        >确定</el-button
      >
      <el-button style="margin-left: 35px" @click="ToMyPro()">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      form: {
        project_name: "",
        description: "",
      },
      rules: {
        project_name: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
      },
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
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          Axios.post(
            "https://ailab-api-275-production.env.bdaa.pro/v1/prog/init",
            {
              project_name: this.form.project_name,
              description: this.form.description,
            },
            {
              headers: {
                Authorization: `Bearer ${this.$store.state.AIlab_user.AItoken}`,
              },
            }
          ).then((data) => {
            if (data.data.success) {
              this.$router.replace({
                path: "/PublicPlatform/user/MyPro",
              });
              location.reload();
              this.$message({
                showClose: true,
                message: "项目创建成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: data.data.errMsg,
                type: "error",
              });
            }
          });
        }
      });
      this.ToMyPro();
    },
    ToMyPro() {
      this.$router.push({
        path: "/PublicPlatform/user/MyPro",
      });
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

.name_input_box {
  // position: absolute;
  // left: 73px;
  // top: 0;
  width: calc(100% - 120px);
  // height: 100%;
  margin-top: 20px;
  margin-left: 50px;
  margin-right: 70px;
  // min-width: 400px;
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>