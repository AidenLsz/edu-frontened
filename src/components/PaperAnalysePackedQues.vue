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
            这里是分析详情区域{{Index}}
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
            这里是分析详情区域{{Index}}
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
      Name_Packed_Next: []
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
</style>