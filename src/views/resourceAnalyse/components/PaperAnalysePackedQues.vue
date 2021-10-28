<!-- 作为递归自身的节点 -->
<template>
  <div
    v-loading="Question_Analysing"
    element-loading-text="正在加载分析报告..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(211, 211, 211, 0.6)">
      <!-- 这里是访问每个大题包最开始的地方，如果Analyse为true，说明是第一次访问，也就应当有展开分析的页面 -->
      <el-row v-for="(Question, Index) in PackedQuestion" :key="Question.id + '_' + Index" :class="Get_Class(Analyse)">
        <el-col :span="24" v-if="Question.class == 'PackedQues'" type="flex" justify="start">
          <el-row type="flex" justify="start" style="margin-bottom: 10px">
            <label v-if="Analyse">（ 此题{{Question.score}}分 ）</label>
            <label v-else>（ 本节{{Question.score}}分 ）</label>
            <el-tooltip content="替换该位置的题目" placement="top" v-if="Combine_Update_Bundle_Index != -1">
              <i class="el-icon-refresh" style="font-size: 20px; cursor: pointer" @click="Replace_It(Combine_Update_Bundle_Index, Index)"></i>
            </el-tooltip>
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
        </el-col>
        <el-col :span="24" v-else>
          <el-row type="flex" justify="start" style="margin-bottom: 10px">
            <label>（ 小题{{Question.score}}分 ）</label>
            <el-tooltip 
              content="替换此题目" placement="top" v-if="Combine_Update_Bundle_Index != -1">
              <i class="el-icon-refresh" style="font-size: 20px; cursor: pointer" @click="Replace_It(Combine_Update_Bundle_Index, Index)"></i>
            </el-tooltip>
          </el-row>
          <el-row type="flex" justify="start" style="margin-bottom: 10px;">
            <PaperAnalyseQuestion :Question="Question" style="width: 100%" :Sub_Index_Q="Index" :Name_Q="Name_Packed_Next[Index]"></PaperAnalyseQuestion>
          </el-row>
          <el-row v-if="Analyse" type="flex" justify="start" style="margin-bottom: 10px">
            <el-button type="primary" size="small" plain @click="Change_Expand(Index)">题目分析详情&nbsp;&nbsp;
              <i class="el-icon-caret-right" v-if="!Expand_Ana[Index]"></i>
              <i class="el-icon-caret-bottom" v-if="Expand_Ana[Index]"></i>
            </el-button>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>
 
<script>

import PaperAnalyseQuestion from "./PaperAnalyseQuestion.vue";
import Mathdown from "../../../common/components/Mathdown.vue";
import {commonAjax} from '@/common/utils/ajax'

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
    Name_P: String,
    Combine_Update_Bundle_Index:{
      type: Number,
      default: -1
    }
  },
  components: {
      PaperAnalyseQuestion,
      Mathdown
  },
  created(){
    this.Name_Packed_Next = [];
    for(let i = 0; i < this.PackedQuestion.length; i++){
      this.Name_Packed_Next.push(this.Name_P + "_" + i)
    }
    this.Expand_Ana = [];
    for(let i = 0; i < this.PackedQuestion.length; i++){
      this.Expand_Ana.push(false);
    }
  },
  data(){
    return {
      Expand_Ana: [],
      Name_Packed_Next: [],
      defaultProps: {
        label: "label",
        children: "children"
      },
      analyseReport: false,
      analyseData: {},
      Refresh: false,
      Question_Analysing: false,
      Index_Cache: -1,
      Database: 'public'
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
    // 只有组卷分析报告要用到的需求，在这里尝试获取内容
    Replace_It(Combine_Update_Bundle_Index, Index){
      this.$emit("Replace_Aim", JSON.stringify({
          "Bundle_Index": Combine_Update_Bundle_Index, 
          "Question_Index": Index
        })
      )
    },
    Show_Expand_Analyse(index){
      if(this.Expand_Ana[index]){
        return true
      }else{
        return false
      }
    },
    Change_Expand(Index){
      this.Refresh = !this.Refresh;
      this.Index_Cache = Index;
      this.Question_Analysing = true;
      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename: this.Database,
          ID: this.PackedQuestion[Index].id
        }
      ).then((data)=>{
        if(data.status == 'fail' && this.Database == 'public'){
          this.Database = 'test'
          this.Change_Expand(this.Index_Cache);
        }else if(data.status == 'fail' && this.Database != 'public'){
          this.$message.error("此题暂无法获取单题分析报告。")
          this.Question_Analysing = false
          return;
        }else{
          this.analyseData = data.que_dic
          this.Question_Analysing = false
          this.$emit("QuestionReport", JSON.stringify(this.analyseData));
        }
      }).catch(()=>{
        if(this.Database == 'public'){
          this.$message.error("服务器正忙，请稍后重试。")
        }else{
          this.$message.warning("文件上传的试题暂不支持单题分析，正在更新过程中，敬请期待。")
        }
        this.Question_Analysing = false
      })
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