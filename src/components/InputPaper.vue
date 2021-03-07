<template>
  <div style="margin-top: 5vh">
    <!-- 全卷预览 -->
    <el-dialog
        :visible.sync="paperShow" 
        title="全卷预览" 
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
          <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
          <el-row >
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label><span>第{{Bundle_Index + 1}}大题</span></label>
            </el-col>
          </el-row>
          <!-- 之后的每一行，读取这个大题中的一个题目，然后进行对应的渲染 -->
          <el-row v-for="(Question, Question_Index) in Question_Bundle.Bundle_Questions" :key="Question_Index">
              <el-col :offset="2">
                  <!-- 编辑题目，上移，下移，删除，折叠/展开按钮 -->
                  <el-row style="margin-top: 5px; margin-bottom: 10px">
                      <el-col :span="2" style="text-align: left; font-size: 16px; padding-top: 4px">
                          <label>第 {{Question_Index + 1}} 题</label>
                      </el-col>
                  </el-row>
                  <!-- 展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式 -->
                  <el-row>
                      <OptionDisplay v-if="Question.type == 'option'" :QI="Question"></OptionDisplay>
                      <FillDisplay v-else-if="Question.type == 'fill'" :QI="Question"></FillDisplay>
                      <AnswerDisplay v-else-if="Question.type == 'answer'" :QI="Question"></AnswerDisplay>
                      <MixDisplay v-else-if="Question.type == 'mix'" :QI="Question"></MixDisplay>
                  </el-row>
              </el-col>
          </el-row>
        </el-row>
    </el-dialog>
    <!-- 试卷导入，中间的区域预留了位置，但是功能还得等黄杰那边实现 -->
    <el-dialog 
        :visible.sync="importPaperDialog" 
        title="试卷导入" 
        width="80%" 
        @close="Import_Paper_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row type="flex" justify="start">
          <el-col :span="2" :offset="1">
            <div class="file">
              <span>选择文件</span>
              <input type="file" @change="uploadPaper($event)" accept=".doc, .docx, .pdf">
            </div>
          </el-col>
          <el-col :span="9" :offset="1" style="text-align: left; padding-top: 4px">
            <span>*支持doc，docx，pdf格式的文件</span>
          </el-col>
        </el-row>
        <el-row style="margin: 30px 40px;">
          <FileUpload></FileUpload>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="8">
            <el-button type="primary">导出txt文件</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">导出json文件</el-button>
          </el-col>
        </el-row>
    </el-dialog>
    <!-- 提供给选择题的编辑器 -->
    <el-dialog 
        :visible.sync="showDialog" 
        title="请编辑想要插入/修改的选择题内容" 
        width="65%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
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
        width="65%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
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
        width="65%" 
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>复杂输入框，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput></ComplexInput>
                <el-row>
                    <el-button @click="complex_Input = false"><label>隐藏并清空复杂输入框</label></el-button>
                </el-row>
            </el-col>
            <el-col v-if="!complex_Input">
                <el-row>
                    <el-button @click="complex_Input = true"><label>显示复杂输入框</label></el-button>
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
    <!-- 提供给非选择题的编辑器 -->
    <el-dialog 
        :visible.sync="showDialog_Mix" 
        title="请编辑想要插入/修改的非选择题内容" 
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <MixQuestions
            @EditFinish="New_Questions" 
            @ReEditFinish="ReEdit_Questions"
            :RE.sync="ReEditSwitch"
            :QInfos.sync="Temp_MixQuestionInfo"
        ></MixQuestions>
    </el-dialog>
    <el-row justify="start" type="flex">
      <el-col style="padding-left: 25px">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>资源录入</el-breadcrumb-item>
          <el-breadcrumb-item>试卷资源</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" style="padding-bottom: 50px; margin-left: 20px; margin-top: 30px">
        <!-- 切换页面 -->
        <el-row type="flex" justify="center">
          <el-button type="warning" plain @click="Router_Trans('/inputMarked')" style="width: 200px; font-size: 16px">
            <span style="font-weight: bold">
              切换至单题录入页面
            </span>
          </el-button>
        </el-row>
        <!-- 不同题型 -->
        <el-row style="padding-top: 30px;">
          <el-row>
            <el-col :span="6" style="font-size: 20px">
              <i class="el-icon-arrow-down"></i>
            </el-col>
            <el-col :span="18" style="text-align: left; font-size: 20px">
              添加题包
            </el-col>
          </el-row>
          <!-- Option -->
          <el-row style="margin-top: 10px">
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-circle-check"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('option')">选择题</el-button>
            </el-col>
          </el-row>
          <!-- Fill -->
          <el-row>
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-full-screen"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('fill')">填空题</el-button>
            </el-col>
          </el-row>
          <!-- Answer -->
          <el-row>
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-edit-outline"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('answer')">解答题</el-button>
            </el-col>
          </el-row>
          <!-- Mix -->
          <el-row>
            <el-col :span="18" :offset="6" style="text-align: left; font-size: 20px">
              <i class="el-icon-reading"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Add_Question_List('mix')">综合题</el-button>
            </el-col>
          </el-row>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="primary" plain style="width: 200px; font-size: 16px" @click="importPaperDialog = true">
            <label>文件导入</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="primary" @click="paperShow = true" plain style="width: 200px; font-size: 16px">
            <label>预览全卷</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="success" plain style="width: 200px; font-size: 16px">
            <label>导出题目</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px; font-size: 18px">
          <el-col :span="14">
          <label>导出序号：</label>
            <el-switch
              v-model="Sequence_Questions"
              active-color="#47A9FF"
              inactive-color="#ccc"
              active-value="1"
              inactive-value="0">
            </el-switch>
          </el-col>
          <el-col :span="6">
            <label v-if="Sequence_Questions == '1'">连续</label>
            <label v-else-if="Sequence_Questions == '0'">不连续</label>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="19" style="background: #F8FBFF; padding-top: 40px; min-height: 70.8vh; margin-top: 30px">
        <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
          <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
          <el-row >
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label><span>第{{Bundle_Index + 1}}大题</span></label>
            </el-col>
            <el-col :span="2" style="font-size: 18px; padding-top: 8px">
              <label><span>{{Get_Bundle_Type_Label(Question_Bundle)}}</span></label>
            </el-col>
            <el-col :span="1" style="padding-top: 5px">
              <el-button circle plain size="small" type="message" @click="New_Question(Bundle_Index, Question_Bundle)">
                <i class="el-icon-plus"></i>
              </el-button>
            </el-col>
            <el-col :span="2" style="padding-top: 5px">
              <el-button-group>
                <el-button circle plain size="small" type="message" @click="Bundle_Up(Bundle_Index)" :disabled="Bundle_Index == 0">
                  <i class="el-icon-arrow-up"></i>
                </el-button>
                <el-button circle plain size="small" type="message" @click="Bundle_Down(Bundle_Index)" :disabled="Bundle_Index == Questions.length - 1">
                  <i class="el-icon-arrow-down"></i>
                </el-button>
              </el-button-group>
            </el-col>
            <el-col :span="1" style="padding-top: 5px">
              <el-button circle plain size="small" type="message" @click="Bundle_Delete(Bundle_Index)">
                <i class="el-icon-delete"></i>
              </el-button>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-input v-model="Question_Bundle.Bundle_Introduce" placeholder="大题说明"></el-input>
            </el-col>
          </el-row>
          <!-- 之后的每一行，读取这个大题中的一个题目，然后进行对应的渲染 -->
          <el-row v-for="(Question, Question_Index) in Question_Bundle.Bundle_Questions" :key="Question_Index">
              <el-col :offset="2">
                  <!-- 编辑题目，上移，下移，删除，折叠/展开按钮 -->
                  <el-row style="margin-top: 5px; margin-bottom: 10px">
                      <el-col :span="2" style="text-align: left; font-size: 16px; padding-top: 4px">
                          <label>第 {{Question_Index + 1}} 题</label>
                      </el-col>
                      <el-col :span="1">
                          <el-button 
                              circle 
                              size="small"
                              @click="Edit_Question(Bundle_Index, Question_Index)"
                          ><i class="el-icon-edit"></i></el-button>
                      </el-col>
                      <el-col :span="2">
                          <el-button-group>
                              <el-button 
                                  :disabled="Question_Index == 0" 
                                  circle 
                                  size="small"
                                  @click="Question_Up(Bundle_Index, Question_Index)"
                              ><i class="el-icon-arrow-up"></i></el-button>
                              <el-button 
                                  :disabled="Question_Index == Question_Bundle.Bundle_Questions.length - 1" 
                                  circle 
                                  size="small"
                                  @click="Question_Down(Bundle_Index, Question_Index)"
                              ><i class="el-icon-arrow-down"></i></el-button>
                          </el-button-group>
                      </el-col>
                      <el-col :span="1">
                          <el-button 
                              circle 
                              plain
                              size="small"
                              type="danger"
                              @click="Question_Delete(Bundle_Index, Question_Index)"
                          ><i class="el-icon-delete"></i></el-button>
                      </el-col>
                      <el-col :span="1" :offset="1">
                          <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == false">
                              <el-button 
                                  round 
                                  plain
                                  size="small"
                                  type="info"
                                  @click="Change_Question_Collapse(Bundle_Index, Question_Index)"
                              >折叠</el-button>
                          </div>
                          <div v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == true">
                              <el-button 
                                  round 
                                  plain
                                  size="small"
                                  type="info"
                                  @click="Change_Question_Collapse(Bundle_Index, Question_Index)"
                              >展开</el-button>
                          </div>
                      </el-col>
                  </el-row>
                  <!-- 展开模式交给Display来负责，折叠模式为了避免样式报错，直接转换成文字格式 -->
                  <el-row v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index] == false">
                      <OptionDisplay v-if="Question.type == 'option'" :QI="Question"></OptionDisplay>
                      <FillDisplay v-else-if="Question.type == 'fill'" :QI="Question"></FillDisplay>
                      <AnswerDisplay v-else-if="Question.type == 'answer'" :QI="Question"></AnswerDisplay>
                      <MixDisplay v-else-if="Question.type == 'mix'" :QI="Question"></MixDisplay>
                  </el-row>
                  <el-row v-if="Question_Bundle.Bundle_Questions_Collapse[Question_Index]" style="text-align: left; font-size: 14px">
                      <el-col :offset="1">
                          <label>{{Get_Collapse_Show(Question)}}</label>
                      </el-col>
                  </el-row>
              </el-col>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

// import FileSaver from "file-saver";

import ComplexInput from './ComplexInput.vue'

import OptionDisplay from './OptionDisplay.vue'
import OptionQuestions from './OptionQuestions.vue'
import FillQuestions from "./FillQuestions.vue"
import FillDisplay from "./FillDisplay.vue";
import AnswerQuestions from "./AnswerQuestions.vue";
import AnswerDisplay from "./AnswerDisplay.vue";
import MixQuestions from "./MixQuestions.vue";
import MixDisplay from "./MixDisplay.vue";

// import Upload
import FileUpload from "./Upload.vue";

export default {
  components: { ComplexInput, 
                OptionDisplay, OptionQuestions, 
                FillQuestions, FillDisplay, 
                AnswerQuestions, AnswerDisplay,
                MixQuestions, MixDisplay,
                FileUpload},
  data() {
    return {
      Sequence_Questions: "1",
      // 是否显示导入试卷的对话框
      importPaperDialog: false,
      // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
      showDialog: false,
      showDialog_Fill: false,
      showDialog_Answer: false,
      showDialog_Mix: false,
      // 打开复杂输入框的控制
      complex_Input: false,
      // 题目信息和折叠信息
      Questions_Collapse: [],
      // 重写编辑标记
      ReEditSwitch: false,
      // 两个临时存放用的Json变量
      Temp_OptionQuestionInfo: {

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

      },
      Temp_MixQuestionInfo: {
          type: "mix",
          score: "None",
          content: "",
          content_images: [],
          answer: "",
          answer_images: [],
          sub_questions: [],
          sub_questions_collapse: [],
          analyse: "",
          analyse_images: [],
      },
      Temp_FillQuestionInfo: {

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

      },
      Temp_AnswerQuestionInfo: {

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

      },
      // 临时保存重写编辑的位置用的记号
      Index_Edit_Record: -1,

      // 测试大题类型用的保存数组
      Questions: [],
      // 保存当前操作题包序号的标签：
      Question_Bundle_Add_Index: -1,
      // 全卷内容预览
      paperShow: false
    };
  },
  computed: {
    total_score: {
      get: function() {
        let totalScore = 0;
        const reg = /[\d|.]+/g;
        for (const option of this.option_content) {
          const regResult = option.optionQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          }
        }
        for (const fill of this.fill_content) {
          const regResult = fill.fillQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          }
        }
        for (const answer of this.answer_content) {
          const regResult = answer.answerQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          } else if (answer.answerQuestion.sub_score.length > 0) {
            for (const score of answer.answerQuestion.sub_score) {
              const regSubResult = score.match(reg);
              if (regSubResult != null) {
                totalScore += parseInt(regSubResult[0]);
              }
            }
          }
        }
        for (const mix of this.mix_content) {
          const regResult = mix.mixQuestion.score.match(reg);
          if (regResult != null) {
            totalScore += parseInt(regResult[0]);
          } else if (mix.mixQuestion.sub_score.length > 0) {
            for (const score of mix.mixQuestion.sub_score) {
              const regSubResult = score.match(reg);
              if (regSubResult != null) {
                totalScore += parseInt(regSubResult[0]);
              }
            }
          }
        }
        return totalScore;
      },
      set: function(value) {
        console.log(value);
        this.total_score = value;
      }
    },
    total_question: function() {
      let total = 0;
      total +=
        this.option_content.length +
        this.fill_content.length +
        this.answer_content.length +
        this.mix_content.length;
      return total;
    }
  },
  watch: {
    default_subject: function() {
      this.deleteAllCard();
    }
  },
  methods: {
    // 处理上传试卷时的方法
    uploadPaper(event){
      console.log(event.target.files)
    },
    // 关闭导入试卷这一栏对话框的方法
    Import_Paper_Dialog_Close(){
      this.importPaperDialog = false;
    },
    // 处理插入新题目的办法
    // 需要管理两个条目，一个是题目内容，一个是是否折叠
    // 由于折叠属性放在题目内会对显示造成复杂化的结果，就放在外面
    // 查找次序依次为题目包，点击添加按钮的包序号，然后访问这个包下保存题目和题目折叠信息的条目
    New_Questions(val){

        this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.push(val);
        this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions_Collapse.push(false);

        this.Question_Bundle_Add_Index = -1;

        this.Close_Editor();
        this.Reset_Params();

    },
    // 处理想要修改题目内容时的方法
    // 核心思路是把题目内容的部分丢给编辑器，让编辑器来读取内容
    // 然后等待编辑器内部的处理
    // 在这里，是否发送重写信号由ReEditSwitch来决定
    // Question_Bundle_Add_Index临时用于存放一下编辑的题包序号
    // Index_Edit_Record用于记录题包下的题目序号
    // Temp名称用于临时交换让编辑器处理的数据内容
    // showDialog代表显示的是哪个编辑器
    Edit_Question(Bundle_Index, Question_Index){

        if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'option'){
            this.showDialog = true;
            this.Temp_OptionQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'fill'){
            this.showDialog_Fill = true;
            this.Temp_FillQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'answer'){
            this.showDialog_Answer = true;
            this.Temp_AnswerQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        }else if(this.Questions[Bundle_Index].Bundle_Questions[Question_Index].type == 'mix'){
            this.showDialog_Mix = true;
            this.Temp_MixQuestionInfo = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        }

        this.ReEditSwitch = true;
        this.Question_Bundle_Add_Index = Bundle_Index;
        this.Index_Edit_Record = Question_Index;

    },
    Editor_Dialog_Close(){

        this.Close_Editor();
        this.Reset_Params();

    },
    // 重写编辑后，把新数据直接覆盖上去
    ReEdit_Questions(val){

        this.Questions[this.Question_Bundle_Add_Index].Bundle_Questions.splice(this.Index_Edit_Record, 1, val);

        this.Close_Editor();
        this.Reset_Params();
        
    },
    // 一起关掉
    Close_Editor(){

        this.showDialog = false;
        this.showDialog_Fill = false;
        this.showDialog_Answer = false;
        this.showDialog_Mix = false;

    },
    // 处理完题目的录入之后要重置这些临时使用的变量
    Reset_Params(){

        this.Index_Edit_Record = -1;
        this.Question_Bundle_Add_Index = -1;
        this.ReEditSwitch = false;

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

        this.Temp_MixQuestionInfo = {
            type: "mix",
            score: "None",
            content: "",
            content_images: [],
            answer: "",
            answer_images: [],
            sub_questions: [],
            sub_questions_collapse: [],
            analyse: "",
            analyse_images: [],
        }

    },
    // 移动题目位置
    // 注意要一次移动信息和折叠属性两个，不然会有问题
    Question_Up(Bundle_Index, Question_Index){

        var temp_Save = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);
        this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index - 1, 0, temp_Save);

        var temp_coll = this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index];
        this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
        this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index - 1, 0, temp_coll);

    },
    Question_Down(Bundle_Index, Question_Index){

        var temp_Save = this.Questions[Bundle_Index].Bundle_Questions[Question_Index];
        this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);
        this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index + 1, 0, temp_Save);

        var temp_coll = this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index];
        this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
        this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index + 1, 0, temp_coll);

    },
    // 删除题目也是一样，要一起删除折叠信息
    Question_Delete(Bundle_Index, Question_Index){

        this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1);
        this.Questions[Bundle_Index].Bundle_Questions.splice(Question_Index, 1);

        if(this.Questions[Bundle_Index].Bundle_Questions.length == 0){

            this.Bundle_Delete(Bundle_Index);

        }

    },
    // 上，下，删的题包版本
    Bundle_Up(Bundle_Index){

        var Bundle_Now = this.Questions[Bundle_Index];
        this.Questions.splice(Bundle_Index, 1);
        this.Questions.splice(Bundle_Index - 1, 0, Bundle_Now);

    },
    Bundle_Down(Bundle_Index){

        var Bundle_Now = this.Questions[Bundle_Index];
        this.Questions.splice(Bundle_Index, 1);
        this.Questions.splice(Bundle_Index + 1, 0, Bundle_Now);

    },
    Bundle_Delete(Bundle_Index){

        this.Questions.splice(Bundle_Index, 1);

    },
    // 修改折叠属性，注意要用splice，否则会有bug
    // 天知道vue这到底什么谜一样的前端内容……
    Change_Question_Collapse(Bundle_Index, Question_Index){

        if(this.Questions[Bundle_Index].Bundle_Questions_Collapse[Question_Index]){
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1, false);
        }else{
            this.Questions[Bundle_Index].Bundle_Questions_Collapse.splice(Question_Index, 1, true);
        }

    },
    // 压缩题目长度，使过长的题目能正常显示
    Get_Collapse_Show(Ques){

        var Score = Ques.score.toString();
        var Content = Ques.content;

        var Result = "（ " + Score + "分 ）   ";
        if(Content.length > 30){
            Content = Content.substring(0, 30) + "……";
        }

        Result = Result + Content;
        return Result

    },

    // 从这里开始是尝试加入确定种类的大题部分
    // 添加新的大题题包
    Add_Question_List(Type){

        // 大题类型，大题介绍
        // 本包下的题目
        // 本包是否折叠
        // 本包下的小题是否折叠
        var New_Question_Bundle = {
            
            Bundle_Type: Type,
            Bundle_Introduce: "",
            Bundle_Questions: [],
            Bundle_Collapse: false,
            Bundle_Questions_Collapse: []

        }

        this.Questions.push(New_Question_Bundle);

    },
    // 确定显示的大题题包类型
    Get_Bundle_Type_Label(Bundle){

        var Result = ""

        if(Bundle.Bundle_Type == 'option'){
            Result = "选择题";
        }else if(Bundle.Bundle_Type == 'fill'){
            Result = "填空题";
        }else if(Bundle.Bundle_Type == 'answer'){
            Result = "解答题";
        }else if(Bundle.Bundle_Type == 'mix'){
            Result = "综合题";
        }

        return Result

    },
    // 给对应序号的大题添加新小题
    New_Question(Bundle_Index, Question_Bundle){

        this.Question_Bundle_Add_Index = Bundle_Index;

        if(Question_Bundle.Bundle_Type == 'option'){
            this.showDialog = true;
        }else if(Question_Bundle.Bundle_Type == 'fill'){
            this.showDialog_Fill = true;
        }else if(Question_Bundle.Bundle_Type == 'answer'){
            this.showDialog_Answer = true;
        }else if(Question_Bundle.Bundle_Type == 'mix'){
            this.showDialog_Mix = true;
        }

    },
    Router_Trans(route){
      this.$router.push({ path: route });
    },
    
    // 读取Json格式的数据
    loadJsonFromFile(file, fileList) {
      this.uploadFileName = file;
      this.upload_files = fileList;
      this.loadDataFromFile();
    },
    // 从读取到的数据当中提取对应的格式信息
    loadDataFromFile() {
      if (this.upload_files && this.upload_files.length > 0) {
        const file = this.upload_files[0];
        const reader = new FileReader();
        reader.onload = async e => {
          try {
            this.upload = true;
            // reset all variables
            // 初始化所有内容字段
            this.option_content = [];
            this.fill_content = [];
            this.answer_content = [];
            this.mix_content = [];
            this.option_show_answer = [];
            this.fill_show_answer = [];
            this.answer_show_answer = [];
            this.mix_show_answer = [];
            this.option_show_answer_analysis = [];
            this.fill_show_answer_analysis = [];
            this.answer_show_answer_analysis = [];
            this.mix_show_answer_analysis = [];
            this.option_show_image = [];
            this.option_show_option_image = [];
            this.option_show_analysis_image = [];
            this.fill_show_analysis_image = [];
            this.answer_show_analysis_image = [];
            this.mix_show_analysis_image = [];
            this.answer_show_answer_image = [];
            this.mix_show_answer_image = [];
            this.fill_show_image = [];
            this.answer_show_image = [];
            this.mix_show_image = [];
            this.answer_show_option_image = [];
            this.mix_show_option_image = [];
            this.option_view = [];
            this.fill_view = [];
            this.option_collapse = [];
            this.fill_collapse = [];
            this.answer_collapse = [];
            this.mix_collapse = [];

            const document = JSON.parse(e.target.result);
            this.paper_title = document["paper_title"];
            this.chemistry_subtitle = document["chemistry_subtitle"];
            
            // 遍历Json内容中的题目部分，以题型为基本区分单位
            for (let questions of document["questions"]) {
              switch (questions["type"]) {

                // 如果是选择题的情况

                case "option":
                  this.option_show_image = [];
                  this.option_show_option_image = [];
                  this.option_show_analysis_image = [];
                  for (let question of questions["questions"]) {
                    this.option_collapse.push(false);
                    delete question.eno;
                    this.option_content.push({
                      optionQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.option_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.option_show_image.push([]);
                    }
                    if (question.images) {
                      question.option_images = question.images;
                      delete question["images"];
                    }
                    if (question.option_images[0] !== "") {
                      this.option_show_option_image.push(
                        question.option_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.option_show_option_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.option_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.option_show_analysis_image.push([]);
                    }
                  }
                  this.option_subtitle = questions["subtitle"];
                  break;

                // 如果是填空题的情况

                case "fill":             
                  this.fill_show_image = [];
                  this.fill_show_analysis_image = [];
                  for (let question of questions["questions"]) {
                    this.fill_collapse.push(false);
                    delete question.eno;
                    this.fill_content.push({
                      fillQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.fill_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.fill_show_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.fill_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.fill_show_analysis_image.push([]);
                    }
                  }
                  this.fill_subtitle = questions["subtitle"];
                  break;

                // 如果是解答题的情况

                case "answer":
                  this.answer_show_image = [];
                  this.answer_show_option_image = [];
                  this.answer_show_analysis_image = [];
                  this.answer_show_answer_image = [];
                  for (let question of questions["questions"]) {
                    this.answer_collapse.push(false);
                    delete question.eno;
                    this.answer_content.push({
                      answerQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.answer_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.answer_show_image.push([]);
                    }
                    if (question.images) {
                      question.option_images = question.images;
                      delete question["images"];
                    }
                    if (question.option_images[0] !== "") {
                      this.answer_show_option_image.push(
                        question.option_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.answer_show_option_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.answer_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.answer_show_analysis_image.push([]);
                    }
                    if (typeof question.answer_images !== "undefined") {
                      this.answer_show_answer_image.push(
                        question.answer_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.answer_images = [];
                      this.answer_show_answer_image.push([]);
                    }
                    if (question.tableConfig === undefined) {
                     
                      question.tableConfig = [];
                    }
                    if (question.tableData === undefined) {
                     
                      question.tableData = [];
                    }
                    if (question.table_view === undefined) {
                      
                      question.table_view = false;
                    }
                    if (typeof question.table_row === "undefined") {
                      question.table_row = "";
                    }
                    if (typeof question.table_col === "undefined") {
                      question.table_col = "";
                    }
                  }
                  this.answer_subtitle = questions["subtitle"];
                  break;

                // 如果是混合题型的情况

                case "mix":
                  this.mix_show_image = [];
                  this.mix_show_option_image = [];
                  this.mix_show_analysis_image = [];
                  this.mix_show_answer_image = [];
                  for (let question of questions["questions"]) {
                    this.mix_collapse.push(false);
                    for (
                      var i = 0;
                      i < question.mix_sub_fill_questions.length;
                      i++
                    ) {
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .tableConfig === undefined
                      ) {
                        
                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.tableConfig = [];
                      }
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .tableData === undefined
                      ) {
                      
                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.tableData = [];
                      }
                      if (
                        question.mix_sub_fill_questions[i].sub_fill
                          .mix_sub_fill_table_view === undefined
                      ) {
                        
                        question.mix_sub_fill_questions[
                          i
                        ].sub_fill.mix_sub_fill_table_view = false;
                      }
                      if (
                        typeof question.mix_sub_fill_questions[i].sub_fill
                          .table_row === "undefined"
                      ) {
                        question.mix_sub_fill_questions[i].sub_fill.table_row =
                          "";
                      }
                      if (
                        typeof question.mix_sub_fill_questions[i].sub_fill
                          .table_col === "undefined"
                      ) {
                        question.mix_sub_fill_questions[i].sub_fill.table_col =
                          "";
                      }
                    }

                    delete question.eno;
                    this.mix_content.push({
                      mixQuestion: question
                    });
                    if (question.image[0] !== "") {
                      this.mix_show_image.push(
                        question.image.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      this.mix_show_image.push([]);
                    }
                    if (typeof question.analysis_images !== "undefined") {
                      this.mix_show_analysis_image.push(
                        question.analysis_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.analysis_images = [];
                      this.mix_show_analysis_image.push([]);
                    }
                    if (typeof question.answer_images !== "undefined") {
                      this.mix_show_answer_image.push(
                        question.answer_images.map(s => {
                          return s !== "";
                        })
                      );
                    } else {
                      question.answer_images = [];
                      this.mix_show_answer_image.push([]);
                    }
                  }
                  this.mix_subtitle = questions["subtitle"];
                  break;
              }
            }
          } catch (err) {
            this.upload = false;
            console.log(`${err.message}`);
          }
        };
        reader.readAsText(file.raw);
      }
    },
    // 导出Json格式的文件
    output() {
      // save json file to local
      // const data = {};
      // data["paper_title"] = this.paper_title;
      // if (this.default_subject === "math") {
      //   data["type"] = "math";
      // } else if (this.default_subject === "physics") {
      //   data["type"] = "physics";
      // } else if (this.default_subject === "chemistry") {
      //   data["type"] = "chemistry";
      //   data["chemistry_subtitle"] = this.chemistry_subtitle;
      // } else if (this.default_subject === "biology") {
      //   data["type"] = "biology";
      // }
      // data["info"] = { global_eno: false };

      // data["questions"] = [];

      // let option = {};
      // option["type"] = "option";
      // option["subtitle"] = this.option_subtitle;
      // option["questions"] = [];
      // for (let i in this.option_content) {
      //   let tmp = this.option_content[i].optionQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   option["questions"].push(question);
      // }
      // data["questions"].push(option);

      // let fill = {};
      // fill["type"] = "fill";
      // fill["subtitle"] = this.fill_subtitle;
      // fill["questions"] = [];
      // for (let i in this.fill_content) {
      //   let tmp = this.fill_content[i].fillQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   fill["questions"].push(question);
      // }
      // data["questions"].push(fill);

      // let answer = {};
      // answer["type"] = "answer";
      // answer["subtitle"] = this.answer_subtitle;
      // answer["questions"] = [];
      // for (let i in this.answer_content) {
      //   let tmp = this.answer_content[i].answerQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   answer["questions"].push(question);
      // }
      // data["questions"].push(answer);

      // let mix = {};
      // mix["type"] = "mix";
      // mix["subtitle"] = this.mix_subtitle;
      // mix["questions"] = [];
      // for (let i in this.mix_content) {
      //   let tmp = this.mix_content[i].mixQuestion;
      //   let eno = { eno: parseInt(i) + 1 };
      //   let question = {};
      //   Object.assign(question, eno, tmp);
      //   mix["questions"].push(question);
      // }
      // data["questions"].push(mix);

      // let jsonData = JSON.stringify(data);
      // const blob = new Blob([jsonData], { type: "" });
      // FileSaver.saveAs(blob, (this.paper_title || "paper") + ".json");

      // send json file to server

      // let param = new FormData();
      // param.append("option_content", JSON.stringify(this.option_content));
      // param.append("fill_content", JSON.stringify(this.fill_content));
      // param.append("answer_content", JSON.stringify(this.answer_content));
      // let config = {
      //   headers: { "Content-Type": "multipart/form-data" }
      // };
      // param.append("paper_title", this.paper_title);
      // this.$http
      //   .post(
      //     this.backendIP + "/api/paper/" + this.paper_title + ".json",
      //     param,
      //     config,
      //     {
      //       emulateJSON: true
      //     }
      //   )
      //   .then(function(data) {
      //     let url =
      //       this.backendIP + "/api/download/" + this.paper_title + ".json";
      //     window.open(url);
      //     this.$http.post(
      //       this.backendIP + "/api/delete/" + this.paper_title + ".json"
      //     );
      //   });
    },
  }
};
</script>
<style lang="less" scoped>
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 3%;
  height: 800px;
}
/deep/ .el-short_input__inner .el-input__inner {
  height: 33px;
  width: 80px;
  text-align: left;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}
h6 {
  font-size: 14px;
}
.tb-edit .el-input {
  display: none;
}
.tb-edit .current-row .el-input {
  display: block;
}
.tb-edit .current-row .el-input + span {
  display: none;
}
// 这是单独处理上传试卷的按钮的样式
.file {
    position: relative;
    display: inline-block;
    background: #D0EEFF;
    border: 1px solid #99D3F5;
    border-radius: 4px;
    padding: 4px 8px;
    overflow: hidden;
    color: #1E88C7;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
}
.file:hover {
    background: #AADFFD;
    border-color: #78C3F3;
    color: #004974;
    text-decoration: none;
}
</style>
