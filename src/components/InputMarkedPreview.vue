<template>
  <div id="import_preview">
    <div class="panel">
      <el-row type="flex" justify="start">
        <h6>原题目：</h6>
      </el-row>
      <el-row class="row_border">
        <Mathdown :content="content"></Mathdown>
      </el-row>
      <div style="margin-top:10px;"></div>
      <el-row>
        <el-row type="flex" justify="start">
          <h6>预估属性如下，可点击修改属性内容</h6>
        </el-row>
        <el-col :span="11">
          <el-card class="box-card">
            <div slot="header" style="text-align:left;">
              <span>属性1：知识点</span>
            </div>
            <div style="text-align:left;">
              <input class="prediction_input" v-model="pre_input1" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-card class="box-card">
            <div slot="header" style="text-align:left;">
              <span>属性2：难度</span>
            </div>
            <div style="text-align:left;">
              <input class="prediction_input" v-model="pre_input2" />
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div style="margin-top:10px;"></div>
      <el-row type="flex" justify="end">
        <el-button @click="submit()">提交</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import Mathdown from "./Mathdown.vue";
export default {
  components: { Mathdown },
  data() {
    return {
      content: "",
      pre_input1: "",
      pre_input2: ""
    };
  },
  beforeMount() {
    this.content = sessionStorage.getItem("content");
    this.getPrediction();
  },
  methods: {
    submit() {
      alert("已提交至校对界面，请等待管理员审核！");
    },
    // 获取预测属性初值
    getPrediction() {
      this.$http
        .post(
          this.backendIP + "/api/attribute",
          { content: this.content },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.pre_input1 = data.data.attribute1;
          this.pre_input2 = data.data.attribute2;
        });
    },
    reset() {
      this.getPrediction();
    }
  }
};
</script>
<style scoped>
#import_preview {
  background: url("../assets/sub_bg.png");
  background-size: 100%;
  padding: 20px 20px 0px 20px;
}
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 3%;
  height: 750px;
}
.row_border {
  border: 1px solid #000;
  text-align: center;
  padding: 5px 5px;
}
.prediction_input {
  height: 30px;
  width: 330px;
  border-radius: 4px;
  border: 0px;
}
</style>
