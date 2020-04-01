<template>
  <div class="similarity">
    <div class="panel">
      <el-row type="flex" justify="start">
        <el-button type="submit" value="提交" @click="submit">评估</el-button>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div class="input_content">
            <form @submit.prevent="submit" style="margin-top: 20px;">
              <el-row type="flex" class="row-bg" justify="center">
                <el-input
                  type="textarea"
                  :rows="18"
                  v-model="content_1"
                  placeholder="请输入试题1内容"
                >
                </el-input>
              </el-row>
            </form>
          </div>
        </el-col>
        <el-col :span="11" :offset="1">
          <div class="input_content">
            <form @submit.prevent="submit" style="margin-top: 20px;">
              <el-row type="flex" class="row-bg" justify="center">
                <el-input
                  type="textarea"
                  :rows="18"
                  v-model="content_2"
                  placeholder="请输入试题2内容"
                >
                </el-input>
              </el-row>
            </form>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" v-if="show_result">
        <span>结果：</span>
        <el-tag>{{ similarity_result }}</el-tag>
      </el-row>
    </div>
  </div>
</template>

<script>
import Mathdown from "./Mathdown.vue";
export default {
  components: { Mathdown },
  name: "similarity",
  data() {
    return {
      content_1: "", // 用户输入试题1文本
      content_2: "", // 用户输入试题2文本
      similarity_result: "", // 相似度预估返回值
      show_result: false,
      loading: false
    };
  },
  methods: {
    // 提交评估按钮，向后端发送请求
    submit() {
      document.documentElement.scrollTop = 200;
      this.loading = true;
      this.show_result = true;
      let param = new FormData();
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      param.append("content_1", this.content_1); // 后端接收content1字段
      param.append("content_2", this.content_2); // 后端接收content2字段
      // 请求相似度预估接口
      this.$http
        .post(this.backendIP + "/api/similarity", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          this.similarity_result = data.data.similarity;
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.similarity {
  background: url("/static/sub_bg.png");
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
.logo {
  margin-left: 50px;
}
.format_content {
  margin-top: 20px;
  border: 1px solid #999;
  height: 350px;
  overflow: scroll;
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
</style>

<style type="text/css">
.el-tabs__item {
  color: #0a1612 !important;
  font-weight: 900 !important;
}
.el-tabs__item.is-active {
  background-color: #0a1612 !important;
  color: #fff !important;
  font-weight: 900 !important;
}
.el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  outline: none;
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #c5c1c0 !important;
}
</style>
