<template>
  <div style="margin-top: 5vh; padding-left: 5vw; padding-right: 5vw">
    <el-row justify="start" type="flex">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-top: 13px">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>资源录入</el-breadcrumb-item>
                <el-breadcrumb-item>试题资源</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="center" @click.native="toPaper()" class="toPaper">
            <span>切换至整卷页面</span>
        </el-row>
      </el-col>
    </el-row>
    <!-- 学科选择 -->
    <el-row type="flex" justify="start" style="margin-top: 6vh; margin-bottom: -1vh">
        <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                <label>科目</label>
            </el-row>
        </el-col>
        <el-col :span="21">
            <el-row type="flex" justify="start">
                <el-select v-model="Subject" placeholder="请选择科目">
                <el-option
                    v-for="item in Subject_List"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-row>
        </el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 学段选择 -->
    <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
        <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                <label>学段</label>
            </el-row>
        </el-col>
        <el-col :span="21">
            <el-row type="flex" justify="start">
                <el-select v-model="Period" placeholder="请选择学段">
                <el-option
                    v-for="item in Period_List"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
                </el-select>
            </el-row>
        </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex" justify="start" style="margin-top: -1vh;">
        <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                <label>题型</label>
            </el-row>
        </el-col>
        <el-col :span="13">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px;">
                <el-col v-for="Type in Type_List" :key="'Ques_Type_' + Type" :span="24/8">
                    <el-row 
                        type="flex" 
                        justify="center" 
                        :class="Get_Type_Button_Class(Type)"
                        @click.native="Type_Change(Type.value)">
                        {{Type.label}}
                    </el-row>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="border: 3px solid #409EFF; min-height: 30vh; border-radius: 15px; margin-top: 30px;">
        <OptionQuestions style="width: 100%" v-if="['单选题', '多选题', '判断题'].indexOf(Type) != -1" :detailType.sync="Type"></OptionQuestions>
    </el-row>
  </div>
</template>

<script>

import OptionQuestions from '@/views/testPage/Remaking_Input_Component/components/OptionQuestions.vue'

export default {
  name: "RemakingInputPaper",
  components: {
      OptionQuestions
  },
  data() {
    return {
        // 用于显示最终录入科目的变量
        Subject: "数学",
        // 用于显示最终录入学段的变量
        Period: "高中",
        // 用于确定当前显示的题目类型的变量
        Type: "单选题",
        // 待选科目
        Subject_List: [
            { value: "语文", label: "语文" },
            { value: "数学", label: "数学" },
            { value: "英语", label: "英语" },
            { value: "历史", label: "历史" },
            { value: "政治", label: "政治" },
            { value: "地理", label: "地理" },
            { value: "物理", label: "物理" },
            { value: "化学", label: "化学" },
            { value: "生物", label: "生物" },
            { value: "其他", label: "其他" }],
        // 待选学段
        Period_List: [
            { value: "小学", label: "小学" },
            { value: "初中", label: "初中" },
            { value: "高中", label: "高中" },
            { value: "大学", label: "大学" },
            { value: "成人", label: "成人" },
            { value: "其他", label: "其他" }
        ],
        // 待选试题类型
        Type_List: [
            { value: "单选题", label: "单选题" },
            { value: "多选题", label: "多选题" },
            { value: "判断题", label: "判断题" },
            { value: "填空题", label: "填空题" },
            { value: "简答题", label: "简答题" },
            { value: "计算题", label: "计算题" },
            { value: "综合题", label: "综合题" }
        ],
    };
  },
  methods:{
      toPaper(){
        this.$router.push({path: "/remakeInputPaper"})
      },
      Get_Type_Button_Class(Type){
          if(Type.value == this.Type){
              return "typeButton focusType"
          }else{
              return "typeButton unFocusType"
          }
      },
      Type_Change(Type_value){
          this.Type = Type_value
      },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toPaper{
    height: 40px; 
    line-height: 40px;
    width: 10vw; 
    background: #FFE37F;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}
.toPaper:hover{ 
    background: #FFF0A0;
    color: #888;
}
.typeButton{
    border-radius: 20px;
    margin-right: 10px;
    font-weight: bold;
    box-shadow: 2px 4px 4px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
}
.typeButton.focusType{
    background: #409EFF;
    border: 1px solid #409EFF;
    color: white;
}
.typeButton.unFocusType{
    background: white;
    border: 1px solid whitesmoke;
}
.typeButton.unFocusType:hover{
    background: #E5EEFF;
    border: 1px solid #F5FEFF;
}
</style>
