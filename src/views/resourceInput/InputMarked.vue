<template>
  <div style="margin-top: 5vh">
    <!-- 提供给非法输入格式的提示对话框 -->
    <el-dialog
        :visible.sync="showHint"
        title="非法输入格式提示"
        width="65%"
        @close="Editor_Dialog_Close()"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <el-row style="margin: 20px 0px 0px 0px">
        <el-col :span="4" style="text-align: left">
          合法的英文符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in en_pun_list" :key="'EN' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row style="margin: 50px 0px">
        <el-col :span="4" style="text-align: left">
          合法的中文符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in ch_pun_list" :key="'CH' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row style="margin: 50px 0px">
        <el-col :span="4" style="text-align: left">
          合法的简单数学符号有：
        </el-col>
        <el-col :span="1" style="border: 1px dashed black; margin: 2px; font-size: 16px" v-for="(Sym, SymIndex) in math_pun_list" :key="'MATH' + SymIndex.toString()" v-html="Sym">
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="font-size: 20px; color: red; font-weight: bold">
        请勿输入其他符号，如需输入，请使用题目录入上方的LUNA输入助手进行辅助
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
        :key="'Option_Dia_' + refresh"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputMarked_Option'"></ComplexInput>
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
        :key="'Fill_Dia_' + refresh"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputMarked_Fill'"></ComplexInput>
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
        :key="'Answer_Dia_' + refresh"
    >
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputMarked_Answer'"></ComplexInput>
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
        ></AnswerQuestions>
    </el-dialog>
    <!-- 提供给非选择题的编辑器 -->
    <el-dialog
        :visible.sync="showDialog_Mix"
        title="请编辑想要插入/修改的非选择题内容"
        width="80%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :key="'Mix_Dia_' + refresh">
        <el-row>
            <el-col v-if="complex_Input">
                <el-row>
                    <label>LUNA输入助手，请在需要时自行复制至目标输入框</label>
                </el-row>
                <ComplexInput :Mathdown_Special="'inputMarked_Mix'"></ComplexInput>
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
        <MixQuestions
            @EditFinish_Mix="New_Questions"
            @ReEditFinish_Mix="ReEdit_Questions"
            :RE.sync="ReEditSwitch"
            :QInfos.sync="Temp_MixQuestionInfo"
        ></MixQuestions>
    </el-dialog>
    <!-- 完成单题显示的编辑器 -->
    <el-dialog
        :visible.sync="showDialog_Result"
        title="确认导入的题目内容"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row style="margin: 30px 50px 0px 50px">
            {{TestData.title}}
        </el-row>
        <el-row style="margin: 30px 50px" v-if="Submit_Show">
            <el-button @click="Ensure()" type="success">确认无误</el-button>
        </el-row>
        <el-row v-for="(Question_Info, Question_Index) in TestData.doc" :key="Question_Index" style="border: 3px dashed black; background: #F8FBFF; margin: 30px">
            <!-- 题型，上传用户，科目部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px 0px 50px">
                <el-col :span="1" style="text-align: left">
                  <el-popover
                    placement="top"
                    width="170"
                    trigger="hover"
                    v-if="Question_Check[Question_Index] == false"
                    content="点击完成该题目确认">
                    <el-button
                      slot="reference"
                      circle size="medium"
                      @click="Question_Check.splice(Question_Index, 1, true)"
                      type="success"
                      ><i class="el-icon-check"></i></el-button>
                  </el-popover>
                  <el-popover
                    placement="top"
                    width="170"
                    trigger="hover"
                    v-if="Question_Check[Question_Index] == true"
                    content="点击取消确认该题目">
                    <el-button
                      slot="reference"
                      circle size="medium"
                      @click="Question_Check.splice(Question_Index, 1, false)"
                      type="danger"><i class="el-icon-edit"></i></el-button>
                  </el-popover>
                </el-col>
                <el-col :span="2" style="text-align: left; padding-top: 1.2vh">
                    {{Question_Info.question_type}}
                </el-col>
                <el-col :span="3" style="text-align: left; padding-top: 1.2vh">
                    提交者：{{Question_Info.source}}
                </el-col>
                <el-col :span="3" style="text-align: left; padding-top: 1.2vh">
                    科目：{{Question_Info.subject}}
                </el-col>
            </el-row>
            <!-- 题干部分 - 无小题 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px;">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.question_stem, 'stem')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'stem')" size="small">{{Get_Button_Label(Question_Index, 'stem')}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Question_Info.question_stem, 'stem', Question_Index)" style="width: 84vw;" :name="Get_Name(Question_Index, 'stem')"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'stem')"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Question_Info.question_stem, 'stem', Question_Index).substring(5)"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
            <!-- 题干部分 - 有小题 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px;"
              v-for="(Sub_Question, Sub_Question_Index) in Question_Info.sub_questions" :key="Sub_Question_Index">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.question_stem, 'stem')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'sub_question', Sub_Question_Index)" size="small">{{Get_Button_Label(Question_Index, 'sub_question', Sub_Question_Index)}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Sub_Question(Sub_Question, Question_Index, Sub_Question_Index)" style="width: 84vw;" :name="Get_Name(Question_Index, 'sub_question', Sub_Question_Index)"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'sub_question', Sub_Question_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Sub_Question(Sub_Question, Question_Index, Sub_Question_Index)"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
            <!-- 选项部分 -->
            <el-row type="flex" justify="start" style="margin: 20px 50px"
                    v-for="(Question_Option, Option_Index) in Question_Info.question_options"
                    :key="Option_Index" >
              <!-- <p style="text-align: left" v-html="Get_Question_Options(Question_Option, Option_Index)"></p>
                -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'option', Option_Index)" size="small">{{Get_Button_Label(Question_Index, 'option', Option_Index)}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Options(Question_Option, Option_Index, Question_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'option', Option_Index)"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'option', Option_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Options(Question_Option, Option_Index, Question_Index).substring(4)"></ComplexInput>
                </el-row>
              </el-col>
              <!-- <el-row type="flex" justify="start" style="margin: 30px 50px; background: red" v-if="Show_ComplexInput(Question_Index, 'option', Option_Index)">
                <ComplexInput
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Options(Question_Option, Option_Index)"></ComplexInput>
              </el-row> -->
            </el-row>
            <!-- 答案部分 -->
            <el-row type="flex" justify="start" style="margin: 20px 50px" v-for="(Answer, Answer_Index) in Question_Info.answer" :key="Question_Index + 'Answer_' + Answer_Index">
               <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.answer, 'answer')"></p> -->
               <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                 <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'answer', Answer_Index)" size="small">{{Get_Button_Label(Question_Index, 'answer', Answer_Index)}}</el-button>
                 </el-row>
               </el-col>
               <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                 <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Answer, 'answer', Question_Index, Answer_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'answer', Answer_Index)"/>
                 </el-row>
                 <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'answer', Answer_Index)"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Answer, 'answer', Question_Index, Answer_Index).substring(6)"></ComplexInput>
                 </el-row>
               </el-col>
            </el-row>
            <!-- 解析部分 -->
            <el-row type="flex" justify="start" style="margin: 30px 50px">
                <!-- <p style="text-align: left" v-html="Get_Question_Show(Question_Info.analysis, 'analyse')"></p> -->
              <el-col :span="1" v-if="Question_Check[Question_Index] == false">
                <el-row type="flex" justify="start">
                    <el-button @click="Show_Part(Question_Index, 'analyse')" size="small">{{Get_Button_Label(Question_Index, 'analyse')}}</el-button>
                </el-row>
              </el-col>
              <el-col :span="21" style="padding-top: 7px; padding-left: 1vw">
                <el-row type="flex" justify="start">
                  <Mathdown :content="Get_Question_Show(Question_Info.analysis, 'analyse', Question_Index)" style="width: 80vw;"  :name="Get_Name(Question_Index, 'analyse')"/>
                </el-row>
                <el-row type="flex" justify="start">
                  <ComplexInput
                    v-if="Show_ComplexInput(Question_Index, 'analyse')"
                    @Update_CI="Update_ComplexInput"
                    :Get_Out_Content="Get_Question_Show(Question_Info.analysis, 'analyse', Question_Index).substring(5)"></ComplexInput>
                </el-row>
              </el-col>
            </el-row>
        </el-row>
        <el-row style="margin: 30px 50px" v-if="Submit_Show">
            <el-button @click="Ensure()" type="success">确认无误</el-button>
        </el-row>
    </el-dialog>
    <el-row justify="start" type="flex" style="margin-left: 5vw">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>资源录入</el-breadcrumb-item>
          <el-breadcrumb-item>试题资源
            <span @click="openInstructionDialog" style="cursor:pointer;">
              <i class="el-icon-question"></i>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <instruction ref="instruction"/>
    <el-row style="margin-left: 5vw; margin-right: 5vw">
      <el-col :span="4" style="padding-bottom: 50px; padding-top: 30px">
        <!-- 切换页面 -->
        <el-row type="flex" justify="start">
          <el-button type="warning" plain @click="Router_Trans('/inputPaper')" style="width: 12.5vw; font-size: 16px">
            <span style="font-weight: bold">
              切换至整卷录入页面
            </span>
          </el-button>
        </el-row>
        <!-- 不同题型 -->
        <el-row>
          <el-row style="margin: 20px 0px 0px 0px" type="flex" justify="start">
            <p style="text-align: left;">确认科目：</p>
          </el-row>
          <el-row type="flex" justify="start">
            <el-select v-model="SubjectType" placeholder="请选择科目" style="width: 12.5vw">
              <el-option
                v-for="item in Subject_List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <el-row style="margin: 20px 0px 0px 0px" type="flex" justify="start">
            <p style="text-align: left;">确认学段：</p>
          </el-row>
          <el-row type="flex" justify="start">
            <el-select v-model="PeriodType" placeholder="请选择学段" style="width: 12.5vw">
              <el-option
                v-for="item in Period_List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-row>
          <el-row style="margin-top: 2vh">
            <el-col :span="4" style="font-size: 20px; text-align: left">
              <i v-if="Expand" @click="Expand_Type_Change()" class="el-icon-arrow-down"></i>
              <i v-if="!Expand" @click="Expand_Type_Change()" class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="5" style="text-align: left; font-size: 20px">
              题型
            </el-col>
            <el-col :span="12" style="display: none">
              <el-button @click="showHint = true" size="small" type="danger" plain>非法格式提示</el-button>
            </el-col>
          </el-row>
          <!-- Option -->
          <el-row style="margin-top: 10px" v-if="Expand">
            <el-col :span="18" :offset="4" style="text-align: left; font-size: 20px">
              <i class="el-icon-circle-check"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Change_Type('option')">选择题</el-button>
            </el-col>
          </el-row>
          <!-- Fill -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="4" style="text-align: left; font-size: 20px">
              <i class="el-icon-full-screen"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Change_Type('fill')">填空题</el-button>
            </el-col>
          </el-row>
          <!-- Answer -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="4" style="text-align: left; font-size: 20px">
              <i class="el-icon-edit-outline"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Change_Type('answer')">解答题</el-button>
            </el-col>
          </el-row>
          <!-- Mix -->
          <el-row v-if="Expand">
            <el-col :span="18" :offset="4" style="text-align: left; font-size: 20px">
              <i class="el-icon-reading"></i>
              <el-button type="text" style="font-size: 20px; color: black; padding-left: 15px" @click="Change_Type('mix')">综合题</el-button>
            </el-col>
          </el-row>
        </el-row>
        <!-- <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="primary" plain style="width: 200px; font-size: 16px" @click="ImportFile()">
            <label>文件导入</label>
          </el-button>
        </el-row> -->
        <el-row type="flex" justify="start" style="padding-top: 30px">
          <el-button type="success" plain style="width: 200px; font-size: 16px" @click="PaperUpload('upload')" :disabled="Type_Now == '-1'">
            <label>题目入库</label>
          </el-button>
        </el-row>
      </el-col>
      <el-col :span="20" style="background: #F8FBFF; margin-top: 30px; min-height: 74vh; padding-top: 40px; border-right: 30px solid white; margin-bottom: 30px; padding-bottom: 40px;">
        <el-row v-if="['option', 'fill', 'answer', 'mix'].indexOf(Type_Now) != -1">
          <el-row style="background: #F8FBFF; min-height: 50vh">
            <OptionDisplay v-if="Type_Now == 'option'" :QI="Temp_OptionQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></OptionDisplay>
            <FillDisplay v-else-if="Type_Now == 'fill'" :QI="Temp_FillQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></FillDisplay>
            <AnswerDisplay v-else-if="Type_Now == 'answer'" :QI="Temp_AnswerQuestionInfo" :Bundle_Index="'Bundle_0'" :Sub_Index="'Sub_0'"></AnswerDisplay>
            <MixDisplay v-else-if="Type_Now == 'mix'" :QI="Temp_MixQuestionInfo" :BI="'Bundle_0'"></MixDisplay>
          </el-row>
          <el-row v-if="Type_Now != '-1'">
            <el-col :span="8">
              <el-button type="primary" plain @click="Edit_Question()">重新编辑</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="warning" v-if="Authority_Check()" plain @click="PaperUpload('export')">题目导出</el-button>
              <p v-else>&nbsp;</p>
            </el-col>
            <el-col :span="8">
              <el-button type="danger" plain @click="Type_Now = '-1'; Reset_Params()">清空数据</el-button>
            </el-col>
          </el-row>
        </el-row>
        <el-row v-else style="padding-left: 3vw; padding-right: 3vw">
          <el-col>
            <el-row type="flex" justify="start" style="margin-bottom: 30px;">
              <label>
                复制题目文本到输入框进行自动切割
              </label>
            </el-row>
            <el-row type="flex" justify="start" style="margin-bottom: 30px;">
              <el-radio-group v-model="TextSplitType">
                <el-radio label="option">选择题</el-radio>
                <el-radio label="fill" disabled>填空题</el-radio>
                <el-radio label="answer" disabled>解答题</el-radio>
                <el-radio label="mix" disabled>综合题</el-radio>
              </el-radio-group>
            </el-row>
            <el-row>
              <el-input
                type="textarea" 
                v-model="TextSplit" 
                :autosize="{minRows: 6, maxRows: 10}" 
                resize="none" 
                style="font-size: 15px"
                placeholder="请输入需要切割的选择题内容"
              >
              </el-input>
            </el-row>
            <el-row type="flex" justify="center" style="margin-top: 30px;">
              <el-button type="success" plain @click="TextSplitDo()">开始切分</el-button>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import FileSaver from "file-saver";

import ComplexInput from '../../common/components/ComplexInput.vue'

import OptionDisplay from './components/OptionDisplay.vue'
import OptionQuestions from './components/OptionQuestions.vue'
import FillQuestions from "./components/FillQuestions.vue"
import FillDisplay from "./components/FillDisplay.vue";
import AnswerQuestions from "./components/AnswerQuestions.vue";
import AnswerDisplay from "./components/AnswerDisplay.vue";
import MixQuestions from "./components/MixQuestions.vue";
import MixDisplay from "./components/MixDisplay.vue";
import Instruction from './components/InstructionExercise.vue'

import Mathdown from "../../common/components/Mathdown.vue";

import { extract } from "@/common/utils/extraction.js"

// import Vue from "vue";
export default {
  components: { ComplexInput,
                OptionDisplay, OptionQuestions,
                FillQuestions, FillDisplay,
                AnswerQuestions, AnswerDisplay,
                MixQuestions, MixDisplay,
                Mathdown,Instruction},
  data() {
    return {
      // 用于文字切割的变量
      TextSplit: "",
      // 用于文字切割的题型
      TextSplitType: "option",
      // 刷新组件
      refresh: false,
      // 是否展开题型
      Expand: true,
      // 待选科目
      Subject_List: [{
        value: "语文",
        label: "语文"
      },{
        value: "数学",
        label: "数学"
      },{
        value: "英语",
        label: "英语"
      },{
        value: "历史",
        label: "历史"
      },{
        value: "政治",
        label: "政治"
      },{
        value: "地理",
        label: "地理"
      },{
        value: "物理",
        label: "物理"
      },{
        value: "化学",
        label: "化学"
      },{
        value: "生物",
        label: "生物"
      },{
        value: "其他",
        label: "其他"
      }],
      // 待选学段
      Period_List: [{
        value: "小学",
        label: "小学"
      },{
        value: "初中",
        label: "初中"
      },{
        value: "高中",
        label: "高中"
      },{
        value: "大学",
        label: "大学"
      },{
        value: "成人",
        label: "成人"
      },{
        value: "其他",
        label: "其他"
      }],
      // 用于选择科目和学段
      SubjectType: "数学",
      PeriodType: "高中",
      // 试卷标题
      PaperTitle: "散题入库",
      // 用于标记是否有非法字符
      Symbol_Error: false,
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      math_pun_list: ['+', '-', "*", "/", "%", "="],
      // 用于给显示和展示Json格式数据的内容
      TestData: {
        "title": "2009年课标甲乙",
        "doc": [
          {
            "question_stem": "已知集合$A = \\{ 0,2 \\}$，$B = \\{ - 2 , - 1,0,1,2 \\}$,则$A \\cap B =$",
            "question_options": [ "$\\{ 0,2 \\}$", "$\\{ 1,2 \\}$", "$\\{ 0 \\}$", "$\\{ - 2 , - 1,0,1,2 \\}$" ],
            "question_type": "选择题",
            "sub_questions": [],
            "answer": "A<img src='123'>::答案2",
            "analysis": "",
            "source": "user_input",
            "subject": "user_input"
          }
        ],
        "img": {}
      },
      Question_Edit_Now: -1,
      Question_Edit_Part: "",
      Question_Edit_Option_Index: -1,
      Question_Edit_Sub_Ques_Index: -1,
      Question_Edit_Answer_Index: -1,
      Question_Check: [],
      Submit_Show: false,
      // ------------------- 以下是原来的单题内容，以上是新加的编辑 -------------------
      // 当前题目类型
      Type_Now: "-1",
      // 缓存题目类型
      Type_Cache: "-1",
      // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
      showDialog: false,
      showDialog_Fill: false,
      showDialog_Answer: false,
      showDialog_Mix: false,
      // 最终结果的显示对话框控制
      showDialog_Result: false,
      // 非法输入格式提示
      showHint: false,
      // 打开LUNA输入助手的控制
      complex_Input: false,
      // 重写编辑标记
      ReEditSwitch: false,
      // 两个临时存放用的Json变量
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
          // 细节选项
          detail_type: "单选题"

      },
      Temp_MixQuestionInfo: {
          type: "mix",
          score: 0,
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
          detail_type: "简答题"

      }

    };
  },

  watch: {

    default_subject: function() {
      this.deleteAllCard();
    },

    Question_Check(val){

        var Flag = true

        for(var c = 0; c < val.length; c++){
          if(!val[c]){
            Flag = false
            this.Submit_Show = false;
          }
        }

        if(Flag){
          this.Ensure();
        }

        Flag = true
      },
  },
  mounted(){
    if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
      this.$message.error("您尚未登录，请登录后使用录入功能。")
      this.$router.push("/")
      return 
    }
    this.Init_Question_Check()
    this.ToTop();
  },
  methods: {
    // 用于给试题文本自动切分，现在先只做选择吧，以后功能补齐了再说后面的
    TextSplitDo(){
      let result = extract(this.TextSplit);
      this.TextSplit = "";
      this.TextSplitType = "option";
      if(this.TextSplitType == 'option'){
        this.Type_Cache = 'option';
        this.Type_Now = 'option';
        this.Temp_OptionQuestionInfo = {
            type: "option",
            // 分值
            score: 5,
            // 题目内容，题目内容图片，是否显示图片
            content: result.题干,
            content_images: [],
            // 选项的部分
            options: [],
            options_images: [],
            // 答案的部分
            answer: result.答案,
            answer_images: [],
            // 解析的部分
            analyse: result.解析,
            analyse_images: [],
            // 细节的部分
            detail_type: "单选题"
        }
        let Temp_Option = result.选项.split('，');
        this.Temp_OptionQuestionInfo.options = Temp_Option;
        for(let i = 0; i < Temp_Option.length; i++){
          this.Temp_OptionQuestionInfo.options_images.push("")
        }
      }
    },
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    Authority_Check(){
      var username = sessionStorage.getItem("user");
      if(username === "advanced" || username === "admin"){
        return true
      }else{
        return false
      }
    },

    Change_Type(Type){

      this.Type_Cache = Type;

      if(Type == 'option'){
          this.showDialog = true;
      }else if(Type == 'fill'){
          this.showDialog_Fill = true;
      }else if(Type == 'answer'){
          this.showDialog_Answer = true;
      }else if(Type == 'mix'){
          this.showDialog_Mix = true;
      }

    },
    ToTop(){
      window.scrollTo(0,0);
    },
    // 展开题型
    Expand_Type_Change(){
      this.Expand = !this.Expand;
    },
    preview() {
      this.isview = true;
    },
    Router_Trans(route){
      this.$router.push({ path: route });
    },
    New_Questions(val){

        this.Type_Now = this.Type_Cache;

        this.Temp_OptionQuestionInfo = {

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
            // 细节的部分
            detail_type: "单选题"

        }

        this.Temp_FillQuestionInfo = {

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
            // 明细
            detail_type: "填空题"
        }

        this.Temp_AnswerQuestionInfo = {

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
            // 细节区分
            detail_type: "简答题"
        }

        this.Temp_MixQuestionInfo = {
          // 题目类型，分值，题干内容，题干图片，答案内容，答案图片
          // 小题内容，小题是否折叠，解析内容，解析图片
            type: "mix",
            score: 0,
            content: "",
            content_images: [],
            answer: "",
            answer_images: [],
            sub_questions: [],
            sub_questions_collapse: [],
            analyse: "",
            analyse_images: [],
        }

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
        }else if(this.Type_Now == 'mix'){
            temp_val = this.Mix_Char_Check(val);
            if(temp_val != false){
              this.Temp_MixQuestionInfo = temp_val;
            }else{
              this.Temp_MixQuestionInfo = val;
            }
        }

        this.Close_Editor();

    },
    // 处理想要修改题目内容时的方法
    // 核心思路是把题目内容的部分丢给编辑器，让编辑器来读取内容
    // 然后等待编辑器内部的处理
    // 在这里，是否发送重写信号由ReEditSwitch来决定
    // Index_Edit_Record用于记录编辑的编号
    // Temp名称用于临时交换让编辑器处理的数据内容
    // showDialog代表显示的是哪个编辑器
    Edit_Question(){

        if(this.Type_Now == 'option'){
          sessionStorage.setItem("InputMarkedEditQuestion", JSON.stringify(this.Temp_OptionQuestionInfo));
          this.refresh = !this.refresh;
          this.showDialog = true;
        }else if(this.Type_Now == 'fill'){
          sessionStorage.setItem("InputMarkedEditQuestion", JSON.stringify(this.Temp_FillQuestionInfo));
          this.refresh = !this.refresh;
          this.showDialog_Fill = true;
        }else if(this.Type_Now == 'answer'){
          sessionStorage.setItem("InputMarkedEditQuestion", JSON.stringify(this.Temp_AnswerQuestionInfo));
          this.refresh = !this.refresh;
          this.showDialog_Answer = true;
        }else if(this.Type_Now == 'mix'){
          sessionStorage.setItem("InputMarkedEditQuestion", JSON.stringify(this.Temp_MixQuestionInfo));
          this.refresh = !this.refresh;
          this.showDialog_Mix = true;
        }
        this.ReEditSwitch = true;

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
        }else if(this.Type_Now == 'mix'){
            temp_val = this.Mix_Char_Check(val);
            if(temp_val != false){
              this.Temp_MixQuestionInfo = temp_val;
            }else{
              this.Temp_MixQuestionInfo = val;
            }
        }

        this.Close_Editor();
        this.ReEditSwitch = false;

    },
    // 检测是否有非法字符 - 综合
    Mix_Char_Check(val){

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
      for(var j = 0; j < Check_Now_List.length; j++){
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
      if(Check_Now!= "" && result[1]){
        this.$alert("请将解析内容中自己输入的Latex公式完整包裹在$$符号之内！", "提示", {
          confirmButtonText: '确定'
        });
        return false
      }else if(Check_Now!= "" && !result[1]){
        val.analyse = result[0];
      }

      Check_Now_List = val.sub_questions;
      for(var len = 0; len < Check_Now_List.length; len++){
        item = Check_Now_List[len]
        result = this.Normal_Char_Check(item)
        val.sub_questions.splice(len, 1, result)
      }

      this.Symbol_Error = false;

      return val;

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
        this.showDialog_Mix = false;
        this.showDialog_Result = false;
        this.showHint = false;

    },
    Editor_Dialog_Close(){

        this.Close_Editor();

    },
    // 处理完题目的录入之后要重置这些临时使用的变量
    Reset_Params(){

      this.ReEditSwitch = false;
      this.Type_Now = "-1";
      this.complex_Input = false;
      this.refresh = false;

      this.Temp_OptionQuestionInfo = {

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
          detail_type: "单选题"

      }

      this.Temp_FillQuestionInfo = {

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
          detail_type: "填空题"

      }

      this.Temp_AnswerQuestionInfo = {

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
          detail_type: "简答题"

      }

      this.Temp_MixQuestionInfo = {
        // 题目类型，分值，题干内容，题干图片，答案内容，答案图片
        // 小题内容，小题是否折叠，解析内容，解析图片
          type: "mix",
          score: 0,
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
    // 尝试进行导出
    PaperUpload(Control){

      if(this.Symbol_Error){
        this.$message.error("仍有非法字符存在，请修改后重新尝试。")
        return null;
      }
      
      var Ques = "";

      if(this.Type_Now == 'option'){


        let Temp_Doc = {
          type: "",
          stem: "",
          stem_images: [],
          score: 0,
          options: [],
          options_images: [],
          answer: "",
          answer_images: [],
          analysis: "",
          analysis_images: [],
          user_id: this.$store.state.user.token,
          subject: this.SubjectType,
          period: this.PeriodType
        }

        Ques = JSON.parse(JSON.stringify(this.Temp_OptionQuestionInfo));

        Temp_Doc.type = Ques.detail_type;

        Temp_Doc.stem = Ques.content;
        Temp_Doc.stem_images = Ques.content_images;

        Temp_Doc.score = parseFloat(Ques.score + "");

        Temp_Doc.options = Ques.options
        for(let i = 0; i < Ques.options_images.length; i++){
          let Item = Ques.options_images[i]
          Temp_Doc.options_images.push([Item]);
        }

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_images = Ques.answer_images;

        Temp_Doc.analysis = Ques.analyse;
        Temp_Doc.analysis_images = Ques.analyse_images;

        this.$message.warning("数据入库格式升级中.")

        // let file = new File(
        //   [JSON.stringify(Temp_Doc, null, 4)],
        //   "Option.json",
        //   { type: "text/plain;charset=utf-8" }
        // );
        // FileSaver.saveAs(file);
        return;

      }else if(this.Type_Now == 'fill'){

        let Temp_Doc = {
          type: "",
          stem: "",
          stem_images: [],
          score: 0,
          options: [],
          options_images: [],
          answer: "",
          answer_images: [],
          analysis: "",
          analysis_images: [],
          user_id: this.$store.state.user.token,
          subject: this.SubjectType,
          period: this.PeriodType
        }
        
        Ques = JSON.parse(JSON.stringify(this.Temp_FillQuestionInfo))

        Temp_Doc.type = Ques.detail_type;

        Temp_Doc.stem = Ques.content;
        Temp_Doc.stem_images = Ques.content_images;

        Temp_Doc.score = parseFloat(Ques.score + "");

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_images = Ques.answer_images;

        Temp_Doc.analysis = Ques.analyse;
        Temp_Doc.analysis_images = Ques.analyse_images;

        this.$message.warning("数据入库格式升级中.")

        // let file = new File(
        //   [JSON.stringify(Temp_Doc, null, 4)],
        //   "Fill.json",
        //   { type: "text/plain;charset=utf-8" }
        // );
        // FileSaver.saveAs(file);
        return;

      }else if(this.Type_Now == 'answer'){

        Ques = JSON.parse(JSON.stringify(this.Temp_AnswerQuestionInfo))

        let Temp_Doc = {
          desc: "",
          desc_images: [],
          type: "大题",
          score: 0,
          subquestions: [],
          user_id: this.$store.state.user.token,
          subject: this.SubjectType,
          period: this.PeriodType,
          answer: "",
          answer_images: [],
          analysis: "",
          analysis_images: []
        }

        Temp_Doc.desc = Ques.content;
        Temp_Doc.desc_images = Ques.content_images;

        Temp_Doc.score = parseFloat(Ques.score + "");

        for(let i = 0; i < Ques.sub_questions.length; i++){
          let Item = {
            type: Ques.detail_type,
            score: parseFloat(Ques.sub_questions_scores[i] + ""),
            stem: Ques.sub_questions[i],
            stem_images: Ques.sub_questions_images[i],
            options: [],
            options_images: [],
            answer: "",
            answer_images: [],
            analysis: "",
            analysis_images: []
          }
          Temp_Doc.subquestions.push(Item)
        }

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_images = Ques.answer_images;

        Temp_Doc.analysis = Ques.analyse;
        Temp_Doc.analysis_images = Ques.analysis_images;

        this.$message.warning("数据入库格式升级中.")
        
        // let file = new File(
        //   [JSON.stringify(Temp_Doc, null, 4)],
        //   "Answer.json",
        //   { type: "text/plain;charset=utf-8" }
        // );
        // FileSaver.saveAs(file);
        return;

      }else if(this.Type_Now == 'mix'){

        Ques = JSON.parse(JSON.stringify(this.Temp_MixQuestionInfo))

        let Temp_Doc = {
          desc: "",
          desc_images: [],
          type: "大题",
          score: 0,
          subquestions: [],
          user_id: this.$store.state.user.token,
          subject: this.SubjectType,
          period: this.PeriodType,
          answer: "",
          answer_images: [],
          analysis: "",
          analysis_images: []
        }

        Temp_Doc.desc = Ques.content;
        Temp_Doc.desc_images = Ques.content_images;

        Temp_Doc.score = parseFloat(Ques.score + "");

        for(let i = 0; i < Ques.sub_questions.length; i++){
          let Item = {
            type: Ques.sub_questions[i].detail_type,
            score: parseFloat(Ques.sub_questions[i].score + ""),
            stem: Ques.sub_questions[i].content,
            stem_images: Ques.sub_questions[i].content_images,
            options: [],
            options_images: [],
            answer: Ques.sub_questions[i].answer,
            answer_images: Ques.sub_questions[i].answer_images,
            analysis: Ques.sub_questions[i].analyse,
            analysis_images: Ques.sub_questions[i].analyse_images
          }

          if(Ques.sub_questions[i].type == 'option'){
            for(let k = 0; k < Ques.sub_questions[i].options.length; k++){
              let opt = Ques.sub_questions[i].options[k]
              Item.options.push(opt);
              Item.options_images.push([Ques.sub_questions[i].options_images[k]])
            }
          }

          Temp_Doc.subquestions.push(Item)
        }

        Temp_Doc.answer = Ques.answer;
        Temp_Doc.answer_images = Ques.answer_images;

        Temp_Doc.analysis = Ques.analyse;
        Temp_Doc.analysis_images = Ques.analyse_images;

        this.$message.warning("数据入库格式升级中.")
        
        // let file = new File(
        //   [JSON.stringify(Temp_Doc, null, 4)],
        //   "Mix.json",
        //   { type: "text/plain;charset=utf-8" }
        // );
        // FileSaver.saveAs(file);
        return;

      }

      if(Control == 'upload'){

        let config = {
            headers: { "Content-Type": "multipart/form-data" }
        };
        let param = new FormData();

        param.append('result_json',
                        JSON.stringify({
                          "post_type": 0,
                          "title": this.PaperTitle,
                          "subject_type": this.SubjectType,
                          "period_type": this.PeriodType,
                          "questions": Ques,
                        }, null, 4));

        this.$http
        .post(this.backendIP + "/api/mathUpload", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          if(data.data){
            this.$message.success("散题上传已完成。");
          }
        });

      }else if(Control == 'export'){

        let file = new File(
          [JSON.stringify({
                          "title": this.PaperTitle,
                          "subject_type": this.SubjectType,
                          "period_type": this.PeriodType,
                          "questions": Ques,
                        }, null, 4)],
          "Question_" + this.SubjectType + "_" + this.PeriodType + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);

      }

    },
    // 以下是单题显示配套用的方法
    // Ensure(){
    //   this.$confirm("您已经锁定了所有题目，确认审核完毕请点击确认提交，仍有更改请点击取消。").then( () => {
    //     this.$message.success("已提交");
    //     this.Submit_Show = true;
    //     this.Submit();
    //   }).catch(() => {
    //     this.$message.info("已取消");
    //     this.Submit_Show = true;
    //   })
    // },
    // Submit(){

    //   var Docs = this.TestData.doc;

    //   for(var i = 0; i < Docs.length; i++){

    //     var Ques = Docs[i]

    //     var stem = Ques.question_stem;
    //     if(!this.ChecK_Do(stem)){
    //       this.$message.error("第"+ (i+1).toString() + "题题干内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
    //       return false;
    //     }

    //     var answer = Ques.answer;
    //     for(var j = 0; j < answer.length; j++){

    //       var item = answer[j]

    //       if(item != "" && !this.ChecK_Do(item)){
    //         this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "部分答案内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
    //         return false
    //       }

    //     }

    //     var analyse = Ques.analysis;
    //     if(!this.ChecK_Do(analyse)){
    //       this.$message.error("第"+ (i+1).toString() + "题解析内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
    //       return false;
    //     }

    //     var options = Ques.question_options;
    //     for(j = 0; j < options.length; j++){
    //       if(!this.ChecK_Do(options[j])){
    //         this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "选项内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
    //         return false;
    //       }
    //     }

    //     var sub_Ques = Ques.sub_questions;
    //     for(j = 0; j < sub_Ques.length; j++){
    //       if(!this.ChecK_Do(sub_Ques[j])){
    //         this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "小题内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
    //         return false;
    //       }
    //     }

    //   }

    // },
    Init_Question_Check(){

      this.Question_Check = [];

      for(var i = 0; i < this.TestData.doc.length; i++){
        this.Question_Check.push(false);
        this.TestData.doc[i].answer = this.TestData.doc[i].answer.split("::");
      }

    },
    Get_Question_Show(Stem, Type, Question_Index, Answer_Index = null){

        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(Type == 'stem'){
            if(this.TestData.doc[Question_Index].question_stem != Stem)
              this.TestData.doc[Question_Index].question_stem = Stem;
            return "题干$：$" + Stem
        }else if(Type == 'answer'){

            if(this.TestData.doc[Question_Index].answer[Answer_Index] != Stem)
              this.TestData.doc[Question_Index].answer.splice(Answer_Index, 1, Stem)
            return "答案$" + (Answer_Index + 1).toString() + "$：" + Stem
        }else if(Type == 'analyse'){
            if(this.TestData.doc[Question_Index].analysis != Stem)
              this.TestData.doc[Question_Index].analysis = Stem;
            return "解析$：$" + Stem
        }
    },
    Get_Question_Options(Stem, Index, Question_Index){
        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(this.TestData.doc[Question_Index].question_options[Index] != Stem)
          this.TestData.doc[Question_Index].question_options.splice(Index, 1, Stem)
        return String.fromCharCode(Index + 65) + "$：$" + Stem
    },
    Get_Sub_Question(Stem, Question_Index, Sub_Question_Index){
        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
        if(this.TestData.doc[Question_Index].sub_questions[Sub_Question_Index] != Stem)
          this.TestData.doc[Question_Index].sub_questions.splice(Sub_Question_Index, 1, Stem);
        return Stem
    },
    Show_ComplexInput(Question_Index, Part, Index = null){
      if(this.Question_Edit_Option_Index == -1 && this.Question_Edit_Sub_Ques_Index == -1 && this.Question_Edit_Answer_Index == -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Option_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Option_Index){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Sub_Ques_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Sub_Ques_Index){
          return true
        }else{
          return false
        }
      }else if(this.Question_Edit_Answer_Index != -1){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Answer_Index){
          return true
        }else{
          return false
        }

      }
    },
    Update_ComplexInput(val){
      if(this.Question_Edit_Part == 'answer'){
        this.TestData.doc[this.Question_Edit_Now].answer.splice(this.Question_Edit_Answer_Index, 1, val);
      }else if(this.Question_Edit_Part == 'stem'){
        this.TestData.doc[this.Question_Edit_Now].question_stem = val;
      }else if(this.Question_Edit_Part == 'analyse'){
        this.TestData.doc[this.Question_Edit_Now].analysis = val;
      }else if(this.Question_Edit_Part == 'option'){
        this.TestData.doc[this.Question_Edit_Now].question_options.splice(this.Question_Edit_Option_Index, 1, val);
      }else if(this.Question_Edit_Part == 'sub_question'){
        this.TestData.doc[this.Question_Edit_Now].sub_questions.splice(this.Question_Edit_Sub_Ques_Index, 1, val);
      }
    },
    Show_Part(Question_Index, Part, Index = null){

      if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
        this.Question_Edit_Now = -1;
        this.Question_Edit_Part = "";
      }else{
        this.Question_Edit_Now = Question_Index;
        this.Question_Edit_Part = Part;
      }

      if(this.Question_Edit_Part == 'option' && Index != null && Index != this.Question_Edit_Option_Index){
        this.Question_Edit_Option_Index = Index;
      }else{
        this.Question_Edit_Option_Index = -1;
      }

      if(this.Question_Edit_Part == 'sub_question' && Index != null && Index != this.Question_Edit_Sub_Ques_Index){
        this.Question_Edit_Sub_Ques_Index = Index;
      }else{
        this.Question_Edit_Sub_Ques_Index = -1;
      }

      if(this.Question_Edit_Part == 'answer' && Index != null && Index != this.Question_Edit_Answer_Index){
        this.Question_Edit_Answer_Index = Index;
      }else{
        this.Question_Edit_Answer_Index = -1;
      }
    },
    Get_Button_Label(Question_Index, Part, Index = null){
      if(Index == null){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part){
          return "收起"
        }else {
          return "编辑"
        }
      }else if(Part == 'option'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Option_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }
      else if(Part == 'answer'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Answer_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }else if(Part == 'sub_question'){
        if(Question_Index == this.Question_Edit_Now && Part == this.Question_Edit_Part && Index == this.Question_Edit_Sub_Ques_Index){
          return "收起"
        }else{
          return "编辑"
        }
      }
    },
    Get_Name(Question_Index, Type, Index = null){
      if(Index == null){
        return "Mathdown" + Question_Index.toString() + "_" + Type
      }else{
        return "Mathdown" + Question_Index.toString() + "_" + Type + "_" + Index.toString()
      }
    },
    // 打开数据展示
    ImportFile(){
      this.$confirm("确认题目无误后请点击左上角锁定此题，所有题目锁定后可以确认审核完毕。").then( () => {
      }).catch(() => {
      })
      this.showDialog_Result = true;
    }
  }
};
</script>
<style lang="less" scoped>
#import_paper {
  background: url("./../../assets/sub_bg.png");
  background-size: 100%;
  padding: 20px 20px 0px 20px;
}
.panel {
  background-color: #fff;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 3%;
  height: 850px;
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
</style>
