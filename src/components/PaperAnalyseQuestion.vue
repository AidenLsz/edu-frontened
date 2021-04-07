// 这个组件的目的是作为全卷分析的PackedQues下的最终小题Question做内容显示
<!-- 作为递归的终点 -->
<template>
  <div>
        <el-row>
            小题：{{Question.id}}
        </el-row>
        <el-row>
            题目分值：{{Question.score}}
        </el-row>
        <el-row>
            题目难度：{{Question.difficulty}}
        </el-row>
  </div>
</template>
 
<script>
export default {
  name: "PackedQuestion",
  props: {
    Question: Object
  },
  components: {
      // 这里不需要引用node自身
  }
};
</script>