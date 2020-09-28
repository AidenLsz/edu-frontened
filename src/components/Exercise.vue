<template>
  <div class="exercise">
    <!-- header -->
    <el-row style="padding-top: 15px;" v-if="simpleInput">
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_exercise.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <el-row type="flex" justify="center">
          <el-col :span="22">
            <el-input v-model="exercise_text" placeholder="请输入内容">
              <template slot="append">
                <span style="cursor:pointer" @click="changeInput">
                  切换多格式输入
                </span>
              </template>
            </el-input>
          </el-col>
          <el-button type="submit" value="提交" @click="submit"
            >检索
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <el-row v-if="!simpleInput" type="flex" justify="center">
      <el-col :span="3" style="margin-top: 100px;">
        <img src="../assets/title_exercise.png" alt="logo" />
      </el-col>
      <el-col
        :span="18"
        style="margin-top: 20px; margin-bottom: -20px;"
        v-if="!simpleInput"
      >
        <el-row>
          <el-tabs type="border-card" id="tabs">
            <el-tab-pane label="多格式文本">
              <el-input
                type="textarea"
                :rows="8"
                v-model="content"
                placeholder="请输入内容"
              >
              </el-input>
            </el-tab-pane>
            <el-tab-pane label="LaTex预览">
              <div style="height:180px; overflow-y:scroll;">
                <Mathdown :content="content"></Mathdown>
                <div
                  class="img-list-item"
                  v-for="(item, index) in src"
                  :key="index"
                >
                  <img :src="item" class="common" />
                  <i class="del-img" @click="forkImage(index)"></i>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <UploadImg
            style="position: absolute;left:250px;top:0px;"
            :src="src"
            :filelists="filelists"
            @uploadImg="imgInfo"
          ></UploadImg>
          <span
            style="cursor:pointer;position:absolute;right:5px;top:12px;font-size:12px;"
            @click="changeInput"
          >
            切换简单输入
          </span>
          <el-button
            size="small"
            style="position:absolute; right:90px; top:5px;"
          >
            检索
          </el-button>
        </el-row>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row type="flex" justify="center" style="border-top: 10px solid #111;">
      <el-col :span="22">
        <div class="result">
          <el-row type="flex" justify="start">
            <h5 style="color: #0a1612;">试题文本</h5>
          </el-row>
          <el-row type="flex" justify="start" class="title">
            {{ raw_text }}
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start">
            <el-col :span="24">
              <el-row>
                <h5 style="color: #0a1612; float: left;">知识点</h5>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                style="height: 200px; margin-top: -10px; margin-left: 0px;"
                id="tabs"
              >
                <el-tab-pane label="人教版新" name="rjb_new">
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
export default {
  components: { Mathdown, UploadImg },
  name: "exercise",
  data() {
    return {
      exercise_text: "",
      raw_text: "",
      entities_groups: {},
      entity_type: "kp2.0",
      sour: "",
      content: "",
      simpleInput: true,
      src: [], // 图片数组
      filelists: []
    };
  },
  watch:{
    sour(val) {
      this.submit();
    }
  },
  methods: {
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
  background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #fff;
  margin-left: 20px;
  border-right: 14px solid #fff;
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
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
}
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
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #0a1612;
  font-weight: 900;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #0a1612;
  color: #fff;
  font-weight: 900;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #c5c1c0 !important;
}
</style>