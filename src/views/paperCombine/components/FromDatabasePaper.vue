<template>
  <div
    class="exercise"
    style="padding-bottom: 40px; padding-top: 5vh"
    v-loading="Question_Analysing"
    element-loading-text="正在加载，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.4)">
    <!-- 查看分析报告 -->
    <el-dialog
        :visible.sync="analyseReport"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        :key="Refresh">
        <template slot="title"></template>
        <el-row
          style="margin: 0px">
          <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
        </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="simpleInput"
      title="LUNA输入助手"
      width="65%"
      :modal-append-to-body="false"
      :close-on-click-modal="false">
    <ComplexInput @New_Content="Update_Complex_Input" :Get_Out_Content="content"></ComplexInput>
  </el-dialog>
  <el-dialog
      :visible.sync="PaperDetailDialog"
      :title="SearchingPaperTitle"
      width="90%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="Reset_Searching_Paper()">
    <el-row v-for="(Bundle, Bundle_Index) in SearchingPaper" :key="'Paper_Bundle_' + Bundle_Index">
      <el-col>
        <el-row type="flex" justify="start" style="padding-left: 3vw; font-size: 20px;">
          <label>{{Get_Label_Show(Bundle, Bundle_Index)}}</label>
        </el-row>
        <el-row
          v-for="(Question, Question_Index) in Bundle.sub_question"
          :key="'Paper_Bundle_' + Bundle_Index + '_' + Question_Index"
          style="width: 100%" type="flex" justify="center">
          <!-- {{Ques.id}}<br>{{Ques.stem}}<br>{{Ques.options}}<br>{{Ques.answer}}<br>{{Ques.analysis}} -->
          <el-col :span="20" class="quesCard" style="margin-left: 0">
            <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
              <el-col style="padding-bottom: 15px" >
                <Mathdown :content="Question.stem" :name="'Q_' + Bundle_Index + '_' + Question_Index + '_Stem'"></Mathdown>
              </el-col>
              <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_' + Option_Index + '_Of_' + Question_Index + '_' + Bundle_Index">
                <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index + '_' + Bundle_Index"></Mathdown></el-row>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 10px;">
                <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
                  所属题库：{{SearchingSource}}
                </el-col>
                <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem;">
                  题型：{{Bundle.desc == '选择题' ? '单选题' : Bundle.desc == '填空题' ? '填空题' : '简答题'}}
                </el-col>
                <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                  难度：{{Question.difficulty == null ? "暂无数据" : Question.difficulty.toFixed(3)}}
                </el-col>
                <el-col :span="4" :offset="2" style="line-height: 40px">
                  <el-button size="medium" plain round type="primary" @click="Expand(Bundle_Index, Question_Index)">查看答案与解析</el-button>
                </el-col>
                <el-col :span="3" style="line-height: 40px">
                  <el-button size="medium" plain round type="primary" @click="Check_Analyse_Ques(Question.id, Question.database)">查看分析报告</el-button>
                </el-col>
                <el-col :span="3" style="line-height: 40px; margin-left: 6px;">
                  <el-button size="medium" plain round type="primary" @click="Add_To_Question_Cart(Question, Bundle.desc)">加入试题篮</el-button>
                </el-col>
            </el-row>
            <el-row v-if="Expand_List[Get_Expand(Bundle_Index, Question_Index)]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
              <el-col>
                <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer' + '_' + Bundle_Index"></Mathdown>
              </el-col>
            </el-row>
            <el-row v-if="Expand_List[Get_Expand(Bundle_Index, Question_Index)]" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
              <el-col>
                <span style="margin-bottom: 20px; display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis' + '_' + Bundle_Index"></Mathdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px; margin-bottom: 30px">
          <el-button type="primary" @click="Close_Searching_Paper()">完毕</el-button>
        </el-row>
  </el-dialog>
    <!-- 搜索框行 -->
    <el-row type="flex" justify="start" class="SearchArea">
      <!-- enter.native才能监听到组件化的事件，要注意一下 -->
      <el-col :span="20">
        <el-input class="SearchInput" v-model="content" type="text" @keyup.enter.native="submit()">

        </el-input>
      </el-col>
      <el-col :span="1">
        <el-button type="text" style="font-size: 20px; color: black;" size="small" v-if="content != ''" @click="content = ''">
          <i class="el-icon-close"></i>
        </el-button>
      </el-col>
      <el-col :span="1">
        <el-divider direction="vertical"></el-divider>
      </el-col>
      <el-col :span="1">
        <el-button type="text" style="font-size: 22px; color: #409EFF; display: block; margin-left: -6px;"  size="small" @click="simpleInput = true">
          &Sigma;
        </el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="text" style="font-size: 22px; display: block; margin-left: -8px" size="small" @click="submit()">
          <i class="el-icon-search"></i>
        </el-button>
      </el-col>
    </el-row>
    <!-- 筛选行 - 题库 -->
    <el-row style="margin-left: 5vw; margin-top: 4vh; font-size: 16px;">
      <el-col :span="1">
          <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
              <label>题库：</label>
          </el-row>
      </el-col>
      <el-col :span="2" v-for="(databaseName, databaseIndex) in databaseAim" :key="'Database_' + databaseIndex">
          <el-row type="flex" justify="center" :class="filterButtonStyle('database', databaseIndex)" @click.native="database_Change(databaseIndex)">
              <span>{{databaseName.nick || databaseName.name}}</span>
          </el-row>
      </el-col>
    </el-row>
    <!-- 筛选行 - 排序方式 -->
    <el-row style="margin-left: 5vw; margin-top: 2vh; font-size: 16px; margin-bottom: 30px">
      <el-col :span="1">
          <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
              <label>排序：</label>
          </el-row>
      </el-col>
      <el-col :span="2" >
          <el-row type="flex" justify="center" class="filterButtonFocus">
              <span>智能排序</span>
          </el-row>
      </el-col>
    </el-row>
    <el-row
      v-for="(Paper, Paper_Index) in Paper_Ques_List"
      :key="Paper_Index"
      style="margin-bottom: 40px;"
      >
      <el-row>
        <el-col :span="17" class="quesCard">
          <el-row
            style="text-align: left; padding-left: 30px; font-size: 16px; padding-top: 15px; background: white; padding-bottom: 15px;">
            <label style="height: 60px; line-height: 60px">{{Paper_Title_List[Paper_Index]}}</label>
          </el-row>
          <el-row style="margin-bottom: 15px">
              <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
                所属题库：{{Paper_Ques_List[Paper_Index].database}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学科：{{Paper_Ques_List[Paper_Index].subject}}
              </el-col>
              <el-col :span="4" style="line-height: 40px; color: #888; font-size: 1.5rem; display: none">
                题型：{{Paper_Ques_List[Paper_Index].type}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                学段：{{Paper_Ques_List[Paper_Index].period}}
              </el-col>
              <el-col :span="4" :offset="2" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Paper_Detail_Show(Paper_Index)">试卷详情</el-button>
              </el-col>
              <el-col :span="3" :offset="1" style="line-height: 40px">
                <el-button size="medium" plain round type="primary" @click="Check_Analyse(Paper_ID_List[Paper_Index], Paper_Ques_List[Paper_Index].database)">查看分析报告</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
    <el-row
      v-if="Paper_Ques_List.length == 0"
      style="margin: 50px 60px; height: 44vh; font-size: 30px"
      v-loading="loading"
      element-loading-text="加载中，请等待"
      element-loading-spinner="el-icon-loading">

    </el-row>
    <el-row v-if="Paper_Ques_List.length != 0">
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
/* eslint-disable */
import Mathdown from '@/common/components/Mathdown'
import ComplexInput from '@/common/components/ComplexInput'
import QuestionAnalyse from '@/views/resourceAnalyse/QuestionAnalyse'
import Instruction from '@/views/resourceQuery/components/InstructionExercise'

import {commonAjax} from '@/common/utils/ajax'

export default {
  components: { Mathdown, ComplexInput, QuestionAnalyse, Instruction },
  name: "SearchPaper",
  props: {
      Subject: {
          type: String,
          default: "数学"
      },
      Period: {
          type: String,
          default: "高中"
      }
  },
  data() {
    return {
      // Latex格式的内容
      content: "",
      // 老内容
      old_content: "",
      // 当前是否为简单输入格式
      simpleInput: false,
      // 存放返回的题目内容
      Paper_Ques_List: [],
      // 存放将要查询的数据库名称
      databaseAim: [],
      // 试卷的ID和标题组
      Paper_ID_List: [],
      Paper_Title_List: [],
      // 页码
      Page_Index: 1,
      // 单页长度，总页数
      Page_Length: 5,
      Total_Page: -1,
      // 能搜索到的题目数量
      Total_Count: -1,
      // loading
      loading: false,
      // 是否正在返回分析报告
      Question_Analysing: false,
      // 暂时获得了分析报告的试卷ID
      Paper_Cache_ID: "",
      // 用于保存检索条件的Json
      filterRecord: {
        // 题库
        database: []
      },
      // 用于准备筛选单题的JSON
      SearchingPaper: [],
      // 这张卷子的标题
      SearchingPaperTitle: "",
      SearchingSource: "",
      // 对话框
      PaperDetailDialog: false,
      // 题目是否展开
      Expand_List: [],
      // 单题分析报告
      analyseReport: false,
      analyseData: {},
      Refresh: false
    };
  },
  watch:{
    sour(val) {
      this.submit();
    },
  },
  destroyed(){
    sessionStorage.removeItem(PaperDetailShow);
    sessionStorage.removeItem("PicPaste");
    clearInterval(this.Paste_Catcher);
    window.removeEventListener('paste', this.Paste_Function)
  },
  mounted(){
    this.ToTop()
    this.initDatabaseList();
  },
  methods: {
    Get_Label_Show(Bundle, Bundle_Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
      return Result[Bundle_Index] + "、" + Bundle.desc
    },
    // 关闭试卷挑题内容
    Close_Searching_Paper(){
      this.PaperDetailDialog = false;
      this.Reset_Searching_Paper();
    },
    // 重置数据
    Reset_Searching_Paper(){
      this.SearchingPaper = [];
      this.Expand_List = []
      this.SearchingPaperTitle = ""
    },
    //发送单题至试题篮
    Add_To_Question_Cart(Question, Desc){
      let Aim = Question
      let Question_Show_Infos = {
        id: "",
        type: "",
        score: 0,
        stem: "",
        options: [],
        answer: "",
        analyse: ""
      }
      if(['单选题', '多选题', '判断题'].indexOf(Aim.type) != -1){
        Question_Show_Infos.type = Aim.type;
        Question_Show_Infos.score = 5;
      }else if(['简答题', '计算题'].indexOf(Aim.type) != -1){
        Question_Show_Infos.type = Aim.type
        Question_Show_Infos.score = 12;
      }else if(Aim.type == '填空题'){
        Question_Show_Infos.type = Aim.type
        Question_Show_Infos.score = 5;
      }else{
        if(Desc == '选择题'){
          Question_Show_Infos.type = '单选题'
          Question_Show_Infos.score = 5;
        }else if(Desc == '填空题'){
          Question_Show_Infos.type = '填空题'
          Question_Show_Infos.score = 5;
        }else if(Desc == '解答题'){
          Question_Show_Infos.type = '简答题'
          Question_Show_Infos.score = 5;
        }
      }

      Question_Show_Infos.id = Aim.id;
      Question_Show_Infos.options = Aim.options;
      Question_Show_Infos.stem = Aim.stem;
      Question_Show_Infos.answer = Aim.answer;
      Question_Show_Infos.analyse = Aim.analysis;

      this.$emit("Add_To_Cart", JSON.stringify(Question_Show_Infos));
    },
    // 查看单题分析报告
    Check_Analyse_Ques(ID, DatabaseName){

      this.Question_Analysing = true;

      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename:DatabaseName=='公开题库'?'public':DatabaseName,
          ID:ID
        }
      ).then((data)=>{
        this.Refresh = !this.Refresh;
        this.analyseData = data.que_dic;
        this.analyseReport = true;
      })
    },
    // 获取是否应当展开
    Get_Expand(Bundle_Index, Question_Index){
      let Base = 0;
      for(let i = 0; i < Bundle_Index; i++){
        Base = Base + this.SearchingPaper[i].sub_question.length
      }
      let Index = Base + Question_Index
      return Index
    },
    // 调整试卷试题选择的展开与否
    Expand(Bundle_Index, Question_Index){
      let Base = 0;
      for(let i = 0; i < Bundle_Index; i++){
        Base = Base + this.SearchingPaper[i].sub_question.length
      }
      let Index = Base + Question_Index
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index])
    },
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    // 更新富文本输入框内容
    Update_Complex_Input(val){
        this.simpleInput = false;
        this.content = val
    },
    initDatabaseList(){
      this.filterRecord.database = [true]
      this.databaseAim = [
        {name: '全部', nick: '全部'},
        {name: 'public', nick: '公开题库'}]
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
              this.filterRecord.database.push(false)
              this.databaseAim.push({name: data[i], nick: data[i]})
          }
          this.databaseAim[2].nick = "个人题库"
      })
    },
    // 查看试卷分析报告
    Check_Analyse(ID, DatabaseName){

      if(this.Paper_Cache_ID == ID && sessionStorage.getItem("PaperDetailShow")){
        let Temp = JSON.parse(sessionStorage.PaperDetailShow);
        sessionStorage.PaperJson = JSON.stringify(Temp);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        return
      }

      this.Question_Analysing = true;

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID:ID
        }
      ).then((data)=>{
        this.Question_Analysing = false;
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.Paper_Cache_ID = ID;
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json);
        sessionStorage.PaperJson = JSON.stringify(data.Paper_Json);
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
      })
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    BackToTop(){
      this.submit();
      window.scrollTo(0,0);
    },
    // 修改翻页内容
    Get_Question_Bundle(Page_Index){
      if(Page_Index * 5 > this.Paper_Ques_List.length){
        return this.Paper_Ques_List.slice((Page_Index - 1)*5)
      }else {
        return this.Paper_Ques_List.slice((Page_Index - 1)*5, Page_Index * 5)
      }
    },
    // 修改当前展示的试题的内容
    Paper_Detail_Show(Index){

      this.Question_Analysing = true
      this.SearchingSource = this.Paper_Ques_List[Index].database

      this.SearchingPaper = [];
      this.Expand_List = []
      this.SearchingPaperTitle = ""

      if(this.Paper_Cache_ID == this.Paper_ID_List[Index]){
        this.SearchingPaper = JSON.parse(sessionStorage.getItem("PaperDetailShow"))
        for(let i = 0; i < this.SearchingPaper.length; i++){
          for(let j = 0; j < this.SearchingPaper[i].sub_question.length; j++){
            this.Expand_List.push(false)
          }
        }
        this.Question_Analysing = false;
        this.PaperDetailDialog = true;
        return
      }

      commonAjax(this.backendIP+'/api/paperJsonGet',
        {
          Database_Name: "LUNA",
          Paper_ID:this.Paper_ID_List[Index]
        }
      ).then((data)=>{
        this.Question_Analysing = false;
        if(data.Paper_Json.status == "FAIL"){
          this.$message.error("服务器繁忙，请稍后再试。")
          return
        }
        this.SearchingPaperTitle = data.Paper_Json.title
        this.Paper_Cache_ID = this.Paper_ID_List[Index];
        if(sessionStorage.getItem("PaperDetailShow")){
          sessionStorage.removeItem("PaperDetailShow");
        }
        sessionStorage.PaperDetailShow = JSON.stringify(data.Paper_Json.sub_question)
        this.SearchingPaper = JSON.parse(sessionStorage.getItem("PaperDetailShow"))
        for(let i = 0; i < this.SearchingPaper.length; i++){
          for(let j = 0; j < this.SearchingPaper[i].sub_question.length; j++){
            this.Expand_List.push(false)
          }
        }
        this.PaperDetailDialog = true;
      }).catch(()=>{
        this.Question_Analysing = false;
        this.$message.error("服务器繁忙，请稍后再试。")
      })
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 根据不同选择的状况调整按钮样式
    filterButtonStyle(type, index){
        if(type == "database"){
            if(index == 0){
                if(this.filterRecord.database.indexOf(true) == -1 || this.filterRecord.database.indexOf(false) == -1){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.database[index-1]){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }
    },
    // 更新数据库选择情况
    database_Change(databaseIndex){
        if(databaseIndex > 0){
            this.filterRecord.database.splice(databaseIndex - 1, 1, !this.filterRecord.database[databaseIndex-1])
        }else{
            let l = this.filterRecord.database.length;
            if(this.filterRecord.database.indexOf(false) == -1){
                this.filterRecord.database.splice(0, this.filterRecord.database.length)
                for(let i = 0; i < l; i++){
                    this.filterRecord.database.push(false);
                }
            }else{
                this.filterRecord.database.splice(0, this.filterRecord.database.length)
                for(let i = 0; i < l; i++){
                    this.filterRecord.database.push(true);
                }
            }
        }
    },
    // 检查用户
    User_Check(){
      if(sessionStorage.isAdmin){
        return true;
      }else{
        return false;
      }
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
    Same_Check(Arr1, Arr2){
      if(Arr1.length != Arr2.length){
        return false
      }
      for(let i = 0; i < Arr1.length; i++){
        if(Arr2.indexOf(Arr1[i]) == -1){
          return false
        }
      }
      return true
    },
    submit() {

      this.loading = true;

      // 后续逻辑和原先一致

      if(this.content != this.old_content){
        this.Page_Index = 1;
      }

      this.old_content = this.content
      this.Paper_Ques_List = [];

      let param={}
      var database_list = [];
        for(let i = 0 ; i < this.filterRecord.database.length; i++){
            if(this.filterRecord.database[i]){
                database_list.push(this.databaseAim[i+1].name)
            }
        }

      var data = JSON.stringify({
        "content": this.content,
        "size": 5,
        "database": database_list,
        "page_count": this.Page_Index,
        "subject": [this.Subject],
        "period": [this.Period]
      })

      param.data=data

      commonAjax(this.backendIP+'/api/search_paper',param)
      .then((data)=>{
        this.loading = false;
        this.Paper_ID_List = [];
        this.Paper_Ques_List = [];
        this.Paper_Title_List = [];
        var ID_List = data.paper_id_list;
        for(var i = 0; i < ID_List.length; i++){
          this.Paper_ID_List.push(ID_List[i]);
          this.Paper_Ques_List.push(data.question_list[i]);
          this.Paper_Title_List.push(data.paper_title_list[i]);
        }
        this.Total_Count = data.totalLength
      }).catch((err)=>{
        this.$message.error("服务器繁忙，请稍后再试。")
      })
    },
    // 修改学科，学段时的配套显示
    Get_Subject(){
      if(this.Subject_Type.length == 0){
        return "选择学科"
      }else if(this.Subject_Type.length == 1){
        return this.Subject_Type[0]
      }else{
        return this.Subject_Type[0] + "（等" + this.Subject_Type.length + "项）"
      }
    },
    Get_Period(){
      if(this.Period_Type.length == 0){
        return "选择学段"
      }else if(this.Period_Type.length == 1){
        return this.Period_Type[0]
      }else{
        return this.Period_Type[0] + "（等" + this.Period_Type.length + "项）"
      }
    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  // background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
}
.logo {
  margin-left: 70px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #F8FBFF;
  margin-left: 20px;
}
.quesCard{
  // border: 3px dashed black;
  background: #F8FBFF;
  border: 1px dashed black;
  margin-left: 5vw;
}
::v-deep.dev-md-content{
  img{
    max-width:80%
  }
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
// .focusDatabase{
//   background: #409EFF;
//   color: white;
//   border-radius: 15px;
//   margin: 0px 8px;
//   height: 30px;
//   line-height: 30px;
//
// }
// .unFocusDatabase{
//   background: #F8FBFF;
//   color: #409EFF;
//   border-radius: 15px;
//   border: 1px solid #409EFF;
//   margin: 0px 8px;
//   height: 30px;
//   line-height: 30px;
// }
.focusDatabase{
  background: #409EFF;
  color: white;
}
.unFocusDatabase{
  background: #F8FBFF;
  color: #409EFF;
  border: 1px solid #409EFF;
}
.focusDatabase,.unFocusDatabase{
  border-radius: 15px;
  padding: 0px 15px;
  height: 30px;
  line-height: 30px;
  float: left;
  text-align: center;/*让文字水平居中*/
}
</style>

<style scoped type="text/css">
/* .el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
} */
.img-list-item {
  position: relative;
  margin: auto;
  display: inline-block;
}
.img-list-item img {
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  vertical-align: middle;
  border: 0;
}
.img-list-item i.del-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  background: rgba(0, 0, 0, 0.1);
  background-image: url(./../../../assets/delete.jpeg);
  background-size: 10px;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
  top: 0;
  right: 0;
}
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:24px 0
}
</style>
<style scoped>
#tabs ::v-deep .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs ::v-deep .el-tabs__nav.is-top{
  border: none;
}
#tabs ::v-deep .el-tabs__header.is-top{
  border: none;
}
#tabs ::v-deep .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag ::v-deep .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #36a9df !important;
}

</style>
<style lang="scss" scoped>
.filterButtonUnfocus{
    height: 30px;
    line-height: 30px;
    border: 1px solid #409EFF;
    color: #409EFF;
    border-radius: 30px;
    margin-left: 8px;
    margin-right: 8px;
    box-sizing: border-box;
    cursor: pointer;
}
.filterButtonFocus{
    height: 30px;
    line-height: 30px;
    border: 1px solid #409EFF;
    color: white;
    border-radius: 30px;
    margin-left: 8px;
    margin-right: 8px;
    box-sizing: border-box;
    background: #409EFF;
    cursor: pointer;
}
.SearchInput{
  font-size: 16px;
  line-height: 28px;
  height: 28px
}
.SearchInput ::v-deep .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}

.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 32px;
  margin-top: 4px;
}
.FilterButton{
  padding-top: 12px;
}
.SearchArea{
  margin-left: 5vw;
  border: 1px solid Silver;
  width: 60%;
  border-radius: 18px;
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
.el-pagination {
    text-align: center;
}
</style>
<style scoped>
.pic {
  width: 600px;
  height: 400px;
  object-fit: cover;
}
.btn {
  display: flex;
  flex-direction: column;
}
.btn button {
  margin: 10px 0;
}
.btn_file {
  position: relative;
  min-height: 400px;
  width: 94%;
  background-color: #F8FBFF;
  border-radius: 20px;
  cursor: pointer;
}
.inputSp {
  position: absolute;
  top: 0;
  right: 0;
  height: 400px;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}
</style>
