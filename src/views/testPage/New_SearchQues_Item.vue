<template>
  <div style="border-radius: 10px; background: white">
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
        <el-col style="padding-bottom: 8px" >
            <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
        </el-col>
    </el-row>
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-bottom: 8px">
        <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
            <el-row style="line-height: 40px; height: 40px" type="flex" justify="start">
                <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
                <Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
            </el-row>
        </el-col>
    </el-row>
    <el-row 
        v-if="Expand" 
        style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px;">
        <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span>
            <Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
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
    <el-row class="Detail_Line">
        <el-col :span="21" style="line-height: 44px; padding: 0px 16px 0px 16px; border-radius: 10px; background: #F8F8F8">
            <el-row type="flex" justify="start">
                <el-col :span="3">
                    <el-row type="flex" justify="start">
                        <el-button type="text" @click="Expand = !Expand" style="height: 44px;">
                            <i :class=" Expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="margin-right: 10px"></i>
                            {{Expand ? '收起' : '展开'}}
                        </el-button>
                    </el-row>
                </el-col>
                <el-col :span="21">
                    <el-row type="flex" justify="end">
                        <span class="Extra_Info_Item">
                            真题情况：未知
                        </span>
                        <span class="Extra_Info_Item">
                            所属题库：{{Question.database}}
                        </span>
                        <span class="Extra_Info_Item">
                            学科：{{Question.subject}}
                        </span>
                        <span class="Extra_Info_Item">
                            学段：{{Question.period}}
                        </span>
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
        <el-col :span="3" style="line-height: 44px; height: 44px">
            <el-row type="flex" justify="end">
                <el-button size="medium" type="primary" style="height: 44px; border-radius: 10px" @click="Check_Analyse(Question.id, Question.database)">
                    查看分析报告
                </el-button>
            </el-row>
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
                "type": ""
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
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.Detail_Line{
    padding: 6px 12px 12px 12px;
}
.Extra_Info_Item{
    margin-left: 15px;
}
</style>
