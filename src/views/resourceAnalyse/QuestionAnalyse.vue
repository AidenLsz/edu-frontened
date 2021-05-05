<!-- 作为递归自身的节点 -->
<template>
  <div style="margin: 0px 11.5vw 10px 11.5vw">
      <el-row style="padding-top: 15px">
          <label style="font-size: 2rem">试题分析报告</label>
      </el-row>
      <el-row>
          <el-divider></el-divider>
      </el-row>  
      <el-row>
        <el-col class="Ques_Card" :span="24" v-if="Question.type == 'PackedQues'" type="flex" justify="start">
            <el-row type="flex" justify="start" style="margin-bottom: 10px">
                <label v-if="Analyse">（ 此题{{Question.score}}分 ）</label>
                <label v-else>（ 本节{{Question.score}}分 ）</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin: 10px 0px">
                <Mathdown :content="Question.desc" :name="'Q_Desc_'"></Mathdown>
            </el-row>
            <el-row v-if="All_Question_Show" style="min-height: 200px">
                <PaperAnalysePackedQuestion :PackedQuestion="Question.sub_question" :Sub_Index="Index" :Name_P="'P_' + Index"  :Analyse="false" style="width: 100%"></PaperAnalysePackedQuestion>
            </el-row>
            <el-row v-if="All_Question_Show" type="flex" justify="center" style="font-size: 50px; color: #409EFF; cursor: pointer"  @click.native="Change_AQS()">
                <i class="el-icon-arrow-up"></i>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 10px; position: relative; height: 250px; overflow: hidden;" v-if="!All_Question_Show">
                <div class="Hidden_Ques" ref="OverFlow_DIV" >
                    <PaperAnalysePackedQuestion :PackedQuestion="Question.sub_question" :Sub_Index="Index" :Name_P="'P_' + Index"  :Analyse="false" style="width: 100%"></PaperAnalysePackedQuestion>
                </div>
                <div :class="Get_Display()" @click="Change_AQS()" v-if="Overflow_Flag">
                    <el-row type="flex" justify="center" style="font-size: 50px; color: #409EFF;"><i class="el-icon-arrow-down"></i></el-row>
                </div>
            </el-row>
        </el-col>
        <el-col class="Ques_Card" :span="24" v-else>
            <el-row type="flex" justify="start" style="margin-bottom: 10px" v-if="Question.score">
                <label>（ 小题{{Question.score}}分 ）</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 10px; min-height: 200px" v-if="All_Question_Show">
                <PaperAnalyseQuestion :Question="Question" style="width: 100%"></PaperAnalyseQuestion>
            </el-row>
            <el-row v-if="All_Question_Show" type="flex" justify="center" class="Up_Arrow"  @click.native="Change_AQS()">
                <i class="el-icon-arrow-up"></i>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 10px; position: relative; height: 250px; overflow: hidden;" v-if="!All_Question_Show">
                <div class="Hidden_Ques" ref="OverFlow_DIV">
                    <PaperAnalyseQuestion :Question="Question" style="width: 100%"></PaperAnalyseQuestion>
                </div>
                <div :class="Get_Display()" @click="Change_AQS()" v-if="Overflow_Flag">
                    <el-row type="flex" justify="center" style="font-size: 50px; color: #409EFF;"><i class="el-icon-arrow-down"></i></el-row>
                </div>
            </el-row>
            
        </el-col>
        <el-row v-if="Expand_Ana">
            <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                <el-col :span="12" style="text-align: left">
                    基本信息
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px; margin-top: 20px">
                <el-col>
                    <!-- 属性分析表格 -->
                    <!-- <el-row type="flex" justify="start" style="margin: 10px 0px 10px 0px">
                        <label>此题难度等属性分析如下：</label>
                    </el-row> -->
                    <el-row style="width: 100%">
                        <!-- 第一行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_0">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                <label>此题难度</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span v-if="Question.difficulty">{{Question.difficulty}}</span>
                                    <span v-else>{{Question.difficulty_statistics.mean}}</span>
                                    
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第二行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_1">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                <label style="text-align: left">考察知识点</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row v-for="(item, index) in Question.knowledge_points_frontend.kp" :key="index" type="flex" justify="start">
                                <el-tag style="background: transparent; color: black" effect="plain" class="kp_tag">
                                    <el-badge 
                                        :hidden="Question.knowledge_points_frontend.kp_priority.indexOf(item) == -1" 
                                        :value="Question.knowledge_points_frontend.kp_priority.indexOf(item) + 1" 
                                        class="kp_badge"
                                        type="primary">
                                    {{ item }}
                                    </el-badge>
                                </el-tag>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第三行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_0">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">区分度</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.discrimination}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第四行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_1">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">试题来源</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.database}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第五行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_0">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">试题题型</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.que_type}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第六行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_1">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">适用学段</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.period}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第七行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_0">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">试题学科</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.subject}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第八行 -->
                        <el-row style="width: 66.7%" class="Table_Unit_1">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">试题质量</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">{{Question.quality}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-row>
                    <!-- 树状结构 -->
                    <el-row type="flex" justify="start" style="margin: 25px 0px 10px 0px">
                        <label>此题包含的知识树状结构为：</label>
                    </el-row>
                    <el-row type="flex" justify="start" class="Ques_Card" style="min-height: 0px; padding-bottom: 20px">
                        <el-tree 
                            :default-expand-all="true"
                            style="background: transparent" 
                            :data="Question.knowledge_points_frontend.kp_layer" 
                            :props="defaultProps"></el-tree>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                <el-col :span="12" style="text-align: left">
                    相似试题
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px; margin-top: 20px">
                <el-col :span="12">
                    <el-row type="flex" justify="start" style="line-height: 30px;">
                        <label>按当前相关性依据排序的情况下，与本题关联程度较高的&nbsp;&nbsp;{{Similar_Question_List.length}}&nbsp;&nbsp;道试题如下：</label>
                    </el-row>
                </el-col>
                <el-col :span="12">
                    <el-row type="flex" justify="end" style="height: 30px; line-height: 30px;">
                        <label style="margin-right: 15px">相关性依据：</label>
                        <el-select v-model="Sort_By" placeholder="请选择" size="mini">
                            <el-option
                                v-for="item in Sort_Condition"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                                style="font-size: 12px">
                            </el-option>
                        </el-select>
                    </el-row>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px; margin-top: 20px" v-for="(Ques, Ques_Index) in Similar_Question_List" :key="'Similar_Ques_' + Ques_Index">
                <label>{{Ques}}</label>
            </el-row>
        </el-row>
    </el-row>
  </div>
</template>
 
<script>

import PaperAnalyseQuestion from "./components/PaperAnalyseQuestion.vue";
import PaperAnalysePackedQuestion from './components/PaperAnalysePackedQues.vue'
import Mathdown from "../../common/components/Mathdown.vue"

export default {
  name: "QuestionAnalyse",
  props: {
    Question: {
        type: Object,
        default: function(){
            return {
                "analysis": "\u5982\u56fe\uff0c\u505a\u51fa\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\u6240\u8868\u793a\u7684\u53ef\u884c\u57df\u3002\u6613\u5f97A\u7684\u5750\u6807\u4e3a$A(1,0)$\u3002\u5f53\u76ee\u6807\u51fd\u6570\u7ecf\u8fc7A\u70b9\u65f6\uff0cz\u53d6\u5f97\u6700\u5927\u503c\uff0c\u53ef\u5f97$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$1+7 \\times 0=1$", 
                "answer": "1", 
                "database": "\u516c\u5f00\u9898\u5e93", 
                "id": "96ac6512-8aed-11eb-8fbd-b46bfc50aa29", 
                "options": [], 
                "period": "\u5927\u5b66", 
                "stem": "\u82e5$x,y$\u6ee1\u8db3\u7ea6\u675f\u6761\u4ef6$\\left\\{\\begin{array}{c}2 x+y-2 \\leq 0 \\ x-y-1 \\geq 0 \\ y+1 \\geq 0\\end{array}\\right.$\uff0c\u5219$z=x+7 y$\u7684\u6700\u5927\u503c\u4e3a$\\underline{}$", 
                "subject": "数学", 
                "type": "Question",
                "que_type": "\u5176\u4ed6",
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
        }
    },
    Analyse: {
      type: Boolean,
      default: true
    },
    Index: {
      type: Number,
      default: -1
    },
    Name_P: {
      type: String,
      default: ""
    },
  },
  components: {
      PaperAnalyseQuestion,
      PaperAnalysePackedQuestion,
      Mathdown
  },
  created(){
    this.Init();
  },
  mounted(){
        this.Search_Similar_Questions();
        this.$nextTick(function(){	
            let height = this.$refs.OverFlow_DIV.clientHeight;
            if(height > 250){
                this.Overflow_Flag = true;
            }	else{
                this.Overflow_Flag = false;
            }
        })

  },
  data(){
    return {
        // 展开试题分析的部分
      Expand_Ana: true,
      defaultProps: {
        label: "label",
        children: "children"
      },
      // 是否显示全部的题目文本
      All_Question_Show: false,
      Similar_Question_List: [],
      Sort_Condition: [
            {
                'value': 'default',
                'label': '综合排序'
            },{
                'value': 'kp',
                'label': '知识点'
            },{
                'value': 'keyword',
                'label': '关键字'
            },],
        Sort_By: 'default',
        Overflow_Flag: true, 
    }         
  },
  methods: {
    Init(){
      window.scrollTo(0,0);
    },
    Get_Class(Analyse){
      if(Analyse){
        return "Analyse_Area"
      }else{
        return ""
      }
    },
    // 改变是否展开题目
    Change_AQS(){
        this.All_Question_Show = !this.All_Question_Show;
    },
    // 搜索相近题目
    Search_Similar_Questions(){
        this.Similar_Question_List = ["1", "2", "3", "4", "5"]
    },
    // 判断是否显示
    Get_Display(){
        if(this.Overflow_Flag){
            return 'Hidden_Shadow'
        }else{
            return 'Hidden'
        }
    }
  }
};
</script>
<style scoped>
.Analyse_Area{
  background: #F8FBFF;
  border-radius: 15px;
  -webkit-box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
  box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
  margin-bottom: 30px;
  padding: 10px 20px
}
.Part_Row_Style_Expand{
    border-left: 15px solid #409EFD; 
    background: 	transparent; 
    width: 100%; 
    padding-left: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    margin: 20px 0px 10px 0px;
    padding-top: 5px;
    padding-bottom: 5px;
}
.kp_badge {
  padding-right: 8px;
  background: transparent;
}
.kp_tag {
  margin-top: 8px;
  border: hidden;
  background: transparent;
  color: white;
  font-size: 13px
}
.Table_Unit_0{
   border: 1px solid #ECECEC; 
   padding-left: 10px; 
   background: #F8FBFF;
   box-sizing:border-box;
}
.Table_Unit_1{
   border: 1px solid #ECECEC; 
   padding-left: 10px; 
   background: white;
   box-sizing:border-box;
}
.el-divider--horizontal{
  display:block;
  height:2px;
  width:100%;
  margin:24px 0
}
.Hidden_Ques{
    position: absolute;
    top: 0px;
    z-index: 1;  
    min-height: 250px;
    overflow: hidden;
}
.Hidden_Shadow{
    position: absolute;
    top: 200px;
    width: 100%;
    height: 50px;
    cursor: pointer;
    background-image: linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 1)); 
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    z-index: 2;   
}
.Hidden{
    display: none;
}
.Up_Arrow{
    font-size: 50px; 
    color: #409EFF; 
    cursor: pointer;
    z-index: 3;
}
.Ques_Card{
    background: white;
    border-radius: 15px;
    padding: 30px 30px 0px 30px;
    min-height: 290px;
    margin: 15px 0px 30px 0px;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
}
</style>