<template>
  <div class="estimate"  style="margin-top: 5vh">
    <div class="panel">
      <el-row justify="start" type="flex">
        <el-col style="padding-left: 5vw">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>试题属性预估</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <el-row style="padding-top: 4vh; padding-left: 5vw">
        <el-col :span="4">
          <el-select v-model="subject_id" placeholder="请先在此选择学科">
            <el-option
              v-for="subject in options"
              :key="subject.value_id"
              :label="subject.label"
              :value="subject.value_id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-select v-model="type_id" placeholder="选择学科后选择题型" :disabled="subject_id == ''">
            <el-option
              v-for="type in type_options"
              :key="type.value_id"
              :label="type.label"
              :value="type.value_id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type="primary" value="提交" @click="submit" :disabled="Estimate_Check()"
              >评估
            </el-button>
        </el-col>
        <el-col :span="10" style="font-size: 16px; color: grey; padding-top:6px; ">
          <span>*选择学科、类别，并填写题目后方可提交*</span>
        </el-col>
      </el-row>
      <el-row type="flex" justify="start" style="padding-top: 3vh; padding-left: 5vw">
        <el-col :span="2.5">
          <span>预测属性勾选：</span>
        </el-col>
        <el-col :span="5">
          <el-checkbox-group v-model="checkList" id="checkbox">
            <el-checkbox label="难度"></el-checkbox>
            <el-checkbox label="知识点"></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row style="padding-top: 2vh; padding-left: 5vw; z-index: 1" type="flex" justify="start" >
        <ComplexInput @Update_CI="UCI" @Update_Image="UCII"></ComplexInput>
      </el-row>
      <div style="border-top: 3px solid #ccc; margin: 5vh 5vw 0 5vw; padding-top: 2vh">
        <el-row v-loading="loading">
          <el-row type="flex" justify="start">
            <h4 style="color: #0a1612;">预估结果：</h4>
          </el-row>

          <div class="result" v-if="show_result" style="margin: 0px 4vw">
            <el-row >
              <el-col :span="7" v-if="checkList.indexOf('难度') > -1">
                <el-card class="box-card">
                  <div slot="header" style="text-align:left;">
                    <span>难度</span>
                  </div>
                  <div style="text-align:left;">
                    <el-tag effect="plain" style="border: hidden; background: #F8FBFF">{{ difficulty_result }}</el-tag>
                  </div>
                </el-card>
              </el-col>
              <el-col
                :span="7"
                :offset="1"
                v-if="checkList.indexOf('知识点') > -1"
              >
                <el-card class="box-card">
                  <div slot="header" style="text-align:left;">
                    <span v-if="subject_id == 'math'">知识点（标号越小权重越大，无标号则权重较低）</span>
                    <span v-if="subject_id != 'math'">知识点</span>
                  </div>
                  <div style="text-align:left;" v-if="subject_id == 'math'">
                    <el-tag style="background: #F8FBFF" v-for="(item, index) in kp_result" :key="index" effect="plain" class="kp_tag">
                      <el-badge :hidden="kp_priority.indexOf(item) == -1" :value="kp_priority.indexOf(item) + 1" class="kp_badge">
                        {{ item }}
                      </el-badge>
                    </el-tag>
                  </div>
                  <div style="text-align:left; background: #F8FBFF" v-if="subject_id != 'math'">
                    <el-tag class="kp_tag" effect="plain">暂不支持数学题目以外的知识点查询</el-tag>

                  </div>
                </el-card>
              </el-col>
              <el-col
                :span="8"
                :offset="1"
                v-if="checkList.indexOf('知识点') > -1"
              >
                <el-card class="box-card">
                  <div slot="header" style="text-align:left;">
                    <span>知识树状结构</span>
                  </div>
                  <el-tree style="background: #F8FBFF" :data="kp_layer" :props="defaultProps" v-if="subject_id == 'math'"></el-tree>
                  <el-tag  style="background: #F8FBFF" class="kp_tag" effect="plain" v-if="subject_id != 'math'">暂不支持数学题目以外的知识点结构查询</el-tag>

                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>

// import Mathdown from "./Mathdown.vue";
// import UploadImg from "./UploadImg.vue";
import ComplexInput from "../common/components/ComplexInput.vue";
export default {
  components: { ComplexInput},
  name: "estimate",
  data() {
    return {
      content: "", // 用户输入试题文本
      difficulty_result: "", // 难度预估返回值
      kp_result: "", // 知识点返回值
      kp_layer: "",
      kp_priority: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      src: [], // 图片数组
      show_result: false,
      order: 0,
      filelists: [],
      checkList: ["难度", "知识点"],
      // 学科选择属性
      options: [
        {
          value_id: "math", // 学科值
          label: "数学" // 学科名
        },
        {
          value_id: "english",
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
    checkList() {
      this.show_result = false;
    },
    subject_id() {
      if (this.subject_id === "math") {
        this.type_options = [
          {
            value_id: "selection_test", // 数学题型值
            label: "选择" // 数学题型名
          },
          {
            value_id: "fill_test",
            label: "填空"
          },
          {
            value_id: "answer_test",
            label: "解答"
          }
        ];
      }
      if (this.subject_id === "english") {
        this.type_options = [
          {
            value_id: "selection_test", // 英语题型值
            label: "选择" // 英语题型名
          },
          {
            value_id: "cloze_test",
            label: "完形填空"
          },
          {
            value_id: "read_understand_test",
            label: "阅读理解"
          }
        ];
      }
    }
  },
  mounted(){
    this.ToTop();
  },
  methods: {
    ToTop(){
      window.scrollTo(0,0);
    },
    // 提交评估按钮，向后端发送请求
    submit() {
      if (this.checkList.length === 0) {
        return;
      }
      document.documentElement.scrollTop = 200;
      this.loading = true;
      this.show_result = true;
      let param = new FormData();
      var temp_list = [];
      for(var i = 0; i < this.filelists.length; i++){
        temp_list.push(this.filelists[i])
      }
      param.append("files", JSON.stringify(temp_list));
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
            this.kp_result = data.data.knowledge_point.kp;
            this.kp_layer = data.data.knowledge_point.kp_layer;
            this.kp_priority = data.data.knowledge_point.kp_priority;
            this.loading = false;
          });
      }
    },
    // imgInfo(e) {
    //   this.src = e.src;
    //   this.filelists = e.filelists;
    //   console.log(e.src);
    //   console.log(e.filelists);
    // },
    // // 删除图片并保持图片数组顺序
    // forkImage(index) {
    //   this.src.splice(index, 1);
    //   for (var i = 0; i < this.filelists.length; i++) {
    //     if (typeof this.filelists[i] === "undefined") {
    //       this.filelists.splice(i, 1);
    //       i = i - 1;
    //     }
    //   }
    //   this.filelists.splice(index, 1);
    //   document.getElementsByTagName("input").value = "";
    //   // console.log(this.src);
    //   // console.log(this.filelists);
    //   // console.log(document.getElementsByTagName("input").value);
    // },
    Estimate_Check(){
      if(this.subject_id == "" || this.type_id == "" || this.content == ""){
        return true
      }else{
        return false
      }
    },
    // Update Complex Input，将组合输入的内容复制到当前搜索框应该具有的内容里
    UCI(val){
      this.content = val;
    },
    // Update Complex Input Image，将组合输入的内容的图片部分复制到当前页面的内容里，如果后续又要用到则进行调用
    UCII(val){
      this.filelists = val;
    },
  }
};
</script>

<style scoped lang="scss">
.el-card{
  background-color: #F8FBFF;
}
.estimate {
  // background: url("../assets/sub_bg.png");
  background-size: 100%;
  // padding: 20px 20px 0px 20px;
}
.panel {
  background-color: #fff;
  border-radius: 4px;
  min-height: 1000px;
  box-shadow: none;
}
.logo {
  margin-left: 50px;
}
.kp_badge {
  padding-right: 10px;
}
.kp_tag {
  margin: 5px;
  border: hidden;
}
.format_content {
  margin-top: 20px;
  border: 1px solid #999;
  height: 180px;
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
  outline: none;
  background-color: #008080;
  color: #fff;
  border-color: #fff;
} */
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:8vh 0
}
</style>

<style scoped>
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
#checkbox /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a2930;
}
.el-select-dropdown__item.selected {
  color: #1a2930;
}
.el-select-dropdown__item.hover {
  background-color: #9cd6f1;
}
</style>
