<template>
  <div
    class="exercise"
    v-loading="Question_Analysing"
    element-loading-text="正在加载分析报告..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.6)">
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
    <el-row
      v-for="(Question, Question_Index) in question_list"
      :key="Question_Index"
      style="margin: 25px"
      >
      <el-col :span="24" class="quesCard">
        <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
          <el-col style="padding-bottom: 15px" >
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
          </el-col>
          <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
          </el-col>
        </el-row>
        <el-row display="flex" style="margin-bottom: 15px">
          <el-col class="text" :span="12">
            <div>
              所属题库：{{Question.database}}
            </div>
            <div>
              学科：{{Question.subject}}
            </div>
            <div style="display:None">
              题型：{{Question.type}}
            </div>
            <div >
              学段：{{Question.period}}
            </div>
          </el-col>
          <el-col :span="12">
            <div class="btn">
              <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">查看答案与解析</el-button>
            </div>
            <div class="btn">
              <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
            </div>
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
      v-if="question_list.length == 0"
      style="margin: auto;height:100vh; font-size: 30px"
      v-loading="loading"
      element-loading-text="加载中，请等待"
      element-loading-spinner="el-icon-loading">

    </el-row>
    <el-row v-if="question_list.length != 0">
      <el-pagination
        @current-change="FlipPage"
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
import Mathdown from "@/common/components/Mathdown.vue";
import QuestionAnalyse from "../../../resourceAnalyse/QuestionAnalyse.vue"
import {commonAjax} from '@/common/utils/ajax'
import md5 from 'js-md5';

export default {
  components: { Mathdown, QuestionAnalyse },
  name: "exercise",
  data() {
    return {
      // 用于之后进行图片搜索类型筛选的变量
      Refresh: false,
      // 存放返回的题目内容
      question_list: [],
      // 存放学科信息
      subject_name: [],
      // 存放题型信息
      question_type: [],
      // 存放将要查询的数据库名称
      // 检测是否要展开答案和解析内容
      Expand_List: [],
      // 页码
      Page_Index: 1,
      // 单页长度
      Page_Length: 5,
      // 能搜索到的题目数量
      Total_Count: -1,
      // loading
      loading: false,
      // 学科和学段
      Subject_Type: [],
      Period_Type: [],
      // 题型及历史题型
      Search_Ques_Type: [],
      // 上次选择的学科和学段
      history_Subject_Type: [],
      history_Period_Type: [],
      // 分析报告页是否显示
      analyseReport: false,
      // 是否正在返回分析报告
      Question_Analysing: false,
      // 暂存的图片内容
      Cache_Pic: [""],
      lastParam:null,
      //用于缓存图片检索后的查询结果
      Cache_Result:{},
      // 用于分析显示的题目数据
      analyseData: {
                "analysis": "\u5982\u56fe\uff0c\u505a\u51fa\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\u6240\u8868\u793a\u7684\u53ef\u884c\u57df\u3002\u6613\u5f97A\u7684\u5750\u6807\u4e3a$A(1,0)$\u3002\u5f53\u76ee\u6807\u51fd\u6570\u7ecf\u8fc7A\u70b9\u65f6\uff0cz\u53d6\u5f97\u6700\u5927\u503c\uff0c\u53ef\u5f97$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$1+7 \\times 0=1$",
                "answer": "1",
                "database": "公开题库",
                "id": "96ac6512-8aed-11eb-8fbd-b46bfc50aa29",
                "options": [],
                "period": "高中",
                "stem": "若$x,y$满足约束条件$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$，则$z=x+7 y$的最大值为$\\underline{}$",
                "subject": "数学",
                "type": "Question",
                "que_type": "其他",
                "difficulty": 0.2,
                "discrimination": 0.3,

                "quality": 0.6,
                "knowledge_points_frontend": {
                    "kp": [
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                        "\u4ee3\u6570",
                        "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                        "\u4e0d\u7b49\u5f0f"
                    ],
                    "kp_layer": [
                        {
                        "children": [
                            {
                            "children": [
                                {
                                "children": [
                                    {
                                    "children": [],
                                    "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898"
                                    },
                                    {
                                    "children": [],
                                    "label": "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                                    }
                                ],
                                "label": "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212"
                                }
                            ],
                            "label": "\u4e0d\u7b49\u5f0f"
                            }
                        ],
                        "label": "\u4ee3\u6570"
                        }
                    ],
                    "kp_priority": [
                            "\u4ee3\u6570",
                            "\u4e0d\u7b49\u5f0f",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212",
                            "\u7b80\u5355\u7684\u7ebf\u6027\u89c4\u5212\u95ee\u9898",
                            "\u4e8c\u5143\u4e00\u6b21\u4e0d\u7b49\u5f0f\uff08\u7ec4\uff09\u8868\u793a\u7684\u5e73\u9762\u533a\u57df"
                    ]
                    },
                }
    };
  },
  mounted(){
    this.ToTop()
  },
  methods: {
    search(imgUrl,databaselist,subject,period){
      this.Page_Index=1
      this.submit(1, imgUrl,databaselist,subject,period);
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
    ToTop(){
      window.scrollTo(0,0);
    },
    FlipPage(){
      this.submit(1, this.Cache_Pic[0]);
    },
    // 修改翻页内容
    Get_Question_Bundle(Page_Index){
      if(Page_Index * 5 > this.question_list.length){
        return this.question_list.slice((Page_Index - 1)*5)
      }else {
        return this.question_list.slice((Page_Index - 1)*5, Page_Index * 5)
      }
    },
    // 修改是否展开
    Expand(Index){
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index]);
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
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
    submit(type, Pic = "",database_list,subject,period) {
      window.scrollTo(0,0);
      let param={}
      if(!Pic){
        //仅翻页 参数不变
        param=this.lastParam
        let data=JSON.parse(param.data)
        Pic=param.pic
        // console.log('Pic',this.pic);
        data.page_count=this.Page_Index;
        param.data=JSON.stringify(data)
      }else{
        //搜索参数改变
        param.pic=Pic
        var data = JSON.stringify({
          "size": 5,
          "database": database_list,
          "page_count": this.Page_Index,
          "subject": subject,
          "period": period,
          "type": this.Search_Ques_Type,
          "difficulty": [0.0, 1.0]
        })
        param.data=data
      }
      // 更新最近一次进行搜索的参数
      this.lastParam=param;
      //检查缓存中是否存在搜索结果
      // let encodedKey=md5(JSON.stringify(Pic+this.Page_Index));
      let encodedKey=md5(JSON.stringify(param));
      if(this.Cache_Result[encodedKey]){
        this.handleResData(this.Cache_Result[encodedKey])
        return;
      }

      this.loading = true;
      this.question_list = [];
      commonAjax(this.backendIP+'/api/search',param)
      .then((data)=>{
        this.Cache_Result[encodedKey]=data
        this.handleResData(data)
      })
    },
    handleResData(data){
      this.loading = false;
      this.Expand_List = [];
      this.question_list = [];
      var quess = data.results;
      for(var i = 0; i < quess.length; i++){
        this.question_list.push(quess[i])
        this.Expand_List.push(false);
      }
      this.Total_Count = data.totalLength
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
    },
    Get_Search_Ques_Type(){
      if(this.Search_Ques_Type.length == 0){
        return "选择题型"
      }else if(this.Search_Ques_Type.length == 1){
        return this.Search_Ques_Type[0]
      }else{
        return this.Search_Ques_Type[0] + "（等" + this.Search_Ques_Type.length + "项）"
      }
    }
  }
};
</script>

<style scoped lang="scss">
.text{
  line-height: 30px;
  color: #888;
  font-size: 1.5rem;
  padding-left: 30px;
  text-align: left
}
.btn{
  line-height: 30px;
  margin-bottom: 10px;
}
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
}
/deep/.dev-md-content{
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
// }
// .unFocusDatabase{
//   background: #F8FBFF;
//   color: #409EFF;
//   border: 1px solid #409EFF;
// }
// .focusDatabase,.unFocusDatabase{
//   border-radius: 15px;
//   padding: 0px 15px;
//   height: 30px;
//   line-height: 30px;
//   float: left;
//   text-align: center;/*让文字水平居中*/
// }
</style>

<style scoped type="text/css">
.el-divider--horizontal{
  display:block;
  height:3px;
  width:100%;
  margin:24px 0
}
</style>
<style scoped>
#tabs /deep/ .el-tabs__item {
  color: #36a9df;
  font-weight: 900;
  border-radius: 10px;
  border-color: #36a9df;
}
#tabs /deep/ .el-tabs__nav.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__header.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__item.is-active {
  background-color: #36a9df;
  color: #fff;
  font-weight: 900;
  border-color: #36a9df;
}
#tag /deep/ .el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #36a9df !important;
}

</style>
<style lang="scss" scoped>

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

.el-pagination {
    text-align: center;
}
</style>
