<template>
  <div class="exercise" style="margin-bottom: 40px">
    <!-- header -->
    <el-row justify="start" type="flex">
      <el-col :offset="2">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>试题检索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="padding-left: 1.5vw; margin-top: 4vh" type="flex" v-if="simpleInput">
      <el-col :span="11" :offset="2">
        <el-input v-model="exercise_text" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="2" :offset="1">
        <el-button type="primary" plain @click="changeInput">
          <span style="font-weight: bold">切换多格式输入</span>
        </el-button>
      </el-col>
      <el-col :span="1" :offset="1">
        <el-button type="primary" plain value="提交" @click="submit">
          <span style="font-weight: bold">检索</span>
        </el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 4vh; padding-left: 1.5vw" v-if="!simpleInput" type="flex">
      <el-col :span="2" :offset="2" style="padding-top: 14vh">
        <el-row>
          <el-button type="primary" plain  @click="changeInput">
            <span style="font-weight: bold">切换简单输入</span>
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" plain  value="提交" @click="submit">
            <span style="font-weight: bold">检索</span>
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="18">
        <el-row>
          <ComplexInput @Update_CI="UCI" @Update_Image="UCII"></ComplexInput>
        </el-row>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row type="flex" justify="center" style="margin-top: 4vh;" >
      <el-col :span="20">
        <div class="result">
          <el-row type="flex" justify="start">
            <h4 style="color: #0a1612; font-weight: bold">试题检索</h4>
          </el-row>
          <el-row type="flex" justify="start">
            <h3 style="color: #0a1612;">试题文本</h3>
          </el-row>
          <el-row type="flex" justify="start">
            <el-col style="text-align: left">
              <p>{{ raw_text }}</p>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start" style="margin-top: 3vh">
            <el-col :span="24">
              <el-row type="flex" justify="start">
                <h4 style="color: #0a1612; font-weight: bold">知识点</h4>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                style="height: 200px; margin-top: 5vh;"
                id="tabs"
              >
                <el-tab-pane label="人教版新" name="rjb_new" style="border: none">
                  <el-row
                    v-for="(entities, group, group_index) in entities_groups"
                    :key="group_index"
                  >
                    <el-row v-if="group_index == 0" type="flex" justify="start">
                    </el-row>
                    <el-row
                      v-if="group_index == 0"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference" id="tag">{{
                          entity.name
                        }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import Mathdown from "./Mathdown.vue";
import UploadImg from "./UploadImg.vue";
import ComplexInput from "./ComplexInput.vue";
export default {
  components: { Mathdown, UploadImg, ComplexInput },
  name: "exercise",
  data() {
    return {
      // 输入的简单文本
      exercise_text: "",
      // 试题文本
      raw_text: "试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本试题文本",
      // 题目内容
      entities_groups: {},
      entity_type: "kp2.0",
      sour: "",
      // Latex格式的内容
      content: "",
      // 当前是否为简单输入格式
      simpleInput: true,
      // 新版本用的mavon-editor带来的自带回调函数用的json格式
      // name: 图片名
      // info: base64转换后的数据段
      image_infos: [],
    };
  },
  watch:{
    sour(val) {
      this.submit();
    }
  },
  methods: {
    // Update_Complex_Input
    UCI(val){
      console.log(val);
      this.content = val;
    },
    // UCI_Images
    UCII(val){
      console.log(val);
      this.image_infos = val;
    },
    dataSource(tab, event) {
      this.sour = tab.name;
      //黄小青师兄12月提供数据
      if(this.sour == 'rjb_new'){
        this.entity_type = "kp2.0";
      }
      return tab.name;
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
    imgInfo(e) {
      this.src = e.src;
      this.filelists = e.filelists;
      console.log(e.src);
      console.log(e.filelists);
    },
   // 删除图片并保持图片数组顺序
    forkImage(index) {
      this.src.splice(index, 1);
      for (var i = 0; i < this.filelists.length; i++) {
        if (typeof this.filelists[i] === "undefined") {
          this.filelists.splice(i, 1);
          i = i - 1;
        }
      }
      this.filelists.splice(index, 1);
      document.getElementsByTagName("input").value = "";
      console.log(this.src);
      console.log(this.filelists);
      console.log(document.getElementsByTagName("input").value);
    },
    submit() {
      this.$http
        .post(
          this.backendIP + "/api/surface",
          { exercise_text: this.exercise_text, entity_type: this.entity_type },
          { emulateJSON: true }
        )
        .then(function(data) {
          console.log(data.data);
          this.raw_text = data.data.raw_text;
          this.entities_groups = data.data.entities_groups;
      });    
    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  // background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #F8FBFF;
  margin-left: 20px;
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

<style scoped type="text/css">
/* .el-button {
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
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
} */
.img-list-item {
  position: relative;
  margin: auto;
  display: inline-block;
}
.img-list-item img {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  vertical-align: middle;
  border: 0;
}
.img-list-item i.del-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  background-image: url(../assets/delete.jpeg);
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
  top: 0;
  right: 0;
}
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:24px 0
}
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs /deep/ .el-tabs__nav.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__header.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #36a9df !important;
}

</style>