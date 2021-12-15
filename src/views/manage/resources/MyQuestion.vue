<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex">
      <el-col :span="7">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>我的试题</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <label style="font-size: 18px">我的试题</label>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start">
        <el-col :span="18">
            <el-row type="flex" justify="start" style="margin-left: 10px">
                <span style="height: 40px; line-height: 40px; margin-right: 15px">试题ID：</span>
                <el-input v-model="searchID" placeholder="试题ID" style="width: 12vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <span style="height: 40px; line-height: 40px; margin-right: 15px">关键词：</span>
                <el-input @keyup.enter.native="submit" v-model="searchKeyword" placeholder="关键词" style="width: 8vw; height: 30px; line-height: 30px; margin-right: 30px"></el-input>
                <el-button type="primary" style="height: 40px" @click="submit">检索</el-button>
            </el-row>
        </el-col>
        <el-col :span="6">
            <el-row type="flex" justify="end" style="margin-right: 40px">
                <el-button type="primary" style="height: 40px" @click="Input_New_Question()">录入试题</el-button>
            </el-row>
        </el-col>
    </el-row>
    <el-row v-if="Question.stem">
      <el-col :span="23" class="quesCard">
        <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px" >
            <Mathdown :content="Question.stem" :name="'Q_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 15px">
            <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
              所属题库：{{Question.database}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
              学科：{{Question.subject}}
            </el-col>
            <el-col :span="4" style="line-height: 40px; color: #888; font-size: 1.5rem; display: none">
              题型：{{Question.type}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
              学段：{{Question.period}}
            </el-col>
            <el-col :span="4" :offset="2" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Expand = !Expand">查看答案与解析</el-button>
            </el-col>
            <el-col :span="3" :offset="1" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
            </el-col>
        </el-row>
        <el-row v-if="Expand" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
          <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_Answer'"></Mathdown>
          </el-col>
        </el-row>
        <el-row v-if="Expand" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
          <el-col>
            <span style="display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_Analysis'"></Mathdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 40px">
        <el-table
            :data="tableData">
            <el-table-column
                prop="id"
                label="试题ID"
                width="180">
            </el-table-column>
            <el-table-column
                prop="stem"
                label="题目内容">
            </el-table-column>
            <el-table-column
                prop="answer"
                label="试题答案">
            </el-table-column>
            <el-table-column
                prop="analyse"
                label="试题解析">
            </el-table-column>
            <el-table-column
                prop="source"
                label="试题来源"
                width="100">
            </el-table-column>
            <el-table-column
                type="index"
                label="操作"
                width="240">
                <template slot-scope="scope">
                    <el-row>
                        <el-button size="mini" type="primary" @click="Check_My_Question(scope.$index)">查看</el-button>
                        <el-button size="mini" type="success" @click="Edit_My_Question(scope.$index)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="Delete_My_Question(scope.$index)">删除</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
    <el-row v-if="question_list.length != 0" style="margin-top: 30px">
      <el-pagination
        @current-change="BackToTop"
        :current-page.sync="Page_Index"
        :page-size="Page_Length"
        layout="total, prev, pager, next"
        :total="Total_Count">
      </el-pagination>
    </el-row>
  </div>
</template>
<script>

import {commonAjax} from '@/common/utils/ajax'
import Mathdown from '@/common/components/Mathdown'

export default {
  name: 'MyQuestion',
  props: {

  },
  components: {
    Mathdown
  },
  data() {
    return {
      // 搜索用的试题ID以及关键字，还有缓存
        searchID: "",
        searchKeyword: "",
        searchKwCache: "",
      // 这里是测试数据，之后清空
        tableData: [],
      // 保存原始题目数据
        question_list: [],
      // 这里是用户所具有的权限数据库
        database_list: [],
      // 页码
        Page_Index: 1,
      // 单页长度，总页数
        Page_Length: 5,
      // 能搜索到的题目数量
        Total_Count: -1,
        // 用于“查看”的变量
        Question: {},
        // 用于“编辑”的信息内容
        QuestionInfo: {
          type: "",
          // 分值
          score: 5,
          // 题目内容，题目内容图片
          content: "",
          content_images: [],
          // 选项的部分
          options: [],
          options_images: [],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 小题的部分
          sub_questions: [],
          sub_questions_images: [],
          sub_questions_scores: [],
          // 解析的部分
          analyse: "",
          analyse_images: []
        },
        // 是否展开单题查看
        Expand: false
    }
  },
  watch:{

  },
  mounted() {
    this.initDatabaseList();
    this.initDataLength();
  },
  methods: {
      ClearQuestionInfo(){
        this.QuestionInfo = {
          type: "",
          // 分值
          score: 5,
          // 题目内容，题目内容图片
          content: "",
          content_images: [],
          // 选项的部分
          options: [],
          options_images: [],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 小题的部分
          sub_questions: [],
          sub_questions_images: [],
          sub_questions_scores: [],
          // 解析的部分
          analyse: "",
          analyse_images: []
        }
      },
      Check_My_Question(val){
        this.Question = this.question_list[val];
      },
      Edit_My_Question(val){
        let Pass_Type = ["单选题", "多选题", "填空题"]
        if(Pass_Type.indexOf(this.question_list[val].type) == -1){
          alert("正在检查第 " + val + " 题，此题为 " + this.question_list[val].type + " ，还没想好怎么转化，正在努力工作中...")
          return
        }
        else{
          if(this.question_list[val].type == "单选题" || this.question_list[val].type == "多选题"){
            this.QuestionInfo.type = "option";

            // 查看选择题
            return 0
          }else{
            // 查看填空题
            return 1
          }
        }
      },
      Delete_My_Question(val){
        alert("正在删除第 " + val + " 题")
      },
      Input_New_Question(){
        this.$router.push({path: '/inputMarked'})
      },
      // 获取用户所具有的题库权限
      initDatabaseList(){
        this.database_list=[{name:'public',nick:'公共题库'}]
        //未登录时，不调用获取题库的端口
        if(!this.$store.state.user.token){
          return ;
        }
        commonAjax(this.backendIP+'/api/get_user_ig_name',
          {
            type:'Question',
            action:'R',
          }
        ).then((res)=>{
          let data=res.ig_name;
          for (var i = 0; i < data.length; i++) {
            this.database_list.push({name:data[i]})
          }
        })
        this.submit();
      },
      initDataLength(){
        for(let i = 0; i < this.tableData.length; i++){
          let ITEM = this.tableData[i];
          let limit = 25;
          if(ITEM.stem.length > limit){
              ITEM.stem = ITEM.stem.substring(0, limit) + "..."
          }
          if(ITEM.answer.length > limit){
              ITEM.answer = ITEM.answer.substring(0, limit) + "..."
          }
          if(ITEM.analyse.length > limit){
              ITEM.analyse = ITEM.analyse.substring(0, limit) + "..."
          }
          if(ITEM.source.length > limit){
              ITEM.source = ITEM.source.substring(0, limit) + "..."
          }
          this.tableData.splice(i, 1, ITEM)
        }
      },
      BackToTop(){
        this.submit();
        window.scrollTo(0,0);
      },
      submit() {

        if(this.searchKwCache != this.searchKeyword){
          this.Page_Index = 1;
        }

        this.searchKwCache = this.searchKeyword;

        let param={}
        let database_list = [];

        this.tableData = [];
        this.Question = {};

        for(var i = 0; i < this.database_list.length; i++){
            database_list.push(this.database_list[i].name)
        }

        var data = JSON.stringify({
          "content": this.searchKeyword,
          "size": 5,
          "database": database_list,
          "page_count": this.Page_Index,
          "subject": [],
          "period": []
        })

        // param.append("data", data);
        param.data=data

        commonAjax(this.backendIP+'/api/search', param)
        .then((data)=>{
          var quess = data.results;
          this.Total_Count = data.totalLength
          for(let i = 0; i < quess.length; i++){
            this.tableData.push({
              id: quess[i].id,
              stem: quess[i].stem,
              answer: quess[i].answer,
              analyse: quess[i].analysis,
              source: quess[i].database
            })
          }
          this.question_list = quess;
          this.initDataLength();
        })
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 查看单题分析报告
    Check_Analyse(ID, DatabaseName){

      this.Question_Analysing = true;

      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename:DatabaseName=='公开题库'?'public':DatabaseName,
          ID:ID
        }
      ).then((data)=>{
        // console.log(data);
        this.Refresh = !this.Refresh;
        this.analyseReport = true;
        this.Question_Analysing = false
        this.analyseData = data.que_dic
      })
    },
  }
}
</script>
<style >
.quesCard{
  background: #F8FBFF;
  border: 1px dashed black;
  margin-top: 2vh;
}
</style>
