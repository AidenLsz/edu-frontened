<template>
  <div class="estimate">
    <div class="panel">
      <el-row>
        <el-col :span="4">
          <el-select v-model="subject_id" placeholder="选择学科">
            <el-option
              v-for="subject in options"
              :key="subject.value_id"
              :label="subject.label"
              :value="subject.value_id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="type_id" placeholder="选择题型">
            <el-option
              v-for="type in type_options"
              :key="type.value_id"
              :label="type.label"
              :value="type.value_id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" style="margin-top: 10px;">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="难度"></el-checkbox>
            <el-checkbox label="知识点"></el-checkbox>
          </el-checkbox-group>
        </el-col>
        <el-col :span="2">
          <el-button type="submit" value="提交" @click="submit"
            >评估
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <div class="input_content">
            <form @submit.prevent="submit" style="margin-top: 20px;">
              <el-row type="flex" class="row-bg" justify="center">
                <el-input
                  type="textarea"
                  :rows="14"
                  v-model="content"
                  placeholder="请输入内容"
                >
                </el-input>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <div id="wrapper">
                    <div class="upload-btn">
                      <label>
                        <input
                          type="file"
                          name="file"
                          @change="uploadImg"
                          accept="image/png, image/jpeg"
                          multiple
                        />点击这里上传图片
                      </label>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </form>
          </div>
        </el-col>
        <el-col :span="12" :offset="1">
          <div class="format_content">
            <Mathdown :content="content"></Mathdown>
            <div
              class="img-list-item"
              v-for="(item, index) in src"
              :key="index"
            >
              <img v-if="isShow" :src="item" class="common" />
              <i class="del-img" @click="forkImage(index)"></i>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row v-loading="loading">
        <el-row type="flex" justify="start">
          <h6 style="color: #0a1612;">预估结果：</h6>
        </el-row>
        <el-row>
          <div class="result" v-if="show_result">
            <el-row
              type="flex"
              justify="start"
              v-if="checkList.indexOf('难度') > -1"
            >
              <el-col :span="6">
                <span>难度：</span>
                <el-tag>{{ difficulty_result }}</el-tag>
              </el-col>
              <el-col :span="6">
                <el-slider
                  v-model="difficulty_result"
                  :max="1"
                  disabled
                  :marks="marks"
                  style="margin-top: -8px;"
                >
                </el-slider>
              </el-col>
            </el-row>
            <el-row
              type="flex"
              justify="start"
              v-if="checkList.indexOf('知识点') > -1"
            >
              <el-col :span="6">
                <span>知识点：</span>
                <el-tag>{{ kp_result }}</el-tag>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-row>
    </div>
  </div>
</template>

<script>
import Mathdown from "./Mathdown.vue";
export default {
  components: { Mathdown },
  name: "estimate",
  data() {
    return {
      content: "", // 用户输入试题文本
      difficulty_result: "", // 难度预估返回值
      kp_result: "", // 知识点返回值
      src: [], // 图片数组
      isShow: false,
      show_result: false,
      order: 0,
      filelists: [],
      checkList: [],
      // 学科选择属性
      options: [
        {
          value_id: "1", // 学科值
          label: "数学" // 学科名
        },
        {
          value_id: "2",
          label: "英语"
        }
      ],
      subject_id: "",
      type_options: [], // 题型选择属性
      type_id: "",
      marks: {
        0: "易",
        1: "难"
      },
      loading: false
    };
  },
  watch: {
    checkList(now, old) {
      this.show_result = false;
    },
    subject_id() {
      if (this.subject_id === "1") {
        this.type_options = [
          {
            value_id: "1-1", // 数学题型值
            label: "选择" // 数学题型名
          },
          {
            value_id: "1-2",
            label: "填空"
          },
          {
            value_id: "1-3",
            label: "解答"
          }
        ];
      }
      if (this.subject_id === "2") {
        this.type_options = [
          {
            value_id: "2-1", // 英语题型值
            label: "选择" // 英语题型名
          },
          {
            value_id: "2-2",
            label: "完形填空"
          },
          {
            value_id: "2-3",
            label: "阅读理解"
          }
        ];
      }
    }
  },
  methods: {
    // 提交评估按钮，向后端发送请求
    submit() {
      document.documentElement.scrollTop = 380;
      this.loading = true;
      this.show_result = true;
      let param = new FormData();
      for (var i = 0; i < this.filelists.length; i++) {
        param.append("file[]", this.filelists[i]);
      }
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      param.append("estimate_content", this.content); // 后端接收estimate_content字段
      param.append("estimate_subject", this.subject_id); // 后端接收estimate_subject字段
      param.append("exercise_type", this.type_id); // 后端接收exercise_type字段
      if (this.checkList.length === 2) {
        this.checkList[0] = "难度";
        this.checkList[1] = "知识点";
      }
      if (this.checkList.indexOf("难度") > -1) {
        // 请求难度属性接口
        this.$http
          .post(this.backendIP + "/api/difficulty", param, config, {
            emulateJSON: true
          })
          .then(function(data) {
            this.difficulty_result = data.data.difficulty;
            this.loading = false;
          });
      }
      if (this.checkList.indexOf("知识点") > -1) {
        // 请求知识点属性接口
        this.$http
          .post(this.backendIP + "/api/kp", param, config, {
            emulateJSON: true
          })
          .then(function(data) {
            this.kp_result = data.data.knowledge_point;
            this.loading = false;
          });
      }
    },
    // 处理用户上传图片，存入图片数组
    uploadImg(e) {
      let _this = this;
      let length = e.target.files.length;
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      for (var i = _this.order; i < _this.order + length; i++) {
        let reader = new FileReader();
        _this.filelists[i] = e.target.files[i - _this.order];
        reader.readAsDataURL(_this.filelists[i]); // 转换
        reader.onloadend = function() {
          _this.src.push(this.result);
          _this.isShow = true;
        };
      }
      _this.order = _this.order + length;
    },
    forkImage(index) {
      this.src.splice(index, 1);
      for (var i = 0; i < this.filelists.length; i++) {
        if (typeof this.filelists[i] === "undefined") {
          this.filelists.splice(i, 1);
          i = i - 1;
        }
      }
      this.filelists.splice(index, 1);
    }
  }
};
</script>

<style scoped lang="scss">
.estimate {
  background: url("/static/sub_bg.png") no-repeat;
  padding: 20px 20px 20px 20px;
  background-size: cover;
}
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 3%;
  height: 1200px;
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

<style>
.links path {
  fill: none;
  stroke: #999;
  stroke-opacity: 0.6;
}
marker {
  fill: #999;
  opacity: 0.6;
}
.nodes circle {
  stroke: #fff;
  stroke-width: 3px;
  r: 25px;
}
text {
  pointer-events: none;
}
image {
  pointer-events: none;
}
.d3-tip {
  line-height: 1;
  width: 20%;
  padding: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  border-radius: 4px;
  font-size: 10px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
  box-sizing: border-box;
  display: inline;
  font-size: 10px;
  width: 100%;
  line-height: 1;
  color: rgba(0, 0, 0, 0.8);
  content: "\25BC";
  position: absolute;
  text-align: center;
}
/* Style northward tooltips specifically */
.d3-tip.n:after {
  margin: -2px 0 0 0;
  top: 100%;
  left: 0;
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
.upload-btn {
  padding: 6px 6px;
  height: 40px;
  width: 160px;
  position: relative;
  cursor: pointer;
  color: #888;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: inline-block;
  *display: inline;
  *zoom: 1;
}
input[type="file"] {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
.el-dropdown-menu__item:hover {
  background-color: #fff !important;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a2930;
}
.el-select-dropdown__item.selected {
  color: #1a2930;
}
.el-select-dropdown__item.hover {
  background-color: #ff9999;
}
</style>
