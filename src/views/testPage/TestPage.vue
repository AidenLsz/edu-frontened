<template>
  <div style="margin-top: 2vh;">
    <el-row class="Area_Row">
      <div class="Multi_Analyse_Rader_Left">
        <el-row>
          <el-col>
            <el-row type="flex" justify="start">
              <span style="font-size: 40px;">深层次、多维度智能分析</span>
            </el-row>
            <el-row 
              type="flex" 
              justify="start" 
              style="word-break: break-all; text-align: left; margin-top: 30px; font-size: 18px; color: #888">
              使用人工智能和数据挖掘技术对试题和试卷，在各个层次、多个维度上分析，如各题型占比、关键词比较、知识点分值和难度变化
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 40px; margin-bottom: 10px; font-size: 18px;">
              <div class="Dot"></div>试题质量、难度分析
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
              <div class="Dot"></div>试题、试卷知识点分析
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 10px; font-size: 18px;">
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
    }
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
.Area_Row{
  width: 1344px;
  padding: 0 88px;
  margin: 0 auto;
  box-sizing: border-box;
}

.All_Button{
  width: 150px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba($color: #000, $alpha: 0.12)
}

.Start_Analysis_Button{
  color: black;
}

.Dot{
  border-radius: 50%; 
  height: 7px; 
  width: 7px; 
  background: black; 
  margin-top: 8px; 
  margin-right: 20px;
  margin-left: 10px;
}
</style>