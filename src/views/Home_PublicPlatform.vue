<template>
  <div >
    <div id="Top_Nav" class="Top_Nav"></div>
    <!-- <Layout></Layout> -->
    <div class="summary">
      <div class="AIlab_title">AI<span style="color: white">实验室</span></div>
      <div class="AIlab_text">
        本平台由LUNA团队提供和维护，依托领先的技术实力，我们为用户提供高品质的教育产品及服务，全面分析试题，提升学习效率，目前推出了包括图片转写、属性预估、相似度分析等多款在线服务，旨在为用户提供智能练习、难题解析等多元化的智能教育服务。
      </div>
      <div class="AIlab_photo"></div>
    </div>
    <div class="service">
      <div class="service_title">智能教育功能体验</div>
      <!-- <div class="service_text">
        API服务概述 API服务概述 API服务概述 API服务概述 API服务概述 API服务概述
        API服务概述 API服务概述 API服务概述 API服务概述 API服务概述 API服务概述
        API服务概述 API服务概述
      </div> -->
      <div class="API" style="left: 25%; top: 220px">
        <div
          class="API_photo"
          :style="{
            'background-image':
              'url(' + require('@/assets/AIlab_Home/2.jpg') + ')',
          }"
          @click="ToImageTranscription"
        ></div>
        <div class="title" @click="ToImageTranscription">图片转写</div>
        <div class="desc">
          精准识别试题照片中的文字、公式以及附图附表，适用于试题录入、试题搜索和复杂公式识别等场景。
        </div>
        <el-link class="link" type="primary" @click="ToImageTranscription"
          >了解更多
          <i class="el-icon-right"></i>
        </el-link>
      </div>
      <div class="API" style="right: 25%; top: 220px">
        <div
          class="API_photo"
          :style="{
            'background-image':
              'url(' + require('@/assets/AIlab_Home/3.jpg') + ')',
            'background-position': '0px -25px',
          }"
          @click="ToEstimate"
        ></div>
        <div class="title" @click="ToEstimate">属性预估</div>
        <div class="desc">
          从包含复杂语义的试题文本出发，挖掘试题的难度、区分度和知识点等属性，实现高效、客观的自动化属性预估。
        </div>
        <el-link class="link" type="primary" @click="ToEstimate"
          >了解更多
          <i class="el-icon-right"></i>
        </el-link>
      </div>
      <div class="API" style="left: 25%; top: 650px">
        <div
          class="API_photo"
          :style="{
            'background-image':
              'url(' + require('@/assets/AIlab_Home/4.jpg') + ')',
            'background-position': '0px -50px',
          }"
          @click="ToSimilarity"
        ></div>
        <div class="title" @click="ToSimilarity">相似度估计</div>
        <div class="desc">
          基于人工智能算法，给出两个题目之间的多维度相似度预估，并提供预估结果的可解释性理由。
          打散入库
        </div>
        <el-link class="link" type="primary" @click="ToSimilarity"
          >了解更多
          <i class="el-icon-right"></i>
        </el-link>
      </div>
      <div class="API" style="right: 25%; top: 650px">
        <div
          class="API_photo"
          :style="{
            'background-image':
              'url(' + require('@/assets/AIlab_Home/5.jpg') + ')',
            'background-position': '0px -50px',
          }"
          @click="ToSegmentation"
        ></div>
        <div class="title" @click="ToSegmentation">试卷打散入库</div>
        <div class="desc">
          从试卷中切分出题目、答案、解析等部分。基于深度学习算法，保证在面对特征复杂、题型多、文本长等难以切分的试卷时，依然有很好的切分效果。
        </div>
        <el-link class="link" type="primary" @click="ToSegmentation"
          >了解更多
          <i class="el-icon-right"></i>
        </el-link>
      </div>
      <div class="API" style="left: 25%; top: 1080px">
        <div
            class="API_photo"
            :style="{
            'background-image':
              'url(' + require('@/assets/AIlab_Home/6.jpg') + ')',
            'background-position': '0px -50px',
          }"
            @click="ToQues"
        ></div>
        <div class="title" @click="ToQues">试题比较</div>
        <div class="desc">
          从难度、区分度、相似度等多个角度出发，提供多维度的试题成对比较标注管理平台，助力题目质量提升和优质试题筛选。
        </div>
        <el-link class="link" type="primary" @click="ToQues"
        >了解更多
          <i class="el-icon-right"></i>
        </el-link>
      </div>

    </div>
    <div class="algorithm">
      <div class="algo_title">开源工具与数据集</div>
      <!-- <div class="algo_text">
        开源服务与算法概述 开源服务与算法概述 开源服务与算法概述
        开源服务与算法概述 开源服务与算法概述 开源服务与算法概述
        开源服务与算法概述 开源服务与算法概述
      </div> -->
      <div class="algo1_title">
        教育<span style="color: #409eff">数据</span>集
      </div>
      <div class="algo1_text">
        提供教育数据集、便利的下载接口和预处理教育数据集的界面
      </div>
      <div class="algo1_use" @click="ToEduDate">
        <span class="button">点击使用</span>
      </div>
      <div class="algo1_photo"></div>
      <div class="algo2_title"><span style="color: #409eff">NLP</span>工具</div>
      <div class="algo2_text">
        为教育类数据（如试题、试卷等）提供自然语言处理工具
      </div>
      <div class="algo2_use" @click="ToEduNLP">
        <span class="button">点击使用</span>
      </div>
      <div class="algo2_photo"></div>
    </div>
  </div>
</template>

<script>
// import Layout from "../layout/PublicPlatformLayout_B.vue"

export default {
  name: "PublicPlatform",
  components: {
    // Layout
  },
  activated() {
    this.ToTop();
  },
  mounted() {
    this.ToTop();
  },
  methods: {
    ToTop() {
      document.getElementById("Top_Nav").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    ToImageTranscription() {
      this.$router.push({
        path: "/PublicPlatform/ImageTranscription",
      });
      this.ToTop();
    },
    ToEstimate() {
      this.$router.push({
        path: "/PublicPlatform/Estimate",
      });
      this.ToTop();
    },
    ToSimilarity() {
      this.$router.push({
        path: "/PublicPlatform/Similarity",
      });
      this.ToTop();
    },
    ToSegmentation() {
      this.$router.push({
        path: "/PublicPlatform/segmentation",
      });
      this.ToTop();
    },
    ToQues() {
      this.$router.push({
        path: "/PublicPlatform/ques-paired-quality",
      });
      this.ToTop();
    },
    ToEduDate() {
      window.location = "https://github.com/bigdata-ustc/EduData";
    },
    ToEduNLP() {
      window.location = "https://github.com/bigdata-ustc/EduNLP";
    },
  },
};
</script>

<style scoped lang="scss">
.summary {
  position: relative;
  width: 100%;
  // min-width: 1440px;
  // overflow: scroll;
  height: 780px;
  left: 0px;
  background: #23242a;
}

.AIlab_title {
  position: absolute;
  left: 9.93%;
  top: 25.9%;

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: bold;
  font-size: 58px;
  line-height: 56px;
  /* or 97% */
  letter-spacing: 0.06em;
  color: #409eff;
}

.AIlab_text {
  position: absolute;
  left: 9.93%;
  right: 57.85%;
  top: 37.8%;
  text-align: left;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: 290;
  font-size: 18px;
  line-height: 32px;
  /* or 178% */
  color: #e5e5e5;
  mix-blend-mode: normal;
}

.AIlab_photo {
  position: absolute;
  left: 47.36%;
  right: 6.88%;
  top: 14.1%;
  bottom: 17.4%;

  background-image: url("~@/assets/AIlab_Home/1.jpg");
  background-size: cover;
  border-radius: 12px;
}

.service {
  position: relative;
  width: 100%;
  height: 1600px;
  // min-width: 1440px;
  // overflow: scroll;
  left: 0px;
  background: #e5e5e5;
}

.service_title {
  position: absolute;
  left: 500px;
  right: 500px;
  top: 80px;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 56px;
  /* identical to box height, or 156% */
  text-align: center;
  letter-spacing: 0.06em;
  color: #000;
  mix-blend-mode: normal;
}

.service_text {
  position: absolute;
  left: 150px;
  right: 150px;
  top: 159px;

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: 290;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  color: #7d7987;
  mix-blend-mode: normal;
}

.API {
  overflow: hidden;
  position: absolute;
  width: 306.32px;
  height: 400px;
  background: #ffffff;
  box-shadow: 10px 40px 50px rgba(229, 233, 246, 0.4);
  border-radius: 20px;
  .API_photo {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 136px;
    background-size: cover;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    transition: width 0.2s, height 0.2s, left 0.2s, top 0.2s;
    -webkit-transition: width 0.2s, height 0.2s, left 0.2s, top 0.2s;
  }
  &:hover .API_photo {
    position: absolute;
    top: -10px;
    left: -10px;
    width: calc(100% + 20px);
    height: 156px;
    // background-size: cover;
    // border-top-left-radius: 20px;
    // border-top-right-radius: 20px;
    cursor: pointer;
  }
  .title {
    position: absolute;
    left: 22.76px;
    top: 148px;
    width: 180px;
    height: 44px;
    text-align: left;
    font-family: Mulish;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 56px;
    letter-spacing: 0.02em;
    color: #000000;
    mix-blend-mode: normal;
  }
  .title:hover {
    cursor: pointer;
    text-decoration: underline;
  }
  .desc {
    position: absolute;
    text-align: left;
    left: 23px;
    top: 202px;
    width: 241px;
    height: 66px;
    font-family: Mulish;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 28px;
    color: #7d7987;
    mix-blend-mode: normal;
  }
  .link {
    position: absolute;
    text-align: left;
    left: 23px;
    bottom: 30px;
    height: 28px;
    font-family: Mulish;
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 28px;
  }
}

.algorithm {
  position: relative;
  width: 100%;
  height: 1400px;
  left: 0px;
  // min-width: 1440px;
  background: #232426;
}

.algo_title {
  position: absolute;
  left: 555px;
  right: 555px;
  top: 120px;
  height: 67px;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 56px;
  /* or 156% */
  text-align: center;
  letter-spacing: 0.06em;
  color: #ffffff;
  mix-blend-mode: normal;
}

.algo_text {
  position: absolute;
  left: 150px;
  right: 150px;
  top: 200px;
  height: 72px;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: 290;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.88);
  mix-blend-mode: normal;
}

.algo1_title {
  position: absolute;
  left: 14%;
  width: 300px;
  top: 400px;
  height: 100px;
  text-align: left;

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 48px;
  letter-spacing: 0.06em;
  color: #ffffff;
  mix-blend-mode: normal;
}

.algo1_text {
  position: absolute;
  left: 14%;
  width: 440px;
  top: 493px;
  height: 79px;
  text-align: left;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: 290;
  font-size: 18px;
  line-height: 30px;
  /* or 167% */

  color: rgba(255, 255, 255, 0.88);

  mix-blend-mode: normal;
}

.algo1_use {
  position: absolute;
  left: 14%;
  width: 167px;
  top: 600px;
  height: 60px;
  cursor: pointer;
  border: 1.4px solid #0e6fff;
  box-sizing: border-box;
  border-radius: 55px;
  .button {
    display: block;
    font-family: Mulish;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 57.2px;
    width: 100%;
    /* or 333% */
    text-align: center;
    align-items: center;

    color: #0e6fff;
    letter-spacing: 2px;
    mix-blend-mode: normal;
  }
}

.algo1_use:hover {
  background-color: #458ff6;
  .button {
    color: #ffffff;
  }
}

.algo1_photo {
  position: absolute;
  width: 564px;
  height: 359px;
  right: 9%;
  top: 366px;

  background-image: url("~@/assets/AIlab_Home/6.jpg");
  background-size: cover;
  border-radius: 12px;
}

.algo2_title {
  position: absolute;
  left: 60%;
  width: 300px;
  top: 860px;
  height: 100px;
  text-align: left;

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 48px;
  letter-spacing: 0.06em;
  color: #ffffff;
  mix-blend-mode: normal;
}

.algo2_text {
  position: absolute;
  left: 60%;
  width: 440px;
  top: 957px;
  height: 79px;
  text-align: left;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: 290;
  font-size: 18px;
  line-height: 30px;
  /* or 167% */

  color: rgba(255, 255, 255, 0.88);

  mix-blend-mode: normal;
}

.algo2_use {
  position: absolute;
  left: 60%;
  width: 167px;
  top: 1076px;
  height: 60px;
  cursor: pointer;
  border: 1.4px solid #0e6fff;
  box-sizing: border-box;
  border-radius: 55px;
  .button {
    display: block;
    width:100%;
    font-family: Mulish;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 57.2px;
    /* or 333% */
    text-align: center;
    align-items: center;

    color: #0e6fff;
    letter-spacing: 2px;
    mix-blend-mode: normal;
  }
}

.algo2_use:hover {
  background-color: #458ff6;
  .button {
    color: #ffffff;
  }
}

.algo2_photo {
  position: absolute;
  width: 564px;
  height: 359px;
  left: 9%;
  top: 830px;

  background-image: url("~@/assets/AIlab_Home/7.jpg");
  background-size: cover;
  border-radius: 12px;
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 0px;
  background: transparent;
}
</style>
