<!-- 作为递归自身的节点 -->
<template>
    <div 
        style="margin: 0px 20px 10px 20px" 
        ref="QuestionInfo"
        v-loading="loading"
        element-loading-text="正在加载分析报告..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.28)"
        >
        <el-row style="padding-top: 15px" id="Analyse_Title">
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
                    <div :class="Get_Display()" @click="Change_AQS()">
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
                <el-row v-if="All_Question_Show && !Init_AQS" type="flex" justify="center" class="Up_Arrow"  @click.native="Change_AQS()">
                    <i class="el-icon-arrow-up"></i>
                </el-row>
                <el-row type="flex" justify="start" style="margin-bottom: 10px; position: relative; height: 250px; overflow: hidden;" v-if="!All_Question_Show">
                    <el-col>
                        <div class="Hidden_Ques" ref="OverFlow_DIV">
                            <PaperAnalyseQuestion :Question="Question" style="width: 100%"></PaperAnalyseQuestion>
                        </div>
                        <div :class="Get_Display()" @click="Change_AQS()" v-if="!Init_AQS">
                            <el-row type="flex" justify="center" style="font-size: 50px; color: #409EFF;"><i class="el-icon-arrow-down"></i></el-row>
                        </div>
                    </el-col>
                </el-row>
                
            </el-col>
            <el-row v-if="Expand_Ana">
                <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(0)" :class="Get_Part_Row_Style(0)">
                    <el-col :span="12" style="text-align: left; line-height: 30px">
                        <el-row type="flex" justify="start">
                            <i class="el-icon-arrow-up" v-if="Part_Expand[0]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                            <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                            基础信息
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="padding-left: 45px; margin-top: 20px; margin-bottom: 20px" :class="Get_Expand_Or_Collapse(0)">
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
                            <!-- 第十一行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_1">
                                <!-- 左列 -->
                                <el-col :span="6" style="padding-top: 8px;">
                                    <el-row type="flex" justify="start">
                                        <label style="text-align: left">考察章节</label>
                                    </el-row>
                                </el-col>
                                <!-- 右列 -->
                                <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                    <el-row type="flex" justify="start">
                                        <span style="text-align: left">{{Question.chapter}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 第二行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_0">
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
                                        {{ item }}
                                    </el-tag>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 第三行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_1">
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
                            <el-row style="width: 66.7%" class="Table_Unit_0">
                                <!-- 左列 -->
                                <el-col :span="6" style="padding-top: 8px;">
                                    <el-row type="flex" justify="start">
                                        <label style="text-align: left">试题来源</label>
                                    </el-row>
                                </el-col>
                                <!-- 右列 -->
                                <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                    <el-row type="flex" justify="start">
                                        <span style="text-align: left">{{Question.pastpaper}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 第五行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_1">
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
                            <el-row style="width: 66.7%" class="Table_Unit_0">
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
                            <el-row style="width: 66.7%" class="Table_Unit_1">
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
                            <el-row style="width: 66.7%; display: none" class="Table_Unit_1">
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
                            <!-- 第九行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_0">
                                <!-- 左列 -->
                                <el-col :span="6" style="padding-top: 8px;">
                                    <el-row type="flex" justify="start">
                                        <label style="text-align: left">信度</label>
                                    </el-row>
                                </el-col>
                                <!-- 右列 -->
                                <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                    <el-row type="flex" justify="start">
                                        <span style="text-align: left">{{Question.rel}}</span>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <!-- 第十行 -->
                            <el-row style="width: 66.7%" class="Table_Unit_1">
                                <!-- 左列 -->
                                <el-col :span="6" style="padding-top: 8px;">
                                    <el-row type="flex" justify="start">
                                        <label style="text-align: left">素养考核</label>
                                    </el-row>
                                </el-col>
                                <!-- 右列 -->
                                <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                    <el-row type="flex" justify="start">
                                        <span style="text-align: left">{{Question.literacy}}</span>
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
                <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse(0)" style="margin-top: -10px; margin-bottom: 30px">
                    <el-button v-on:click.native="Expand_Or_Collapse(0)" round size="small" plain>收起</el-button>
                </el-row>
                <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(1)" :class="Get_Part_Row_Style(1)">
                    <el-col :span="12" style="text-align: left; line-height: 30px">
                        <el-row type="flex" justify="start">
                            <i class="el-icon-arrow-up" v-if="Part_Expand[1]" style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                            <i class="el-icon-arrow-down" v-else style="font-size: 24px; line-height: 30px; margin-right: 20px"></i>
                            相似试题
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="padding-left: 45px; margin-top: 20px; margin-bottom: 30px" :class="Get_Expand_Or_Collapse(1)">
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
                <el-row 
                    v-for="(Question, Question_Index) in Similar_Question_List" 
                    :key="Question_Index"
                    :class="Get_Expand_Or_Collapse(1) + ' Question_Card'"
                    >
                    <SearchQuestionItem 
                        :Question="Question" 
                        :Question_Index="Question_Index"
                        @Check_Question_Analysis="Check_Question_Analysis"></SearchQuestionItem>
                </el-row>
                <el-row 
                    v-if="Similar_Question_List.length == 0" 
                    style="margin: 50px 60px; height: 44vh; font-size: 30px"
                    v-loading="loading"
                    element-loading-text="加载中，请等待"
                    element-loading-spinner="el-icon-loading">
                    
                </el-row>
                <el-row type="flex" justify="center" :class="Get_Expand_Or_Collapse(1)" style="margin-top: -36px; margin-bottom: 10px">
                    <el-button v-on:click.native="Expand_Or_Collapse(1)" round size="small" plain>收起</el-button>
                </el-row>
            </el-row>
        </el-row>
    </div>
</template>
 
<script>

import PaperAnalyseQuestion from "@/views/resourceAnalyse/components/PaperAnalyseQuestion.vue";
import PaperAnalysePackedQuestion from '@/views/resourceAnalyse/components/PaperAnalysePackedQues'
import Mathdown from '@/common/components/Mathdown'

import SearchQuestionItem from '@/views/resourceQuery/components/SearchQuestionItem'

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import {commonAjax} from '@/common/utils/ajax'

var PDF = new jsPDF('', 'pt', 'a4');

export default {
  name: "QuestionAnalyse",
  props: {
    Ques: {
        type: Object,
        default: function(){
            return {
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
      Mathdown,
      SearchQuestionItem
  },
  created(){
    this.Init();
  },
  mounted(){

        this.$nextTick(function(){	

            const _this = this;

            var pro = new Promise(function(resolve, reject){
                _this.All_Question_Show = true;
                let height = _this.$refs.OverFlow_DIV.offsetHeight;
                if(height > 250){
                    resolve("1")
                }else{
                    reject("1")
                }
            });
            pro.then(function(){
                _this.All_Question_Show = false;
            }).catch(function(){
                _this.All_Question_Show = true;
                _this.Init_AQS = true;
            })
        })

        setTimeout(()=>{
            this.Search_Similar_Questions();
        }, 100)
  },
  data(){
    return {
        // 是否正在转换PDF或加载中
        loading: false,
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
        Question: this.Ques,
        Part_Expand: [true, false],
        // 这道题是不是由于默认高度过低而直接展示全部
        Init_AQS: false
    }         
  },
  methods: {
        // 展开下级展示区域
        Expand_Or_Collapse(index){
            this.Part_Expand.splice(index, 1, !this.Part_Expand[index])
        },
        // 修改下级展示区域的Style
        Get_Expand_Or_Collapse(index){
            if(!this.Part_Expand[index])
                return "Hidden"
            return ""
        },
        // 返回功能条的样式
        Get_Part_Row_Style(index){
            if(this.Part_Expand[index])
                return "Part_Row_Style_Expand"
            return "Part_Row_Style_Collapse"
        },
    Init(){
        document.getElementById('Analyse_Title').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
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

        let param = {};

        var database_list = ['public'];

        var content = ""

        if(this.Question.desc){
            content = this.Question.desc;
        }else{
            content = this.Question.stem
        }

        let subject_list = [this.Question.subject]
        let period_list = [this.Question.period]

        var data = JSON.stringify({
            "content": content,
            "size": 6,
            "database": database_list,
            "page_count": 1,
            "subject": subject_list,
            "period": period_list,
            "difficulty": [0, 1],
            "semantic": 0
        })

        param.data = data

        commonAjax(this.backendIP+'/api/search', param)
        .then((data)=>{
            this.Similar_Question_List = [];
            var quess = data.results;
            for(var i = 1; i < quess.length; i++){
                this.Similar_Question_List.push(quess[i])
            }
            this.loading = false;
            this.Init();
        })

    },
    // 判断是否显示
    Get_Display(){
        if(!this.All_Question_Show){
            return 'Hidden_Shadow'
        }else{
            return 'Hidden'
        }
    },
    // 获取点击后的信息
    Check_Question_Analysis(val){
        let Ques_Info = JSON.parse(val)
        this.Check_Analyse(Ques_Info.ID, Ques_Info.DatabaseName)
    },
    // 查看单题分析报告
    Check_Analyse(ID, DatabaseName){

    this.loading = true;

      let config = {
          headers: { "Content-Type": "multipart/form-data" }
      };

      let param = new FormData();

      if(DatabaseName == '公开题库'){
        param.append("databasename", 'public');
      }else if(DatabaseName == 'neea'){
        param.append("databasename", 'neea');
      }else if(DatabaseName == 'iflytek'){
        param.append("databasename", 'iflytek');
      }
      param.append("ID", ID);

      this.$http
      .post(this.backendIP + "/api/questionAnalyse", param, config, {
        emulateJSON: true
      })
      .then(function(data) {
        this.Question = data.data.que_dic;
        this.Search_Similar_Questions();
      });    

      this.$nextTick(function(){
            const _this = this;

            var pro = new Promise(function(resolve, reject){
                _this.All_Question_Show = true;
                let height = _this.$refs.OverFlow_DIV.offsetHeight;
                if(height > 250){
                    resolve("1")
                }else{
                    reject("1")
                }
            });
            pro.then(function(){
                _this.All_Question_Show = false;
            }).catch(function(){
                _this.All_Question_Show = true;
                _this.Init_AQS = true;
            })
        })
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    PDF_Switch(){
        window.scrollTo(0, 0);
        this.Part_Expand = [true, true];
        // this.loading = true;
        // this.PDF_Download("Paper_Title");
        // this.PDF_Download("Paper_Total");
        // this.PDF_Download("Paper_Analyse");
        // this.PDF_Download("Paper_Similarity");
        // this.PDF_Download("Paper_Detail");
        this.PDF_Download("QuestionInfo");
        
    },
    // 下载PDF格式的分析报告
    PDF_Download(part){

        if(this.Part_Expand.indexOf(false) != -1){
            this.Part_Expand = [true, true, true, true];
        }
        setTimeout(()=>{
            html2canvas(this.$refs[part]).then(

                canvas => {

                    var contentWidth = canvas.width;
                    var contentHeight = canvas.height;

                    var pageHeight = contentWidth / 592.28 * 841.89;
                    var leftHeight = contentHeight;

                    var position = 0;

                    var imgWidth = 595.28;
                    var imgHeight = 592.28/contentWidth * contentHeight;

                    var pageData = canvas.toDataURL('image/jpeg', 1.0);

                    if (leftHeight < pageHeight) {
                        PDF.addImage(pageData, 'JPEG', 0, 20, imgWidth, imgHeight );
                    } else {
                        while(leftHeight > 0) {
                            PDF.addImage(pageData, 'JPEG', 0, position + 20, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            //避免添加空白页
                            if(leftHeight > 0) {
                                PDF.addPage();
                            }
                        }
                    }
                    if(part == "QuestionInfo"){
                        PDF.save("Question_Analyse_Report_" + this.Question.id + ".pdf")
                        PDF = new jsPDF('', 'pt', 'a4');
                        // this.loading = false;
                    }else{
                        PDF.addPage();
                    }
                    return
                }
            )
        }, 1)     
    },
  }
};
</script>
<style lang='scss' scoped>
.Analyse_Area{
  background: #F8FBFF;
  border-radius: 15px;
  -webkit-box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
  box-shadow: 8px 10px 12px rgba(25, 25, 25, 0.1);
  margin-bottom: 30px;
  padding: 10px 20px
}
.Part_Row_Style_Collapse{
    border-left: 15px solid #409EFD; 
    background: 	#F8FBFF; 
    padding-left: 30px;
    margin-bottom: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
.Part_Row_Style_Expand{
    border-left: 15px solid #409EFD; 
    background: 	white; 
    padding-left: 30px;
    font-size: 1.5rem;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
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
    width: 100%;
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
/* 题目内容的卡片 */
.Ques_Card{
    background: white;
    border-radius: 15px;
    padding: 30px 30px 0px 30px;
    min-height: 290px;
    margin: 15px 0px 30px 0px;
    box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
}

.Question_Card{
    background: white;
    box-shadow: 0px 6px 24px rgba($color: #000, $alpha: 0.12);
    margin: 64px 0;
    border-radius: 10px;
    opacity: 0.95;
}

/* 相似题目的卡片 */
.quesCard{
  background: #F8FBFF; 
  border: 1px dashed black;
}
</style>