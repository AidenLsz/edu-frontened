<template>
  <div class="qp-container"
  >
    <div class="qp-loading-layer"
         v-loading="isLoading"
         element-loading-text="加载中"
         element-loading-spinner="el-icon-loading"
         v-show="isLoading"
    >

    </div>
    <el-row class="qp-bread" justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item><router-link to="/">首页</router-link></el-breadcrumb-item>
            <el-breadcrumb-item><router-link to="/PublicPlatform">AI 实验室</router-link></el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
      </el-col>
    </el-row>
    <h1 class="qp-title">试题标注</h1>
    <div class="qp-form">
      <ques-paired-form/>
    </div>
    <div class="qp-confirm">
      <el-button type="primary" icon="el-icon-s-operation">单题评分</el-button>
      <el-button @click="onPair" icon="el-icon-collection-tag">对比标注</el-button>
    </div>

    <div class="qp-active" :class="{ show: isUploaded}">
      <div class="qp-arrow-wrapper" @click="scrollToPaper()">
        <div class="qp-arrow" />
      </div>
      <div class="qp-questions">
        <div id="qp-body__anchor"></div>
        <div v-for="(pair, idx) in questionPairs" :key="pair.question_ID0 + pair.question_ID1" class="qp-question">
          <ques-paired-header :pair="pair" :idx="idx + 1"/>
          <ques-paired-body :prefix="`${idx + 1}`" :left-question="getQuestion(pair.question_ID0)" :right-question="getQuestion(pair.question_ID1)" :figures="figures"/>
        </div>

        <div class="qp-pagination">
          <el-pagination
              background
              layout="prev, pager, next"
              :total="pageTotal"
              :current-page="pageNum"
              @current-change="onPageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuesPairedForm from './components/QuesPairedForm';
import QuesPairedHeader from './components/QuesPairedHeader';
import QuesPairedBody from './components/QuesPairedBody';
import {getQuestionPair} from './data';
import { commonAjax } from "@/common/utils/ajax";

export default {
  name: 'QuesPairedQuality',
  components: {
    QuesPairedForm,
    QuesPairedBody,
    QuesPairedHeader,
  },
  data() {
    return {
      isUploaded: false,
      isLoading: false,
      UUID: ``,
      pageNum: 1,
      pageTotal: 1,
      currentPage: 1,
      questionPairs: [],
      questions: [],
      figures: [],
    }
  },
  methods: {
    async onPair() {
      this.isLoading = true;

      const res = await getQuestionPair(this.pageNum);
      this.questions = res.questions;
      this.questionPairs = res.question_pairs;
      this.pageTotal = res.page_num;
      this.figures = res.figures;

      this.isUploaded = true;
      this.isLoading = false;
      setTimeout(()=>{
        this.scrollToPaper();
      }, 350);
    },
    async getUserUUID() {
      try {
        const res = await commonAjax(`${this.backendIP}/api/getUserUUID`, {});
        this.UUID = res.UUID;
      } catch (e) {
        console.log(e)
      }
    },
    getQuestion(questionID) {
      return this.questions.find(ele => ele.question_ID === questionID);
    },
    async onPageChange(pageNum) {
      this.scrollToPaper();
      this.pageNum = pageNum;
      await this.onPair();

    },
    async mounted() {
      await this.getUserUUID();
    },
    scrollToPaper() {
      document.getElementById("qp-body__anchor").scrollIntoView({
        behavior: "smooth",
      });
    },
  }
}
</script>

<style scoped lang="scss">
  .qp-bread {
    padding-top: 4rem;
  }

  .qp-loading-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2;
  }

  #qp-body__anchor {
    position: relative;
    top: -70px;
  }

  .qp-container {
    position: relative;
    text-align: left;
    padding: 0 13vw;

    &:before {
      content: "";
      position: absolute;
      width: 80vw;
      height: 80vw;
      top: -42vw;
      left: -20vw;
      border-radius: 50%;
      background: #d9e9fe;
      z-index: -1;
    }
  }

  .qp-title {
    font-weight: bold;
    margin-bottom: 4rem;
  }

  .qp-form {
    padding-left: 5rem;
  }

  .qp-confirm {
    margin-top: 4rem;
    margin-bottom: 4rem;
    display: flex;
    justify-content: center;
  }

  .qp-arrow-wrapper {
    width: 100%;
  }

  .qp-arrow {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    cursor: pointer;

  &:before,
  &:after {
     position: absolute;
     animation: qp-arrow-float 2s linear infinite;
     content: "";
     left: 0;
     right: 0;
     margin: 0 auto;
     width: 24px;
     height: 24px;
     background-color: transparent; /* 模块背景为透明 */
     border-color: #8d8d8d;
     border-style: solid;
     border-width: 2px 2px 0 0;
   }

  &:after {
     top: 6px;
   }

  &:before {
     top: 18px;
   }
  }

  .qp-active {
    display: none;

    &.show {
      display: block;
    }
  }

  @keyframes qp-arrow-float {
    0% {
      transform: translateY(0) rotate(135deg);
    }

    50% {
      transform: translateY(-6px) rotate(135deg);
    }

    100% {
      transform: translateY(0) rotate(135deg);
    }
  }

  .qp-questions {
    position: relative;
  }

  .qp-question {
    position: relative;
    z-index: 1;

    &:before {
      content: "";
      position: absolute;
      width: 100vw;
      height: 400px;
      left: -14vw;
      top: 8rem;
      transform: skewY(5deg);
      background: rgb(240 245 251);
      z-index: -1;
    }
  }

  .qp-pagination {
    text-align: center;
    margin-bottom: 5rem;
  }
</style>
