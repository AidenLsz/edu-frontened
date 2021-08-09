<template>
  <div style="margin-left: 10vw; margin-right: 10vw; min-height: 700px; margin-top: 50px;">
    <el-dialog 
      :visible.sync="Cautions_Editor_Dialog"
      title="编辑注意事项信息"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="true">
      <el-row type="flex" justify="center" style="font-size: 18px; width: 100%"
      >
        <el-input 
          v-model="PaperInfo.Cautions"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8}"
          resize="none"></el-input>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-button type="primary" plain size="small" @click="Cautions_Editor_Dialog = false">完成</el-button>
      </el-row>
    </el-dialog>
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
        <!-- 正常的填涂部分 -->
        <el-col 
          :span="Get_Input_Span()" 
          v-if="ContentSetting.indexOf('注意事项与缺考标记') == -1"
          style="border-right: 1px solid black; border-bottom: 1px solid black; height: 253px"
          @mouseleave.native="Setting_Visible.UserFill = false" 
          @mouseenter.native="Setting_Visible.UserFill = true">
          <el-popover 
            placement="bottom"
            width="150"
            trigger="hover">
            <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.UserFill = true">
              <el-col>
                <el-row type="flex" justify="start">
                  <label>已选信息</label>
                </el-row>
                <el-row 
                  v-for="Item in UserFillInfoFull" 
                  :key="'User_Fill_Full_' + Item" 
                  class="UserFillInfoFullItem"
                  @click.native="Edit_User_Fill_Info(Item)">
                  <el-col :span="20">
                    <el-row type="flex" justify="start">
                      {{Item}}
                    </el-row>
                  </el-col>
                  <el-col :span="4">
                    <el-row type="flex" justify="end">
                      <i class="el-icon-plus" v-if="UserFillInfo.indexOf(Item) == -1"></i>
                      <i class="el-icon-delete" v-else></i>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <div slot="reference" class="EditArea" v-show="Setting_Visible.UserFill">
              <span>编辑</span>
            </div>
          </el-popover>
          <el-row v-for="Item in UserFillInfo" :key="'User_Fill_' + Item" :style="Get_User_Fill_Line_Style()">
            <el-col :span="4">
              <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 1.5rem; font-weight: bold">{{Item}}：</el-row>
            </el-col>
            <el-col :span="13" :style="Get_User_Fill_UnderLine()"></el-col>
          </el-row>
        </el-col>
        <!-- 带有注意事项与缺考标记的部分 -->
        <el-col 
          :span="Get_Input_Span()" 
          v-else
          style="border-right: 1px solid black; border-bottom: 1px solid black; height: 253px"
          >
          <el-row type="flex" justify="center">
            <el-col 
              style="height: 90px; border-bottom: 1px solid black"
              @mouseleave.native="Setting_Visible.UserFill = false" 
              @mouseenter.native="Setting_Visible.UserFill = true"
              >
              <el-popover 
                placement="bottom"
                width="150"
                trigger="hover">
                <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.UserFill = true">
                  <el-col>
                    <el-row type="flex" justify="start">
                      <label>已选信息</label>
                    </el-row>
                    <el-row 
                      v-for="Item in UserFillInfoFull" 
                      :key="'User_Fill_Full_' + Item" 
                      class="UserFillInfoFullItem"
                      @click.native="Edit_User_Fill_Info(Item)">
                      <el-col :span="20">
                        <el-row type="flex" justify="start">
                          {{Item}}
                        </el-row>
                      </el-col>
                      <el-col :span="4">
                        <el-row type="flex" justify="end">
                          <i class="el-icon-plus" v-if="UserFillInfo.indexOf(Item) == -1"></i>
                          <i class="el-icon-delete" v-else></i>
                        </el-row>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <div slot="reference" class="EditArea" v-show="Setting_Visible.UserFill">
                  <span>编辑</span>
                </div>
              </el-popover>
              <el-row v-for="Item in UserFillInfo" :key="'User_Fill_' + Item" :style="Get_User_Fill_Line_Style_Mix()">
                <el-col :span="4">
                  <el-row type="flex" justify="start" style="padding-left: 2vw; font-size: 1.5rem; font-weight: bold">{{Item}}：</el-row>
                </el-col>
                <el-col :span="13" :style="Get_User_Fill_UnderLine_Mix()"></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" style="padding-left: 2vw; border-bottom: 1px solid black; height: 30px; line-height: 30px">
            <span style="font-weight: bold">正确填涂：</span><span style="margin-left: 20px; margin-top: 7px; height: 16px; background: black; width: 40px"></span>
          </el-row>
          <el-row type="flex" justify="start" style="padding-left: 2vw; border-bottom: 1px solid black; height: 30px; line-height: 30px">
            <span style="font-weight: bold">缺考标记：</span><span style="margin-left: 20px; margin-top: 7px; height: 16px; background: transparent; width: 40px; border: 1px solid black"></span>
          </el-row>
          <!-- 关于注意事项 -->
          <el-row 
            type="flex" 
            justify="center"
            @mouseleave.native="Expand_Change('cautions', 0)" 
            @mouseenter.native="Expand_Change('cautions', 1)">
            <el-row
              v-if="Expand_Model.cautions == 0" 
              style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%"
              type="flex" justify="center">
              <span 
                style="font-size: 14px; white-space: pre-line; text-align: left; width: 100%; color: #909399">
                {{PaperInfo.Cautions}}
              </span>
            </el-row>
            <el-row 
              v-if="Expand_Model.cautions == 1"
              class="Focusing_Part" 
              @click.native="Expand_Change('cautions', 2)"
              style="font-size: 14px; font-weight: bold; min-height: 20px; white-space: pre-line; text-align: left; width: 100%;"
              type="flex" justify="start">
              {{PaperInfo.Cautions}}
            </el-row>
            <el-row
              v-if="Expand_Model.cautions == 2" 
              style="font-size: 18px; width: 100%"
              class="Focusing_Part"
            >
              <el-input 
                v-model="PaperInfo.Cautions"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                resize="none"></el-input>
            </el-row>
          </el-row>
        </el-col>
        <!-- 填涂准考证号或贴条形码的部分 -->
        <el-col 
          :span="Get_Code_Span()" 
          style="border-bottom: 1px solid black; height: 253px"
          @mouseleave.native="Setting_Visible.IDCode = false" 
          @mouseenter.native="Setting_Visible.IDCode = true"
          >
          <el-popover 
            placement="bottom"
            width="150"
            trigger="hover">
            <el-row type="flex" justify="start" @mouseenter.native="Setting_Visible.IDCode = true">
              <el-col>
                <el-row type="flex" justify="start">
                  <label>当前考号位数</label>
                </el-row>
                <el-row type="flex" justify="start">
                  <el-input-number v-model="PaperInfo.StudentCodeLength" placeholder="" :min="4" :max="12"></el-input-number>
                </el-row>
              </el-col>
            </el-row>
            <div slot="reference" class="EditArea" v-show="Setting_Visible.IDCode && IDCodeType == '考号填涂'">
              <span>编辑</span>
            </div>
          </el-popover>
          <!-- 考号填涂 -->
          <el-row
            v-if="IDCodeType == '考号填涂'"
            style="height: 36px; line-height: 36px; font-size: 18px; font-weight: bold; width: 100%; border-bottom: 1px solid black; text-align: center"
          >
            准考证号填涂区
          </el-row>
          <el-row
            v-if="IDCodeType == '考号填涂'"
            type="flex"
            justify="center"
          >
            <el-col v-for="Ind in PaperInfo.StudentCodeLength - 1" :key="'Student_Code_' + Ind" :span="24/PaperInfo.StudentCodeLength" style="border-right: 1px solid black; height: 214px; width: 100%">
              <el-row type="flex" style="height: 34px; width: 100%; border-bottom: 1px solid black">

              </el-row>
              <el-row 
                v-for="J in 10" 
                :key="'SC_' + Ind + '_' + J" 
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
                :key="'SC_' + Ind + '_' + J" 
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
      <!-- 关于题目填涂的部分 -->
      <el-row v-for="(Bundle, Bundle_Index) in Question_Lists" :key="'Question_Bundle_' + Bundle_Index">
        这里要加一个{{Bundle.type}}的填涂组
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
      Question_Lists: [],
      Cautions_Editor_Dialog: false,
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
      // 废物利用，拿来控制标题和注意事项
      Expand_Model: {
        title: 0,
        cautions: 0
      },
      // 试卷信息
      PaperInfo: {
        title: "20210809 - 测试卷用标题",
        StudentCodeLength: 9,
        Cautions: "注意事项：\n答题前填写好自己的班级、姓名、考号等信息。\n请将答案正确填写在答题卡上。\n填涂时用2B铅笔将选项涂黑涂满，修改时用橡皮擦干净。注意题号顺序并保持卷面整洁，请勿折叠或做标记。"
      },
      Setting_Visible: {
        // 左侧填写框
        UserFill: false,
        // 右侧填涂框（只在非条形码时生效）
        IDCode: false,
        // 注意事项
        Cautions: false
      }
    }
  },
  watch: {
    ContentSetting(newVal, oldVal){
      if(newVal.indexOf('注意事项与缺考标记') != oldVal.indexOf('注意事项与缺考标记')){
        if(newVal.indexOf('注意事项与缺考标记') != -1){
          this.UserFillInfo = ['考号', '姓名', '班级']
        }else{
          this.UserFillInfo = ['考号', '学校', '姓名', '班级']
        }
      }
    },
  },
  mounted() {
    this.Question_Lists = JSON.parse(sessionStorage.getItem('CombinePaper_AnswerCard'))
  },
  methods: {
    Edit_Cautions(){
      this.Setting_Visible.Cautions = true;
      this.$refs.CautionsEditor.focus;
    },
    // 修改左侧区域的显示内容
    Edit_User_Fill_Info(Item){
      if(this.ContentSetting.indexOf('注意事项与缺考标记') == -1){
        let Index = this.UserFillInfo.indexOf(Item)
        if(Index != -1){
          this.UserFillInfo.splice(Index, 1)
        }else{
          this.UserFillInfo.push(Item)
        }
        this.Sort_User_Fill_Info();
      }else{
        let Index = this.UserFillInfo.indexOf(Item)
        if(Index != -1){
          this.UserFillInfo.splice(Index, 1)
        }else if(this.UserFillInfo.length < 3){
          this.UserFillInfo.push(Item)
        }else{
          this.$message.error("在添加注意事项与缺考标记的情况下，最多选择三项进行显示。")
        }
        this.Sort_User_Fill_Info();
      }
    },
    // 排序
    Sort_User_Fill_Info(){
      let Result = [];
      for(let i = 0; i < this.UserFillInfoFull.length; i++){
        if(this.UserFillInfo.indexOf(this.UserFillInfoFull[i]) != -1){
          Result.push(this.UserFillInfoFull[i])
        }
      }
      this.UserFillInfo = Result
    },
    // 根据用户填写项内容的长度来返回这一行的样式信息
    Get_User_Fill_Line_Style(){
      let Style = {
        'height': 250 / this.UserFillInfo.length + 'px',
        'line-height':  250 / this.UserFillInfo.length + 'px'
      }
      return Style
    },
    // 根据用户填写项内容的长度来返回这一行的样式信息 - 混合版本
    Get_User_Fill_Line_Style_Mix(){
      let Style = {
        'height': 90 / this.UserFillInfo.length + 'px',
        'line-height':  90 / this.UserFillInfo.length + 'px'
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
    // 返回用户填写项的下划线填写位置 - 混合版本
    Get_User_Fill_UnderLine_Mix(){
      let Style = {
        'height': 90 / this.UserFillInfo.length - 5 + 'px',
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
        if(this.PaperInfo.StudentCodeLength < 10){
          return 24 - this.PaperInfo.StudentCodeLength
        }
        else{
          return 15
        }
      }
    },
    // 根据学生考号位数或条形码来返回学生辨别区输入框的宽度
    Get_Code_Span(){
      if(this.IDCodeType == "条形码"){
        return 8
      }else{
        if(this.PaperInfo.StudentCodeLength < 10){
          return this.PaperInfo.StudentCodeLength
        }
        else{
          return 9
        }
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
        this.Expand_Model.cautions = 0;
      }
      if(value == 0 && part == 'cautions'){
        let List = this.PaperInfo.Cautions.split("\n");
        if(List.length > 4){
          this.$message.error("已将您超出四行的部分进行了一定的压缩，请控制在四行以内。")
          let Str = List[3]
          for(let i = 4; i < List.length; i++){
            Str = Str + List[i]
          }
          List.splice(3, List.length, Str)
        }
        this.PaperInfo.Cautions = List.join("\n")
      }
    },
  },
}
</script>
<style>
/* 左侧，答题卡纸样控制区域 */
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
/* 右侧，答题卡内容控制区域 */
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
/* 以后用于替换点击切换纸样图标的占位Style */
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
/* 用于处理试卷标题的样式 */
.Focusing_Part{
  width: 100%; 
  text-align: center; 
  cursor: pointer; 
  padding: 3px; 
  border: 1px dashed black;
  background: #EEF5FE;
  box-sizing: border-box;
}
/* 编辑区域的通用Style */
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
/* 输入编辑区域选项的通用Style 1 */
.UserFillInfoFullItem{
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
  font-size: 14px;
}
.UserFillInfoFullItem:hover{
  border: 1px dashed #409EFD;
  border-radius: 5px;
}
</style>
<style scoped>

</style>