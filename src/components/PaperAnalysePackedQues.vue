<!-- 作为递归自身的节点 -->
<template>
  <div>
      <!-- 这里是访问每个大题包最开始的地方，如果Analyse为true，说明是第一次访问，也就应当有展开分析的页面 -->
      <el-row v-for="(Question, Index) in PackedQuestion" :key="Question.id + '_' + Index" :class="Get_Class(Analyse)">
        <el-col :span="24" v-if="Question.type == 'PackedQues'" type="flex" justify="start">
          <el-row type="flex" justify="start" style="margin-bottom: 10px">
            <label v-if="Analyse">（ 此题{{Question.score}}分 ）</label>
            <label v-else>（ 本节{{Question.score}}分 ）</label>
          </el-row>
          <el-row type="flex" justify="start" style="margin: 10px 0px">
            <Mathdown :content="Question.desc" :name="Name_Packed_Next[Index]"></Mathdown>
          </el-row>
          <el-row>
            <PaperAnalysePackedQuestion :PackedQuestion="Question.sub_question" :Analyse="false" :Sub_Index="Index" :Name_P="Get_Name(Index)" style="width: 100%"></PaperAnalysePackedQuestion>
          </el-row>
          <el-row v-if="Analyse" type="flex" justify="start" style="margin-bottom: 10px">
            <el-button type="primary" size="small" plain @click="Change_Expand(Index)">题目分析详情&nbsp;&nbsp;
              <i class="el-icon-caret-right" v-if="!Expand_Ana[Index]"></i>
              <i class="el-icon-caret-bottom" v-if="Expand_Ana[Index]"></i>
            </el-button>
          </el-row>
          <el-row v-if="Expand_Ana[Index]">
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
                  <el-tree style="background: transparent" :data="Question.knowledge_points_frontend.kp_layer" :props="defaultProps"></el-tree>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
              <el-col :span="12" style="text-align: left">
                  相似试题
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px">
                <label>与此试题相似的试题是xxxxxxx</label>
            </el-row>
          </el-row>
        </el-col>
        <el-col :span="24" v-else>
          <el-row type="flex" justify="start" style="margin-bottom: 10px">
            <label>（ 小题{{Question.score}}分 ）</label>
          </el-row>
          <el-row type="flex" justify="start" style="margin-bottom: 10px;">
            <PaperAnalyseQuestion :Question="Question" style="width: 100%" :Sub_Index="Index" :Name_Q="Name_Packed_Next[Index]"></PaperAnalyseQuestion>
          </el-row>
          <el-row v-if="Analyse" type="flex" justify="start" style="margin-bottom: 10px">
            <el-button type="primary" size="small" plain @click="Change_Expand(Index)">题目分析详情&nbsp;&nbsp;
              <i class="el-icon-caret-right" v-if="!Expand_Ana[Index]"></i>
              <i class="el-icon-caret-bottom" v-if="Expand_Ana[Index]"></i>
            </el-button>
          </el-row>
          <el-row v-if="Expand_Ana[Index]">
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
                  <el-tree style="background: transparent" :data="Question.knowledge_points_frontend.kp_layer" :props="defaultProps"></el-tree>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" class="Part_Row_Style_Expand">
              <el-col :span="12" style="text-align: left">
                  相似试题
              </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="padding-left: 45px">
                <label>与此试题相似的试题是xxxxxxx</label>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>
 
<script>

import PaperAnalyseQuestion from "./PaperAnalyseQuestion.vue";
import Mathdown from "./Mathdown.vue"

export default {
  name: "PaperAnalysePackedQuestion",
  props: {
    PackedQuestion: Array,
    Analyse: {
      type: Boolean,
      default: true
    },
    Sub_Index: {
      type: Number,
      default: -1
    },
    Name_P: String
  },
  components: {
      PaperAnalyseQuestion,
      Mathdown
  },
  created(){
    this.Name_Packed_Next = [];
    for(var i = 0; i < this.PackedQuestion.length; i++){
      this.Name_Packed_Next.push(this.Name_P + "_" + i)
    }
    setTimeout(()=>{this.Init();}, 100)
  },
  data(){
    return {
      Expand_Ana: [],
      Name_Packed_Next: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      // Test_Layer_Data: {
      //   kp: [
      //       "圆内接四边形的性质定理与判定定理",
      //       "直线与圆的位置关系（选）",
      //       "立体几何与平面几何",
      //       "几何证明选讲（选考内容）"
      //   ],
      //   kp_layer: [
      //       {
      //           "label": "立体几何与平面几何",
      //           "children": [
      //               {
      //                   "label": "几何证明选讲（选考内容）",
      //                   "children": [
      //                       {
      //                           "label": "直线与圆的位置关系（选）",
      //                           "children": [
      //                               {
      //                                   "label": "圆内接四边形的性质定理与判定定理",
      //                                   "children": []
      //                               }
      //                           ]
      //                       }
      //                   ]
      //               },
      //               {
      //                   "label": "立体几何初步",
      //                   "children": [
      //                       {
      //                           "label": "空间几何体",
      //                           "children": []
      //                       }
      //                   ]
      //               }
      //           ]
      //       }
      //   ],
      //   kp_priority: [
      //     "立体几何与平面几何",
      //     "几何证明选讲（选考内容）",
      //     "空间几何体",
      //     "直线与圆的位置关系（选）",
      //     "圆内接四边形的性质定理与判定定理"
      //   ]
      // }
    }                        
  },
  methods: {
    Init(){
      console.log(this.Name_Packed_Next)
      this.Expand_Ana = [];
      for(var i = 0; i < this.PackedQuestion.length; i++){
        this.Expand_Ana.push(false);
      }
    },
    Show_Expand_Analyse(index){
      if(this.Expand_Ana[index]){
        return true
      }else{
        return false
      }
    },
    Change_Expand(Index){
      this.Expand_Ana.splice(Index, 1, !this.Expand_Ana[Index])
    },
    Get_Class(Analyse){
      if(Analyse){
        return "Analyse_Area"
      }else{
        return ""
      }
    },
    Get_Name(Index){
      return this.Name_Packed_Next[Index]
    }
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
   background: white;
   box-sizing:border-box;
}
</style>