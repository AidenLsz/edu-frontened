<template>
  <div style=" margin-top: 5vh; margin-bottom: 5vh;">
      <!-- 输入助手 -->
      <el-dialog
        :visible.sync="complexInput"
        title="LUNA输入助手"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="searchKeyword"></ComplexInput>
      <el-button type="success" plain @click="complexInput = false">完成输入</el-button>
    </el-dialog>
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
      <!-- 搜索框行 -->
    <el-row type="flex" justify="start" class="SearchArea">
      <!-- enter.native才能监听到组件化的事件，要注意一下 -->
        <el-col :span="21">
          <el-input class="SearchInput" v-model="searchKeyword" type="text" @keyup.enter.native="submit()">

          </el-input>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1">
          <el-button 
            type="text" 
            style="font-size: 22px; color: #409EFF; display: block; margin-left: -6px;" 
            size="small" 
            @click="complexInput = true">
            &Sigma;
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 22px; display: block; margin-left: -8px" size="small" @click="submit()">
            <i class="el-icon-search"></i>
          </el-button>
        </el-col>
    </el-row>
    <!-- 筛选行 - 题型 -->
    <el-row style="margin-left: 5vw; margin-top: 4vh; font-size: 16px;">
      <el-col :span="1">
          <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
              <label>题型：</label>
          </el-row>
      </el-col>
      <el-col :span="2" v-for="(typeName, typeIndex) in typeAim" :key="'type_' + typeIndex">
          <el-row type="flex" justify="center" :class="filterButtonStyle('type', typeIndex)" @click.native="type_Change(typeIndex)">
              <span>{{typeName}}</span>
          </el-row>
      </el-col>
    </el-row>
    <!-- 筛选行 - 难度 -->
    <el-row style="margin-left: 5vw; margin-top: 2vh; font-size: 16px;">
      <el-col :span="1">
          <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
              <label>难度：</label>
          </el-row>
      </el-col>
      <el-col :span="2" v-for="(difficulty, difficultyIndex) in difficultyAim" :key="'Diff_' + difficultyIndex">
          <el-row type="flex" justify="center" 
                  :class="filterButtonStyle('difficulty', difficultyIndex)" 
                  @click.native="difficulty_Change(difficultyIndex)">
              <span>{{difficulty}}</span>
          </el-row>
      </el-col>
      <el-col :span="2">
        <el-row :class="selfDiffGapClass()" @click.native="selfDiffGapInput()">
            自定义
        </el-row>
      </el-col> 
      <el-col :span="4" v-if="selfDiffGap">
          <el-row type="flex" justify="center">
              <el-input v-model="selfDiffGap_Min" class="selfDiffGapInput"></el-input>
              <span style="height: 30px; line-height: 30px">到</span>
              <el-input v-model="selfDiffGap_Max" class="selfDiffGapInput" style="margin-right: 8px;"></el-input>
              <el-button type="primary" size="mini" @click="selfDiffGapCheck()">确认</el-button>
          </el-row>
      </el-col>
    </el-row>
    <!-- 筛选行 - 题库 -->
    <el-row style="margin-left: 5vw; margin-top: 2vh; font-size: 16px;">
      <el-col :span="1">
          <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
              <label>题库：</label>
          </el-row>
      </el-col>
      <el-col :span="2" v-for="(databaseName, databaseIndex) in databaseAim" :key="'Database_' + databaseIndex">
          <el-row type="flex" justify="center" :class="filterButtonStyle('database', databaseIndex)" @click.native="database_Change(databaseIndex)">
              <span>{{databaseName == 'public' ? "公共题库" : databaseName}}</span>
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
              <span>综合排序</span>
          </el-row>
      </el-col>
    </el-row>
    <el-row
      v-for="(Question, Question_Index) in questionList"
      :key="Question_Index"
      style="margin-bottom: 50px"
      >
      <el-col :span="17" class="quesCard">
        <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px" >
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 15px">
            <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
              所属题库：{{Question.database}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem;">
              题型：{{Question.type}}
            </el-col>
            <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
              难度：
            </el-col>
            <el-col :span="4" :offset="2" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">查看答案与解析</el-button>
            </el-col>
            <el-col :span="3" style="line-height: 40px">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
            </el-col>
            <el-col :span="3" style="line-height: 40px; margin-left: 6px;">
              <el-button size="medium" plain round type="primary" @click="Add_To_Question_Cart(Question_Index)">加入试题篮</el-button>
            </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
          <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
          </el-col>
        </el-row>
        <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
          <el-col>
            <span style="margin-bottom: 20px; display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row
      v-if="questionList.length == 0"
      style="margin: 30px 5vw; height: 50vh; font-size: 30px;"
      v-loading="loading"
      element-loading-text="正在检索试题中..."
      element-loading-spinner="el-icon-loading">

    </el-row>
    <el-row v-if="questionList.length != 0">
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

import ComplexInput from '@/common/components/ComplexInput'

import {commonAjax} from '@/common/utils/ajax'
import Mathdown from '@/common/components/Mathdown'

import QuestionAnalyse from '@/views/resourceAnalyse/QuestionAnalyse'

export default {
  name: 'Keyword',
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
  components: {ComplexInput, Mathdown, QuestionAnalyse},
  data() {
    return {
        // 正在加载
        loading: false,
        // 刷新分析报告
        Refresh: false,
        // 打开分析报告
        analyseReport: false,
        // 分析数据
        analyseData: {},
        // 复杂输入框是否打开
        complexInput: false,
        // 检索的关键字，缓存的检索关键字，用于和新词进行比对
        searchKeyword: "",
        searchKwCache: "",
        // 页码
        Page_Index: 1,
        // 单页长度
        Page_Length: 5,
        // 能搜索到的题目数量
        Total_Count: -1,
        // 检索到的题目
        questionList: [],
        // 用于保存检索条件的Json
        filterRecord: {
            // 题型
            type: [false, false, false, false],
            // 难度
            difficulty: [0.0, 1.0],
            // 题库
            database: []
        },
        // 用于显示的题目类型
        typeAim: ['全部', '单选题', "多选题", "填空题", "解答题"],
        // 用于筛选的题目难度
        difficultyAim: ['全部', '容易', '较易', '中等', '较难', '困难'],
        // 用于筛选的数据库名
        databaseAim: [],
        // 自定义难度区间
        selfDiffGap: false,
        selfDiffGap_Min: "0.0",
        selfDiffGap_Max: "1.0",
        // 题目是否展开
        Expand_List: []
    }
  },
  watch:{

  },
  mounted() {
      this.initDatabaseList();
  },
  methods: {
      // 加入试题篮
      Add_To_Question_Cart(Question_Index){
        let Aim = this.questionList[Question_Index]
        let Question_Show_Infos = {
          type: "",
          score: 0,
          stem: "",
          options: [],
          answer: "",
          analyse: ""
        }
        if(['单选题', '多选题', '判断题'].indexOf(Aim.type) != -1){
          Question_Show_Infos.type = "选择题";
          Question_Show_Infos.score = 5;
        }else if(['简答题', '计算题'].indexOf(Aim.type) != -1){
          Question_Show_Infos.type = "解答题"
          Question_Show_Infos.score = 12;
        }else if(Aim.type == '填空题'){
          Question_Show_Infos.type = '填空题'
          Question_Show_Infos.score = 5;
        }

        Question_Show_Infos.options = Aim.options;
        Question_Show_Infos.stem = Aim.stem;
        Question_Show_Infos.answer = Aim.answer;
        Question_Show_Infos.analyse = Aim.analysis;
        
        this.$emit("Add_To_Cart", JSON.stringify(Question_Show_Infos));
      },
      // 页码变化搜索
    BackToTop(){
      this.submit();
      window.scrollTo(0,0);
    },
    // Update_Complex_Input
    UCI(val){
      this.searchKeyword = val;
    },
    // UCI_Images
    UCII(val){
      val
    },
    // 检索试题内容
    submit() {

        this.loading = true;

        if(this.searchKwCache != this.searchKeyword){
          this.Page_Index = 1;
        }

        this.searchKwCache = this.searchKeyword;

        let param={}

        let database = [];
        for(let i = 0 ; i < this.filterRecord.database.length; i++){
            if(this.filterRecord.database[i]){
                database.push(this.databaseAim[i+1])
            }
        }

        let type = [];
        for(let i = 0 ; i < this.filterRecord.type.length; i++){
            if(this.filterRecord.type[i]){
                type.push(this.typeAim[i+1])
            }
        }

        var data = JSON.stringify({
          "content": this.searchKeyword,
          "size": 5,
          "database": database,
          "page_count": this.Page_Index,
          "subject": [this.Subject],
          "period": [this.Period],
          "difficulty": this.filterRecord.difficulty,
          "type": type
        })

        // param.append("data", data);
        param.data=data

        commonAjax(this.backendIP+'/api/search', param)
        .then((data)=>{
            this.Expand_List = [];
            this.questionList = [];
            console.log(data.results)
            for(var i = 0; i < data.results.length; i++){
                this.questionList.push(data.results[i])
                this.Expand_List.push(false);
            }
            this.Total_Count = data.totalLength
            this.loading = false
        }).catch(() => {
            this.$message.error("服务器过忙，请稍后再试。")
            this.loading = false;
        })
    },
    // 获取用户所具有的题库权限
    initDatabaseList(){
        this.filterRecord.database = [true]
        this.databaseAim = ['全部', 'public']
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
                this.databaseAim.push(data[i])
            }
            
        })
    },
    // 根据不同选择的状况调整按钮样式
    filterButtonStyle(type, index){
        if(type == 'type'){
            if(index == 0){
                if(this.filterRecord.type.indexOf(true) == -1 || this.filterRecord.type.indexOf(false) == -1){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.type[index-1]){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }else if(type == "difficulty"){
            if(index > 0){
                if(this.filterRecord.difficulty[0] == ((index - 1) * 0.2).toFixed(1) && (this.filterRecord.difficulty[1] == (index * 0.2).toFixed(1))){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.difficulty[0] == 0.0 && this.filterRecord.difficulty[1] == 1.0){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }else if(type == "database"){
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
    type_Change(typeIndex){
        if(typeIndex > 0){
            this.filterRecord.type.splice(typeIndex - 1, 1, !this.filterRecord.type[typeIndex-1])
        }else{
            if(this.filterRecord.type.indexOf(false) == -1){
                this.filterRecord.type.splice(0, 4, false, false, false, false)
            }else{
                this.filterRecord.type.splice(0, 4, true, true, true, true)
            }
        }
    },
    // 小数计算，MD受不了了，这全是0.0000...01了
    Minus_Float(float1, float2){
        return parseFloat((float2 - float1).toFixed(1))
    },
    // 用按钮控制难度区间
    difficulty_Change(difficultyIndex){
        if(difficultyIndex > 0){
            this.filterRecord.difficulty.splice(0, 2, parseFloat("0." + (difficultyIndex - 1) * 2), parseFloat(((difficultyIndex * 0.2).toFixed(1))))
        }else{
            this.filterRecord.difficulty.splice(0, 2, 0.0, 1.0)
        }
    },
    // 获取难度手动输入按钮的样式
    selfDiffGapClass(){
        if(this.filterRecord.difficulty[0] == 0.0 && this.filterRecord.difficulty[1] == 1.0){
            return "filterButtonUnfocus"
        }else if(
            this.Minus_Float(this.filterRecord.difficulty[0], this.filterRecord.difficulty[1]) == 0.2 &&
            [0, 0.2, 0.4, 0.6, 0.8, 1.0].indexOf(this.filterRecord.difficulty[0]) != -1)
        {
            return "filterButtonUnfocus"
        }else{
            return "filterButtonFocus"
        }
    },
    // 手动输入难度自定义区间
    selfDiffGapInput(){
        this.selfDiffGap_Min = this.filterRecord.difficulty[0];
        this.selfDiffGap_Max = this.filterRecord.difficulty[1];
        this.selfDiffGap = true;
    },
    // 更新自定义难度区间
    selfDiffGapCheck(){
        let min = 0.0;
        let max = 1.0;
        min = parseFloat(this.selfDiffGap_Min);
        max = parseFloat(this.selfDiffGap_Max);
        if(isNaN(min) || isNaN(max) || min + "" != this.selfDiffGap_Min || max + "" != this.selfDiffGap_Max){
            this.$message.error("请正确输入数字！")
            return 
        }
        if(min > max) {
            this.$message.error("请将难度下限输入左侧，上限输入右侧。")
            return
        }
        if(min < 0 || min > 1 || max < 0 || max > 1){
            this.$message.error("难度范围在 0.0 到 1.0 之间")
            return
        }
        this.selfDiffGap_Min = parseFloat(this.selfDiffGap_Min);
        this.selfDiffGap_Max = parseFloat(this.selfDiffGap_Max);
        this.filterRecord.difficulty.splice(0, 2, this.selfDiffGap_Min, this.selfDiffGap_Max);
        this.$message.success("搜索难度区间已更新至 " + this.filterRecord.difficulty[0] + " 至 " + this.filterRecord.difficulty[1]);
        this.selfDiffGap = false;
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
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 修改是否展开
    Expand(Index){
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index]);
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
        this.Refresh = !this.Refresh;
        this.analyseData = data.que_dic;
        this.analyseReport = true;
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.SearchArea{
  margin-left: 5vw;
  border: 1px solid Silver;
  width: 60%;
  border-radius: 18px;
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
.SearchInput{
  font-size: 16px;
  line-height: 28px;
  height: 28px
}
.SearchInput /deep/ .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}
.selfDiffGapInput{
  font-size: 16px;
}
.selfDiffGapInput /deep/ .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 45px;
  padding: 0px;
  text-align: center;
  border-radius: 0px;   
  background: transparent;
}
.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 34px;
  margin-top: 4px;
}
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
.quesCard{
  // border: 3px dashed black;
  background: #F8FBFF;
  border: 1px dashed black;
  margin-left: 5vw;
}
</style>