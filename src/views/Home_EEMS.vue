<template>
  <!--todo: polish the format-->
  <div class="home">
    <div id="Top_Nav" class="Top_Nav">

    </div>
    <section class="slider-bg" >
      <div class="sys-name">
        <img src="@/assets/bdaa.png" alt="Logo"  />
        <span class="text">
          智慧考试管理系统
        </span>
      </div>
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
          大数据分析与应用安徽省重点实验室由中国科学技术大学联合科大讯飞股份有限公司、安徽广电传媒产业集团有限责任公司共同建设。以围绕国家科技发展战略需求、服务安徽省经济社会发展的宗旨，在大数据基础理论、大数据分析技术、大数据应用和大数据处理平台等方向开展研究工作，研究内容包括机器学习与数据挖掘理论方法研究、个性化推荐与社交网络分析、面向智能服务的大数据应用研究等，在Nature Communications、IEEE/ACM Transactions等国际知名期刊和KDD、IJCAI、WWW、AAAI、NIPS等重要国际学术会议发表论文200余篇。
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
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false,
      Count_Type: "Question"
    };
  },
  mounted() {
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
    this.To_Top();
  },
  methods: {
    To_Top(){
          document.getElementById("Top_Nav").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      },
    // 调整首页统计表格的内容
    changeCountButton(type){
      this.Count_Type = type;
      this.Redraw_Bar();
    },
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
  }
};
</script>
<style scoped lang="scss">
.sys-name{
  img{
    position:relative;
    height:100px;
    background: rgba(255,255,255,1);
    border-radius: 35px;
    border-radius: 50%;
    box-shadow:0 0 5px 5px rgba(255,255,255,1) ;
  }
  .text{
    display: inline-block;
    vertical-align: middle;
    padding-left: 40px;
    color:#fff;
    font-size: 36px;
    font-weight: 900;
  }
}
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
  background: url("../assets/bg_pure.png");
  background-size: 100%;
  position: relative;
  min-height: 653px;
  background-position: center;
  background-size: cover;
  z-index: 1;
  justify-content:center;
  align-items:center;
  display:-webkit-flex;
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


.Top_Nav{
    position: relative;
    top: -90px;
    width: 10px;
    height: 10px;
    background: transparent;
}
</style>
