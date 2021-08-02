<template>
  <!--todo: polish the format-->
  <div class="home">
    <section class="slider-bg" >

    </section>

    <!-- about-area -->
    <section class="about-area">
      <el-row>
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <h1 style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; margin-top: 5px">简介</h1>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8" :offset="2">
          <img src="../assets/intro.png" width="70%"/>
        </el-col>
        <el-col :span="9">
          <p style="font-size: 20px; line-height: 200%; padding-left: 30px; margin-top: 7vh; text-align: left">
          智慧教育知识图谱（LUNA）致力于为广大师生提供智能且直观的知识组织、呈现、应用等多维度功能。通过对海量教材、题库、考纲等教育教学资源进行深层次的数据挖掘与建模。LUNA具有其他知识图谱所不具备的而丰富内容和多样化的智能接口。LUNA不仅提供了简单、直观、易用的知识、资源查询功能，还提供了如自动考卷分析、试题难度评估等智慧化分析、评估接口，可满足广大师生、学校管理者丰富的教育教学需求。
          </p>
        </el-col>
      </el-row>

    </section>
    <!-- 图标区域-area -->
    <section class="link-bg">
      <el-row style="margin-top: 50px;">
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <span style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; font-size: 36px;">数据统计</span>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <statistics/>
    </section>
    <!-- cta-area-end -->
  </div>
</template>
<script>

import $ from "jquery";
import statistics from '@/common/components/statistics'

export default {
  components: { statistics},
  name: "Home",
  data() {
    return {
      image_infos: [],
      ToolsLabelNow: "资源",
      functionStatus: [false, false, false, false],
      resourceStatus: [false, false, false, false],
      Num_Paper: 0,
      Num_Question: 0,
      Num_KU: 0,
      Paper_Data: [],
      Question_Data: [],
      KU_Data: [],
      Chart_Data: {},
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false,
      Count_Type: "Question"
    };
  },
  mounted() {
    // this.Init_Bar();
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
    // 调整首页统计表格的内容
    changeCountButton(type){
      this.Count_Type = type;
      this.Redraw_Bar();
    },
    // Get_Count_Style(type){
    //   if(type == this.Count_Type){
    //     return "resourceButton"
    //   }else{
    //     return "sleepingButton"
    //   }
    // },
    // 获取首页统计表格的按钮的样式
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
        this.$router.push({ path: "/searchPaper" });
        this.PaperAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch(){
      this.PaperAnalyseSwitchFlag = true;
    },
    ToTop(){
      window.scrollTo(0,0);
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
    // 重绘统计表图
    // Redraw_Bar(){
    //   if (BarChart != null && BarChart != "" && BarChart != undefined) {
    //     BarChart.dispose();//销毁
    //   }
    //   BarChart = echarts.init(document.getElementById('data_chart'));
    //     let option = {
    //       grid: {
    //         x: 70,
    //         y: 90,
    //         x2: 30,
    //         y2: 35
    //       },
    //       title: {
    //           text: "各学科数据统计",
    //           x: "center",
    //           y: "top",
    //           textStyle: {
    //               fontSize: 16,
    //               fontStyle: 'normal',
    //               fontWeight: 'bold',
    //           },
    //           padding: [5,5,40,25]
    //       },
    //       color: ['#409EFD'],
    //       tooltip : {
    //           trigger: 'axis',
    //           axisPointer : {
    //               type : 'shadow',
    //               label : {
    //                   show: true
    //               }
    //           },
    //           textStyle: {
    //               fontSize: 14,
    //               fontStyle: 'normal',
    //               align: 'left'
    //           },
    //       },
    //       calculable: true,
    //       legend: {
    //           data: [],
    //           itemGap: 20,
    //           x: "right",
    //           y: "top",
    //           padding: [5,30,40,5],
    //           textStyle: {
    //               fontSize: 14,
    //               fontStyle: 'normal',
    //           },
    //       },
    //       xAxis : [
    //       {
    //           type : 'category',
    //           data : this.Chart_Data.list_sub,
    //           axisTick: {
    //               alignWithLabel: true
    //           },
    //           axisLabel:{
    //               show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
    //               interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
    //               textStyle:{   //textStyle里面写x轴下的字体的样式
    //                   color:'black',
    //                   fontSize:14
    //               }
    //           },
    //       }
    //       ],
    //       yAxis : [
    //       {
    //           type : 'value',
    //           name : '数量',
    //           axisLabel:{
    //               show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
    //               textStyle:{   //textStyle里面写y轴下的字体的样式
    //                   color:'black',
    //                   fontSize:14
    //               }
    //           },
    //           nameTextStyle:{
    //               color:"black",
    //               fontSize:14,
    //               padding:[30, 35, 15, 10]
    //           }
    //       }
    //       ],
    //       series: []
    //   };
    //
    //   if(this.Count_Type == 'Question'){
    //     option.legend.data = ['试题']
    //     option.series = [{
    //           name:'试题',
    //           type:'bar',
    //           barWidth: '30%',
    //           data: this.Question_Data
    //       }]
    //   }else if(this.Count_Type == 'Paper'){
    //     option.legend.data = ['试卷']
    //     option.series = [{
    //           name:'试卷',
    //           type:'bar',
    //           barWidth: '30%',
    //           data: this.Paper_Data
    //       }]
    //   }else if(this.Count_Type == 'KU'){
    //     option.legend.data = ['知识单元']
    //     option.series = [{
    //           name:'知识单元',
    //           type:'bar',
    //           barWidth: '30%',
    //           data: this.KU_Data
    //       }]
    //   }
    //   console.log(option.series)
    //   BarChart.setOption(option);
    //
    //   //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
    //   window.addEventListener('resize',function() {BarChart.resize()});
    // },
    // 初始化统计表图
    // Init_Bar(){
    //
    //   let config = {
    //       headers: { "Content-Type": "multipart/form-data" }
    //   };
    //   let param = new FormData();
    //
    //   this.$http
    //   .post(this.backendIP + "/api/count", param, config, {
    //     emulateJSON: true
    //   })
    //   .then(function(data) {
    //
    //     this.Chart_Data = {};
    //
    //     this.Paper_Data = [];
    //     this.Question_Data = [];
    //     this.KU_Data = [];
    //
    //     this.Chart_Data = data.data;
    //
    //     this.Num_Paper = this.Chart_Data.num_paper;
    //     this.Num_Question = this.Chart_Data.num_question;
    //     this.Num_KU = this.Chart_Data.num_knowledge;
    //     for(var index = 0; index < this.Chart_Data.num_sub.length; index ++){
    //       this.Paper_Data.push(this.Chart_Data.num_sub[index].paper);
    //       this.Question_Data.push(this.Chart_Data.num_sub[index].question);
    //       this.KU_Data.push(this.Chart_Data.num_sub[index].knowledge);
    //     }
    //     this.Redraw_Bar();
    //   });
    // }
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
.slider-bg {
  background: url("../assets/bg.png");
  background-size: 100%;
  position: relative;
  min-height: 653px;
  background-position: center;
  background-size: cover;
  z-index: 1;
}
.slider-bg::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: -1;
}
.sticky-menu {
  left: 0;
  margin: auto;
  position: fixed;
  top: 0;
  width: 100%;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  z-index: 9999;
  background: #fff;
  -webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
}
.slider-content h2 {
  font-size: 48px;
  color: #fff;
  display: inline-block;
  text-align: center;
  text-align-last: center;
}

.slider-content p {
  font-size: 30px;
  color: #fff;
  margin-top: 10px;
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

/* .partData{
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
} */
</style>
