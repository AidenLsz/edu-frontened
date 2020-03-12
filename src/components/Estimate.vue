<template>
  <div class="estimate">
    <div class="panel">
      <el-row>
        <el-col :span="4">
          <el-select v-model="value_id" placeholder="自动检测学科">
            <el-option
              v-for="subject in options"
              :key="subject.value_id"
              :label="subject.label"
              :value="subject.value_id"
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
      <el-row>
        <el-col :span="3">
          <h6 style="color: #0a1612;">难度预估结果：</h6>
        </el-col>
        <el-col :span="10">
          <div class="result" v-if="show_result">
            <el-col :span="4">
              <el-row v-for="attribute in checkList" :key="attribute">
                <h6>{{ attribute }}</h6>
                <!-- <el-tag>{{ result_difficulty }}</el-tag> -->
              </el-row>
            </el-col>
            <el-col :span="6">
              <el-row
                v-for="result in results"
                :key="result"
                style="margin-bottom: 15px; margin-top: -8px;"
              >
                <el-tag>{{ result }}</el-tag>
              </el-row>
            </el-col>
          </div>
        </el-col>
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
      content: "",
      results: [],
      result_knowledge_point: "",
      src: [],
      isShow: false,
      show_result: false,
      order: 0,
      filelists: [],
      checkList: [],
      options: [
        {
          value_id: "1",
          label: "数学"
        },
        {
          value_id: "2",
          label: "英语"
        }
      ],
      value_id: ""
    };
  },
  watch: {
    // src(now, old) {},
    checkList(now, old) {
      this.show_result = false;
    }
  },
  methods: {
    submit() {
      // console.log(this.filelists);
      this.results = [];
      this.show_result = true;
      // 上传图片
      let param = new FormData();
      for (var i = 0; i < this.filelists.length; i++) {
        param.append("file[]", this.filelists[i]);
      }
      let config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      if (this.checkList.length === 2) {
        this.checkList[0] = "难度";
        this.checkList[1] = "知识点";
      }
      if (this.checkList.indexOf("难度") > -1) {
        // 难度属性接口
        this.$http
          .post(
            this.backendIP + "/api/difficulty",
            param,
            config,
            { estimate_content: this.content, estimate_subject: this.value_id },
            { emulateJSON: true }
          )
          .then(function(data) {
            this.results.push(data.data.difficulty);
          });
      }
      if (this.checkList.indexOf("知识点") > -1) {
        // 知识点属性接口
        this.$http
          .post(
            this.backendIP + "/api/kp",
            param,
            config,
            { estimate_content: this.content, estimate_subject: this.value_id },
            { emulateJSON: true }
          )
          .then(function(data) {
            this.results.push(data.data.knowledge_point);
          });
      }
    },
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
      // 文件列表去除empty
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
