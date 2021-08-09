<template>
  <div style="margin-left: 10vw; margin-right: 10vw; min-height: 700px; margin-top: 50px;">
    <!-- 左侧的纸页样式调整 -->
    <div class="PaperStableIcon">
      <el-row type="flex" justify="start" style="margin-top: 20px; margin-left: 5px">
        <label>
          点击切换
        </label>
      </el-row>
      <el-row type="flex" justify="start" style="margin-top: -5px; margin-left: 5px">
        <label>
          纸页布局
        </label>
      </el-row>
      <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 5px">
        <label>
          纸页
        </label>
      </el-row>
      <el-row type="flex" justify="center" class="PaperSettingIconArea">
        <label @click="ChangePaperType()" style="cursor: pointer">{{PaperType}}</label>
      </el-row>
      <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 5px">
        <label>
          布局
        </label>
      </el-row>
      <el-row type="flex" justify="center" class="PaperSettingIconArea">
        <label @click="ChangeFillType()" style="cursor: pointer">{{FillType}}</label>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 10px;">
        <label>
          总分
        </label>
      </el-row>
      <el-row type="flex" justify="center">
        <label>
          xxx分
        </label>
      </el-row>
    </div>
    <!-- 右侧的内容合适调整 -->
    <div class="StyleStableIcon">
      <!-- 身份识别区 -->
      <el-row type="flex" justify="start">
        <el-col>
          <el-row type="flex" justify="start" style="padding-left: 15px; padding-top: 15px">
            <label>
              答题卡内容基础设置
            </label>
          </el-row>
          <el-divider></el-divider>
        </el-col>
      </el-row>
      <!-- 身份识别区 -->
      <el-row type="flex" justify="start" style="margin-left: 15px">
        <el-col>
          <el-row type="flex" justify="start">
            <label>
              身份识别方式
            </label>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 10px;">
            <el-radio v-model="IDCodeType" label="考号填涂">考号填涂</el-radio>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 5px;">
            <el-radio v-model="IDCodeType" label="条形码">条形码</el-radio>
          </el-row>
        </el-col>
      </el-row>
      <!-- 其他设置区 -->
      <el-row type="flex" justify="start" style="margin-top: 30px; margin-left: 15px">
        <el-col>
          <el-row type="flex" justify="start">
            <label>
              其他内容设置
            </label>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 10px;">
            <el-checkbox v-model="ContentSetting" label="注意事项与缺考标记"></el-checkbox>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 5px;">
            <el-checkbox v-model="ContentSetting" label="存在AB卷"></el-checkbox>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 5px;">
            <el-checkbox v-model="ContentSetting" label="红色答题卡"></el-checkbox>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 5px;">
            <el-checkbox v-model="ContentSetting" label="客观题竖向排列"></el-checkbox>
          </el-row>
          <el-row type="flex" justify="start" style="margin-top: 5px;">
            <el-checkbox v-model="ContentSetting" label="分区答题卡"></el-checkbox>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-row style="min-height: 50vh; border: 1px solid black; margin-right: 7vw;">
      <!-- 关于标题 -->
      <el-row 
        type="flex" 
        justify="center" 
        @mouseleave.native="Expand_Change('title', 0)" 
        @mouseenter.native="Expand_Change('title', 1)">
        <el-row
          v-if="Expand_Model.title == 0" 
          style="border-bottom: 1px solid black; width: 100%; padding-top: 5px"
          type="flex" justify="center">
          <label 
            style="font-size: 20px;">
            {{PaperInfo.title}}
          </label>
        </el-row>
        <el-row 
          v-if="Expand_Model.title == 1"
          class="Focusing_Part" 
          @click.native="Expand_Change('title', 2)"
          style="font-size: 20px; font-weight: bold;"
          type="flex" justify="center">
          {{PaperInfo.title}}
        </el-row>
        <el-row
          v-if="Expand_Model.title == 2" 
          style="font-size: 20px;"
          class="Focusing_Part"
        >
          <el-input style="text-align: center" v-model="PaperInfo.title"></el-input>
        </el-row>
        
      </el-row>
      <!-- 关于答题卡最上面的信息部分 -->
      <el-row>
        <el-col :span="Get_Input_Span()" style="border-right: 1px solid black; border-bottom: 1px solid black; height: 253px">
          <div class="EditArea" @click="Unfinish()">
            <span>编辑</span>
          </div>
          <el-row v-for="Item in UserFillInfo" :key="'User_Fill_' + Item" :style="Get_User_Fill_Line_Style()">
            <el-col :span="4">
              <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 16px; font-weight: bold">{{Item}}：</el-row>
            </el-col>
            <el-col :span="13" :style="Get_User_Fill_UnderLine()"></el-col>
          </el-row>
        </el-col>
        <el-col :span="Get_Code_Span()" style="border-bottom: 1px solid black; height: 253px">
          <!-- 考号填涂 -->
          <el-row
            v-if="IDCodeType == '考号填涂'"
            type="flex"
            justify="center"
            style="height: 36px; line-height: 36px; font-size: 18px; font-weight: bold; width: 100%; border-bottom: 1px solid black"
          >
            准考证号填涂区
          </el-row>
          <el-row
            v-if="IDCodeType == '考号填涂'"
            type="flex"
            justify="center"
          >
            <el-col v-for="I in (PaperInfo.StudentCodeLength - 1)" :key="'Student_Code_' + I" :span="24/PaperInfo.StudentCodeLength" style="border-right: 1px solid black; height: 214px; width: 100%">
              <el-row type="flex" style="height: 34px; width: 100%; border-bottom: 1px solid black">

              </el-row>
              <el-row 
                v-for="J in 10" 
                :key="'SC_' + I + '_' + J" 
                type="flex" 
                justify="center" 
                style="height: 18px; line-height: 18px; font-size: 14px; width: 100%;">
                <span style="margin-right: 12%">[</span>{{J-1}}<span style="margin-left: 12%">]</span>
              </el-row>
            </el-col>
            <el-col :span="24/PaperInfo.StudentCodeLength" style="height: 214px; width: 100%">
              <el-row type="flex" style="height: 34px; width: 100%; border-bottom: 1px solid black">

              </el-row>
              <el-row 
                v-for="J in 10" 
                :key="'SC_' + I + '_' + J" 
                type="flex" 
                justify="center" 
                style="height: 18px; line-height: 18px; font-size: 14px; width: 100%;">
                <span style="margin-right: 12%">[</span>{{J-1}}<span style="margin-left: 12%">]</span>
              </el-row>
            </el-col>
          </el-row>
          <!-- 条形码 -->
          <el-row 
            v-else
            type="flex" 
            justify="center" 
            style="height: 200px; margin: 25px 20px 0px 20px; border: 1px dashed black; border-radius: 20px; line-height: 200px">
            <span style="font-size: 24px">条形码粘贴区</span>
          </el-row>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>

export default {
  name: 'AnswerCard',
  props: {

  },
  data() {
    return {
      // 纸页大小与纸页样式
      PaperType: "A3/B4/8K",
      FillType: "两栏",
      // 身份识别的不同方式
      IDCodeType: "考号填涂",
      // 身份识别左侧的填涂内容
      UserFillInfo: ['考号', '学校', '姓名', '班级'],
      // 身份识别左侧的填涂内容应当有些什么可选项
      UserFillInfoFull: ['考号', '学校', '姓名', '班级', '考场', '座号', '任课老师'],
      // 其他内容是否要放进来
      ContentSetting: [],
      // 废物利用，拿来控制标题
      Expand_Model: {
        title: 0,
      },
      // 试卷信息
      PaperInfo: {
        title: "20210809 - 测试卷用标题",
        StudentCodeLength: 9
      }
    }
  },
  watch: {

  },
  mounted() {
    
  },
  methods: {
    // 根据用户填写项内容的长度来返回这一行的样式信息
    Get_User_Fill_Line_Style(){
      let Style = {
        'height': 250 / this.UserFillInfo.length + 'px',
        'line-height':  250 / this.UserFillInfo.length + 'px'
      }
      return Style
    },
    // 返回用户填写项的下划线填写位置
    Get_User_Fill_UnderLine(){
      let Gap = this.UserFillInfo.length > 5 ? 5 : 10
      let Style = {
        'height': 250 / this.UserFillInfo.length - Gap + 'px',
        'text-align': 'left',
        'border-bottom': '2px solid black'
      }
      return Style
    },
    // 根据学生考号位数或条形码来返回信息输入框的宽度
    Get_Input_Span(){
      if(this.IDCodeType == "条形码"){
        return 16
      }else{
        return 24 - this.PaperInfo.StudentCodeLength
      }
    },
    // 根据学生考号位数或条形码来返回学生辨别区输入框的宽度
    Get_Code_Span(){
      if(this.IDCodeType == "条形码"){
        return 8
      }else{
        return this.PaperInfo.StudentCodeLength
      }
    },
    //暂时提示
    Unfinish(){
      this.$message.warning("正在准备中...")
    },
    ChangePaperType(){
      if(this.PaperType == 'A3/B4/8K'){
        this.PaperType = "A4/B5"
      }else{
        this.PaperType = 'A3/B4/8K'
      }
    },
    ChangeFillType(){
      if(this.FillType == '两栏'){
        this.FillType = "三栏"
      }else{
        this.FillType = "两栏"
      }
    },
    // 废物利用，调整标题格式
    // 比较例外的，调整大题注释的内容的时候
    // 调整标题栏内容
    Expand_Change(part, value){
      this.Expand_Model[part] = value;
      if(value == 0){
        this.Expand_Model.title = 0;
      }
    },
  },
}
</script>
<style>
.PaperStableIcon{
    position: absolute;
    top: 100px;
    height: 400px;
    left: 0px;
    width: 5vw;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    border: 1px solid black;
    border-left-style: none;
    background: white
    
}
.StyleStableIcon{
  position: absolute;
  padding-top: 15px;
  top: 100px;
  height: 500px;
  right: 16px;
  width: 12vw;
  border-bottom-left-radius: 20px;
  border-top-left-radius: 20px;
  border: 1px solid black;
  background: white
}
.PaperSettingIconArea{
  height: 5vw;
  line-height: 5vw;
  text-align: center;
  border: 1px solid black;
  border-radius: 10px;
  width: 5vw;
  margin-bottom: 20px;
  margin-top: 5px;
  cursor: pointer;
}
.Focusing_Part{
  width: 100%; 
  text-align: center; 
  cursor: pointer; 
  padding: 3px; 
  border: 1px dashed black;
  background: #EEF5FE;
  box-sizing: border-box;
}
.EditArea{
  position: relative;
  float: right;
  width: 60px;
  height: 36px;
  background: #409EFD;
  color: white;
  border-bottom-left-radius: 20px;
  font-size: 14px;
  padding-top: 7px;
  cursor: pointer;
  z-index: 10;
}
</style>
<style scoped>

</style>