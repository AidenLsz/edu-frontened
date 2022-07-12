<template>
  <div
    v-loading="isLoading"
    class="pd-container"
    element-loading-text="加载中，请等待..."
    element-loading-spinner="el-icon-loading"
  >
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>标注管理平台</el-breadcrumb-item>
          </el-breadcrumb>
        </el-row>
      </el-col>
    </el-row>
    <h1 class="pd-title">试题切分标注</h1>
    <div class="pd-dialog">
      <div class="pd-dialog__options">
        <PaperdivideForm v-model="pdForm" />
      </div>
      <div class="pd-dialog__upload-box">
        <UploadBox ref="uploadBox" v-model="pdForm" />
      </div>
    </div>
    <div class="pd-divide-btn">
      <el-button @click="dividePaper" type="primary">切分试卷</el-button>
    </div>

    <div class="pd-active" :class="{ show: isUploaded }">
      <div class="pd-arrow-wrapper">
        <div class="pd-arrow" />
      </div>
      <div class="pd-body">
        <a class="pd-body__anchor" id="pd-body__anchor"></a>
        <div class="pd-body__preview">
          <PaperdividePreview
            :paper="processedRes.paper"
            :img-dict="dividedRes.imageDict"
          />
        </div>
        <div class="pd-body__sidebar">
          <PaperdivideSidebar :question-list="filterQuestionList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaperdivideForm from "./components/PaperdivideForm";
import UploadBox from "./components/UploadBox";
import PaperdivideSidebar from "./components/PaperdivideSidebar";
import PaperdividePreview from "./components/PaperdividePreview";

import {subjectList, periodList, eventList, getPaperType} from './data';
import { commonAjax } from "@/common/utils/ajax";

const QUESTION_INIT_ID = 1;
const QUESTION_INIT_SIDE_ID = 0;
const IS_TEST = false;

export default {
  name: "Paperdivide",
  components: {
    PaperdivideForm,
    UploadBox,
    PaperdividePreview,
    PaperdivideSidebar,
  },
  mounted() {
    if (
      !this.$store.state.user.name ||
      this.$store.state.user.name.length === 0
    ) {
      this.$message.error("您尚未登录，请登录后使用录入功能。");
      this.$router.push("/");
      return;
    }
    // 绑定子元素 emit 的事件
    this.bindEvts();
    this.getUserUUID();
  },
  computed: {
    filterQuestionList() {
      return this.processedRes.paper.filter(
        (question) => question.divide && question.active
      );
    },
  },
  data() {
    return {
      // 上传选项表单
      pdForm: {
        period: periodList[0].value,
        subject: subjectList[0].value,
        title: "",
        fileName: "",
        file: "",
      },
      dividedRes: {
        imageDict: {},
        paper: [],
      },
      // 备份处理前数据，用于还原
      backupRes: {
        imageDict: {},
        paper: [],
      },
      processedRes: {
        paper: [],
      },
      UUID: "",
      isLoading: false,
      isUploaded: false,
    };
  },
  methods: {
    async getUserUUID() {
      try {
        const res = await commonAjax(`${this.backendIP}/api/getUserUUID`, {});
        this.UUID = res.UUID;
      } catch (e) {
        console.log(e);
      }
    },
    async dividePaper() {
      this.isLoading = true;
      await this.uploadFile();
      this.processData();
      this.isLoading = false;
      setTimeout(() => {
        this.scrollToPaper();
      }, 350);
    },
    scrollToPaper() {
      document.getElementById("pd-body__anchor").scrollIntoView({
        behavior: "smooth",
      });
    },
    // 上传
    async uploadFile() {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("files", this.pdForm.file.raw);
      // subject
      formData.append("paper_type", getPaperType(this.pdForm.subject));
      formData.append("data_format", "0");
      formData.append("paper_Cut_New", true);
      try {
        const data = await this.$http.post(
          "https://file-upload-backend-88-production.env.bdaa.pro/v1/paperProcessing/upload",
          formData,
          config
        );
        this.dividedRes.imageDict = data.data.image_dict;
        this.dividedRes.paper = data.data.paper;
        this.backupRes.imageDict = data.data.image_dict;
        this.backupRes.paper = data.data.paper;
        this.isUploaded = true;
      } catch (e) {
        await this.$alert(
          "上传文件过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交文件或稍后再试。",
          "提示"
        );
      }
    },
    // 处理刚上传得到的数据，用于展示
    processData() {
      const processList = [];
      const paper = this.dividedRes.paper;
      const initQuestion = {
        questionID: QUESTION_INIT_ID,
        questionSideID: QUESTION_INIT_SIDE_ID,
        divide: true,
        active: true,
        type: null,
      };
      // 初始的切分
      processList.push(initQuestion);
      let question = null;

      for (let i = 0; i < paper.length; i++) {
        for (let j = 0; j < paper[i].sub_para.length; j++) {
          // 这是切分格式的结果，我也不知道为什么sub_para会是一个数组，但是这样读取就没问题
          let Para = paper[i].sub_para[j];
          // 把每个大段里面的每个小内容抽出来，单独塞到List里面
          for (let k = 0; k < Para.length; k++) {
            processList.push(Para[k]);
            if (i !== paper.length - 1) {
              question = {
                questionSideID: -1,
                questionID: -1,
                divide: true,
                active: false,
                type: null,
              };
              processList.push(question);
            }
          }
        }

        // 只要不是最后一个大段，那么就往里面塞一个“切分线”元素
        if (i !== paper.length - 1) {
          question.questionSideID = i + 1 + QUESTION_INIT_SIDE_ID;
          question.questionID = QUESTION_INIT_ID;
          question.active = true;
        }
      }

      this.processedRes.paper = processList;
    },
    // 重排题目编号顺序
    reorder({ index, isWhole}) {

      // 找到在 questionList 中的 实际 index。这是因为在 preview 中遍历的是 paper 数组，与 questionList 数组不同
      let selectItemIndex = index;
      // isWhole 表示是全部的 paper 数组
      if (isWhole) {
        const item = this.processedRes.paper[index];
        selectItemIndex = this.filterQuestionList.findIndex((ele) => {
          if (
            ele.questionID === item.questionID &&
            ele.questionSideID === item.questionSideID
          ) {
            return true;
          }
        });
      }

      let isIncrease = false;
      let isDecrease = false;
      for (let i = 0; i < this.filterQuestionList.length; i++) {
        const question = this.filterQuestionList[i];
        if (i <= 0) {
          question.questionSideID = QUESTION_INIT_SIDE_ID;
          question.questionID = QUESTION_INIT_ID;
        } else {
          const prevQuestion = this.filterQuestionList[i - 1];

          if (i === selectItemIndex) {
            if (prevQuestion.questionID === question.questionID) {
              question.questionID = prevQuestion.questionID + 1;
              question.questionSideID = QUESTION_INIT_SIDE_ID;
              isIncrease = true;
            } else {
              question.questionID = prevQuestion.questionID;
              question.questionSideID = prevQuestion.questionSideID + 1;
              isDecrease = true;
            }
          } else {
            if (isIncrease) {
              if (prevQuestion.questionID === question.questionID) {
                question.questionSideID = prevQuestion.questionSideID + 1;
              } else if (prevQuestion.questionID > question.questionID) {
                question.questionID = prevQuestion.questionID;
                question.questionSideID = prevQuestion.questionSideID + 1;
              } else {
                isIncrease = false  ;
              }
            } else if (isDecrease) {
              if (question.questionID - prevQuestion.questionID === 1) {
                question.questionSideID = QUESTION_INIT_SIDE_ID;
                isDecrease = false;
              } else if (question.questionID - prevQuestion.questionID === 2) {
                question.questionID = question.questionID - 1;
              }
            } else {
              if (question.questionID === -1) {
                question.questionID = prevQuestion.questionID;
                question.questionSideID = prevQuestion.questionSideID + 1;
              } else if (question.questionID === prevQuestion.questionID) {
                question.questionSideID = prevQuestion.questionSideID + 1;
              } else {
                question.questionID = prevQuestion.questionID + 1;
                question.questionSideID = QUESTION_INIT_SIDE_ID;
              }
            }
          }
        }
      }
    },
    // 绑定子元素事件
    bindEvts() {
      // 监听到文件改变，将标题变为与文件名匹配内容
      this.$root.$on(eventList.fileChange, (fileName) => {
        this.pdForm.fileName = fileName;
        if (fileName.indexOf(".") !== -1) {
          this.pdForm.title = fileName.substring(0, fileName.lastIndexOf("."));
        } else {
          this.pdForm.title = fileName;
        }
      });

      // 监听到重置事件，重置预览
      this.$root.$on(eventList.reset, this.reset);

      // 监听用户事件，下载 JSON
      this.$root.$on(eventList.downloadJSON, this.downloadJSON);

      // 监听到用户划线，更改题目编号
      this.$root.$on(eventList.reorder, this.reorder);

      // 监听用户提交，进行入库
      this.$root.$on(eventList.submit, this.submit);
    },
    // 重置数据
    async reset() {
      try {
        await this.$confirm(
          "您点击了重置当前试卷切分内容的按钮，当前的切分结果将被重置为当前试卷最开始的切分结果，确定要重置吗？",
          "提示",
          {
            confirmbuttontext: "确定",
            cancelbuttontext: "取消",
            type: "warning",
          }
        );

        this.dividedRes.imageDict = this.backupRes.imageDict;
        this.dividedRes.paper = this.backupRes.paper;
        this.processData();
        this.scrollToPaper();
      } catch {
        this.$message.info("已取消");
      }
    },
    // 入库
    downloadJSON() {
      const submitForm = this.getSubmitJSON();
      console.log(submitForm)
      const eleLink = document.createElement('a');
      eleLink.download = 'data.json';
      eleLink.style.display = 'none';
      const blob = new Blob([JSON.stringify(submitForm)]);
      eleLink.href = URL.createObjectURL(blob);
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    },
    getSubmitJSON() {

      const submitForm = {
        test: IS_TEST,
        title: this.pdForm.title,
        subject: this.pdForm.subject,
        period: this.pdForm.period,
        papertext: '', // 为列表，但是需要通过 JSON 转换为字符串
        papermanualdivide_list: '', // 为列表，但是需要通过 JSON 转换为字符串
      };

      function getTableImg(tableHtml, imgDict) {
        for(const key in imgDict){
          const Img_Name_Catcher = new RegExp('<img src="' + key + '"');
          if (Img_Name_Catcher.exec(tableHtml) !== null) {
            tableHtml = tableHtml.replace(Img_Name_Catcher,'<img src="' + imgDict[key] + '"');
          }
        }
        return tableHtml;
      }

      // 遍历 paper 数组，获取 papertext 列表
      const papertextList = [];
      const regC = new RegExp('&#xa0;', 'g')
      for (const paperEle of this.processedRes.paper) {
        if (!paperEle.divide) {
          let runText = '';
          if (paperEle.para_type === '0') {
            for (const run of paperEle.runs) {
              if (run.run_type === '0') {
                runText += run.run_text;
              } else if (run.run_type === '1') {
                runText += `<img src="${this.dividedRes.imageDict[run.image.src]}" width="${run.image.width}" height="${run.image.height}" style="${run.image.style}" alt="${run.image.alt}"/>`;
              }
            }
          } else if (paperEle.para_type === '1') {
            runText += getTableImg(paperEle.table_raw_html, this.dividedRes.imageDict);
          }
          // 去掉 &#xa0;
          runText = runText.replace(regC, "");
          papertextList.push(runText);
        }
      }
      submitForm.papertext = JSON.stringify(papertextList);

      // 再次遍历 paper 数组，获取 papermanualdivide_list 列表
      const papermanualdivide_list = [];
      let currentNum = 1;
      for (const paperEle of this.processedRes.paper) {
        if (paperEle.divide) {
          if (paperEle.active) {
            let content_type = 1;
            if (paperEle.questionSideID === QUESTION_INIT_SIDE_ID) {
              content_type = 0;
            }
            const lastItem = papermanualdivide_list[papermanualdivide_list.length - 1];
            if (lastItem) {
              lastItem.end_line = currentNum - 1;
            }
            const paperDivideElement = {
              question_num: paperEle.questionID,
              sub_question_num: paperEle.questionSideID,
              start_line: currentNum,
              end_line: -1,
              content_type,
              type: paperEle.type
            };
            papermanualdivide_list.push(paperDivideElement);
          }
        } else {
          currentNum += 1;
        }
      }
      if (papermanualdivide_list.length !== 0) {
        papermanualdivide_list[papermanualdivide_list.length - 1].end_line = currentNum;
      }
      submitForm.papermanualdivide_list = JSON.stringify(papermanualdivide_list);
      return submitForm;
    },
    async submit() {
      // 上传
      const submitForm = this.getSubmitJSON();
      try {
        const res = await commonAjax(this.backendIP + '/api/input_paper', submitForm);
        if (res.success) {
          this.$message.success("所切分的结果中，可识别的试题结果已全部导入录入结果当中。")
        } else {
          this.$message.error("解析出现异常，请重试。")
        }
      } catch (e) {
        console.log(e)
        await this.$alert(
            "上传切分结果过程出现错误，这可能是由于服务器原因导致目前暂时无法提供服务，请重新提交或稍后再试。",
            "提示",
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pd-container {
  position: relative;
  padding: 0 10vw;
  text-align: left;
  padding-top: 32px;
  min-height: 600px;

  &:before {
    content: "";
    position: absolute;
    width: 100vw;
    height: 100vw;
    top: -60vw;
    right: -56vw;
    border-radius: 50px;
    transform: rotate(10deg);
    background: #d9e9fe;
    z-index: -1;

    @media (max-width: 1200px) {
      width: 110vw;
      height: 110vw;
    }

    @media (max-width: 1000px) {
      width: 120vw;
      height: 120vw;
    }

    @media (max-width: 600px) {
      width: 130vw;
      height: 130vw;
    }
  }
}

.pd-title {
  font-size: 4rem;
  margin-bottom: 50px;
}

.pd-dialog {
  position: relative;
  display: flex;
  flex-direction: row;

  & div {
    flex: 1;
  }

  &__options {
    padding-right: 5%;
  }
}

.pd-divide-btn {
  margin-left: 80px;
  margin-top: 30px;

  ::v-deep span {
    font-size: 1.5rem;
  }
}

.pd-arrow-wrapper {
  width: 100%;
}

.pd-arrow {
  position: relative;
  margin: 0 auto;
  width: 100px;
  height: 100px;
  cursor: pointer;

  &:before,
  &:after {
    position: absolute;
    animation: pd-arrow-float 2s linear infinite;
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
    top: 30px;
  }

  &:before {
    top: 42px;
  }
}

.pd-body {
  position: relative;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;

  &__preview {
    flex: 7;
    padding-right: 15px;
  }

  &__sidebar {
    flex: 3;
    padding-left: 15px;
  }

  &__anchor {
    position: absolute;
    top: -100px;
  }
}

.pd-active {
  display: none;
  &.show {
    display: block;
  }
}

@keyframes pd-arrow-float {
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
</style>
