<template>
  <div class="ql-container">
    <el-row
        style="
        margin-left: 10vw;
        text-shadow: 2px 6px 10px rgba(67, 92, 130, 0.14);
      "
        justify="start"
        type="flex"
    >
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>标注管理平台</el-breadcrumb-item>
          <el-breadcrumb-item>试题信息修改</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <div class="search-body">
      <transition  name="el-fade-in">
        <p :class="{'title-center': true, 'center': show_tag}" id="title">试题信息修改</p>
      </transition>

      <div :class="{'search-bar': true, 'center': show_tag}">
        <el-input
            class="search-input"
            id="search-input"
            placeholder="输入题目文本或者ID"
            v-model="searchText"
            @keyup.enter.native="search">
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
      <div :class="{'select': true, 'center': show_tag}">
        <div class="select_way">
          搜索方式：
        </div>
        <div>
          <el-radio-group v-model="searchtype" min="0" max="3">
            <!--          <el-checkbox-button v-for="type in select_type" :label="type" :key="type">{{type}}</el-checkbox-button>-->
            <el-radio-button label="单题搜索" ></el-radio-button>
            <el-radio-button label="题组搜索"></el-radio-button>
            <el-radio-button label="试卷搜索"></el-radio-button>

          </el-radio-group>
        </div>
        <div class="select_DB">
          搜索库：
        </div>
        <div>
          <el-radio-group v-model="testDB" min="1" max="1">
            <!--          <el-checkbox-button v-for="DB in dbs" :label="DB" :key="DB">{{DB}}</el-checkbox-button>-->
            <el-radio-button label="测试库"></el-radio-button>
            <el-radio-button label="正式库"></el-radio-button>

          </el-radio-group>
        </div>
      </div>
      <!--    <div style="padding: 0">-->
      <!--      <el-switch-->
      <!--          v-model="testDB"-->
      <!--          active-text="测试库"-->
      <!--      >-->
      <!--        测试库-->
      <!--      </el-switch>-->
      <!--    </div>-->

      <!--    <div v-show="questions.length !== 0" class="sidebar">-->
      <!--      <el-button-->
      <!--        plain-->
      <!--        v-for="j in questions.length"-->
      <!--        v-bind:key="j"-->
      <!--        style="margin: 4px auto; padding: 10px; width: 100%; text-align: center"-->
      <!--      >-->
      <!--        {{ j }}-->
      <!--      </el-button>-->

      <!--      <el-button-->
      <!--        @click="toTop"-->
      <!--        plain-->
      <!--        style="margin: 4px auto; padding: 10px; width: 100%; height: 100%; text-align: center"-->
      <!--      >-->
      <!--        <i class="el-icon-top"></i>-->
      <!--      </el-button>-->
      <!--    </div>-->

      <transition-group name="el-fade-in">
        <div
            v-for="(item, index) in questions"
            v-bind:key="item.question_ID"
            class="question-item"
        >
          <div style="font-size: 26px; margin-bottom: 12px; text-align: center">
            试题{{ index + 1 }}
          </div>

          <div v-if="item.edit !== true">
            <Mathdown :content="parseImg(item.stem)" :name="'Q_' + index + '_Stem'"></Mathdown>
            <el-row v-for="(v, i) in item.options" v-bind:key="v" type="flex" justify="start"
                    style="margin-top:10px"
            >
              <span>{{ Get_Option_Label(i) }}：</span>
              <Mathdown :name="'Q_' + index + '_Options'" :content="parseImg(item.options[i])"></Mathdown>
            </el-row>
            <hr/>
            <el-row type="flex" justify="start" style="margin-bottom: 6px">
              <span style="white-space: nowrap;">答案：</span><Mathdown :name="'Q_' + index + '_Answer'"  :content="parseImg(item.answer)"></Mathdown>
            </el-row>
            <el-row type="flex" justify="start">
              <span style="white-space: nowrap;">解析：</span><Mathdown :name="'Q_' + index + '_Analysis'" :content="parseImg(item.analysis)"></Mathdown>
            </el-row>
            <hr/>
            <div class="question-prop">
              <span style="">学科：{{['其他', '数学', '英语', '历史', '政治', '物理', '化学', '生物', '语文', '地理'][item.subject]}}</span>
              <span style="">学段：{{['其他', '初中', '高中', '大学', '成人', '小学'][item.period]}}</span>
              <span style="">题型：{{['其他', '多选题', '填空题', '判断题', '简答题', '计算题', '单选题'][item.type]}}</span>
              <span style="">来源：{{['其他', '', '', '', '', '', '', '', '', '', '高考', '讯飞', '考试中心', 'LUNA', '题库中国'][item.system]}}</span>
              <span style="">真题：{{['未处理', '非真题', '真卷', '高考真卷', '中考真卷'][item.pastpaper]}}</span>
              <!--            display: grid;justify-items: end;align-items: center;grid-template-columns: 1fr;-->
              <div class="edit-div">
                <el-button class="edit-btn" round plain @click="onEdit(index)" :loading="loading === true">编辑</el-button>
              </div>
            </div>
            <!--          <el-row type="flex" justify="space-between" align="middle">-->
            <!--            <el-row type="flex" justify="start" align="middle">-->
            <!--            </el-row>-->
            <!--              <el-button round plain @click="item.unfold = true">查看解析</el-button>-->
            <!--          </el-row>-->
          </div>
          <el-form v-else ref="form" :model="item" label-width="44px">
            <el-form-item label="ID">
              <el-button
                  @click="copyQuestionID($event,item.question_ID)"
                  plain style="user-select: none; user-focus: none; width: 100%;text-align: start;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
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
                <div v-for="(opt, j) in item.options" v-bind:key="opt">
                  <el-input
                      v-model="item.options[j]"
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 10 }"
                  ></el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="答案">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  v-model="item.answer"
              ></el-input>
            </el-form-item>
            <el-form-item label="解析">
              <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 10 }"
                  v-model="item.analysis"
              ></el-input>
            </el-form-item>
            <el-row type="flex" justify="end">
              <!--            <el-button round plain>切换图片显示</el-button>-->
              <el-button round plain @click="update(index)" :loading="loading === true">提交修改</el-button>
              <el-button round plain @click="onPreview(index)">预览</el-button>
            </el-row>
          </el-form>
        </div>
      </transition-group>

      <div style="margin-bottom: 56px"/>
    </div>
  </div>
</template>

<script>
import Mathdown from "@/common/components/Mathdown.vue";
import Clipboard from 'clipboard'

//后端api正式上线后修改
const backendURL = "https://kg-edu-backend-44-production.env.bdaa.pro/v1"
// const backendURL = 'http://localhost:23331' // <- 本地测试

export default {
  components: { Mathdown },
  name: "QuestionUpdate",
  data() {
    const dbs = ['测试库','正式库'];
    const select_type = ['单题搜索','题组搜索','试卷搜索'];
    return {
      searchText: "",
      questions: [],
      edit: [],
      dbs,
      figures: [],
      select_type,
      unfold: [],
      testDB: dbs[0],
      searchtype: select_type[0],
      show_tag:true,
      loading: false,
      searching: false,
      mockData: [
        {
          question_ID: "005dcfa8-b211-11eb-90bf-3c9c0fb58abe",
          edit: true,
        },
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
          edit: false,
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
          edit: true,
        },
      ],
    };
  },
  mounted() {
    //测试用
    // this.questions = this.mockData;
  },
  methods: {

    returnToSearch() {
      this.show_tag = true;
    },

    parseImg(str) {
        return str.replace(/\$\\FigureID{([0-9a-z-]*)?}\$/g, ($1, $2) => `<img src="${this.figures.find(ele => ele.figure_ID === $2).img}">`);
    },

    async search() {
      //debug
      // this.questions = this.mockData;
      // return;

      let test = false;
      let search_type = 1;

      // const idReg = new RegExp("[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}")
      if(this.searchtype==='单题搜索')
        search_type = 1;
      else if(this.searchtype==='题组搜索')
        search_type = 2;
      else
        search_type = 3;

      if (this.testDB==='测试库') test = true;
      this.searching = true;
      console.log("搜索按钮被点击: " + this.searchText);
      //005dcfa8-b211-11eb-90bf-3c9c0fb58abe

      //Json形式
      // let formData = new FormData();
      // formData.append(
      //   "data",
      //   JSON.stringify({
      //     query: this.searchText,
      //     test: test,
      //   })
      // );

      //Post传参形式
      const formData = {
        'query': this.searchText,
        test,
        search_type,
      }

      const handleRequestError = () => {
        this.searching = false
        this.$notify.error({
          title: '检索失败',
        });
        // console.log(e)
      };

      try {
        const res = await this.$http.post(backendURL + "/api/search_question", formData, { emulateJSON: true })
        let data = res.data;
        console.log('获得结果')

        //判断错误
        if(data.error !== "" || data.questions.length === 0) {
          handleRequestError(data.error);
          return;
        }

        this.show_tag=false;
        let edit = this.questions.length === 1;
        console.log(edit)


        // this.questions = data.questions;
        this.figures = data.figures;
        this.questions = data.questions;


        // for(let question of this.questions) {
        //   question.fromTestDB = test;
        //   question.edit = edit
        // }
        for(let i = 0; i < this.questions.length; i++){
          this.questions[i].edit = edit
          this.questions[i].fromTestDB = test;
        }
        this.searching = false

      } catch(e) {
        handleRequestError(e);
      }
    },
    onPreview(id) {
      console.log(this.questions[id].edit)
      console.log(this.questions)
      this.questions[id].edit = false;
      this.$forceUpdate()
    },
    onEdit(id) {
      console.log(this.questions[id].edit)
      console.log(this.questions)
      this.questions[id].edit = true;
      this.$forceUpdate()
      // Vue.set(this.questions,id,{
      //   edit: false
      // })
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
      // let formData = new FormData();
      // formData.append(
      //   "data",
      //   JSON.stringify({
      //     question_ID: question.question_ID,
      //     stem: question.stem,
      //     test: true,
      //   })
      // );

      //Post传参形式
      let formData = {
        question_ID: question.question_ID,
        stem: question.stem,
        test: question.fromTestDB,
        system: question.system,
        type: question.type,
        subject: question.subject,
        period: question.period,
        pastpaper: question.pastpaper,
        source_type: question.source_type,
        options: question.options,
        answer: question.answer,
        analysis: question.analysis,
        date: question.date,
      }

      this.$http
          .put(backendURL + "/api/update_question", formData, { emulateJSON: true })
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
          })
          .catch((e)=>{
            this.loading = false
            this.$notify.error({
              title: '修改提交失败',

            });
            console.log("提交修改出错");
            console.log(e);
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
      // document.documentElement.scrollIntoView(true)
      // window.scroll(0, 0);
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
  },
};
</script>

<style scoped>

body .el-scrollbar__wrap {
  overflow-x: hidden;
}

.ql-container {
  position: relative;
  width: 100%;
  min-height: 100vh;

  background: #FDFDFD;
}

.search-body {
  width: 80%;
  margin: 0 auto;
}

.title-center {

  margin-bottom: 30px;
  margin-top: 5vh;
  transition: .3s;
  font-family: Sarasa Gothic SC;
  font-style: normal;
  font-weight: normal;
  font-size: 38px;
  line-height: 46px;
  /* identical to box height */

  letter-spacing: 0.05em;

  color: rgba(5, 5, 5, 0.9);
  /* identical to box height */

  letter-spacing: 0.05em;

  color: rgba(5, 5, 5, 0.9);
}

.title-center.center {
  margin-top: 20vh;
}

.search-bar {

  margin: 0 auto;
  background: #FFFFFF;
  box-sizing: border-box;
  border-radius: 10px;
}

.select_way {

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 40px;
  /* identical to box height, or 187% */

  display: flex;
  align-items: center;
  text-align: center;

  color: rgba(0, 0, 0, 0.85);


  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 12px;
}
.select_DB {

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 40px;
  /* identical to box height, or 187% */

  display: flex;
  align-items: center;
  text-align: center;

  color: rgba(0, 0, 0, 0.85);


  /* Inside Auto Layout */

  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 0px 5px 0px 20px;
}

.select {
  /* Frame 28 */


  /* Auto Layout */

  display: flex;
  margin-top: 35px;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;

}

@media (max-width: 856px) {
    .select {
      flex-direction: column;
      align-items: center;
    }
}

.search-btn {
  margin-right: 4px;
}

.search-btn:hover {
  color: #36a9df;
  transform: scale(1.25);
}

::v-deep .search-bar .search-input .el-input__inner {
  border-radius: 12px;
  border-color: #d0d0d0;
  transition: all;
  transition-duration: 300ms;


}

::v-deep .search-bar .search-input .el-input__inner:hover {
  border-radius: 14px;
  border-color: rgba(64,158,255, .7);
  border-radius: 12px;
  border-color: #d0d0d0;
  transition: all;
  transition-duration: 300ms;
}

.question-item {
  background-color: #fefefe;
  border: 1px solid rgba(196, 196, 196, 0.4);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  /*width: 68%;*/
  height: available;
  margin: 46px auto 32px;
  padding: 20px 34px 24px;
  transition: all 500ms;
}

.question-item:hover {
  border: 1px solid rgba(196, 196, 196, .8);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}

.question-item .el-input__inner {
  /*width: 80%;*/
  /*margin: auto auto auto;*/
  /*box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);*/
  border-radius: 6px !important;
  /*border-color: #d0d0d0;*/
}

.radio-group-type .el-radio-button__inner {
}

/*@media (min-width: 1280px) {*/

/*}*/

.question-prop {
  justify-items: start;
  align-items: center;
  display: grid;
}

.edit-div {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  /*background-color: #D0EEFF;*/
}

@media (min-width: 1024px) {
  .question-item {
    width: 880px;
  }

  .search-bar {
    width: 560px;
  }


  .question-prop {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(1, 1fr)
  }
}

@media (max-width: 1024px) {
  .question-item {
    width: 90%;
  }

  .search-bar {
    width: 80%;
  }

  .question-prop {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr)
  }

  .edit-div {
    grid-column-end: 5;
  }
}

@media (max-width: 768px) {
  .question-item {
    width: 94%;
  }

  .search-bar {
    width: 70%;
  }

  .question-prop {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr)
  }

  .edit-div {
    grid-column-end: 4;
  }

  .title {
    font-size: 28px;
  }
}
</style>
