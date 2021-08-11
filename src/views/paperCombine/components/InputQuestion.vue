<template>
  <div style=" margin-top: 5vh; margin-bottom: 5vh; min-height: 40vh">
    <!-- 提供给选择题的编辑器 -->
    <el-dialog 
        :visible.sync="showDialog" 
        title="请编辑想要插入/修改的选择题内容" 
        width="65%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :key="Refresh + '1'"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'questionAnalyseInput_Option'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <OptionQuestions 
            @EditFinish="New_Questions" 
            @ReEditFinish="ReEdit_Questions" 
            :RE.sync="ReEditSwitch" 
            :QInfos.sync="Temp_OptionQuestionInfo" 
            ref="OptionQuestionsEditor">
        </OptionQuestions>
    </el-dialog>
    <!-- 提供给填空题的编辑器 -->
    <el-dialog 
        :visible.sync="showDialog_Fill" 
        title="请编辑想要插入/修改的填空题内容" 
        width="80%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :key="Refresh + '2'"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'questionAnalyseInput_Fill'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <FillQuestions
            @EditFinish="New_Questions" 
            @ReEditFinish="ReEdit_Questions" 
            :RE.sync="ReEditSwitch" 
            :QInfos.sync="Temp_FillQuestionInfo" 
        ></FillQuestions>
    </el-dialog>
    <!-- 提供给解答题的编辑器 -->
    <el-dialog 
        :visible.sync="showDialog_Answer" 
        title="请编辑想要插入/修改的解答题内容" 
        width="80%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :key="Refresh + '3'"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'questionAnalyseInput_Answer'"></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示LUNA输入助手</label></el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <AnswerQuestions
            @EditFinish="New_Questions" 
            @ReEditFinish="ReEdit_Questions" 
            :RE.sync="ReEditSwitch" 
            :QInfos.sync="Temp_AnswerQuestionInfo" 
        ></AnswerQuestions>
    </el-dialog>
    <el-row type="flex" justify="start" style="margin-left: 5vw; margin-right: 5vw;">
      <el-col>
        <el-row type="flex" justify="start" style="margin-bottom: 10px; font-size: 16px">
          当前您正在录入的题目属于： {{Period + Subject}} 题目
        </el-row>
        <el-row type="flex" justify="start" style="margin-bottom: 10px;">
          <el-col :span="2">
            <el-row type="flex" justify="start" style="font-size: 16px; margin-top: 1.2vh">
              点击录入：
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <i class="el-icon-circle-check" style="font-size: 24px; margin-top: 1.2vh"></i>
              <el-button type="text" style="font-size: 16px; color: black; padding-left: 15px" @click="Change_Type('option')">选择题</el-button>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <i class="el-icon-full-screen" style="font-size: 24px; margin-top: 1.2vh"></i>
              <el-button type="text" style="font-size: 16px; color: black; padding-left: 15px" @click="Change_Type('fill')">填空题</el-button>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <i class="el-icon-edit-outline" style="font-size: 24px; margin-top: 1.2vh"></i>
              <el-button type="text" style="font-size: 16px; color: black; padding-left: 15px" @click="Change_Type('answer')">解答题</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" style="margin-left: 5vw; font-size: 16px; margin-bottom: 15px">
      <label>录入内容速览：</label>
    </el-row>
    <el-row style="background: #F8FBFF; min-height: 50vh; margin-left: 5vw; margin-right: 5vw; padding-top: 3vh; margin-bottom: 30px">
      <OptionDisplay v-if="Type_Now == 'option'" :QI="Temp_OptionQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></OptionDisplay>
      <FillDisplay v-else-if="Type_Now == 'fill'" :QI="Temp_FillQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></FillDisplay>
      <AnswerDisplay v-else-if="Type_Now == 'answer'" :QI="Temp_AnswerQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></AnswerDisplay>
    </el-row>
    <el-row v-if="Type_Now != '-1'">
      <el-col :span="8">
        <el-button type="primary" plain @click="Edit_Question()">重新编辑</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="danger" plain @click="Type_Now = '-1'; Reset_Params()">清空数据</el-button>
      </el-col>
      <el-col :span="8">
        <el-button type="success" plain @click="Add_To_Question_Cart()">加入试题篮</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import ComplexInput from '@/common/components/ComplexInput'

import OptionDisplay from '@/views/resourceInput/components/OptionDisplay.vue'
import OptionQuestions from '@/views/resourceInput/components/OptionQuestions.vue'
import FillQuestions from "@/views/resourceInput/components/FillQuestions.vue"
import FillDisplay from "@/views/resourceInput/components/FillDisplay.vue";
import AnswerQuestions from "@/views/resourceInput/components/AnswerQuestions.vue";
import AnswerDisplay from "@/views/resourceInput/components/AnswerDisplay.vue";

export default {
  name: 'InputQuestion',
  props: {
      Subject: {
          type: String,
          default: "数学"
      },
      Period: {
          type: String,
          default: "高中"
      }
  },
  components: { ComplexInput,
                OptionDisplay, OptionQuestions,
                FillQuestions, FillDisplay,
                AnswerQuestions, AnswerDisplay},
  data() {
    return {
      // 刷新
      Refresh: false,
      // 打开LUNA输入助手的控制
      complex_Input: false,
      // 当前题目类型
      Type_Now: "-1",
      // 缓存题目类型
      Type_Cache: "-1",
      // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
      showDialog: false,
      showDialog_Fill: false,
      showDialog_Answer: false,
      // 重写编辑标记
      ReEditSwitch: false,
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      math_pun_list: ['+', '-', "*", "/", "%", "="],
      // 默认的几种题目类型的空数据
      Temp_OptionQuestionInfo: {

          type: "option",
          // 分值
          score: 5,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 选项的部分
          options: ["", "", "", ""],
          options_images: ["", "", "", ""],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: [],
          // 试题类型细节
          detail_type: "单选题"

      },
      Temp_FillQuestionInfo: {

          type: "fill",
          // 分值
          score: 5,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: [],
          // 试题类型细节
          detail_type: "填空题"

      },
      Temp_AnswerQuestionInfo: {

          type: "answer",
          // 分值
          score: 5,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 小题的部分
          sub_questions: [""],
          sub_questions_images: [[]],
          sub_questions_scores: [5],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: [],
          // 试题类型细节
          detail_type: "简答题"

      }
    }
  },
  watch:{

  },
  mounted() {

  },
  methods: {
    // 调整临时存储的题目对象类型，只有等到题目确实输入了才会放给显示模块
    Change_Type(Type){
      this.Type_Cache = Type;
      if(Type == 'option'){
          this.showDialog = true;
      }else if(Type == 'fill'){
          this.showDialog_Fill = true;
      }else if(Type == 'answer'){
          this.showDialog_Answer = true;
      }
    },
    Editor_Dialog_Close(){
        this.Close_Editor();
    },
    New_Questions(val){
      // 获取新题目的类型
      this.Type_Now = this.Type_Cache;
      // 清空三种类型的数据的基础数据
      this.Temp_OptionQuestionInfo = {

          type: "option",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 选项的部分
          options: ["", "", "", ""],
          options_images: ["", "", "", ""],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }

      this.Temp_FillQuestionInfo = {

          type: "fill",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }

      this.Temp_AnswerQuestionInfo = {

          type: "answer",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 小题的部分
          sub_questions: [""],
          sub_questions_images: [[]],
          sub_questions_scores: [1],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }
      // 这里拿来获取字符整理后的数据
      let temp_val = ""
      // 三种题型分开一点处理
      if(this.Type_Now == 'option'){
          temp_val = this.Normal_Char_Check(val);
        if(temp_val != false){
          this.Temp_OptionQuestionInfo = temp_val;
        }else{
          this.Temp_OptionQuestionInfo = val;
        }
      }else if(this.Type_Now == 'fill'){
          temp_val = this.Normal_Char_Check(val);
          if(temp_val != false){
            this.Temp_FillQuestionInfo = temp_val;
          }else{
            this.Temp_FillQuestionInfo = val;
          }
      }else if(this.Type_Now == 'answer'){
          temp_val = this.Normal_Char_Check(val);
          if(temp_val != false){
            this.Temp_AnswerQuestionInfo = temp_val;
          }else{
            this.Temp_AnswerQuestionInfo = val;
          }
      }
      // 最后把输入框关掉
      this.Close_Editor();

    },
    // 检测是否有非法字符 - 选择-填空-解答
    Normal_Char_Check(val){

      var Check_Now = val.content;
      var result = this.ChecK_Do(Check_Now);
      if(Check_Now!= "" && result[1]){
        this.$alert("请将题干内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.content = result[0];
      }

      var Check_Now_List = val.answer;
      Check_Now_List = Check_Now_List.split("::");
      for(let j = 0; j < Check_Now_List.length; j++){
        var item = Check_Now_List[j]
        result = this.ChecK_Do(item);
        if(item != "" && result[1]){
          this.$alert("请将答案内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
            confirmButtonText: '确定'
          });
          return false
        }else if(item != "" && !result[1]){
          Check_Now_List.splice(j, 1, result[0])
        }
      }
      val.answer = Check_Now_List.join("\n");

      Check_Now = val.analyse;
      result = this.ChecK_Do(Check_Now);
      if(Check_Now!= "" && result[1]){
        this.$alert("请将解析内容中自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.analyse = result[0];
      }

      if(val.type == 'option'){
        Check_Now_List = val.options;
        for(let opi = 0; opi < Check_Now_List.length; opi++){
          item = Check_Now_List[opi]
          result = this.ChecK_Do(item);
          if(item != "" && result[1]){
            this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
              confirmButtonText: '确定'
            });
            return false
          }else if(item != "" && !result[1]){
            Check_Now_List.splice(opi, 1, result[0])
          }
        }
        val.options = Check_Now_List;
      }else if(val.type == 'answer'){
        Check_Now_List = val.sub_questions;
        for(let opi = 0; opi < Check_Now_List.length; opi++){
          item = Check_Now_List[opi]
          result = this.ChecK_Do(item);
          if(item != "" && result[1]){
            this.$alert("请将选项内自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
              confirmButtonText: '确定'
            });
            return false
          }else if(item != "" && !result[1]){
            Check_Now_List.splice(opi, 1, result[0])
          }
        }
        val.sub_questions = Check_Now_List;
      }

      this.Symbol_Error = false;

      return val;
    },
    // 负责实际检查的部分
    ChecK_Do(content){

      let remakeContent = "";

      var latexFlag = false;
      let symbolError = false;
      let Regx = /[A-Za-z0-9]/;

      var Img_Catcher = new RegExp('<img src="(.*?)">', 'g')
      var Result_List = Img_Catcher.exec(content);

      var Img_SE = [];
      var Start = 0;

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
                }else{
                    remakeContent = remakeContent + "$" + content[i] + "$";
                }
            }
            // 中文字符，中英文允许的符号，空格或Latex结尾的$符号，换行符
            else if(!(content.charCodeAt(i) > 255 || 
                      this.ch_pun_list.indexOf(content[i]) != -1 || this.en_pun_list.indexOf(content[i]) != -1 ||
                      content[i] == ' ' || content[i] == '$' || 
                      content.charCodeAt(i) == 10) 
                    && !symbolError){
              symbolError = true;
              this.$message.error({message: "请修正位于 " + ( i + 1 ) + " 处的非法字符，或将其包裹于$$符号之内" + content[i] + " ！", offset: 40});
              remakeContent = remakeContent + content[i];
            }
            else {
              remakeContent = remakeContent + content[i];
            }
        }else{
            remakeContent = remakeContent + content[i];
        }
      }
      return [remakeContent, latexFlag]
    },
    // 一起关掉
    Close_Editor(){
      this.showDialog = false;
      this.showDialog_Fill = false;
      this.showDialog_Answer = false;
      this.Refresh = !this.Refresh;
    }, 
    Edit_Question(){

      this.ReEditSwitch = true;

      if(this.Type_Now == 'option'){
          this.showDialog = true;
      }else if(this.Type_Now == 'fill'){
          this.showDialog_Fill = true;
      }else if(this.Type_Now == 'answer'){
          this.showDialog_Answer = true;
      }

    },
    // 重写编辑后，把新数据直接覆盖上去
    ReEdit_Questions(val){

        let temp_val = ""

        if(this.Type_Now == 'option'){
            temp_val = this.Normal_Char_Check(val);
          if(temp_val != false){
            this.Temp_OptionQuestionInfo = temp_val;
          }else{
            this.Temp_OptionQuestionInfo = val;
          }
        }else if(this.Type_Now == 'fill'){
            temp_val = this.Normal_Char_Check(val);
            if(temp_val != false){
              this.Temp_FillQuestionInfo = temp_val;
            }else{
              this.Temp_FillQuestionInfo = val;
            }
        }else if(this.Type_Now == 'answer'){
            temp_val = this.Normal_Char_Check(val);
            if(temp_val != false){
              this.Temp_AnswerQuestionInfo = temp_val;
            }else{
              this.Temp_AnswerQuestionInfo = val;
            }
        }

        this.Close_Editor();
        this.ReEditSwitch = false;

    },
    // 处理完题目的录入之后要重置这些临时使用的变量
    Reset_Params(){

      this.ReEditSwitch = false;
      this.Type_Now = "-1";
      this.complex_Input = false;
      this.Refresh = !this.Refresh;

      this.Temp_OptionQuestionInfo = {

          type: "option",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 选项的部分
          options: ["", "", "", ""],
          options_images: ["", "", "", ""],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }

      this.Temp_FillQuestionInfo = {

          type: "fill",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }

      this.Temp_AnswerQuestionInfo = {

          type: "answer",
          // 分值
          score: 1,
          // 题目内容，题目内容图片，是否显示图片
          content: "",
          content_images: [],
          // 小题的部分
          sub_questions: [""],
          sub_questions_images: [[]],
          sub_questions_scores: [1],
          // 答案的部分
          answer: "",
          answer_images: [],
          // 解析的部分
          analyse: "",
          analyse_images: []

      }
    },
    // 添加至试题篮
    Add_To_Question_Cart(){
      let Question_Show_Infos = {
        id: "",
        type: "",
        score: 0,
        stem: "",
        options: [],
        answer: "",
        analyse: ""
      }
      if(this.Type_Now == 'option'){
        let Aim = this.Temp_OptionQuestionInfo;
        Question_Show_Infos.type = Aim.detail_type;
        Question_Show_Infos.score = Aim.score;
        Question_Show_Infos.stem = Aim.content;
        for(let i = 0; i < Aim.content_images.length; i++){
          Question_Show_Infos.stem += "<img src='" + Aim.content_images[i] + "'>"
        }
        Question_Show_Infos.options = Aim.options;
        for(let i = 0; i < Aim.options.length; i++){
          let New_Option_Item = Aim.options[i] + "<img src='" + Aim.options_images[i] + "'>"
          Question_Show_Infos.options.splice(i, 1, New_Option_Item)
        }
        Question_Show_Infos.answer = Aim.answer;
        for(let i = 0; i < Aim.answer_images.length; i++){
          Question_Show_Infos.answer += "<img src='" + Aim.answer_images[i] + "'>"
        }
        Question_Show_Infos.analyse = Aim.analyse
        for(let i = 0; i < Aim.analyse_images.length; i++){
          Question_Show_Infos.analyse += "<img src='" + Aim.analyse_images[i] + "'>"
        }
      }else if(this.Type_Now == 'fill'){
        let Aim = this.Temp_FillQuestionInfo;
        Question_Show_Infos.type = Aim.detail_type;
        Question_Show_Infos.score = Aim.score;
        Question_Show_Infos.stem = Aim.content;
        for(let i = 0; i < Aim.content_images.length; i++){
          Question_Show_Infos.stem += "<img src='" + Aim.content_images[i] + "'>"
        }
        Question_Show_Infos.answer = Aim.answer;
        for(let i = 0; i < Aim.answer_images.length; i++){
          Question_Show_Infos.answer += "<img src='" + Aim.answer_images[i] + "'>"
        }
        Question_Show_Infos.analyse = Aim.analyse
        for(let i = 0; i < Aim.analyse_images.length; i++){
          Question_Show_Infos.analyse += "<img src='" + Aim.analyse_images[i] + "'>"
        }
      }else if(this.Type_Now == 'answer'){
        let Aim = this.Temp_AnswerQuestionInfo;
        Question_Show_Infos.type = Aim.detail_type;
        Question_Show_Infos.score = Aim.score;
        Question_Show_Infos.stem = Aim.content;
        for(let i = 0; i < Aim.content_images.length; i++){
          Question_Show_Infos.stem += "<img src='" + Aim.content_images[i] + "'>"
        }
        Question_Show_Infos.answer = Aim.answer;
        for(let i = 0; i < Aim.answer_images.length; i++){
          Question_Show_Infos.answer += "<img src='" + Aim.answer_images[i] + "'>"
        }
        Question_Show_Infos.analyse = Aim.analyse
        for(let i = 0; i < Aim.analyse_images.length; i++){
          Question_Show_Infos.analyse += "<img src='" + Aim.analyse_images[i] + "'>"
        }
        for(let i = 0; i < Aim.sub_questions.length; i++){
          let Sub_Now = Aim.sub_questions[i]
          for(let j = 0; j < Aim.sub_questions_images[i].length; j++){
            Sub_Now = Sub_Now + "<img src='" + Aim.sub_questions_images[i][j] + "'>"
          }
          Question_Show_Infos.stem = Question_Show_Infos.stem + "\n" + Sub_Now;
        }
      }

      console.log(Question_Show_Infos);

      this.$emit("Add_To_Cart", JSON.stringify(Question_Show_Infos))
      this.$message.success("试题内容已加入试题篮")
      this.Reset_Params();
    }
  },
}
</script>
<style >
</style>