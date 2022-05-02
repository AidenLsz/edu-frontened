<template>
  <div class="similarity" style="margin-top: 10px; margin-bottom: 100px">
    <div id="Top_Nav" class="Top_Nav"></div>
    <div class="panel">
      <el-row justify="start" type="flex">
        <el-col style="padding-left: 5vw">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>AI实验室</el-breadcrumb-item>
            <el-breadcrumb-item>
              相似试题评估
              <span @click="openInstructionDialog" style="cursor: pointer">
                <i class="el-icon-question"></i>
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
      </el-row>
      <instruction ref="instruction" />

      <!-- <el-row style="margin: 30px 0px 10px 0px">
				<label style="font-size: 30px">相似度估计</label>
			</el-row>

			<el-row style="margin: 50px 200px 10px 200px">
				<p style="font-size: 18px;">
					相似度预估功能主要用于判断两个题目之间的相似程度；用户需要输入两个题目的文本信息，人工智能算法模型会自动评估这两个题目的相似度，取值在0至1之间，越接近1说明越相似
				</p>
			</el-row> -->

      <!-- <el-row style="postion:relative; padding: 1vh 5vw 0 5vw">
				<div style="position: absolute; left :150px; height: 455px; width:560px;">
					<Dialogue style="height:100%; width:100%;" :optional_image="optional_image_left" @Update_CI="UCI_Left"></Dialogue>
				</div>
				<div style="position: absolute; right :150px; height: 455px; width:560px;">
					<Dialogue style="height:100%; width:100%;" :optional_image="optional_image_right" @Update_CI="UCI_Right"></Dialogue>
				</div>
				<el-row type="flex" justify="start">
					<el-button type="primary" value="提交" @click="submit">评估</el-button>
				</el-row>
			</el-row> -->

      <div v-for="cnt in pairs" :key="cnt">
        <el-row
          type="flex"
          justify="start"
          style="margin-top: 40px; height: 40px; line-height: 40px"
        >
          <el-col
            :span="4"
            style="
              font-size: 16px;
              width: 110px;
              border: 1px solid rgba(0, 0, 0, 0.3);
              box-shadow: 0px 2px 14px rgba(0, 0, 0, 0.04);
              border-radius: 6px;
              margin-left: 80px;
            "
          >
            题对{{ cnt }}
          </el-col>
          <el-col
            v-if="show_result"
            :span="1"
            style="margin-left: 60px; width: 40px"
          >
            <i
              class="el-icon-caret-right"
              style="font-size: 30px; line-height: 40px; height: 40px"
            ></i>
          </el-col>
          <el-col v-if="show_result" :span="4" style="text-align: left">
            <div
              style="
                display: inline-block;
                height: 40px;
                width: 200px;
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 400;
                font-size: 24px;
                line-height: 40px;
              "
            >
              相似度：<span style="color: rgb(110, 202, 122)">{{
                similarity_result[cnt - 1]
              }}</span>
            </div></el-col
          >
        </el-row>
        <el-row style="padding: 4vh 5vw 0 5vw">
          <el-col :span="12" style="height: 500px">
            <!-- <ComplexInput @Update_CI="UCI_Left" @Update_Image="UCII_Left" @Full_Change="FullChange_L" :Mathdown_Special="'_0'" ref="CI_Left" :class="OpacityCheck(0)"></ComplexInput> -->
            <Dialogue
              style="height: 100%; width: 90%"
              :optional_image="optional_image_left"
              :name="'left'"
              @Update_CI="UCI_Left($event, cnt - 1)"
            ></Dialogue>
          </el-col>
          <!-- <img style="position: absolute; left: 660px; top:150px;" width="13%" src="../../assets/arrow.png"
					alt="图片显示错误" /> -->
          <el-col :span="12" style="height: 500px">
            <!-- <ComplexInput @Update_CI="UCI_Right" @Update_Image="UCII_Right" @Full_Change="FullChange_R"
						:Mathdown_Special="'_1'" ref="CI_Right" :class="OpacityCheck(1)"></ComplexInput> -->
            <Dialogue
              style="height: 100%; width: 90%"
              :optional_image="optional_image_right"
              :name="'right'"
              @Update_CI="UCI_Right($event, cnt - 1)"
            ></Dialogue>
          </el-col>
        </el-row>
      </div>

      <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-col :span="6"></el-col>
        <el-col :span="6">
          <el-button
            type="success"
            @click="
              () => {
                pairs++;
              }
            "
            >继续添加</el-button
          >
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="submit" :disabled="disabled"
            >开始评估</el-button
          >
        </el-col>
        <el-col :span="6"></el-col>
      </el-row>
    </div>

    <!-- 侧边对话框 -->
    <!-- <el-row class="panel-body"> -->
    <div class="tab panel-btn" id="openBtn" @click="openPanel()">
      <div>使用说明</div>
      <i class="el-icon-d-arrow-right"></i>
      <!-- <div class="arrow"></div> -->
    </div>
    <el-card class="box-card left" style="background-color: #ffffff">
      <div class="panel-btn" id="closeBtn" @click="closePanel()">
        <i class="el-icon-d-arrow-left"></i>
      </div>
      <div class="container" :style="'height:' + (winHeight - 80) + 'px'">
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> 介绍 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              相似度预估功能主要用于判断两个题目之间的相似程度；用户需要输入两个题目的文本信息，人工智能算法模型会自动评估这两个题目的相似度，取值在0至1之间，越接近1说明越相似
            </el-col>
          </el-row>
        </div>
        <!-- <el-divider></el-divider> -->
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> API说明 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              <ul>
                <!-- <li>
									<p>首先将试题图片转化为base64的格式，发送到识别API。在模型识别完成后，从返回的数据中提取出图片转写后的试题文本。</p>
								</li> -->
                <li>
                  <p>
                    API URL:
                    https://kg-edu-backend-44-production.env.bdaa.pro/v1/api/similarity
                  </p>
                </li>
                <li>
                  <p>接口类型：POST</p>
                </li>
                <li>
                  <p>参数说明：</p>
                  <p><strong>接收参数</strong></p>
                  <el-table :data="ReceivedPara" border style="width: 100%">
                    <!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="tableData[num].content"></ComplexInput> -->
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
                    <!-- <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="tableData[num].content"></ComplexInput> -->
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
        <!-- <el-divider></el-divider> -->
        <div class="intro">
          <el-row type="flex" justify="start" class="title"> 使用示例 </el-row>
          <el-row type="flex" justify="start" class="content">
            <el-col>
              <pre><code>import json
import requests
from PIL import Image
import numpy as np
import os


if __name__ == '__main__':
    url = "https://math-text-similarity-128-production.env.bdaa.pro/v1"
    # 用户输入
    x = [
        [{
            'text': '设CEDF是已知圆的一个内接矩形，过D作该圆的切线与CE的延长线相交于点A，与\
                  CF的延长线相交于点B。求证：$\\frac{B F}{A E}=\\frac{B C^{3}}{A C^{3}}$'
        }, {
            'text':
            '已知△ABC三内角的大小成等差数列，$\\tan A \\tan C=2+\\sqrt{3}$，求角A,B,C的\
                  大小；又知顶点C的对边c上的高等于$4 \\sqrt{3}$，求三角形各边a,b,c的长'
        }],
        [{
            'text':
            '求抛物线$y=x^2+2x+3$和圆$x^2+(y+2)^2=3$的交点$(x_1, y_1), (x_2, y_2)$___'
        }, {
            'text':
            '已知过点M（一3，0）的直线l被圆$x^2+(y+2)^2=25$ 所截得的弦长为8，那么直线l的方程为____。'
        }]
    ]

    data = [{"data": x}]
    r = requests.post(url, data=json.dumps(data))
    assert r.status_code == 200, r.status_code
    print(json.loads(r.content)["data"])</code></pre>
              <p><strong>其中输入的数据格式为</strong></p>
              <p><code>[[{题目:题目A的内容}, {题目:题目B的内容}]]</code></p>
              <p><strong>如果有多个题对，那么格式为</strong></p>
              <p><code>[[题对1],[题对2]]</code></p>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
    <!-- </el-row> -->
  </div>
</template>

<script>
// import Mathdown from "./Mathdown.vue";
// import UploadImg from "./UploadImg.vue";
//import ComplexInput from "@/common/components/ComplexInput.vue"
import Dialogue from "./components/Dialogue.vue";
import Instruction from "./components/InstructionSimilarity.vue";
import $ from "jquery";
// import LunaProgress from "../../common/components/LunaProgress.vue";
// import { commonAjax } from "@/common/utils/ajax";
export default {
  components: {
    //ComplexInput,
    Dialogue,
    Instruction,
    // LunaProgress,
  },
  name: "similarity",
  data() {
    return {
      content_left: [], // 左侧文本
      content_right: [], // 右侧文本
      //content_left[0] compares with content_right[0]
      pairs: 1, //题对数
      similarity_result: [], // 相似度预估返回值
      show_result: false,
      loading: false,
      // src_0: [],
      // src_1: [],
      images_Left: [],
      images_Right: [],
      // index_0: 0,
      // index_1: 0,
      visibleList: [false, false],
      optional_image_left: [
        require("@/assets/default_image/4.png"),
        require("@/assets/default_image/6.png"),
        require("@/assets/default_image/8.png"),
        require("@/assets/default_image/10.png"),
      ],
      optional_image_right: [
        require("@/assets/default_image/5.png"),
        require("@/assets/default_image/7.png"),
        require("@/assets/default_image/9.png"),
        require("@/assets/default_image/11.png"),
      ],
      ReceivedPara: [
        {
          field: "text",
          type: "string",
          necessary: "是",
          desc: "题目的题面文本",
        },
      ],
      ReturnedPara: [
        {
          field: "similarity",
          type: "string",
          desc: "两个题目的相似度得分",
        },
      ],
      // 浏览器高度
      winHeight: window.innerHeight,
      timer: "", //监听器，控制数字动画
      timer_cnt: 0, // 控制anim函数触发次数
      disabled: true, //控制是否可以使用评估按钮
    };
  },
  mounted() {
    this.ToTop();
    // this.openPanel();
    this.closePanel();
    const that = this;
    window.onresize = () => {
      return (() => {
        //console.log(window.innerHeight);
        that.winHeight = window.innerHeight;
      })();
    };
  },
  watch: {
    content_left() {
      console.log("content_left");
      this.disabled = this.DisableCheck();
    },
    content_right() {
      console.log("content_left");
      this.disabled = this.DisableCheck();
    },
  },
  methods: {
    ToTop() {
      document.getElementById("Top_Nav").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    openInstructionDialog() {
      this.$refs.instruction.openDialog();
    },
    OpacityCheck(Index) {
      if (this.visibleList[Index]) {
        return "unvisible";
      }
    },
    DisableCheck() {
      // if (
      //   this.content_1 != "" &&
      //   this.content_1 != "识别中..." &&
      //   this.content_2 != "" &&
      //   this.content_2 != "识别中..."
      // )
      //   return false;
      // else return true;
      if (this.content_left.length != this.content_right.length) return true;
      if (this.content_left.length == 0 || this.content_right.length == 0)
        return true;
      for (let i = 0; i < this.content_left.length; i++)
        if (this.content_left[i] == "" || this.content_left[i] == "识别中...")
          return true;
      for (let i = 0; i < this.content_right.length; i++)
        if (this.content_right[i] == "" || this.content_right[i] == "识别中...")
          return true;
      return false;
    },
    FullChange_L(val) {
      this.visibleList.splice(1, 1, val);
    },
    FullChange_R(val) {
      this.visibleList.splice(0, 1, val);
    },
    // 提交评估按钮，向后端发送请求
    submit() {
      this.ToTop();
      this.loading = true;
      this.show_result = true;
      // let param = new FormData();
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      var temp_image_left = [];
      var temp_image_right = [];

      for (var i = 0; i < this.images_Left.length; i++) {
        temp_image_left.push(this.images_Left[i]);
      }

      for (var j = 0; j < this.images_Right.length; j++) {
        temp_image_right.push(this.images_Right[j]);
      }

      // param.append("image_left", JSON.stringify(temp_image_left));
      // param.append("image_right", JSON.stringify(temp_image_right));
      // param.append("content_1", this.content_1); // 后端接收content1字段
      // param.append("content_2", this.content_2); // 后端接收content2字段
      // // 请求相似度预估接口
      // this.$http
      //   .post(this.backendIP + "/api/similarity", param, config, {
      //     emulateJSON: true,
      //   })
      //   .then(function (data) {
      //     this.similarity_result = data.data.similarity;
      //     this.loading = false;
      //   });

      let param = [
        {
          data: [],
          model: "textcnn",
        },
      ];
      for (let i = 0; i < this.content_left.length; i++) {
        console.log("content_left", i, this.content_left[i]);
        console.log("content_right", i, this.content_right[i]);
        param[0].data.push([
          { text: this.content_left[i] },
          { text: this.content_right[i] },
        ]);
      }
      // console.log(JSON.stringify(param));
      this.$http
        .post(
          "https://math-text-similarity-128-production.env.bdaa.pro/v1",
          param,
          config,
          {
            emulateJSON: true,
          }
        )
        .then(function (data) {
          let temp = JSON.parse(data.body.data.similarity);
          console.log(temp);
          //console.log(temp[0]);
          //console.log(temp[0][0]);
          this.similarity_result.length = 0;
          this.timer_cnt = 0;
          for (let i = 0; i < temp.length; i++) {
            this.similarity_result.push("0%");
            // this.similarity_result.push(temp[i][0].toFixed(4) *100 + "%");
          }
          this.timer = setInterval(this.anim(temp), 10);
          //console.log(this.similarity_result);
          this.loading = false;
        });
    },
    anim(temp) {
      return () => {
        console.log(this.similarity_result[0]);
        this.timer_cnt++;
        this.similarity_result.length = 0;
        for (let i = 0; i < temp.length; i++) {
          // console.log(typeof temp[i][0], temp[i][0]);
          this.similarity_result.push(
            (temp[i][0] * this.timer_cnt).toFixed(2) + "%"
          );
        }
        if (this.timer_cnt == 100) clearInterval(this.timer);
      };
    },
    // imgInfo_0(e) {
    //   this.src_0 = e.src;
    //   this.images_0 = e.filelists;
    // },
    // imgInfo_1(e) {
    //   this.src_1 = e.src;
    //   this.images_1 = e.filelists;
    // },
    // del_image_0(){
    //   this.src_0.splice(this.index_0, 1);
    //   this.images_0.splice(this.index_0, 1);
    // },
    // del_image_1(){
    //   this.src_1.splice(this.index_1, 1);
    //   this.images_1.splice(this.index_1, 1);
    // },
    // change_index_0: function(key1){
    //   this.index_0 = key1;
    // },
    // change_index_1: function(key1){
    //   this.index_1 = key1;
    // },
    UCI_Left(val, cnt) {
      // this.content_left[cnt] = val;
      this.content_left.splice(cnt, 1, val);
    },
    UCII_Left(val) {
      this.images_Left = val;
    },
    UCI_Right(val, cnt) {
      // this.content_right[cnt] = val;
      this.content_right.splice(cnt, 1, val);
    },
    UCII_Right(val) {
      this.images_Right = val;
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
.similarity {
  // background: url("../assets/sub_bg.png");
  background-size: 100%;
  // padding: 20px 20px 0px 20px;
}

.panel {
  background-color: #fff;
  border-radius: 4px;
  min-height: 700px;
  box-shadow: none;
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

.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}

.el-col {
  border-radius: 4px;
}

.unvisible {
  opacity: 0;
}

.box-card {
  position: absolute;
  margin-left: 15px;
  background: rgba(248, 251, 255, 0.9);
  // width: 100%;
  // height: 100%;
  z-index: 10;
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
  z-index: 11;
}

.tab {
  position: absolute;
  width: 40px;
  height: 180px;
  border-radius: 0px 10px 10px 0px;
  background-color: #eef1f7;
  cursor: pointer;
  // z-index: 10;

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
  // height: auto;
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

// .el-button {
//   background-color: #1a2930;
//   color: #fff;
//   border-color: #1a2930;
// }
// .el-button:hover {
//   background-color: #008080;
//   color: #fff;
//   border-color: #fff;
// }
// .el-button:focus {
//   outline: none;
//   background-color: #008080;
//   color: #fff;
//   border-color: #fff;
// }

// .el-tag {
// 	//margin-left: 10px;
// 	font-size: 14px;
// 	color: #2c07ff;
// }

// .el-card {
// 	background-color: #a7cdff;
// }
</style>
<style scoped>
#tabs ::v-deep .el-tabs__item {
  color: #0a1612;
  font-weight: 900;
}

#tabs ::v-deep .el-tabs__item.is-active {
  background-color: #0a1612;
  color: #fff;
  font-weight: 900;
}

/* #tag ::v-deep .el-tag {
		background-color: #fff !important;
		color: #000 !important;
		border-color: #c5c1c0 !important;
	} */

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 10px;
  background: transparent;
}
</style>
