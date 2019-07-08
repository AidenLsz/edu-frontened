<template>
  <!--todo: polish the format-->
  <div class="home">
    <div class="title">
      <h1>
        BASE-KG
      </h1>
    </div>

    <div class="sub title">
      <h2>
        教育领域专用知识图谱
      </h2>
    </div>

    <div class="carousel show">
      <!--todo: 插入图片替代掉数字-->
      <!--todo: 格式优化一下，现在长宽比有点奇怪-->
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="item in 8" :key="item">
          <h3 class="medium">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="description">
      <!--todo: 格式优化一下，两边留一些空隙出来，字体颜色也换一下-->
      大数据分析与应用安徽省重点实验室 （Anhui Province Key Laboratory of Big
      Data Analysis and Application），
      学科领域为电子信息，由中国科学技术大学、科大讯飞股份有限公司（以下简称科大讯飞公司）
      和安徽广电传媒产业集团有限责任公司（以下简称安徽广电集团）三方共建。
      其中，作为依托单位的中国科学技术大学，是我省乃至我国大数据分析与应用方向的优势研究单位；
      同时，作为共建单位的科大讯飞公司和安徽广电集团，不仅拥有规模庞大的大数据云平台以及优质数据资源，
      而且具有丰富的大数据技术产业化经验；更为重要的是，经过多年的合作，
      共建三方已经形成了强强联合、优势互补的稳定合作局面，围绕大数据分析与应用方向，
      建立了大数据产学研合作平台，在科研平台、产业平台和数据平台三个方面都拥有良好的科研和产业环境。
      实验室建设地点为中国科学技术大学科技实验楼西楼，建设项目负责人陈恩红教授，联系电话0551-63601558。
    </div>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {};
  }
};
</script>
<style scoped lang="scss">
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.description {
  width: 60%;
  margin: auto;
}
</style>
