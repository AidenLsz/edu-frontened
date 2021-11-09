<template>
  <div style="margin-top: 2vh;">
    <!-- 注册即功能简介 -->
    <div style="width: 100%; height: 700px" align="center">
      <el-row class="Area_Row" type="flex" justify="center">
        <div class="Home_Area_Left">
          <el-row>
            <el-col>
              <el-row type="flex" justify="start" class="Part_Title">
                <span>LUNA智能教辅平台</span>
              </el-row>
              <el-row 
                type="flex" 
                justify="start" 
                style="word-break: break-all; text-align: left; margin-top: 30px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                深层次、多维度分析处理海量教育资源，智能化、个性化资源管理、组织、查询、分析服务
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 60px;">
                <div class="All_Button Start_Analysis_Button">
                  立即加入<i class="el-icon-right" style="margin-left: 10px;"></i>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="Home_Area_Right">
          <el-row type="flex" justify="center" style="margin: 0; padding: 0; padding-top: 130px">
            <div style="width: 250px; margin-right: 15px; height: 300px;">
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question">
                <div style="display: inline-block; width: 64px;">
                  <img src="../../assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -13px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 15px; padding-top: 20px;">
                  <span style="font-size: 22px">教学资源</span>
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question" style="margin-top: 30px;">
                <div style="display: inline-block; width: 64px;">
                  <img src="../../assets/dataIcon2.png" width="64px" height="64px" style="margin-top: -13px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 15px; padding-top: 20px;">
                  <span style="font-size: 22px">组卷系统</span>
                </div>
              </div>
            </div>
            <div style="width: 250px; height: 300px;">
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question" style="margin-top: 30px;">
                <div style="display: inline-block; width: 64px;">
                  <img src="../../assets/dataIcon3.png" width="64px" height="64px" style="margin-top: -13px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 15px; padding-top: 20px;">
                  <span style="font-size: 22px;">智能分析</span>
                </div>
              </div>
              <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question" style="margin-top: 30px;">
                <div style="display: inline-block; width: 64px;">
                  <img src="../../assets/dataIcon3.png" width="64px" height="64px" style="margin-top: -13px;">
                </div>
                <div style="display: inline-block; width: 110px; margin-left: 15px; padding-top: 20px;">
                  <span style="font-size: 22px">知识检索</span>
                </div>
              </div>
            </div>
          </el-row>
        </div>
      </el-row>
    </div>
    <!-- 资源录入 -->
    <div style="width: 100%; background: #F8F9FA;" align="center">
      <el-row class="Area_Row" style="height: 700px;" type="flex" justify="center">
        <div class="Resource_Manager_Left" align="left">
          <el-row>
            <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Question">
              <div style="display: inline-block; width: 64px;">
                <img src="../../assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -32px;">
              </div>
              <div style="display: inline-block; width: 110px; margin-left: 15px">
                <span style="font-size: 28px">2500万+</span><br>道试题
              </div>
            </div>
            <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Subject">
              <div style="display: inline-block; width: 64px;">
                <img src="../../assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -32px;">
              </div>
              <div style="display: inline-block; width: 40px; margin-left: 15px">
                <span style="font-size: 28px">9</span>大学科
              </div>
            </div>
          </el-row>
          <el-row style="margin-top: 30px;">
            <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Paper">
              <div style="display: inline-block; width: 64px;">
                <img src="../../assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -32px;">
              </div>
              <div style="display: inline-block; width: 95px; margin-left: 15px">
                <span style="font-size: 28px">33万+</span><br>套试卷
              </div>
            </div>
            <div class="Resource_Manager_Float_Block Resource_Manager_Float_Block_Period">
              <div style="display: inline-block; width: 64px;">
                <img src="../../assets/dataIcon1.png" width="64px" height="64px" style="margin-top: -32px;">
              </div>
              <div style="display: inline-block; width: 150px; margin-left: 15px" align="center">
                <span style="font-size: 28px">小学至成人</span><br>多学段覆盖
              </div>
            </div>
          </el-row>
        </div>
        <div class="Resource_Manager_Right">
          <el-row>
            <el-col>
              <el-row type="flex" justify="start" class="Part_Title">
                <span>海量教学资源、智能处理</span>
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>智能化、个性化的资源（试题、试卷）的录入、查询和管理服务
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>内置标准化、体系化的教学资源
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>使用高效准确的试题相似度评估算法，提升题库的资源质量
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 80px;">
                <div class="All_Button Start_Analysis_Button" style="background: white">
                  录入资源<i class="el-icon-right" style="margin-left: 10px;"></i>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <!-- 多层次，多维度智能分析 -->
    <div style="width: 100%;" align="center">
      <el-row class="Area_Row" style="padding-top: 100px; padding-bottom: 100px;">
        <div class="Multi_Analyse_Rader_Left">
          <el-row>
            <el-col>
              <el-row type="flex" justify="start" class="Part_Title">
                <span>深层次、多维度智能分析</span>
              </el-row>
              <el-row 
                type="flex" 
                justify="start" 
                style="word-break: break-all; text-align: left; margin-top: 30px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                使用人工智能和数据挖掘技术对试题和试卷，在各个层次、多个维度上分析，如各题型占比、关键词比较、知识点分值和难度变化
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>试题质量、难度分析
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>试题、试卷知识点分析
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>试卷综合分析
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 60px;">
                <div class="All_Button Start_Analysis_Button">
                  开始分析<i class="el-icon-right" style="margin-left: 10px;"></i>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div id="Multi_Analyse_Radar_Chart" class="Multi_Analyse_Radar_Chart">

        </div>
      </el-row>
    </div>
    <!-- 知识点直观呈现 -->
    <div style="width: 100%; background: #F8F9FA;" align="center">
      <el-row class="Area_Row" style="height: 700px;" type="flex" justify="center">
        <div class="KU_Search_Left" align="center">
          <img src="./ITAS_Home_KU.png" width="500">
          <el-input 
            v-model="Home_Ku" 
            placeholder="请输入知识点" 
            prefix-icon="el-icon-search"
            style="width: 350px; margin-top: 40px;"></el-input>
        </div>
        <div class="KU_Search_Right">
          <el-row>
            <el-col>
              <el-row type="flex" justify="start" class="Part_Title">
                <span>知识点直观呈现</span>
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>智能且直观的知识点组织与呈现
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>知识点检索与详细介绍
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
                <div class="Dot"></div>前驱后继、共同学习和层级关系三种知识关系展示
              </el-row>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </div>
    <!-- 组卷系统介绍 -->
    <div style="width: 100%;" align="center">
      <el-row class="Area_Row" style="padding-top: 100px; padding-bottom: 100px;">
        <div class="Combine_Paper_Area_Left">
          <el-row>
            <el-col>
              <el-row type="flex" justify="start" class="Part_Title">
                <span>多样化组卷系统，一应俱全</span>
              </el-row>
              <el-row 
                type="flex" 
                justify="start" 
                style="word-break: break-all; text-align: left; margin-top: 30px; font-size: 20px; height: 56px; line-height: 28px; color: #595959">
                智能组卷系统提供丰富的搜题、选题方式，试卷和答题卡编辑、预览与下载功能
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>关键词搜题
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>知识点搜题
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>以题搜题
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 20px;">
                <div class="Dot"></div>试卷搜题
              </el-row>
              <el-row type="flex" justify="start" style="margin-top: 60px;">
                <div class="All_Button Start_Analysis_Button">
                  开始体验<i class="el-icon-right" style="margin-left: 10px;"></i>
                </div>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="Combine_Paper_Area_Right">
          <el-col>
            <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(-2deg); display: block; padding: 0">
              <span style="font-size: 22px">多样化搜题、选题</span>
            </div>
            <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(2deg); display: block; padding: 0">
              <span style="font-size: 22px">试卷和答题卡生成</span>
            </div>
            <div class="Resource_Manager_Float_Block Combine_Paper_Area_Div" style="transform: rotate(-2deg); display: block; padding: 0">
              <span style="font-size: 22px">个性化试卷导出</span>
            </div>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>

import * as echarts from 'echarts';

export default {
  name: 'ScreenShot',
  props: {
  },
  components:{
    // Mathdown
  },
  data() {
    return {
      // 知识点
      Home_Ku: ""
    }
  },
  watch: {

  },
  mounted() {
    this.Init_Home_Page_Radar()
  },
  methods: {
    Init_Home_Page_Radar(){
      var Home_Radar = echarts.init(document.getElementById("Multi_Analyse_Radar_Chart"));
      //let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        title: {
          text: "知识点分值比较", //这里的参数是整个图标的标题 后面也可以加注释
          bottom: 20,
          left: "36.5%",
          textStyle: {
            fontSize: 18,
            fontStyle: "normal",
            fontWeight: "bold",
          },
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          orient: "vertical", 
          right: 0,
          bottom: 60,
          itemHeight: 6, //修改icon图形大小
          itemWidth: 10,
          textStyle: {
            fontSize: 8,
            color: '#000'
          },
          data: [ "2020年全国统一高考数学试卷（文科）（新课标i)",
                  "2020年全国统一高考数学试卷（文科）（新课标ii)",
                  "2020年全国统一高考数学试卷（文科）（新课标iii)",
                  "2020年全国统一高考数学试卷（理科）（新课标i)"],
        },
        radar: [
          {
            center: ["50%", "44%"],
            splitArea: {
              areaStyle: {
                color: ["#FFFFFF"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            name: {
              formatter: "{value}",
              textStyle: {
                fontSize: 14,
                color: "#000000",
                fontWeight: "bold",
              },
            },
            radius: 150,
            indicator: [
              {text: "排列组合与概率统计"},
              {text: "代数"},
              {text: "算法与框图"},
              {text: "数学竞赛"},
              {text: "推理与证明"},
              {text: "立体几何"},
              {text: "三角函数"},
              {text: "高等数学"},
              {text: "平面解析几何"},
              {text: "数学知识延伸"}
            ],
          },
        ],
        calculable: true,
        series: [
          {
            name: "知识点分值",
            type: "radar",
            lineStyle: {
              type: "dashed",
            },
            symbol: "circle", // 拐点的样式
            symbolSize: 10,
            data: [
              {
                value: [90, 154, 76, 29, 5, 39, 37, 15, 20, 23],
                name: "2020年全国统一高考数学试卷（文科）（新课标i)"
              },
              {
                value: [113, 155, 101, 15, 44, 39, 39, 32, 32, 10],
                name: "2020年全国统一高考数学试卷（文科）（新课标ii)"
              },
              {
                value: [118, 143, 99, 20, 37, 27, 17, 42, 20, 15],
                name: "2020年全国统一高考数学试卷（文科）（新课标iii)"
              },
              {
                value: [115, 143, 84, 15, 39, 44, 25, 37, 20, 0],
                name: "2020年全国统一高考数学试卷（理科）（新课标i)"
              },
            ],
          },
        ],
      };
      Home_Radar.setOption(option);
    },
    // 检索知识点
    Search_KU() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.Home_Ku, knowledgeSystem: "neea" }
      });
    },
    // 跳转至新页面
    Route_Trans(route){
      document.body.scrollTo(0, 0)
      this.$router.push({ path: route });
    },
    // 注册和登录相关
    login_show() {
      this.$refs.login.show();
      this.$refs.register.hide();
    },
    register_show() {
      this.$refs.login.hide();
      this.$refs.register.show();
    },
  },
}
</script>
<style lang="scss" scoped>
.Multi_Analyse_Radar_Chart{
  display: inline-block;
  width: 500px;
  height: 500px;
}
.Multi_Analyse_Rader_Left{
  width: 668px;
  padding-top: 40px;
  padding-right: 50px;
  display: inline-block;
  height: 500px;
}

.Combine_Paper_Area_Right{
  display: inline-block;
  width: 500px;
  height: 500px;
  padding-top: 80px;
}
.Combine_Paper_Area_Left{
  width: 668px;
  padding-top: 40px;
  padding-right: 50px;
  display: inline-block;
  height: 500px;
}

.Area_Row{
  width: 1344px;
  padding: 0 88px;
}

.All_Button{
  width: 134px;
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px 0px rgba($color: #000, $alpha: 0.12);
  border: 1px solid #d3d3d3
}

.Start_Analysis_Button{
  color: black;
  background: white;
  cursor: pointer;
}

.Dot{
  border-radius: 50%; 
  height: 7px; 
  width: 7px; 
  background: black; 
  margin-top: 10px; 
  margin-right: 20px;
  margin-left: 10px;
}

.Part_Title{
  font-family: Sarasa Gothic SC;
  font-size: 44px;
  font-style: normal;
  font-weight: 600;
  line-height: 53px;
  letter-spacing: 0em;
  text-align: center;

}

.Resource_Manager_Left{
  width: 568px;
  padding-top: 230px;
  padding-left: 40px;
  display: inline-block;
}

.Resource_Manager_Right{
  width: 600px;
  padding-top: 170px;
  padding-left: 50px;
  display: inline-block;
}

.KU_Search_Left{
  width: 568px;
  padding-top: 180px;
  padding-left: 40px;
  display: inline-block;
}

.KU_Search_Right{
  width: 600px;
  padding-top: 230px;
  padding-left: 50px;
  display: inline-block;
}

.Resource_Manager_Float_Block_Question{
  width: 224px;
  height: 92px;
  background: white;
  margin-right: 20px;
}

.Combine_Paper_Area_Div{
  width: 224px;
  height: 60px;
  line-height: 60px;
  margin-top: 40px;
  background: white;
  display: block;
}

.Resource_Manager_Float_Block_Subject{
  width: 148px;
  height: 92px;
  background: white;
}

.Resource_Manager_Float_Block_Paper{
  width: 200px;
  height: 92px;
  background: white;
  margin-right: 20px;
}

.Resource_Manager_Float_Block_Period{
  width: 265px;
  height: 92px;
  background: white;
}

.Resource_Manager_Float_Block{
  box-shadow: 0px 4px 8px 0px rgba($color: #000, $alpha: 0.12);
  display: inline-block;
  border: 1px solid #d3d3d3;
  padding: 12px;
  border-radius: 16px;
}

.Home_Area_Left{
  display: inline-block;
  width: 618px;
  height: 700px;
  padding-top: 170px;
}

.Home_Area_Right{
  display: inline-block;
  width: 550px;
  height: 700px;
}
</style>