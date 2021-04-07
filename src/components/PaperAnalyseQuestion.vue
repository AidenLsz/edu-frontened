// 这个组件的目的是作为全卷分析的PackedQues下的最终小题Question做内容显示
<!-- 作为递归的终点 -->
<template>
  <div>
        <el-row type="flex" justify="start">
            <Mathdown :content="Question.stem" :name="Get_Name('Stem')"></Mathdown>
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.options != ''">
          <el-col :span="2">
            <el-row type="flex" justify="start">
              <label>备选选项：</label>
            </el-row>
          </el-col>
          <el-col :span="22">
            <Mathdown :content="Question.options" :name="Get_Name('Options')"></Mathdown>
          </el-col> 
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.answer != ''">
          <el-col :span="2">
            <el-row type="flex" justify="start">
              <label>正确答案：</label>
            </el-row>
          </el-col>
          <el-col :span="22">
            <Mathdown :content="Question.answer" :name="Get_Name('Answer')"></Mathdown>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.analyse != ''">
          <el-col :span="2">
            <el-row type="flex" justify="start">
              <label>参考解析：</label>
            </el-row>
          </el-col>
          <el-col :span="22">
            <Mathdown :content="Question.analyse" :name="Get_Name('Analyse')"></Mathdown>
          </el-col>
        </el-row>
  </div>
</template>
 
<script>

import Mathdown from "./Mathdown.vue"

export default {
  name: "PaperAnalyseQuestion",
  props: {
    Question: Object,
    Sub_Index: {
      type: Number,
      default: -1
    },
    Name_Q: String
  },
  components: {
    Mathdown
      // 这里不需要引用node自身
  },
  methods: {
    Get_Name(After_Str){
      return this.Name_Q + "_Q_" + this.Sub_Index + "_" + After_Str;
    }
  },
  data(){
    return {
      Name: this.Name_Q
    }
  }
};
</script>