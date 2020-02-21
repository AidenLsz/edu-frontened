<template>
  <div class="estimate">
    <div class="panel">
      <!-- header -->
      <el-row>
        <el-col :span="6">
          <div class="logo">
            <el-dropdown @command="handleCommand">
              <el-button ref="attribute">
                试题属性（默认自动检测）
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="默认检测">默认检测</el-dropdown-item>
                <el-dropdown-item command="数学">数学</el-dropdown-item>
                <el-dropdown-item command="英语">英语</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
        <el-col :span="6" :offset="10">
          <div>
            <el-row type="flex" justify="start">
              <h5 style="color: #ff9900;">难度预估结果：</h5>
              <h5>{{ estimate_value }}</h5>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <!-- header -->
      <!-- main -->
      <el-row>
        <el-col :span="11">
          <div class="input_content">
            <form @submit.prevent="submit" style="margin-top: 20px;">
              <el-row type="flex" class="row-bg" justify="center">
                <el-input
                  type="textarea"
                  :rows="24"
                  v-model="content"
                  placeholder="请输入内容"
                ></el-input>
              </el-row>
              <el-row>
                <el-col :span="4">
                  <el-button type="submit" value="提交" @click="submit"
                    >评估
                  </el-button>
                </el-col>
                <el-col :span="6" :offset="12">
                  <div id="wrapper">
                    <div class="upload-btn">
                      <label>
                        <input
                          type="file"
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
      <!-- main -->
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
      estimate_value: 1,
      src: [],
      isShow: false,
      order: 0,
      filelists: []
    };
  },
  watch: {
    src(now, old) {
      console.log("-------");
    }
  },
  methods: {
    submit() {
      this.$http
        .post()
        // 改
        // this.backendIP + "/api/surface",
        // { exercise_text: this.exercise_text, entity_type: this.entity_type },
        // { emulateJSON: true }
        .then(function(data) {
          // 加
        });
    },
    handleCommand(command) {
      this.$refs.attribute.$el.innerText = command;
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
    }
  }
};
</script>

<style scoped lang="scss">
.estimate {
  background: url("/static/sub_bg.png") no-repeat;
  padding: 20px 20px 20px 20px;
}
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
}
.logo {
  margin-left: 50px;
}
.format_content {
  margin-top: 20px;
  border: 1px solid #999;
  height: 570px;
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
  background-color: #ffd700 !important;
  color: #1a2930 !important;
  border-color: #ffd700 !important;
}
.el-button:hover {
  background-color: #ff9900 !important;
  color: #fff !important;
  border-color: #fff !important;
}
.el-button:focus {
  outline: none !important;
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
</style>
