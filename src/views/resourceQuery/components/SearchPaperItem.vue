// 用于新页面的单题显示组件

<template>
  <div style="border-radius: 10px; background: white">
    <el-row style="padding-top: 3%; margin-left: 2%; width: 96%; border-bottom: 2px dashed #ccc; padding-bottom: 5px;" justify="center">
        <label>{{Paper_Info.title}}</label>
    </el-row>
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-top: 15px; border-radius: 10px">
        <el-col style="padding-bottom: 8px" >
            <Mathdown :content="Paper_Info.Ques.stem" :name="'Q_' + Paper_Info_Index + '_Stem'"></Mathdown>
        </el-col>
    </el-row>
    <el-row style="text-align: left; padding-left: 30px; background: white; padding-bottom: 8px">
        <el-col v-for="(Option, Option_Index) in Paper_Info.Ques.options" :key="'Option_'+ Option_Index + '_Of_' + Paper_Info_Index">
            <el-row style="line-height: 40px; height: 40px" type="flex" justify="start">
                <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
                <Mathdown style="width:700px" :content="Option" :name="'Q_' + Paper_Info_Index + '_Option_' + Option_Index"></Mathdown>
            </el-row>
        </el-col>
    </el-row>
    <el-row 
        v-if="Expand" 
        style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px;">
        <el-col>
            <span style="margin-bottom: 10px; display: block">答案：</span>
            <Mathdown :content="Paper_Info.Ques.answer" :name="'Q_' + Paper_Info_Index + '_Answer'"></Mathdown>
        </el-col>
    </el-row>
    <el-row 
        v-if="Expand" 
        style="text-align: left; padding-left: 40px; padding-bottom: 20px">
        <el-col>
            <span style="margin-bottom: 20px; display: block">解析：</span>
            <Mathdown :content="Paper_Info.Ques.analysis" :name="'Q_' + Paper_Info_Index + '_Analysis'"></Mathdown>
        </el-col>
    </el-row>
    <el-row class="Detail_Line">
        <div
            class="Detail_Line_Left" 
            style="line-height: 44px; padding: 0px 16px 0px 16px; border-radius: 10px;">
                <div
                    align="left" 
                    class="Detail_Line_Infos">
                    <div class="SP_period"  style="background-color:#E9E8FA; margin-right:10px ">
                        {{Paper_Info.Ques.period}}
                    </div>
                    <div class="SP_subject" style="background-color:#FAE8EC; margin-right:10px ">
                        {{Paper_Info.Ques.subject}}
                    </div>
                    <div class="SP_database" style="background-color:#FAF3E8; margin-right:10px ">
                        {{Paper_Info.Ques.database}}
                    </div>


                </div>
        </div>
        <div
            align="right"
            class="Detail_Line_Right">
            <el-button 
                size="medium"
                type="primary"
                class="Detail_Button"
                style="height: 44px; border-radius: 10px; width: 110px; margin-right: 6px;" @click="Paper_Detail(Paper_Info.id)">
                试卷详情
            </el-button>
            <el-button 
                size="medium"
                type="primary"
                class="Search_Button"
                style="height: 44px; border-radius: 10px; width: 132px" @click="Paper_Analyse(Paper_Info.id)">
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
    Paper_Info:{
        type: Object,
        default: function(){
            return {
                "id": "",
                "title": "",
                "Ques": {}
            }
        }
    },
    Paper_Info_Index: {
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
      Get_Option_Label(Option_Index){
          return String.fromCharCode(Option_Index + 65)
      },
      Paper_Detail(Paper_ID){
          this.$emit("Paper_Detail", Paper_ID);
      },
      Paper_Analyse(Paper_ID){
          this.$emit("Paper_Analyse", Paper_ID);
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.SP_period{
  position: static;
  left: 0px;
  top: 0px;
  width: 64px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #E9E8FA;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #38377D;
  z-index: 0;

}

.SP_subject{
  position: static;
  left: 80px;
  top: 0px;
  width: 64px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #FAE8EC;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #7D3745;
  z-index: 0
}
.SP_database{
  position: static;
  left: 160px;
  top: 0px;
  width: 96px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  background: #FAF3E8;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.16);
  font-family: SourceHanSansCN-Regular;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  letter-spacing: 0px;
  color: #7D6237;
  z-index: 0
}
.Detail_Line{
    padding: 6px 16px 16px 16px;
}
.Detail_Line_Left{
    display: inline-block;
    width: calc(100% - 278px);
}
.Detail_Line_Right{
    width: 278px;
    height: 44px;
    display: inline-block;
}
.Extra_Info_Item_phase{
    margin-left: 15px;
}
.Detail_Line_Infos{
    position: relative;
    display: flex;
    right: 0px;
    width: 100%;
}

.Search_Button{
    background: #539DD9;
    transition-duration: 300ms;
}

.Detail_Button{
    border-color: #41A441;
    background: #EDF8ED;
    color: #41A441;
    transition-duration: 300ms;
}

.Search_Button:hover{
    background: #4484B8;
}

.Detail_Button:hover{
    background: rgba(#41A441, 0.2);
}
</style>
