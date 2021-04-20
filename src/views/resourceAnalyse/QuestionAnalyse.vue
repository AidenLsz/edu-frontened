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
      <el-col :span="24" v-if="Question.type == 'PackedQues'" type="flex" justify="start">
            <el-row type="flex" justify="start" style="margin-bottom: 10px">
                <label v-if="Analyse">（ 此题{{Question.score}}分 ）</label>
                <label v-else>（ 本节{{Question.score}}分 ）</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin: 10px 0px">
                <Mathdown :content="Question.desc" :name="'Q_Desc_'"></Mathdown>
            </el-row>
            <el-row>
                <PaperAnalysePackedQuestion :PackedQuestion="Question.sub_question" :Sub_Index="Index" :Name_P="'P_' + Index"  :Analyse="false" style="width: 100%"></PaperAnalysePackedQuestion>
            </el-row>
            <el-row v-if="Expand_Ana">
                <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                    <el-col :span="12" style="text-align: left">
                        综合分析
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start">
                    <p style="text-align: left; padding-left: 45px">
                        <span>综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字</span>
                    </p>
                </el-row>
            <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                <el-col :span="12" style="text-align: left">
                    分析详情
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px">
                <el-col>
                    <!-- 属性分析表格 -->
                    <el-row type="flex" justify="start" style="margin: 10px 0px 10px 0px">
                        <label>此题难度等属性分析如下：</label>
                    </el-row>
                    <el-row style="width: 100%">
                        <!-- 第一行 -->
                        <el-row style="width: 66.7%" class="Table_Unit">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label>平均难度</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span>{{Question.difficulty_statistics.mean}}</span>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- 第二行 -->
                        <el-row style="width: 66.7%" class="Table_Unit">
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
                        <el-row style="width: 66.7%" class="Table_Unit">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                    <label style="text-align: left">考察能力</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                    <span style="text-align: left">能力一、能力二、能力三</span>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-row>
                    <!-- 树状结构 -->
                    <el-row type="flex" justify="start" style="margin: 25px 0px 10px 0px">
                        <label>此题包含的知识树状结构为：</label>
                    </el-row>
                    <el-row type="flex" justify="start" class="Table_Unit" style="padding-top: 8px;">
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
                    相似试卷
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px">
                <label>与此试卷相似的试卷是xxxxxxx</label>
            </el-row>
            </el-row>
        </el-col>
        <el-col :span="24" v-else>
            <el-row type="flex" justify="start" style="margin-bottom: 10px">
                <label>（ 小题{{Question.score}}分 ）</label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                <PaperAnalyseQuestion :Question="Question" style="width: 100%"></PaperAnalyseQuestion>
            </el-row>
            <el-row v-if="Expand_Ana">
                <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                    <el-col :span="12" style="text-align: left">
                        综合分析
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start">
                    <p style="text-align: left">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字
                            综合分析的文字综合分析的文字综合分析的文字综合分析的文字综合分析的文字</span>
                    </p>
                </el-row>
                <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
                    <el-col :span="12" style="text-align: left">
                        分析详情
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="padding-left: 45px">
                    <el-col>
                        <!-- 属性分析表格 -->
                        <el-row type="flex" justify="start" style="margin: 10px 0px 10px 0px">
                            <label>此题难度等属性分析如下：</label>
                        </el-row>
                        <el-row style="width: 100%">
                            <!-- 第一行 -->
                            <el-row style="width: 66.7%" class="Table_Unit">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                <label>此题难度</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                <span>{{Question.difficulty}}</span>
                                </el-row>
                            </el-col>
                            </el-row>
                            <!-- 第二行 -->
                            <el-row style="width: 66.7%" class="Table_Unit">
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
                            <el-row style="width: 66.7%" class="Table_Unit">
                            <!-- 左列 -->
                            <el-col :span="6" style="padding-top: 8px;">
                                <el-row type="flex" justify="start">
                                <label style="text-align: left">考察能力</label>
                                </el-row>
                            </el-col>
                            <!-- 右列 -->
                            <el-col :span="18" style="border-left: 2px solid #ECECEC; padding-top: 8px; padding-left: 10px; padding-bottom: 8px">
                                <el-row type="flex" justify="start">
                                <span style="text-align: left">能力一、能力二、能力三</span>
                                </el-row>
                            </el-col>
                            </el-row>
                        </el-row>
                        <!-- 树状结构 -->
                        <el-row type="flex" justify="start" style="margin: 25px 0px 10px 0px">
                            <label>此题包含的知识树状结构为：</label>
                        </el-row>
                        <el-row type="flex" justify="start" class="Table_Unit" style="padding-top: 8px; padding-bottom: 8px">
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
                        相似试卷
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="padding-left: 45px">
                    <label>与此试卷相似的试卷是xxxxxxx</label>
                </el-row>
            </el-row>
        </el-col>
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
                    "id": "67856dca-708c-4aa2-9fd7-8850e3edafaf",
                    "type": "PackedQues",
                    "desc": "请解答以下问题。",
                    "level": 2,
                    "score": 13,
                    "difficulty_statistics": {
                        "mean": 0.6014587627007411,
                        "min": 0.4640635550022125,
                        "max": 0.6161502003669739,
                        "std": 0.03978468727873507
                    },
                    "knowledge_knowledge2num": {
                        "三角函数::代数": 1
                    },
                    "knowledge2difficulty": {
                        "立体几何与平面几何": 0.4640635550022125,
                        "三角函数": 0.6129083633422852,
                        "代数": 0.6129083633422852
                    },
                    "knowledge2score": {
                        "立体几何与平面几何": 1,
                        "三角函数": 12,
                        "代数": 12
                    },
                    "sub_question": [
                        {
                            "id": "7c2bcff3-0f75-4062-ab0d-8a9441a74d03",
                            "type": "Question",
                            "level": 3,
                            "stem": "要在边长为$\\LUNALaTexPictureID{8b8cc022-63ff-4645-b27f-628f97765f77}$米的正方形草坪上安装喷水龙头，使整个草坪都能喷洒到水．假设每个喷水龙头的喷洒范围都是关径为$6$米的圆面，则需安装这种喷水龙头的个数最少是（　　）",
                            "options": "['$3$', '$4$', '$5$', '$6$']",
                            "answer": "$B$",
                            "analysis": "",
                            "difficulty": 0.4640635550022125,
                            "score": 1
                        },
                        {
                            "id": "ef94592e-3828-430c-a629-e23b68f392f3",
                            "type": "PackedQues",
                            "desc": "设$\\LUNALaTexPictureID{099cfbf5-d63a-4aa7-94d7-49c24cbc7a53}$，曲线$x^{2} \\sin \\theta+y^{2} \\cos \\theta=1$和$x^{2} \\cos \\theta-y^{2} \\sin \\theta=1$有$4$个不同的交点。",
                            "level": 3,
                            "score": 12,
                            "difficulty_statistics": {
                                "mean": 0.6129083633422852,
                                "min": 0.6096665263175964,
                                "max": 0.6161502003669739,
                                "std": 0.0032418370246887207
                            },
                            "knowledge_knowledge2num": {
                                "代数::三角函数": 2
                            },
                            "knowledge2difficulty": {
                                "三角函数": 0.6129083633422852,
                                "代数": 0.6129083633422852
                            },
                            "knowledge2score": {
                                "三角函数": 12,
                                "代数": 12
                            },
                            "sub_question": [
                                {
                                    "id": "86ed5c6a-53b0-4dd5-8a70-9860b90897bc",
                                    "type": "Question",
                                    "level": 4,
                                    "stem": "求$\\LUNALaTexPictureID{a9fc567d-485a-4ced-aac9-5bbb70ad7b57}$的取值范围；",
                                    "options": "",
                                    "answer": "",
                                    "analysis": "",
                                    "difficulty": 0.6096665263175964,
                                    "score": 6
                                },
                                {
                                    "id": "bf446a82-96d6-45fc-ad44-2733d1db8128",
                                    "type": "Question",
                                    "level": 4,
                                    "stem": "证明这$\\LUNALaTexPictureID{79c8ee0e-c76c-4aaa-aa47-2cf575b770e8}$个交点共圆，并求圆半径的取值范围。",
                                    "options": "",
                                    "answer": "",
                                    "analysis": "",
                                    "difficulty": 0.6161502003669739,
                                    "score": 6
                                }
                            ]
                        }
                    ],
                    "knowledge_points_frontend": {
                        "kp": [
                            "圆内接四边形的性质定理与判定定理",
                            "立体几何与平面几何",
                            "直线与圆的位置关系（选）",
                            "几何证明选讲（选考内容）"
                        ],
                        "kp_layer": [
                            {
                                "label": "立体几何与平面几何",
                                "children": [
                                    {
                                        "label": "几何证明选讲（选考内容）",
                                        "children": [
                                            {
                                                "label": "直线与圆的位置关系（选）",
                                                "children": [
                                                    {
                                                        "label": "圆内接四边形的性质定理与判定定理",
                                                        "children": []
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "label": "立体几何初步",
                                        "children": [
                                            {
                                                "label": "空间几何体",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "kp_priority": [
                            "立体几何与平面几何",
                            "几何证明选讲（选考内容）",
                            "空间几何体",
                            "直线与圆的位置关系（选）",
                            "圆内接四边形的性质定理与判定定理"
                        ]
                    }
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
    this.Init()
  },
  data(){
    return {
      Expand_Ana: true,
      defaultProps: {
        label: "label",
        children: "children"
      },
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
  }
};
</script>
<style lang="scss" scoped>
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
.Table_Unit{
   border: 1px solid #ECECEC; 
   padding-left: 10px; 
   background: #F8FBFF;
   box-sizing:border-box;
}
.el-divider--horizontal{
  display:block;
  height:2px;
  width:100%;
  margin:24px 0
}
</style>