<template>
  <!--todo: polish the format-->
  <div class="home">
    <section class="slider-area slider-bg" >
      <el-row type="flex" class="row-bg" justify="center" style="padding-top: 400px;">
        <el-col :span="14">
          <el-input
            v-model="ku_name"
            placeholder="三角函数"
          ></el-input>
        </el-col>
        <el-col :span="1" :offset="1">
          <el-button type="primary" @click="submit" plain
            ><i class="el-icon-search" style="margin-right: 15px"></i>检索</el-button
          >
        </el-col>
      </el-row>
    </section>

    <!-- about-area -->
    <section class="about-area">
      <el-row>
        <el-col :span="6" :offset="2">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="8">
          <h1 style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; margin-top: 5px">简介</h1>
        </el-col>
        <el-col :span="6">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="2">
          <img src="../assets/intro.png" width="70%"/>
        </el-col>
        <el-col :span="7">
          <p style="font-size: 20px; line-height: 200%; padding-left: 30px; margin-top: 7vh">
          智慧教育知识图谱（LUNA）致力于为广大师生提供智能且直观的知识组织、呈现、应用等多维度功能。通过对海量教材、题库、考纲等教育教学资源进行深层次的数据挖掘与建模。LUNA具有其他知识图谱所不具备的而丰富内容和多样化的智能接口。LUNA不仅提供了简单、直观、易用的知识、资源查询功能，还提供了如自动考卷分析、试题难度评估等智慧化分析、评估接口，可满足广大师生、学校管理者丰富的教育教学需求。
          </p>
        </el-col>
      </el-row>
      <!-- <div class="container">
        <div class="row align-items-center">
          <div class="col-xl-6 col-lg-6 wow fadeInLeft" data-wow-delay=".3s">
            <div class="about-image">
              <img src="../assets/kg1.png" alt="img" />
            </div>
          </div>
          <div class="col-xl-6 col-lg-6 wow fadeInRight" data-wow-delay=".3s">
            <div class="about-content">
              <h2><span>教育知识图谱</span></h2>
              <p>
                知识图谱一种大规模语义网络，以实体或者概念作为节点，通过语义关系相连接。
                通过发掘实体之间的关联，将半结构化、非结构化的数据整合，知识图谱可以帮助机器
                理解数据、解释现象、知识推理，从而发掘深层关系、实现智慧搜索与智能交互。
              </p>
              <p>
                将交互学科涉及的知识点及其相互关系的建立就需要耗费专业教师大量的时间，以及对应题目的知识点标注，这些工作无穷无尽且、效率低下、耗资昂贵且准确率不高。<br />
                通过知识图谱将多源异构数据整合，构建出简单易用的学科知识图谱，帮助教师掌握动态、关联的学科信息，有助于因材施教，提高教研效率。
              </p>
            </div>
          </div>
        </div>
      </div> -->
    </section>

    <section class="link-bg">
      <!-- 试题检索卡片跳转 -->
      <el-row style="margin-bottom: 50px">
        <el-col :span="6" :offset="2">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="8">
          <span style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; font-size: 36px;">资源与功能</span>
        </el-col>
        <el-col :span="6">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="6" :offset="1">
          <el-card shadow="hover">
            <p style="height: 100px">
              <span class="card_title">BDAA知识点搜索引擎</span><br /><br /><br />
              BDAA知识点搜索引擎致力于让用户更便捷、全面地获取知识点信息。可以瞬间找到相关知识点的描述内容和关联信息。
            </p>
            <router-link to="/ku">
              <el-button round style="margin-top: 150px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-card shadow="hover">
            <p style="height: 220px">
              <span class="card_title">试题检索</span><br /><br /><br />
              试题检索功能文字说明。
            </p>
            <router-link to="/exercise">
              <el-button round style="margin-top: 30px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-card shadow="hover">
            <p style="height: 220px">
              <span class="card_title">试题属性预估（如难度、考察知识点）</span><br /><br /><br />
              试题属性预估（如难度、考察知识点）是众多试题相关任务如试卷的组卷、学生答题记录的分析等的基础。一直以来是教育领域专家的关注点，也是众多教育领域人工智能技术的重要数据支撑。BDAA为您提供一套基于人工智能技术的试题属性自动标注API，可以对试题进行自动难度预估、考察知识点识别等功能。
            </p>
            <router-link to="/estimate">
              <el-button round style="margin-top: 30px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
      <br/><br/>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-card shadow="hover">
            <p style="height: 100px">
              <span class="card_title">试题相似度预估</span><br /><br /><br />
              试题相似度预估文字说明。
            </p>
            <router-link to="/similarity">
              <el-button round style="margin-top: 150px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-card shadow="hover">
            <p style="height: 220px">
              <span class="card_title">试题录入</span><br /><br /><br />
              试题录入功能文字说明。
            </p>
            <router-link to="/inputMarked">
              <el-button round style="margin-top: 30px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="6" :offset="2">
          <el-card shadow="hover">
            <p style="height: 220px">
              <span class="card_title">测试页面</span><br /><br /><br />
              观察测试功能用页面的访问路径，正式上线会去除并将其他五个转化为五环样式的交替排列。
            </p>
            <router-link to="/TestPageList">
              <el-button type="warning" round style="margin-top: 30px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="20" :offset="2">
          <el-tabs v-model="ToolsLabelNow" type="border-card" @tab-click="changeToolsLabel">
            <el-tab-pane label="资源" name="资源" style="padding-top: 30px;">
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon7.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    学习资源
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon6.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    试题资源
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon8.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    试卷资源
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon5.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    知识体系
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
            </el-tab-pane>
            <!-- 第二段 -->
            <el-tab-pane label="功能" name="功能" style="padding-top: 30px;">
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px;"><img src="../assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    资源录入
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon3.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    学习
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon2.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    管理
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
              <el-col :span="6">
                <el-row>
                  <el-button circle style="height: 200px; width: 200px"><img src="../assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
                </el-row>
                <el-row>
                  <label style="margin-top: 30px; font-size: 20px">
                    分析
                  </label>
                </el-row>
                <el-row  style="margin-top: 15px; font-size: 10px; margin-bottom: 15px">
                  <span>介绍文字</span>
                </el-row>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </section>
    
    <!-- cta-area -->
    <section>
      <el-row style="margin-top: 50px;">
        <el-col :span="4" :offset="5">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="6">
          <span style="padding-left: 5vw; padding-right: 4vw; letter-spacing: 1vw; font-size: 36px;">关于我们</span>
        </el-col>
        <el-col :span="4">
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <el-row style="margin-top: 80px; padding-bottom: 200px">
        <el-col :span="14" :offset="5">
          <span style="font-size: 16px; line-height: 200%; text-align: left; font-weight: bold; display: inline-block">
            大数据分析与应用安徽省重点实验室（Anhui Province Key Laboratory of Big Data Analysis and Application），学科领域为电子信息，由中国科学技术大学、科大讯飞股份有限公司（以下简称科大讯飞公司）和安徽广电传媒产业集团有限责任公司（以下简称安徽广电集团）三方共建。其中，作为依托单位的中国科学技术大学，是我省乃至我国大数据分析与应用方向的优势研究单位；同时，作为共建单位的科大讯飞公司和安徽广电集团，不仅拥有规模庞大的大数据云平台以及优质数据资源，而且具有丰富的大数据技术产业化经验；更为重要的是，经过多年的合作，共建三方已经形成了强强联合、优势互补的稳定合作局面，围绕大数据分析与应用方向，建立了大数据产学研合作平台，在科研平台、产业平台和数据平台三个方面都拥有良好的科研和产业环境。
          </span>
        </el-col>
      </el-row>
    </section>
    <!-- cta-area-end -->
  </div>
</template>
<script>

import $ from "jquery";

export default {
  components: { },
  name: "Home",
  data() {
    return {
      ku_name: "三角函数",
      image_infos: [],
      ToolsLabelNow: "资源"
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
  },
  methods: {
    submit() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.ku_name }
      });
    },
    changeToolsLabel(){

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
  height:2px;
  width:100%;
  margin:24px 0
}
</style>
