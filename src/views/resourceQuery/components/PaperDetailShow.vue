<template>
    
  <div v-if="Paper_Json.status != 'FAIL'" style="min-height: 73.5vh">
      <el-dialog
        :visible.sync="Question_Analyse_Dialog"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        :key="'Question_Analyse_' + Refresh"
        style="">
        <template slot="title"></template>
        <el-row style="margin: 0px;">
            <QuestionAnalyse :Ques="Question_Analyse_Info"></QuestionAnalyse>
        </el-row>
    </el-dialog>
      <el-row v-for="(Sub_Ques, Sub_Index) in Paper_Json.sub_question" :key="Sub_Ques.id" style="margin: 30px 0px">
            <el-row type="flex" justify="start" style="margin: 0px 16.5vw 10px 16.5vw">
                <el-col :span="20" style="text-align: left">
                    <label style="line-height: 28px; font-size: 1.5rem">第{{Get_Question_Bundle_Index((Sub_Index + 1) + "")}}大题 —— {{Sub_Ques.desc}}（共{{Sub_Ques.sub_question.length}}题，{{Sub_Ques.score}}分）：</label>
                </el-col>
            </el-row>
            <el-row type="flex" justify="start" style="margin: 0px 16.5vw 10px 16.5vw">
                <PaperAnalysePQRoot @Report="Show_Report" :PackedQues="Sub_Ques" :Index="Sub_Index" style="width: 100%"></PaperAnalysePQRoot>
            </el-row>
        </el-row>
  </div>
  <div v-else style="min-height: 73.5vh">
      <el-row style="padding-top: 20vh; font-size: 24px">
          暂无试题数据
      </el-row>
  </div>
</template>
<script>

import PaperAnalysePQRoot from "./../../resourceAnalyse/components/PaperAnalysePQRoot.vue"
import QuestionAnalyse from '@/views/resourceAnalyse/QuestionAnalyse'

export default {
  name: 'PaperDetailShow',
  components: { PaperAnalysePQRoot, QuestionAnalyse },
  data() {
    return {
        Paper_Json: this.PJ,
        Question_Analyse_Dialog: false,
        Question_Analyse_Info: {},
        Refresh: false
    }
  },
  props: {
      PJ: {
          type: Object,
          default: function(){
              return {
                  "status": "FAIL"
              }
          }
      }
  },
  watch:{

  },
  created() {
      if(sessionStorage.getItem("PaperDetailShow")){
          this.Paper_Json = JSON.parse(sessionStorage.PaperDetailShow)
      }
  },
  methods: {
        Show_Report(val){
            this.Question_Analyse_Info = JSON.parse(val);
            this.Refresh = !this.Refresh;
            this.Question_Analyse_Dialog = true;
        },
        // 调整对话框下显示的数据的序号
        Get_Question_Bundle_Index(Bundle_Index){
            var Char_List = ["一","二","三","四","五","六","七","八","九"];
            if(Bundle_Index.length == 1 && Bundle_Index != "0"){
                return Char_List[parseInt(Bundle_Index) - 1]
            }else if(Bundle_Index.length == 2){
                if(Bundle_Index[1] == "0" && Bundle_Index[1] == "1"){
                    return "十"
                }else if(Bundle_Index[1] == "0" && Bundle_Index[1] != "1"){
                    return Char_List[parseInt(Bundle_Index[0]) - 1] + "十"
                }else if(Bundle_Index[1] != "0" && Bundle_Index[1] == "1"){
                    return "十" + Char_List[parseInt(Bundle_Index[1]) - 1]
                }else if(Bundle_Index[1] != "0" && Bundle_Index[1] != "1"){
                    return Char_List[parseInt(Bundle_Index[0]) - 1] + "十" + Char_List[parseInt(Bundle_Index[1]) - 1]
                }
            }
        },
  },
}
</script>
<style scoped>
</style>