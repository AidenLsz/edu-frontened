<template>
  <div
    class="MultiPaperAnalyse"
    style="
      min-height: 100vh;
      padding-left: 10%;
      padding-right: 10%;
      padding-top: 10px;
    "
    v-loading="Download_loading"
    :element-loading-text="'正在处理下载报告，请稍等...'"
    element-loading-spinner="el-icon-loading"
  >
    <LunaProgress
      v-if="Question_Analysing"
      :Loading_Text="'正在分析，请稍后，当前进度（' + progress + '/' + chosen_paper_List.length + '）...'"
      :Bar_Type="'page'"
      :Duration_Time="3"
      :Full_Count.sync="chosen_paper_List.length"
      :Now_Count.sync="progress"
      @Finish_Loading="Finish_Loading()"
    >

    </LunaProgress>
    <div id="Top_Nav" class="Top_Nav"></div>
    <!-- <div class="panel"> -->
    <el-row justify="start" type="flex">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            >{{
              $store.getters.systemType == 2 ? "智能" : ""
            }}分析</el-breadcrumb-item
          >
          <el-breadcrumb-item>多卷分析</el-breadcrumb-item>
          <el-breadcrumb-item v-if="chosen_paper_List.length > 0"
            >分析报告</el-breadcrumb-item
          >
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!-- <el-row class="description" justify="center">
      <div  >
      所选各试卷卷内各小题难度变化情况如下图所示。总的来看，卷内题目的难度由前至后总体呈递增趋势，中间穿插几道较难的题目，以体现试题的区分度和层次性。在所选的这张试卷中，这张试卷的平均难度最高，其难度为，这张试卷中的第小题是难度最高的一个小题，其难度为。
      </div>
    </el-row> -->

    <!-- <el-row
      v-if="chosen_paper_List.length == 0"
      type="flex"
      justify="start"
      style="margin-top: 30px"
    >
      <el-col :span="2.5">
        <span>分析属性勾选：</span>
      </el-col>
      <el-col :span="10">
        <el-checkbox-group v-model="checkList" id="checkbox">
          <el-checkbox label="数字属性"></el-checkbox>
          <el-checkbox label="关键词"></el-checkbox>
          <el-checkbox label="知识点分值"></el-checkbox>
          <el-checkbox label="难度变化"></el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row> -->

    <el-row
      v-if="chosen_paper_List.length == 0"
      type="flex"
      justify="start"
      style="margin-top: 30px"
    >
      <el-button type="primary" @click="Open_Paper_Base()"
        >从试卷库中选择</el-button
      >
      <el-button disabled type="primary" @click="Update()">本地上传</el-button>
    </el-row>

    <el-dialog
      :visible.sync="show_paper_base"
      title="试卷选择"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
    >
      <SearchPaper @Close_Paper_Base="CPB"></SearchPaper>
    </el-dialog>

    <div v-show="analyse_finished">
      <el-row justify="center" style="margin-bottom: 40px">
        <h1>多卷分析报告</h1>
      </el-row>
      <el-row justify="start">
        <p><b>所选试卷</b></p>
        <p
          v-for="i in chosen_paper_List.length"
          :key="'paper' + i"
          style="line-height: 20px"
        >
          {{ i.toString() + "." }}&nbsp;&nbsp;&nbsp;&nbsp;{{
            chosen_paper_List[i - 1].title
          }}
        </p>
      </el-row>
      <el-divider></el-divider>

      <!-- 展开栏 -->
      <el-row
        type="flex"
        justify="start"
        v-on:click.native="show_word_cnt_Bar = !show_word_cnt_Bar"
        class="Part_Row_Style"
      >
        <el-col :span="14" style="text-align: left; line-height: 30px">
          <el-row type="flex" justify="start">
            <i
              class="el-icon-arrow-up"
              v-if="show_word_cnt_Bar"
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            <i
              class="el-icon-arrow-down"
              v-else
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            数字属性比较
          </el-row>
        </el-col>
      </el-row>
      <!-- 文字描述 -->
      <el-row class="description" v-show="show_word_cnt_Bar" justify="center">
        所选各试卷的字数、图片数和公式数的统计结果如下图所示。可以看到虽然相较于其他学科，数学试卷中的文字信息相对较少，各卷平均字数仅为
        {{ word_cnt_aver }}
        ，但是数学可以通过公式与图片来进行补充。总的来看，试卷中的图片数量基本稳定在每卷
        {{ figure_cnt_aver }} 张图，有少量上下浮动，而每卷平均有
        {{ equation_cnt_aver }}
        个以上的公式。不同模式的信息载体能更为全面地考查学生获取和整合信息的能力，要求学生联系并充分利用公式、图像与文本之间的关系。
      </el-row>
      <!-- 图表 -->
      <el-row v-show="show_word_cnt_Bar" type="flex" justify="center">
        <div id="word_cnt_Bar" class="word_cnt_Bar"></div>
      </el-row>

      <!-- <el-divider v-if="show_Word_Cloud"></el-divider> -->
      <!-- 展开栏 -->
      <el-row
        type="flex"
        justify="start"
        v-on:click.native="show_Word_Cloud = !show_Word_Cloud"
        class="Part_Row_Style"
      >
        <el-col :span="14" style="text-align: left; line-height: 30px">
          <el-row type="flex" justify="start">
            <i
              class="el-icon-arrow-up"
              v-if="show_Word_Cloud"
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            <i
              class="el-icon-arrow-down"
              v-else
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            关键词比较
          </el-row>
        </el-col>
      </el-row>
      <!-- 文字描述 -->
      <el-row class="description" v-show="show_Word_Cloud" justify="center">
        对所选各试卷使用关键词抽取技术提取所含关键字，所得结果如下图所示。可以看到，各试卷中出现频率较高的关键词往往各不相同，例如
        {{ title0 }} 中的 "{{ keyword_cache[0] }}" 和 "{{ keyword_cache[1] }}"
        ， {{ title1 }} 中的 "{{ keyword_cache[2] }}" 和 "{{
          keyword_cache[3]
        }}" 。总的来看，这 {{ paper_num }} 张试卷中出现总频率最高的 TOP10
        关键词为
        <span v-for="i in 10" :key="'keyword' + i">
          "{{ keyword_total[i - 1] }}"
        </span>
        。
      </el-row>
      <!-- 标题 -->
      <el-row
        v-show="show_Word_Cloud"
        type="flex"
        justify="center"
        style="margin-top: 40px"
      >
        <p
          style="
            font-size: 16px;
            font-family: Microsoft YaHei, sans-serif;
            font-weight: 900;
          "
        >
          关键词比较
        </p>
      </el-row>
    </div>
    <!-- 图表 -->
    <!-- 一个非常垃圾的解决方案：由于js2wordcloud要求在渲染画布之前画布必须显式的具有size，而不能是由hidden转为show，因此需要把词云
        主体部分从analyse_finished中拨出来，勉强可以做到展开和收缩的效果 -->
    <el-row v-show="show_Word_Cloud" justify="center">
      <div
        v-for="i in chosen_paper_List.length"
        :key="'Word_Cloud_' + i"
        style="display: inline-block; margin: 10px 30px 20px 30px"
      >
        <div :id="'container' + i" style="height: 400px; width: 400px"></div>
        <p v-show="show_Word_Cloud">{{ chosen_paper_List[i - 1].title }}</p>
      </div>
    </el-row>
    <div v-show="analyse_finished">
      <!-- <el-row
      v-show="show_Radar && checkList.indexOf('知识点') > -1"
      type="flex"
      justify="center"
    >
      <div id="Radar" class="word_cnt_Bar"></div>
    </el-row> -->
      <!-- for test -->
      <!-- <el-divider v-if="show_knowledge2score"></el-divider> -->

      <!-- 展开栏 -->
      <el-row
        type="flex"
        justify="start"
        v-on:click.native="show_knowledge2score = !show_knowledge2score"
        class="Part_Row_Style"
      >
        <el-col :span="14" style="text-align: left; line-height: 30px">
          <el-row type="flex" justify="start">
            <i
              class="el-icon-arrow-up"
              v-if="show_knowledge2score"
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            <i
              class="el-icon-arrow-down"
              v-else
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            知识点分值比较
          </el-row>
        </el-col>
      </el-row>
      <!-- 文字描述 -->
      <el-row
        class="description"
        v-show="show_knowledge2score"
        justify="center"
      >
        所选各试卷在各一级知识点上考察分值的情况如下图所示。在所选的
        {{ knowledge_num }} 个一级知识点中， "{{
          most_welcomed_knowledgepoint
        }}" 是这 {{ paper_num }} 张试卷最爱考察的知识点，平均每张试卷有
        {{ highest_aver_score }} 分在考察这一知识点，其次为 "{{
          second_welcomed_knowledgepoint[0]
        }}" "{{ second_welcomed_knowledgepoint[1] }}" "{{
          second_welcomed_knowledgepoint[2]
        }}" 。 {{ paper_lowest_score }} 这张试卷对于 "{{
          lowest_score_knowledgepoint
        }}" 这一知识点的考察最少，仅为 {{ lowest_score }} 分。
      </el-row>
      <!-- 图表 -->
      <el-row v-show="show_knowledge2score" type="flex" justify="center">
        <div id="Radar" class="word_cnt_Bar"></div>
      </el-row>

      <!-- 展开栏 -->
      <el-row
        type="flex"
        justify="start"
        v-on:click.native="show_difficulty_change = !show_difficulty_change"
        class="Part_Row_Style"
      >
        <el-col :span="14" style="text-align: left; line-height: 30px">
          <el-row type="flex" justify="start">
            <i
              class="el-icon-arrow-up"
              v-if="show_difficulty_change"
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            <i
              class="el-icon-arrow-down"
              v-else
              style="font-size: 24px; line-height: 30px; margin-right: 20px"
            ></i>
            难度变化比较
          </el-row>
        </el-col>
      </el-row>
      <!-- <el-divider v-if="show_difficulty_change"></el-divider> -->
      <!-- 文字描述 -->
      <el-row
        class="description"
        v-show="show_difficulty_change"
        justify="start"
      >
        所选各试卷卷内各小题难度变化情况如下图所示。总的来看，卷内题目的难度由前至后总体呈递增趋势，中间穿插几道较难的题目，以体现试题的区分度和层次性。在所选的这
        {{ paper_num }} 张试卷中，
        {{ most_difficult_paper }} 这张试卷的平均难度最高，其难度为
        {{ highest_difficulty }} ， {{ hardest_question_paper }} 这张试卷中的第
        {{ hardest_question_num }} 小题是难度最高的一个小题，其难度为
        {{ hardest_question_difficulty }} 。
      </el-row>
      <!-- 图表 -->
      <el-row v-show="show_difficulty_change" type="flex" justify="center">
        <div
          id="diffi_change"
          class="diffi_change"
          :style="'height:' + (160 * chosen_paper_List.length + 150) + 'px'"
        ></div>
      </el-row>

      <!-- 下载按钮 -->
      <el-row type="flex" justify="center" style="margin-bottom: 40px">
        <el-button type="success" plain @click="Report_Download()">
          下载分析报告</el-button
        >
      </el-row>
      <div v-if="CloseButton" class="tab" @click="Close_All()">
        <div class="text">收起全部</div>
        <i class="el-icon-caret-top icon"></i>
      </div>
      <div v-else class="tab" @click="Show_All()">
        <div class="text">展开全部</div>
        <i class="el-icon-caret-bottom icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import SearchPaper from "./components/SearchPaper";
import Js2WordCloud from "js2wordcloud";
import * as echarts from "echarts";
// import "echarts-wordcloud";
import { commonAjax } from "@/common/utils/ajax";
import $ from "jquery";
import LunaProgress from '../../common/components/LunaProgress.vue';

export default {
  components: { SearchPaper, LunaProgress},
  name: "MultiPaperAnalyse",
  data() {
    return {
      // 是否打开试卷库
      show_paper_base: false,
      // 是否显示试卷字数柱状图
      show_word_cnt_Bar: true,
      // 是否显示关键词词云
      show_Word_Cloud: true,
      // 是否显示知识点分值雷达图
      show_knowledge2score: true,
      // 是否显示难度变化
      show_difficulty_change: true,
      // 比较属性
      // checkList: ["数字属性", "关键词", "知识点分值", "难度变化"],
      // 选中的试卷的ID
      chosen_paper_List: [
        // {
        //   试卷ID
        //   ID:
        //   试卷所属试题库
        //   database:
        //   试卷标题
        //   title:
        // }
      ],
      // 是否正在加载分析报告
      Question_Analysing: false,
      // 每张试卷返回的结果
      analyse_result: [
        // {
        //   "id": "43482c08-8c71-4166-8490-2d991ba5be0a",
        //   "type": "PackedQues",
        //   "score": 4,
        //   "difficulty_statistics": {
        //     "mean": 0.4028695672750473,
        //     "min": 0.29554620385169983,
        //     "max": 0.5101929306983948,
        //     "std": 0.10732336342334747
        //   },
        //   "knowledge_knowledge2num": {
        //     "解析几何::代数": 1
        //   },
        //   "knowledge2difficulty": {
        //     "解析几何": 0.4028695672750473,
        //     "代数": 0.5101929306983948
        //   },
        //   "knowledge2score": {
        //     "解析几何": 4,
        //     "代数": 2
        //   },
        //   "sub_question": [{},{}]
        // }
      ],
      // 试卷分析返回值状态监听器
      status_Listener: "",
      // 关键词黑名单
      keyword_blacklist: ["已知"],
      // 试卷分析进度
      progress: 0,
      // 字数平均值
      word_cnt_aver: 0,
      // 图片数平均值
      figure_cnt_aver: 0,
      // 公式数平均值
      equation_cnt_aver: 0,
      // keyword_cache[0..1]存储两个在试卷1中出现了但没在其他试卷中出现的关键词
      // keyword_cache[2..3]存储两个在试卷2中出现了但没在其他试卷中出现的关键词
      keyword_cache: [],
      // 第一张试卷的标题
      title0: "",
      // 第二张试卷的标题
      title1: "",
      // 试卷数
      paper_num: 0,
      // 关键词总体top10
      keyword_total: [],
      // 平均考察分值最高的知识点名
      most_welcomed_knowledgepoint: "",
      // 最高的平均考察分值
      highest_aver_score: 0,
      // 平均考察分支第二高～第四高的知识点名
      second_welcomed_knowledgepoint: [],
      // 知识点分值最低的纸卷名
      paper_lowest_score: "",
      // 分值最低的知识点名
      lowest_score_knowledgepoint: "",
      // 知识点总数
      knowledge_num: 0,
      // 最低分值
      lowest_score: 10000,
      // 平均难度最大的试卷标题
      most_difficult_paper: "",
      // 最大平均难度值
      highest_difficulty: 0,
      // 难度最高的小题所在试卷的标题
      hardest_question_paper: "",
      // 难度最高的小题的题号
      hardest_question_num: 0,
      // 最大难度值
      hardest_question_difficulty: 0,
      // 是否正在加载报告下载
      Download_loading: false,
      // 试卷分析是否完成
      analyse_finished: false,
    };
  },
  computed: {
    CloseButton() {
      return (
        this.show_word_cnt_Bar &&
        this.show_Word_Cloud &&
        this.show_knowledge2score &&
        this.show_difficulty_change
      );
    },
  },
  mounted() {
    this.ToTop();
    // this.Init_test();
    // this.Init_Radar();
  },
  methods: {
    ToTop() {
      document.getElementById("Top_Nav").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    // 打开试卷库
    Open_Paper_Base() {
      this.show_paper_base = true;
    },
    // 本地上传
    Update() {},
    // UPL(val) {
    //   this.chosen_paper_List = val;
    //   console.log(this.chosen_paper_List);
    // },
    CPB(val) {
      // console.log("Close paper base");
      this.chosen_paper_List = val;
      // console.log(this.chosen_paper_List);
      this.show_paper_base = false;
      // if (this.show_word_cnt_Bar)
      //   echarts.init(document.getElementById("word_cnt_Bar")).dispose();
      // this.show_word_cnt_Bar = false;

      // // if (this.show_Word_Cloud)
      // this.show_Word_Cloud = false;

      // if (this.show_knowledge2score)
      //   echarts.init(document.getElementById("Radar")).dispose();
      // this.show_knowledge2score = false;

      // if (this.show_difficulty_change)
      //   echarts.init(document.getElementById("diffi_change")).dispose();
      // this.show_difficulty_change = false;
      this.Question_Analysing = true;
      this.Analyse();
    },
    // 分析试卷
    Analyse() {
      console.log(this.checkList)
      this.progress = 0;
      // console.log("length", this.chosen_paper_List.length);
      this.analyse_result.length = this.chosen_paper_List.length;
      // for (let i = 0; i < this.chosen_paper_List.length; i++)
      //   status.push(false);
      // console.log("status", status);
      // return;
      for (let i = 0; i < this.chosen_paper_List.length; i++) {
        commonAjax(this.backendIP + "/api/paperJsonGet", {
          Database_Name: "LUNA",
          Paper_ID: this.chosen_paper_List[i].ID,
        }).then((data) => {
          if (data.Paper_Json.status == "FAIL") {
            this.$message.error("服务器繁忙，请稍后再试。");
            this.Question_Analysing = false;
            return;
          }
          let index = this.chosen_paper_List.findIndex(
            (x) => x.ID === data.Paper_Json.id
          );
          this.analyse_result[index] = data.Paper_Json;
          this.progress++;
        });
      }
      // this.status_Listener = setInterval(this.test_status(status), 200);
    },
    // 2021/12/26更新，修改进度条的外貌
    // 结束监听
    Finish_Loading(){
      this.progress = 0;
      this.Question_Analysing = false;
      setTimeout(()=>{
        if (this.checkList.indexOf("数字属性") > -1) this.Init_word_cnt_Bar();
        if (this.checkList.indexOf("关键词") > -1) this.Init_Word_Cloud();
        if (this.checkList.indexOf("知识点分值") > -1) this.Init_Radar();
        if (this.checkList.indexOf("难度变化") > -1) this.Init_difficulty_change();
        this.analyse_finished = true;
      }, 100)
      
    },
    // 状态监听函数
    // test_status(status) {
    //   //这里一定要用函数闭包，否则setinterval只会执行一次
    //   return () => {
    //     let flag = true;
    //     this.progress = 0;
    //     //console.log("flag status", flag, status);
    //     for (let i = 0; i < status.length; i++) {
    //       flag = flag && status[i];
    //       if (status[i]) this.progress++;
    //     }
    //     //console.log("flag", flag);
    //     if (flag) {
    //       clearInterval(this.status_Listener);
    //       this.Question_Analysing = false;
    //       if (this.checkList.indexOf("数字属性") > -1) this.Init_word_cnt_Bar();
    //       if (this.checkList.indexOf("关键词") > -1) this.Init_Word_Cloud();
    //       if (this.checkList.indexOf("知识点分值") > -1) this.Init_Radar();
    //       if (this.checkList.indexOf("难度变化") > -1)
    //         this.Init_difficulty_change();
    //       this.analyse_finished = true;
    //       // console.log("finish", this.analyse_finished);
    //     }
    //   };
    // },
    // 初始化词云
    Init_Word_Cloud() {
      this.title0 = this.analyse_result[0].title;
      this.title1 = this.analyse_result[1].title;
      this.paper_num = this.analyse_result.length;
      this.handle_keyword_total();
      let keyword_list = [];
      this.show_Word_Cloud = true;
      for (let i = 1; i <= this.chosen_paper_List.length; i++) {
        // 获取div对象，和echarts是一个道理，获取完数据后重新捕捉这些对象即可
        // 建议创建若干个预置对象，和echarts一样，然后用户点击左右切换的时候根据数据清空已有数据然后导入新的数据进行渲染
        // 具体方式可以参照statistics.vue那个BarChart变量，意思是一样的
        var wc = new Js2WordCloud(document.getElementById("container" + i));
        let option = {
          tooltip: {
            show: true,
          },
          title: {
            text: "数字属性比较",
          },
          list: [],
          rotateRatio: 0,
          gridsize: 3,
          minFontSize: 20,
          maxFontSize: 50,
          //shape: "circle",
          color: "random-dark",
        };
        keyword_list[i - 1] = this.handle_keyword(i - 1, 50);
        //console.log(keyword_list[i-1]);
        for (let item of keyword_list[i - 1]) {
          option.list.push([item.word, item.cnt]);
        }
        wc.setOption(option);
      }
      //取在试卷1中出现了但没在其他试卷中出现的关键词
      for (let item of keyword_list[0]) {
        let flag = true;
        for (let j = 1; j < this.chosen_paper_List.length; j++)
          if (keyword_list[j].indexOf(item) != -1) {
            flag = false;
            break;
          }
        if (flag) this.keyword_cache.push(item.word);
        if (this.keyword_cache.length == 2) break;
      }

      //取在试卷2中出现了但没在其他试卷中出现的关键词
      for (let item of keyword_list[1]) {
        let flag = true;
        for (let j = 0; j < this.chosen_paper_List.length; j++) {
          if (j == 1) continue;
          if (keyword_list[j].indexOf(item) != -1) {
            flag = false;
            break;
          }
        }
        if (flag) this.keyword_cache.push(item.word);
        if (this.keyword_cache.length == 4) break;
      }
    },
    // 处理试卷index的关键词，返回一个数组，包含n个关键词以及他们的频数
    handle_keyword(index, n) {
      let keyword_list = [];
      for (const value1 of this.analyse_result[index].keyword_list)
        for (const value2 of value1) {
          // 黑名单中的关键词当作没看到
          if (this.keyword_blacklist.indexOf(value2) != -1) continue;
          let k = keyword_list.findIndex((x) => x.word === value2);
          if (k == -1)
            // 还未记录该关键字 && 该关键词不在黑名单中
            keyword_list.push({
              word: value2,
              cnt: 1,
            });
          // 已经记录该关键字
          else keyword_list[k].cnt++;
        }
      // 对cnt从大到小排序
      var compare = function (obj1, obj2) {
        var val1 = obj1.cnt;
        var val2 = obj2.cnt;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
      keyword_list.sort(compare);
      return keyword_list.slice(0, n);
    },
    // 统计所有试卷中关键词的top10
    handle_keyword_total() {
      let keyword_list = [];
      for (let index = 0; index < this.analyse_result.length; index++) {
        for (const value1 of this.analyse_result[index].keyword_list)
          for (const value2 of value1) {
            // 黑名单中的关键词当作没看到
            if (this.keyword_blacklist.indexOf(value2) != -1) continue;
            let k = keyword_list.findIndex((x) => x.word === value2);
            if (k == -1)
              // 还未记录该关键字 && 该关键词不在黑名单中
              keyword_list.push({
                word: value2,
                cnt: 1,
              });
            // 已经记录该关键字
            else keyword_list[k].cnt++;
          }
      }
      // 对cnt从大到小排序
      var compare = function (obj1, obj2) {
        var val1 = obj1.cnt;
        var val2 = obj2.cnt;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
      keyword_list.sort(compare);
      // this.keyword_total = keyword_list.slice(0, 10);
      for (let i = 0; i < 10; i++)
        this.keyword_total.push(keyword_list[i].word);
    },
    // 初始化试卷字数的柱状图的方法
    Init_word_cnt_Bar() {
      this.show_word_cnt_Bar = true;
      this.word_cnt_aver = this.Get_word_cnt_aver();
      this.figure_cnt_aver = this.Get_figure_cnt_aver();
      this.equation_cnt_aver = this.Get_equation_cnt_aver();
      //console.log("0 wordcnt", this.analyse_result[0].word_cnt);
      let myChart = echarts.init(document.getElementById("word_cnt_Bar"));
      let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        grid: {
          x: 70,
          y: 90,
          x2: 150,
          y2: 75,
        },
        title: {
          text: "数字属性比较",
          x: "center",
          y: "top",
          textStyle: {
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: "bold",
          },
          padding: [5, 5, 40, 25],
        },
        color: colors,
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
            align: "left",
          },
        },
        calculable: true,
        legend: {
          data: ["字数", "图片数", "公式数"],
          itemGap: 20,
          x: "right",
          y: "top",
          padding: [5, 30, 40, 5],
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
          },
        },
        xAxis: [
          {
            type: "category",
            data: [],
            axisTick: {
              alignWithLabel: true,
            },
            axisLabel: {
              show: true, //这里的show用于设置是否显示x轴下的字体 默认为true
              interval: 0, //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
              textStyle: {
                //textStyle里面写x轴下的字体的样式
                color: "black",
                fontSize: 14,
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "字数",
            position: "left",
            min: 0,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0],
              },
            },
            nameTextStyle: {
              //color: "black",
              fontSize: 14,
              padding: [30, 35, 15, 10],
            },
          },
          {
            type: "value",
            name: "图片数",
            position: "right",
            min: 0,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1],
              },
            },
            nameTextStyle: {
              //color: "black",
              fontSize: 14,
              padding: [30, 0, 15, 40],
            },
          },
          {
            type: "value",
            name: "公式数",
            position: "right",
            min: 0,
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2],
              },
            },
            nameTextStyle: {
              //color: "black",
              fontSize: 14,
              padding: [30, 0, 15, 40],
            },
          },
        ],
        series: [
          {
            name: "字数",
            type: "line",
            yAxisIndex: 0,
            data: [],
          },
          {
            name: "图片数",
            type: "bar",
            yAxisIndex: 1,
            barWidth: "20%",
            data: [],
          },
          {
            name: "公式数",
            type: "bar",
            yAxisIndex: 2,
            barWidth: "20%",
            data: [],
          },
        ],
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 0, //百分比
            end: 60, //百分比
            bottom: 5,
          },
        ],
      };

      // for (
      //   let i = 0;
      //   i < this.Paper_Json_Question_Bundle_Info.sub_question.length;
      //   i++
      // ) {
      //   option.xAxis[0].data.push("第" + (i + 1) + "小题");
      //   if (this.Paper_Json_Question_Bundle_Info.sub_question[i].difficulty) {
      //     option.series[0].data.push(
      //       this.Paper_Json_Question_Bundle_Info.sub_question[i].difficulty
      //     );
      //   } else {
      //     option.series[0].data.push(
      //       this.Paper_Json_Question_Bundle_Info.sub_question[i]
      //         .difficulty_statistics.mean
      //     );
      //   }
      // }

      for (let i = 0; i < this.analyse_result.length; i++) {
        option.xAxis[0].data.push(
          this.resize_title(this.analyse_result[i].title)
        );
        option.series[0].data.push(this.analyse_result[i].word_cnt);
        option.series[1].data.push(this.analyse_result[i].figure_cnt);
        option.series[2].data.push(this.analyse_result[i].equation_cnt);
      }
      console.log(option.series)
      myChart.setOption(option);

      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    Init_Radar() {
      this.paper_num = this.analyse_result.length;
      this.show_knowledge2score = true;
      let myChart = echarts.init(document.getElementById("Radar"));
      //let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        title: {
          text: "知识点分值比较", //这里的参数是整个图标的标题 后面也可以加注释
          left: "39%",
          top: "top",
          textStyle: {
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: "bold",
          },
          //padding: [5, 25, 80, 85],
          lineHeight: 40,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          show: true,
          orient: "vertical", //这里主要是标识不同颜色代表不同的同学
          // left: "right",
          right: 20,
          top: "top",
          data: [],
        },
        radar: [
          {
            center: ["45%", "55%"],
            splitArea: {
              areaStyle: {
                color: ["#FFFFFF"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            name: {
              formatter: "{value}",
              textStyle: {
                fontSize: 18,
                color: "#000000",
              },
            },
            indicator: [
              // { text: "素质必修课 ", max: 5.0 }, //这里用于设置各轴的参数以及最大值
              // { text: "核心必修课 ", max: 5.0 },
              // { text: "一般必修课 ", max: 5.0 },
              // { text: "通识必修课", max: 5.0 },
              // { text: "通识限选课", max: 5.0 },
            ],
          },
        ],
        calculable: true,
        series: [
          {
            name: "知识点分值",
            type: "radar",
            lineStyle: {
              type: "dashed",
            },
            symbol: "circle", // 拐点的样式
            symbolSize: 10,
            data: [
              // {
              //   value: [3.5, 4.8, 3.2, 4.7, 4.5],
              //   name: "A同学 ",
              // },
              // {
              //   value: [4.2, 4.1, 3.9, 3.7, 3.5],
              //   name: "B同学 ",
              // },
            ],
          },
        ],
      };

      var knowledge_list = new Set();
      for (let i = 0; i < this.analyse_result.length; i++)
        for (let knowledge in this.analyse_result[i].knowledge2score) {
          knowledge_list.add(knowledge);
          //console.log(knowledge);
        }

      for (let i = 0; i < this.analyse_result.length; i++) {
        let value = [];
        for (let knowledge in this.analyse_result[i].knowledge2score) {
          let score = this.analyse_result[i].knowledge2score[knowledge];
          if (score == undefined) value.push(0);
          else value.push(score);
        }
        option.series[0].data.push({
          value: value,
          name: this.analyse_result[i].title,
        });
        option.legend.data.push(this.analyse_result[i].title);
        //console.log(option.series[0].data);
      }
      for (let knowledge of knowledge_list) {
        //console.log(knowledge);
        this.knowledge_num++;
        option.radar[0].indicator.push({ text: knowledge });
      }

      let aver_score = [];
      for (let knowledge of knowledge_list) {
        let sum = 0;
        for (let i = 0; i < this.analyse_result.length; i++) {
          let score = this.analyse_result[i].knowledge2score[knowledge];
          if (score == undefined) continue;
          sum += score;
          if (score < this.lowest_score) {
            this.lowest_score = score;
            this.lowest_score_knowledgepoint = knowledge;
            this.paper_lowest_score = this.analyse_result[i].title;
          }
        }
        sum /= this.analyse_result.length;
        sum = sum.toFixed(1);
        aver_score.push({
          knowledge: knowledge,
          score: sum,
        });
      }
      //console.log(option.Radar[0].indicator);

      // 对score从大到小排序
      var compare_score = function (obj1, obj2) {
        var val1 = obj1.score;
        var val2 = obj2.score;
        if (val1 < val2) {
          return 1;
        } else if (val1 > val2) {
          return -1;
        } else {
          return 0;
        }
      };
      aver_score.sort(compare_score);
      // console.log("aver_score", aver_score);
      this.most_welcomed_knowledgepoint = aver_score[0].knowledge;
      this.highest_aver_score = aver_score[0].score;
      for (let i = 1; i <= 3; i++)
        this.second_welcomed_knowledgepoint.push(aver_score[i].knowledge);

      myChart.setOption(option);
    },
    Init_difficulty_change() {
      this.show_difficulty_change = true;
      this.paper_num = this.analyse_result.length;
      //console.log("0 wordcnt", this.analyse_result[0].word_cnt);
      let myChart = echarts.init(document.getElementById("diffi_change"));
      let colors = [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ];
      let option = {
        grid: [],
        title: {
          text: "难度变化比较",
          x: "center",
          y: "top",
          textStyle: {
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: "bold",
          },
          padding: [5, 5, 40, 25],
        },
        color: colors,
        tooltip: {
          trigger: "item",
          axisPointer: {
            type: "shadow",
            label: {
              show: true,
            },
          },
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
            align: "left",
          },
        },
        calculable: true,
        legend: {
          data: [],
          itemGap: 20,
          top: 40,
          left: "center",
          padding: [5, 30, 40, 5],
          textStyle: {
            fontSize: 14,
            fontStyle: "normal",
          },
        },
        xAxis: [],
        yAxis: [],
        series: [],
      };

      for (let i = 0; i < this.analyse_result.length; i++) {
        // console.log(this.analyse_result[i].difficulty_list);
        option.grid[i] = {
          top: 130 + 160 * i,
          height: 100,
        };
        option.xAxis[i] = {
          type: "category",
          gridIndex: i,
          name: "题号",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            show: true, //这里的show用于设置是否显示x轴下的字体 默认为true
            interval: 0, //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
          },
        };
        for (let j = 0; j < this.analyse_result[i].difficulty_list.length; j++)
          option.xAxis[i].data.push(j + 1);
        option.yAxis[i] = {
          type: "value",
          gridIndex: i,
          name: "难度",
          position: "left",
          //min: 0,
          //max: 1,
          axisLine: {
            show: true,
          },
          nameTextStyle: {
            //color: "black",
            fontSize: 14,
            padding: [0, 20, 0, 0],
          },
        };
        let average_difficulty = 0;
        for (let diffi of this.analyse_result[i].difficulty_list)
          average_difficulty += diffi;
        average_difficulty =
          average_difficulty / this.analyse_result[i].difficulty_list.length;
        average_difficulty = average_difficulty.toFixed(2);
        if (average_difficulty > this.highest_difficulty) {
          this.highest_difficulty = average_difficulty;
          this.most_difficult_paper = this.analyse_result[i].title;
        }
        //console.log(average_difficulty);
        option.series.push({
          name: this.analyse_result[i].title,
          color: colors[i],
          type: "line",
          smooth: true,
          xAxisIndex: i,
          yAxisIndex: i,
          data: this.analyse_result[i].difficulty_list,
          markLine: {
            silent: true,
            data: [{ type: "average", name: "平均难度" }],
            label: {
              formatter: "平均难度" + average_difficulty,
              position: "end",
              color: colors[i],
              fontSize: 14,
            },
            symbol: "none",
          },
        });

        option.legend.data.push(this.analyse_result[i].title);
      }
      myChart.setOption(option);

      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener("resize", function () {
        myChart.resize();
      });

      for (let i = 0; i < this.analyse_result.length; i++) {
        for (let j = 0; j < this.analyse_result[i].difficulty_list.length; j++)
          if (
            this.analyse_result[i].difficulty_list[j] >
            this.hardest_question_difficulty
          ) {
            this.hardest_question_difficulty =
              this.analyse_result[i].difficulty_list[j];
            this.hardest_question_paper = this.analyse_result[i].title;
            this.hardest_question_num = j + 1;
          }
      }
      this.hardest_question_difficulty =
        this.hardest_question_difficulty.toFixed(2);
    },
    resize_title(title) {
      let max_width = 13;
      let newtitle = title.slice(0);
      // console.log(newtitle);
      for (let i = 1; i <= title.length; i++)
        newtitle =
          newtitle.slice(0, max_width * i + i - 1) +
          "\n" +
          newtitle.slice(max_width * i + i - 1);
      return newtitle;
    },
    //test
    // 初始化试卷字数的柱状图的方法
    Init_test() {
      let myChart = echarts.init(document.getElementById("test"));
      //let colors = ["#EE6666", "#5470C6", "#91CC75"];
      let option = {
        title: {
          text: "知识点分值比较", //这里的参数是整个图标的标题 后面也可以加注释
          left: "39%",
          top: "top",
          textStyle: {
            fontSize: 16,
            fontStyle: "normal",
            fontWeight: "bold",
          },
          //
        },
        grid: {
          y: 100,
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          padding: [50, 25, 10, 85],
          show: true,
          orient: "vertical", //这里主要是标识不同颜色代表不同的同学
          //x: "center",
          //y: "bottom",
          // left: "right",
          right: 20,
          top: "top",
          data: ["2020年全国统一高考数学试卷（文科）（新课标i)", "B同学"],
        },
        radar: [
          {
            center: ["45%", "55%"],
            splitArea: {
              areaStyle: {
                color: ["#FFFFFF"],
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 1)",
              },
            },
            name: {
              formatter: "{value}",
              textStyle: {
                fontSize: 18,
                color: "#000000",
              },
            },
            indicator: [
              { text: "素质必修课 ", max: 5.0 }, //这里用于设置各轴的参数以及最大值
              { text: "核心必修课 ", max: 5.0 },
              { text: "一般必修课 ", max: 5.0 },
              { text: "通识必修课", max: 5.0 },
              { text: "通识限选课", max: 5.0 },
              { text: "素质必修课 ", max: 5.0 }, //这里用于设置各轴的参数以及最大值
              { text: "核心必修课 ", max: 5.0 },
              { text: "一般必修课 ", max: 5.0 },
              { text: "通识必修课", max: 5.0 },
              { text: "通识限选课", max: 5.0 },
            ],
          },
        ],
        calculable: true,
        series: [
          {
            name: "知识点分值",
            type: "radar",
            symbol: "circle", // 拐点的样式
            lineStyle: {
              type: "dashed",
            },
            data: [
              {
                value: [3.5, 4.8, 3.2, 4.7, 4.5, 3.5, 4.8, 3.2, 4.7, 4.5],
                name: "2020年全国统一高考数学试卷（文科）（新课标i)",
              },
              {
                value: [4.2, 4.1, 3.9, 3.7, 3.5, 3.5, 4.8, 3.2, 4.7, 4.5],
                name: "B同学",
              },
            ],
          },
        ],
      };
      myChart.setOption(option);
    },
    // 字数平均值
    Get_word_cnt_aver() {
      let aver = 0;
      for (let i = 0; i < this.analyse_result.length; i++)
        aver += this.analyse_result[i].word_cnt;
      aver = Math.floor(aver / this.analyse_result.length);
      return aver;
    },
    // 图片数平均值
    Get_figure_cnt_aver() {
      let aver = 0;
      for (let i = 0; i < this.analyse_result.length; i++)
        aver += this.analyse_result[i].figure_cnt;
      aver = Math.floor(aver / this.analyse_result.length);
      return aver;
    },
    // 公式数平均值
    Get_equation_cnt_aver() {
      let aver = 0;
      for (let i = 0; i < this.analyse_result.length; i++)
        aver += this.analyse_result[i].equation_cnt;
      aver = Math.floor(aver / this.analyse_result.length);
      return aver;
    },
    /*
     * 将多个canvas画布组成的图表合成为一个完整的canvas,并获取完整的dataURl
     * @param divId divId 包含整个画布的divId
     * @returns {String} widthXheight@dataURL 例：
     */
    getFullCanvasDataURL(divId) {
      //将第一个画布作为基准。
      var baseCanvas = $("#" + divId)
        .find("canvas")
        .first()[0];
      if (!baseCanvas) {
        return false;
      }
      var width = baseCanvas.width;
      var height = baseCanvas.height;
      var ctx = baseCanvas.getContext("2d");
      //遍历，将后续的画布添加到在第一个上
      $("#" + divId)
        .find("canvas")
        .each(function (i, canvasObj) {
          if (i > 0) {
            var canvasTmp = $(canvasObj)[0];
            ctx.drawImage(canvasTmp, 0, 0, width, height);
          }
        });
      //获取base64位的url
      return baseCanvas.toDataURL();
    },
    Report_Download() {
      this.Download_loading = true;
      let param = {
        paper_titles: [],
        part1: {},
        part2: {},
        part3: {},
        part4: {},
      };
      for (let i = 0; i < this.analyse_result.length; i++)
        param.paper_titles.push(this.analyse_result[i].title);
      param.part1 = {
        num_words: this.word_cnt_aver,
        num_pics: this.figure_cnt_aver,
        num_equations: this.equation_cnt_aver,
        fig: this.getFullCanvasDataURL("word_cnt_Bar"),
      };
      // console.log(param.part1.fig);

      let figs = []; // the figures of wordcloud for each paper
      for (let i = 1; i <= this.analyse_result.length; i++)
        figs.push(this.getFullCanvasDataURL("container" + i));
      param.part2 = {
        title1: this.title0,
        keyword1: this.keyword_cache.slice(0, 2),
        title2: this.title1,
        keyword2: this.keyword_cache.slice(2, 4),
        top10: this.keyword_total,
        fig: figs,
      };

      param.part3 = {
        num_kp: this.knowledge_num,
        kp1: this.most_welcomed_knowledgepoint,
        kp1_score: this.highest_aver_score,
        rest_kp: this.second_welcomed_knowledgepoint,
        title: this.paper_lowest_score,
        kp2: this.lowest_score_knowledgepoint,
        kp2_score: this.lowest_score,
        fig: this.getFullCanvasDataURL("Radar"),
      };

      param.part4 = {
        title1: this.most_difficult_paper,
        difficulty1: this.highest_difficulty,
        title2: this.hardest_question_paper,
        index: this.hardest_question_num,
        difficulty2: this.hardest_question_difficulty,
        fig: this.getFullCanvasDataURL("diffi_change"),
      };

      let report_data = new FormData();
      report_data.append("data", JSON.stringify(param, null, 4));
      // console.log(param);
      // console.log(data);

      let config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "arraybuffer",
        emulateJSON: true,
      };

      // commonAjax(
      //   "https://multipaper-report-json2docx-286-production.env.bdaa.pro/v1",
      //   // param
      //   report_data
      // )
      this.$http
        .post(
          "https://multipaper-report-json2docx-286-production.env.bdaa.pro/v1",
          report_data,
          config
        )
        .then((data) => {
          if (data.data) {
            this.Download_loading = false;
            const link = document.createElement("a");
            let blob = new Blob([data.data], {
              type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            });
            let objectUrl = URL.createObjectURL(blob);
            link.href = objectUrl;
            link.download = "试卷分析报告.docx";
            link.click();
            URL.revokeObjectURL(objectUrl);
          }
        })
        .catch(() => {
          alert("服务器过忙，请稍后重新尝试...");
          this.Download_loading = false;
          return;
        });
    },
  },
};
</script>

<style scoped>
/* 调整试卷总体条形图外框 */
.word_cnt_Bar {
  border-radius: 10px;
  width: 67vw;
  height: 450px;
  padding-top: 20px;
  padding-bottom: 20px;
  /* margin: 40px auto 40px auto; */
  margin-top: 40px;
  margin-bottom: 40px;
  border: 3px solid #eef5fe;
}

.diffi_change {
  border-radius: 10px;
  width: 67vw;
  /* height: 900px; */
  padding-top: 20px;
  padding-bottom: 20px;
  /* margin: 40px auto 40px auto; */
  margin-top: 40px;
  margin-bottom: 40px;
  border: 3px solid #eef5fe;
}

.description {
  margin: 50px auto 0 auto;
  text-align: left;
  width: 1000px;
  font-size: 18px;
}

.el-divider--horizontal {
  display: block;
  height: 4px;
  width: 100%;
  margin: 24px 0;
}

.Top_Nav {
  position: relative;
  top: -90px;
  width: 10px;
  height: 10px;
  background: transparent;
}

.Part_Row_Style {
  border-left: 15px solid #409efd;
  background: rgba(240, 245, 251, 0.45);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  width: 90%;
  margin: 5px 0 20px 6%;
  padding-left: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}

.tab {
  position: absolute;
  width: 40px;
  height: 133px;
  left: 0px;
  top: 258px;

  background: #409eff;
  border: 4px solid #d9e9fe;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  border-radius: 0px 10px 10px 0px;
  cursor: pointer;
}

.text {
  position: absolute;
  width: 22px;
  height: 110px;
  left: calc(50% - 22px / 2);
  top: 0px;

  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 24px;
  /* or 120% */

  display: flex;
  align-items: center;
  text-align: center;

  color: #ffffff;
}

.icon {
  position: absolute;
  width: 24px;
  height: 24px;
  font-size: 24px;
  left: calc(50% - 24px / 2);
  top: 103px;
  color: white;
}
</style>