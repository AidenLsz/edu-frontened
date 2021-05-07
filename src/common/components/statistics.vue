<template lang="html">
  <div class="">
    <el-row style="margin-top: 40px; padding-bottom: 40px">
      <el-col :span="4" :offset="4" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon1.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">试题</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_Question}}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" :offset="2" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon2.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">试卷</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_Paper}}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" :offset="2" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon3.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">知识单元</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_KU}}</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <div id="data_chart" class="data_chart"></div>
    </el-row>
  </div>
</template>

<script>
import $ from "jquery";

import * as echarts from 'echarts';

export default {
  name: "statistics",
  data() {
    return {
      ku_name: "三角函数",
      image_infos: [],
      ToolsLabelNow: "资源",
      functionStatus: [false, false, false, false],
      resourceStatus: [false, false, false, false],
      Num_Paper: 0,
      Num_Question: 0,
      Num_KU: 0,
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false
    };
  },
  mounted() {
    this.Init_Bar();
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
    this.ToTop();
  },
  methods: {
    QAS(index){
      if(index == 0){
        this.$router.push({ path: "/QuestionAnalyseInput" });
        this.QuestionAnalyseSwitchFlag = false;
      }else{
        this.$router.push({ path: "/exercise" });
        this.QuestionAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试题分析的不同位置的对话框
    QuestionAnalyseSwitch(){
      this.QuestionAnalyseSwitchFlag = true;
    },
    PAS(index){
      if(index == 0){
        this.$router.push({ path: "/paperAnalyseInput" });
        this.PaperAnalyseSwitchFlag = false;
      }else{
        alert("尚未完成");
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch(){
      this.PaperAnalyseSwitchFlag = true;
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    submit() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.ku_name, knowledgeSystem: "neea" }
      });
    },
    CloseFunctions(){
      this.functionStatus = [false, false, false, false]
      this.resourceStatus = [false, false, false, false]
    },
    Get_TL_Style(param){
      if(param == 0 && this.ToolsLabelNow == '资源'){
        return "resourceButton"
      }else if(param == 1 && this.ToolsLabelNow == '功能'){
        return "resourceButton"
      }else if(param == 1 && this.ToolsLabelNow == '资源'){
        return "sleepingButton"
      }else if(param == 0 && this.ToolsLabelNow == '功能'){
        return "sleepingButton"
      }
    },
    changeToolsLabel(param){
      if(param == 0){
        this.ToolsLabelNow = '资源';
      }else if(param == 1){
        this.ToolsLabelNow = '功能';
      }
    },
    Router_Trans(route){
      this.$router.push({ path: route });
    },
    OpenFunctions(index){
      this.functionStatus.splice(index, 1, true);
    },
    OpenResources(index){
      this.resourceStatus.splice(index, 1, true);
    },
    Init_Bar(){

      let config = {
          headers: { "Content-Type": "multipart/form-data" }
      };
      let param = new FormData();

      this.$http
      .post(this.backendIP + "/api/count", param, config, {
        emulateJSON: true
      })
      .then(function(data) {

        var Chart_Data = {};

        var Paper_Data = [];
        var Question_Data = [];
        var KU_Data = [];

        Chart_Data = data.data;

        this.Num_Paper = Chart_Data.num_paper;
        this.Num_Question = Chart_Data.num_question;
        this.Num_KU = Chart_Data.num_knowledge;
        for(var index = 0; index < Chart_Data.num_sub.length; index ++){
          Paper_Data.push(Chart_Data.num_sub[index].paper);
          Question_Data.push(Chart_Data.num_sub[index].question);
          KU_Data.push(Chart_Data.num_sub[index].knowledge);
        }

        let myChart = echarts.init(document.getElementById('data_chart'));
        let option = {
          grid: {
            x: 70,
            y: 90,
            x2: 30,
            y2: 35
          },
          title: {
              text: "各学科数据统计",
              x: "center",
              y: "top",
              textStyle: {
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
              },
              padding: [5,5,40,25]
          },
          color: ['#626C91','#6BE6C1','#3FB1E3'],
          tooltip : {
              trigger: 'axis',
              axisPointer : {
                  type : 'shadow',
                  label : {
                      show: true
                  }
              },
              textStyle: {
                  fontSize: 14,
                  fontStyle: 'normal',
                  align: 'left'
              },
          },
          calculable: true,
          legend: {
              data: ['试卷', '试题', '知识单元'],
              itemGap: 20,
              x: "right",
              y: "top",
              padding: [5,30,40,5],
              textStyle: {
                  fontSize: 14,
                  fontStyle: 'normal',
              },
          },
          xAxis : [
          {
              type : 'category',
              data : Chart_Data.list_sub,
              axisTick: {
                  alignWithLabel: true
              },
              axisLabel:{
                  show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                  interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                  textStyle:{   //textStyle里面写x轴下的字体的样式
                      color:'black',
                      fontSize:14
                  }
              },
          }
          ],
          yAxis : [
          {
              type : 'value',
              name : '数量',
              axisLabel:{
                  show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                  textStyle:{   //textStyle里面写y轴下的字体的样式
                      color:'black',
                      fontSize:14
                  }
              },
              nameTextStyle:{
                  color:"black",
                  fontSize:14,
                  padding:[30, 35, 15, 10]
              }
          }
          ],
          series : [
          {
              name:'试卷',
              type:'bar',
              barWidth: '20%',
              data: Paper_Data
          },
          {
              name:'试题',
              type:'bar',
              barWidth: '20%',
              data: Question_Data
          },
          {
              name:'知识单元',
              type:'bar',
              barWidth: '20%',
              data: KU_Data
          },
          ]
      };
      myChart.setOption(option);

      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize',function() {myChart.resize()});
      });
    }
  }
};
</script>
<style scoped>
.link-bg {
  padding-top: 50px;
  background: #EEF5FE;
  background-size: 100%;
  position: relative;
  min-height: 700px;
  background-position: center;
  background-size: cover;
  z-index: 1;
}

/* 5. about */
.about-area {
  padding-top: 50px;
  padding-bottom: 50px;
}
.about-content h2 {
  font-size: 40px;
  line-height: 1.3;
  margin-bottom: 22px;
  font-family: "Helvetica";
}
.section-title h2 {
  color: #1a2930;
}
.about-content h2 span {
  color: #1a2930;
}
.about-content p {
  margin-bottom: 30px;
  padding-right: 20px;
}
.about-content p:last-child {
  margin-bottom: 0;
  padding-right: 0;
}
.cta-area {
  padding-top: 150px;
  padding-bottom: 150px;
}
.about-image {
  margin-left: -130px;
}
.search-area {
  padding-top: 100px;
}
/* }
.link-card {
  height: 360px;
  overflow: inherit;
  background-color: #1a2930;
  color: #fff;
} */
.card_title {
  font-weight: 900;
  font-size: 17px;
  color: #eeffbb;
}
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
.el-divider__text{
  position:absolute;
  background-color: rgba(0,0,0,0);
  padding:0 20px;
  font-weight:500;
  color:#303133;
  font-size:14px
}
.el-divider--horizontal{
  display:block;
  height:4px;
  width:100%;
  margin:24px 0
}
.resourceButton{
  background: #48a6f3;
  color: white;
}
.el-button:focus{
  background: #48a6f3;
  color: white;
}
.el-button:active{
  background: #48a6f3;
  color: white;
}
.el-button:hover{
  background: #98caf3;
  color: white;
}
.sleepingButton{
  background: #F8FBFF;
  color: rgb(122, 122, 122);
}
.partData{
  height: 120px;
  background: #EEF5FE;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  border-radius: 10px;
}
.data_chart{
   border-radius: 10px;
   width: 67%;
   height:300px;
   padding-top: 20px;
   margin-left: 16.5%;
   border: 3px solid #EEF5FE;
   margin-bottom: 40px;
}
</style>
