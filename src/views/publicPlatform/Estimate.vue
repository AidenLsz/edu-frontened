<template>
  <div 
    v-loading="content=='识别中...'"
    element-loading-text="识别中，请等待..."
    element-loading-spinner="el-icon-loading"
    class="estimate" style="margin-top: 5vh">
    <div class="panel">
      <el-row justify="start" type="flex">
        <el-col style="padding-left: 5vw">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>AI实验室</el-breadcrumb-item>
            <el-breadcrumb-item>
              试题属性预估
              <span @click="openInstructionDialog" style="cursor: pointer">
                <i class="el-icon-question"></i>
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <instruction ref="instruction" />
      <!-- 
			<el-row style="margin: 30px 0px 10px 0px">
				<label style="font-size: 30px">属性预估</label>
			</el-row>

			<el-row style="margin: 50px 200px 10px 200px">
				<p style="font-size: 18px;">
					试题属性预估旨在自动预测试题的难度、信效度和知识点等属性，以提高学生的做题效率和提升组卷的质量。我们从包含复杂语义的试题文本出发，从大量数据中挖掘属性相关的重要信息，实现高效、客观的自动化属性预估。
				</p>
			</el-row> -->

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
          <el-select
            v-model="type_id"
            placeholder="选择学科后选择题型"
            :disabled="subject_id == ''"
          >
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
          <el-button
            type="primary"
            value="提交"
            @click="submit"
            :disabled="Estimate_Check()"
            >评估
          </el-button>
        </el-col>
        <!-- <el-col :span="10" style="font-size: 16px; color: grey; padding-top:6px; ">
					<span>*选择学科、类别，并填写题目后方可提交*</span>
				</el-col> -->
      </el-row>

      <el-row
        type="flex"
        justify="start"
        style="padding-top: 3vh; padding-left: 5vw"
      >
        <el-col :span="2.5">
          <span>预测属性勾选：</span>
        </el-col>
        <el-col :span="7">
          <el-checkbox-group v-model="checkList" id="checkbox">
            <el-checkbox label="难度"></el-checkbox>
            <el-checkbox label="知识点"></el-checkbox>
            <el-checkbox label="区分度"></el-checkbox>
            <el-checkbox label="信度"></el-checkbox>
            <el-checkbox label="素养"></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <div id="main">
        <!-- <div class="introduction" style="top:0px;">
					<h2>使用说明</h2>
					<p>选择学科、类别，并填写题目后方可提交，题目内容支持url或本地上传图片并识别，也可以通过LUNA输入助手手动编辑</p>
				</div>
				<div class="example" style="top:325px;">
					API示例
				</div> -->

        <div id="exercise">
          <!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII"></ComplexInput> -->
          <Dialogue
            style="height: 100%; width: 100%"
            :optional_image="optional_image"
            @Update_CI="UCI"
          >
          </Dialogue>
        </div>

        <div id="result">
          <div
            style="
              font-size: 30px;
              font-weight: bold;
              text-align: left;
              margin: 20px 20px 20px 20px;
            "
          >
            预估结果
          </div>

          <el-row v-loading="loading">
            <div v-if="show_result">
              <el-row
                v-if="
                  checkList.indexOf('难度') > -1 ||
                  checkList.indexOf('区分度') > -1
                "
              >
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('难度') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span>难度</span>
                    </div>
                    <div style="text-align: left">
                      <el-tag
                        effect="plain"
                        style="border: hidden; background: #a7cdff"
                      >
                        {{ difficulty_result }}
                      </el-tag>
                    </div>
                  </el-card>
                </el-col>
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('区分度') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span>区分度</span>
                    </div>
                    <div style="text-align: left">
                      <el-tag
                        effect="plain"
                        style="border: hidden; background: #a7cdff"
                      >
                        {{ disc_result }}
                      </el-tag>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row
                v-if="
                  checkList.indexOf('信度') > -1 ||
                  checkList.indexOf('素养') > -1
                "
              >
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('信度') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span>信度</span>
                    </div>
                    <div style="text-align: left">
                      <el-tag
                        effect="plain"
                        style="border: hidden; background: #a7cdff"
                      >
                        {{ rel_result }}
                      </el-tag>
                    </div>
                  </el-card>
                </el-col>
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('素养') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span>素养</span>
                    </div>
                    <div style="text-align: left">
                      <el-tag
                        effect="plain"
                        style="border: hidden; background: #a7cdff"
                      >
                        {{ lp_result }}
                      </el-tag>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
              <el-row v-if="checkList.indexOf('知识点') > -1">
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('知识点') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span v-if="subject_id == '数学'"
                        >知识点（标号越小权重越大，无标号则权重较低）</span
                      >
                      <span v-if="subject_id != '数学'">知识点</span>
                    </div>
                    <div style="text-align: left">
                      <el-tag
                        style="background: #a7cdff"
                        v-for="(item, index) in kp_result"
                        :key="index"
                        effect="plain"
                        class="kp_tag"
                      >
                        <el-badge
                          :hidden="kp_priority.indexOf(item) == -1"
                          :value="kp_priority.indexOf(item) + 1"
                          class="kp_badge"
                        >
                          {{ item }}
                        </el-badge>
                      </el-tag>
                    </div>
                    <!-- <div style="text-align:left; background: #a7cdff" v-if="subject_id != '数学'">
											<el-tag style="background: #a7cdff" class="kp_tag" effect="plain">暂不支持数学以外的知识点查询</el-tag>
										</div> -->
                  </el-card>
                </el-col>
                <el-col
                  :span="12"
                  style="margin-bottom: 10px"
                  v-if="checkList.indexOf('知识点') > -1"
                >
                  <el-card class="card">
                    <div slot="header" style="text-align: left">
                      <span>知识树状结构</span>
                    </div>
                    <el-tree
                      style="background: #a7cdff"
                      :data="kp_layer"
                      :props="defaultProps"
                    >
                    </el-tree>
                    <!-- <el-tag style="background: #a7cdff" class="kp_tag" effect="plain"
											v-if="subject_id != '数学'">暂不支持数学以外的知识结构查询</el-tag> -->
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </el-row>
        </div>
      </div>
    </div>

    <!-- 侧边对话框 -->
    <div class="tab panel-btn" id="openBtn" @click="openPanel()">
      <div>使用说明</div>
      <i class="el-icon-d-arrow-right"></i>
    </div>
    <el-card class="box-card left" style="background-color: #ffffff">
      <div class="panel-btn" id="closeBtn" @click="closePanel()">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="container">
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> 介绍 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              试题属性预估旨在自动预测试题的难度、信效度和知识点等属性，以提高学生的做题效率和提升组卷的质量。我们从包含复杂语义的试题文本出发，从大量数据中挖掘属性相关的重要信息，实现高效、客观的自动化属性预估。
            </el-col>
          </el-row>
        </div>
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> API说明 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              <ul>
                <li>
                  <p>
                    URL:
                    https://math-difficulty-prediction-78-production.env.bdaa.pro/v2
                  </p>
                </li>
                <li>
                  <p>接口类型: POST请求</p>
                </li>
                <li>
                  <p>参数说明: data为试题列表，其中每道试题包含如下字段：</p>
                  <p><strong>接收参数</strong></p>
                  <el-table :data="ReceivedPara" border style="width: 100%">
                    <el-table-column prop="field" label="字段">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="necessary" label="是否必填">
                    </el-table-column>
                    <el-table-column prop="desc" label="描述">
                    </el-table-column>
                  </el-table>
                  <p><strong>返回参数</strong></p>
                  <el-table :data="ReturnedPara" border style="width: 100%">
                    <el-table-column prop="field" label="字段">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                    </el-table-column>
                    <el-table-column prop="desc" label="描述">
                    </el-table-column>
                  </el-table>
                </li>
              </ul>
            </el-col>
          </el-row>
        </div>
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> 使用示例 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              <pre><code>import base64
import json
import requests

def image_uri():
    encoded = base64.b64encode(open("test.jpg", "rb").read()).decode("utf-8")
    return "data:image/jpg;base64,%s" % encoded

url = "https://math-difficulty-prediction-78-production.env.bdaa.pro/v2"

data = [{
    "id": "123",
    "itemdata": {
    "text": "1+1",
    "images": image_uri(),
    }
}]

r = requests.post(url, data=json.dumps(data))

assert r.status_code == 200, r.status_code
print(json.loads(r.content)["data"])</code></pre>
              <p>
                如果<code>data</code>里不包含图片的话将<code>&quot;image&quot;</code>置为
                <code>&quot;&quot;</code> 即可, 即
              </p>
              <pre><code>data = [{
    "id": "123",
    "itemdata": {
    "text": "1+1",
    "images": image_uri(),
    }
}]</code></pre>
              <p>如果是有多张图片, 用空格分隔 uri:</p>
              <pre><code>data = [{
    "id": "123",
    "itemdata": {
    "text": "1+1",
    "images": image_uri() + " " + image_uri(),
    }
}]</code></pre>
              <p><code>注意: 本地测试使用 http, 远程服务端使用 https</code></p>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import Mathdown from "./Mathdown.vue";
// import UploadImg from "./UploadImg.vue";
// import ComplexInput from "@/common/components/ComplexInput.vue";
import Dialogue from "./components/Dialogue.vue";
import Instruction from "./components/InstructionEstimate.vue";
import $ from "jquery";
export default {
  components: {
    //ComplexInput,
    Instruction,
    Dialogue,
  },
  name: "estimate",
  data() {
    return {
      content: "", // 用户输入试题文本
      difficulty_result: "", // 难度预估返回值
      rel_result: "", // 信度预估返回值
      disc_result: "", // 区分度预估返回值
      kp_result: "", // 知识点返回值
      kp_layer: "",
      lp_result: "",
      kp_priority: [],
      defaultProps: {
        label: "label",
        children: "children",
      },
      src: [], // 图片数组
      show_result: false,
      order: 0,
      filelists: [],
      checkList: ["难度", "知识点", "区分度", "信度", "素养"],
      // 学科选择属性
      options: [
        {
          value_id: "数学", // 学科值
          label: "数学", // 学科名
        },
        {
          value_id: "英语",
          label: "英语",
        },
        {
          value_id: "语文",
          label: "语文",
        },
        {
          value_id: "化学",
          label: "化学",
        },
        {
          value_id: "物理",
          label: "物理",
        },
        {
          value_id: "生物",
          label: "生物",
        },
        {
          value_id: "政治",
          label: "政治",
        },
        {
          value_id: "历史",
          label: "历史",
        },
        {
          value_id: "地理",
          label: "地理",
        },
      ],
      subject_id: "数学",
      type_options: [
        {
          value_id: "selection_test", // 数学题型值
          label: "选择", // 数学题型名
        },
        {
          value_id: "fill_test",
          label: "填空",
        },
        {
          value_id: "answer_test",
          label: "解答",
        },
      ], // 题型选择属性
      type_id: "解答",
      marks: {
        0: "易",
        1: "难",
      },
      loading: false,
      optional_image: [
        require("@/assets/default_image/10.png"),
        require("@/assets/default_image/1.png"),
        require("@/assets/default_image/2.png"),
        require("@/assets/default_image/3.png"),
      ],
      ReceivedPara: [
        {
          field: "id",
          type: "string",
          necessary: "是",
          desc: "试题id",
        },
        {
          field: "itemdata",
          type: "dict",
          necessary: "是",
          desc: '试题内容，包含"text"和"image"两个字段，其中"text"是试题文本，"image"是试题图片的base64编码',
        },
      ],
      ReturnedPara: [
        {
          field: "id",
          type: "string",
          desc: "试题id",
        },
        {
          field: "difficult",
          type: "list",
          desc: "预估难度组成的列表",
        },
      ],
    };
  },
  watch: {
    checkList() {
      this.show_result = false;
    },
    type_id() {
      this.show_result = false;
    },
    subject_id() {
      this.show_result = false;
      this.type_id = "";
      if (this.subject_id === "数学") {
        this.type_options = [
          {
            value_id: "selection_test", // 数学题型值
            label: "选择", // 数学题型名
          },
          {
            value_id: "fill_test",
            label: "填空",
          },
          {
            value_id: "answer_test",
            label: "解答",
          },
        ];
      } else if (this.subject_id === "英语") {
        this.type_options = [
          {
            value_id: "selection_test", // 英语题型值
            label: "选择", // 英语题型名
          },
          {
            value_id: "cloze_test",
            label: "完形填空",
          },
          {
            value_id: "read_understand_test",
            label: "阅读理解",
          },
        ];
      } else
        this.type_options = [
          {
            value_id: "fill_test",
            label: "填空",
          },
        ];
    },
  },
  mounted() {
    this.ToTop();
    //this.openPanel();
    this.closePanel();
  },
  methods: {
    ToTop() {
      window.scrollTo(0, 0);
    },
    openInstructionDialog() {
      this.$refs.instruction.openDialog();
    },
    // 提交评估按钮，向后端发送请求
    submit() {
      if (this.checkList.length === 0) {
        return;
      }
      document.documentElement.scrollTop = 200;
      this.loading = true;
      this.show_result = true;
      //console.log("aaa");
      let param = new FormData();
      var temp_list = [];
      for (var i = 0; i < this.filelists.length; i++) {
        temp_list.push(this.filelists[i]);
      }
      param.append("files", JSON.stringify(temp_list));
      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      param.append("estimate_content", this.content); // 后端接收estimate_content字段
      param.append("estimate_subject", this.subject_id); // 后端接收estimate_subject字段
      param.append("exercise_type", this.type_id); // 后端接收exercise_type字段

      /*let param_beta = new FormData();

				param_beta.append("files", JSON.stringify(temp_list));
				param_beta.append("estimate_content", this.content); // 后端接收estimate_content字段
				param_beta.append("exercise_type", this.type_id); // 后端接收exercise_type字段
				if (this.subject_id == "数学") param_beta.append("estimate_subject", "math");
				else //addition
					if (this.subject_id == "英语") param_beta.append("estimate_subject", "english");
					*/

      if (this.checkList.length === 5) {
        this.checkList[0] = "难度";
        this.checkList[1] = "知识点";
        this.checkList[2] = "区分度";
        this.checkList[3] = "信度";
        this.checkList[4] = "素养";
      }
      if (this.checkList.indexOf("难度") > -1) {
        // 请求难度属性接口
        this.$http
          .post(
            "https://kg-edu-backend-44-review-question-a-8g0hzl.env.bdaa.pro/v1/api/difficulty",
            param,
            config,
            {
              emulateJSON: true,
            }
          )
          .then(function (data) {
            this.difficulty_result = data.data.difficulty;
            this.loading = false;
          });
      }
      if (this.checkList.indexOf("区分度") > -1) {
        // 请求区分度属性接口
        this.$http
          .post(
            "https://kg-edu-backend-44-review-question-a-8g0hzl.env.bdaa.pro/v1/api/disc",
            param,
            config,
            {
              emulateJSON: true,
            }
          )
          .then(function (data) {
            this.disc_result = data.data.disc;
            this.loading = false;
          });
      }
      if (this.checkList.indexOf("信度") > -1) {
        // 请求信度属性接口
        this.$http
          .post(
            "https://kg-edu-backend-44-review-question-a-8g0hzl.env.bdaa.pro/v1/api/rel",
            param,
            config,
            {
              emulateJSON: true,
            }
          )
          .then(function (data) {
            this.rel_result = data.data.rel;
            this.loading = false;
          });
      }

      if (this.checkList.indexOf("知识点") > -1) {
        // 请求知识点属性接口
        this.$http
          .post(this.backendIP + "/api/kp", param, config, {
            emulateJSON: true,
          })
          .then(function (data) {
            this.kp_result = data.data.knowledge_point.kp;
            this.kp_layer = data.data.knowledge_point.kp_layer;
            this.kp_priority = data.data.knowledge_point.kp_priority;
            this.loading = false;
          });
      }

      if (this.checkList.indexOf("素养") > -1) {
        // 请求知识点属性接口
        this.$http
          .post(
            "https://kg-edu-backend-44-review-question-a-8g0hzl.env.bdaa.pro/v1/api/lp",
            param,
            config,
            {
              emulateJSON: true,
            }
          )
          .then(function (data) {
            this.lp_result = data.data.literacy;
            this.loading = false;
          });
      }
      //document.getElementById("result").scrollIntoView();
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
    Estimate_Check() {
      if (this.subject_id == "" || this.type_id == "" || this.content == "") {
        return true;
      } else {
        return false;
      }
    },
    // Update Complex Input，将组合输入的内容复制到当前搜索框应该具有的内容里
    UCI(val) {
      this.content = val;
      console.log("content", this.content);
    },
    // Update Complex Input Image，将组合输入的内容的图片部分复制到当前页面的内容里，如果后续又要用到则进行调用
    UCII(val) {
      this.filelists = val;
    },

    openPanel() {
      $(".box-card.left").animate(
        {
          left: "0%",
          opacity: 1,
        },
        "easeInOutExpo"
      );
      $("#openBtn").hide();
      $("#closeBtn").show();
    },

    closePanel() {
      $(".box-card.left").animate(
        {
          left: "-50%",
          opacity: 0,
        },
        "easeInOutExpo"
      );
      $("#openBtn").show();
      $("#closeBtn").hide();
    },
  },
};
</script>

<style scoped lang="scss">
.el-card {
  background-color: #a7cdff;
}

.card {
  width: 250px;
  margin: 0 auto;
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
  //margin: 5px;
  border: hidden;
}

.format_content {
  margin-top: 20px;
  border: 1px solid #999;
  height: 180px;
  overflow: scroll;
}

.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}

.el-tag {
  //margin-right: 10px;
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  color: #2c07ff;
}

.el-col {
  border-radius: 4px;
}

#main {
  position: relative;
  height: 650px;
  width: 1200px;
  margin-bottom: 100px;
  margin-left: 80px;
  margin-top: 40px;
}

.introduction,
.example {
  left: 0;
  position: absolute;
  width: 300px;
  height: 325px;
  padding: 20px 20px 20px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

#exercise {
  left: 0px;
  position: absolute;
  width: 800px;
  height: 650px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

#result {
  position: absolute;
  padding-left: 5px;
  padding-right: 5px;
  left: 800px;
  top: 0px;
  width: 520px;
  height: 650px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}

.box-card {
  position: absolute;
  margin-left: 15px;
  background: rgba(248, 251, 255, 0.9);
  // width: 100%;
  // height: 100%;
  z-index: 1;
  width: 840px;
  height: 93%;
  left: 0;
  top: 50px;
  opacity: 0;
}

.panel-btn {
  position: absolute;
  top: 10px;
  font-size: 20px;
  font-weight: bold;
  padding: 20px 20px 20px 10px;
  color: #888888;
}

.tab {
  position: absolute;
  width: 40px;
  height: 180px;
  border-radius: 0px 10px 10px 0px;
  background-color: #eef1f7;
  cursor: pointer;
  z-index: 10;

  // .arrow {
  // 	border-color: #eef1f7 transparent transparent #eef1f7;
  // 	border-style: solid;
  // 	border-width: 15px 15px 15px 15px;
  // 	height: 0;
  // 	width: 0;
  // 	position: absolute;
  // 	bottom: -23px;
  // }
}

.container {
  display: flex;
  width: 100%;
  flex-flow: column;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 650px;
  overflow-y: scroll;
}

.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}

.intro .content {
  margin-top: 20px;
  margin-bottom: 20px;
  //max-height: 45%;
  text-align: left;
}

#openBtn {
  top: 15vh;
  // left:15px;
}

#closeBtn {
  right: 50px;
  top: 50px;
  font-size: 30px;
  z-index: 11;
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
} 
	.el-divider--horizontal {
		display: block;
		height: 3px;
		width: 100%;
		margin: 8vh 0
	}*/
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
  background-image: url(../../assets/delete.jpeg);
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

#checkbox ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a2930;
}

.el-select-dropdown__item.selected {
  color: #1a2930;
}

.el-select-dropdown__item.hover {
  background-color: #9cd6f1;
}
</style>
