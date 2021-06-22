// 这个组件的目的是作为全卷分析的PackedQues下的最终小题Question做内容显示
<!-- 作为递归的终点 -->
<template>
  <div>
        <el-row type="flex" justify="start">
            <Mathdown :content="Question.stem" :name="Get_Name('Stem')"></Mathdown>
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.options != ''">
          <el-col :span="5" v-for="(opt, opt_i) in Get_Options(Question.options)" :key="Get_Name('Options') + '_' + opt_i">
            <el-row type="flex" justify="start">
              {{Get_Option_Index(opt_i)}}<Mathdown :content="opt" :name="Get_Name('Options') + '_' + opt_i"></Mathdown>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.answer != ''">
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <label>正确答案：</label>
            </el-row>
          </el-col>
          <el-col :span="21">
            <Mathdown :content="Question.answer" :name="Get_Name('Answer')"></Mathdown>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin: 20px 0px" v-if="Question.analyse != ''">
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <label>参考解析：</label>
            </el-row>
          </el-col>
          <el-col :span="21">
            <Mathdown :content="Question.analysis" :name="Get_Name('Analyse')"></Mathdown>
          </el-col>
        </el-row>
  </div>
</template>
 
<script>

import Mathdown from "../../../common/components/Mathdown.vue"

export default {
  name: "PaperAnalyseQuestion",
  props: {
    Question: Object,
    Sub_Index_Q: {
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
      return this.Name_Q + "_Q_" + this.Sub_Index_Q + "_" + After_Str;
    },
    Get_Options(optString){
      if(typeof optString == 'object' && typeof optString.length == 'number'){
        return optString;
      }
      if(optString.length > 0){
        var tempList = optString.substring(1, optString.length-1).split(", ")
        var Result = []
        for(var i = 0 ; i < tempList.length; i++){
          Result.push(tempList[i].substring(1, tempList[i].length-1))
        }
        return Result
      }else{
        return []
      }
    },
    Get_Option_Index(opt_i){
      return String.fromCharCode(opt_i + 65) + "："
    }
  },
  data(){
    return {
      Name: this.Name_Q
    }
  }
};
</script>