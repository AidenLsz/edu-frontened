<template>
  <!--todo: polish the format-->
  <div class="home">
    <section class="slider-area slider-bg" data-background="/static/bg6.png">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="slider-content text-center">
              <h2 class="wow fadeInUp" data-wow-delay=".2s">BASE-KG</h2>
            </div>
          </div>
        </div>
      </div>
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
// import { WOW } from "wowjs";
import $ from "jquery";
export default {
  name: "Home",
  data() {
    return {};
  },
  mounted() {
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
  }
};
</script>
<style scoped lang="scss">
.slider-bg {
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
</style>
