<template>
  <div style="margin-top: 10px; padding-left: 5vw; padding-right: 5vw">
    <el-dialog
        :visible.sync="Wrong_Char_Dialog"
        title="格式错误提示"
        width="40%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <div v-html="Wrong_Char_Info"></div>
        <el-button
            type="danger"
            @click="Wrong_Char_Dialog = false"
            style="margin-top: 30px;"
            >确认</el-button>
    </el-dialog>
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
    <el-row type="flex" justify="start" style="margin-top: -1vh; margin-bottom: -1vh">
        <el-col :span="2">
            <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; font-size: 18px">
                <label>题库</label>
            </el-row>
        </el-col>
        <el-col :span="21">
            <el-row type="flex" justify="start">
                <el-select v-model="Item_Group" placeholder="请选择题库">
                <el-option
                    v-for="(item,i) in Item_Group_List"
                    :key="i"
                    :label="item.val"
                    :value="item.key">
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
                <el-col v-for="Type in Type_List" :key="'Ques_Type_' + Type.label" :span="24/8">
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
    <el-row type="flex" justify="center" style="border: 3px solid #409EFF; min-height: 30vh; border-radius: 15px; margin-top: 30px; margin-bottom: 30px;">
        <OptionQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['单选题', '多选题', '判断题'].indexOf(Type) != -1" :detailType.sync="Type"></OptionQuestions>
        <FillQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['填空题'].indexOf(Type) != -1" :detailType.sync="Type"></FillQuestions>
        <AnswerQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['简答题', '计算题'].indexOf(Type) != -1" :detailType.sync="Type"></AnswerQuestions>
        <MixQuestions @Emit_And_Submit="Prepare_For_Submit" style="width: 100%" v-if="['综合题'].indexOf(Type) != -1" :detailType.sync="Type"></MixQuestions>
    </el-row>
  </div>
</template>

<script>

import OptionQuestions from '@/views/resourceInput/components/OptionQuestions'
import FillQuestions from '@/views/resourceInput/components/FillQuestions.vue'
import AnswerQuestions from '@/views/resourceInput/components/AnswerQuestions.vue'
import MixQuestions from '@/views/resourceInput/components/MixQuestions.vue'

import {commonAjax} from '@/common/utils/ajax'

export default {
  name: "inputMarked",
  components: {
      OptionQuestions, FillQuestions, AnswerQuestions, MixQuestions
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
        Item_Group:'',
        Item_Group_List:[],
        // 老东西，Check_Do用到的过滤列表
        // 用于输入符号提示的部分
        en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
        ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
        math_pun_list: ['+', '-', "*", "/", "%", "="],
        // 用于展示哪些字符需要修改的对话框
        Wrong_Char_Dialog: false,
        // 用于展示错误数据的信息栏
        Wrong_Char_Info: "",
        // 保存用户的UUID信息
        UUID: ""
    };
  },
  mounted(){
      if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
        this.$message.error("您尚未登录，请登录后使用录入功能。")
        this.$router.push("/")
        return
      }
      this.Get_User_UUID();
      this.To_Top();
      this.Get_Item_Group_List();
  },
  methods:{
        // 卷动至最上方
        To_Top(){
            window.scrollTo(0,0);
        },
        // 获取UUID
        Get_User_UUID(){
            commonAjax(this.backendIP + '/api/getUserUUID', {}).then((res)=>{
                this.UUID = res.UUID
            }).catch(
                (err)=>{
                console.log(err)
                console.log("Failed.")
                }
            )
        },
        Get_Item_Group_List(){
          commonAjax(this.backendIP+'/api/get_user_ig_name',
            {
              type:'Question',
              action:'W',
              ig_ID_required:true,
            }
          ).then((res)=>{
            for (var name in res.ig_name) {
              this.Item_Group_List.push({key:res.ig_name[name].ig_ID,val:name})
            }
            if (this.Item_Group_List.length>0) {
              this.Item_Group=this.Item_Group_List[0].key
            }
          })
        },
      // 跳转至整卷录入页面
      toPaper(){
        this.$router.push({path: "/inputPaper"})
      },
      // 返回按钮样式
      Get_Type_Button_Class(Type){
          if(Type.value == this.Type){
              return "typeButton focusType"
          }else{
              return "typeButton unFocusType"
          }
      },
      // 切换当前想录入的题目类型
      Type_Change(Type_value){
          this.Type = Type_value
      },
    Prepare_For_Submit(Ques){

        this.Wrong_Char_Info = ""
        this.Wrong_Char_Dialog = false

        if(this.Type != '综合题'){

            // 名称格式修正一下
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            if(['单选题', '多选题', '判断题'].indexOf(this.Type) != -1){
                let Str = Question.stem
                let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                let res = Quote_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                    res = Quote_Reg.exec(Str)
                }
                Question.stem = Str
            }else if(this.Type == '填空题'){
                let Str = Question.stem
                let Space_Reg = new RegExp("____+", 'g')
                let res = Space_Reg.exec(Str)
                while(res != null){
                    Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                    res = Space_Reg.exec(Str)
                }
                Question.stem = Str
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return
            }

            // 开始检测选项部分
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.options.length; i++){
                // 必填项检测
                if(Question.options[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }

            // 内容检测
            for(let i = 0; i < Question.options.length; i++){

                let C_Option_Item = this.Check_Do(Question.options[i])
                if(C_Option_Item[2]){
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Option_Item[1].length == 0){
                    Question.options.splice(i, 1, C_Option_Item[0])
                }else{
                    this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Option_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }
            // this.$message.success("选项内容格式检测已通过。")

            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }
            // this.$message.success("答案内容格式检测已通过。")

            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }

            // 小题内容检测 - 必填检测
            this.Wrong_Char_Info = ""
            for(let i = 0; i < Question.sub_questions.length; i++){
                if(Question.sub_questions[i].length == 0){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                }
            }
            if(this.Wrong_Char_Info != ""){
                this.Wrong_Char_Dialog = true;
                return
            }
            // 内容检测
            for(let i = 0; i < Question.sub_questions.length; i++){
                let C_Sub_Ques_Item = this.Check_Do(Question.sub_questions[i])
                if(C_Sub_Ques_Item[2]){
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Sub_Ques_Item[1].length == 0){
                    Question.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                }else{
                    this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }

            this.Submit_Normal_Ques(Question);
        }
        // 开始检测综合题部分
        else{

            // 名称规范化
            let Question = JSON.parse(Ques);

            // 必填项检测
            if(Question.stem.length == 0){
                this.Wrong_Char_Info = "题干项尚未填写。"
                this.Wrong_Char_Dialog = true
                return
            }

            // 开始检测题干项是否正确
            let C_Stem = this.Check_Do(Question.stem);
            if(C_Stem[2]){
                this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                this.Wrong_Char_Dialog = true
                return
            }else if(C_Stem[1].length == 0){
                Question.stem = C_Stem[0]
            }else{
                this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                for(let i = 0; i < C_Stem[1].length; i++){
                    this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                }
                this.Wrong_Char_Dialog = true
                return
            }

            // 检测答案项部分，由于是非必填项，不填也没事
            if(Question.answer.length != 0){
                let C_Answer = this.Check_Do(Question.answer);
                if(C_Answer[2]){
                    this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Answer[1].length == 0){
                    Question.answer = C_Answer[0]
                }else{
                    this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Answer[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }

            // 检测解析字段 - 不填也没事
            if(Question.analysis.length != 0){
                let C_Analysis = this.Check_Do(Question.analysis);
                if(C_Analysis[2]){
                    this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Analysis[1].length == 0){
                    Question.analysis = C_Analysis[0]
                }else{
                    this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Analysis[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }
            }

            for(let j = 0; j < Question.sub_questions.length; j++){

                let Item = Question.sub_questions[j]
                // 重置提示信息
                this.Wrong_Char_Info = ""

                // 必填项检测
                if(Item.stem.length == 0){
                    this.$message.error("题干项尚未填写。")
                    return
                }

                if(['单选题', '多选题', '判断题'].indexOf(Question.sub_questions[j].type) != -1){
                    let Str = Question.sub_questions[j].stem
                    let Quote_Reg = new RegExp("(\\(|\\（)(\\s*)(\\)|\\）)", "g")
                    let res = Quote_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Quote_Reg, "$\\SIFChoice$")
                        res = Quote_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }else if(Question.sub_questions[j].type == '填空题'){
                    let Str = Question.sub_questions[j].stem
                    let Space_Reg = new RegExp("____+", 'g')
                    let res = Space_Reg.exec(Str)
                    while(res != null){
                        Str = Str.replace(Space_Reg, "$\\SIFBlank$")
                        res = Space_Reg.exec(Str)
                    }
                    Question.sub_questions[j].stem = Str
                }

                // 开始检测题干项是否正确
                let C_Stem = this.Check_Do(Item.stem);
                if(C_Stem[2]){
                    this.Wrong_Char_Info = "题干部分存在包裹不完全的 Latex 公式，请修正后重试"
                    this.Wrong_Char_Dialog = true
                    return
                }else if(C_Stem[1].length == 0){
                    Item.stem = C_Stem[0]
                }else{
                    this.Wrong_Char_Info = "题干部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                    for(let i = 0; i < C_Stem[1].length; i++){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Stem[1][i].position + " 处的 " + C_Stem[1][i].char + " 字符。<br>"
                    }
                    this.Wrong_Char_Dialog = true
                    return
                }

                // 开始检测选项部分
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.options.length; i++){
                    // 必填项检测
                    if(Item.options[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "选项 " + String.fromCharCode( 65 + i ) + " 尚未填写。请注意所有选项都是必填项。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }

                // 内容检测
                for(let i = 0; i < Item.options.length; i++){

                    let C_Option_Item = this.Check_Do(Item.options[i])
                    if(C_Option_Item[2]){
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Option_Item[1].length == 0){
                        Item.options.splice(i, 1, C_Option_Item[0])
                    }else{
                        this.Wrong_Char_Info = "选项" + String.fromCharCode( 65 + i ) + "部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Option_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Option_Item[1][j].position + " 处的 " + C_Option_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return
                    }
                }

                if(Item.answer.length != 0){
                    let C_Answer = this.Check_Do(Item.answer);
                    if(C_Answer[2]){
                        this.Wrong_Char_Info = "你的答案部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Answer[1].length == 0){
                        Item.answer = C_Answer[0]
                    }else{
                        this.Wrong_Char_Info = "你的答案部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Answer[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Answer[1][i].position + " 处的 " + C_Answer[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return
                    }
                }

                if(Item.analysis.length != 0){
                    let C_Analysis = this.Check_Do(Item.analysis);
                    if(C_Analysis[2]){
                        this.Wrong_Char_Info = "解析部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Analysis[1].length == 0){
                        Item.analysis = C_Analysis[0]
                    }else{
                        this.Wrong_Char_Info = "解析部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let i = 0; i < C_Analysis[1].length; i++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Analysis[1][i].position + " 处的 " + C_Analysis[1][i].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return
                    }
                }

                // 小题内容检测 - 必填检测
                this.Wrong_Char_Info = ""
                for(let i = 0; i < Item.sub_questions.length; i++){
                    if(Item.sub_questions[i].length == 0){
                        this.Wrong_Char_Info = this.Wrong_Char_Info + "第 " + (i+1) + " 小题尚未填写。<br>"
                    }
                }
                if(this.Wrong_Char_Info != ""){
                    this.Wrong_Char_Dialog = true;
                    return
                }
                // 内容检测
                for(let i = 0; i < Item.sub_questions.length; i++){
                    let C_Sub_Ques_Item = this.Check_Do(Item.sub_questions[i])
                    if(C_Sub_Ques_Item[2]){
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在包裹不完全的 Latex 公式，请修正后重试"
                        this.Wrong_Char_Dialog = true
                        return
                    }else if(C_Sub_Ques_Item[1].length == 0){
                        Item.sub_questions.splice(i, 1, C_Sub_Ques_Item[0])
                    }else{
                        this.Wrong_Char_Info = "第" + ( i + 1 ) + "小题的部分存在不合适的字符，请修改、删除或将其包裹于 $ 字符内后再次尝试上传，以下是详细信息：<br><br>"
                        for(let j = 0; j < C_Sub_Ques_Item[1].length; j++){
                            this.Wrong_Char_Info = this.Wrong_Char_Info + "位于第 " + C_Sub_Ques_Item[1][j].position + " 处的 " + C_Sub_Ques_Item[1][j].char + " 字符。<br>"
                        }
                        this.Wrong_Char_Dialog = true
                        return
                    }
                }
            }
            this.Submit_Mix_Ques(Question)
        }
    },
    // 将基础题转化为可以入库的格式的部分
    Submit_Normal_Ques(Ques){

        var Temp_Result = ""

        if(['单选题', '多选题', '判断题', '填空题'].indexOf(this.Type) != -1){

            let Temp_Doc = {
                type: this.Type,
                stem: Ques.stem,
                stem_image: Ques.stem_image,
                score: parseFloat(Ques.score + ""),
                options: Ques.options,
                options_image: Ques.options_image,
                answer: Ques.answer,
                answer_image: Ques.answer_image,
                analysis: Ques.analysis,
                analysis_image: Ques.analysis_image
            }

            Temp_Result = Temp_Doc

        }else if(['简答题', '计算题'].indexOf(this.Type) != -1){


            let Temp_Doc = {
                desc: Ques.stem,
                desc_image: Ques.stem_image,
                type: "大题",
                score: parseFloat(Ques.score + ""),
                subquestions: [],
                answer: Ques.answer,
                answer_image: Ques.answer_image,
                analysis: Ques.analysis,
                analysis_image: Ques.analysis_image
            }


            for(let i = 0; i < Ques.sub_questions.length; i++){
                let Item = {
                    type: this.Type,
                    score: parseFloat(Ques.sub_questions_score[i] + ""),
                    stem: Ques.sub_questions[i],
                    stem_image: Ques.sub_questions_image[i],
                    options: [],
                    options_image: [],
                    answer: "",
                    answer_image: [],
                    analysis: "",
                    analysis_image: []
                }
                Temp_Doc.subquestions.push(Item)
            }
            Temp_Result = Temp_Doc
        }
        this.Submit_Do(Temp_Result)
    },
    // 将综合题转化为可以入库的格式的部分
    Submit_Mix_Ques(Ques){
        let Temp_Doc = {
            desc: "",
            desc_image: [],
            type: "大题",
            score: 0,
            subquestions: [],
            answer: "",
            answer_image: [],
            analysis: "",
            analysis_image: []
        }

        Temp_Doc.desc = Ques.stem;
        Temp_Doc.desc_image = Ques.stem_image;

        Temp_Doc.score = parseFloat(Ques.score + "");

        for(let i = 0; i < Ques.sub_questions.length; i++){
            let Item = {
                type: Ques.sub_questions[i].type,
                score: parseFloat(Ques.sub_questions[i].score + ""),
                stem: Ques.sub_questions[i].stem,
                stem_image: Ques.sub_questions[i].stem_image,
                options: Ques.options,
                options_image: Ques.options_image,
                answer: Ques.sub_questions[i].answer,
                answer_image: Ques.sub_questions[i].answer_image,
                analysis: Ques.sub_questions[i].analysis,
                analysis_image: Ques.sub_questions[i].analysis_image
            }

          Temp_Doc.subquestions.push(Item)
        }

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_image = Ques.answer_image;

        Temp_Doc.analysis = Ques.analysis;
        Temp_Doc.analysis_image = Ques.analysis_image;

        this.Submit_Do(Temp_Doc)

    },
    Submit_Do(Submit_JSON){
        let Param = {
            'Input_Data': JSON.stringify({
                            "post_type": 0,
                            "user_id": this.UUID,
                            "subject": this.Subject,
                            "period": this.Period,
                            "questions": JSON.stringify(Submit_JSON),
                            'ig_ID':this.Item_Group,
                            }, null, 4),
            'questionInput': true,
            'ig_ID':this.Item_Group
        }

        commonAjax(this.backendIP + '/api/mathUpload', Param).then(()=>{
            this.$message.success("入库完成")
            this.Uploading = false;
        }).catch(
            ()=>{
                this.$message.error("入库失败")
                this.Uploading = false;
            }
        )
    },
    // 负责实际检查的部分
    Check_Do(content){

        let remakeContent = "";

        var latexFlag = false;
        let Regx = /[A-Za-z0-9]/;

        var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
        var Result_List = Img_Catcher.exec(content);

        var Img_SE = [];
        var Start = 0;

        let Wrong_Char = [];

        while(Result_List != null){
            var Temp_Catcher = '<img src="' + Result_List[1] + '">';
            if(Img_SE.length > 0){
                Start = content.indexOf(Temp_Catcher, Img_SE[Img_SE.length - 1][1]);
            }
            else{
                Start = content.indexOf(Temp_Catcher);
            }
            Img_SE.push([Start, Start + Temp_Catcher.length - 1])
            Result_List = Img_Catcher.exec(content);
        }

        var Img_Index = 0;

        for(var i = 0; i < content.length; i++){

            if(content[i] == '$' && !latexFlag){
                latexFlag = true;
            }else if(content[i] == '$' && latexFlag){
                latexFlag = false;
            }

            if(Img_SE.length > 0 && i >= Img_SE[Img_Index][0] && i <= Img_SE[Img_Index][1]){
                remakeContent = remakeContent + content[i];
                continue;
            }else if(Img_SE.length > 0 && i > Img_SE[Img_Index][1] && Img_Index < Img_SE.length - 1){
                Img_Index = Img_Index + 1
            }

            if(!latexFlag){
                if (Regx.test(content[i]) || this.math_pun_list.indexOf(content[i]) != -1) {
                    if(remakeContent[remakeContent.length - 1] == '$'){
                        remakeContent = remakeContent.substring(0, remakeContent.length - 1) + content[i] + "$";
                    }else if(['i', 'b'].indexOf(content[i]) != -1 &&
                        (
                            (content[i - 1] == '/' && content[i - 2] == '<' && content[i + 1] == '>') ||
                            (content[i - 1] == '<' && content[i + 1] == '>')
                        )
                    ){
                        remakeContent = remakeContent + content[i]
                    }else if(content[i] == '/' && ['i', 'b'].indexOf(content[i+1]) != -1 && content[i-1] == '<' && content[i+2] == '>'){
                        remakeContent = remakeContent + content[i]
                    }else{
                        remakeContent = remakeContent + "$" + content[i] + "$";
                    }
                }
                // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
                else if(!(content.charCodeAt(i) > 255 ||
                        this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
                        content[i] == ' ' || content[i] == '$' ||
                        content.charCodeAt(i) == 10)
                        ){
                    Wrong_Char.push({
                        position: i+1,
                        char: content[i]
                    })
                    remakeContent = remakeContent + content[i];
                }
                else {
                    remakeContent = remakeContent + content[i];
                }
            }else{
                remakeContent = remakeContent + content[i];
            }
        }
        return [remakeContent, Wrong_Char, latexFlag]
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
