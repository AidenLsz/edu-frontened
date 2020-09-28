<template>
  <!--todo: polish the format-->
  <div class="home">
    <section class="slider-area slider-bg" >
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="slider-content text-center">
              <h2 class="wow fadeInUp">BASE-KG</h2>
              <h1 style="color: #fff; margin-top:20px;">教育知识图谱</h1>
            </div>
            <div class="search-area">
              <form @submit.prevent="submit" style="margin-top: 20px;">
                <el-row type="flex" class="row-bg" justify="center">
                  <el-col :span="22">
                    <el-input
                      v-model="ku_name"
                      placeholder="三角函数"
                    ></el-input>
                  </el-col>
                  <el-button type="submit" value="提交" @click="submit"
                    >检索</el-button
                  >
                </el-row>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="link-area">
      <!-- 试题检索卡片跳转 -->
      <el-row style="padding-bottom: 70px;">
        <h2>KNOWLEDGE GRAPHS</h2>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-card class="link-card" shadow="hover">
            <p>
              <span class="card_title">BDAA知识点搜索引擎</span><br />
              BDAA知识点搜索引擎致力于让用户更便捷、全面地获取知识点信息。可以瞬间找到相关知识点的描述内容和关联信息。
            </p>
            <router-link to="/ku">
              <el-button round style="margin-top: 150px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
        <el-col :span="10" :offset="2">
          <el-card class="link-card" shadow="hover">
            <p>
              <span class="card_title">试题属性标注（如难度、考察知识点）</span
              ><br />试题属性标注（如难度、考察知识点）是众多试题相关任务如试卷的组卷、学生答题记录的分析等的基础。一直以来是教育领域专家的关注点，也是众多教育领域人工智能技术的重要数据支撑。以往试题属性只能通过命题专家凭借积累的经验对试题的属性进行手动标注，但难以有效地对试题在语义以及更深的层面进行理解与属性判断，特别是很难应对大批量的试题标注任务。为有效解决这一问题，我们提供了一套基于人工智能技术的试题属性自动标注API，可以对试题进行自动难度预估、考察知识点识别等功能。
            </p>
            <router-link to="/exercise">
              <el-button round style="margin-top: 30px;">立即体验</el-button>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <!-- about-area -->
    <section class="about-area">
      <div class="container">
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
      </div>
    </section>
    <!-- cta-area -->
    <section class="cta-area wow fadeInUp" data-wow-delay=".4s">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-9 col-lg-9">
            <div class="section-title text-center">
              <h2>关于我们</h2>
            </div>
            <div class="cta-content text-center">
              <p>
                大数据分析与应用安徽省重点实验室（Anhui Province Key Laboratory
                of Big Data Analysis and
                Application），学科领域为电子信息，由中国科学技术大学、科大讯飞股份有限公司（以下简称科
                大讯飞公司）和安徽广电传媒产业集团有限责任公司（以下简称安徽广电集团）三方共建。
                其中，作为依
                托单位的中国科学技术大学，是我省乃至我国大数据分析与应用方向的优势研究单位；同时，作为共建单
                位的科大讯飞公司和安徽广电集团，不仅拥有规模庞大的大数据云平台以及优质数据资源，而且具有丰富
                的大数据技术产业化经验；更为重要的是，经过多年的合作，共建三方已经形成了强强联合、优势互补的
                稳定合作局面，围绕大数据分析与应用方向，建立了大数据产学研合作平台，在科研平台、产业平台和数
                据平台三个方面都拥有良好的科研和产业环境。
              </p>
              <!-- <a href="#" class="btn ">了解更多</a> -->
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- cta-area-end -->
  </div>
</template>
<script>
import $ from "jquery";
export default {
  name: "Home",
  data() {
    return {
      ku_name: "三角函数"
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
    }
  }
};
</script>
<style scoped>
.slider-bg {
  background: url("../assets/bg0.png");
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
  line-height: 1.2;
  margin-top: 80px;
}

.slider-content p {
  font-size: 30px;
  color: #fff;
  margin-top: 10px;
}
/* 5. about */
.about-area {
  padding-top: 150px;
  padding-bottom: 150px;
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
.link-area {
  padding-top: 200px;
  padding-bottom: 150px;
}
.link-card {
  height: 360px;
  overflow: inherit;
  background-color: #1a2930;
  color: #fff;
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
.el-button {
  background-color: #008080;
  color: #fff;
  border-color: #008080;
}
.el-button:hover {
  background-color: #666;
  color: #fff;
  border-color: #666;
}
.el-button:focus {
  background-color: #666;
  color: #fff;
  border-color: #666;
  outline: none;
}
</style>
