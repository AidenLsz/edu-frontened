// 用于新页面的单题显示组件

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
    <el-row class="Detail_Line">
        <div
            class="Detail_Line_Left" 
            style="line-height: 44px; padding: 0px 16px 0px 16px; border-radius: 10px; background: #F8F8F8">
                <div 
                    align="left"
                    class="Detail_Line_Expand">
                    <el-button type="text" @click="Expand = !Expand; Expand_Aim()" style="height: 44px;">
                        <i :class=" Expand ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" style="margin-right: 2px; transform: rotate(270deg);"></i>
                        {{Expand ? '隐藏' : '查看'}}答案和解析
                    </el-button>
                </div>
                <div
                    align="right" 
                    class="Detail_Line_Infos">
                    <span class="Extra_Info_Item">
                        地区：{{Question.area}}
                    </span>
                    <span class="Extra_Info_Item">
                        真题情况：{{Question.pastpaper}}
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
                </div>
        </div>
        <div
            class="Detail_Line_Right">
            <el-button 
                size="medium"
                type="primary"
                class="Search_Button"
                style="height: 44px; border-radius: 10px; width: 132px" @click="Check_Analyse(Question.id, Question.database)">
                查看分析报告
            </el-button>
        </div>
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
.Detail_Line{
    padding: 6px 16px 16px 16px;
}
.Detail_Line_Left{
    display: inline-block;
    width: calc(100% - 148px);
    margin-right: 16px;
}
.Detail_Line_Right{
    width: 132px;
    height: 44px;
    display: inline-block;
}
.Extra_Info_Item{
    margin-left: 15px;
}
.Detail_Line_Expand{
    display: inline-block;
    width: 130px;
}
.Detail_Line_Infos{
    position: relative;
    display: inline-block;
    right: 0px;
    width: calc(100% - 130px);
}

.Search_Button{
    background: #539DD9;
    transition-duration: 300ms;
}

.Search_Button:hover{
    background: #4484B8;
}

.Answer_Before_Login{
    color: #999
}
</style>
