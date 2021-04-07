<!-- 作为递归自身的节点 -->
<template>
  <div>
      <el-row v-for="(Question, Index) in PackedQuestion" :key="Question.id + '_' + Index">
        <el-row v-if="Question.type == 'PackedQues'">
            <!-- 在这里引用node自身，完成递归操作 -->
            自递归题包：{{Question.id}}
            <PackedQuestion :PackedQuestion="Question.sub_question"></PackedQuestion>
        </el-row>
        <el-row v-else>
            <PaperAnalyseQuestion :Question="Question"></PaperAnalyseQuestion>
        </el-row>
      </el-row>
  </div>
</template>
 
<script>

import PaperAnalyseQuestion from "./PaperAnalyseQuestion";

export default {
  name: "PackedQuestion",
  props: {
    PackedQuestion: Array
  },
  components: {
      PaperAnalyseQuestion
  }
};
</script>