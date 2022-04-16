<template>
  <div style="min-width: 1240px">
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
        ><span style="color: black">项目详情</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div class="title">
      <div class="line"></div>
      <div class="text">项目详情</div>
    </div>
    <div class="main">
      <div class="pair">
        <div class="key">项目名称：</div>
        <div class="value">{{ project_name }}</div>
        <el-link
          icon="el-icon-edit"
          type="primary"
          @click="ChangeName"
          style="margin-left: 30px"
          >修改</el-link
        >
      </div>
      <div class="pair">
        <div class="key">项目描述：</div>
        <div class="value">{{ description }}</div>
      </div>
      <div class="pair">
        <div class="key">项目ID：</div>
        <div class="value">{{ project_id }}</div>
      </div>
      <div class="pair">
        <div class="key">项目密钥：</div>
        <div class="value">{{ project_key }}</div>
      </div>
      <div class="pair">
        <div class="key" style="vertical-align: middle">开通服务：</div>
        <div class="value" v-if="services.length == 0">
          目前还没有开通服务哦~
        </div>
        <el-tag class="tag" v-for="service in services" :key="service">
          {{ service }}
        </el-tag>
        <el-link
          icon="el-icon-edit"
          type="primary"
          @click="choose = true"
          style="margin-left: 30px"
          ><span v-if="services.length == 0">立刻选择</span
          ><span v-else>重新选择</span></el-link
        >
      </div>
      <el-input
        v-show="change"
        class="input"
        v-model="new_project_name"
        ref="inputRef"
        @blur="confirm"
      >
      </el-input>
      <el-link
        v-show="change"
        type="primary"
        class="finish"
        style="left: 400px"
        @click="confirm"
        >完成</el-link
      >
    </div>
    <el-dialog title="请选择服务" :visible.sync="choose" width="500px" center>
      <div class="service_pair">
        <div class="type">OCR:</div>
        <el-checkbox v-model="checklist[0]">图片转写</el-checkbox>
      </div>
      <div class="service_pair">
        <div class="type">试题分析:</div>
        <el-checkbox v-model="checklist[1]">相似度估计</el-checkbox>
        <el-checkbox v-model="checklist[2]">属性预估</el-checkbox>
      </div>
      <div class="service_pair">
        <div class="type">试卷切分:</div>
        <el-checkbox v-model="checklist[3]">试卷打散入库</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Cancel">取 消</el-button>
        <el-button type="primary" @click="ChangeServices">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {
      project_id: "",
      project_name: "",
      new_project_name: "",
      change: false,
      description: "",
      project_key: "",
      services: [],
      choose: false,
      all_services: ["图片转写", "属性预估", "相似度估计", "试卷打散入库"],
      checklist: [],
    };
  },
  mounted() {
    this.project_id = this.$route.query.project_id;
    this.ToTop();
    Axios.post("https://ailab-api-275-production.env.bdaa.pro/v1/prog/detail", {
      project_id: this.project_id,
    }).then((data) => {
      if (data.data.success) {
        this.project_id = data.data.project_id;
        this.project_name = data.data.project_name;
        this.new_project_name = this.project_name;
        this.description = data.data.description;
        this.project_key = data.data.project_key;
        this.services = data.data.services;
        for (let i = 0; i < this.all_services.length; i++)
          if (this.services.indexOf(this.all_services[i]) != -1)
            this.checklist.push(true);
          else this.checklist.push(false);
      } else {
        this.$message({
          showClose: true,
          message: data.data.errMsg,
          type: "error",
        });
      }
    });
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
      Axios.post("https://ailab-api-275-production.env.bdaa.pro/v1/prog/edit", {
        project_id: this.project_id,
        services: this.services,
        new_project_name: this.new_project_name,
      }).then((data) => {
        if (this.project_name != this.new_project_name)
          if (data.data.success) {
            this.$message({
              showClose: true,
              message: "项目名称修改成功",
              type: "success",
            });
            this.project_name = this.new_project_name;
            location.reload();
          } else {
            console.log(data.data.errMsg);
            this.$message({
              showClose: true,
              message: "昵称修改失败",
              type: "error",
            });
          }
      });
      this.change = false;
    },
    Cancel() {
      this.checklist.length = 0;
      for (let i = 0; i < this.all_services.length; i++)
        if (this.services.indexOf(this.all_services[i]) != -1)
          this.checklist.push(true);
        else this.checklist.push(false);
      this.choose = false;
    },
    ChangeServices() {
      this.services.length = 0;
      for (let i = 0; i < this.all_services.length; i++)
        if (this.checklist[i]) this.services.push(this.all_services[i]);
      Axios.post("https://ailab-api-275-production.env.bdaa.pro/v1/prog/edit", {
        project_id: this.project_id,
        services: this.services,
        // new_project_name: this.new_project_name,
      }).then((data) => {
        if (data.data.success) {
          this.$message({
            showClose: true,
            message: "服务修改成功",
            type: "success",
          });
        } else {
          console.log(data.data.errMsg);
          this.$message({
            showClose: true,
            message: data.data.errMsg,
            type: "error",
          });
        }
        this.choose = false;
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
  margin: 20px 40px;
  padding-top: 24px;
  padding-bottom: 44px;
  background: #ffffff;
  border: 1px solid #a6a6a6;
  border-radius: 8px;
  .pair {
    width: calc(100% - 128px);
    height: auto;
    margin: 40px 70px;
    font-family: "Roboto";
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
    .key {
      vertical-align: top;
      display: inline-block;
      color: #7f8485;
    }
    .value {
      vertical-align: top;
      display: inline-block;
      color: #000000;
      margin-left: 20px;
      max-width: 800px;
      word-break: break-all;
    }
    .tag {
      margin: 0 10px;
      width: auto;
      border: 2px solid #b4d9ff;
      border-radius: 10px;
      color: black;
    }
  }
  .input {
    position: absolute;
    width: 200px;
    height: 22px;
    left: 160px;
    top: 58px;
  }
  .finish {
    position: absolute;
    height: 22px;
    line-height: 22px;
    left: 360px;
    top: 68px;
  }
}

.service_pair {
  width: calc(100% - 95px);
  margin: 30px 47.5px;
  font-family: "Roboto";
  font-style: normal;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #000000;
  .type {
    width: 70px;
    text-align: right;
    font-weight: 500;
  }
  .el-checkbox {
    font-weight: 400;
    margin: 0 20px;
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