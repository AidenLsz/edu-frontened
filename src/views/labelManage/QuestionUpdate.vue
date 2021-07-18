<template>
  <div class="main-container">
    <el-row
      style="
        padding: 40px 10% 30px;
        text-shadow: 2px 6px 10px rgba(67, 92, 130, 0.14);
      "
      justify="start"
      type="flex"
    >
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>资源标注平台</el-breadcrumb-item>
          <el-breadcrumb-item>试题信息修改</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <transition name="el-fade-in">
      <p v-show="questions.length === 0" class="title">试题信息修改</p>
    </transition>

    <div class="search-bar">
      <el-input
        class="search-input"
        placeholder="输入题目文本或者ID"
        v-model="searchText"
        @keyup.enter.native="search"
      >
<!--        <el-tooltip class="item" effect="light" content="hhh" placement="top">-->
          <i v-if="testDB"
             @click="toggleTestDB"
             slot="suffix"
             class="el-input__icon el-icon-open search-btn"
          />
          <i v-else
             @click="toggleTestDB"
             slot="suffix"
             class="el-input__icon el-icon-turn-off search-btn"
          />
<!--        </el-tooltip>-->
        <i v-if="searching"
           class="el-input__icon el-icon-loading search-btn"
           slot="suffix"
        />
        <i v-else
           @click="search"
           slot="suffix"
           class="el-input__icon el-icon-search search-btn"
        />
      </el-input>
    </div>

<!--    <div style="padding: 0">-->
<!--      <el-switch-->
<!--          v-model="testDB"-->
<!--          active-text="测试库"-->
<!--      >-->
<!--        测试库-->
<!--      </el-switch>-->
<!--    </div>-->

    <div v-show="questions.length !== 0" class="sidebar">
      <el-button
        plain
        v-for="j in questions.length"
        v-bind:key="j"
        style="margin: 4px auto; padding: 10px; width: 100%; text-align: center"
      >
        {{ j }}
      </el-button>

      <el-button
        @click="toTop"
        plain
        style="margin: 4px auto; padding: 10px; width: 100%; height: 100%; text-align: center"
      >
        <i class="el-icon-top"></i>
      </el-button>
    </div>

    <transition-group name="el-fade-in">
      <div
        v-for="(item, id) in questions"
        v-bind:key="id"
        class="question-item"
      >
        <div style="font-size: 26px; margin-bottom: 16px; text-align: center">
          试题{{ id + 1 }}
        </div>
        <el-form ref="form" :model="item" label-width="44px">
          <el-form-item label="ID">
            <el-button
                @click="copyQuestionID($event,item.question_ID)"
               plain style="user-select: none; user-focus: none; width: 100%;text-align: start"
            >{{item.question_ID}}</el-button>
          </el-form-item>
          <el-form-item label="属性">
            <div
              style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                grid-row-gap: 14px;
                grid-column-gap: 10px;
              "
            >
              <el-select v-model="item.subject" placeholder="学科">
                <el-option
                  v-for="(item, id) in [
                    '其他',
                    '数学',
                    '英语',
                    '历史',
                    '政治',
                    '物理',
                    '化学',
                    '生物',
                    '语文',
                    '地理',
                  ]"
                  :label="'学科：' + item"
                  :key="id"
                  :value="id"
                ></el-option>
              </el-select>
              <el-select v-model="item.period" placeholder="学段">
                <el-option
                  v-for="(item, id) in [
                    '其他',
                    '初中',
                    '高中',
                    '大学',
                    '成人',
                    '小学',
                  ]"
                  :label="'学段：' + item"
                  :key="id"
                  :value="id"
                ></el-option>
              </el-select>
              <el-select v-model="item.system" placeholder="来源">
                <el-option
                  v-for="(item, id) in [
                    '其他',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '高考',
                    '讯飞',
                    '考试中心',
                    'LUNA',
                    '题库中国',
                  ]"
                  :v-if="item !== ''"
                  :label="'来源：' + item"
                  :key="id"
                  :value="id"
                ></el-option>
              </el-select>
              <el-select v-model="item.pastpaper" placeholder="真题">
                <el-option
                  v-for="(item, id) in [
                    '未处理',
                    '非真题',
                    '真卷',
                    '高考真卷',
                    '中考真卷',
                  ]"
                  :label="'真题：' + item"
                  :key="id"
                  :value="id"
                ></el-option>
              </el-select>
              <el-select v-model="item.type" placeholder="题型">
                <el-option
                  v-for="(item, id) in [
                    '其他',
                    '多选题',
                    '填空题',
                    '判断题',
                    '简答题',
                    '计算题',
                    '单选题',
                  ]"
                  :label="'题型：' + item"
                  :key="id"
                  :value="id"
                ></el-option>
              </el-select>
              <el-date-picker
                style="width: 100%"
                v-model="item.date"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="题干">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10 }"
              v-model="item.stem"
            ></el-input>
          </el-form-item>
          <el-form-item label="选项">
            <div style="display: flex; flex-direction: column; row-gap: 14px">
              <div v-for="(v, i) in item.options" v-bind:key="v">
                <el-input
                  v-model="item.options[i]"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                ></el-input>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="答案">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 10 }"
              v-model="item.answer"
            ></el-input>
          </el-form-item>
          <el-form-item label="解析">
            <el-input
              class="leastHeight"
              :autosize="{ minRows: 1, maxRows: 10 }"
              v-model="item.analysis"
            ></el-input>
          </el-form-item>
          <el-row type="flex" justify="end">
<!--            <el-button round plain>切换图片显示</el-button>-->
<!--            <el-button round plain>预览修改</el-button>-->
            <el-button round plain @click="update(id)" :loading="loading === true">提交修改</el-button>
          </el-row>
        </el-form>
      </div>
    </transition-group>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

//后端api正式上线后修改
const backendURL = "https://kg-edu-backend-44-review-question-r-tlide6.env.bdaa.pro/v1/api"
// const backendURL = 'http://0.0.0.0:5000/api' // <- 本地测试

export default {
  name: "QuestionUpdate",
  data() {
    return {
      searchText: "",
      questions: [],
      testDB: true,
      loading: false,
      searching: false,
      mockData: [
        {
          question_ID: "00004888-b1b6-11eb-92b2-3c9c0fb58abe",
          system: 14,
          type: 6,
          subject: 3,
          period: 2,
          pastpaper: 3,
          answer: "A",
          stem:
            "西汉文帝时，申公、韩婴皆以传《诗》被任命为博士；景帝时，胡母生、董仲舒以传《公羊春秋》被任命博士。由此可以推知汉初",
          options: [
            "经学地位上升成为入仕之途",
            "品行成为选官的主要标准",
            "黄老之学逐渐淡出历史舞台",
            "儒学逐步取得了独尊地位",
          ],
          analysis:
            "【详解】依据材料可知，汉初《诗》、《公羊春秋》等儒家经典被作为皇帝任命官职的依据，由此可见儒学地位上升成为入仕途径，因此A选项正确。B选项错误，材料并未体现品行作为选官的主要标准；C选项错误，材料并未涉及黄老之学；D选项错误，汉武帝时期，采取董仲舒的建议，罢黜百家，独尊儒术，设立太学，传授五经，使儒学获得了独尊地位。故正确答案为A选项。",
          date: "2021-05-29 13:07:49",
        },
        {
          question_ID: "0001244c-b212-11eb-b5d1-3c9c0fb58abe",
          system: 14,
          type: 6,
          subject: 3,
          period: 1,
          pastpaper: 0,
          source_type: 1,
          stem:
            "<p>一同学在开展研究性学习，他阅读了《战争与和平》《人间喜剧》《双城记》《红与黑》等一系列相关的作品。依据你的判断，他研究的课题可能与哪一文学流派有关（   ）</p>",
          options: ["批判现实主义", "古典主义", "现代主义", "浪漫主义"],
          answer: "A",
          date: "2021-05-29 13:07:49",
        },
      ],
    };
  },
  methods: {
    toggleTestDB(){
      this.testDB = this.testDB !== true;
    },
    search() {
      this.searching = true;
      let test = this.testDB;
      console.log("搜索按钮被点击: " + this.searchText);
      //005dcfa8-b211-11eb-90bf-3c9c0fb58abe

      //Json形式
      let formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          query: this.searchText,
          test: test,
        })
      );

      //Post传参形式
      // let formData = {
      //   query: this.searchText,
      //   test: test,
      // }

      this.$http
        .post(backendURL + "/query_question", formData, { emulateJSON: true })
        .then(function (res) {
          let data = res.data;
          this.questions = data.questions;
          for(let question of this.questions) {
            question['fromTestDB'] = test;
          }
          this.searching = false
        });

      //debug
      // this.questions = this.mockData;
    },
    update(id) {
      console.log("提交修改按钮被点击，列表的id:", id);
      this.loading = true
      let question;
      if (this.questions[id] !== undefined) {
        question = this.questions[id];
      } else {
        console.log("试题列表的id出错，列表长度:", this.questions.length);
        return;
      }

      console.log(question);

      //Json形式
      let formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          question_ID: question.question_ID,
          stem: question.stem,
          test: true,
        })
      );

      //Post传参形式
      // let formData = {
      //   question_ID: question.question_ID,
      //   stem: question.stem,
      //   test: question.fromTestDB
      // }

      this.$http
        .put(backendURL + "/update_question", formData, { emulateJSON: true })
        .then(function (res) {
          let data = res.data;
          if (data.error) {
            this.loading = false
            this.$notify.error({
              title: '修改提交失败',

            });
            console.log("提交修改出错");
            console.log(data.error);
          } else {
            this.$notify({
              title: '修改提交成功',
              type: 'success'
            });
            console.log("提交成功");
            setTimeout(() => {
              this.loading = false
            }, 300)
          }
        });
    },
    copyQuestionID(e, text) {
      const clipboard = new Clipboard(e.target, { text: () => text })
      clipboard.on('success', () => {
        this.$message({
          message: '复制qustion_ID成功',
          type: 'success'
        });
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        // 不支持复制
        this.$message({ type: 'warning', message: '该浏览器不支持自动复制' })
        // 释放内存
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.onClick(e)
    },
    add() {
    },
    toTop() {
      console.log('回到顶部')

      // const that = this
      // let timer = setInterval(() => {
      //   let ispeed = Math.floor(-that.scrollTop / 5)
      //   document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
      //   if (that.scrollTop === 0) {
      //     clearInterval(timer)
      //   }
      // }, 16)
      // document.documentElement.scrollTop = 0
      // document.documentElement.scrollTop = document.body.scrollTop = 0;
      document.documentElement.scrollIntoView(true)
      window.scroll(0, 0);
    },
  },
};
</script>

<style scoped>
/*html, head, body {*/
/*  margin: 0;*/
/*  padding: 0;*/
/*  width: 100%;*/
/*  height: 100%;*/
/*}*/

.main-container {
  /*width: 100%;*/
  /*height: 100%;*/
  margin: 0 0 0 !important;
  /*background-color: #fefefe;*/
}

/*.nav {*/
/*  height: 58px;*/
/*  background-color: rgba(255, 255, 255, .75);*/
/*  margin: 0 auto;*/
/*  width: 100%;*/
/*  border-bottom: 1px solid rgba(196, 196, 196, 0.32);*/
/*  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);*/
/*  !*backdrop-filter: blur(10px);*!*/
/*  !*-webkit-backdrop-filter: brightness(20%);*!*/
/*  -webkit-backdrop-filter: saturate(200%) blur(14px);*/
/*  backdrop-filter: saturate(200%) blur(14px);*/
/*  position: fixed;*/
/*  top: 0;*/
/*  z-index: 100;*/
/*  !*flex: auto;*!*/
/*  !*alignment: center;*!*/
/*}*/

/*.logo {*/
/*  margin-left: 6%;*/
/*  margin-top: 12px;*/
/*  height: 34px;*/
/*  alignment: center;*/
/*}*/

.title {
  text-align: center;
  font-size: 36px;
  margin-top: 120px;
  transition: all;
  transition-duration: 300ms;
}

.search-bar {
  width: 50%;
  margin: 30px auto 30px;
  filter: drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.08));
  /*display: inline*/
}

.sidebar {
  position: fixed;
  float: right;
  right: 5%;
  top: 40%;
  /*height: 400px;*/
  width: 54px;
  padding: 8px;
  border: 1px solid rgba(196, 196, 196, 0.4);
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.search-btn {
  margin-right: 4px;
}

/deep/ .search-input .el-input__inner {
  border-radius: 12px;
  border-color: #d0d0d0;
}

.question-item {
  background-color: #fefefe;
  border: 1px solid rgba(196, 196, 196, 0.4);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  width: 68%;
  height: available;
  margin: 20px auto 32px;
  padding: 20px 34px 24px;
  transition: all 500ms;
}

.question-item .el-input__inner {
  /*width: 80%;*/
  /*margin: auto auto auto;*/
  /*box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);*/
  border-radius: 6px !important;
  /*border-color: #d0d0d0;*/
}

.leastHeight {
  height: 54px;
}

.radio-group-type {
  /*display: flex;*/
  /*width: 200%;*/
}

.radio-group-type .el-radio-button__inner {
}

.el-radio-button {
  /*width: 14%*/
}

.el-textarea__inner {
  border-radius: 6px !important;
  padding: 10px 14px 8px !important;
}

.el-date-editor {
  border-radius: 6px !important;
}
</style>
