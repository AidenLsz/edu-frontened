// 用于新页面的单题显示组件

<template>
  <div style="border-radius: 10px; background: white" class="ques-text">
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
        <el-col style="padding-bottom: 8px" >
            <!-- {{Question_Index+1}}、 -->
            <Mathdown style="display:inline-block" :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
        </el-col>
    </el-row>
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-bottom: 8px">
        <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
          <el-radio v-model="radio" :label="Get_Option_Label(Option_Index)" style="display:flex;align-items:center;">
            <span style="line-height: 40px" class="ques-text">{{Get_Option_Label(Option_Index)}}：</span>
            <Mathdown class="ques-text" style="width:1100px;display:inline-block" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
          </el-radio>
        </el-col>
    </el-row>
    <el-row
        v-if="Expand"
        style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px;">
        <el-col>
            <span :style="'margin-bottom: 10px; display: ' + $store.state.user.name ? ' block': ' inline-block'">答案：</span>
            <span v-show="!$store.state.user.name" class="Answer_Before_Login">【登录后可见】</span>
            <Mathdown v-show="$store.state.user.name" :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
        </el-col>
    </el-row>
    <el-row
        v-if="Expand"
        style="text-align: left; padding-left: 40px; padding-bottom: 20px">
        <el-col>
            <span style="margin-bottom: 20px; display: block">解析：</span>
            <Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
        </el-col>
    </el-row>
  </div>
</template>

<script>

import Mathdown from '@/common/components/Mathdown'

export default {
  name: "Test",
  components:{
      Mathdown
  },
  props:{
    Question:{
        type: Object,
        default: function(){
            return {
                "analysis": "",
                "answer": "",
                "database": "",
                "id": "",
                "options": [],
                "period": "",
                "stem": "",
                "subject": "",
                "type": "",
                "pattern": "text",
                "file_name": null,
                "pastpaper": "",
                "area": ""
            }
        }
    },
    Question_Index: {
        type: Number,
        default: 1
    }
  },
  data() {
    return {
        radio:'',
        Expand: false
    };
  },
  methods: {
      Check_Analyse(ID, Database){
          this.$emit('Check_Question_Analysis', JSON.stringify({
              ID: ID,
              Database: Database
          }))
      },
      Get_Option_Label(Option_Index){
          return String.fromCharCode(Option_Index + 65)
      },
      Expand_Aim(){
        if(this.Expand == true){
            this.$emit('Expand_Aim', JSON.stringify({
                Aim: "Question_" + this.Question_Index
            }))
        }
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Extra_Info_Item{
    margin-left: 15px;
}
.ques-text{
  font-family: PingFang SC!important;
  font-size: 20px!important;
  font-style: normal!important;
  font-weight: 400!important;
  line-height: 44px!important;
  letter-spacing: 0.03em!important;
  text-align: left!important;
}

</style>
