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
      <el-row type="flex" justify="center" style="font-size: 20px; color: red; font-weight: bold">
        请勿输入其他符号（含字母和数字），如需输入，请将字母，罗马符号及数字包裹在$$之间进行表示
      </el-row>
    </el-dialog>
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
    <!-- 暂时是个展示功能，之后有需求的时候往进接一下那个算法就行了 -->
    <el-dialog 
        :visible.sync="importPaperDialog" 
        title="试卷导入" 
        width="90%" 
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
        <el-row style="margin: 30px 50px 0px 50px">
            {{TestData.title}}
        </el-row>
        <el-row style="margin: 30px 50px 0px 50px" type="flex" justify="start">
            <el-col :span="4">
              <p style="text-align: left">确认科目：</p>
              <el-select v-model="TestData.subject_type" placeholder="请选择科目">
                <el-option
                  v-for="item in Subject_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="2">
              <p style="text-align: left">确认学段：</p>
              <el-select v-model="TestData.period_type" placeholder="请选择学段">
                <el-option
                  v-for="item in Period_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="10" style="line-height: 60px">
              <el-button @click="showHint = true" size="medium" type="danger">非法格式提示</el-button>
            </el-col>
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
            @EditFinish_Mix="New_Questions" 
            @ReEditFinish_Mix="ReEdit_Questions"
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
      <el-col :span="4" style="padding-bottom: 50px; margin-top: 30px">
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
            <el-col :span="8" style="text-align: left; font-size: 20px">
              添加题包
            </el-col>
            <el-col :span="9">
              <el-button @click="showHint = true" size="mini" type="danger">非法格式提示</el-button>
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
          <el-button type="success" plain style="width: 200px; font-size: 16px" @click="PaperUpload('upload')">
            <label>题目入库</label>
          </el-button>
        </el-row>
        <el-row type="flex" justify="center" style="padding-top: 30px">
          <el-button type="warning" plain style="width: 200px; font-size: 16px" @click="PaperUpload('export')">
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
        <!-- 确认学科和学段的选择项 -->
        <el-row style="margin: 0px 50px" type="flex" justify="start">
            <el-col :span="4">
              <p style="text-align: left">选择科目：</p>
              <el-select v-model="SubjectType" placeholder="请选择科目">
                <el-option
                  v-for="item in Subject_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4" :offset="2">
              <p style="text-align: left">选择学段：</p>
              <el-select v-model="PeriodType" placeholder="请选择学段">
                <el-option
                  v-for="item in Period_List"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" :offset="2" style="line-height: 60px">
              <el-input v-model="PaperTitle" placeholder="请输入试卷名称"></el-input>
            </el-col>
        </el-row>
        <el-row v-for="(Question_Bundle, Bundle_Index) in Questions" :key="Bundle_Index">
          <!-- 第一行：大题编号，添加新的小题，题目类型，上移，下移，删除，题目说明 -->
          <el-row style="margin-top: 20px">
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

import FileSaver from "file-saver";

import ComplexInput from './ComplexInput.vue'

import OptionDisplay from './OptionDisplay.vue'
import OptionQuestions from './OptionQuestions.vue'
import FillQuestions from "./FillQuestions.vue"
import FillDisplay from "./FillDisplay.vue";
import AnswerQuestions from "./AnswerQuestions.vue";
import AnswerDisplay from "./AnswerDisplay.vue";
import MixQuestions from "./MixQuestions.vue";
import MixDisplay from "./MixDisplay.vue";

import Mathdown from "./Mathdown.vue";

export default {
  components: { ComplexInput, 
                OptionDisplay, OptionQuestions, 
                FillQuestions, FillDisplay, 
                AnswerQuestions, AnswerDisplay,
                MixQuestions, MixDisplay, Mathdown
                },
  data() {
    return {
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
      PaperTitle: "未知试卷名称",
      // 用于标记是否有非法字符
      Symbol_Error: false,
      // 用于输入符号提示的部分
      en_pun_list: [',','.','?','!',':',';','\'','"','(',')','&nbsp','_','/','|','\\','<','>'],
      ch_pun_list: ['，','。','！','？','：','；','‘','’','“','”','（','）','&nbsp','、','《','》'],
      // 测试数据
      TestData: {
              "title": "2009年课标甲乙",
              "subject_type": "数学",
              "period_type": "高中",
              "doc": [
                {
                  "question_stem": "已知集合$A = \\{ 0,2 \\}$，$B = \\{ - 2 , - 1,0,1,2 \\}$,则$A \\cap B =$",
                  "question_options": [ "$\\{ 0,2 \\}$", "$\\{ 1,2 \\}$", "$\\{ 0 \\}$", "$\\{ - 2 , - 1,0,1,2 \\}$" ],
                  "question_type": "选择题",
                  "sub_questions": [],
                  "answer": "A",
                  "analysis": "",
                  "source": "user_input",
                  "subject": "user_input"
                },
                {
                  "question_stem": "设函数<IMG: 2018年高考文科数学试题-HTML.031.png>. 若<IMG: 2018年高考文科数学试题-HTML.032.png>为奇函数，则曲线<IMG: 2018年高考文科数学试题-HTML.033.png>在点<IMG: 2018年高考文科数学试题-HTML.034.png>处的切线方程为",
                  "question_options": [ "<IMG: 2018年高考文科数学试题-HTML.035.png>", "<IMG: 2018年高考文科数学试题-HTML.036.png>", "<IMG: 2018年高考文科数学试题-HTML.037.png>", "<IMG: 2018年高考文科数学试题-HTML.038.png>" ],
                  "question_type": "选择题",
                  "sub_questions": [],
                  "answer": "D",
                  "analysis": "",
                  "source": "user_input",
                  "subject": "user_input"
                },
                {
                  "question_stem": "已知函数<IMG: 2018年高考文科数学试题-HTML.085.png>. 若<IMG: 2018年高考文科数学试题-HTML.086.png>，则<IMG: 2018年高考文科数学试题-HTML.087.png> .",
                  "question_options": [],
                  "question_type": "填空题",
                  "sub_questions": [],
                  "answer": "$- 7$",
                  "analysis": "",
                  "source": "user_input",
                  "subject": "user_input"
                },
                {
                  "question_stem": "已知数列<IMG: 2018年高考文科数学试题-HTML.105.png>满足<IMG: 2018年高考文科数学试题-HTML.106.png>，<IMG: 2018年高考文科数学试题-HTML.107.png>. 设<IMG: 2018年高考文科数学试题-HTML.108.png>.",
                  "question_options": [],
                  "question_type": "解答题",
                  "sub_questions": [ "（1）求<IMG: 2018年高考文科数学试题-HTML.109.png>，<IMG: 2018年高考文科数学试题-HTML.110.png>，<IMG: 2018年高考文科数学试题-HTML.111.png>；", "（2）判断数列<IMG: 2018年高考文科数学试题-HTML.112.png>是否为等比数列，并说明理由；", "（3）求<IMG: 2018年高考文科数学试题-HTML.113.png>的通项公式." ],
                  "answer": "（1）由条件可得<IMG: 2018年高考文科数学试题-HTML.169.png>.将<IMG: 2018年高考文科数学试题-HTML.170.png>代入得，<IMG: 2018年高考文科数学试题-HTML.171.png>，而<IMG: 2018年高考文科数学试题-HTML.106.png>，所以，<IMG: 2018年高考文科数学试题-HTML.172.png>.将<IMG: 2018年高考文科数学试题-HTML.173.png>代入得，<IMG: 2018年高考文科数学试题-HTML.174.png>，所以，<IMG: 2018年高考文科数学试题-HTML.175.png>.从而<IMG: 2018年高考文科数学试题-HTML.176.png>，<IMG: 2018年高考文科数学试题-HTML.177.png>，<IMG: 2018年高考文科数学试题-HTML.178.png>. （2）<IMG: 2018年高考文科数学试题-HTML.179.png>是首项为<IMG: 2018年高考文科数学试题-HTML.180.png>，公比为<IMG: 2018年高考文科数学试题-HTML.181.png>的等比数列.由条件可得<IMG: 2018年高考文科数学试题-HTML.182.png>，即<IMG: 2018年高考文科数学试题-HTML.183.png>，又<IMG: 2018年高考文科数学试题-HTML.184.png>，所以<IMG: 2018年高考文科数学试题-HTML.185.png>是首项为<IMG: 2018年高考文科数学试题-HTML.186.png>，公比为<IMG: 2018年高考文科数学试题-HTML.187.png>的等比数列.                                                                                                                                            （3）由（2）可得<IMG: 2018年高考文科数学试题-HTML.188.png>，所以<IMG: 2018年高考文科数学试题-HTML.189.png>.",
                  "analysis": "",
                  "source": "user_input",
                  "subject": "user_input"
                },
                {
                  "question_stem": "设抛物线<IMG: 2018年高考文科数学试题-HTML.132.png>，点<IMG: 2018年高考文科数学试题-HTML.133.png>，<IMG: 2018年高考文科数学试题-HTML.134.png>，过点<IMG: 2018年高考文科数学试题-HTML.135.png>的直线<IMG: 2018年高考文科数学试题-HTML.136.png>与<IMG: 2018年高考文科数学试题-HTML.137.png>交于<IMG: 2018年高考文科数学试题-HTML.138.png>，<IMG: 2018年高考文科数学试题-HTML.139.png>两点.",
                  "question_options": [],
                  "question_type": "解答题",
                  "sub_questions": [ "（1）当<IMG: 2018年高考文科数学试题-HTML.140.png>与<IMG: 2018年高考文科数学试题-HTML.141.png>轴垂直时，求直线<IMG: 2018年高考文科数学试题-HTML.142.png>的方程；", "（2）证明：<IMG: 2018年高考文科数学试题-HTML.143.png>." ],
                  "answer": "（1）当<IMG: 2018年高考文科数学试题-HTML.140.png>与x轴垂直时，<IMG: 2018年高考文科数学试题-HTML.140.png>的方程为<IMG: 2018年高考文科数学试题-HTML.218.png>，可得<IMG: 2018年高考文科数学试题-HTML.219.png>的坐标为<IMG: 2018年高考文科数学试题-HTML.220.png>或<IMG: 2018年高考文科数学试题-HTML.221.png>.所以直线<IMG: 2018年高考文科数学试题-HTML.222.png>的方程为<IMG: 2018年高考文科数学试题-HTML.223.png>或<IMG: 2018年高考文科数学试题-HTML.224.png>. （2）当<IMG: 2018年高考文科数学试题-HTML.140.png>与x轴垂直时，AB为MN的垂直平分线，所以<IMG: 2018年高考文科数学试题-HTML.143.png>.当<IMG: 2018年高考文科数学试题-HTML.140.png>与x轴不垂直时，设<IMG: 2018年高考文科数学试题-HTML.140.png>的方程为<IMG: 2018年高考文科数学试题-HTML.225.png>，<IMG: 2018年高考文科数学试题-HTML.226.png>，<IMG: 2018年高考文科数学试题-HTML.227.png>，则<IMG: 2018年高考文科数学试题-HTML.228.png>.由<IMG: 2018年高考文科数学试题-HTML.229.png>得<IMG: 2018年高考文科数学试题-HTML.230.png>，可知<IMG: 2018年高考文科数学试题-HTML.231.png>.直线BM，BN的斜率之和为<IMG: 2018年高考文科数学试题-HTML.232.png><IMG: 2018年高考文科数学试题-HTML.233.png>. ①将<IMG: 2018年高考文科数学试题-HTML.234.png>，<IMG: 2018年高考文科数学试题-HTML.235.png>及<IMG: 2018年高考文科数学试题-HTML.236.png>的表达式代入①式分子，可得<IMG: 2018年高考文科数学试题-HTML.237.png><IMG: 2018年高考文科数学试题-HTML.238.png>.所以<IMG: 2018年高考文科数学试题-HTML.239.png>，可知BM，BN的倾斜角互补，所以<IMG: 2018年高考文科数学试题-HTML.143.png>.综上，<IMG: 2018年高考文科数学试题-HTML.143.png>.",
                  "analysis": "",
                  "source": "user_input",
                  "subject": "user_input"
                },
              ],
              "img": {
                "2018年高考文科数学试题-HTML.001.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAVCAYAAAD1neayAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABjUlEQVR4nGNgGAWjYBSMNMAFxK9pYG4OED9G4nsB8S8g/g+lPQjoFwTiHVC1e4FYFCoOMjOPUsdVQx1CTZAFxH1ALI4khuxRDygfH6gHYj0gZgLiLiBeAxUHmTkNiAvIdRwolg8yUN/TX7CIodtByM5oJDYfEP9Ak/9GqqNgABTLeUQ4gFSAzTxSPY0O3lGoHwx4gPglEAuTawAegC3pUuJpUP7uQxP7Q5KLoAAUy8vxOEANKo4PgyxmQtMHKrB2YzGPEk/HArE8mthhIPYjwQxwLL9jQPUAtQDILHsc4vj4uAAoUOOxiNuSYAYY1DIgSkMQwJZUyI1pUOgfxmIeuZ52xCEOqsZ8iDSDIRmIHwKxEpSvwQApGcVx6iAdYMvTpFZZIABzkw4Qz0eTIzpPz2RAxBLI86EMqDHHQaxBBAC2WIR5FNY48UKSu8KAWQ4sR3PbXCLsGFCArZ7GB0CB/ZLGdtAcgFpkoFaTJJHqS4DYmki1sBZZBhnuojlIA+L7NDD3PtTsUTAKRsEIAQA7CnBVC3nUsQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.002.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAAAVCAYAAABxGwGcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACM0lEQVR4nO2YMUgDMRSGH0VEpAgiIk5uTuLi4CAi3UoREVcRB6GIiDgIju4OHV1EOomLk1NBxKGrg4ODuEgRBxGcpIgI9T1zwVzM5ZJc9Crkgx+vZ/JfXpJL8g4gEAgEAoGAjkNUR1AbdYma8PiMTdSDQ71BVAP1jrpADXtsUwl1bVCuEj2/E/0te/BMiov6aMugvpI6aiG67kVtoO5czSTIq4Yacai7h5pEFVD7qFNPbSJugQ1MGuLAlaPfWT2T4qI+OkBtG3j84Aw1JPzuRz25GCl4zVB3WbgeQL1lbIuMSYfLZdLqmHimxdU28IjRg3qOrmlmTANbTtdsjRIwCcqUF49eRF6DKCPHZe2xCPE98R7Yq+4L3fJjA+0jNU9enG4YRFVcH5YeXwebpeia9sPd6J7IOMQHWiV6cEGqR4eCc9sGJbCCGvPkxemGQVTF1YTvM4oRLWBLKocGwnpNToACmpPuNUA/GeoKH2rTasqzXHzzHsSkuGZtfKZQx9I9Si1a0j3XN5FmU9O0MRpKHjxU5D2ISXFR2jFvYkAdTrOTL6V0IqXDzCOwvM4XWfdEnprQ5FK9Ta4UgXV4MaWcTYph6kno4jLeE3kCKyb5V8DWaJ9kOZ2eQLyNR8L/biDbfiv66jz5wPFkv6Ipb+qpi4v7dBVZ8kQdfeAvl3X1NCnv0s7f6jNn6IsNfYUY9ey7g5rJ2dOkvI0n/2KzbtGGP6MKLP8M6KE+qubdiEAgEAgE/gOf1+a3W9l5Xe0AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.003.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAATCAYAAADSz14iAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABY0lEQVR4nGNgGAXDC7AAcSUQ3wLiX1C6FoiZBtJR+IAoEL9DE2MD4sNAPBuI5aFi8lD+QSDmwGPefCD+j4S/AfF+INahnpOxgz6ohcigEYin4VA/E4hbCZgJ8owPlA0KlCwGSIzSDFgDcTkDpkeeArE0Dj2yQPycgLmbgJgPic8FxC/JcSAxAJTW9zJAkgm6R/4Q0ItPHpS3YB4F2WHJAElayWS4kSgAiokSKBvdI+h8dIBPPoABNY/cB2I9chxIDJAE4rsMiExLTY/MZYB4BgRA+QMUYLNxmIELEw3WEdBMiUceMkCSFwyAktc3UhxHLHBjgOQNZICe5sn1iCkQL0UTAxW7D3GYQXaMhAPxOQZIyQMDGkD8A4jFiXAoPnlQyC8G4iAoH1RSgTI4qATMIcZxxALkiioSKhbKgBoSXHgcigywyf9BMwuUnE4CcSxFrqYQUJJHBhXwolB+FIyCUUBHAADAr2FW3/ewAAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.004.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABD0lEQVR4nGNgGAVDCOQA8WMkvhcQ/wLi/1Dag4B+QSDeAVW7F4hFoeIgM/OIdUQWEPcBsTiSGLLlHlA+PlAPxHpAzATEXUC8BioOMnMaEBcQ45AvWMT+E+Cjg2gkNh8Q/0CT/0aMQ7BZQqpD0ME7cvRjC3ZKHAJKL31oYn8IaQIlyt1UdkgsEMujiR0GYj98mkAW2FPRIaDEGo9F3JaQGSBXHqaiQxxxiIOytA8hzdjSCKnZFwRg2V8HiOejyRFMIyCAzbcwy2EFmheS3BUGzHS1HKoWhucSYQcGwFaO4AMcQPySRD1E2QEqWUGlnySRhpYAsTWRamElawaR6hnSgPg+sYpJAPehZo+CUUAWAADRcUTHIhvosQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.005.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABBUlEQVR4nGNgGAWDEOQA8WMkviMQXyBCnyAQ7wDiX0C8F4hFoeIgs/KItTwLiPuAWBxJ7AYQ/ydCbz0Q6wExExB3AfEaqDjIrGlAXECMA77gECfGAdFIbD4g/oEm/40YB+CyiBgHoIN35Jjxi0oOAKWHPjSxP4Q0eQHxbio5IBaI5dHEDgOxHz5NIEvsqeAAUCKMxyJuS8gckOsOU8EBjjjEQVnTh5BmbGmAB+oAHiIsh2VfHSCejyZHMA0wMGD36X8kDANXGDDTy3I0tXOJMBsD4CoH0AEHEL8kUi1JZoNKQlCpJUlAXQkQWxNpMawkzCBSPUMaEN8nVjER4D7UzFEwCrACAB6NObdj/vxqAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.006.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAUCAYAAACJfM0wAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAArklEQVR4nGNgGAV4QA4QP0biewHxLyD+D6U9oOIgNXnEGpoFxH1ALI4khmyYB5TPAFUzDYgLiDH4Cxax/wT434gxGF0TMQZj04MBfmERI2TQH0KGgiJpNxkGHwZiP3wGgzTYk2GwLRYxFOAHtZ1Ug/cCsQ8+g0EAWxjjSm4wQDCMsbkG2TBYBvEiQg8GwJaOqaIHlPNAuUmSCLWwnJdBrAvSgPg+EeruQ9WOggECAKXTM+8IGzttAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.007.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAUCAYAAAAeLWrqAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABk0lEQVR4nO2Xv0oDQRDGl1QWIWAhwcoXCHkBEUkXgvgCQdKFICIW9vYWKe0kpY0PIIhVXiCFhZ2FlY2ViIig35hbWZe9ndm9g0WyP/jIn5v9Zmfg5vaUymQyK8IR9BQQvw7dQB/QHbRRwx560IKJGRQ5v4rPfg2evlqoJ8fM+l8OoSnUli4AZ1AXakDn0HXA2jIe1LJBPszm9YvfVT19tVBPLqATxuOHV0mQxdD43oLeIzxccEXb17l4SYykljdBHtFmOF5q8CBSNNLGVYvIg7s9OGjGTCt6aFI3sqyWT24hDe/bgEQuDqCtih6a1I0sq2UO7XNJdh3/lcmGBvSI2VyIX8pG+mrZ4Xyoy3NhIhe9CmtdpGykrxY6Fu1xBrEzUh+XOtAs0sOkqZZFNz0xoccfiSfB1cLOSKXintpX6u8temlcu1dxc9e+5V0+unn6QD5g8ko8fbWYPiwx50gfa9BzAh9JfOzeRD2iNxs6vW9GJHBxCm0n8JHEh3rqN5uJdMEYegxIsCpQT8apN5HJZDL/kW/EBoPbLFo1RQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.008.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAmCAYAAABj5g1QAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABaklEQVR4nO2YsWoCQRCGB2sJXCEpLAIhVZC8g+BbhOCj2IuksA+WNnmANHmHVOJThJQhjc7iCmfwbmfcwdu9+z/4cWH35mZ/7m7HIQIAADBmfRnEsYiRNFvWrukkcgFGCYk1asLaWCSSOrFG/RjEyILYTfYMYmRB1SZ3NZLGaBUWm2y9UX06bLIfEaPwMQqTjBKl7nW6ZowjzuwP1h/rkzUozbW+qNUwYz3R4YCYs96bTSddnkvjG9avNsCCTh/xpU1eV0f7en77X3FR6xY9+vG98mYpoTHKfa9e/Vhd1A6p+oTS1D1NocnlhXXnx6qitiDbI7jO2FhJ71OFM2Z6Jk4Q9xQNA2va9ESNL732+F16oLz/qUs2e+t/R6yVH4uK2v8n3uKyHJMgZNSaTvf6VroutbcDnAM9cyHomSuAUUJCRoXm0TMXzqNnLpzvdM9cW+V31ijNvHRN1kh65iET0DMvrYmNAQAAnWQPr4iZEFZZO+oAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.009.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAZ0lEQVR4nGNgGAUDBP7TWd+oxSigByoOw5PoZfE1INaCspVI0EexxTAgDcQ8BPT9x4PJslgQiknVRzTAZgDIl9JE6qOqj2HxqsIAiW9i9ZEE0A1AT9E99LKY1voG3uIfdNY3CoYxAABw3jKpYOklMgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.010.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAMUlEQVR4nGNgGPTAC4h/AfF/KO1BSAOyIg8oHy/4T4A/qgEESA5WmCJYxHkR0jAiAAANoxgHaWc4XgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.011.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAmCAYAAAAbdcG0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAgUlEQVR4nGNgGAUw4AjEF8jVfAOI/1Ni+6hmemnmgWrmIddWGB4FtAL/icCjAAsQBOIdQPwLiPcCsSgpmuuBWA+ImYC4C4jXkKI5GonNB8Q/SNGMDt6RqxHk/z5yNccCsTw5GkEBFk+urY7kahSH0jpAPJ8UjcsZUHPSXHJdMNwAANfFI5dEn+quAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.012.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAJUlEQVR4nGNgGDTAEYgvEKPwBhD/J9bUkaeQB6qQhxjTYHiwAACyigz3zfIliwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.013.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhklEQVR4nGNgGAWDHfwnAlNkOM0AzQxHNlgQiHcA8S8g3gvEotQ0vB6I9YCYCYi7gHgNNQ2PRmLzAfEPahqODt7RynBQ+PfRwmAQiAVieUoMwmU4KELjSTUY3TBchjsSazC6Yf/R+OhAHErrAPF8cizAZfByBtTyZC45hlNcGBFjwSigHgAATCItiklCkywAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.014.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.015.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.016.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAnCAYAAACL4Y8gAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACpElEQVR4nO2aMUgcQRSGHyJyiAgp5BALQSyCpAhYiUgIiIhIuCaEYJHCJgQRCxuRIJIuBLEKpBCxEEEkWIgERCSEIEKKEIKIICGlCGIlYnP5f2YPNnKu47n7Zt2dD3649db93z5nZ2feU8Tj8XhSy3OoJ0e+qgxDA9Aq1J0DX2dwNPXmyFed1znzVeUp1JQj39gpBxqBGqBl6E/w3RtoHVoQ87jG7TsffD6CdkLfJenrhC5oF5qAHih5MnGfg8+cZ78q+TrjFHqs6NcPbYSOXyp6q8Op4S80pOj5UMzUQJ5ArYre6nA0vYPeKnryBXYG1UGDir5OeAaVoDVoUsmzAJ2L2VSkEo6AWTGP9gX0Xsyu5yjql6pwALVBzdA+NB1jjFFw5DLuTiU/Lvt+2p7M+eoXNC5mJDDYUTFLn6UkokuADjHxa8GBVLY5kcnkX+LqvNUaXOBFvHHFzncxq5UPDrytEsyRuhJxgbbYwqmNm26CU9iMRiBVsErwlphKU1qxuglHWMXGF0O9xXncenLeqbtLRDWgmeByhK47/0YuLc23xbwINRJ82xt1hVU8P6R6pX+0RsNaFXXNpDyvXjuREcwiCde+fcFxEZoTU7AJsydmBGuTtlFbgfuGsliWQF+JmV85XXDJ1lflHBZSvsUQ2G17Y2lNcCqnrdz1xlyh1RtrgY4VfFKHVm/si6TsEdZAqzc2Bk1JhhPMYvthINYzTkSvN8YV0HLwOZMJZsPzN/QIahTzqC4qebObwpdo5SnJXIJZNuS6uhj6GesdJSV/1p/bQ8eZS/BHMVNBBXaV2WloUPK/D1vsO8FlUSF0/En+7/Zqk6nkElbn+JLhGpQtKHZE2GnQ7DCHyVyCmVRuuflPIEwyi/mb4q7Tm7kEezwej+d6/gE84bTSt3P12gAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.017.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABPElEQVR4nGNgGAVDCMgC8V4kviAQ7wDiX1BxUQL6vaBq/0NpD6j4FiCWJtYRKkB8HIhNkcTqgVgPiJmAuAuI1xAwA9lyDygfBByB+AIQKxFyBMiig0AsjiYejcTmA+IfBMz5j4cvD8T7CTkkFoirCSkCgncUOAQE6qF24QSbGFCjBBsApZc+Ch1iDcTr8BnwhQESPfgAyCfyFDqEDYg/4TPgDwELQI6MJ6CGGIeAwC8sYnAAciUbHnlHIhxBjEOYGAiEyAYGSPxhA7CcpAPE8wk4BFf2hQFQUbAJnwGRQNyMRXw5A8RXMDwXSe4KEO9GUw+zHFageaHJlzMQEcWgPK5CSBES4ADilySoF2cgohwBAVCOOMeACFpCoIQBd3SiA1sGSKlNsGSFAZCrtxCrmAQAqq9kaWDuKBghAAD2BUEY3vWBUwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.018.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhElEQVR4nGNgGFaAB4gbgfghEP8A4i4gNgbiu4Q0SgLxJSDOA2IOIGYC4mQg/g/EC/FpBCm8AMQeWAwEaQ7Hpxlkw3IcciDN0vg07wZiN3wK8AFQ4LCQq/kXuRpB4AwQW2IRTyZGcygDJG5toXxxIO4DYi1ibY8H4hsMEC9cQDJoFFAKADevFfP0ATFLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.019.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAmCAYAAAD0t6qKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAe0lEQVR4nGNgGLnAEYgvkKPxBhD/J9fWUY3U1sgD1chDjm0wPAooBf8J4BEPRIF4ExD/gmIPYjVWArEslO0B1UwUYEJiswHxJWI1woApEDcDsSQpmmIZIBH+EIhtSbURBEB+/EGORgYGepc9JEXHSQZEbgBp8iLHxuEAAKVtJnqpbgVSAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.020.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAmCAYAAAAbdcG0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAgUlEQVR4nGNgGAUw4AjEF8jVfAOI/1Ni+6hmemnmgWrmIddWGB4FtAL/icCjAAsQBOIdQPwLiPcCsSgpmuuBWA+ImYC4C4jXkKI5GonNB8Q/SNGMDt6RqxHk/z5yNccCsTw5GkEBFk+urY7kahSH0jpAPJ8UjcsZUHPSXHJdMNwAANfFI5dEn+quAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.021.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAoCAYAAADg+OpoAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAxElEQVR4nGNgGAV0BP+JwFSziC6A7hYJAvEOIP4FxHuBWJQWloBAPRDrATETEHcB8RpaWRSNxOYD4h+0sggdvKOHRaD46qO1JSAQC8Ty1DIUl0WgxBBPiSXoBuOyyJEcS9AN/o/GRwfiUFoHiOdTahkuS5YzoJZvcymxCGYJXYodulk0CgYXIKaaJgWPAvoCmrYRkAFN2wjIgKZtBHyAqm0EXICqbQR8gOw2AimA7DYCqYDiNgIxgGptBHyA6m2EUTC4AADmZU4ggBjI+gAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.022.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABCElEQVR4nGNgGAXDEPwnAtPU8gEFVHOAIBDvAOJfQLwXiEVJdAC5+uGgHoj1gJgJiLuAeA0JlpOrHwVEI7H5gPgHiQ4gRz9e8I5EB5CjHycAxWcfBQ4gVj9OEAvE8mRaTqx+nACUiOKxWIZuIS4HYNNPEnDEIU6sA3DpJwqIQ2kdIJ5PwBHYHEBIP16wnAG17J6LwwG4ynZi9FMF0LxyIdYRo2AUUA0Q05yiFh4FQxuA2nibGCBtPhD2oLcDKoFYFsr2gDqCroAJic0GxJfo7QAYMAXiZiCWHAjLQU0tUH5+CMS2A+EAGAClAYqb3ZSCAS/ZBtQBA5INTzIgKhWQ5V70dsAoGD4AAC3dZaUbZlZaAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.023.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAApklEQVR4nGNgGAWDAvgA8X4g/gHEL4E4lBxDpkENsQRiJiAWBuJ1QGxPiiFdQJyGRVwUiM8Ra4geEPfhkf9FrEFzgdgRhxwLEN8l1qDHQMyGQ04JiCcRa9AfPHLlQKxBrEEPgVgSi3gsAyQSQAAUg7KEDKoF4i0MkBgCRTsouo8C8RokNdVAHE6MqzqA+B0DJIYOYtHkRaxBhMDgMygLiCupYdBIAwBIzBp7WhtHawAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.024.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAYAAAAinad/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvElEQVR4nGNgGAWDFvgA8X4g/gHEL4E4lFyDpkENsgRiJiAWBuJ1QGxPqkFdQJyGRVwUiM+RYpAeEPfhkf9FimFzgdgRhxwLEN8lxbDHQMyGQ04JiCeRYtgfPHLlQKxBimEPgVgSi3gsAyRiYACUTCwJGVYLxFsYIDEHShKgpHAUiNcgqQGlPzcgXgXExoQM7ADidwyQmDsIxOE41IFcZ03IMGJBBrUMAiUfHmoYlAXEGxggaZLs/DoKIAAA+mwcAdDEu/gAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.025.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAWCAYAAAA4oUfxAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA5klEQVR4nGNgGAWjYJAAHyDeD8Q/gPglEIfSSA8GmAY1xBKImYBYGIjXAbE9lfVggC4gTsMiLgrE56ioBwPoAXEfHvlfVNKDFcwFYkcccixAfJdKerCCx0DMhkNOCYgnUUkPVvAHj1w5EGtQSQ9W8BCIJbGIxzJAEhUIgFKxLIl6QFnOkpDltUC8hQGSSkHZBZRNjgLxGiQ11UAcToIeUN53A+JVQGxMyAEdQPyOAZJKD6JZBAJeWMQI6QEBkO+tCVlOCGCznBiQQanF5FoOyoo81LA8C4grSVS/gQFSHpBV1o+C4QMACsw2ezJW/KMAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.026.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAASCAYAAACNdSR1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAZUlEQVR4nGNgGJTAC4h/AfF/KO2BTzGyAg8oHyf4BsRsSPxP+BQHAPE0KDsUiHPwKQaBIiA+A8TJhBSCQB/UdJAGUXwKe4BYB8rOAOI1+BT/QGLzoPExAElBB1MAixQvfIqHHQAAWfIXFqPxE9cAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.027.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAWCAYAAABZuWWzAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABFUlEQVR4nGNgGAWjYBSgg/9E4EEDBpVj8AGaOtQRiC9gERcE4h1A/AuI9wKxKJHmITuWXDNwghsM2EOjHoj1gJgJiLuAeA2R5iGbRa4ZRFsAA9FIbD4g/kGGWeSaQbQFuMA7KpgDM8MWiJ8D8R8GMkoJQopAaa+PQnOQzbgExDoMiJBeB8QaRJhP0BIQiAVieQrNQTeDC4g/QNnbgJiDCPMJWgLKHPFY1KPrIdUMayC+C2U/JeRAYi1yxKPnPxqfFDNygHgTlP0Nj14UwAO1iAeLnDiUBqWv+VjkiXEsLjNOIvFBGU2FAZLp8AJcOXE5mtxcPPpxORafGY8ZECE+hQGS2ZIJOZZSMOgaJoTAkHLsKBhyAACPfVteSMBcdgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.028.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAASCAYAAABFGc6jAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyElEQVR4nGNgGAVUAo5AfAGLuCAQ7wDiX0C8F4hFKbXoBhD/xyJeD8R6QMwExF1AvIZSixhwWBSNxOYD4h+0sggdvIPStkD8HIj/QPUhY4otAsVXH5R9CYh1GBA+XAfEGsRYQoxFsUAsj8TnAuIPUPY2IOaghkWgxBCPJmYNxHeh7KfEWkLIIkcsYjlAvAnK/kasJTxQi3iwyIlDaVCczEcSP4nEByUKFQZIAsELcKWa5Whyc5HkHjMgfDqFAZIwkglZNApGMAAAdggv0ze52s8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.029.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAWCAYAAACosj4+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABL0lEQVR4nGNgGAWjYPCA/0Rgujto0ACaOcYLiH9BLQDRHiQ6SBCId0D17gViUUodhOwIDyifFAfVA7EeEDMBcRcQr6HUQd+AmA2J/4lIx8AcFI0kzgfEPyh1UAAQT4OyQ4E4h0gH4QLvkNi2QPwciP8wkJj7ioD4DBAnE+EYfA4Cpac+JP4lINZhQITaOiDWIMYCkCHToI4iJlHiclAsEMujiXEB8QcoexsQcxAyvIcB4gsQyGBATZTYgheXY0CJOh6LuDUQ34WynxJyDAggJ0IeBsxEie4oXA5yxCEOSpOboOxvxDiImGxPyEHiUBoU0vPR5E4iiYEStwoDJKHjBDBHwApGLxwO+o/ERgbLGVBzz1w0+ccMiNCbwgCJAWIzD14wIJUlITDoHDQKBgQAADWXWdKbycN4AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.030.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAASCAYAAABFGc6jAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAApklEQVR4nGNgGAVUAo5AfAGLuBcQ/wLi/1Dag1KLbkANQwfIhntA+RQDbBahi2FTQ1OLbIH4ORD/gYohY6padAmIdYD4B5S/Dog1iLGEVItAgAuIP0DZ24CYg1YWWQPxXSj7KbGWkGNRDhBvgrK/EWsJD9QQHjRxfMn7JBDPh7JBiUKFAZJA8AJcqQZmOCzDeiHJPWaAZHQQmMIASRjJhCwaBSMYAABiwDow6OuxbQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.031.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAAAXCAYAAADtGGaiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADD0lEQVR4nO2YT4RWURjGXyMj+USLtMiIMYskibRIWkTGGEmbJEnaJUkSLZIk7VpHi6TFiCQZSSRplTZpkSSSWY1Ei5GRxNfzOPdy5txzzj333HPv58v58fDde7973/d57zn3/BHJZDKZTCaTyWREjkJ7Rp1EzxyD9o06if+RHdA09AqaGHEufXEYmoUeyRh1pPPQMvRcOzcl6sXV8Qza2kVSHs4mek6ox1gOQh+04za14ldqf+uMeuAM9A4aQEvFuRnoLbQ34P6yaNOdZFdll6jc2sZr4jGWz9BQO25Tq1SdqFO2i/oy7dbOcSh5A21p8Jxt0OuEedVxRNRQEEuMx1iGxnFMrdgQB2nS6Y5FUWaHxe+SU9BVy//L/56EJqEF6Jt2/Xpxb1t8cU6LmpQzTt0cynyROi6PZB76Uug49CMo62Z5mLXyeT4HPYXuiRr2msay4fJY945ruQTdMs6xcbmGAU6KOUxchDYZ1zi+P2kS3IMvzrrAZ/iK6/LIQn6EdkIboBfQ/cB4TfKw1crnuU0skzqPrfLgJHzWOPdL/L3/p6wdIkvYolcs54ce+XDFCcX3fJtHzms4h9SHwZeivohtsOXhqlWXnkmox6g82NNXpVrYv557JouE5h3X/zRNIjKOi9DGa/N4R9TwUsLeuVrkEhND/78Ns1ZdeyYhHmPzkDlRy1iTFakWseQQdBO6Zrk2Iem+UL44ofieb/P4HVqvHd8Ve31S5GGrVdeeSYjH6Dxuy9rWWsIJoGu/g6srfh4fQ5eNa1zOL1buiMMXJxRfcW0ef4uaP2yGbkAPoAsS0VM1BkUe5grNVquuPZMQj9F5cD/Etmw+IaqFmnBPhZtyG6FPUl0lXRG1CmtLXZxQfMW1eWSBOQxxssyCPxQ1x5yLjF/mYPsam7XqwzOp8xidB/dCFjzXuU8yE/owUQ2zz32oFDT1mIpxrJUT7jtwDOUy0bdbywb3XsJ65wFJs3PdN008pmJca+WEu8NfRe281sGeFDIp5T7GVJukRkiox1SMc60ymUwmk8lkMpH8A2ed47DJIPhzAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.032.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABUUlEQVR4nGNgGAVDBOQA8XMg3oYkJgvEe4nQuwWIpSmxPBGITwIxDxA/hIqpAPFxIDYlQr8jEF8AYiVyLNdggPjcAEmMCYgPArE4CebIA/F+Ui3fBMT/oXgTkngsEFdjUQ9TGw3EbEC8FIjvI8nXQ/WSBIqAuBWLw3AFvRYDJGoKgFgQTc4aiNeR6gBQonNDE/vCAIkGXOAdA2qUwQAoVD6RYjkLEH/DYtkfPHpAloASqhcO+V+kOMCDAZKF0MEnqEXYgAsQNwNxLRY5JgYSQ6AHiLOwiG9ggMQnNuAHxAFAvAaIS9Dk9BhQEzNBAMq72LJaJAPEl+jgBgOkwOED4msMmDmlHIjjibUclG+X4pEH5WkVYg1jgHiEqHLgFhBzAPF8BvwlF8iB5xgg6YQQsGWAZE2iSkJQCXeXAVJ8EgIgX2FLpOhgBwOk3hgFowArAAB6/DgBfVVRhgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.033.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAUCAYAAAAp46XeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwUlEQVR4nO2Wz0eEQRjHHyurQ6LTShLpkA7p0inJkiRJlw5J0jVJEh2SPaxue+g/6LS3rGSlS7KHlS7plMRKp25JkiS279PM8u67M7PPbG90eL98GM8883vmeYYoVqxYIa2DJ3AasPWCc2H7IuiJelJRaBVcgQ7wqG0D4BKMCvtIgxvQH/nsfqFBUic2ErAlQAmkPPvqAxdS5yo40OWKT0OhTvQYVV2uaRnsWubDLIEkyIOHkE9Gt2+qBVDQ5TFSuxm1tsB+yMYLtV3HIVLXdRN0Gep5ngWDvUGTpB5qTYsWv6qDZuIAMhWyvZG6mjY9U/01DopP9FUw7s97qOjyBOiWNPJQG3inxoV8Odrw5DnozDh8PiWDc/R60YNPO/xaPTnus2iw884nLW34NmXBnqU+QcKTaye1s7MS5xaUA2sG+zGpt2PSHJgHR2DbUD9M9cHJKt6FD1I55y/EeckU7vltZw32O1KJuhPckjmi7oAVyeCcEDdE0/QX56S8o57Tju+mpkiQrsqkolHOs3OJ7kld90Ny/yZ48dfkfutBjZNKEU1/KBwhM8JOfVXS/acFvnwSpoBj0hmpv2isWLH+gb4BsW5U5hp7ZykAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.034.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA/klEQVR4nGNgGAVDCMgC8V4kvhcQ/wLi/1Dag4B+XOq3ALE0sY5QAeLjQGyKJIZsmAeUjw/gUu8IxBeAWImQI5iA+CAQi6OJ/yfARwf41MsD8X5CDokF4moSDSbVISBQD7ULJ9jEgBoltHKINRCvw2fAFwZI9NDaIWxA/AmfAX/INJgc9XgTPMiVbHRwCBMDgRDZwACJP3RArewLA3oMkPSIE0QCcTMWcZhhsALKC0nuChDvJkE9CJQDcTw+h4AAKI+rEFKEBDiA+CUJ6sUZiChHQABU4JxjIFyMw0AJA/boxAZsGSClNsGSFQZArt5CrGISwA4GSD02CkYBWQAAyBJLdd7t3zkAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.035.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAUCAYAAADPym6aAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABIElEQVR4nGNgGAWjYFgDQSDeAcS/gHgvEIsOrHPIB/VArAfETEDcBcRrBtY55INoJDYfEP+ghqH/gXgClH0XiPdTw1ASwTsk9n8oBnmWDYiXAvF9YgwJBeJ1ULY1EB+kogOJAaD80ocmpgXEx4G4ACpPFHAB4i1I/Egc6v7jwZSAWCCWxyIOiiUDUgzSYIAkKRCwB2JJytwFBsR6GpTZ47HoByWph0DsRYqlPED8AWqoBxUcRwpwxCEOSiXNQFxLimEcQPwNiH0ocBA5QBxK6wDxfDQ5PyAOYIAUyyXEGgiKCVDxp0IN1xEJljOgxuhcJLkbQCzNACmWrwFxNbGGKgFxHvXcSH9wlAFSKvQMtEMoBaCSqn6gHTEKRsEooA0AAMOPPoDARrxcAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.036.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAQCAYAAACP4IauAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAzElEQVR4nGNgGAX0A/+BeAKUfReI99PJThCOBmI2IF4KxPeJ0RgKxOugbGsgPkgL12EBWkB8HIgLgFiQWE0uQLwFiR+JQ91/PJhc8A6IDUjRoMEAiX4QsAdiSQoshwFiPAaK/odA7EWKwTxA/AGImYDYg0IHkAJAMdoMxLWkaOIA4m9A7EOmpeQCPyAOAOI1QFxCrCZQiP4AYhUaOQobuAHE0kDMB8TXgLiaWI1KQJxHI0dRDRxlgOTEnoF2CDEAVALUD7QjRsEoGE4AAAIzMNfATO5bAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.037.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAUCAYAAAD7s6+GAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGklEQVR4nGNgGAWjgOZAEIh3APEvIN4LxKID6xzcoB6I9YCYCYi7gHjNwDoHN4hGYvMB8Q9KDfwPxBOg7LtAvJ9SA3GAd2h2gjDIM2xAvBSI7xMyIBSI10HZ1kB8kMoOBAFQeu1DE9MC4uNAXACVJwhcgHgLEj8Sh7r/eDAhEAvE8ljEQaFsQIwjQUCDARLlIGAPxJLEaiQSgDJTPBZxUJQ/BGIvYg3iAeIPUAM98KgjN0QdcYiDYrIZiGuJdSgHEH8DYh9iNZAAxKG0DhDPR5PzA+IABkixVUKMYaCQBBUdKtRyHRQsZ0AN9blIcjeAWJoBUmxdA+JqYgxUAuI86rqRuuAoAyTH9Qy0QwgBUE6vH2hHjIJRMFQBAH+YN4cWSEGtAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.038.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAQCAYAAACcN8ZaAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyElEQVR4nGNgGAXEg/9APAHKvgvE+6lkJghHAzEbEC8F4vvEaAwF4nVQtjUQH6SCY0BAC4iPA3EBEAsSq8kFiLcg8SNxqPuPB+MC74DYgFiHgIAGAyR6QMAeiCVJ0YwHgKLnIRB7kaKJB4g/ADETEHvgUUdqyIBCvBmIa0lxDAcQfwNiH1I0EQH8gDgAiNcAcQmxmkAh8gOIVajokBtALA3EfEB8DYiridWoBMR5VHQIWeAoAySl9wy0Q0AAlIPqB9oRo2AUkAIAKJgp3pQdCHIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.039.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAASCAYAAADLw4ffAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABw0lEQVR4nO2VQShEQRjHv7Rt2yYXSZtcHCTJxUHSXuUgSUmSHPYmOSnJycFFcnTZJAe5Sdqb5KykzUlK2oODlOMmbfH/m9n63uw83tsL6v3r15v55s28/8x8M08k0d/VBBj6bRPNqgTOmujXAV6d2AH4UFTBJRhw3msFm6AC3sC2mAV8iGOgAObBGhiL5112rUFXnMCkLafBErhX7TlwC1ZABrRYHxzrMOrHOXDJU46iUTET9pnnLrarehY82zKNlsG40ydnx5qNamDDmqiLO7AYoR8NXIhZNdd8Cryo94bFpE3Bxvg8DhmXY3VF+P7Xyhx54qdiduE7ccVX1Qe1piSY849gULWfS/z0bBAPSK8nnrfmwsTt5aHK2LprvgimbTltxyqqdh7OVFyzWj1iDluYeGjaQtpOJLiyrvmKY46pU1X191hOPdqT4IFyxR3Z8sS53RdOrKbKvOrcVOQVWVH1azDiGbvgiTWI+bce4b0dCR4e3gI3oFvF+sSkQaeYFeYVWU+ZrDX0BJZVnxkxk8nbOvsyC/qjmOfKMS2KP8D02Ld99I9nTpnQqVOTxp/TFVjweOCNdicmhcpqIokSJfrP+gROpmKAFUyrwAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.040.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABEUlEQVR4nGNgGAXDHLABsSM1DfxPIQ6lpmPIAaAQsR9oR9AUdDHgDn4QmI8m9g2I9wOxDi0csxiIy5H4SkgOgTnGD8oGRU0WEN+ihUPWAbE01JLnULEfSPKbgFgYic8FxC+p7QgWIN4GZUcD8Ros8q+hbCYgNmeARE0ytR0CCnLkNFCLJh+AJn8fiPWo7QgQmM0ACQlBBkh0+GCRD4KyQVFXDhVDB/jKHKLAU6gjQOATEPOhyT9kgEQPDICi5xuxhhMLTIH4IJoYqPi+AGUbA/FSNHkdqOPQAdkhAvLZQiAuQuJ7MUByQy2UD8q2sGgB5RRQAgWFYA4hw0kBfxhw+0ANizwoOk4CcSw1HTEKBhUAADaaXoIw/RBeAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.041.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAmCAYAAACFz8YUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACi0lEQVR4nO2Zv0scQRiGP+QQketEwiEhrQSxEQlBglwTQooggoiFWNiFkEqQkCrYWeQfsBALEVKkSCWIpA6EEKwkIHKFhQiWEkTQ72Vnublh9pc7c/MdzAMv7A57u4+zO7PfrESRSCQSGef84NyqvAmrk0ub8ze0hM4nzlO1jY67DehSxCnnPrSEzpC2Pcw5CSVSElGdlzLL2eK0QosUIK7zVimR6nBeOTwvnuS2w/MBn51Xyxdz3n+j7d5Blh4rZCGv81y41vJ1eWdxJ+cdng/4fvJq+YqbUwzE+kkvVZqUdF4ztEjKL+qOdXTc25K/Q3F9bWnfpd7544bzkzNV27T3vFXIcsVN+ELJixJz/TZnhnNWw7EUXyn7j0AHvlPbmEfec/75FsrB5oqSDDXtR84IJfXuujpuz6fMHGfTIpSC5d6Ytj/KufQplIPNFR2FZZ65FG2p45Z9yeDCx5TcLVvnNThX2rEvKBm2676EcshyhctBxm9w3IQvIdzFDe1CJgvUOzedc6Z9yRSQ5XrEed1vGTzWmExHLEIpO5xFtY35blO19Zs8V7wcGnVOXqbSNvle4piOIYahc1Ph2i48i1z7Xo7hMT822u6Mfbzm9402lCgdX1IZFLn+5ry0/M7LvIy3zx/qfvcDk5Q8/k/UPp4wlCjpkB1VMhecDz6kMijjirWr/hEE7ShnnruW0YveFe3i+nBAR90ZbRiqKMBXXQs5cAVrlHxcxRBG2eLya1KkCljChCpkqyDS85AEf7HQEOeJCR3/CBIlZUGcJ94waXkhRsqCOE+sAL5R9/uYCCkLIj0/c55p+yKkLIj0rLLcCclAeIoTykCkp0gpCyI9RUpZGBTPSCQSGUgeABUa6L/EUHWbAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.042.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAmCAYAAACFz8YUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACeklEQVR4nO2ZzysGQRjHJ0mSmyRJrpJcJEmSi+QgKclBDm6Sk5Kc5ObgH3CQg5SDg5OSnJUkJynpPThIOUpSPN9mNmOa/eXdeefZmk99a3fbH5/mnZl9Zl8hAoFAIDBGufUtkYFWyinlU2XCr47knvLtWyIDG5ROtY2G+/To8ocyNF6dtt1AufMlYlKGxosYoGxT2n2LRLhqPPSQsQLvtyCka4UyUuB9I/7lm9R43wVkNq9QCpjzPhy55vZ12fNGHd3bhfO/fMs050WwcG4WUqTZt0gO2JQq+ljPA4rWN8vxfeOe75RLSm8VjuBKuycabjLHtXGu6DBbQr6AMIfuUPopj1WZZmBXxDc4GnBKbWMeWaY8uBZKwOaKUge14iqlUcg6ckmdd+BSZpiybhGKwDKqRdtvory4FErA5oqGwpLUXOK1q/PmXMngwRdC/lq2xqunvGrnDgo5bJdcCSUQ5wqXo5hrcF6HKyH8imvag0ymxd8574nS50omhTjXc8p4rWXQrTGZNlqEIvYoM2ob8926OlZrklzxcqiv5uZZKm2TkwznVAwxDJ33HM8uwjPNteZlDrr5hXHsy9jHa/7QOIYSpeJKKoY012vKkOU6J/My3j434vd7GugWsvu3qX30MJQo0ZBtUjLPlBUXUjFkccXaVf+4gOMoZ3qKltGL3nnt4fpwQEN9GccwVFHYLhQtVIArWBTyQzCGMMoWF19pAlnAEsZXIZsHlp5ngsmXihTYeWJCxx8srKQssPPEGyYqL9hIWWDniRXAsfj9lsdCygJLz01Kl7bPQsoCS888yx2flMKTnVAMLD1ZSllg6clSykJZPAOBQKCU/ABG/ei/fCgnYAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.043.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAmCAYAAACFz8YUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACmElEQVR4nO2Zv4sTQRTHHxKOEK6TQ4KIrYjYiIiISBoRCxFBxCJYpJPDSghiJXYW/gMWYiGChYWVIMFakEOsRBBJYSGC5SEhkHtfdpZMxpndye6M8wLzgQe7e3uzn3s7P97sEWUymUxmh+Mtx0zFlbQ6lQw4PqeW0HnAcUwdI3GzhC51fOVYpJbQOaQdb3F8SSXiiajklZzleMzRTy1Sg7jkDamQmnJcDNguevIgYHsgZvJa+WLO+2tcWwSIm02FLFQlL4RrK9+QbxZv8lLA9kDsntfKV9ycYiDWT3qpsk1F8rZTi5R8pOVYR+Kuev4eius/luvPaXX+2Of4wHGqtelqu+vgcgV4EY+oWCwx3z/hOMPxvaGjF0/J/UcggdfUMeaRuxzfYsrU4HJFWYa69h5Hl4qad6TufRFL5gLH2CEEsN07rJ33OH7FkqnB5YpEYatnbkf76t5bMWTw0AkVb8qWvA7Hb+3ec1QM25GjvZgLQJUrfF5VOB2NIYS3eF97iMl1Wp2bfnCcrmgvZvKqXN9zXI747H9Al8ZE2nUIgWccN9Qx5ruxuuYiVvLqXLE4dJo27lNpm7zxuGdqSGHo7K/x7CaeTVz/a0mGLj4xrs2NcyzxL41rKFGmFe3G6Hk+rp84zlt+1zU3NwYrzx4tv/uBE1R0/SPqHD0MJUo5ZHtK5CfHbkXboZPn4wqwf9U/hOBnKGlOhpTRi97b2oP14YBEzY1rGKoowIc17YdMnq9ryR0qPrBiCKNsCflFKeMLtjCpCtl1EOn5jgR/sdAQ54kJHf8IEiVlQZwnVpeyvBAjZUGcJ3YAr2n5fUyElAWRng85jmvnIqQsiPT03eqkZiM8xQk5EOkpUsqCSE+RUhY2xTOTyWQ2kgNrXu+4412TyQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.044.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAAmCAYAAACFz8YUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACkklEQVR4nO2ZsUsdMRzHg0gRcZMiIqWriHQpIiIiLqV0EBFEHKSDm4iTIOIkbg7+Aw7iUAodHJwKRZwLpRQnEUTe4CCFjiLy4PX3JTmMMbnLXS/N7yAf+MHdvXu5D7+X5H7JEyKRSCQSMxS/Ykt48JLihOJBxfu4OpILik5sCQ+2KF6pYyTuIaLLE5qQvC7t+AXFeSwRkyYkL2OMYpdiMLZIRqjkoYfM1NjespCuLYqpGtvNqOSbl7xODbFQVqgAzHn3gVxL+4bsedOB2g7hXMm3SXNeBgvnPiFF+mKLlIBNqaKP9TKgaP1juX5otHlHcUYx+g+O4LvWJhL3ocR3Xa4AnWZHyJcQ5tE9ircUV5VNPdgX7oQjgbPqGPPIKsVlSJkCXK4od1AvrlP0CFlLrqh7j0LJTFJsOoQAllH92nkvxW0omQJcrkgUlqXmMm9Q3bsYQgYPPRXyl7Ilr5vit3bvuJDDdsXRXsiJP88VPp9znIZCCOFX3NAeYjInns551xRvctoLmbw8128U7wI++xno0phIexxC4IBiXh1jvttU11yESl6RK14O3VUb96m0TY497mkZUhg6dyWeXcWziut/LXXQxU+Na23jHK/4T8Y1lCitnHZD9Dwf1x8UE5bvuubmyuDN81M87qeBYSG7/oA6Rw9DiZIN2V4lckOxltN23cnzcQVYv+obDPgMJc1InTJ60bukPVgfDkhU27iGoYrCdrmg/TqT5+ua8VHIzWAMYZQtIXZqEkVgCROrkC0DS8+vgslORQHsPDGh4w8WVlIW2Hni7ZKVF2ykLLDzxArgi3jcy2MhZYGl5zbFa+2chZQFlp6+S53YNMKTnZADlp4spSyw9GQpZaEpnolEItFI/gKdQe+42hkRKAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.045.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAAAXCAYAAADz0VYRAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADS0lEQVR4nO2ZQYRVURjHPyMjGfEWmUXGkFkkyZAkafEYY4wk0SJJ2iRpkTEkySwSGWnfYrQakSTPSJukVdpkVkkkLZI2yRgZidf3d87VmfPO+e499533xhvfj7+57zv3nvs/9zv33HPOECmKoiiKoijK4HGWdWyrTSQwaH4V5iRrmvWEdXiLvVRh0Px2cI31nfXCiY2xXlW4doW1N6OXBusl64+9/56MdcfAKHG8D/eJsZp4fj/9ZsvHJdY71gjrq41NsN6yjlS4vknmQe2ra8BjgXWINcRaZD3NVK/ElT7cIyf99JslH/vJjGSTTgwVvmGNJtQzznpdx0CA887xbtZGpnoLhrzfeFFGMt8j1UMK/fbbdT5arLZVy4lfYN0KnF+cixsPs5ZZX5zyBXttbn5G4vdY66wfrMs2NktmiG/bvzPO+UXZoi0HV1nPWUtkPkc+ZW1OJeRhivXBHjftMV5cfGU2vDb0wm+7pNwnlg+ROdZdL4ZOF/tkHiDzSb1O5tvtgjnDszomBHCPB4H4TdY8mZHhDOuTjbuda8b+Jq8MyUx5uFKbUwl5+BU4Rocaps429MJvyrOI5aMUTP6nvRhGCWloR4+eDMTxYNYC8bagMjBCjgfi3yIe/Trd3xgpLla4Z4hYm1MJeUA72oHjgtQRB6T4Tak/lg+RHazf1Jmwv8I16ExYMMxGylPfPgn4inWM2MORkoQ550PWZ0rbhyprc8qLFPPQjhyHfnfrt6gz9eWX8iGCYXklEF+zZkNgPnGHdTtiJOeI1hTKsIAJTYirJOko/V9dV0Fqc118Dzk7WqrfqvVL+RC5T2Yu4IPJZmyP5hTrNJkl7rxXhiVwq+OKehQr3oOsR4FyeJ+zx9hWKSa80hwND3QqEC9DanMqIQ8NG294x35Zr/xW6Whl+RBZpfAWxjkyb4TPRzIbs1jiYq7hr0xvUP05kMtj2jzqLQXO2UXmQSJZaEexBC8SWKw63c8HYkjAOsmfFZeyNqcS8iCN9inz2bp+y+quko8omNAtC+XYE5tIqG+U8u2jKdsAbAPsJDP8STv56IjvafMeTowTZJbTuf4zoGwDsOOPFU+ViR1GqdBiwQf/BxvrxpSiKIqiKIqiKPn5BzPe9Vxp3NdkAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.046.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABUUlEQVR4nGNgGAVDBOQA8XMg3oYkJgvEe4nQuwWIpSmxPBGITwIxDxA/hIqpAPFxIDYlQr8jEF8AYiVyLNdggPjcAEmMCYgPArE4CebIA/F+Ui3fBMT/oXgTkngsEFdjUQ9TGw3EbEC8FIjvI8nXQ/WSBIqAuBWLw3AFvRYDJGoKgFgQTc4aiNeR6gBQonNDE/vCAIkGXOAdA2qUwQAoVD6RYjkLEH/DYtkfPHpAloASqhcO+V+kOMCDAZKF0MEnqEXYgAsQNwNxLRY5JgYSQ6AHiLOwiG9ggMQnNuAHxAFAvAaIS9Dk9BhQEzNBAMq72LJaJAPEl+jgBgOkwOED4msMmDmlHIjjibUclG+X4pEH5WkVYg1jgHiEqHLgFhBzAPF8BvwlF8iB5xgg6YQQsGWAZE2iSkJQCXeXAVJ8EgIgX2FLpOhgBwOk3hgFowArAAB6/DgBfVVRhgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.047.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAYklEQVR4nGNgGGhgC8TPgfgPEP9Hw3jBJSDWAeIfUP46INYg1lYuIP4AZW8DYg5iNVoD8V0o+ymxmkAgB4g3QdnfSNF4EojnQ9mgQFJhgAQYQfAYiB2h7CkMkIBKJsXmEQ8A0ZkVNMOQjtsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.048.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAASCAYAAACNdSR1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAWUlEQVR4nGNgGJRAFIg3AfEvKPbAp7gSiGWhbA+oBpyACYnNBsSXiHGOKRA3A7EkIYWxQPwfiB8CsS0xJoMAyM0/iFXMALWB+ooJBt1JqGn/oQq9SHHGkAcAGRgRjIh5ho0AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.049.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAYklEQVR4nGNgGGhgC8TPgfgPEP9Hw3jBJSDWAeIfUP46INYg1lYuIP4AZW8DYg5iNVoD8V0o+ymxmkAgB4g3QdnfSNF4EojnQ9mgQFJhgAQYQfAYiB2h7CkMkIBKJsXmEQ8A0ZkVNMOQjtsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.050.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQUlEQVR4nGNgGDJAFIhfkqJhBxD/J1ZxDhBXEqtBC4iXQtkENbAB8Sog5iFWQzUQyyPxCWr4jwMTDUhSTB8NAwQAYcASsybaOwAAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.051.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAq0lEQVR4nGNgGPFAEIh3APEvIN4LxKKUGlgPxHpAzATEXUC8hlIDo5HYfED8g1ID0cE7KG0LxM+B+A8Q/0fDRANQePZB2ZeAWIcB4eJ1QKxBqutigVgeic8FxB+g7G1AzEGKYaBIiUcTswbiu1D2U1Jd54hFLAeIN0HZ30gxTBxKg8JsPpL4SSQ+KHJUGCARhRcsZ0CNwblIco8ZEC6fwgCJoGRSXDoKBggAAFf0It3oJBnPAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.052.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAASCAYAAACNdSR1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAWUlEQVR4nGNgGJRAFIg3AfEvKPbAp7gSiGWhbA+oBpyACYnNBsSXiHGOKRA3A7EkIYWxQPwfiB8CsS0xJoMAyM0/iFXMALWB+ooJBt1JqGn/oQq9SHHGkAcAGRgRjIh5ho0AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.053.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAASCAYAAABb0P4QAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAq0lEQVR4nGNgGPFAEIh3APEvIN4LxKKUGlgPxHpAzATEXUC8hlIDo5HYfED8g1ID0cE7KG0LxM+B+A8Q/0fDRANQePZB2ZeAWIcB4eJ1QKxBqutigVgeic8FxB+g7G1AzEGKYaBIiUcTswbiu1D2U1Jd54hFLAeIN0HZ30gxTBxKg8JsPpL4SSQ+KHJUGCARhRcsZ0CNwblIco8ZEC6fwgCJoGRSXDoKBggAAFf0It3oJBnPAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.054.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAQUlEQVR4nGNgGDJAFIhfkqJhBxD/J1ZxDhBXEqtBC4iXQtkENbAB8Sog5iFWQzUQyyPxCWr4jwMTDUhSTB8NAwQAYcASsybaOwAAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.055.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.056.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAWCAYAAACosj4+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA30lEQVR4nGNgGAWjYPCA/xRgmjloUAGaOEgQiHcA8S8g3gvEoiQ4BuYgRyC+gCZvzkBmVNUDsR4QMwFxFxCvIcFBMHADi2U5DBDPwoAaEJ8jxuBoJDYfEP8gw0HY+Cxo/GogriTSbBTwjkoOQgegKFUj1TGgIO6jgYPUGDDTGFEgFojlyXAMIQeRFV2gRB1PgeX4HARKzCRHlyMeS4iJHlwOUmEgI7rEobQOEM/HoeY/DjYI8EDFeLDoA0VXLSmOWc6AWnDNJeAgXKGDq+AjK7qIBTStGMkBg85Bo2BAAAARGE3KIYktrAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.057.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA3UlEQVR4nGNgGAWjgHjwnwhMM4sHBFBksSAQ7wDiX0C8F4hFSbAU2eL5SGKHiTGgHoj1gJgJiLuAeA0JFsOAGhA/BWI+IvWCQTQSG6TxBxkWg3wbSYql2MA7Ei0G+fYPEF8A4mYgFibHUlB895FoMQywAXEaEL8EYi1SLY4FYnkyLEUGWUB8lBRLQYkrnkhLCGWjb6RY7IjHAnSL8FnMAsSXiLVUHErrMEBSKDbwHwcbBFSgNA8QLwTiIGIsXc6AWrbOJWAxNt+CCowLUBxKjKWkApoW/IPS4lFAEgAA+v482Xzfma4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.058.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAASCAYAAACNdSR1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAWUlEQVR4nGNgGJRAFIg3AfEvKPbAp7gSiGWhbA+oBpyACYnNBsSXiHGOKRA3A7EkIYWxQPwfiB8CsS0xJoMAyM0/iFXMALWB+ooJBt1JqGn/oQq9SHHGkAcAGRgRjIh5ho0AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.059.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXElEQVR4nGNgGPRAEIh3APEvIN4LxKKENNQDsR4QMwFxFxCvIaQhGonNB8Q/SHXiO1IUg/zTR4qGWCCWJ1YxyNPxpJjuSIpicSitA8TzCSleDsT/kfBcUmwaIAAAyyYNqin/ZtYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.060.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGoAAAAWCAYAAAAowQktAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACm0lEQVR4nO2YQUhVQRSGDyIhEm4iQiTaioQIERER4iYkJCKQaKEu3EVEi0BCQlwFIhJtW0hEtHMR7kJaCyHSKoIQiRYiuBKJeFDnZ87Aece5d+b67kur+eDHO3Nnzj3/ffeed55EmUwmk8lkMn+As6w9M7fM+qV0wPrAumjWnWbNs7ZZP1gLrEusr3L+hYrRYO2z3rOu1W1CCHnRpPryxPxZ2up3SQJbYOqWHJ9i3Wd9Ued7WZ9YD1ldrA7WtMR6pda9Zt1TcXD8nTVUR/KGIi+amC9Pqj9LW/zik56hsLl3rDNq3M3akWMkvckaNXt6JdZdNbcq85qbEr9Oyrxoynx5qviz1O4XyayRe1qsuU7Wrlp3hVyJmJY5/H1bEBex+lScjYJrHxwp6zBlXjQxX55Uf6H4tfvF0/dYXVxzm5pr+RZrUJ1H3b2RcA3EeR6YR+I/qyQbocyLzafMlyfVXyh+rX7xauILsUvG1txL1h05Rp2dkTkPvlg7E66DPWOB+QFypaUOYl5sPmW+PKn+QvFr9btCzU+WNYcuRydqX93Up+MbhQ0vsp6aOZtPUW6WmBdNzJfnqG97Fb9R8EqvmbmGOkb7+cacR/u6rcYfWVcDsXWtv0yuhFhGyJWcnpRkIxR5QbNw3syX+bLrY/5C8VP8hvYFQbeyYRb3k3vVz5F7wtC++vLQLcmhvXyg9oyTM3hdxtiL1nhAxoiDFvaRjFFmhsk9WZ9ZF1KSbcHLM2ruzGK+Zs36mD+7PtWv3RdE/9jzff44NZeMhhmjLKyzJgLxpiQJlIlNZaqDDpcixMFvkjlyN6lVUrxMqvUxX2if7Q0s8mfXV/Ebus5/TdUb0u71re77Z8kf1F8C/i305AStb3VfJpPJZDLHwm+RDup2IBn66AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.061.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAAASCAYAAAAaJIOvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB4ElEQVR4nO2WsUsDMRTGH1KkFBFEpIiIq0hxcRCRDi7iJCIUERGHbiJOQkdxdeg/ICIO0kUcnAQpzoJIcRJBpIODCI5FSqF+z6SQptfc5S6T5oMfTdLLey+5vHch8vLy+qMaA1/a2BloKzTAHcg58hnF/hA4AnXwDY7BHHhN6HsE3IAmqJJYf2yVSSxAFy9wVbYHwS54SeLIwv44eAL7IA0GQFHGeZ7Q7yGYlTb5hVzGNbQIShS8eddgVOlnwEdcRxb2eVE1sKI9zxvKcW4k9LultIdJnGprcZB8bNPUu3kp8Kk8N08irYpxHAXIZJ+p9JnHcU44iqEjvWRFEp+4A9nWN2+NumvSG4mj7kom+7dg2aEvk7j+lW0ncQpw4U3Lvr55J2BdtrkeleSYrrYBk0z2OY1SURaRMAbWNpiy8PWrqxBH/IVTF8Cp1bB1YpDJftOhH5PY547tJE6JqjbWUtp8HbjQ/ucrRD3AVpy3Hmb/ASwEzOtXb+OevKWQ/3vEX6pHMKmMTZNIlSyJt8FXiE5KZWTQ72DP1lmAotgvkNjIvOxzXFyXZhz47ygrf3MynlCpF9NNOVag7jfV0vqcSvckaoMLRbXP6fRMIoX52pInd6poMZw6tO3l5eXl9d/0A6e2lhJrVV8vAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.062.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA8klEQVR4nGNgGAWjgApAFIjfYRHnAeJGIH4IxD+AuAuIjYH4LiWW9QHxfzQxSSC+BMR5QMwBxExAnAxVt5Bci6yBuBzNMpDBF4DYA4sDQOrCybEIZOheBojLkS0D+WA5Dj0gddLkWAbyUQmSITCwG4jdyDEQFwAFCSiiObBYBkoMLNS0bB3UAmQMA7+oaREoiPaiif1BYp8BYkss+pKR2MJALEvIIlBKOoemUIMBEnTiUH4oAyRv2UL5IHFQ9tBC0lPNQCBVzmdABFkkksHIQckFFY8H4hsMkCC9gGQxDHgRsoyaYPhalgXElfSybBTQBgAAwxIzHfE37aUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.063.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAWCAYAAACG9x+sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABXUlEQVR4nGNgGAWjYBQMSzAfiP8j4W9AvB+IdYiURwc8QNwIxA+B+AcQdwGxMRDfxeMGcvRgeMIPymYD4iwgvkWCPAxIAvElIM4DYg4gZgLiZAaIxxfisJscPRhgExALI/G5gPglCfIMUIsvALEHFgeCHBOOxV5y9GAAFiB+jWSgOQMkiSQTKQ8DIP5yHHaAHCONRZwcPRgggAE1jd8HYj0S5GFgNxC7EWMhhXowwGwgDoKyQem7HCpGrDwMgDIfC4l2k6MHAzxEMwSUTL6RIA8Dv8iwmxw9KABUVC1FEwMVjw+JlAdlbFko+wwQW2KxAzmvIKsnVg9OAApJUPEISx5cUI1PgTiHCHkQqGZAlBShDBCP2UL54kDcB8RaSHYiqydWD07whwGzgjoJxLFEyoOAF5qD4oH4BgMkaVxAchgu9cTooSnA5iBqqqc5GPIeADUpKmmofhSMglGABACf7nCvuI4TVgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.064.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhElEQVR4nGNgGAUkAlEg3gTEv6DYA0nOCyr2H03OC4d6rKASiGWhbA+oJhhANgBZDiaOrh4rYEJiswHxJST+fzS1MD5JFsCAKRA3A7EkERbADAZhL2IMj4VqfgjEtkRYQDYAuewHLS1AN2ToWUBsMiUJnGSAuAyWmZBTBcxQbHKjYCQDAGAdM6ZmQccYAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.065.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAASCAYAAACNdSR1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAZUlEQVR4nGNgGJTAC4h/AfF/KO2BTzGyAg8oHyf4BsRsSPxP+BQHAPE0KDsUiHPwKQaBIiA+A8TJhBSCQB/UdJAGUXwKe4BYB8rOAOI1+BT/QGLzoPExAElBB1MAixQvfIqHHQAAWfIXFqPxE9cAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.066.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA1klEQVR4nGNgGAWjgHjwnwhMM4sHBFDFYnMgPgjEv8iwVBCId0D17gViUWItdQHiG0AcCsRsZFhcD8R6QMwExF1AvIYYA4SB+DgprsRicTQSmw+IfxBjQC0QLwTi5wyQoPIgw2J08I4YAy4AsSOU7cFAXhwjA1B89xFjALpFxKRUfGpigVieGIvRDSHEx2cxKHHFE2MpIYv+E6EGGTjiEMcKkBMUrjhGL/6wWSwOpXWAeD4xFsMs+w+lvXCow+V7EFjOgFo+zyXGYmIBzQt+YiwfBYMbAACM3EN6/kpZrAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.067.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA40lEQVR4nGNgGAWjgHjwnwhMM4vpDii21AuIf0ENAtEeJFosCMQ7oHr3ArEosRYjW+YB5ZNicT0Q6wExExB3AfEaYi3+BsRsSPxPRFoKszgaSZwPiH8Qa3EAEE+DskOBOIdIi3GBd8RaDAJFQHwGiJOJVI/LYlB895FiMUjxNKjlxCQOXBbHArE8sZb2ALEOlJ3BgJo4sBUCuCwFJa54Yi0FAeTEwMOAmTjQLcdlsSMploIAMdmJkMXiUBoUcvOJtRhmGawA8cJh8X8kNjJYzoBaNs8l1mJiAU0LfWIsHwWDHwAAQJVEn3Fzc4IAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.068.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyUlEQVR4nGNgGAWjAAH+E8A0sZBugGzLvID4F9QAEO1BooWiQLwJqpco/ciKPKB8UiysBGJZUvR/A2I2JP4nEi1kQhIDmXOJkMYAIJ4GZYcCcQ4JliEDUyBuBmJJIvQzFAHxGSBOJkYxFgtjoWIPgdiWGAP6GCC+BFkqSoaFMACKwx+ENPcAsQ6UnQHEa9AMRjecUHYgmF2QXcTDgOlCqltITLb4j4ONDojKFjBFsIzvhcPC/0hsZHASSR6XfrIAzQpkQpaOgoEHAKxRRYQ2wjYQAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.069.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAOCAYAAADwikbvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdklEQVR4nGNgGGyAD4hbgXgDktgaIJYnpDEWiO8DsQ4Q1wPxFSB2AeJthDSqAfFdNLHDQPwNiNkIab6PxWlngLiakEYmqA3IwAOI3xHSCAIsQPwfiHmg/EQg/gDER6H8uVAxnKAVajsIw0K6HspfTIwLRgEeAADjyxZVmMH30wAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.070.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAUCAYAAAD7s6+GAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABnElEQVR4nO2VL0gEQRTGHxdE5IpBDpFDkAsiYjOJwSJisoiIiGaDSTAYROxGwXSYbIuIiHCImGxiMMiBwXgIhkNERNDvY2bZucftv7li2A9+sLP7ZvbbeW/eihQqlKgh8K7uVcGNvZ4Djz2+4xKM9LiGHIFfZ1wD92Dajp/Vcx+FHzvmu8AM2HWMlMAdqKi4Xo1So+DWZyJNMb39jpF1sNclNqvRRdC0rIA39XzfviOXuJM7ysiFRCl3lcXoGngCk2AAXIO6imEGgzwmh8GLmN10jXyI2em8Rll7r9JZMg2wpOL6QDuP0cC+3IX6iYlPM3oMtpzxIPi0xrS+s5qcl6j1hAoNtmMWTzPakig71ImYlqRVkow7ygJ/ENMnQ42DLzFpOxdTR67K1mg5YV3OnxDTkw/AKdgWc7hcTYk5B4mqS5TmVXtvWTrTvwkO1TxdHhQPTcMZ0xxTGlizZ+AKLKi1eIA30oxmFXtdLSWGaW7lXLcinn00TmzMLA+9G67Y1nSJJGlWzN/O+88UJ359t8PgK/bUampUoUL/VH8MZFUeEK4/6wAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.071.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAUCAYAAAAUccS4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB30lEQVR4nO2WP0gDMRTGH0VEHAQR6SClIB0cighSHESkm5OIm4g4dBNHwUGkg5uDOAki4iDiIiKlgyAiTuIiDg7iIh0ciuAgUqQU9PtIDtIjd7kTdboPfpA/L+9ekpfkRBIlCtQB+DJogCuQN2wy4NKo94Jz0NTt/SH+d0ELdFr6qmDgJwFP6zKdLoEnXc+BG1Aw7MtgGKTAJjhx+F8MaC+CezAYJ9gK6DPq3aCug7kGaZ/9vFHuAZ8O/+WQvqyonYykDvCqywxuTA8ugQWwFsHHW0gfJ8Od2xE1qZLFpqy/5dSMtOfss6gtprjihYBxnpi/WyH93AVvq+nLNrFxcBol2D0wq8vM11XdRn2IWu0wcUWyIf0MYtKoNyw2/O67M1KoJioVPKUMhy3HWNoGHR7Rfu+M+oioM2BT0/EtGQVHvjZeWTVd5mxtV46nosM/U2zdqO+LPTdT4lhZGjDxvRTgDcDkfwHLuu1MVD7Z5N0Qee3HpkMwJGrCPKgXAXY8I5WwYLnF/sfgVtpnPgc2LGOPfWP3jb4HIyiu/KOoW2AbdAXEwnMSlk6RxWssF8OeAdVj2Kclxj3rEk86D8lURPsVCU4dvyZEvY6xXjCXOPvqbzrU4v9F5g/8Jkr07/oG6JpZU6zjw9AAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.072.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAmCAYAAABwMU2kAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACAElEQVR4nO2Xr0sEQRTHH4cYRASDiEEEg0lsIgaDcOG4JFYRsfgHiEUMF0SQQ+yGw2CwGMQgFpMYBIOIGIRDDCIWMcghlvP7mFlvGGbnDr27t+fOB77szttfb2Zn532XKBAIBNJNP3QGfUHn0IBsOnIUoAkoAxWhI9l05Fgw9vugT6lEksabdAJJgNeLXekkksAiNCKdhDS8WC5JJ5EEZqUTSAKDejsO7UslIW1oDqGqoVKbn/9D6gxNJibesYZmG/qAXqEVHcuTmtpVvc0Z50fHivp4PVyGhgdoCzo2YjxzxErdOrRG6u3OQw86bnY+p9tkHeNVud5AuAwN1/ZHUgsZf0Z3UBY6/VUPmsQzuae43UGzfU+N12fb0IxBZeucC6gCdTueGaemE3dT30Bwadoj1aFpz71dhoZngj39r6ENf5oN4Ru4ugP4AvXG3NTXZqagJ8+9bUPDA1OxYvyJxf0UtXVG7ECren+U1BtjfGsEJ5J1xE1chqZLXxsN/DL0Dl3qdknHROghtVpzh26oVvqiTkZVI29cw7E5UpXGjEf4DA1XiopWVDEKun3w594EAi7Y0p+Qmsm2B0oV7I2G9b5vHfv3mL6IvcmtVCJJYRLahIakE5GEHS1XLPY5M8K5JAJeIzrm77fVtMSJdiJhICjl5fOKavbe/j0IBAKBhvgGPaiHNkRLWrYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.073.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAUCAYAAADPym6aAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABHUlEQVR4nGNgGAWjgC7gPx3smAnEf4CYjZZuoYdHQCCeCDVDwiP1RKihiUe8gPgWFIcD8WsK7OAD4vlAPA2IfwBxMoluIQpg0xwNxFeAWAeIuYB4B9Qh5AKQeReAWAmITYH4HQluIRqgawZZ9hCIxZHEdgNxAAV2rANieyT+NzxuwYfxAnQFoOjPQuILQi1GL3GItZAFiM8h8Q2A+CCRbiEJoGt+CcQcSHxQ0bmFAvNBMVmLxJ8LxLF43EK1GAFlRi0gFgXiRiBeCMR5DJDMTw5YDMQaDJAYrWaAJFNi3UISQNcMcvwvBki6BnlmORBvA2IPMs13BOIbDJAAmsCAGtuE3EISoFc9QgwY9QgI/KCWK6gABpNbRsEoGPIAAAA6U8hXg18WAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.074.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAmCAYAAAD0t6qKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAg0lEQVR4nGNgGLnAEYgvkKPxBhD/J9fWUY3U1sgD1chDjm0wPAooBf8J4FEABPMZEAFymFhNakD8FIj5yLEtklRNINv+MECKxmYgFibVADYgTgPil0CsRapmEMgC4qPkaASBb+RoYgHiS8QqVoHSoPJmIRAHEasRFOEXoDiUBNcNOwAALI4lPTRETk4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.075.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAoCAYAAADkDTpVAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAzElEQVR4nGNgGAU0AP+JwBRbQFNAVwvmMyCC5TC1DVcD4qdAzEcNg7FZAHJ9JDUNR7YA5Po/QHwBiJuBWJjaFsAAGxCnAfFLINaituHIIAuIj1JqGKHk+Y1Uw9ENxGcBCxBfItYCZAP/o/GRgQqU5gHihUAcRKoFyIZicz0oY12A4lByDEe2hKbFA80tGAX0BcRUh8TiUUB9QPX6FxnQpP5FBjSpf2GAZvUvOqBq/YsPkFz/kgOIrn/JAWTVv4QAVepffIBq9e8ooD8AAMBKUmsyq/0DAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.076.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAoCAYAAACfKfiZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABF0lEQVR4nGNgGAXDEPwngGlu+YACqjlAEIh3APEvIN4LxKJkOGA+AyLYD5PqgHog1gNiJiDuAuI1JFquBsRPgZiPVIthIBqJDTLkB4kOAPk+klzLsYF3JDgA5Ps/QHwBiJuBWJhSy0HpoY8EB8AAGxCnAfFLINaixAGxQCxPouXIIAuIj5JrOSgRxhNhGaHs941cBzjiEEe3EJ8DWID4EjmWi0NpHQZIqsbnCHQHqEBpHiBeCMRBpFq+nAG1/J6LxwHYfA8qeC5AcSiplpMC6FLBDGoHjILhBwg1p6iFR8HwABS1+SgFFLf5KAVUb/ORAqje5iMXUK3NRymgqM1HLUB2m48agOw2HyWA4jYfpYBubb5RMPwBAMRsZBDxiv16AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.077.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAJUlEQVR4nGNgGDTAEYgvEKPwBhD/J9bUkaeQB6qQhxjTYHiwAACyigz3zfIliwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.078.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAAuCAYAAADqWH1CAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAERElEQVR4nO2cX4RXQRTHj7WS/CxJVrIiK1lJJMlKImutJNFDVtJb0kNWrCQrK5Ks1WuSHlYkyc9KJOlpRdJDsiLZh6SXHpIky6/zNXPtNTszd+7//d09H47f7rm/e3/n3jMzZ86Z+f2IBEEQBEEQqucgy2OWX3UbIpTPCZYFlmMsG2q2RaiAdyz76jaiIlosW+s2om6WWXos+s0sL1j+sbwi/4PCMYwQe1kOFG1gTjayjLPcYbnOss3ynjFS99nRr6OVWVcDHYd+ipQD0RhuszzRejh2LCZRQ7jLMkj2xlM1CE2nSTn5Bqn78BF38qj+v7G4HD4e+7uP5a/+u2VIr9bD4bbeUxWw4yTLDMstSjfSmM/A9UwaQejN/XTod7KcYTlCqjdtKsKoGB0taIDouXMsX4337GL5RGrIzvoZvv8bRcjNIZ7PeI73GK9FM0Qqk7isbXERNTqEo8Mpri8ONzjLsqNsQxLACBOaTaDhjbBMk2oAScO7ODwGHt65KgzxgKF8idQk0QYcCucihvcax2A/ag03STl/u+V8cXiMo5VY4QeZARyaFKP3kxrO8V442QwxaAy29FIcrunXr3tYHlRgiws4D70XqeGVwHPQ6zFbh/MxMvjmF5KWMY9oZYYMuZ/x+h9ZXmY8FyySGoaRGmImfi3DNYZJDeloALa5SOTkqPASDx257L/E8p3leUw3QKqSlcQ82eNPXsoevlDp+lHyZ6TBjPFJZLb/PMtbUsWKJa1DZQrpRkiRALH0A6m8t0jKdjiG4OGSP6NMMtm/m1TPjqcViClvaCVOhoDh6HXaD/eAIsnvAq8nMG1aiYPtmB65rS0eJVWWpvS5RYAQ87CgawkxJkhNGuLA+a6h3FdZwvDyNKc9mDcgJ007wgiBYJI2YugwlPpSBVdlCb3etjOl4xETLIle9ZssZAWzwj+02rnLnnOSKkt580TMBVAbR7rhq00LGUCON2/Ro5e6thT5Kks9lL+HR0yyzHqOCxnAIvxFi/4Zuaf7vsoSFvPbq87IBlLEbwVdS9Agd7ZNjLCGPG3RJ1WW0CuLXMxodBmxahAr5zzHkVMPprhePxWbh4NGLxRUxWdSJTksOPgqY2gQ7yls0xwW9BcSrpcFm8Ojql5TKXzTIvLbLxS2tIhea5vUmWAH6UAeoxzYHL7o0DeFdbU6ZuJybDc6HPWOoYD3rav1b5O17vCQTYwRCHsIkQilvpVFcXgKfR2EbmKMwJ50hCWsf/dZjovDU+jrIs0mRoACFdYwMIGeNI6Jw1Po6yCp1OziAqkdKxOGXhyeQl8HoZsYI06RSitxTstyXBxu0NJ628Oqg9BNjIdIxfp75J+0SVpm0ZkLL3k3I2YlzSZG1DNC0rLSNi12A6HD2VrbjFgWjb9P1/fDTbp9M2Iojb9P/AJE0venhQZxnNT6+pa6DRGqA7/ihG+ayK84CYIgCOuN/1TlAv4kqZQtAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.079.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAUCAYAAAB23ujSAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACpElEQVR4nO2Yv2tUQRDHhyDB4hAsJIWEgKQQEbERC7EIiIhFELsQRGwlhYhgIZJCbCTkPwhWwUZEREIaEStJI0cKEUHEyi5FCCJBOOfL7pPnZGZ237t3gZD9wJfc29u3O9/9OReiQqFQOLAssH6y1mplk6x3I+xzhtWvPb9lnRxhf0DzCaTX46x11m4sP5HR9tDx32FtsHqsH7FsmvWRdWGYhhN8YQ1qz9XEnBpRf5pPoHldZJ1jjbGesV5mtD9U/KcprJDztTJ0/oE10abBhgzE8xTrfcM2ztDeFS7RfALL63zt8zHW78xY2sRPbygMxCB+rrjFeqTUr+oiyHHWKuu7074c5Nw6izGGFDgGnlNYzRedepZPIturZCv+zRmD3Pj/4z7rqShDsNaRhNUH4/conKMebSfiEuuV8w5WKGLeZM1m9AE0n8DzWgGfy7Xn1Bik4lfBlr4qynYobFkLrA65xTXaTgRW2rZRHwP6mcKl68Uo0XyClFeA1T0lyrwx8OJXOcL6pQTyx3kHneCiu258P3Bk1dfYNcofsr5SWI25E2H5BJ5Xiu/cFmWpMQBW/CrXKKRcku3YmcYV1hPW44z22+6IMfJXFI4DZDLYGTcz+rB8EvlewYxSlhqDVPx7WGLdVcpfUzjnNHAm36CQzj1ItJ+aiF6s0xPlSBvlpaqB3H+F0pe15RN4XqtM6iyFpKAiNQa58f+jT3qKOkdhxiXI+5Gp4LLEakxlG6mJsI4tHD/yOPDA5WmteGD5BJbXFyK+lVieMwaN4sfls+p8j1x4OrexDpmgFnm4Q8onUbdes+PHRXeUwlbzfgHCwCcK5+t+cZnCMdPFL+tcn6Arr43ix6/Ib6RfQhLMrrfluwb/25nsqK0mPkEXXruMv1AoFAqHiL+z6qOwrxvbTQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.080.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAVklEQVR4nGNgoDf4D8XRQMwGxEuB+D4hTVpAfByIC4BYkFib3gGxAbGKQU55CMRexGpwAeJmIK4lVoMfEAcA8RogLiGk+AYQSwMxHxBfA+JqYm0Z1gAA2JYM+cKygUwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.081.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAUCAYAAAAgCAWkAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABT0lEQVR4nGNgGAWjYECALBDvHWhHIAFHIL6AxP+PhPECFSA+DsSmtHEXWeAGA3aH4/UMExAfBGJxWriIQkCyZ2KBuJpESySB+CQQfwPiuUDMAsRFQPwFiH8A8VIgFiTRTGyAZM9sYiA9ea0B4g4GSKzWA/F9IH4HxDpAzAHEy4F4IYlmYgMke+YL1FGkAFDosyDxQfktGYnPB1VDKSDZM39waMCFQQDZM2wMkORmjaQfJPYFjwPxmU3I4Xg98wlqOSkAlCdqoew+IL4GxDsYIMU7yKyZDJC8RCkg2TMbGFBDlRggygBx/C8gPsMAKdpB9cIHqNg6IOYh0Ux0ANL/H4s5eD0TCcTNFFqMD1wB4t1k6MOV/AhWmvsZIKFLCwAq3V5S0TyCnpEH4nNA7EFFS2GghIH0ZIwPEPQMCIBaAFuoaCm1wQ8kPApGwSigAAAAh75WMCoTHtsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.082.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAUCAYAAAD2rd/BAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeUlEQVR4nGNgGAWjgCCQBeK9SHwvIP4FxP+htAcd3LAFiKWJUagCxMeB2BRJDNmRHlA+rYEjEF8AYiV8ipiA+CAQi6OJ/yfApxWQB+L9+BTEAnE1FnFyHYyuThKITwLxNyCeC8QsQFwExF+A+AcQLwViQTQ99VB3YQWbGFCTArUdvAaIOxggMQlyyH0gfgfEOkDMAcTLgXghmh5rIF6Hy4IvUMNo5WBQKLIg8UF5JRmJzwdVgwzYgPgTLgv+EGkxPgf/x4ORHQxyCChpWKM57gsWM3Fm8k9QTZQ4GJ86UBqthbL7gPgaEO9ggBSjIHtnMkDSNjJgYsATwhsYUH0MA+QWa+gOFoU6EKT/DAOkCAUVXx+gYqC0yoOmR48BkrewgkggbsYiDnMkrOLwQpK7AsS7iXQwOaAciOPxKQCVeyokGAjK3S8pcREeAKoP8JbDIAAqrM8xEF/9ljBgT0aUAlsGSCmCt6aDAZDPttDAEaQAWGYcBaNg2AEAHcpbecw8k5EAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.083.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAUCAYAAAD/Rn+7AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABHklEQVR4nGNgGAUjEMgC8V4S9TgC8QUi1HkB8S8g/g+lPaDiW4BYmhiLVID4OBCbkujAG1BLCQFkR3lA+SAA86ASPs1MQHwQiMVJdBwMEONAdDXIfHkg3o9PcywQV5PoKHyWE6MGnV8PdQdWsImB9KjFZxkxatD51kC8DpfmLwyQaCYXUMOBbED8CZfmPzgMxIVp4UAQ+IVFDAxALmcjwhJiLSdGDTqfiQFPCG5ggKQBcgAP1DIeAupwFTMwoMcAyQtYQSQQN5PpQGxRfwWId6OpgzkKVlB7ocmXA3E8PotA5ZAKmY5EBxxA/JIE9eIMBMpBEAAVlucYENFACShhID7J2DJAajC8NQkMgHyyhUxHkQt2MEDaAKNgFAw6AACMt0dezRalpAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.084.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAUCAYAAAD2rd/BAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABe0lEQVR4nO2VMUsDMRTHH6WIgwgOIiIiSEdxcyoObqXfwEEc/AYiOIg4uDi5Ozg4iIuISAdBRJxEEHEQV2cXkXKIFKH+n3nBMyTvLnp1kPvBjzbpJfk3l3tHVFKSyTg8/6O1mrADu/LZkP4WHMszQQ1ewZlepPOQDtmQNjMH7+CkNrgCL+FIr9J56CrtCXihDV6Aa5ELjsJr+Ap3YRUuwwS+wX04pIzXAjMbksvLCcUfhUO4Rebu8OSP8BlOwX54APeU8VmB6/AoNDiRhWPgXaym2nz+l1LtQbkmRFbgPtgODX4PTBjSDcyT89GoOwsmvwjMdDx9n7RlgRj4jK7L9234AE/JlEaea4fM2Q6RFbhCyg4f0/fdycOwBORduCFTFrkkvUgfn78BZXyorFmmyTxbXubhZmTgGO7hmdNnQ9oXR9P5fRUuapNy3asVFNCFq8ZTxPX8PlDrMMPF+pa+blORrFD+IzdLpuKobzoL/7PWD0MVhX1wS0r+HR+U61V/E5phmgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.085.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAAXCAYAAADX5BuUAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADBklEQVR4nO2YX4RVQRzHf1ZWsqKH9JAV2YckifSQ9BBZayW9JEnSW5Ik0UOSld56jh6SHlYkSVYiKz2llyRJIukpiWTlWitu3685w5y5M3Nm5px7N5oPX3vPzL2zvz8zc34zIoVCoVAoFArD4yi0d7WNKLTjEDQNPYB2r7ItjZyDvkFPjbZJaDHitwvQ5o7sOAh96GisELG+mXBV7huCLZrWcTwNvYYmoK9V2xT0CtoT8fsD0FtoaxsjKn5B/Q7GCZHim8mZIdhi0iqO20StxF1G2xj0EtqUMM4W6EWOARb838NMZI5vhEGe6N6cAbLi+ERU0PrVZ81J6Irj+/q7J6BxaB76YvRfq37bFjuRs9BK1c6/M54+reXA2Dm+nYUeQ3dEba8ptvug3Z8qHYN+GH1ZcbwI3bDamFTftrNd1LZ0Adpg9fH98SjVAAd2MMzkzVTPdh9X2mXoXcPYub7FEpNITpb30A5oHfQMumv0Z8WRxc201fZbVGB8/JT6VqzhTF5ytPcDcmG3h57Nz7T5j2dMTa5vsTQlku8/1iHm1v4cOmI8++LoZQ3Uk0HHQsEYrwyZ9fSveNpTSEkkiyPfanXRxjcfKRP1lqitWsOV36v+t0lSHOn4gqN9yTGwhseD69BVR9+YjH5F8tXAbYoJovNNScj1LZamFfkdWms835bBHPji6OWm1GeHhi9233npsKht4CF0yerbKfWiKQfO0L7U31GhdyS/OxkYz76RyfUtlqZEshDju3gjNAfdg85LfQImx5FnFlcZflzUzLT5KOrAul7Uod2u/lhsnEoxwIFrterk6arVdHpR6lWrmXTXjUyubyn2h5irbGQxw2TeF1WnmJV4Uhx5XpkP9PMsMxU7mKgJ0cU5MhWegc0gcEXZxw/7RibVt1ESHUeeW7hHs9wN3SAw0W+kHiQf+0WV7V3c7KRir1B9rjSxb2RSfBslSXHkrcZnUTcVTXB2uIohG56DQu+pYcJksOpbrtSTeoJ8NzKxvo2S1YzjP03KjUyhUCgU/j/+AqEA1IPqB7eJAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.086.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAUCAYAAADPym6aAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABiElEQVR4nGNgGAWjYEBBDhA/B+JtSGKyQLwXiS8KxJuA+BcUewDxFiCWpqI7HIH4ArmaE4H4JBDzAPFDqJgKEB8HYlMkdZUMEM+BAMgTv5AsViLXcjRwA4j/k6NRgwESEwZIYkxAfBCIxdHUMiGx2YD4EpQtD8T7ybEcByDZI5ugmv5D2TAQC8TVePSBYqkZiCWRxOqh+qgByIqRIiBuRRMDecoUi1oQiIVaBEqCtkji1kC8jhwHYAFkeQSUud3QxL4woCYjbACUR34g8UFJ7RMOR+HCuADJHmEB4m8MmI7+Q6R+dAt/keoAIs0lCGDFJzoAhSwbiRYyMQxgjPQAcRYW8Q0MkDSPD8CKXxjQY0AtMMgFoCrgP5QmGoDKf/QiFgQiGSClEjo4yYAITZAnvJDkyoE4nhTLcQBiYgwFgMr+pXjkQfWCCpFmiTNQtx4hCtwCYg4gns+AvzYGefQcAyQJ4QOgIvg4AbNoAkA19l0GSNOCEACFNLbCABnsYEA0W0bBKBgFAwgATNJXfKIB0QQAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.087.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAgElEQVR4nGNgGI7AC4hvQXE4EL+mpuHRQHwFiHWAmAuIdwDxfGoZrgTED4FYHElsNxAHYFH7Hw/GCaYBcRYSXxCIvwExG9lORgMvgZgDiT8TiLfgUEuWD34AsRYQiwJxIxAvBOI8BkikUwWADP0FxOugliwH4m1A7EEtC0bBMAUAGfkhU8Y6nuwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.088.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAYAAACdKY9CAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAVklEQVR4nGNgoDf4D8XRQMwGxEuB+D4hTVpAfByIC4BYkFib3gGxAbGKQU55CMRexGpwAeJmIK4lVoMfEAcA8RogLiGk+AYQSwMxHxBfA+JqYm0ZSgAAXM8M+euMqVcAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.089.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAQCAYAAADNo/U5AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAa0lEQVR4nGNgGEjwH4gnQNl3gXg/MZpCgXgdlG0NxAeJ0eQCxFuQ+JHEaNKAOgsE7IFYkhhNPED8AYiZgNiDGA0gwAHE34DYh1gNDFAbfgCxCimalIA4j1jFR4HYAIh7SLEBFGL1pGgYTgAAg/IO9Fxuuo8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.090.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABBCAYAAAAuaKGrAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEWElEQVR4nO2cT4RXURTHj4y0GJFkJIkkY4xE0mJkxMhIRpsWGWmXJGkRSTKSSMZI+6RFImmRFpGkRdq0aJG0SVq0aJMkSWI6X/f99Hrd++6fufedd2fuh+P3773777x33nn3++6PqFAoFHrJHrZ7bN+kG7ISmWF7yTbFtlq4LX1lmG1DqsJfse1MVXiNdWyP2X6xPaWEHYpU3xq2WbZ5totsGzXbHKjKX6xep0Ma+pttVciOnsyx7ajqusZ2v4f1IQIcJjXol6r926gP+nT12ZvFkJ0CmK29X8v2syf1DbEdYltgu8q226OO5tgFjaVup8XK0AkcFXfYPoQU3sIXTZ3Xq/fv2Z4lrg9sZ3tLKsSEkMwBYIzUxfkMqXgaE5S30PgOp/6D6v0E2/PE9dWZJBVyELb2epSb1AEAR02KC/RRti2N75CFPap9PpK4Ph24Xuxnu0zKIbZwlNQBCD0fSV3p2/Y1mQl08pjm+1FSoQfgiNRlHTHrAxhgDDauAUOa/ZCiXyHljE2G9rR9dsK001TVuND4aGKf4Xvk2l9JdTwonfOsr84uUuEH/Z2h/7NCOEeXxiZ1ABqCIwPp29mQgjWMVK/jbLcavyHv/sF2MFJdtvpM4KxANgRn4OxvS9GTpaHvSJ1ySN+QJVwIKbjBXfo3ZNxs/I6OIlXcFqEul/pcQDKAEASH6K4hg0Ef3IjVw/Ubtie2Cmzxs0u2sp2WbkQLzWuEDZzRn20bYfBT3xDZeEEq05oXbkdsELYnbBv14ehH5jMn3Qgp+uCAFU1xgDDFAcIUBwhTHCBMcYAwxQHC9OlOODZj0g1wIXcHYKbzteE3TOoNtN1xz3KjiO0u5O4ATBra2g9dA9IqhHlMD+jm9ZtEmeV0AfNA31MV3hE+BxCkyROkppqPk5rtdSkz2UF6iu22oQGxRfkQ0d2l4yGDA0dgih3ha9ShzOgO2EwqNkL4HjFsE1uUDxHdYzoAihaOfojzUPl0A28qM7oD8DDWeYftYoryIaL7Uh2AeH+S1JmH/rYNeluZ0R0AdQdHAhQb09EdW5R3Ed19y6SW72+QCjM6hW0guONaoHvyobNrwDn6G5ebxBblQ0T3mCEI9SI1RTZkewKuMwdgUD4ZfostyoeI7raOD1fbDBt+Hzgb9wMY+EnHejtLQweVNUkhyoeI7jYHtIUnnN0IQ9Pk//DxksV2H7q6Eeu76O6Kk9juQ2oHLDfR3Ulsd6WLpyJWtOhuI+d5oGVBcYAwxQHCFAcIUxwgTHGAMMUBwnTpgKSrzXMltSbc2WrzXEnhAJHV5rkSywHiq81zxaY0uYjovVhtniuYiDN12FdEh9ghtto8Z9rWCYesXBdZbZ4zpg67iui9WG2eM6YO+4rooqvNc8bU4aWsXO98tXnOmBwQa+V68tXmuWP6y7IUInqS1ea5gz/tq9+t9klEjyqA9xXE+Ids66vPRUQXAH/cin8XKX/cWigUCoVCAv4Av8FcsT6KOv8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.091.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAUCAYAAAA0nZtFAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABoUlEQVR4nGNgGAWjYBQMMiAKxJuA+BcUe9DQLkEg3gG1Zy/U7kEHKoFYFsoGBcYvGtpVD8R6QMwExF1AvIaGdpENmJDYbEB8iYZ2RSOx+YD4B6UG9gDxfyQ8iVIDkYApEDcDsSSUD7MD5AlQQC0F4vt49P8nw853WMyYAGXfBeL9hAy4BsRaULYSGQ7ABWKhjnkIxLZI4iC7jgNxAQMk/+MDpAYIyLw+NLFQIF4HZVsD8UFiDZMGYh48DsOFCQFQGYKejEGxaECEXlIDBBQJ8mhiLkC8BYkfSYxBggyEY4sSgOwxUFYBpRovPGrJCXxQuRWPRVyDAZJVQMCeAZF9cQJQqpAmoIaSFALTDwOgGAOVK7Uk6iMEHHGIg/z3gQESYERV/7ByQ4UBUp5QG6BXu35AHMAAqR5LCOglNkDEobQOEM9Hk+MA4m9A7EOMQeg1TA+RDiAETiKZCQoMWPa4wQBJjaDqERT41QTMISZAljOg+mEumjwoZYDKMBViHD4SACgH5A20IwYDOMoAqcmoleqHPADVLPUD7YhRMApGwfAHAKUlYOPkTxsQAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.092.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABAUlEQVR4nO2VMQtBURiGbwYZbsoomwwy2Q1SBkmyGOQ/yGCTDFaDP2GTyS6DrCZZJH9AJtl4P+5gub6XTh3Deeqpe7tf7/2+e07nep7D4SApwa3tJkyyh3fbTZiGGkiKJsH1AS4NvVhswyicwqNSz+aqNOE8uC7AFRmukYMb2IUJpdboQGW4eLtvfQgLM4wzzBM9GB0o6722mlCESTJcQ7baCVZDnv/ygaiBfHiBEVhRwr5pQFZ+BAdED0ZXKAavsEaGstRhA85gT6llGvWDOl8rlJW5wQwRyiL/jBSMwx3sK/XMQMyWfJKGHSLw71l7rxNobLsRU8jJNrTdhMPhsMsDJSdDx0vuzE8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.093.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAAXCAYAAAA4JnCqAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACBklEQVR4nO2YzyuEQRzGpz3IQcpBkqTkIElKDpK0JWmTXBy0yVUOcnCRtAc3Sf6BzUlKkuTgIjlIrg5ykfwDcpL2sp5vM2+Nt8E7837ffffHfOpp5+193+/z7Mz7zsyuEB6Px+PxeJJgARqrQ6+GYxaahk6gkTryamjojRmvQa826AoqQddQO1NdE1T7QnmRZhhq5lStMmNNscJRJAWvAjQEZaBd6JSxdphNqFu1qdNLDDX1AWSpmYVa4hZJySuvtVuhL8baYTJauwl6ZKhZ/ufYeAMpr0IcQa/q3Cp0DhWFnP5sjH+75kC1X6Ab7ZyNV1S/MO8Rs8RhFNqBOhlqWQ8mMQDdQ+tCrjMcxiZokM5Um9bFW0evqH469L32E8oSsKRyvUETDPWcBpOgp3aY0djEFHSpHS8m7KdDHd2TUJYwtL6ZpvTyHzLhNJg0vdLTlItycYxw/UJOacSksJ+KbP0CaD1bdsji6hfcGxenwaSnlOb5bUZjE7S5+RCyc+Nus206K5twFhOmfBV5M+egeSG37htRbohgbKIZ+hTyD4K4RB3MDvU5CB0mlCVMaj9NnqEuIbfuT9CWo3GUzqW3gNaSPkcPW79j8fPpLyaUhXjQfKjTbZcsE8EActZkoxdaSzuEopqy1BR3Qu6U99IOIqorS01Cu8ZC2iEU1ZTF4/F4PB5PhfgG+jObhpIy2lkAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.094.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAaklEQVR4nGNgGNZAFIjfkat5GhD/J0ejNRA3k6OZCYhPArEwOZqLgLgVyiZJsyQQv4TaSrLmpVANyJgo4AjEVxggfoaBP8Ro9AHia0BsjCSmAcQ/gFgcn8YOJCfGQsVCGVCdzkWMCwYxAADPLxm8oxokdQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.095.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAjklEQVR4nGNgGFZgPhD/R8LfgHg/EOuQYoAflM0GxFlAfItYzZuAWBiJzwXEL4nRyALEr6FsJiA2Z4A4O5kYzQEMqH6+D8R6RLkXCGYDcRCUDfJvOVSMKPCQAeJ0GAA5/RsxGo2BeCmamA7UQLwAZAMoimBOBoUwKJCeAnEOIc1/GDATx0kgjiXGyUMEAABQiB6eERUKtgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.096.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAUCAYAAAD7s6+GAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABHElEQVR4nGNgGAWjAAz+E6lOFIjfYRGfDzUDhr8B8X4g1iHTHpyAWAP68KgFOdYPymYD4iwgvkWmPTgBMQZYA3E5HrWbgFgYic8FxC/JsAcvIGQAExDvBWIOHGpZgPg1klpzBkjUJ5NoD0FAyABQSJbgURvAgJpG7wOxHhn2EAT4DJAE4rsMkNDEpXY2EAdB2aD0WQ4Vw2XPfzyYbIeuI8KwhwyQ6IcBUPR/I9EeogAuA9wYIGkTGfxB4xsD8VI0MVCx9BCPPVQN0XAgPgfEskhiGkD8A4jFoXxQyIGKJVi0g3I6KAM9BeIcIu0hCaAbgFyAR0LFQhlQfQ5y1B80MVB0nwTiWCLtodihtAIjx6E/qOGKQWTPKBgFdAMAwDtfyhSr3OsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.097.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAASCAYAAAAdZl26AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwklEQVR4nO2VQSiEQRTHX9q2bZOSpE0uDpLk4iBpr3LQJiVJcvhukpOSnBxcJEeXL8lBbpL2ps1ZSZuTlLQHBxfHTdri/c1T7xvz8Q0H0vevXzvzZmf2/2bezBKl+vsaZwZ/28RPVGZOvjGvnXm0YnvMi6LOnDH91veamXWmxjwxm2Q28dbXRMDMMivMqOfcbTFpC0mUpJ1lFpgbNV5grpglJsc0iQ+ste9jAIuXHe0kGiGTtCsBnGar6ueZB2nDbJUZs+YUZK1pDw+0JkbehZOYTzAPJipkds9OIGOZHSJTQoHE8HkYsy7W6kzw+29qYw4c8WMyp/GZsPPL6ke1ShS9A3fMgBo/Jf9SdQqXpscRL4rBOOGocdFy0rcTCJkJaWdlrVCN48JmfM3a6iZzAeOEi9QSM3ZE0R22E6hZBlFGddV/9nIaox0yJRQnnMyGI46jr1ixhmrjGbTLEs9nTfUvmGHH2oEj5hTqcTXB97YoeqHwOlwyXSrWS6YkOsjsNJ7PSRnLi6l7ZlHNmSKTUFH6mItq6EuaAHYQJRJ+AUplV+boP6cZZUSXUYM+/oGdM3MOD3jprsmUU1UlkypVqv+oV3vXYnhVd2MGAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.098.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhElEQVR4nGNgGFaAB4gbgfghEP8A4i4gNgbiu4Q0SgLxJSDOA2IOIGYC4mQg/g/EC/FpBCm8AMQeWAwEaQ7Hpxlkw3IcciDN0vg07wZiN3wK8AFQ4LCQq/kXuRpB4AwQW2IRTyZGcygDJG5toXxxIO4DYi1ibY8H4hsMEC9cQDJoFFAKADevFfP0ATFLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.099.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdUlEQVR4nGNgGAjgBcS3oDgciF/jUxwNxFeAWAeIuYB4BxDPx6VYCYgfArE4kthuIA7ApWEaEGch8QWB+BsQs+HS8BKIOZD4M4F4Cy7FIPADiLWAWBSIG4F4IRDnMUACASsAKfoFxOugmpYD8TYg9sBny4gAAAcrE2GHfqELAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.100.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdElEQVR4nGNgGPRgJhD/AWI2UjTFk2pLPSmK+YB4PhBPA+IfQJxMSEM0EF8AYiUgNgXid4Q0rANieyT+N3yKWYD4HBLfAIgP4tMQAMS1SPy5QByLT8NiINZggMRBNRDvxqcYBByB+AYDJHQmADEHIQ0jBgAAl0ERpVt4Yo8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.101.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAUElEQVR4nGNgoDcQBOLFQPwNiPcSUswExCeBOBzKvkFIQxEQN5PinHNArEaKhl9IbEliNDwHYmMgdgTi40DMQkhDLBD/AOKDQCxKitOGPQAAWxkLsR93V5wAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.102.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAAASCAYAAAAQVO+4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAADYUlEQVR4nO1YT4RVURj/PGOMJJ6MjBbRIslIJGmRDElmkRF5i4xZzG6kRZskSdq1SKtIMpIxtGgxRmIkrTIkI0mGZBZJIi0y8gzT93vnHJ37zXnn3nfO6d3k/Phxz73nnu/7fec7f4kyMjIyMjIyMvqCe8wN5mCP/61E2NzOvMFcY/5i3mIeZn6MaDMEMRpmmZsW15kvmKMJ/AKGmV8TtVWXzlC7UfkxFWg0BCPMt8yLzCFmgzlNKlAP++hHCqCjz+hnTAYzzNVEbT8jFZN/AX9Tp0R0flyvUKcR6p1oA6P1tHgPAXC2lcBGFR9SYYG50ypvozSz6QXmFYpL5jp0xtqMzo8dpEbeXVJT+rT4Ps5sk5rqTXBPMt9bdcZ0eQ9zWbcjHSLd9nwXP9D2bo+fZR3bZD4itQw+d3yXOkI1GAwwv+lndMJRUsuvjF+vOMCc088uzdCxqtmyfLC/91tnqhyJyY8OzpMaDXuZR5jfxfe2NjpmOfqDioE2ZSw/g7p+22FriXmqzKEu8CUzgowAtfTzB0cdqSNUg8EEFfeSn5gHK+jwAXYfk9ozEm3VjL56R2q/itkRW5FZUacOnalyJCY/OnjCPGGV18V3jCa5p24IR2WZHGUAo3EgwMdu7RlcYt4s+V/qCNVgcJ95Vj+jcy7rdxKbHkpcJTVzuexjssGBaJf1Dp0/IdqoQ2eqHInJj86Pb6zyIeZLUQfBw40HTpLHPI5UCZBvBnChaiJAw76Stlw6QjQYILHswKOz5ETQK3xasQ2cseo2tT15C1WHzlQ50mt+FIBRfc0qP2BOdqmLvdJaD465AvSaimINquwzfQG3gzBS0o6tI7STcU00J96NUjE+dhtVZ2bXvwY4cA1ZZSTPoufffuuUNkPsxuRH58C0n9ToxhK35KhjDhH2Hqep3zcrlg3OkRJ7XJcxom+TOvSUwdf5X0gFHnu2V+ReqqSOUA2YmbBPNUsv9q4I9mdStxApYWvGEow44f4Zd7C4psL11bjjn37rTJUjMfnR6XwclhCoO1Qc+bajmMF/0p/AydmlrGxjStuE6BXL8TL4knlSa8AWadjzv60jVMOG+IYld5m6r2gxsG0jgREznHGgEaf+p7T1RqAOnSlzJDQ/MjIyMjIyMjIyMjIyMv5n/AYZU4GJ/iN0/AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.103.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAUCAYAAADiOEEgAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB5klEQVR4nO2XMUgDMRSGHyIiUgQHEVcHEXEQxEEcxEWKOLiIgxQHFyni4Coi4iriJDiIiIMgUhxEBHFwEkHEwaG4OYkIDg6liFD/R1JIa80laXPFkg8+2vR6+ZNckrsjCgQCgUCjMgNHGiCjHllWTMEJeAKH/nFGPbIqsge/YYvmPzwbRj23I46MWmdNwi9YkJ9Jk5PmI44vVtkoE+LIqHWWOsBJWY5kXXNsHCaqbFQUcWT4yMpR6Y7wGXVCOzyAuzAPF5RjaXgG90ksPR2FiOMd8Eg28NoxwxRe3s/SWfjuKWuaxLiRrG8p6oQ5+Ah74DD8cAzWDXYTvCPRcf6edcwwgfvzBAdgG7wkMZl8sQLvqXSS/kkGjinlnGOobrC5QZuO9drAE+YFdim/XZGYgaYUNFZim8Ts5gHv1FXcDB+U8iC88dAwzui1qNc1hzudVsq8dZXvq7Vki8QKYvime6r7M1/xNaXMe1nKMVg3s9W7dLdj/Sa8wValzI+155Z12MzsvPI9UVb+Bd+w+khc+VUSS84V3WC/kniJ4CeBWxIrygfc2X4Sy3kDHsJlEjdMH1g9+nHns7KRO1Q6K2zRDXZKZvAWpd3XqoQHmDuckTnH8IIMXzYcKA5w8aXG10UNBAKBQAz8AA8QeZLHUZ3eAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.104.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAASCAYAAADLw4ffAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABw0lEQVR4nO2VQShEQRjHv7Rt2yYXSZtcHCTJxUHSXuUgSUmSHPYmOSnJycFFcnTZJAe5Sdqb5KykzUlK2oODlOMmbfH/m9n63uw83tsL6v3r15v55s28/8x8M08k0d/VBBj6bRPNqgTOmujXAV6d2AH4UFTBJRhw3msFm6AC3sC2mAV8iGOgAObBGhiL5112rUFXnMCkLafBErhX7TlwC1ZABrRYHxzrMOrHOXDJU46iUTET9pnnLrarehY82zKNlsG40ydnx5qNamDDmqiLO7AYoR8NXIhZNdd8Cryo94bFpE3Bxvg8DhmXY3VF+P7Xyhx54qdiduE7ccVX1Qe1piSY849gULWfS/z0bBAPSK8nnrfmwsTt5aHK2LprvgimbTltxyqqdh7OVFyzWj1iDluYeGjaQtpOJLiyrvmKY46pU1X191hOPdqT4IFyxR3Z8sS53RdOrKbKvOrcVOQVWVH1azDiGbvgiTWI+bce4b0dCR4e3gI3oFvF+sSkQaeYFeYVWU+ZrDX0BJZVnxkxk8nbOvsyC/qjmOfKMS2KP8D02Ld99I9nTpnQqVOTxp/TFVjweOCNdicmhcpqIokSJfrP+gROpmKAFUyrwAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.105.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGElEQVR4nGNgGAWjgAogB4gfU6AfpDePWMVZQNwHxOIUWAjSOw2IC4hR/IUCi9DBN2IU/ccj5wXEt6A4HIhfU2AWHPzCIR4NxFeAWAeIuYB4BxDPJ2DWH0KWgXywG4u4EhA/ZECNV5C6AALmHQZiP3wKQEFgj0UclACykPiCDJD4YSNgoS0DgWD1g7oKHbwEYg4k/kwg3kLAMhDYC8Q+hBRhi8MfQKwFxKJA3AjECxkg+cyLgFkE4xAEsAVBI9Qh66CWLgfibUAcBsQeQGwNxI5EmoUBSMmH0kA8CYiNGbBncqLMAiUOUCKRJEJtMgPEhyBaA0kcVtJkEGMhCKQB8X0i1E2A0qA4VUISvw81g2aAiZaGjwKCAAAF7DP2jp+IwQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.106.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAWCAYAAABKbiVHAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAxElEQVR4nGNgGAWjYBSQBByB+MJAOwIGbgDx/4F2BDIg2jFeQHwLisOB+PVAOSYaiK8AsQ4QcwHxDiCePxCOUQLih0AsjiS2G4gDiDQcFybLMdOAOAuJLwjE34CYjQjHkAoIOuYlEHMg8WcC8RYkvjAQy+IxnKoh8wOItYBYFIgbgXghEOcxQBI0CFQzQBI0pYAH6hgefIpADvgFxOugDloOxNuA2AMq70UlxxAKNaIAtRxDFTCoHAPKaZUD7YhRMAqQAQAT0zIR/Fi7TwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.107.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAWCAYAAAA2CDmeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAClUlEQVR4nO2YP2gWMRjGX4qIyIcgRTqIFEoHEekiDiIiBQfpIJ0sItJBEHEQNxGHIiKIgxQHQUSkUxcppYgIIuLUpRQHEXFzEhEcRIoU4fN5zHtcGpKYfpf7WiE/eEhyFy7vnySXO5FCoVAoFAqFLWYv9BJah15D+5z7B/R6W4xD76z2c2h/i+Nte2agMWgAugc9s+6NQsvQ0RbH/wh1rXaVoJEWx9zWnLfqe6BfWmeC3kJDfbCh67SHoTe5Hs4ZR6d2afsOtCYbZ9kE9Ek1BX3LNXgGvmt5Abrp3EvxzcYNdAhfvxm1wabnuE1qOQudhB6L2asJZ+R76DC0W8z+/TT1wS1DG+9rfUn8gY755tIkIcehBavdKG40kgbToZ1iXphc+twXP8vGbeCV1E7moBvRv+CMHNb6TzHblkvIt5AtqTa78Nk/tN44bl/EvJzIaWhV6w+hK1Y/zqw1HXyrYfCnrfbvQL+QbxW9TIjQvXUtG8XtmJjlXnFJ6qX1Ver9lzwSc8zbDINijqIhel0h406bs9N1OOZbyJYUfP0GpF4hjeJ2V4zhFfPQZeiMmBfiITFn/VvQHHRVzMsqxg6rzhftVKoxiVRbAffnKsCLYvZxm5hvPlIS0tF+Hec6j+JV8nuN218+OO0VMc6N6cO4DBf04XTohZilP6glg+DOVjsBE5I3IbTBXkVP9Po56LbTN+abj5SEhFbwdam30FDczko4Zo3h1+kD6Ah0Ta+dgE6JCQxLJi13QmLwW2C0T2PZDEnad4gvZtm4KCbbLA/qtY5qWktuXf1MCE9cq2pXv+Ak5N+BlC91X8yyMavlnMcYOwE8bdzIPXgEztbNHjyawO+L2KHFJhazbPjO/oU4JWaFQuF/5g9JpqSz6CGOlQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.108.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAmCAYAAABUKMJkAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABpklEQVR4nO2YQSgEURjHvyTJQUnag9ueJElpD3KQmxzk5iA5KMlB7pIclKMclCTJwU2SpJzctTlIcnOSlOO2SfH/92byksZ8O2Pe23Z+9Wv6tv1mvze7733vrUhOTk5OIzAOHwOn4KvbcuIzDe9gH2yDl/DAaUUxKcInWLBeu4KTbsrRsQMXrbgDVmCLm3J0vMBWK96F545qUVOFvbALrsNDuCRmAnsPC36HJ2IGcAwv4FiSm/Lr+xC3v71OMYMYhqPa5NnUy9HRDbfhIFzWJq+lXo6OOTFPntceTWK7mEbBpawa3CBrtoIrJ3FRk8iudxskleBbunWpaNImcPaPWHElZt5nhJnQDMtWPACv/+mzogb7l7/CfcWqFe/DmRSKyYQjMbOba/yKmI1S3cCG8CBmleGMD/ceiZqGaxI1DdfU3DR8oOam4RPqptEIcC/FRSJcIDbENMeSs4qUhGdX/kTZ4ffEHA3rAhbLwvm02Wd4UClEZnjEs3z3EK5s5Yj3esUQPLPieamT/2/IppgBhPA8uwAn3JSj4/5HfANPYb+DWnJyvOYL75lbic8v/PIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.109.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAYAAADwza0nAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAiklEQVR4nGNgGAVEg5lA/AeI2cjRHE+urfXkaOID4vlAPA2IfwBxMrEao4H4AhArAbEpEL8jVuM6ILZH4n8jRhMLEJ9D4hsA8UFiNAYAcS0Sfy4QxwKxMBDL4tO4GIg1GCBxWA3Eu6HiIHY4Po2OQHyDARKaE4CYAyruRUgjLkB/jVlAXEmOxqEOAEp4FW16P1uhAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.110.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAnklEQVR4nGNgGAUUgZlA/AeI2cg1IJ4S2+vJ1cgHxPOBeBoQ/wDiZFI0RwPxBSBWAmJTIH5HiuZ1QGyPxP9GrEYWID6HxDcA4oPEag4A4lok/lwgjoWyQ4HYEp/mxUCswQCJ42og3g0V9wFiNyBeBcTGuDQ7AvENBkgoTwBiDjR5kO3WRPgAK8ggVyPIVTzkaMwC4g0MkAAMJdf24QIAQlEW828yXhAAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.111.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAoklEQVR4nGNgGAUUgZlA/AeI2cg1IJ4S2+vJ1cgHxPOBeBoQ/wDiZFI0RwPxBSBWAmJTIH5HiuZ1QGyPxP9GrEYWID6HxDcA4oPEag4A4lok/lwgjkWSM8aneTEQazBA4rgaiHdDxbUYIGGwF4iZcGl2BOIbDJBQngDEHGjyGcQ4HxvQA+LjUBeQBfyA2IdUTaDkCgowUODh9DM+wEKOpkEKAIOdFl6vh++6AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.112.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGklEQVR4nGNgGAWjgESQA8SPkfgzgfgPELMRoRekL49Yi7KAuA+IxdHE44nUD9I3DYgLiFH8BYd4PZGWwcA3YhT9xyLGB8TzGSAu/gHEyWSagwF+YRGLBuILQKwExKZA/I4Ic/4QUuAFxLuxiK8DYnskPjFBdBiI/fAp+I9mKAiwAPE5JL4BEB8kwjJbBgJB6Qd1ETIIAOJaJP5cII4lwrK9QOxDSBF6nC0GYg0GSB6rZsAezNgAwTgDAXSvOwLxDQZIKpwAxBxQcWEg9gBia6gaQuZgBbjyGTqQBuJJQGzMgD0DE2UOqAQB5SdJAupAec0DSmsgicNKkAxiLAOBNCC+T0DNBCi9kAGS/2DgPlQ/TQATrQweBTgBAKbnMj8jGT+xAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.113.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAWCAYAAADTlvzyAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGElEQVR4nGNgGAWjgAogB4gfU6AfpDePWMVZQNwHxOIUWAjSOw2IC4hR/IUCi9DBN2IU/ccj5wXEt6A4HIhfU2AWHPzCIR4NxFeAWAeIuYB4BxDPJ2DWH0KWgXywG4u4EhA/ZECNV5C6AALmHQZiP3wKQEFgj0UclACykPiCDJD4YSNgoS0DgWD1g7oKHbwEYg4k/kwg3kLAMhDYC8Q+hBRhi8MfQKwFxKJA3AjECxkg+cyLgFkE4xAEsAVBI9Qh66CWLgfibUAcBsQeQGwNxI5EmoUBSMmH0kA8CYiNGbBncqLMAiUOUCKRJEJtMgPEhyBaA0kcVtJkEGMhCKQB8X0i1E2A0qA4VUISvw81g2aAiZaGjwKCAAAF7DP2jp+IwQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.114.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.115.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAASCAYAAADLw4ffAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB90lEQVR4nO2VQUSEQRTHn6xkZS9Jki6dstJlJUkSSTqsxEqHdNhLkg6JDh3SLR06pUuHJKvbykqXrD1HsjolkrU6JDp0WCtL/Z/5f3Z22q3dJTp8j59v3puZN2/evJlPxBdf/kw6wZtjOwafFgWQAQPOuHawA3KgCPZABDyCTc4tgZYaa0fYX2w2+H0u4opuIMp2K1gBD1Z/N7gDa6CNAcbp64Rj1qn3VfEfAk8gKbU396OMSjlDrqRAh6UHwQvbulgWTDtzuulrnvo5x81U8Z8Ar2CymcA1gLSYrLnBB+jYGzcspmzitOn3rIZf9dVDH/fgCCw4Y3T+FniXJrOuGd+wFrRlViprXo930Oq/AlO/+NeSOwDLYNeyh8WUip5OrQT8KHq8eqnaqLvBa7bm2NZ636TNE71ggV/W0PFRBnlKm66nJ9hBm3sidUlSKjPrBp9zgtOjLVj6Rx1r5OlD78UFbbqhcba1LEMNRS3muNOOrWS19flKOP36ROYs/QaMVPHt3YkhKQfcy0A1y9u06UORaShqMUd4S4ee9Ispgy4xGdYn0iuZIAN6BqvWnBg3M0Zd5+qTG6aPQzFPqFDX5KQs/VLK960usX88Xq3FpLJ0SvL953QNFqv4WxLzmmgJZbmRYWe+t06eG5xw+pca2YAvvvjyT+ULRw530/7kc5QAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.116.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAASCAYAAAD15uiRAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABzklEQVR4nO2Wv0sDMRTHH6VIOdxEpIi7iLiIiIirFAcRQcRBHLqJOAnFUdwc/AccxEHcHFylOBdEpJMIIh0cRHAsUgr1+0wO09jrJZfgUPKFD+Tuknzf5cdLiIKCggZIo+BTe3cOOgpNcAem/8k/1jA4Ag3wBU7ALHjx4HkDWpJSlk5OSQyOLh68VVkeArvgOYtBRv8iqIN9UAA5UJZ1Lxw9D8GELPOgtWw7WAQV6h04z8iI8hyBd1uDjP48SI/0dyUUZd1NR9+cUuZFUbdtXCUxm3rgefCh1JsnsVXLmcK092efq4R2XHfcUwxz4JjEhBiLZ/pACUbVGnXnuFcw4xajlf8tWPbsp2tb+nL+XDJtxCPMCbYgn/XAz8C6LPNSrsh3ujp9cPHngyCf0oePOFgl6Wek6xQDngU1cN5WTdPOPfhbJ2tHmQzwzxaoau/aSpmP+0vtO19DGgmGtjOd5s+6Bws92iblWJcVF7fvKz6NHuj3KGZNkliqYyRWFl9D4m0ayWDfwJ5hEC7+sTaoO/fwN762THmIQVfqdUS91G4pAaqz09aeeXvWSCRSV5n4R0r9HfBE4qf4amKcwA1UUzy5/xWPfQcFBQUFDaK+AUuNlLlfGkVwAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.117.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAASCAYAAADMgVnKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACY0lEQVR4nO1WMUhcQRAdgoUEEURCELGxELnCRuSQEEQQEYuQRiSFWNikSiFCCguxCEgIIYWkSRFExEZEjhAEkavsJEiqNCJiFQIpUsgRDi7vsbPcurf///3HQRD+g8ftzszNzp+dnV2RAgXuEwb+dwD3GY/A0wz974C8B9wEr8Ea+BYcBy9V/xpsgHXwQYLvcdXXckfdinnwr67J37kInZX79tHoA4/BoRSb97qwC1bsd/AV2C0mQStqt+PYrapsOOC3F7wCDyU5wXngJmFO51k6K/fto8AKqoAjKTZPpFlJFvzYC2ndsQG1W3RkR2o7H/C9B/4CZ3JFnQx/kxsRurYTyKrhx42l2DBRp2rrBsBK20/4D+0GddwF/gA/gS88O/pYB/9IZ6rPrp00T9LZxJGhTQ6CH3YAljPsWHlrgQBOwNmIdZ6B2+BLcMuRl8QcW1Zq0ka0Az9Jtyk6f54LDPpphg2PIy+D7sCCbPhdEeuw8phEJmpXZfRXBftV5lemi0YKQ3D73LSY1uH68n23hT2Ju20OJTno2F5xIybRXO+LypjUKR2z//VG+oqBPY4/wTfghqPrSAIZ/PMIOx5P/1lTd8bn4GTgfyvOeEKaSeMNz2Sx2uxH8XKqZsSRtwJdfBDzwnB9+b5z4R24FGHH4/ZN7j5rRsUc28c6XxDz9rNtgHI+dUo656XwUcwTx865ARVn/lWa/bWT4MbxlPk3e9oTJxPc9bTdtPzsjG1vWvBsHqp8WcwNy0DYa2wyy5699cPjzERPe/rlPB+SAW7SmZgk+rBJsw/p6Bu3QIECBQoUyI1/5O2wGinZchIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.118.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAASCAYAAABFGc6jAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA2klEQVR4nGNgGAU0BqJA/A6LOA8QNwLxQyD+AcRdQGwMxHfJtagPiP+jiUkC8SUgzgNiDiBmAuJkqLqF5FhiDcTlaBaBDL0AxB5YLAepCyfVEpCBexkgLka2COTy5Tj0gNRJk2oRyCclSAbAwG4gdiPVMFwAFAygSOXAYhEo4lmoZdE6qOHIGAZ+UcsSULDsRRP7g8Q+A8SWWPQlk2IJKMWcA2JZJDENBkhwiUP5oQyQvGML5YPEQVlAi1hL5jMggikSyVDk4OOCiscD8Q0GSDBeQLJ0FIwC/AAA7S4vVXiAarsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.119.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAASCAYAAAAUjf3AAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACAElEQVR4nO1VT0TEQRR+krVWIsla6ZIke+iSJNlDZCVJl5V06LDX1SGRdEiyl6Rjl5V0SJckK3vJ6tA1WenQpUPSoUs6Jsv2vuaNnX47s/vbROL38THzdt5v3p/vzRIF+P+YZg79dRC/iXNm/gd+XcxXi72Nucl8ZL4zt0kV7EF+X2VWhC2Obw8zy+LfFNLMBbkk2aTvrgRlIsa8ZS4xw6QCTsu5Q+Pcstj6Ld/tIFWMU3InbEWIVHe8az8Yo2qlNXB5iTnpORuTc3OG7Yx5x5yyfPuEVOcnmojnC+sSmAY6tejDD4EXSXXATAidOHb44Fy3rFtJyS/HnPecwze2mG/UZHc6mUcWOyoXauCLzqwYgWpckD/ZzpBKJsPMGvY4s8CcJXdhnMCg2vSbIBWwC5APqhuWvZkQBrjVx91IBkFDgnquIswrZpR5QLWdq4teUgPtAi5pd/yGQa14qPHh8/4nUoljfvTriiTGZf1S534r9khJzgV0LmuxQ05Fj61srK+Zoxa/tLHGc1yQdR/zmVQ3NsQG/8s6sdVgkLnm49wOVYcYgDxumD2GbYCUzKKyT5F6bhOyhx1KiMseQ45iZmSPLqEgeWOPZPV8+gIqDEnlGhDS2hcfyEHLS2s7Rd9lFxE7Xsl7UvIrGcmNeM6nxA754Q866fndz2sbIECAAESfTZxuFPghHx0AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.120.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyUlEQVR4nGNgGLEgB4j/A/EfIGbCocYYKv+DGAOLoAYqYZHjA+L7QLwOj2UoYAMQXwBiLyxyS4H4NRC7EGMQCxDfAOLZQByJJpcMxNVA/IlYV/kB8RQgzgDiDiRxLQaI18KBeDkxBjFAXeQH1bQYKsYBxPuBWBgqhu5inOAxA8SrHkC8BckCeygbFF58xBhkimSALFQjyBX1UDFrqAsJAlCATgPiPCQ+KC1tQuJvA+ISQgaBAvc/EoaFCcjL4kDsiCYfT4zrhikAAC+RKdTCgp+DAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.121.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAQCAYAAACoTgdGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABo0lEQVR4nO2WsStFURzHf0kvvcEiySCrJCnJYJDFIElKMphsMhiUSf4BSdY3SLIaZJPMFskkJb1kkDLpJd16vr/OufW7v86555yV+61PnXPu6/v7nnt/955HVKnSv1Ev+FRrx6AtaIEbMBLwaifUPRL+GfgCV2AqMWuSDsgdkje8YMc1sAGeAl4pm2WdglVRg8dvYMzze1/WKPFd3PEYXIAeMa+D94BfapBL0K/W5mxtrbKsQXWAa9DlMOgEH+J3k2TaeD3gmRKEa9x5crUSskaJ79K2HWuDRSq+sy9gNMIzJQjXOHSs88Z+1FpZ1qC4dZ7J3CmXQQMs2XHNFmtE+KYEYb95x/owuBfzUNagzqn45LRBk0yb5XK1lkspQV5VjVz7YFfMQ1lLNUum/6UyMR4HZ+o6HznNCO/YIBNkjhmtGTKvTLedh7KWaoXMR2FArA2Bb9BH5gnykZO3MH+B+aPEx8FmhH/MZrnGCdiyc35Npsk80UcwGJm1VPKPQn62LVOxPTI159a9BWseT91eLvRG9XWu8QD2yNzc2Kx1qlTpb+kX9h9/tGCBgngAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.122.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAASCAYAAADLw4ffAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABfElEQVR4nGNgGAWjgGZAFIjfYRHnAeJGIH4IxD+AuAuIjYH4LlR+EhD/h+I/QPwFiHcDsTWR9v4n38kI0IfFIEkgvgTEeUDMAcRMQJwMVbcQSd1iII6Estmg7KdAbECEvRQ7HhRK5WgGgRx6AYg90NRKQtWFI4ltgYojAy8g3kSE3RQ5HuTIvQyQkEU2CBTCy/FYKA1lswDxORzmfiPCfoocDwrxEiwGgdKtGxH6A4B4AhZxkON/EaGfbMeDohqU8TiwGATKnCxEmDEbiH2wiGsxQJIdIUC249cxIEoKGIYBYkINBB4zYPdkDxDXEqGfLMeDksReNLE/SOwzQGyJRV8yEtuUAZK80IEjEN8HYj4i3EGy40ElBSiTySKJaTBAkoo4lB/KACnbbaF8kDioONWC8kFpGlRcFkD5oCLSngES4jeAWJ5It5Dk+PkMiCQCK5tDGVCTDhdUPB7qEFASuoDkESYGzOQGKllAdUI9kn5cjiWER8EoGAVDEQAAlB9dsYEkLU8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.123.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABTklEQVR4nGNgGAVDGHAB8Wss4vOB+D8S/gbE+4FYB00dDxA3AvFDIP4BxF1AbAzEd0l1SDXUImwA5Bg/KJsNiLOA+BaSvCQQXwLiPCDmAGImIE6GmreQFEeAQuMgHodsAmJhNPUvoWyQpReA2ANNjyTUvHBSHAIKjTwcDmFhQEQZyFJzBkjUJEPFQPRyHOaCzJMm1hGguAX5ThiHQwIYUNPIfSDWQ5LfDcRuxFqGD4BCA+YjbA6ZDcRBUDYofZRDxWAAlDBZKHUEKDTeMaD6GB08RLMIFD3fkPi/KHUECNQC8Rok/h80eVD2W4ompgN1HAycAWJLLGYnYxHDCpKhBipB+RoMkGAWh/JBPgdlW1i0cEH1PAXiHCRzQqHm2EL5IP19QKxFjCOQC6lkqGHI0QOy9A8DZkF2EohjsZgXD8Q3GCDRdAHJUaNgFAxdAADB203uoLAQpwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.124.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAUCAYAAABSx2cSAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAtElEQVR4nGNgGHYgFogPAvEPIH4OxG7EaBKGatoPxJZAzAQVWwzEBoQ07wXiciziokB8Dp9GkNNm45H/gU/zciC2xSEHsvkuPs2ggGHDIRcExJPwaf5DwFVK+DS/wyEOCot6fBpBYC4QezFAogeE7YF4CxBPI6QRBKSB+AoQ/2eAhOxuqGFEA1AcO5KiAQRYgHgd1NbHQFwCxHwMkNDvAOIpxBgiD9V4gQHidJA38kh1yXAFADptH/O5PoXWAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.125.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAQCAYAAAAI0W+oAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA60lEQVR4nGNgGAU0BqJA/A5NbBIQ/4fiP0D8BYh3A7E1JRb1QQ1EB4uBOBLKZoOynwKxATmWgFxYjsOiLUAsiSbmBcSbSLWECYj3AjEHFotYgPgcDj3fSLUI5JMSKBvdogAgnoDDol+kWAIKkrsMEN9gs2g2EPtg0acFxBdIsWgdAyJVwTAyeMwACT500APEtcRa4sYAiRtk8AeJbcoAScrowBGI7wMxHzGWhDNAIlkWSUwDiH8AsTgDJA4WAnEBVA6UrO0ZID65AcTyxFgynwERTLD8EcqAGYTIGJTCLgFxPRBzEWPJKCAJAAA3sTXFGAhp4AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.126.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAfklEQVR4nGNgGFZgNhD/R8I/gHg/EMsSa8ByII6FslmAuBqIjxKreRMQy6OJ/SJGI8im+2hi9kB8gRjNAUC8G2oIExD7APFTIPYgRjMowDYA8UMGSGDtBWJLYjQyQG3hI1YxMjBlgEQLyQDkP1AU5ZCqERQ4yAkjgBzbhwAAAEOTGGO/JCOnAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.127.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAASCAYAAABB7B6eAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA9UlEQVR4nGNgGAVkgvlA/B8JfwPi/UCsg6SGB4gbgfghEP8A4i4gNgbiu6RY4gdlswFxFhDfgvIlgfgSEOcBMQcQMwFxMtQxC4m1YBMQCyPxuYD4JdSwC0DsgaZeEmpBODGGswDxaygbZKA5AySIkqF4OQ59IAukibEggAE1Du4DsR5UbjcQuxFjCD4wG4iDoGxQ+JdDxUAAFKEslFrwEM0QUDB9g7J/UWo4KKktRRPTgVoKAmeA2BKLvmRiDAe5FJQ8YcHDBdX4FIhzoGKhUMtsoXxxIO4DYi1iLPjDgJnBTgJxLJq6eCC+wQAJrgtIlo2CkQgA7Fs0kPzQH4kAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.128.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAmCAYAAAA2h+4OAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADTklEQVR4nO2aT4SVURjGX9c1xiyGjIwk0SrJiCQjSZvkGhmRJKNFuyQtIklm0SZJMtLmSpLMJklaxDXSokWbZLRIJCMZiVYZ4xpu79N5j3vu+b773fPNPdO55f3xmHO/P+d97j3/3nMMkaIoiqIoqdjEeslqshZYm9PaUSyzrAlWhXWT9SStHcVy2imPslZTGVGK+ZnagJIF683t1CaULDOs7alNKJ1g8T+T2oSS5XBqA0qWcfm7m/UgpREEbzlaYb0iYwzUvfurcn9bpPhzTt1rrF+sButAl+cx978WH8usI5F8gHnq/K73C54t6xtgw1oq00PjHJPyEOsc65NneEbKVdZV1psyAXrwiHXKiY/yN9Ye55kxMg2CTjFJZh0Yk3fd5/4mIb5dkOW1ygR4TuZLWkZY3737fobSLBOgBy9YW7xrNYlrwRHJ5Zx30QvfRfRShhDfFowk+A9uGIyAH1JGL9xPpleede5/8d45xHofGiAgft4PCy8rUsZ0VS+oI8UOPcS3ew0da5hKNMw0dc6raIQJ735DjCDAFJnhejQ0QED8OznXEcuOSkylB7u8jxHzOZKXMoT4tmCkXJJycMOgJx6X8pBUUvfuP2MtkemZaPnJnHpaBeoVfyrn+i5qj8pl8ZYHvM9F9BNKiG+AqQ4dZ9jxFQR+8Krz2R+KGB2joZWtg69efMst1jUprxW8j9G0o08PRY3YrTFDfIOnAXVl2Mt67F1Dmrwk5X1k1psQ1tNDUX8j5zo2eJhSbYfolmJi7ZmN6CeUUN/wt+A9U9TJ/oCRgTTZTmPIxLDgY4Scl/vzUt4IUP9D1kX5jKkKSQV63EfqzAKxn6jJOxV5DhnRvQ3yVkSo75NkkgN3v7eTzHIwTgWg5fyN5Vsy+5Wqd2+632/jUaFsL0b8RTIjYMR7fivrA7U3uOittcieQgj17W7a7T7nhPee/x3/WZCU6BnWAIHRaxdQLLhIOzGHYwq5wbobMRZSb2wOm6JYW4L/GszdaBSkopjOMLVdiBzjCrXXBDRKzNMNpQ8qThkjcjGVESUfpMPXKXsOpiQEWSnWM+zluh0DKQnBGqP/vjSgxDpXUyKjDTOAaLo8QOBIyh6ZoFFSHPsoiqIoSjR+A9Rw7T9sgCrbAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.129.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB9UlEQVR4nO1WQUSEURAeWWt16JIkSXTqkESSlaRLspIVSYdO3ZJOsYcOXTt1SLqsdEj2lqRbVjp06JIOnSJZSRId18qyzee9X2/n//e9/l/Z4v/42Ddv/jczb2beLFGMGP8WS8xLZoX5wpz6JTsdzHchO2DWDJaZF8wBQycvdCpap8dlsJ1UYFBOM1u07JA5FD2OhtjWDkogyFn9O8lcYd4LnQKpRAAJ5gbzymWwyMwFyHHTN25/Q2FM2woK8JTUxXpoZb4G6PQK2YfNIMowb9mv2D4OCVQGLjNF/gCRjTdDb5RURS0LnUfx3QTz1mYUKR9vsIcMPri8DgFkbl3/lgFmqb6/EMhggM45qUBxCTPMZ+a0zSgek2SDvTnmzvd8d6KL1GWl9FoGmNf2SPuTI39lYX3CLJGqLFRD2mW4atlDdvuErGahDccOfTidMNbIUFnoIFttDjs+yOfaA3pzM+xhlrOKQmZe7DDzSOxjPJSM9QipngyNfWaG1I2BaNoz5l6UwwKwQOolNmdVP6kS69Q2MR688sTLiYcF2VrVMugUjHUodDPv6GtwookzUQ4KgDm8F7VsnurLtEr+AX9N9bPO3M9GcQQNPRnlw78O3I7X/E+knnA0MV6xLeZu81z7WeCfAYLDwESZomTXmupRjBgx/i0+AShAd0MmegwrAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.130.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAATCAYAAAB/TkaLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAjklEQVR4nGNgGAWDDQQAsTE1DdQCYiUg3gvETNQ0GAQyqG2gHhAfZ4C4mKrAD4h98ClwBOJrQCwJxEeB+BsQJwOxGhCfA+IfQOwBVRvPAImoWAYCYfoBiP8DcTQQswGxCxB/YoCEGxvUwF9I6lmI8QoT1FBkQIhPFBgahgpCNQkS4AuTYuh/JEwMfxRgAgDnoyTH8W6snAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.131.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.132.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAXCAYAAAC/F5msAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB20lEQVR4nO2WzysEYRjHnyQ5SDlok4OSgzZJOUmbtiRJcpEkOexFDnJwkza5SfIPbHKQkuSwByVJkpSDHOQi+QfkJO1lfb/et0zTzM7LvHaU91ufZuZ93573mXeeHyPi5OTk9Pc0AfqSdiJpjYIhsA96E/YlUg1gFTyDd7AuyulHi3swKvot2WoCx6AETkGzDaMt4A4sgHpQA3KgDHZsbKA1Z9FWHnSL8pUf7SCuQRq6BcO+cR4OD2Iy7gZaWVFRZ0vTnvtGUVEcS/zyeyFzPIhWQztcu6XvmU5nnrl5cAQKotLjN/Ti84XwsOrALniKMnAiqpDFFV/wUN+zDpxbsGkq1otN31gaXIFFPR8phlStwTp+4QdRqRSkQVD0PE+ZbO5RuQJRmgFtAeOMkh5TB0qG61iZWVDDDqJTvjrMgKgaUw3Rn9mAcaYEO+CIqaEbCf7RyX3TIRbCV+2Yv/Ca6KcRkQ0ZZ4SugRVTB5jbPLmMfk6Jyre0b921qIgIE9vum6ifp2oppa9dYNs3NwbGRbXVJVODDC3mP9OErTQTsIb5f1HBBiOB9abDdNOYYqfzRk3BM8d3YbdjW70Hy1Xy6VPton7I/q0uRVXmjaQdSVrsFPmknXBycnKyrQ+PfVkDsXKrbgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.133.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAUCAYAAAAUccS4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABlUlEQVR4nGNgGAWjgCjABcSvsYjLAvFeJL4gEO8A4l9QcVE8ZnpB1f2H0h5Q8S1ALE2JY6uhhiIDFSA+DsSmSGL1QKwHxExA3AXEa/CYiexADygfBByB+AIQK5HjUFCoHkRzLBNUTBxNbTQSmw+If+AxF93zyHx5IN5PmjMhABSqeWiGxULFCYF3eOTwORYE6qH2EA14gPglEAujGbaJATX6sQFQ+u3DI0/IsdZAvI4IN8IBKPSWYzHsCwMkKeADoFCRxyNPyLFsQPyJkANhABSq76CGwDAM/CGgF+SReAJqCDkWBH5hEcMKahlQczOyA0E+ZsOj15EI8wk5lomByJBNBuKHDIjiQ4MBkrNhuX8DAyRNYQMwNTpAPB+PHbiKLhgAFYGbCDkUZAEs2kGODmVATQqgoiwSiJux6F2OpnYuktwVIN6NxIc5EFYpeKGZVc5AOCkRDUDloAoJ6jkYICULMUCcgcxyFhcA5fRzDIioJARKGHAnHWRgywCpGcmqwfABUAhsobKZoLaFLJXNHAWjYMAAAHJcWnZWbu+gAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.134.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAUCAYAAAAgCAWkAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAByUlEQVR4nO2WsUvDUBDGjyJFHAQR6SClIB2Li4iDOHQrHUTcRMTBTRwFB4cObg7+AyJO4iIipYMgIk7iIg5OLtLBQQQHkSJFiN+Ri77GtHfRoiD5wUdfXq5375J790KUkPBn7EKeowZ0BhUcmyx0avQ3AB1DTfnPkGJfFltPfksyX4OGjTFb4ISmZZyGlqFbuc5DF9C40VcFGoVS0CZ0oNi7CZTkmilC19CIMe4HVWjQue6DHmRB51Amhq95Z9wPvSr2XofrHPlVYqYHepQxL35CHCxBC9B6HGcRPCn3OyXDVGQdJmaodc/ckV8mDL8xa3lFwftnS7HRkpmEDq0Bt6FZGfN+WZM55oX8t/Vd+InmFBstGV7TszVgnfxSC+DFN2T81iZ4O7mwn0VDfC0Zphkx94UxaC80xy25LmN+ImmLowiKRjstmRQZ3gwbcUsOSow7GG/6e2hF5o7Ir9m4BN2vIDE60a41B/D+rWoBuYTCh+UltXaOOWhDcxRiP+R3x7l3A52E7IMEgkOzHLrPe9hSria4Tee75KuX/PPLSoZinjMa3I2u6LMUfsIq2ct2ivwvj9hfABr8hGrddqrA33fZX46ZkPBveQdS52auiKJLYQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.135.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAZ0lEQVR4nGNgGNZAFIjfkau5D4j/k6PRGojLydHMBMR7gZiDHM0gG0ugbJI0SwLxXaitJGteB9WAjIkCbgwQvyKDP8RoDAfic0AsiySmAcQ/gFgcn8b5SE6MhIqFMqA6nYsYFwxiAAAYURljKxBTDgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.136.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAASklEQVR4nGNgGDSgFYh/ALEbMYoLgJiFGIU9xCgSBuI+YhQmAnEQMQo3ALEgIUUgD1wjxrQAIF5IjMK5QBxPjMIzQLyKGIVDHgAAZUYJFqmpLj8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.137.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAASCAYAAACEnoQPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAhElEQVR4nGNgGFaAB4gbgfghEP8A4i4gNgbiu4Q0SgLxJSDOA2IOIGYC4mQg/g/EC/FpBCm8AMQeWAwEaQ7Hpxlkw3IcciDN0vg07wZiN3wK8AFQ4LCQq/kXuRpB4AwQW2IRTyZGcygDJG5toXxxIO4DYi1ibY8H4hsMEC9cQDJoFFAKADevFfP0ATFLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.138.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyUlEQVR4nGNgGLEgB4j/A/EfIGbCocYYKv+DGAOLoAYqYZHjA+L7QLwOj2UoYAMQXwBiLyxyS4H4NRC7EGMQCxDfAOLZQByJJpcMxNVA/IlYV/kB8RQgzgDiDiRxLQaI18KBeDkxBjFAXeQH1bQYKsYBxPuBWBgqhu5inOAxA8SrHkC8BckCeygbFF58xBhkimSALFQjyBX1UDFrqAsJAlCATgPiPCQ+KC1tQuJvA+ISQgaBAvc/EoaFCcjL4kDsiCYfT4zrhikAAC+RKdTCgp+DAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.139.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAASCAYAAABSO15qAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAqUlEQVR4nGNgGJbgKRD/B+IpaOKRUHEYZsFlABMQTwDid1A2MsgB4ktAzEPIFcuB+D4Qh6OJTwLiNEKamaC22wPxFjS5G0DMR8gAF6gLQOAWEItD2TpAvJSQZhAABV40lF0LxEVQdj0QuxFjwEMgFoSy5RkggQYC6N7BCoyB+CCa2H4g9gLiVkKaQYE3E4jL0cQTgfg5EKvh08zBgJpIApDk2KCuGAW0AgDTkB9AeitgZAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.140.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAASklEQVR4nGNgGDSgFYh/ALEbMYoLgJiFGIU9xCgSBuI+YhQmAnEQMQo3ALEgIUUgD1wjxrQAIF5IjMK5QBxPjMIzQLyKGIVDHgAAZUYJFqmpLj8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.141.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAVklEQVR4nGNgoDf4D8XRQMwGxEuB+D4hTVpAfByIC4BYkFib3gGxAbGKQU55CMRexGpwAeJmIK4lVoMfEAcA8RogLiGk+AYQSwMxHxBfA+JqYm0Z1gAA2JYM+cKygUwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.142.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAQCAYAAAAFzx/vAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABNElEQVR4nGNgGAV0AvOB+D8S/gbE+4FYB4jLoWJ/gJgJh35jqPwPUi31g7LZgDgLiG9B+UVQS5Ww6OMD4vtAvA6Pg7CCTUAsjMTnAuKXUPYGIL4AxF5Y9C0F4tdA7EKKZSxQTQxQV5ozQII0GSp3A4hnA3Ekmj6QfDUQf2Ig0XcBDKhxCAoiPagcKJinAHEGEHcg6dFigARjOBAvJ8UyEAC5PgjKBsVfOVQMJucHNXgxVIyDARICwlAxdJ8TBA8ZIEEHA6Dg+QZlP4bKeQDxFiRH2EPZoKjgI8UyUJJeiiamA3WEKZIlslDDQb6ph4pZM0B8SjQA+QSUHWDBCUqZoITwFIhzgXgaEOchqQXltU1I/G1AXEKKhSAD0DP8SSBuQBOHxREoeMWB2BFNPp4US0cBRQAAEnRIdPkl8ZIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.143.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAAASCAYAAABPRWDxAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACwUlEQVR4nO1XQUhVQRS9RIRICPKRaBGBi5D4uBFpIeEmIlqIBBIRYfEhRKxFCC0kXAUtokVEIC5ciAgiERLhJsJ9hLSKNiESEYILFxIh2D3MHR2nN3dmfkkIc+DAvLkzb855795584gKCgr+Hqf/t4BDxpHx18F8F4i1Mjcq+qeZuw63me+ZdYnfkf4d5rHAvXskvtWU6nSE/IW8AZq/L9L3wpsz5M0J+Q6inbnMPBOIT8iNqzDDHJD2CeaoCLV4IHM7K+a2Mb8yF6gJ0RnQ/GnegJA/6H3G3KQ/tWPMR+bJXKGYsMQ8F4gjc1YUwZhb88b/cK5fM1eZVyvmzpHJyksZenOh+Yt5I9L9zZNJpuvenOfMu7lCW8g8rG5lDDLnPlULPk77JY7suECmjBtO/DOZcr/hzW3Ivbfo8Koi5k/zBmj+cI2q6Ge+8ebBc1uOUCy0KAuEgKxCFtQCggfp4P6ILHGNo7yxp44wnzj955mvyGTUfI7oDMT8xbwBmj9Us9WObeuUtPE9mcsVixtdjIyZcBasEoyMvyZt7KcPpc+N44Xgoc9KH7IV2VWTPr9iXOwqjCHmL+YN0PwhyW5K+xGZbyMwybycoG8PeHNXImOQOZukP4A1MhlogdLddq7XJY61bCnDTL+0sQVklXMiYv5SvAGaP8TapX2W+Una/palAg9jMGEc3vaic73jxXEk9cuxLiKBXkcYTjF48KiCSenrI1MhGpqpjBR/MW+A5g+xFS8GLzikPI6svYenzFsJ4xqyqD2OdjF/0v6+iAzBkc+WcKvM+cYck/hLMh9HOx6Gl5zrt8zxVOGJSPEX82b1hfzdY06R2bJc4J/qO4VPpQeAjNQyzXLKaUOA/xODvfOX14fS/UDmQXR6sSFZf10M1734cIr4f+gv5o0Uf7e9fvv/QTI3VukFBQUFBQUFRw2/AV3d6Su31SBqAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.144.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAYCAYAAADEbrI4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAACxklEQVR4nO2YT4RXURTHj5+R5CeSjGRExhhJ2rRKEhmZRdJmZCSzTZJEiyQZ0aJFWkSrMYsxm5GMkRgZrTKbJMkYkhZJYmRkJPHrfN17/d7vdv+8++7NxJwPX/N7985997xz7j3vnkckCIIgCIIgCEIvl1lfWM8qbQOsFzXGLrD2/QujEtjDOsU6zDqaeS/c5322RfmcZL1pOniCtcxqsz7ptkHWK6rnIDP5gaYGFOIhKbtbmff5zurkm5PNCjW0Y5jUDj1SaYNTXrL6E+6zn7XUxICCIKh7C9wHz/8/BBUk2zGvB3X0b8MF1s3AJOjbxpphfaz03dZjSzDKWtUaY33T7dtZU6yfrLeksgN0nnWCdYe1o8D8VWciEyEdY+Eu67lPe8b4fFPCjtpcY9212hBgX9rdTerBrrJ2WX3HWE+aGGExznrHOkQqQM9JBRLcY52rzGcWY8v6m0vVmSYdXyIVMAT0l2NMyDcl7KgNDkYjVtsPCjtnjXrTtQEPvO4xzCcb7Dq816upf5F1Vv/+bI3fCNiZQ9U2Vzr2OdvnmxJ21KKPlFPsAP4OjEHg4PRRT79rBafwiNSOMGDFb+h5Y7bFSFlcsSC6xsR8k2qDb54gSCMLjvZ16jrRBsf9SdYtR1+L8nfqV1LvTcNjy8Y1j12laRLUkG9K2RHlPvXuCsNTUu8rF2dIpcI51nWrDzXi/F8j0sAh5CCpuhOHnmnWFequ/gf6GgsIdfRi5nwukB061H0vxq4NId80oa3naacMQm3pKltwkpx0tKNuwkeGnaROg/YJ+QbrYooBDhBIpHAcuBDYWVLvfXPaxAPO6f/ByXgocz4XdiaJXYOYb0rYEQXH85lAP2rOwQQD+mnz69QtC1a3qfVCX4AQ9NfkrsdsjpP6+rTZX5S2LPhS9IFUQR0Du891kLJBHTmQY5QgCIIgCIIgFOEPwom0lEBI4OwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.145.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAtUlEQVR4nGNgGAUjHAgC8Q4g/gXEe4FYdKAcUg/EekDMBMRdQLxmoBwSjcTmA+IfhDT8h2KQRjYgXgrE92ngsHfEKNIC4uNAXMAAiVtqA5CZfcQqBrnYAI/8fzyYEIgFYnliHAGKkodA7EWMYhIBKLHGE6vYBYibgbgWjxpyQ8SRWEeAgB8QBzBAslgJKRoJAHEorQPE8wkpvgHE0gyQLHYNiKup5IjlDKihNpdK5o6CUUB/AABg4CiUCnZRVQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.146.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABUUlEQVR4nGNgGAVDBOQA8XMg3oYkJgvEe4nQuwWIpSmxPBGITwIxDxA/hIqpAPFxIDYlQr8jEF8AYiVyLNdggPjcAEmMCYgPArE4CebIA/F+Ui3fBMT/oXgTkngsEFdjUQ9TGw3EbEC8FIjvI8nXQ/WSBIqAuBWLw3AFvRYDJGoKgFgQTc4aiNeR6gBQonNDE/vCAIkGXOAdA2qUwQAoVD6RYjkLEH/DYtkfPHpAloASqhcO+V+kOMCDAZKF0MEnqEXYgAsQNwNxLRY5JgYSQ6AHiLOwiG9ggMQnNuAHxAFAvAaIS9Dk9BhQEzNBAMq72LJaJAPEl+jgBgOkwOED4msMmDmlHIjjibUclG+X4pEH5WkVYg1jgHiEqHLgFhBzAPF8BvwlF8iB5xgg6YQQsGWAZE2iSkJQCXeXAVJ8EgIgX2FLpOhgBwOk3hgFowArAAB6/DgBfVVRhgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.147.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAcUlEQVR4nGNgGAjgBcS3oDgciD/gUxwNxFeAWAeIuYB4BxAvxqVYCYgfArE4kthuIA7FpWEaEGch8QWB+BsQc+DS8BJNciYQb8OlGAR+ALEWEIsCcSMQzwfiAgZIIGAFIEW/gHgdVNNyqA0e+GwZEQAAKJ8Tc0S+FBcAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.148.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAlCAYAAADBa/A+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABfElEQVR4nO2XsStFURzHfxkkvZRBBlkkSVaTQbabZFAy2CWDDEqSQRZJkkGZDAaLDAYp/4RkkM1gsMj0ktT1/fY76r7n3vvuu87pvHI+9anbu+fc+333nPs754oEAv+HSXjnO0QWjzD2HSKPEK4sIVxZnIQbsXQdJ+Gm4T7chqMlr1ERDVexFaqedrgA9+Aa7Guib5zQOd1wCe7ARdjl4iZT8Mk4D9+b7M+Qm6JL07DNYByiB9F51Alv4FmBfj2iT+0AbtkORQbgM+xN/HYL5zLac34tw0O44SJQkmNzsx84PFXYkdL2SHToBlPOtcEZ0bk3Zivca12QE3hdsC8Dsbzwrd1tECpuYCofosWV84f16xSuir4gWYEi0XrHUBMF/0gpGOgTXpqA56JPLkppuy46tJEJGQgE/gBLFqsBK8S96ALQMrAWzprjcXjlMcsvXqS28Fb9xqnly3eAPN58B8iDO5kV0dWlX3T30zLwu+FCdLnkpnbIb5xAQPkGcMhISsydYeoAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.149.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB/klEQVR4nO2Wz0dEURTHj5HRIjGLzCKJzGIkadMqSSRjJG2TpE0yWiSRZCSJJMn8A61mlyQjbZJWaZNWSSSt2rVIWiSm73Hv486be++779Vo0fvyMe/dH3Pueefecy5RrFi/oe6/XsACeAGnSlsHOHeYWwHtAWPGwC7YAD0h15YHn6Aqf3Mh59MsuAYt4Fm2ZcAV6HeYPwxuQZfD2CSYAjtgmYI/DEt1KiffnZUlEbk+pS0BLkE6xP90goswhqEUmAebYA60GsZVA96NOpGDq/LZ0zRYMxhiOAIciTJ4UvrX5dywSkl7vAuyBru2d6uWwJavjZ01bU1OFrx1F+XCVA2AI0e7bSSitweKpHfM048c5KQy6mt7J7FNTXql2i3tiaP6ZpnH560A9sEq2Z1SFdnBJvBB9c58WeawE5yI8oZ+UwIokdiGGU0f2x8ncRZ1Oyeyg5yRKpp2jkLSMGdELqSo6UuQPYL+sVw6OJtukz1bR3aQ61JB035M4jzpxF96AhySSPOqeqk2WfnFTuWkXXZsyHGdkcsEZy1dKZgkESW/7kmcI07nd1SfaVfAjMEW95XkAm3nWyfPKa/Qm45HjbhulS39XNN058WkNIWvgw3RA2gGB2S/efAHuCG3a9EgidLhcpNpuPiG8kjiehUkjoouCfl1RuLeGitWrH+ob20FYEolhBsLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.150.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABL0lEQVR4nGNgGAVDGPgA8X4g/gHEL4E4lJ6WT4NabgnETEAsDMTrgNieHpZ3AXEaFnFRID5HqeH/oTgaiNmAeCkQ30eS1wPiPjz6f6GZNQHKvssACTGigBYQHwfiAiAWRJObC8SOOPSxQC2CAVCaWAdlWwPxQWIdAALvgNgAi/hjBkjIYANKQDwJie8CxFuQ+JHEWg6y4CEQe2GR+4NHXzkQayDxQWxYiIASpySxDgC5vBmIa7HIPcRhUCwDJHEiAx4g/sAAySUexFoOAn5AHADEa4C4BE0O5ChQsIpCDQb57ChULTrgAOJvDJDygmhwA4ilgZgPiK8BcTUWNR0MkDQCSvGghBWOwyyQA0GFlAopDqAmACXKvIGwGBQloBzUMxCWgwAo5dcPlOWjYOgBAMl9Mp7ZCeAOAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.151.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAoElEQVR4nGNgGAUDDniAuBGIHwLxDyDuAmJjIL5LiiGSQHwJiPOAmAOImYA4GYj/A/FCYg0BaboAxB5YDAcZFE6sQSCbl+OQAxkkTaxBu4HYjVjF+AAoYFmoYdAvahgCAmeA2BKLeDISWxiIZQkZFMoASTu2UL44EPcBsRaSmmoGImMvHohvMEC8eQHJUBjwItYgQmDwGZQFxJXUMGikAQD7fxm7gv5WogAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.152.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAUCAYAAAAuoXvLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABxElEQVR4nO2WP0gDMRSHHyLFQQQHKeIgiIiIiLuDCA4iIi4iIuLqJCJuIh3cpIiTIFKcpIs4ibiIdBA3R3ERcRA36STiUn/vkmJr7/KSXq8UyQcfTUle3iWXP0fk8Xj+CSfwG7Yb2pRi9F9PbDe8JvVcN7AnRv6GsCrUN3uCMnAMtsF9eB4jf0PYEOqbPUErFeUu+GWb6FCXn+FtHYnD6ITHpFZRSXsVkjvqmVgeUAqewRfLWNt65sOiDS3CC12egAWbIAuWSE1OGj7AXao9j0yDGIH3cJPU2fGXuBPEfR4IbQKm4WXF/2VDwijDyMMj+E5q4qP6NMFveLzOWKmeX16/0CZgmNTWYiZhr02QAB+CRZjTv6mIdqZBcMwrnHWItX2J/HxrhtxV8FlR1EEzhnYuK4gnurwq+aZwGWQZXtl7pLama6xUPyXEVtEBP+GcS5BAFq7rMp8hW1R7QDOmQczDBVITvO0Ya6pP699ReCr0EcArh6+7QZvGljzS7/7mLfwGh0LaRQ3iCfaRuoq5rx2HWFN9nqpXfk7oI2CA5O+VpGj2d5ATd6RuiGzSiQy09ATxzZVJOomA1ZdsArEej8fTkvwAGttyB4boXoAAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.153.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAVklEQVR4nGNgoDf4D8XRQMwGxEuB+D4hTVpAfByIC4BYkFib3gGxAbGKQU55CMRexGpwAeJmIK4lVoMfEAcA8RogLiGk+AYQSwMxHxBfA+JqYm0Z1gAA2JYM+cKygUwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.154.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAYAAAAinad/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAsklEQVR4nGNgGAWDEvAAcSMQPwTiH0DcBcTGQHyXVIMkgfgSEOcBMQcQMwFxMhD/B+KFpBgE0ngBiD2wWAAyLJwUw0AuWI5DDmSYNCmG7QZiN1I04AOgwGahlmG/qGUQCJwBYkss4slI7FAcajAASCEobdlC+eJA3AfEWlC+DwMkTFcxQNIdQRAPxDcYIF6+gGQwuqXWxBhGDMiglkGODJDsRjHIAuINQDyXAeLVUUAhAADXJhtBFMwsTwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.155.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAXCAYAAADAxotdAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACkklEQVR4nO2YT4RVURzHf2aRJI9ZZCSJJCMjkSRp8UjGGEm0SmYRSauM2cwiSSIjrdq0GC2HtBit2oy0HFoko0Uks0hGpMVIRry+3865unPmnHPf+fN673E+fLn33Ht/73vO757zu+eJFAqFQqFQGCauQGf6baLQG6ahC9Bz6GSfvRR6CGfx2QxxRqFX0Ba0Au3LELMXHIFOJcZg316K6is1mWoKTOlYnYwx/3IzU5y70HFoBFqAXmSKm5N3olasN9CXhDjz0EF9zERsJfoS2Z7UXDGlDe3NEQhcrR23oF+Z4oYw4rn21jj/BO3O8Du7oPeRcep0Gs69MIn3oFXoom67BS1Di6KW6VADTXwP9FPnIbQJbUA3dJtvCauuLTh8csZNG23ropKTApf6+9D+xDgkOsHXoQfQMVHLJh8cz2DAB+vx40g/TMacqFlyGfqo231LWHWt7fDJtjVD3wL6Y+OajssX5VxiLJHIBJ+QnbWQHTudwYAPdv5QpB/WRttS6xuAD9CMwwsTv6T9VOKse+K4PxTGt5Wjjkc2ohL8GTpgtG1Y2lyEmiRMjmuwu/ETMwBj0FNRddXc1zP5R402lo9RS7zQvjZ5DiE4wS3LTVwKX2cy4KKd6Oer2D/8uhkArgTrRhtfoLHaOUuEq3zE4ioLPZ3Bt/VNK/p8QtQ2IZZuElwNJH/rWaSfR9CsPj4satYTXw1m3POWdtHPX9LH/KCLfcFd9G2bxJnAQfwtqs7dSTTQlOAl2f6WLkb62SOqTrODfAGq7VfV6eoresrwxiRuGu2Edf8n9EPUx10OVuVfP00vsfj6twP+05Kykc/NoPkZerjHnG286/8xaH6GHu7zWv02UWPQ/BQKhUKhUCh0xR8zQsqGK9A2mgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.156.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAYAAAAinad/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAsklEQVR4nGNgGAWDEvAAcSMQPwTiH0DcBcTGQHyXVIMkgfgSEOcBMQcQMwFxMhD/B+KFpBgE0ngBiD2wWAAyLJwUw0AuWI5DDmSYNCmG7QZiN1I04AOgwGahlmG/qGUQCJwBYkss4slI7FAcajAASCEobdlC+eJA3AfEWlC+DwMkTFcxQNIdQRAPxDcYIF6+gGQwuqXWxBhGDMiglkGODJDsRjHIAuINQDyXAeLVUUAhAADXJhtBFMwsTwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.157.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAoElEQVR4nGNgGAUDDniAuBGIHwLxDyDuAmJjIL5LiiGSQHwJiPOAmAOImYA4GYj/A/FCYg0BaboAxB5YDAcZFE6sQSCbl+OQAxkkTaxBu4HYjVjF+AAoYFmoYdAvahgCAmeA2BKLeDISWxiIZQkZFMoASTu2UL44EPcBsRaSmmoGImMvHohvMEC8eQHJUBjwItYgQmDwGZQFxJXUMGikAQD7fxm7gv5WogAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.158.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAWCAYAAAAinad/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAsklEQVR4nGNgGAWDEvAAcSMQPwTiH0DcBcTGQHyXVIMkgfgSEOcBMQcQMwFxMhD/B+KFpBgE0ngBiD2wWAAyLJwUw0AuWI5DDmSYNCmG7QZiN1I04AOgwGahlmG/qGUQCJwBYkss4slI7FAcajAASCEobdlC+eJA3AfEWlC+DwMkTFcxQNIdQRAPxDcYIF6+gGQwuqXWxBhGDMiglkGODJDsRjHIAuINQDyXAeLVUUAhAADXJhtBFMwsTwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.159.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAAAUCAYAAABI10XZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACrUlEQVR4nO2YTUhVQRTHDxIPiUfQIlyEBOFCJKKNK2kRhIiLaCcSIm4lJCJoISIS7VoHrcKFtJGIiBAkwlW0iRYSIYi0ihBaRISIYP/DzMP7xvk4M/fe91TmB3/wnrkz55z7jvNFlMlkMplMR7gP/YTeF2z90AdB33fQ5ZL+D0v2l3AL+lqT/07E76OW3Gagz1AT+qFtA9AnaDgiqKupAVBnPux3j5/TXhiV5zZIaqa4UbD1QBtQX8Q4V6CPKQFoOvVhz2phMJXl9lZ3OtR/t5iC5h0OWPegBrQC7RTaF3XfFGzBh/xJxpC+U1dhjENbWhPQLsXnVTaGpNweQk8NGxeJawkZIrXEPIAuGm0j0OuUIMgdvM+fdAzJO3UUBv/wm9A16Dy0Br3UbTF5lYnBZ/fCm81Rw/aX1HLi4je1Lz0tuPr/OAJzqfhOrD+bn9R3qi4M3m/xfq24HK9DdwvP0rxSYwjZnZyD/tHxIjjw9OEfnxMed7TvxwahcQUf8icpOokf31ImGdu0PYdmC888K/C3bujnUF6x/l05+OxOxkgdNU34v75hsTO3oSfQgqWth6qfMXz+bH5S36l6xvgF9RaeX1D7t47JKzWGkN3JM2qv6hZvSO0XbNwhNR2uQo+MtuvUvomNwRW8z590jBZN/U4zoW8Is/8eqX3EJWgJWobm6GiGiMlLQqW58d2D7Ug6SaqaTfiszBdZF6BvdPzk8hiajg1CYws+5E8yhtkuXQpiMftzMfCyyptxLo5XpPZzPEvH5iX1X0lufO+w4mnnO4mBiPH66HTcY9Tlv9vx+xDFxudpXvv42OS7qeTC+UKqwkPcJHX0Ouk3n3X673b8PkSx8Y3mNqlr7BA8C9g2pyZ8Pu+XOPewV7J/Wcr673b8Pk5ybJlMJpPJZM4Y/wGgjNvEHQTg4wAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.160.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAASCAYAAACjMAXnAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAn0lEQVR4nGNgGAXDFDgC8YWBsvwGEP8fKMsZSLHcC4hvQXE4EL+ml+XRQHwFiHWAmAuIdwDxfHpYrgTED4FYHElsNxAH4DAMFybL8mlAnIXEFwTib0DMRkgjEYCg5S+BmAOJPxOIt+AxjKo+/wHEWkAsCsSNQLwQiPMYIAmQEsADtZwHnyKQhb+AeB3UAcuBeBsQe1BoOaFQGQWjgD4AAOdkLkmAcXU+AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.161.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAUCAYAAAAgCAWkAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABw0lEQVR4nO2WoUsEQRTGH4cchkMwGUQEuSAGsRhEDILIYRARDCIiNhGDiGAQMYhg8D8wmK6JiIhYREyHRQwihyBishlEDCKs38fswd7czuzM4sGF/eAHy7ydN/PevH2zIpkytYzWwDu4jIz1gGuHuReg+x/3Mg4e0k5eBnegAN7CsSKogGGPxfvSbkBTFQRpJvaLOpGhyFgO3IIuDz+94MZi54kPePjzDuY8nBSEzzUtgm3DAmQB5EEZvEbsu+HcOI2Be3AsbiWZ6mQ2wL42xsBM5cXssvzWQadmGwWnCevNiSqjA9BheS9VMDz+SW3sS1SpmfQh9WVZE0/r02FN+mYSn8GW4R3vYNrAtzRu/Ncyhxtmk5gy2H8c114Bj6KCipN3MCVRbVUXs5s3zJkAe2AnxpaT5JOZFdX56KNgec87mEOwGjN+Jqr+4zQNZsAJ2NRsg1LfSKIaEfWtHUlyA2CQgdiDbRAzFNd+50VlTlc13Ag/3Cdp7His/yXDWqwA19YcRHAS74Wyxc47o+jqTFRSbPdMU8QO0i6q39tubAbLe6Hk4JN3SCXBX1PEm/1F1C9IkpjtuAah60rUf1ymTJlaTH//dFEXQDQMqQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.162.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAUCAYAAAAp46XeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeUlEQVR4nGNgGAWjYMQCWSDei8T3AuJfQPwfSnsQaY4jEF9A4m8BYmlqOJBcoALEx4HYFEkM2UMeUD4x4AYDJEBgAOZZJQrdSBZgAuKDQCyOJv6fAB8fQFcrD8T7idUIwtFAzAbES4H4PhZ1yMkKhrGBWCCuJsKBlHgOBOqhdhEEWgyQZFQAxIJY5EHJ6BsDcflkEwNqcsTlQEo9Zw3E64g14B0QG+CQA8WYF5HmfGGAJE10QG3PgVLZJ2I0gxQ+ZMDtgf84MDbwh0gHUuo5ECCqUHIB4mYgrsVjCLFFNyg02bCIU9tzTAxExpwfEAcA8RogLsEiT0qe28AAyQ/ogNyqgIcB4jkeNHE9Bkj+xgtA9QioUuQD4msM2Es6ZAcRSpaRDJBUgE8/eh6+AsS7cZiHy75yII7HoYemAFQHqZCgngOIX5KgXpyByHqOFgBUyZ5jID6fgrICtqSMDdgyQKqtAWmhwAAodLfQwNwdDJB26ygYBaNgEAAABTNhadu8KD4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.163.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAUCAYAAADC1B7dAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABtklEQVR4nO2WvyuFURjHn26S4aZMBknpDjLIYpAMSroZJGWQJJtkkJRBMkgZ/AcG090k3SSLZLrdRQbppiSTzXCTQYrv0/Peeu+55+dbb1Hvpz7LOe85z3nPe87zvEQZGX+SdfgGL2NtvfDaY+wF7EljUUlZgVWYh69RWwFW4IjH+Al4D/tTWV0gAyRfZjjWloO3sDtgnj54Y+nnLz8YvLpAyvAnshxrX4I7mucbzy7CdliCL7H+vWisjnF4B0/IfjxdMZxswgOljV/OdNR4l/kobsAupW8MnjnizcMaPISdCWI44aMwpbR9kBw7E+/UfEQb8I7WPWLy3LyRT3A7MIaVNvhJrYv/tozhRXPimDb0f3nGXoUPJC8WGsNIkSTlqtSjSXVMwn24q+nLkfsLzZFkRJ4jnyCGlSO4pmk/J7kPOmbgLDyFW0rfEDUnlzijJPfimNw1yxbDCu+ULjUvkOyQSi1aDF/mR2rNhHwflg2x+CT4pG1XDCNcN0qWfq4pBd/JSDbGVodSgzNLB0k9sFV2fmGuG0WPObnGVBzzpQb/ATyT/K644F3XJQ2VK5L/voyMjH/AL8eJURl+9lctAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.164.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdUlEQVR4nGNgGAjgBcS3oDgciF/jUxwNxFeAWAeIuYB4BxDPx6VYCYgfArE4kthuIA7ApWEaEGch8QWB+BsQs+HS8BKIOZD4M4F4Cy7FIPADiLWAWBSIG4F4IRDnMUACASsAKfoFxOugmpYD8TYg9sBny4gAAAcrE2GHfqELAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.165.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAASCAYAAAC0EpUuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAUklEQVR4nGNgGAVEAnMg/o8FUwRygFgQia8GxOcoNZQFjV8NxJWUGooOLjBAXEs1oAY1lKqAJK9ji11ssQyKIKp6XYWBRl6vpbahVPf6KBggAAC9TBVJ3E+gGwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.166.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAASCAYAAACAa1QyAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAWElEQVR4nGNgGJLAHIgPAvEvYjW4APENIA4FYjZiNAgD8XEgFiXFWbVAvBCIn0Od5kGMpgtA7AhlezAQ6Sd0Rf+J0YSuiHaakD1PtJ9gCv9DaS9iNI1YAABH3RXxkutPZQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.167.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAWCAYAAADXYyzPAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAqElEQVR4nGNgGAWjgHjwn0hME4sHBFBksSAQ7wDiX0C8F4hFSbAUZjFZZtQDsR4QMwFxFxCvIcFiisyIRmLzAfEPMiwm1wwU8I4Mi8k1Aw5AcdVHocWkmAEHsUAsT4GlpJgBB6CEEY/DEnSLcFmMywy8wBGHpdgswmUxNjPwAnEorQPE83Go+Y+DTYoZKGA5A2q5OhePxbjKXmLNIBvQrNAn1vJRMLgBAO2bPDLhM7j5AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.168.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAoCAYAAAAG0SEsAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA/UlEQVR4nGNgGAXDBPwngGlq8YABqlguCMQ7gPgXEO8FYlESLQep3wTVD8IepFheD8R6QMwExF1AvIYEi0GgEohloWwPqAOIBtFIbD4g/kGi5UxIbDYgvkSK5ejgHYmWw4ApEDcDsSS5FoPiv48My2OhYg+B2JZcy0GGyJNoMTIAxTkx0YYBQHEXT4RFhLIYWVnQkUjDqG65OJTWAeL5BAwkFOwkZbXlDKjl8Vw8lmOz+CSSXpDFXqRYTiygeWUxaC0fBUMfEGoCUQuPgqEHKGqjUQooaqNRCqjaRiMXUNxGIxdQpY1GKSC7jUYtMPT7aOQAumc1urTRRsHwAwAL0GaKcTe3lQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.169.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAAAmCAYAAAA/bE50AAAACXBIWXMAAA7DAAAOwwHHb6hkAAACwklEQVR4nO2ZP2gVQRDGhyBB5CFIkBQSApJCRNKIhYhIIEVIIXZBRFIIIhZiJ2IRRASxkGAhiIhY2YQgIYSAiFjZiFiIiJ2ViGAhIhKE53zuPN7eerd3t+/tebmbH3zs7d7e7TFzO/uPSFEURVG2L3tYm6wt1nPWXuf+hJTHYob11sqvs/ZFbK+2LLGmWSOs26wV694U6xXrSMT2P7C6Vr7nmP0R26wlZ6zr3axfcg3HvGSNV/ANXSc/yXpRQbu15pukZ1nXnHvoPXDUTsnfZP0kf49xjVy0zpJ8QyvBeHFHrtco3cCnJF1mnWA9kOeyCHXEMdZqgWcbCf7ASbn+QSY8ucDwcAKcNEpmkPeFr1BH4N3fCzzbOGD0RSv/O6PeZzIDKphjvUmp0/UojazyLc/3NpYZJ4+/cdQpO0omZPU4z3qU897QHjFCLewRvdByiPqGfUomTtvcIuOMHk9YF1gnPe/Oc0RH6nScckyp1/6t3lxgTDt0PJTy06wbTt33Tv41GYdNe96f54issHWFkqGy1WAuP/Uf2h0nXUckwAwKg/FchW0eJ7Oaj76ynmd9FC2wvsZucEDwd65X2B72vSZy6gxsQ2wnvCMzKO6SRvNmHUqSgW2IrvaJkoufZ9RfqQ6DsvP37cZQbHiPddHKY1sA+zTuXL0qfE6ro8BQbPiF+ptl4D6Vj71j5I+fTe8Rw7Dh313Lg2QOXq6zHrMukRl4fOywrrEbulC24QYRasMEeBB7J6vyIiykNshMDcckxUrW3WqwDT9P7XZEqA0Lg6PBu6zDrMtShvn0LJnV7aw01HZH+EizYWnOkfEm0gNS1hEtSooQpY7IJs2GpVmWFDHPXVHahseM4WpoIw3HZ8PSpB3EKOVorQ1DzrGVSJQ9x1YiUfYcW4lEkXNsJTIh59hKBELOsZUIhJxjK4qiKEpt+ANUytCMg9h0pQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.170.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAASCAYAAACjMAXnAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAmElEQVR4nGNgGAXDFDgC8YWBsvwGEP8fKMsZiLG8Hoh/ADEHlN8KxN+A2JQeloNAAJSeAMT2QDwbiAXpZflsqMUg37IB8S8gFsdhGC5MtuXPGSCpEwQ8gPgcMZqIAAQttwTiTUj8NCCej8cwqvq8A+oAGFgOxBlA7EdIIwHAA7WcB5+ia2j8M0C8AYj1KLScUKiMglFAHwAAre4rJq9xzR4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.171.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABI0lEQVR4nGNgGAWjYBSMAjoBUSB+OdCOoAbYAcT/B9oRlIIcIK5koJFHvID4FhSHA/FrWlgCBFpAvBTKxuURst0SDcRXgFgHiLkYINE+n1yX4gFsQLwKiHmgfGweIdstSkD8EIjFkcR2A3EAkY77jwejg2oglkfTSzW3TAPiLCS+IBB/Y4CEHrUBIQ9T5BZQEciBxJ8JxFuQ+KFAbEmG44jJyOhq8LlFGIhl8Rn2gwGSAUHleiMQLwTiPAZIhvMBYjcGSLo2JsJhpAJ0j+BzCyhZhuMzDKThFxCvgxqwHIi3AbEHkhpQrFhTweHoAN0j+NwC8gxejxADMig1gAqAYo84MiCKy4EEFHkEVIJsAOK5DJDkNZAA5JbKAXbDKBgFQw4AAOPkUHvdExkFAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.172.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAWCAYAAABDhYU9AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA7ElEQVR4nGNgGAWjYBQMKiAKxC8H2hG4wA4g/j/QjsAGcoC4koEEx3kB8S0oDgfi17RxF4MWEC+FsolyXDQQXwFiHSDmYoAE+XwaOIwNiFcBMQ+xjlMC4odALI4kthuIA4i08D8ejA6qgVgeTS9eMA2Is5D4gkD8jQHiS2oDYj0BB6DszIHEnwnEW5D4oUBsSYaFxKQngmp+MEASKajcaQTihUCcxwDJID5A7MYASSfGRFhGKiDoOJCDfgHxOqgDlwPxNiD2QFIDCj3rgXAcMSCDGobQAjgyILL+oAKgXLwBiOcyQKJ2FIyCYQkAo1Y5UxUG7ogAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.173.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAx0lEQVR4nGNgGAUjHAgC8Q4g/gXEe4FYdKAcUg/EekDMBMRdQLxmoBwSjcTmA+If+BTXQxVwQPmtQPwNiE1p4LB3hBQEQOkJQGwPxLMZIPFLTQAyr4+QotlQR4BCgY0BkrjEsaj7jwcTArFALE9I0XMgdoSyPYD4HBEGkwJAiTWekCJLIN6ExE8D4vk41JIbIo4E5MGgA+oYGFgOxBlA7EeMZiIALIp1GHB7EAyuofHPAPEGBkj+pxSAPIUcanOpYOYoGAUDAwDFvCvZszqD/QAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.174.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABO0lEQVR4nGNgGAWjYBSMAhoCUSDeBMS/oNhjYJ1DPqgEYlkoG+SJXwPoFooAExKbDYgv0cISLyC+BcXhQPyaFpZAgSkQNwOxJLXdEA3EV4BYB4i5gHgHEM+nxKV4QCwQ/wfih0BsS003KEENFUcS2w3EAUTq/48H4wOgPPKDSm4Ag2lAnIXEFwTibwyQNExrAPMsVdzwEog5kPgzgXgLEh8UKsYEHENOjMD0EuOGUCC2JGQYKHq1GCBlfCMQLwTiPAZIxgOJg6J9LwNqiUMNgFz84nODDxC7AfEqBvwBCtYIMnAd1KDlQLyNAbWyyqCS408yIGLrF9ShxLoBFCvWlFiuB8THGSAxM5CAKoHpxwCJ4oECjkDMQ4kB8QyQzA4q+6mdR4gFoNJsAxDPZYAkL7IBC1WcMwpGwdACAOZ2UEUHHOTwAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.175.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAWCAYAAAC7ZX7KAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABM0lEQVR4nGNgGAWjYBSMCOAIxBewiAsC8Q4g/gXEe4FYlJ6OwgduAPF/LOL1QKwHxExA3AXEa+jpKEIAm4Ojkdh8QPyDGIO8gPgWFIcD8WuKnYYdYHMwOnhHSAHIh1eAWAeIuRgg6Wk+Ze7CCQg5GJSe+/ApUALih0AsjiS2G4gDSHAALoxLPT4QC8Ty+BRMA+IsJD7Ih9+AmI0Ix5ID8DkYlOniCRnwEog5kPgzgXgLEh8U0sYEHECtEHYk5FgQAOVILQZI2dcIxAuBOI8BkglB4qAkAyobmYgxjADgYYA4mAeLHCxJgvIR3vwDciSowF4HdfRyIN4GxB5IajIodSkU4Ar95WhycymxBFSgH2eAhPSQAX5A7DPQjiAGgHIsKNOBihpqpGG6AJaBdsAoGAVYAAAytECrUxF4+gAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.176.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAWCAYAAAClrE55AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvklEQVR4nGNgGAWjYIiCmUD8B4jZaGS+IxBfIFZxPI0cAQI3gPg/sYrraegQECDKIXxAPB+IpwHxDyBOHiiHRDNA4lAJiE2B+N1AOWQdENsj8b8RaTAuTJZDWID4HBLfAIgPEuEQUgFBhwQAcS0Sfy4QxwKxMBDLEjCYqiGyGIg1GCBlSDUQ74aKg9jhhDQTCXigDuHBpwhU2IDyOSi3TABiDqi4FxUdQii08AJqOoQiMGgckgXElQPtiFEwCgA7ijBVZ609HwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.177.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAWCAYAAACsR+4DAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABAklEQVR4nGNgGAWjYBSAwUwg/gPEbDS2RxCIdwDxLyDeC8SixGiKp6WLoKAeiPWAmAmIu4B4DbGaaA2ikdh8QPyDkAaQovlAPA2qOJk27sIA7wgpAPnkAhArAbEpMRqoAEDprY+QonVAbI/E/0ak4f/xYEIgFojl8SlgAeJzSHwDID5IpMPIBaDETzCzBQBxLRJ/LgPENyAQCsSWePSSG2KOhBwFAouBWIMBUoZVA/FuqLgPELsB8SogNibGICKBOJTWYYBkOJwA5PobDJDcOAGIOdDkQaFmTSVHLWdADdW5lBiWQQ0XURuAQpNnoB2BDrKAeAMDJLhDB9gto2AUUA0AANvTMo6/Qe1+AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.178.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAWCAYAAACsR+4DAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA9klEQVR4nGNgGAWjYBSAwUwg/gPEbHSyTxSIXxKrOJ6GDkEHO4D4P7GK62noEGSQA8SVDEQ6jA+I5wPxNCD+AcTJNHKUFhAvhbKJclg0EF8AYiUgNgXidzRwFCj9rgJiHlIctg6I7ZH434i07D8ejA6qgVgeTS9ewALE55D4BkB8kEiHkQKI9QAcBABxLRJ/LhDHIskZk2EZMdFEUM1iINZggKQBUHDvhoqDEiooze0FYiYiLCIVEHSYIxDfYIDkxglAzIEmn0EDR4EA0eUYNqAHxMcZICE36IAfEPsMtCOQAaiKAiV+UEagRRqjCLAMtANGwZAFAFjvNwKf0DFgAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.179.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGklEQVR4nGNgGAWjgESQA8SPkfgzgfgPELMRoRekL49Yi7KAuA+IxdHE44nUD9I3DYgLiFH8BYd4PZGWwcA3YhT9xyLGB8TzGSAu/gHEyWSagwF+YRGLBuILQKwExKZA/I4Ic/4QUuAFxLuxiK8DYnskPjFBdBiI/fAp+I9mKAiwAPE5JL4BEB8kwjJbBgJB6Qd1ETIIAOJaJP5cII4lwrK9QOxDSBF6nC0GYg0GSB6rZsAezNgAwTgDAXSvOwLxDQZIKpwAxBxQcWEg9gBia6gaQuZgBbjyGTqQBuJJQGzMgD0DE2UOqAQB5SdJAupAec0DSmsgicNKkAxiLAOBNCC+T0DNBCi9kAGS/2DgPlQ/TQATrQweBTgBAKbnMj8jGT+xAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.180.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAQCAYAAAAvf+5AAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAJUlEQVR4nGNgGDTAEYgvEKPwBhD/J9bUkaeQB6qQhxjTYHiwAACyigz3zfIliwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.181.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXElEQVR4nGNgGPRAEIh3APEvIN4LxKKENNQDsR4QMwFxFxCvIaQhGonNB8Q/SHXiO1IUg/zTR4qGWCCWJ1YxyNPxpJjuSIpicSitA8TzCSleDsT/kfBcUmwaIAAAyyYNqin/ZtYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.182.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAlCAYAAAD7u09NAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACKUlEQVR4nO2ZsUsDMRTGH0VEpAhSpIOI4CQiLuIgIiI4SAdxEQeRDoKIk6s4iIggDiIOghQp4uAiIg4iiP+BiIOIuDmJiziJuNT3SErD9e6aXJK7E/ODjyTX9OXru7tcLgVwOBz/hHbUNeoHdYvqSNZO8qyjBlAZ1A7qLFk7yTMn1NtQ33ENXEC9cM2iPuMaWJEPT9uKbzoLj6h+VCuwe/bERGDD0HyyK7St+O5BvaLywrEb1IxuYAvMo7p53ZrvA9Sy0Kaz8IVq0Q1sGJpUi0Lbmu93T5BD1JVuUAuMe9rWfNOs3Qfs+b6BKqNWgE1WMuRQXSaMhFC9LWiuKPO6ru9AKBgtes558FNgmZ4M+U6TUF8DNrvbgvxUBB3x41F8a5HjwUeg/nIVE1AAuwmJQpj3yHSi9lGDwC5FYhQ1gdrkJQ2cxoT4eddmAViWqezlx7JcRV7SrZPGhPh512aPl8fAnvkiYgLo0bdqalBDhHnXJmMwViVENjDp/X8RdqZMS3bcuDw6HI70QqvCh6RNpIlncBNXHX82IbSbTa/Q1T2FLWAbLEMB/WV/aBwJUfUuzTQvaak7hioB23nyI00JIVS8S1PiASmzzcD2F/IBfdOWEBXv0rxBbb+A3g7vPZ9HWfHFlZBG3pUZRl0K7UWobc/5kaYrRNW7FNs8cBXagltCTQX0l/mhWd4vq2etIarepXjytO9QF8D+R/VDJiFxvUSpenc4HA6j/AL4Kr1yu+JhBQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.183.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAWCAYAAACR1Y9lAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABZ0lEQVR4nGNgGAWjYBSMgkEIZgLxHyBmG2B3CALxDiD+BcR7gVgUSY5qboyn1AAqgHog1gNiJiDuAuI1aPJUcWM9NQyhEEQjsfmA+AeaPMVuBBk6H4inQQ1PptRAKoF3SGyquBEUkheAWAmITdEsGCgAyq99SHyquHEdENsj8b+R6zos4D8ejA/EArE8Nd3IAsTnkPgGQHyQVEOoDECFEXLBQxU3BgBxLRJ/LgMkNIkFwkAsi0eenBh1pLIbwWAxEGswQOqnaiDeTYQeFiQ2SE84qZbiAeJQWocBUviAADluxACg0LvBACnJJgAxB1QcFFMeQGzNgBnCyB7zYqCeR5czoMb4XAJuJOROooA0EE8CYmMgLoCK2QKxCxA3Q2mQJdT0KDkAmztJAqB6ygNKa0DFeKA4HkqDkvBAexSbO0kCE6D0QgZI3YUMkD2WBcSV5FhAJYDPnSQBJsrdQhcwVNw5CkYBMQAAqiROpH6GuVkAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.184.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAWCAYAAAClrE55AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvklEQVR4nGNgGAWjYIiCmUD8B4jZaGS+IxBfIFZxPI0cAQI3gPg/sYrraegQECDKIXxAPB+IpwHxDyBOHiiHRDNA4lAJiE2B+N1AOWQdENsj8b8RaTAuTJZDWID4HBLfAIgPEuEQUgFBhwQAcS0Sfy4QxwKxMBDLEjCYqiGyGIg1GCBlSDUQ74aKg9jhhDQTCXigDuHBpwhU2IDyOSi3TABiDqi4FxUdQii08AJqOoQiMGgckgXElQPtiFEwCgA7ijBVZ609HwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.185.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABGklEQVR4nGNgGAWjgESQA8SPkfgzgfgPELMRoRekL49Yi7KAuA+IxdHE44nUD9I3DYgLiFH8BYd4PZGWwcA3YhT9xyLGB8TzGSAu/gHEyWSagwF+YRGLBuILQKwExKZA/I4Ic/4QUuAFxLuxiK8DYnskPjFBdBiI/fAp+I9mKAiwAPE5JL4BEB8kwjJbBgJB6Qd1ETIIAOJaJP5cII4lwrK9QOxDSBF6nC0GYg0GSB6rZsAezNgAwTgDAXSvOwLxDQZIKpwAxBxQcWEg9gBia6gaQuZgBbjyGTqQBuJJQGzMgD0DE2UOqAQB5SdJAupAec0DSmsgicNKkAxiLAOBNCC+T0DNBCi9kAGS/2DgPlQ/TQATrQweBTgBAKbnMj8jGT+xAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.186.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAQCAYAAADESFVDAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAJUlEQVR4nGNgGFDgCMQXCCm6AcT/iTFt+CrigSriIWQKDA8UAAARpwz34HzMkQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.187.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXElEQVR4nGNgGPRAEIh3APEvIN4LxKKENNQDsR4QMwFxFxCvIaQhGonNB8Q/SHXiO1IUg/zTR4qGWCCWJ1YxyNPxpJjuSIpicSitA8TzCSleDsT/kfBcUmwaIAAAyyYNqin/ZtYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.188.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAAmCAYAAACPk2hGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABvklEQVR4nO2YwSsEURzHf22SJKVt24Ok9iTJRQ5ykHKQg9wcNjkoyUGucpCDkoPkoCTJyUWSJCX/gZzk4OYkKUfJhe+v915e0zQzzfxm3y7vU59m3zSzv9/vzc7s7w2Rx+PxeJIxAZ+00/DNbToyVOED7IOt8BoeOc1IgAp8hmVr3w2ccpOOHHtw0Rp3wA/Y7CYdOV5hizXeh5eOcklKEXbFHfQJe2EJrsNjuETqYVKvrJJ6wEXCxXzBM1LFncArOJ5rauEUddxhOBpxHE96bGFZg6SB72N+8vKE3pKaUKYT7sIBuKz3jZEqxFiijIWFBZFiDfbDAtyCp3r/HKnJ5G2P3tcWsIkyFhYWRIqq9bmd1H3O7Ogt3+eViPP5Kb6SNnjSIBK8B8aFnOPVJAjfb9s5x0jNd4RxzMDuWiYUpwT8a5gV+q5cSDsB0n8jdYFpunlF0fArCQN3N/ZVPXSbjsfjyQI3ptyzmUXnBqmV9KCzjAQx7zm4TxyBB6RanoaHC+Gi+CrxOw9eL5Ujz2gQXui3G+Aly73DXMQYghfWeJ7+SEewSao4A3cHC3DSTTpyPAbGd/Cc1BLe4/H8c34AC6RcweCVfVQAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.189.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAXCAYAAABQ1fKSAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABsklEQVR4nO2WzytFQRTHTy+9JCnp9RaSspJkIwtZSFnIQnYWkoWSLGQrC1koWUgWSpKsbCRJLyX/gWQhCzsrSVlKNnyPM7d7u903c39MPd6dT32ae6eZeWfOm5k7RA6Hw+Ew0QY7ah3EX2EVTtU6CFu0wiv4BW9gSdXzPz4Gh+CIpv841VEy1mAfLMAteKrq2+Eu7IfLqm6UZPKeJaqzZEwHnlvgp3qeI1kZXHaruuaQDZQgGdzwSckd3jIGHgX/szyBRvW+AT/gQMrx3lW5o8pj2KVpvwhXTINyxh9gL2wi2ZdHKQM0MalKnsAwPCA5C5LCfbZDdYUMcf3CmXyG5UDdNflBm/jWGAVPnhPBq6FIchiWq7TVMQM7U/TTskeyfDw447x0i7Z/SPFC/onP+/yuSrt7zRi8AmZtBuXxSv4eZvbhZYL+SVbGILwIvM9Tuu2o+3xmgg+0HpJPzzrJIbREcqDaZpMkIR4ncAFOJBjD21J8vlk/1zgBvG/PSBLCAVZIlrBtHkPvt/Cc5O4QB44tuPIO7YVmJu7NLhdE3exyS9TNLrfEvdnlisw3O4fj//ED/tZOoLvVAQwAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.190.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.191.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAASCAYAAADxEzisAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACJUlEQVR4nO1WQSiEQRR+Sdo2F0mSXCXJRZLkoKTNQZva5CCHvUlOao9ycJHk7iAHuUhyUpKTg5LkJCXtwUHKcZO21vuamZp9+8+///yrkP+rr53/vbdv3ryZ92aIEiT4Tej66QD+EjqYF0K2x6xYLDEvmQOO/787fLcy15lF5gdzkznEfGow5mnmp44Nv5kIOiOX9l5oY54xewJ0SNqMHrcwl5iPAXbbOjgJnNp75gozxWxi5rXtftyANexFZ/R3PZ2RS/vIwO6fMnsdeujare8081XYjDELVJswJOeOaneyS9vOxYjXhpyvEkHXUMKw4yfMQYe+mfmmx1j8CKmSzFs2kF9oXzJI2B06fMO22zfgAB+ub5fOJAqc9pkMyTgilQQXslTdw56pNrk4WauOIM+ZUz5BeULOVwrRBbULL2Dnx+vY7DJn9Rj9q6BlBigtNO6UIyg0+GaPmCohDILdpyZIlb/tS/qOjQOKdkPgVrMXjPKzd/GYwhcWq6l6wJQXeuoGc83SfVvCcEKyEexw7R8IGZ4TRT1GqclnSFl83zBHA3znA2SA7wmzsUPqtrd9Sd/e2GIuRLDDScJzwpQjbkYs8oW5TOp2u6XqZ0gfqRLstGQ5Ugk2pQ8dnh/9cYJ3YJjUxk4KediTIxJwXMN20N7JspChDK9JJdt+zM5r+5ywT1vzLjIfdMDoMfX6pg8Q5xWppEmYJJmHq9eNmCBBggQJ/gG+AAk2pMzGiTrRAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.192.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAASCAYAAAAKRM1zAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABkElEQVR4nO2WvUsDQRDFFwkhHHYiEsReRGwsRMRWrEQEEQuxuC4EK8Ha1sJ/IIhYiJ2FrQRrQSRYiSByhUUQLIOIEN94K0wme5fZg4DIPvjB3d7svJ29uQ9jgoL+lU5Bl9EBN2DWETsO3pV5uwXXk+cxCg5BAj7AEZgHz9rkVOyaPS6DGnhyxB0bfQFFC83yqIIHsAcqYATENvZMm/wKjLHzCLRFzBI4yFiES0UKzfKgolpgVYxXbeyWJnkJvLGECyZt3VgYNU26k8MqNM+D1nKR4zOpMVg3vc/oC5gTMbTL+yyxRr6F5nlcgxXPfH1qgA17XLaGDXad2oMe9krGIrLkU+ggD3rxlDzyOZWIJNRCHXZ+aXrv+DAKHeTx6ZHLKXo1n4sx+qwk9pjapSmufylzawvVeNyBRcfc2DHWJ7pz9Fn5bdvITnwFdbAJ7sEUmzNt0jaaUOTXFKr1oDja/GV7TtfoMzSj8PjZNfmjcAt2wAkb32ZmPD4S+WTrueDy9dgFjyZt4xYrOigoKOhv6hvP83k6hzSqGgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.193.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAQCAYAAACoTgdGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABoUlEQVR4nGNgGAWjYNiC+UD8Hwl/A+L9QKyDRa0oEL8j0tz/ZLoHlx2TGBBu/APEX4B4NxBbk2oByMN+UDYbEGcB8S0s6voYiPcEuZ7FZ8diII6Estmg7KdAbECKBZuAWBiJzwXEL9HUgEKwHI9D0AE5niVkxxYglkQT82KAuJ8owALEr6FsJiA2Z4Ak42QkNSDxvUDMgcch6IBUzxKyA+TOczj0fSPWkgAG1Dx7H4j10NSAQrsEyqaVZwnZAXLnBCziIM/+ItaS2UAcBGWzQS2djSQPSjZ3GSAhjssh2AApniXGDpCbfLCIawHxBWItesgASSIwgJ4s1jGgxjwtPEuMHY/R3AkDPUBcS4wlxkC8FE0MVOU8hLLdGCD5CBn8IcZgBuI9S4wdpgyQagYdODJAsh0fIUtAMQiqcmBJGFQCgwolUFGeA8ThDJACQRZJjwYQ/wBicUKGMxDnWWLsALlzIRAXQPmgrGbPAInRG0AsT4Q94NBDb0ycBOJYBtSGBqxeC0VTz4XFc4QwMiDGDh4sZoDceQmI67G4YRSMguEEALd4f77JlMQiAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.194.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAQCAYAAAB+690jAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA7UlEQVR4nGNgGAXDFIgC8Ts0sflA/B8JfwPi/UCsQ8Cs/9RwUB8Og0CO8oOy2YA4C4hv0dpB1kBcjsOgTUAsjMTnAuKXtHQQExDvBWIOLAaxAPFrJHXmDJAoS6alg0AhU4LDoAAG1DR0H4j1iDCTbAdJAvFdBkjoYDNoNhAHQdmg9FMOFaOZg9YxoIYAukEPGSDRBgOgaPtGKwe5MUDSDjL4g8Q2BuKlaPKg7P6QFg4KB+JzQCyLJKYBxD+AWJwBEhKg7A6LLlDOAiXkp0CcQ20HIRd2kVCxUAbUaPvDgFkgngTiWDwOIIRHwdAFAJRqSeRW3poAAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.195.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAASCAYAAADR/2dRAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABWklEQVR4nGNgGAXDCIgC8Tss4jxA3AjED4H4BxB3AbExEN+Fyk8C4v9Q/AeIvwDxbiC2psQxfVADkYEkEF8C4jwg5gBiJiBOhqpbiKRuMRBHQtlsUPZTIDYgxyEgX5SjOQZk8QUg9sDiQJC6cCSxLVBxZOAFxJtIdQjI0r0MEJ8jOwYUAstx6AGpk4ayWYD4HA5zv5HqGFCIlCBZAgOgeHcjQn8AEE/A4ZhfpDgEFLSghMiBxTGgxMpChBmzgdgHi7gWAySaiQbrGBA5AYZhgFhfPWbA7ugeIK4l1iGgKNiLJvYHiX0GiC2x6EtGYpsyQKITHTgC8X0g5iPGIaCcAEp0skhiGgyQqBGH8kMZIGWLLZQPEgdlfy0oH5QmQNm7AMoHZWl7BkiI3ABieWIcMp8BESWwsiGUATWquKDi8VCDQVF2AclhTAyY0QvKOaAyqR5J/ygYBcMLAAAKaUvDS2IbwwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.196.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAQCAYAAAB6Hg0eAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABBklEQVR4nGNgGAUjDIgC8Ts0sflA/B8JfwPi/UCsQ0+H9UEtRwcgx/lB2WxAnAXEt+jlKGsgLmfA7rBNQCyMxOcC4pf0cBQTEO8FYg4GTIexAPFrJHXmDJCoTEZT5wXEvxhQox0bJgmAQqoEykbXHIBm8H0g1sNiBshRHqRajA9IAvFdBkhoYXPYbCAOgrJB6ascKoYOSA4NQmAdA/7gfsgAiU4YAEXnN1o7zI0BkraQwR8ktjEQL0WTBxUTD7GYRTWHhQPxOSCWRRLTAOIfQCzOAAkZUDEBi0ZQTgQl+KdAnIPFPKqkMeRCMxIqFsqAGp1/GDAL1pNAHIvDTA8GGuTKUTBkAAD6HU/tnT/q2AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.197.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAASCAYAAACKN/pgAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAC+ElEQVR4nO1YUYSVQRQ+spJkX1ZWsqKnrCRWVpIsSVayYqWH7MO+JEkSK8lKL0mSpJcekrV6S7J6WWufl2TtU2LlSg9ZekjWWpft+5oz7ty5M/+du3fSQ/PxMf/cf858/zkzZ85ckYKCgoKCf4yn4JayDv4C58ETgXf3gPfAGrgBPgSHwNVMWqrsTzkad0TGD+nvG5n0hLAX/OH1vZSGD8l1cBE8nGGud+Cm8mzqwBnwkrZ3avsbeNR5Zx+4Al4Hd4lx6qSYD3jVpfBU+zf1+WBgfC/4BXwj8YDnwGPV4INBPa9t+vAq+LnLuW6DA9pmMDdTB86JcaiLUTGrg6CDlqV1hXAMP+5ip0o9pNp/q++NBmzMgmvg6S61VIFZy2YKH/RVn/O8G/ze5XzuwuQiWUkZ1AN+jBhb1zZ3yuvIeH7c/kSBMaTYp85P4AtpZBN3/B3wp/y93Um7C2Kyhx9Qaltz3hsWk3InM819DLwvrZsuiDHwSaCfwuwW55l6Jou0MFLsM509A6+AD5z+QTFplrs4tihygDvzlrb9gI5J8xnK1H8k07yX1SbripMpA7jizwX66ahlbbPI6OlAxFYFQ0ixT50MKgM3o33cLdwJfdJcB+TQ5II7Y1Xns7Z8bRe0zdQ4pX05NfA4Sir2vkrYmY/Au9pOPoy3iRT7Vic/bE776LRT2mbK680v7Q+YAaoCUJNmH7rHVU60DTxz83ygf0RM2rAO+gAeD7wXOyM6XYnt7FOnDSKrPgaPu3Fa+1isLEZsb1eTBY+CBa+v7rR5VZr1fud1pZZRgzs+Cq4iXgdu6DNTBVc7dyaLjwPOu+PSnMP7xZTvg4lC2qHKPnU+F3OdsbrpULcCfy+N8y0nmN5ZMA44fYfEpL5+nZvXFZtuWdlyEfLKdy2zlsprC4X4K4QpgmXxtArzMSEm0DTKszXpgO4AIfvDnkZ7RjL90qEj3u8TGfW4fxbYece9+erS6sMlMYVMDiw5tumX0HWtoKCgoKCgoOD/xm9XBuWUUbinJwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.198.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAWCAYAAACYPi8fAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwklEQVR4nGNgGAWjYBSMgqEB/hOJhx0Ylp4iBlDF45MYEEnjDxB/AeLdQGyNR48oEL+jgt0gczYB8S8o9iBCD3IyFgTiHVC9e6HmkQQWA3EklM0GZT8FYgMc6vsYqBPqlUAsC2WDPP2LCD3I9tYDsR4QMwFxFxCvIdUBW4BYEk3MiwESG+gAlBLKGajjcSYkNijALxGhB9neaCQ2HxD/IMVyFiA+h8NR37CIgZIUBwN1CxhTIG5mwAx8bACfvSRlvwAgnoBFHORJ9KQHiukSIhxACoiFmvUQiG2JUI/LXlB+7yPF4tlA7INFXAuILyDxQbFxlwES27gcQEmdCsrjhJIqPnNAAShPhD1w8JgBktzRQQ8Q1yLx1zHQvoHwH42NbgcuO0GpM54Ui0B5azcWcUcgvs8AKTBAwI0BkreRwR8s+ihtRf3HQaPLY3Mv0QAUSguBuADKB5Wq9gyQmL7BgEg24QyQwk8WSa8GAyRZipNiIQGAqzpDTwXoAOYGHSCeT8gSJgbMGAGV4KDqBFQ3ckHVzUeSh9XzoWj6uBjIByeRzAF52guLGnypZjma/FwK3DIowbDtdBADRqzHR8EoIBIAABZlg9awnrLlAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.199.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAWCAYAAACYPi8fAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABqUlEQVR4nGNgGAWjYBSMgqEB/hOJhx0Ylp4iBlDF4/MZUJPHNyDeD8Q6UPnZaPI/oPKyFNorCMQ7gPgXEO8FYlEi9SEnY3LNgAOQ5/2gbDYgzgLiW0jyy4E4FspmAeJqID5KqiVooB6I9YCYCYi7gHgNkfqQY5tcM+BgExALI/G5gPglmrw8mp5fpFqCBqKR2HwMkJREDED2OLlmgAEoBl9D2aCQM2eAJOVkJPn7aHrsgfgCKZYQAd4RqQ5f/ibWDDAIYEDNwyBP6qHJ72aABAAoYHyA+CkQe5BiCQEAyqt9RKrF5XFSzAADUOEVBGWD8nc5VAxZfgMQP2SAJCVQIWKJw0Hk1qeg8gM9K2ED+Mwi1gw4AHmIBYkPitVvSHxQ7PKRYiCJAGRfPBZxbIGGy+O4zMAJjIF4KZoYqBp7CGWbMkDyOzGA3Bh3xGEWMo0uTowZOAEolEDVGCyZg0pyUIEGiuEcqPxyKJtWQBxK60Ddgg38x8EmxQwU8IcBs+FykgGSV1jQ5AKIMZBEsBzNjrk41OFLOcSaMWTBsO10EANGrMdHwSggEgAAWU+BI+fLgk8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.200.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAUCAYAAADRA14pAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACAklEQVR4nO1WQUREURS9kjGSSJIxErNIWkVaJMlskpEWkSRpMftZJFol7dKiRdImSVq0yazSJiPtk6RFmxZJ0qZFq5Gh7nH/5/038968F2OkfzjMv+/e++797/7zhihGjH+DJeY1s8x8Y05q67vMbwPrwcWnFrqZH4a1duYm85mk5m3mMPOpXtIukkavmKPMlsB2whzSfGFbU54z1NiGdwyxKeY9s8BMktScD3yP6yUtUbSJEHi7t5qtyEwzEyRTAJQdCv9Nw2NBXXosmrtjTmn2VOA7b0uKsT2wrKvNtDIvgt+LzDN7vRH4NoymcBDJGrE4yVPLPmlbYgSOG9Zwwur3MEPR73bdWnJ1IT7Aya4aYi+pWl+cgbFMGNZmSYQqBCYBJ9tJcvLTHvv4NIzRxItOGmKxd6tHvggqljWcfkZ5fiVpFvhkdnjs49Nwkey3wJdHriqYJB8js6E8j5AouYosiXi4wLVh7FvSbPqh3JDcJjryLhscMnMkIgFOMM+Z+4oP7JD6FeUZMe/k/h27NAx1xa3Qq9gGSEa4R7HNkdy9ofZgDdfXoEshULSHoCAkhiDkNJ8Kmf9w9BvymvxNY3qk2BeUxlT/NsV/mflIMt6YMpPw1gQUMesT8FcBpQsF4oXkGoAQQbW3mHvNK62x6CNpFqOBscaIF5paUYwYMWIE+AEPuoJelUVCHgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.201.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAeklEQVR4nGNgGFZgEhD/x4GJAouBuByJr0SK5nVALA3EbED8HCr2gxiNLEC8DcqOBuI1xNoIAn4MqP6sJUXzbKiNggwQp/qQovkpVCMIfAJiPmI1mgLxQTQxRyC+QEgjExAvBOIiJL4XEL9kIMLffxhwJw414hw+6AEAScUhKtagkp8AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.202.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAUCAYAAACXtf2DAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABIklEQVR4nGNgGAUUgFggPgjEP4D4ORC7oclPAuL/ODBeIAw1eD8QWwIxE1RsMRAboKkFiZUg8ZWIsWAvEJdjERcF4nNoYuuAWBqI2RggvgSBH/gMBwXDbDzyyJpZgHgblB0NxGvwGQwDy4HYFoccyAd3kfh+DKjhXkuMBSBvsuGQC2KARCwMgHwKcrkgA8RnPsRY8AePHMh3Skj8p1DDQeATEPMRY8E7HOKguKlH4psyQFIaMnAE4guELJgLxF4MkKQJwvZAvAWIpyGpAYkvBOIiJD5Iz0sGIuIBlOSuMEAiDRSuu6GakcEfBtwZTI2QBSAAygOOxCgkFYDS9TqoSx4zQHIoKOJAqaoDiKdQyyJ5qOGgCAMFEyjI8qhl+CigPwAAKn1BGXEQ4n4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.203.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAALCAYAAACksgdhAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAuklEQVR4nJ2PMQqEMBBFvasWATstxNYmeAHrHMB0ljaCFxACwdpGK1NYCFH/YoqAuwm77IeB+Qxv5k8Ah7TWiKIIx3EYvywL0jQ1fXDLBTHG0Lat9XmeY5omP7RtGwghuK7L+HEcURSFnTuhsiwxDIP1cRxDKeWH5nlGkiTW932PqqoeSz+gLMts9vM8EYYh9n33Q1LKR/a6rsE5f0//hLquw7qudtg0jbnmhO7HKaVfSwjh/ukX/X3pBYxJ1ElZzGOQAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.204.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABi0lEQVR4nO2WMUvDQBiGP0oRkeImUkTcnQRxEBFxESkOLiIO4tBdXB1ExE1ExNVJHNzFzV8giJROLiIi/gOREoT4vtwHPc6kaWnsRbgHHvjSXnIvyX2XiAQCf8MybPgOYfMMY98hXEKgLEKgLEKgTlTEBKpkjLvQcfQbfsJ7uJByzSP4BlvwBM7Cl24CxZZZXMMtrYe0/oAz1pgqbMJdOAxLsK7Xv+omUC/c6YQ2NXirNSfnrr/qjKlqoM08w5ThU8LvDPGlNe/ETcr5DDSRZ6B1eJ4SKNKaa2olz0k7cQnXEn6flvbLmQu4PKhA7ymTncIDraOE/7smztBmTszjcOGnyysc1eNHOJ8wrt5PUBeuEbbrnh6z3ZfE3Bl+ukxZYzfE7D2LejwOz8Q81tzCuHeOHcV95hCOJJyzo0H5+BpWuP/JmJhNLVLdDW3g7MNJrRmmry7Jg5JVc7E2fQVxYVsfy+/3lBe2xXSP3a6FgGuo5TuES6G+HEmhAhWi7R+k/UpgmJrfOIFAb/wA0T5Y2pEM+RoAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.205.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAASCAYAAADYFMcrAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABJUlEQVR4nGNgGAUjCEwC4v9Q/AeIvwDxbiC2xqKWB4gbgfghEP8A4i4gNgbiuwTs+E+JAxcDcSSUzQZlPwViAyQ1kkB8CYjzgJgDiJmAOBlq8UJaOm4L1HJk4AXEm6BskEMuALEHmhpJqMXhtHIcCxCfwyIOctA3KBsUQsvxWCxNwA6yHRcAxBOwiIMc9wvKBqVBN3ItYKDAcbOB2AeLuBYDJCpBAJT4Wci1gIECxz3GYXEPENdC2b+wyJMCyHKcKQMkytCBIxDfB2I+KP8MEFtiUZdMpD0kOw6UpkBFQAGUDypC7BkgIXYDiOWR1IYyQMo2WyhfHIj7GCBRT3XHMTEgCl4YBuVMUDlWD8RcWPTEQx0NiuILSA7F5RhCeBSMglGACwAAg2dETyDjOPEAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.206.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAUCAYAAADhj08IAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABOklEQVR4nGNgGAUjAMQC8UEg/gHEz4HYDU1+EhD/x4EJAWLUYABhqIP2A7ElEDNBxRYDsQGaWpBYORJfiZYO24tmGQyIAvE5NLF1QCwNxGwMkFAFgR+0cBgoumbjkUe2lAWIt0HZ0UC8hgR7SHbYciC2xSEHCrG7SHw/BtR0VUtLh4Gigw2HXBADJMHDAChkQSElyAAJSR9aOuwPHjlQaCoh8Z9CHQUCn4CYjwR7SHbYOxzioLRXj8Q3ZYDkXGTgCMQXiLSHZIfNBWIvBkgRAcL2QLwFiKchqQGJLwTiIiQ+SM9LBuLTGckOA2X9K1CNoHSzG2opMvjDgLtgVcPjEEKYIACVYY5Ee4UOAFQugQpMkOsfA3EJAyRBg3JpBxBPGTinQYA8A8RRoIQMik5Q1OYNqItGwSigAQAA68hTChn4VzYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.207.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAUCAYAAAAUccS4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABVElEQVR4nGNgGAWjAC+IBeKDQPwDiJ8DsRuafBcQ/8eBKQGOQHyBWMXCUEfuB2JLIGaCii0GYgM0tSCxciS+EgPljr1Bihl70RwAA6JAfA5NbB0QSwMxGwMk9EHgBxkORAdEORYU1bPxyCM7hAWIt0HZ0UC8hjx3YQVEOXY5ENvikAOF7F0kvh8DajqtpcR1aIAox4Kikg2HXBAQT0Lig2IAFKKCDJAQ9yFgOSmZkSjH/sEjBwp1JST+U6hDQeATEPMRYwGRgCjHvsMhDkrL9Uh8UwZIiYEM8BU5NAnZuUDsxQAprkDYHoi3APE0JDUg8YVAXITEB+l5yUCddMsDdSwPIYWgYugKVDEoHe6GOgQZ/GHAHUpqVHAsSZULqIx1pIKlNAWgchNUyIN89BiISxggmQZUOnQA8ZSBcxpuIM8AcSgos4CSAihZ5A2oi0bBKBiiAABT9lv82ZDzVQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.208.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB9UlEQVR4nO1WQUSEURAeWWt16JIkSXTqkESSlaRLspIVSYdO3ZJOsYcOXTt1SLqsdEj2lqRbVjp06JIOnSJZSRId18qyzee9X2/n//e9/l/Z4v/42Ddv/jczb2beLFGMGP8WS8xLZoX5wpz6JTsdzHchO2DWDJaZF8wBQycvdCpap8dlsJ1UYFBOM1u07JA5FD2OhtjWDkogyFn9O8lcYd4LnQKpRAAJ5gbzymWwyMwFyHHTN25/Q2FM2woK8JTUxXpoZb4G6PQK2YfNIMowb9mv2D4OCVQGLjNF/gCRjTdDb5RURS0LnUfx3QTz1mYUKR9vsIcMPri8DgFkbl3/lgFmqb6/EMhggM45qUBxCTPMZ+a0zSgek2SDvTnmzvd8d6KL1GWl9FoGmNf2SPuTI39lYX3CLJGqLFRD2mW4atlDdvuErGahDccOfTidMNbIUFnoIFttDjs+yOfaA3pzM+xhlrOKQmZe7DDzSOxjPJSM9QipngyNfWaG1I2BaNoz5l6UwwKwQOolNmdVP6kS69Q2MR688sTLiYcF2VrVMugUjHUodDPv6GtwookzUQ4KgDm8F7VsnurLtEr+AX9N9bPO3M9GcQQNPRnlw78O3I7X/E+knnA0MV6xLeZu81z7WeCfAYLDwESZomTXmupRjBgx/i0+AShAd0MmegwrAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.209.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAAmCAYAAABOHbeGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAHJUlEQVR4nO2bUYReRxTHj0+sqFVWVFRUqIiIqFBREVUfUbWqKlRFRR5CVFUeoqyKiopq5KGqKlRFRFWIilVRoaJW5aEvEVVVpQ9VFVVqVdRaYTt/M+ObnZ2ZO/feuXvP3e/8OL5757szc+6cmXNnzp1LJAiCIAiCIAiCIAiCIAiCEGes5H7fSkw5HG3AUSdByOYXJWt9KzHlcLQBR50EoRbSgfuHow046iQI2UgH7h+ONuCokyBkIx24fzjagKNOgpCNdOD+4WgDjjo1ZS1DhC2GGLV/ONqAo05N2Cr3IdREDN8/HG3AUacmbJX7EGowS9rws30rMsVwtAFHnZoijq2C7bR+TX5cyTYvbXtv2jWjixjDCSVLSlaUPFDyovf/J1Q2zjFrylxW8reSy0rONSyrD0rZoOSm2lI6PaHkayWrRl5qUdacktumnDum7Cpc/Zvkt7RpV9TzVyD9Kk3a+HuTNk9l2sqS3SfQOBiwh5y0t0hvaHy6gCJDZgdph/adksNKRibtCyUHvWuRtuCco+2aDqKvSDuyGSftpJKLDcsbKhw31b6r5ClzjIG62qKs80qeId2vLpG2exVuezTJX4LbtNEue5X8qeRxL906tLZtZcnuE2iUFeccju4eTYw3zeApuBBIxxPrnpd2U8ku0s7ogUlboWY8CqSh3OWG5Q0Zbo5t5BzDJj+2KOsN5xgOIae/uO1RN/+o4v8c3ibt3H27YLZ2PHB9acdGgbqDYOZx1znHAH2lkAIcuabkSeccTurTwHVYbn6eKMftRFi+f2OO0dliT87cun8mPWMr0RG5ktsWsU6cm78LnQBWOBe869vq9k/GNalBHctvl4OXTP6jpPuYZWzOdyv5gXTfDi0b9yv5MqAHZmt4GGOJiDbZ4fxnHdqq0aMEWY4NXvaKOT6t5ONClXMFHW7J/Np4SSg2cV3J85EycP1vzjkeBG4M572WdaMDYUaI+BrsgQ4xE7huyOS2RawT5+bvQqcTRq/fKdxHmuiGldJHFdekBnQqv501jU0Zy15Z9hwhqBkKz66QfoMmL19CuuAa+BDE3/YndG1LlmP7jLRzO0B65ratQ4Xq0OXGQ3Q4BDdTHQ7LyZgzOUY6uG/BzA4zNRuvfLll3ZZ9Sk6RnkWv0Pqlx2bQ9ebPnLZI1VWnLUvqZIEDiC3/6uoGZ7m74ppUW6TyYzZ20jkfeWX556G6znnlp3SBg7yb+N+nbj/L6n94shwhPQWtaliu1N2FvVPJIumXAqGlBAjFuSyYzbkvVhA0nTPH/9LGAGrdukM8S5PYHVfq7oTPaYtUJ67KX7df5OqUo1+dcuBYXMcT0y9Wl58/pAsmMFhlHI6UlXNe5wH3X+K/tlQ6NjTIQ9IxgVDgD2CQvkAbtzikmKNJfAgDEkupsZN20KRBYvuKupotuEsDdLg7FO54sXgF2uG8c45Yy5J3TeyVdG7dWBr48TX/JQ/0OBLR0WLtwM0GILctYnXl5u9Cpyr96pYzziw/1hap/C7PkV4+h8rKdaI5/2PVV+elSvEZ2wFzUSxIjoFzyhzjtXLoDWEIBM/tAMIAfJP0bPCyScMU/h3SS72bmWWWAk8ud2mADnctcB3ijhj0IyNw7rdocg9k0pH3rHOOPIgxhOJsuXVjW4cbvEVHWXDqRj2vGUlh7cDNBiCnLVKbanPbsrROLrE3fXXK2Wl+MRavBv5f837r5rd5jzr6zpk0u8qoOo+V6bLH/MJWuNdjibxtyNpojVnaTxTehIuMt5xzXJMzAOAAFp3z90lvHXlVyRmThhnPPlPHIvEEWzfQNmhEzJS+pY1vdR5R/Emzt2X9cIy/mjowe8RLBGsnODQ4rMco/gbbtcNQbVByhlgKhGysTm3f9F2n9fd4JXJdrA3q5IftHxp9/XatOo+V6YJ44n0jVQ/cNrTuE1izn3bO4e0vmGN4/3lH7NNpj5EbTj40PhoVr4ltMB4DCbNBePXUU6FvMEvKneZvFmgvdzYHx+Y/mHw7DNkGAj/nPmjwRHff7mGQ2DjBrCdYKmFwvU7a0dl9XLj+A3OMaTICl9jjktof1oZSn7vgfjA7RWf6g/SSDbFGOAUsE9vul2pDKBbqPiF9OwzVBiVp8+mRsMVAPAbLHyxhsNv4UOJaODcMeAx8vC1EMB0DDDM8LIMQ38EeGyyf4DDPhotpTcnPXQDaAE4N02ssR7E0PZPM0S1oW7TfvCdoeziwkB0+pGHboAS43z4+PRKYguXLLnOMQcN9k2jJz12EZnC0QZNPl4QtCmI0iLMhIIknXtXWAk6kPncRNgfONsj5dEkQWFH1uYvQPZxtkPPpkiCwJfW5i7A5cLRBzqdLgsAaeUXeP5xsUPXpkSAMAk6DalrhZANuexIFoTZcthpMM5xskPPpkSCwpOTnLkIzONog99MjQRAEQRAEQRAEQRAEQRCEqeV/OQE/vjZ9emcAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.210.jpeg": "data:image/jpeg;base64,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",
                "2018年高考文科数学试题-HTML.211.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAUCAYAAABiS3YzAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAkUlEQVR4nGNgGAWDDQQAsTE1DdQCYiUg3gvETNQ0GAQyqG2gHhAfZ4C4mKrAD4h9qGVYPAMkomIZCISpIxBfA2JJID4KxN+AOBmI1YD4HBD/AGIPJPUsxNj+AYj/A3E0ELMBsQsQf2KARAYb1MBfxHoFBpighiIDQnyiwNAwVBCqSZAAX5gUQ/8jYWL4owATAAB5gyTH746IkAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.212.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAAASCAYAAAC5BXAFAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADJ0lEQVR4nO2av2tUQRDHhyBWQRARCxFBJEUINhbWBxYhpBAhhYhYCEFCKpsQRCzsRCwsBJEQLEQQ/wAbCwliYyFW/gMSbEQsgohwzvB2ub11f+++l+xmPvAlL+/N7cx359jb9+4AGIZhGIZhGIZhsllC/UGNxd9FR+xx1FsR9w51cqC8xAj1OSNfH+Ptt4eUflxCvRevSaVG3y5C/fjitsU10k5mTSn1qdCcfM8ZRw1YBPcb5j7qAmoG9RD1JqDAEnmJr9AZCmE5ICZmPBv77SG2H5dFDSuoo4F1mKjNt49QP664OdQ31LHMWnLqU6GFU5/zqHH0F7saeF05pgn4HVBgibwxMX3Ehb5+aA8x/TiB+gj5n65ETb5TctpqcMXRbuFaZh02Yud7HbVpiNuD6Q+EXyWTqvzQ/t9AHdHOzaJuF8o7xMJQmwcVvR8q91AvULtg3ka25rsPP7Y42i38he526QF0i3BJYuZ7HvXSEncF9VQc065xvVRSFbrPe6ydO4PagklDqBG0kp4qlHeIhaE2DxJTP1ToTTsSx6ZtZGu++/Dji6NP41Xo7u3nLWOkEFof5X8NnVdb3B3UJ9StUkl1bqDOGs5TQ55B1zBbI1LzDnUrUZMHia0fEn0hsC2KLfku7Sc0bg31wXB+DiYPJ22incdMYt67MD0XpjhaRGnXQIuD87YypclU+E3HdVotf6JOF85rilkG/2STTE9gfVuyGjwQvn7E1Nqa75J+YnzveeqKIaY+kySPUAvimG6pnA9tU5o8clyjbcxz1EWY3sqVyDvUjqEmD4SrH7bxTOO35ru0n9A4yvPFcL7vHYOvXvUh7Sx4HtrGfhUit2O08mxr12Qj5BaFtjW2hsTmpbHHMLl/chEycbbxavJAuPqh4qu1Nd99+HHFnVfy0kPeq+7yo0j5upLQ5zJqHBkwFn+XlGv6j1JewfTqtqVdfwL/38edg+5JbU5e0PL6CI0xjVeTB1c/9PyuWolWfEv68OOK2xGxpJUADzHEzrdEn0vfe6B5YrajB5UWPKRwWH0zAxDy67mDTgseUjisvhmGYRiGYRiGYWrkH1dgyONhfI7eAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.213.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAATCAYAAAB/TkaLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAiElEQVR4nGNgGAUUgAAgNqamgVpArATEe4GYiZoGg0AGtQ3UA+LjDBAXUxX4AbEPtQyLZ4BEVCwDlcOUhRhFjkB8DYjlgfgkEH9jgESEDhBfgPJrSbX5AxD/B+IgqCvMoQZFQ/kqQPyDVEOZoIYiA0J8ogDVDRWEahIkwBcmxdD/SJgY/ijABAB91SHLYj/ABAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.214.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAASCAYAAABM8m7ZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAqElEQVR4nGNgGAUDBLyA+BcQ/4fSHkToEQXil5Sag6zIA8onBHZALaDIHHQD0PnoIAeIK7Go+wbEbEj8T9S0WAuIl+JQFwDE06DsUKgDqWIxyDergJgHj7oiID4DxMmELCXF4mogliegro8B4muQ5aLUsvg/DgwDPUCsA2VnAPEaallMSN8PJDYPGh8rICc7YbOYZHNgimAZ3wtJ7gIJFuMzZxSMAtoCAPmyQp4QSXINAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.215.png": "data:image/png;base64,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",
                "2018年高考文科数学试题-HTML.216.png": "data:image/png;base64,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",
                "2018年高考文科数学试题-HTML.217.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAXCAYAAABeUE64AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAEEUlEQVR4nO2aQUhVQRSGDxKuJBCRiBAhxIVEmwgX0UJoIRIRgYsIcRGEhKs2ISEt3EaLFkFESIs2ERHRwk1ISEQQIS6ibYuIdhEhEoLN78z1jeedmTlz3zVL5oPDe3fu3DP/m3PuuXNHiQqFQqFQKBQKhUKhUNg/Lho7td8iCoW/xYix48ZeG+vqxNGAc1IxYey3sS33Oa7w0W/sO2ur4yeF1if0vHR9pH6LzgdsxbW9MnasAY2pscGosTfufEpX0/BYjXpj+pbjo0Krn+dcLjPsOCt2Q8beGTvttfmBGqf2wEgsUftE1fGTQutzjuzESv2GjX01dphdM2ZslWwl6YTY2OCcsc/GJo11K3Q1DY/VrLFepuNjpo/qOo1+KedyOOmu9+Okjh0eD6g2R1g7/zGpux6TNif0W6fdQf2ZEqRAq81/9EHDmneManQ5cN2gseV60lRj95ENWL9wXUxXU0ixOsT63HJ9cnwAjf5QzuVywdh51qaK3RTZH8jJSXqssZ4E+uGF4777jqo2mxKkIPeGRDVZMHbUHaMabZKtCmjvE665TXZuODepPUF6qP1RGxobzBt7bOwb7X5qaXR1SixWPqtOT44PrX4p51ClP5Gdp7dki+VVaj1xNqg1T9Nk8wp+pDV9KHY7YN0pPWK0iYUq9pRs4EP9bhj7QPZHNEFO0k+581+MnWXnoP0a2XXpCDt3xthzwR+WLI+olfj43ahuUtUKjY2kGHPfpaVPTFcnaGIFhp3Guj5S+qWc++F8XXHXY/mHVcGMO+bzxAuPTyh2O/wi+W7RJhbu2MFEv7tkqz0SX3qk55Jb6QEmbSNw7jrZ6uKDiQ4txZD4D8iugUMJHxubJ3lIv6QLDJP80ukbKi6PqyZWVb/Q0kbrA4T0SznXJfiqE2cQi902m4F27YChSa+4Y+yE+4679hm7foniwVvsQFvqOp91oS320o0Khuqk3S3YCnyvo6suqVhVYDkRWtpofVRI+uvmnDbOILphgjuiW2hvKrH8CtdD4WqbQ9NJj0flGmtD5QlVC/yOh2T/OOIvdbRja/VLukDdSh/TVIFdldDSRuujIqS/bs5p4xyL3TYvyK6BOHW3Gv+lLUsf3m/IfSKB8VJ5ifXHlthLwU+V8NUyDY/6VOLzsWP6U7qaREoiLF/mO/Ch0S/lXK/z1Zs41rzch2K3A7aXFoT2Khhb7nPCOxerBHwSYn7qotX2nlqVj/dbcX1hk8IY2KWZFtrvUfsaHvvCfA5jY8f0p3Q1Sc7SJhRz7kOjX8o5vlRKHccIxW4Xy9S6Qws2qZf3W8QBZ69yTh07PKJxhzfxLwL/O9ha5H/pKzTPXuRcduxwh7xqUMD/CnaTBpK9Ck3QdM6V2BUKhUKhUCgUCgeYP+BIcxw8jXyXAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.218.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAtUlEQVR4nGNgGAUjHAgC8Q4g/gXEe4FYdKAcUg/EekDMBMRdQLxmoBwSjcTmA+IfhDT8h2KQRjYgXgrE92ngsHfEKNIC4uNAXMAAiVtqA5CZfcQqBrnYAI/8fzyYEIgFYnliHAGKkodA7EWMYhIBKLHGE6vYBYibgbgWjxpyQ8SRWEeAgB8QBzBAslgJKRoJAHEorQPE8wkpvgHE0gyQLHYNiKup5IjlDKihNpdK5o6CUUB/AABg4CiUCnZRVQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.219.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAQCAYAAAD0xERiAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAyUlEQVR4nGNgGLEgB4j/A/EfIGbCocYYKv+DGAOLoAYqYZHjA+L7QLwOj2UoYAMQXwBiLyxyS4H4NRC7EGMQCxDfAOLZQByJJpcMxNVA/IlYV/kB8RQgzgDiDiRxLQaI18KBeDkxBjFAXeQH1bQYKsYBxPuBWBgqhu5inOAxA8SrHkC8BckCeygbFF58xBhkimSALFQjyBX1UDFrqAsJAlCATgPiPCQ+KC1tQuJvA+ISQgaBAvc/EoaFCcjL4kDsiCYfT4zrhikAAC+RKdTCgp+DAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.220.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABKUlEQVR4nGNgGAVDCMgC8V4kviAQ7wDiX1BxUQL6canfAsTSxDpCBYiPA7Epklg9EOsBMRMQdwHxGgJm4FLvCMQXgFiJkCNAGg8CsTiaeDQSmw+IfxAwB596eSDeT8ghsUBcTUgRELwjQg0+9fVQu3CCTQyoUYINgOK/jwRHYFNvDcTr8Gn6wgCJHnwA5BN5EhyCTT0bEH/Cp+kPAUNBjownwRH41P/CpxHkSjY88o4kOAKfeiYGAiGygQESf9gALCfpAPF8IhyBTz0oa2/CpzkSiJuxiC8H4v9IeC6S3BUg3k2CehAoZyAiikF5XIWQIiTAAcQvSVAvzkBEOQICoBR+Dog9iDS4hAF3dKIDWwZIqU2wZIUBkKu3EKuYBACqf2RpYO4oGCEAABWVNrtmHRBrAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.221.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAUCAYAAAD7s6+GAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABNElEQVR4nGNgGAWjAA5kgXgvEl8QiHcA8S+ouCiF5uMybwsQSxNriAoQHwdiUySxeiDWA2ImIO4C4jUUOhSXeY5AfAGIlQgZANJ4EIjF0cSjkdh8QPyDQofiM08eiPcTMiAWiKuJsOgdae4i2bx6qFtwgk0MqFGODYDSVx8FjiLGPGsgXodP0xcGSPTjAyCfypPvLqLMYwPiT/g0/SFgKMgT8QTU/MeDSTHvFz5LQL5gwyPvSMCRpAJc5jExEAjRDQyQ9IENwEoCHSCeT567iDYPVHRtwqc5EoibsYgvZ0CNwrlIcleAeDeJjsRnHgiUMxBOYuAyTIUESzmA+CUJ6gkBcQYiylEQAOXAc0DsQaTBJQy4kwupwJYBUisSrJlgAOSrLVSynBQAqv9lB8DeUTAKqAIA3hk9tLinR2IAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.222.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAQCAYAAAAFzx/vAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABNElEQVR4nGNgGAV0AvOB+D8S/gbE+4FYB4jLoWJ/gJgJh35jqPwPUi31g7LZgDgLiG9B+UVQS5Ww6OMD4vtAvA6Pg7CCTUAsjMTnAuKXUPYGIL4AxF5Y9C0F4tdA7EKKZSxQTQxQV5ozQII0GSp3A4hnA3Ekmj6QfDUQf2Ig0XcBDKhxCAoiPagcKJinAHEGEHcg6dFigARjOBAvJ8UyEAC5PgjKBsVfOVQMJucHNXgxVIyDARICwlAxdJ8TBA8ZIEEHA6Dg+QZlP4bKeQDxFiRH2EPZoKjgI8UyUJJeiiamA3WEKZIlslDDQb6ph4pZM0B8SjQA+QSUHWDBCUqZoITwFIhzgXgaEOchqQXltU1I/G1AXEKKhSAD0DP8SSBuQBOHxREoeMWB2BFNPp4US0cBRQAAEnRIdPkl8ZIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.223.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAmCAYAAABzhkOMAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABgElEQVR4nO2WIUsEQRiGB4MYDsEgIgZBDCIidoMcGERELAY5Dv+BGGwiBpuI+AfEJBYxGSwiBrGaxCLiHzhMcljO92M2rOF2vpWde8X5Hni4Pfh25v3YmZ11zjAMIy51+MQOweIFdtghmFjzqWLNp4o1nyI155uvsYMw6OTsBfZRxQ7BRN28FJ5k16/wLkqc4vnFBuyH5/AtUK8ZU8U6vMqu5+G99sYKmYaPcBsOBWorbX4RXuf+bxQM2M0qaME5RV2lzU85v9yFBTiqvTEwecg8stzf4fIvxutWr0LO3w/YB5cK6mI+eVl9B3BPUVvpkx+An3BFe0MEVuEavIQ7gdpQY6U+quSJt+GkpjgCci6PwUH4DHcD9aHmS63ICbilKfxPPDj/dj2KOIccWzfwC97C4YhzlULe8PuR55DxZ53fWofO7+lkaOSuZU+3WUH+Ai12ABay/4/ZIVg04Tg7BAN54W2yQ7CoswOwGMl+Z+AZM0ivuXA/PzdPuXEMw0iJb64WZ11OfKcNAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.224.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAmCAYAAABnE91tAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABjUlEQVR4nO2WsUoDQRCGB4tgEYQUImIhiIWIiL2FBCxERGwsJIhvIBZ2IhZ2IuILiJXYiJWFjYiF2FqJjYgvEKwk2MR/2BPPQG4Xdi8zynzwkQ0ssz/D7t4SGYZhGJ3U4aN0CM08w7Z0CO1YgzxYgzxYgzxYgzxYgzxYgwqokmtQVTqIVto5e4U9Tj3Y4zSAoAbxpONs/AJvS4sTx/cRbMAKPIOvCWp6WYWX2XgW3kUuWiaT8AFuwVqCekENmodXuf9rBcW62UuacCZRraDsE+SOFjMHhxMt7Gtm0Zxuzeej9QYXI9btnO+F3x7vsA8uFMzTsIN4t+/D3UT1grL3ww+4lGjRMlmGK/ACbkfWCn6c8s5pwfHIBcuG3y0jcAA+wZ3IesEnYAxuRi72L7kn9zU4FM7Bn+tr+Alv4KBsnB/4y7UnHYJchmlyR/2A3P1i5Gjkxny/tKSC/BWa0gE0w/fRkXQIzazDUekQWuFLekM6hGbq0gE0M5T9TsFTySAaOaffz/4T2TiGYRhyfAE/dWlb9/q25AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.225.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAAUCAYAAABRcGk6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAACyElEQVR4nO2YT4RXURTHj5HRIkOLjGQMGUmSNq2SDC1+krTJSNK2VZJokfwWs0lGWkUyWqVNRsZIJGMWo11aJZG0SLskSUb8Ot+595rXfeece1/z3vzE/fD1e+++e9/7nvv//ogKhUKh8B/zgLXG2qY8n2C97PD7O1nPvQd8Z5dPX2LtySgf+0vF86+c9O8d+N+eT8/1uSVcUNKnWK9YRzr8dp91iDXCus164tOnWW9Ye42ymj8tns1Qbbyevwc5PreMy0IaKnaFNd7xt89XrsdYvyr3k6xlpZzlT4pnswyMe8un+KK7/vpDk4IJdrDuk+vFA69n/v6G4gNCA4yyHrE+tuQFfI3u+ySPMM2fFk+KA6zXxnOrIS2fNc6yFvz1UXK9sQ1mvAH0bARyk9z6skj6lIqgMaVdIbfGtQXedSdKQ6wLQl7NnxZPihf+WxqphtR81jhBbmENnDM+qEniMese6wv9HcgPctOXBkbO4aTrZqABJqM0jPrvQl7NnxZPTNN6SjWk5rPGfnJTKjjO2p1TKAEq4htr3v+OVp79Nsoh3ydyOzmJppUUvFxUnq0JaZI/Kx6LnM1KqiGB5LMG5n6Yg9meka9JJaJDhFGO3WK1YdC7tIrA7DBLbtpqi2klfYTkni75s+KJaXtEaj5rbGf9ZJ3KyZzJHOuSv8Z6d5U2NgZPSZ+aTrPOkKusay34CDvPg6yH0TMcTRaFMpI/Kx4JDI735HbLKbTjR8pnDbQ4tuZTOZkzeUsbaxKm7s+sff4ea/CsUOYduQPwmC8v7RybgDWtOhrmo+fXSZ5yJX9WPBK3yDV4DqHxwh8C8WjXfNbAHN7F+cgCR5w2O05Txsk+Zg3bXyDlc51VcrvDuc7t1EHvxhbeWpO74hi5I461CRmmv0COz3WwU+13bkcHvW0pmat98P/rREa+YfkL5PosFAqFQqFQ4Q9SgMEgn4+y2AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.226.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAWCAYAAACR1Y9lAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACPElEQVR4nO2WMUibQRTHH0GkQxGKg5RSBMlQOohQOgUpgQ4hSOkiQYp0cBEHESkEEcmQpUOHDqVLxyIuIiWEIoiIg7gVh1JcRMRJBJFQpJRA/P+5C16Ol3z3xQgO3x9+kLy7d/fu7t27TyRRokSJ7qmKoAHqINWmzwvb/s+zPwXbdxdaW1XBk24cF8UsdkRpGwDHYENaNyIN9sHLbia8pbLgQPR4O+qHdcwrbavgHLx2bFzwLhiKH2PPNAx24jj0gUPwDUx5bTNgGdSk9TSnrd1Vw/IO9IvZoOM4gVj/z/b3kUQvpGRjCdIb8AXMgo+O/bmYdC2ANc+nInrK0ofpvAAehQbgaNLOSWXEZE0nZZz+keJJcrFc0HdreyBmNwetzT/pv9K+cF2AsdDJPfF6VJ3//ry+mDm10MFPxaRvzpmEi39lf/N+Dng+9Q4Tn4h+10P0TEzKip3/cYDP/5CBmX7NxfGp4KK4iyVrY2po94S72K/YeSJlsOLYBu3YIXoILsVkSy5gjJQEnCg7fQXzzn+eVMX5/xN8UHxZpTOKnVfgLVh3/Fi0ClHBWPHKXIEJz95ujFEnXlUsGg2H5l1gGvPJyHrt7z1/9i97NlZuPuJM8z9yU5XzSpC/wZYSFzeXHyVpz66NQRWV2HquHSUgTVqQPLkzpS8/AOYVuzbGkMR8R7sVH+xf0nqXNGlBMq3d1N8TU6k/BY4xLuYZi/1l1K24q9WIPnNgKaIPK22pQ7s/xqaEF7hEiRLdQ10DlqVowpKq0ngAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.227.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAAWCAYAAACR1Y9lAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACJElEQVR4nO2WQSiEQRTHXw5ykHLaJClJkqTkIElKkrS5SNsmuUiSJOUgOcjNYZOLg6OUJMlBSZuD3CRJUpKD5CJJkhTv35uvnWbn832zJOr71b9mn5nnfW/evBmiiIiIiD/KLeuDtWTYE8ruKU/Zy1j7vxadPzusUpcF+IAU64EyH+MxyjpmFarflawjVuP3YvwR2lgnrAqXRWusa1afYV9kDakxknDAin0zwJ+knJUOOxkfgN1sJSkHnQtWkRr3s6Yt673STrLyWaskSXMFPlJqfEXhP2BWxRZIO8mOgkvK7FgtSdAe2+RfsjUkJT3OKg4ZoEkva1ONm0mqJwzN2rovQRNKqvEMa0KNkakObd4zZZ9hHVRFfcjgbCDhekUlQq5DFT2FmXhDmV1AzZ+qsVnG7wH/DH66QgZno5qkZAGOUYnD2regCQ2UXSI4Gwh43rAja/k+frAbcyQVoYNybAoMU0BnfySpmk4HP3kUsKOYsMyaMuyDrDtWlWHfIjkPNuKsHtYGa1LZuklKf50koUEUsF7UOp0gP3Uk/cPXqf4YiGt/w67ZOh7OzJzFjs6Mixvd+ZyyOzN2Q0/QGWvP4geJfyW5q22YfjywUQM+a3Im/UUgfgwbv5Hke8s8XPxjDn5AjBzuURfQrPBSMs+QH3i9FBo2lLa+M4ck3XrB0U8LyZXm9DJyAVk0O7KNEZJzvUJSdn6g087m4GeX5N0dERHxD/kEoZFhJ3//HooAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.228.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAWCAYAAABT5cvhAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABgUlEQVR4nO2WsUrEQBRFBwuxEEEsxR+wEqxELASRRUREEAt/YLGSRRARKxv/QcTKRiwsxMYPsBMLkcVGLG38AJt4L5lIWLKZl5kxCfIOHJaEzexhdl82xiiKoijKP2QNfsPEvnaazXHS2t58TMcet5nae+/hrOB9ieO4DqStxKs3se7CUXgF34UfuASf4CWcjh1WcI1vJ5G2FvWJe/lNPcJ9OFkhLmMb9uEZnIgZNkBoJ3G1kqDeLzhXveuXEdiDb/DQERIy2qGdpKyVePdyVD5M+m8VQhe+mDSyLMR3I2N1kmGtxLt3BZ7Ck9y5KTgjvH4LPts1xmOGDVDUSTiuC8I1XK3Eu3cDbsIbeGDPHcMdx3WM5z3r3JTfwGM9ThR1rsNVeA3nI7R69/btwrzxvpp0AwnHx7WRd0b2SJHFZA+4+dHkeD0EdGbwV7kYodXVWxnJRsZgDH5GWKcbYY0/oa6N5IiW/ZIkLJvh97vG2YNHTUcIYOctvDDpeCuKoigt4Ac8jW6C0vu8mAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.229.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAuCAYAAABUDiUfAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADd0lEQVR4nO2bX4QXURTHj5Uka0mykrVkJcmKJMnKkiRJLytJel1JkkiSn+xb1tqnSFZ6SCQr6yeRpIf0kvSQ9JL0sNJLVpKsZTtf9/7s3WnOnfnduXdmZ7ofvnbmztw7Z+7cP+fe81uiSCQSifhgP+sR62fVhtSdE6w3rMOs9RXbUnvesvaU+Ly7rEXWOuH6AOtFYBs2sZ5pO/CsLTq9zdpWpOAlVk8h07rnrJA+RKqX7Av8/BZrmNR732I91umjrPes7a4FLxc2rXsupqThxV6x+kt4/hnjuI/1xzgfZL10LViqTKRP6+PPRR6QoJd1h1TrXNZ6qs+vC3ZAqACM6Q9YXzzZ0uFH4rxFcu+xIlXmGGtWHx8k1Wp8cIqUoWiB71g3SI2fcyR3712kuv8lUuOdT1DeVCIN7zubcm8mUmVidm8b56ct+SWl8ZB1m/WNlNEdfpF97EbrCTFR4sMOJtLQA5zcROmld5Lq3uAQa6tL4QlQWQusGf3XdMWWLPlw31fWMeF6tx/UtOeccG0xI69oSBoY2xb0A49m5M/7IvgondaOGdSsHLQEyc9FL5kgNST4ZFRI7yHPLXMD6zfruEuhApOscX2M8e8yqckHPKHV3d4EC4uTpD7AFU+2dLyG3ax7iWtwm+ZcCpUqE18HLsOQS6ECH2llfMIwMs/aoc8xJk+k5PlEypHu0/nTZvxuwbht9qCZxPWrtNL9P7Ce5y1Yqkw4rmn+YEjgfvn8eC7002o3ED30e97Mycp8TWrWnCxuV9eg1cJdso3RIRkh5YKZKyAMK9Lw8w/JysQM3ipulzNoGe3Mu8KA9fqAa+aNpPy7iAcusO5XbUTdQVO+SeVtLDQarDauVW1EU8CsicU9/CffGwf/LXBOpzPviuQC6+/5qo1oEk67I6T2Ow/4NKQJuIQtsPlxhFR4eK9fc+pNkRgQWmfupVYGUsSwVhSpzPHsW3IjRQxrhWtlYmO116MdtohhbXCJTp4ntZmLfcCxQHaZEcMyIpReKDs6mYe0iGHICKU3ikYnbeW6BLlAWsQQhIpQeqPM6GQepIhhVoRyTVA0Omkr16VlShHDUBFKr5QZnczCFjEMEaH0TpnRSRu2iGGICGUQ1lJ0svYkf59ZZXSy9uCXw8PGedXRyVqDCQY/BdlctSFNAf9tgQkg/rdFJBKJKP4CdPvUwHHyvUgAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.230.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAXCAYAAAD5oToGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACF0lEQVR4nO2XTygFQRzHf0kvBykHvZyUJElSTnLQK+klV0mSqyTJTdK7S3JS0stJSpKD5CI5uDq6OUoucpJc1u/XzPZ+u+3O252ZtUvzqW+7Mzt/vu83fx+Aw+FwOBzFZhY1lrcJR5AZ1BTqDDWas5d/yxHqG9WqUZdWzbgFD52oG+njFtVloc0kUD9voTyTeKiYlu168llNUmlRs7NlzXphaqhhVAtqB3Vuqd1m0GTwIvJ146GCD0ZVppuyptFRBdWuUS+KBfbegfqy1K6KVdQmRA+MTjyaEe4nqt8AFNxDELPEk7qWz31Z5hl1x+qsoC5RdRDbmW3e2bvKhy6DqBPWPicuHqakHpg5aaKMekRtg9hfKeAXsgydI/cWzCWBzps9lrbtowTi0uKv9nCA4uJhSuqBOUUdoF4heJBPoq5Yet7YWjIoKD0Z+tgKtR8OUFw8wngKxZVXpQPQYfsBYkuiZ4l9GwCxdRATqG5VQ4amuZ+lUF5SH0n7VJVRxcOUVANDP9SfjXQTmmbfaKmTOTKb6GpngUpEXtY+eIBU8Yiql9mK2YXGlXcdtQGNg64N9Qniz+RvUJbPIdQxy8/aBw+QKh6mpLouP0Fjv6Ut4wXVL9M0Q+na2mfJmAra1/mMq7NvWfvgA6OKhyn+YPh/MFWrUUkvZHOfT0tRfOTOA2oExLJ2PgoE3YBqeZuA4vhwOBwOh+PP8wN+p57kQQIO+wAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.231.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAmCAYAAAAFkDNCAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACdklEQVR4nO2bP0gcURDGBwmHhQRERCwkECRIEBFShStEkBAO20NCOGyDSAghjYRwvYhYCSKSKgRCCBYigohY2KYSO0sRG7EKIc1lht3F8/B2591uMoP3/eDj9t+9mXnMvn03b48IAAAAAAC0o5+1x/rDOmAN2roDrKmzJlg9rGXWd1t3gDWvm7Yfsn5bOQJ8cmXtAPCDzCdWrZ0AfqixHlk7AXwgk8p5ayeAH6atHQB+GIo/x1mfLR0B9nxlNZq0ZeuOC6Q4d2ntBPCDVG4b1k4AHyyylkiZEHLRWrx9xjoMNKYxkteGB0Ji8BTvU9aXeFuVEFXWj3i7zDoKNKgxkteGB0Ji8BJvifWN1RfvqxJihrXTtP8q0KjGSB4bjRT9T0Ji8BLvR7pdlFO1MUbRsCZMsYYV3wl1uhMbnZDmV95EConBQ7xp51OR4eSaoqrey6bjA6wRpVOd2hBkeH2e0b6HESKkn7zGq2qjl/WLNdtyXIabuYKMtLMh+y8oes49U7RjSUg/eY1XlRCSxfK+wGjL8QoVlxDtbCTIXVNWtFM0J6x95bUh/eQ1XlVCPGa9veO4NiHy2Eh4U5CdUORO1lbvQvrJa7ypHLMmWSttzheREFk2BFmA6ks53wmbFL1P+SDjug+UfaeG9JNVvIUgs+B6yvkFiqpb/9rGNkVrDdWctlqpFdROSD9ZxgsySBuyQZchQ/IGRaNE8pNt19QjYIo80yUZ5J2In6xPlD2fAPcYeR9inXVBNj/vgCOkBiBVwq34s2TrDrBG1g6ShSX5x1bF0BfgAKkBJIWfd6z3hAllV3NKN0u+sup4znpi5w4AAAAAwP3jL8PUvv4Dv8T5AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.232.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJwAAAAoCAYAAAAL45MuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADt0lEQVR4nO2bT4RVURzHf0YykhjJM5IhyUgSs8os8sgYSdokSVq0SYtktMkYSSLJSIsYeZLkkaRF0iZpkXYt0yZpkXZpldHm9fs655o7b96995xz77n3nLm/D19z3/13vnPPuefP79xDJAiCIAiCIAiCIAiCIAilGbDu6+1vrPcNerElZu+t5TTrpd6eZX1o0IstMXtvLcdYr1O/zzZlxIGYvbeWaVLNETjKmmzQiy0xe28t21l/WGOs+aFjO1l7andkTp53NLdHanckFDLO+ss6MeLYIutMvXasyPKO33Os56yZqhN9xPrH2lL1jR0IyYspqB1WWftGHDtOYRe4PO8Atdysj4TP+7ipIyF5MWEv60rGsdALXJ53cMlXwnmJ1k1IXvL4yDrMupdzTqgFzsR7l1Qfr3Jw0xVSNctA642PhPS9Q/FSFozubhScc5l1vcI0i56fKUXe4fsVq0eqWa0UvIHI4A7rM2uJ/PWhih5YnV5ipKoC1yh91kPWL/LUQUxR9MB8eRnkKCZi87sBjFIQh+npv1s9pGGa2XV4MSHPb50y8ROq98wXA9HlZGrjBalObpoZvQ8dyLHUvgND5yFouCsrkRR5b6itFwixoo4+Pq1/Z6UrNVwAYJSSDH2vshZofSd9Th+fItXUARSMJ6lzMKo07RjnPTAXLyiAD/T2blIjr81M9AXuC6kMBKghfrL2p47fJDU1c4rWwhXI+L7eRk33lDbWeFnkPTAXL12dPprf4RpxMxJ9gSsCBQsZ/IzW+lTzev82UhneH31pLV6QPr54uMg6WZMPwRP4cuC23n5MaiIXNQxqH2Q+MngHqbhZE14mtReAmFFW/y1kJlhvSU3nvSOzfnBIVOr/FqlmDP2mZVLxMOzrpP4iTrZQJpESXu6Q+ocBJsnHa/BRNQi+HiI1ALpLarAUE7H7dybW4PC51DZai9WmjDgSu/+gSMImeKjoM6Lv+N3yelt+O1yTlXYZ78k9bKnKf2vB6PsTqTDNRMG5w9hmGO6/bHlNHmW8g6b9txa8tS7xPdsMwxzyVOFZdrh6ByH4bx1ojn6QeYzPdUYDne4Ljh6zsPUOQvLfShDjwwh5KbXPdJ2CTQ3RtTFlyCjvwHStQtP+WwlijQg2Y7h/Te8zXadgmmHJXPBBUjHGqhjl3WatQtP+W8dXUvOzGO5j2m1R7zf9itckw/q0vtnq2dscSZb3BJO1Ck36F1KE+tm4Dd7WKgjVE3uB87ZWQfBD1esU6sTrWgVBEARBELzyH1tMNXDE3wfoAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.233.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAAoCAYAAAD66MijAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADzUlEQVR4nO2av2sWMRzGg0NxKIKIiIgUpIOIiCAOUkQKIiIiLiIixVUcxEEQEXmHbiLiPyBOIohIKR1cRBzETZzERcR/oIiIyItQvw9J8Jomd9+kl+Qt9/3AQ+9H3txzubtccn2UEgRBEARBEITJYCfpNWlMekPa7ezfb7ZPOiukfbVNDJ0R6QhpG+kB6WVj3yzpA+l4BV+xzJM+kQ7UNjJkrjaWd5D+mGXcXO9Ie4o7SmeG9DZHxWtGaKwp0jPSt47yj83y10RTaz16KuHHx6r5u0C6V9FX6nHQ0y4keOrkkNLd9C2lxwZtXCK9MstzSj+VsXAaieuplJ8m8PPILC8r/+utlK/U48w1ftc7eNKOMsqdVnoQZ7mScCzuxeN4KunHgid6xiz/UvpVV8tX6nHQ4/+MdsSs+DvpHKPsQaW7U3CKtJd5jLUWbcZTKT8W3DjXGut/K/tKPQ4YR5Rlg7t7kXTf2Y4u9ISzbZr0Q+lGPevs26X0FLkL7hPnevLV3+bH5z/Vj2XeWcfTPeUpV6qdUs8f5bP0TBdIF5We7t42286TzpBekI41ym4n/Tb7XTAQvcw4HqeRfJ589Yf8hPyn+gF2xnaY9NQsLyk9/nAp1U6p54/PHMuM+qP4ovRHLEx3P6uNMxPc3c3Gwh2NafGspy68kvpopJAnX/1tfoDrP8UPeK7Wv3KemO0Yoyx6ypdop67jgND531HrX9dFuO6s42PXzUBZbiOl4qu/zQ9w/ecA03H3YpZqp5TzRw+b5TtTGxgfTJvl90rPrB62lC95M3H8NP3nBDO7j0qPWUq1U+r5n1T6k0vRL+A3lB4PoDtHV4kZw4jxm7uZPdn6u/y4/nODp32F4Qv00U6p54//L3IG/4LQH6nfTgRh07TdfKJhaQNRhQVBEARBEISJoUY2OpTXDuWfa+W3Y30OmlrZ6JHy57V9+eea+e0Yn4OmZjY6lNcGM+r//6Vq57e5PgdPWzYa4mbOfb+PZdVZHxl/uTzaOmIJ+Rw8oWw0iMmcu8RepGZe22Lzz7k8gj59Dp5QNtrCzZy7xF6kZl7bYvPPuTyCPn0OnlA2GsRkzkHql303r91k3LPHnD4HTygbDbj5bh8xT7yb17bY/HOsR1AiV27JltPeaoSy0YCb7/bBvUi+vLbF5p9jPZbKlbs+B08oGx2T7/bBuUihvLbF5p9jPVpy58pdn4LyZ6ND5I78Wtz8c4xHS4lceZWc9iSD2YnNRndR4mby5Z9jPIISufIqOe2tgM1Gd5E7Pw5C+ecYjyVy5ZLTFgRBEIT++QcSP9boHtkpdgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.234.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAmCAYAAAB0xJ2ZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB6UlEQVR4nO2YTyhEQRzHf0mbg5QkSVKSJGnvDlIOkuQiSZurHCS5SNqDmyQnJW1OcpGT5CI5yM1RLpKD3OQkuTzfXzNbz7Z/5j3z3u9tbz71aZ/Z2dnf+5md+b0hcjgcDofDIYAH9/X1M7wRjEWEWXiur0fgrWAsIozDC9/f81KBSDFAauozo7BTMBYRmuEnbIATvvY22C0SUcw0wS84VdK+CefiDyd++D//DftK2ifJbgJa4RX8gdew3eLY/6IXrpRpt52APBwmlfAdeGZx7FDcwSzcrfC+7QQs+K5bSM26inha/lAGnsAXi8EwvPLnq7y/DDcMx/JCfP9HrQ6D8B6ukvr9JJmgCeD72TPpyFnKBgykklESdPwc7KnViaf+K6nfYhRUS5ZJIsMmmxfBRZMAuUTdhlu+tlrFST3MgDHTjtNwhtR2sa7bklqcmCagQ78OweNqHZ9gF6nt4pHUjTO2tyZbmCTglP7OyEKYL0pqAmIjygQckSpTGyMa3wpBipMw5CIcuy4o90yQGvhc4JDULCguVJeiEcUMry1887xVPZCqPxK9HtiGt6kD+E7qcDRVcHnKx2IF/ZqRDSd++DC0eDLMlWdUzx+JhQ9FlvQ1P36vUcoWQC63i4+nfEz+BvvlwnE4HGnjFzzPbbHLu8sXAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.235.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAmCAYAAAB9Lz3jAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB/ElEQVR4nO2ZTyhEQRzHf0mbg5SDJAclSZK2nLQHKUmSXCRpc5WDJDdpD26SnJS0OUlJcpBcJAe5OcpFcpCbnCSX5/tr3qu1bW9mdue9ea+dT33a573ZmZ8xf35vEDkcDofD4agTPLjnX7/AW4uxJIJZeO5f5+CdxVgSwRi8LPl53lYgSaGPxFRhRmCHxVgSQTP8gg1wosJznlLDsUZkmSb4DacqPON74/AUDsUZlE14ZPzAnpAyPEpyhtprhdfwF97ANkP1GqMbrkjKLBlsrwAHSfwhtuGZwbpr4h5m4Y6k3CiJdcYUCyXXLSRGZyieL38xA4/hq8GAAnhnKUjKLMMLWCQxbWR4VcTxqVKoHz7AVRJzLi3odgj/bruqhbnnspoNeCHGgW47edilUpCnyhuc1I1Ig7DOU1GlnjB4UV1UDZbT6S24WXZfliSlaYSM6lQ8DWdIbEnr/r00JEmqHdLufw7AI1nhZ9hJYkt6ghtlz00mSaZR6ZAT+j9yi7U2ajJJSj2mk6RyDkmk1I0RtmEM3SSpWvIR1p1KZO81dQVPxwMSoyRY9K6sRmSZORKdwdviI4k8KBXrSVTwlrgPPyi5W3tscCrNR4lF/zNjNxz78AFzcPrOGXKU71GpgA+KgqSPjx3WqM4XVH5NCF7F+V8T77DXXjgOh8NRHX+Mi3K7Og3WxAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.236.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAAAWCAYAAABud6qHAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABR0lEQVR4nGNgGAWjYBSMglEwCkbBKBgFwwX8B+IJUPZdIN5Phn5a20FN86nmllAgXgdlWwPxQRL1ExNwlNpBTfOp5hYXIN6CxI8kUT8xAUepHdQ0n2pu0WCAJFkQsAdiSSL0/MeDqWUHKYAU86nmFh4g/gDETEDsgSQuDMSyROgnJsXhsgMEQFnHkggzyDEfmx+o5hYOIP4GxD5o4tVAHE6EfmICDpcdIL4bEK8CYmMizCHVfGx+oJpbQCH/A4hV0MS9sFiKDRATcLjsgAFQTFujiV0B4t1EmI3PfGx+IMctWIESEOdhESc24CixAwYysIiBUsZLCs3H5gdy3IICjgKxARD34JCnRsARsgMEHBkg5Q46KGEgHPOk+IESt6AAUM1Sj0c+C4grCRlCBTs2APFcBkgWoYX5lSSopcQto2AUjIJRMGQBAB5QXhvhMXxDAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.237.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAAmCAYAAADAx/76AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAERklEQVR4nO2cT6QWURjGX8nVIpEkSS5JkuSSFkkSSZK0yZWk7ZUkiSRp0S5Jq0jSKpEkSdokLdIurdLmSoukTZIkV9zepzOjc6dzznfmz3e+z5znx+ObP+/MvDO+82/OY0QIIYQQQgghhBBCCBk+y1XPVHOq56qVo00nGuT5xbH9lph7Wew5bq2Y+xx3nqjWjDoJkheXVFtUi1RXVA9Gm040qMDmPfuOebavV71WbRtKRt2yW/VWtW7UiZB8OGotL1P9GlUiNTipOi/+yuCUYxsqu5eqVcNKaghMql6MOgmSL1+tZRS268XyrIT/mHViQ/gKeMkm1d1A7FLVTTG9g/lCT4v1C57rtc17UM5troOem6+nQ8jQwPuDa9b6YdXDYnmHmJbVR53YEKGCNaG6L6bA+2KnxRQe9ADeqC6KeX/wWNzDgy7yjqkMml5nh3UcIclAIZq01veIeZFVciRwbJ3YEKGChZbdzs8Ve091Q/VZTEEq+SFmqFCli7xjKoOm10EF+L12RoS0AAXleGXbRjFdWrBLtTpwfJ3YKvMBxcTZ9/BNdbv4nbD2/e4479ic214HzNWIJaQ1ux3b0B1HoUIh21fZt0LMNF1MLLrI2yPziGllfbEoZGXri1mR/dY+tK4T8j917jE2DxdNnw/i2TMgySjfsG9W3bG2L1H9VB1wHIMu+3RELNb3ihnrb43IpU1lcFU1UyyfVp0R8/IQPJKFw4aSOvcYm4eLps8H076PI85PIhlkrMnZiIIxtt3FvW3tQ6uEqcb1juPQ6k5HxgK0fq7CWKVNZfBO/r1TQLf8k2pDsY4x+mXHOercY2weLpo+n3Py//CNtCBkrKERxQ+u45qzB9WCEooFM4F9qcB0XrUw1rnHNjR5Puix0WfQMT5jDY0obl6ppsR0u32UBSUmFpXY0sD+VODZYboRY/Y699iGps9np5hGKrriL7t2+LPj5QjMGB8GxA/bYFEnp1SGjyqlsYZGFDezxTVCnBDjAhwUiziM1zH8ONxJdu1AxY/hVp17bEPT54NhbczLywXAkYUaBC9Mlg+ITWWwiM0pVT42trGGRhTSO9DSTUXEpTJYgJicUuZTYhtr+mZEqTv3TXoG/hgfZeGcqo9UBovYnFLlU1I11uRsRAnlSo2vgqB1wZTJxcp2l5EhlcHClZPr/F0YVWLyKakaa/pmRGn8JyL94KDqkJjpsrPFNp+RIZXBwpWT6/xdGFVi/+guYw2NKKQ3vBdjQsF0GQwX1TfjVSNDCoOFLyfX+bswqsQUOp+xhkYUkg1VI0Mqg0Xs+cfBqPJCaEQhPcc2MqQyWISwzz9ORpVJ6bERJSMGffswW6pGhlQGi9jzj5tRpddGlIzgF4EIIX8JDbkIIZng+/YhISQzfN8+JIRkhu/bh4SQjAh9+5AQkhG7xP/tQ0JIRoS+fUgIyYjQtw8JIYQQQgghhBBCsuIPVuMBOKFPMNgAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.238.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAAAmCAYAAABj5g1QAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABbElEQVR4nO2ZsUoDQRCGhyCp0oqlXbDIG1jYhlQ2YpXKJoUEsfcNxFIQSW1jKT6FWOYNgm1IIZLm8i+7B0c4b3f1kp25mw9+bhY2w8xkuB1uiRRFUdrLCFpDmXsOmfljQzGZoVtz8seGb6hbWK+Y+WPDOfTo7Avo2rM/q9mfKG6hD+gqYK+vULH+RPFAtgtMcoeevSGFivHHhqxChnto4OwJ9PoHH0VC/Inkp2D3ttZl+Doq1p8YYo9zX6EaOx7kyeQD4siz31eoWH8hNHaIrZvGdmndbHdxyMnbSrRQgUQXKmae4U5MLjvvqKpgUug/eVStS3+gHSUz372g40EguxhilX3zTPbfO0gdiATGqQOQwjR1ABIw35KeyHZVfmy/J42IKZdki3QEfUJ3pO+rUl7Ifvf+gk4Tx8KWDrSEZu7Zrd7eXs6gN2ebywEd8H7B3KRMnH1D9p5OX+QlzKFjZ59AC6ifLhxFURT5bABr1q2Sg+92vgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.239.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAWCAYAAABXEBvcAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABwklEQVR4nO2YP0vDQBiHX0RERAQHKUXETcRJcBIHKUgJDuLm5OTiJNJNxEFEcBAHB0FERESyODiIH8PRbyBdnV3i7+Xe2LQ2l0vSS6LcAz9y+dPmubeXy1Eih8PhcDgGxA3yhQyXLULVcVkXj0C2XtIHtm0bpaAKLtGiebKvZc+qTjqq4BIk7HcxjlyT+uUDyasdL71IwS46UhVwi5RwDXlDjsjeHJRUwCJddKQqoI9cIW1kxZaRiYhFl0CTuOt1+z8MIZ/IrWxH8prGyJjIF+FiinEBV5EXaT+Ren1HWZJjDVIdDI8t9FzHb6qpDGJ5XDhNUo87My/7cfe1MgLPkV1p7yMt6p60m3J+ltSjxXBH7yPX8FvzIO4GpiIZXbigl9KeRhYNPZIwXsa8ixDDv+AHMhc5f4zMIJvUWV5wR3xp80h8oN8jMg5dAbO4NOT+/Lj3jtg8hEULF9KZv5sLxcKP1JmTPDk+RqoDfv+PDpx+Lnz/NWQH2SjIw5g6cirtO2SZ1Ajg0cGdYeEJUuu2Mlzq4sI8U/z8VxonpB4bnncuSK3H+FgtsuV1WqsklzNkUs4fIqMFePxbyv7zweFw/B2+AS2PfH+rXX/SAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.240.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAUCAYAAADskT9PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABP0lEQVR4nGNgGAVDBIQC8XMg3oIkJgvEe4nQC9IjTYnllkB8Doh5gPghVEwFiI8DsSkR+h2B+AIQK5HrgMNA7ILEZwLig0AsToIZ8kC8nxzLw4H4FppYLBBXk2FWPVQv0WATEP+H4oVo4tiCHqa2EYg5gHgpEN9HkrcG4nWkOAAEpjBguvoLAyQasAFZqHwBEAuiybEB8SdSHfAYi0F/COgBRZkXDrlfpFgOCmZsCQfkCzYcevSAeC4DJATQARMDiSHQDMRZWMQ3MEDiExsIAOIgIF4DxH5YHLeJFAdcYcCe1SKhjkMHoKAHlQ+gKLvGACm8kEE5EMcTazkoMS3HI78fahmxQJyByHIA5AtQ/ILiEV/JBSpYQKWjBxFm2jJASk2iSkJQCXcXiO2JUAvy1RaCqhgYdjBAQnQUjAKsAABqFTZqRv3wTQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.241.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAUCAYAAAD2rd/BAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeUlEQVR4nGNgGAWjgCCQBeK9SHwvIP4FxP+htAcd3LAFiKWJUagCxMeB2BRJDNmRHlA+rYEjEF8AYiV8ipiA+CAQi6OJ/yfApxWQB+L9+BTEAnE1FnFyHYxNnSQQnwTib0A8F4hZgLgIiL8A8Q8gXgrEgkjq66Huwgo2MaAmBVo4eA0QdzBAYhPkmPtA/A6IdYCYA4iXA/FCJPXWQLwOlwVfoAbR0sGgUGRB4oPySzISnw+qBgbYgPgTLgv+EGkxPgf/x4PRHQxyDChpWKM58AuamTgz+SeoBkocTEgdKI3WQtl9QHwNiHcwQIpSkN0zGSBpGwaYGPCE8AYGVN/CALnFGjYHi0IdCDLjDAOkGAUVYR+gYqD0yoOkXo8BkrewgkggbsYiDnMkrOLwQpK7AsS7SXAwqaAciOPxKQCVeyokGAjK2S8pcREeAKoP8JbDIAAqrM8xEF/9ljBgT0aUAlsGSAmCt6aDAZDPttDAEaQAWEYcBaNg2AEAsV9beXo/c7wAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.242.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFsAAAAlCAYAAAAtHpUoAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACrUlEQVR4nO2YT4RVURzHf56MJyOSjGQMGUmSNq2SDC3GLEYiyUjaJUkSLZIk0aJFWkSLJEmbMTLGiJHMKm2SZIxIWiRtRpIk8fp+nfN6x5n759x7z9xb3u/D17v3/Lu/9zv/fueIKIqiKEr/MQa9btqIfmEZ6jRtRD+hzq4RdXaNqLNrRJ1dI+rsGoni7DPQZ2jevh+HvnhlhqFnAW3NQVtjGFWBzdBBaDe0N1Kbg2KcPVilkZPQS9vIR5s2A911yoxCLyTM8G7wv62KURG4LcbuVqT2Oo5KsUPMiN7ppdOxI/aZxi5CQwXaZd3nZY2KBJ29pWEb/jIrvZ6a8fKuO89cUi55+d16U9AA9Aj64JW5YuvGYAJ6Z3UU+mrT29B96Cf0Rsxsoo5BB6Cr0PpINlTmPHQtpww7JWn54GzgDDgHbUzI3yerO7EM7NC30C4xjnsKPbR5N6DDzvdm7XPL+/0n4IY4llPmu6QbvQLtScnjiP+WkN7JkA9HKfcRdwlbgI7Y509e/R9pf6Jp1okxLq/3f6ek05l0xERG3V8l7HK5A5123jmDaHM7x7Y8inR4FMalN+2y4OgcSEhnaMUl6HJKvZZUH9kMP9vOOyOkeed9JcvwSGTZG9xBN6FTAeWeiFkPfSahQ9A0dCEhnzFuSGdmwY2PewPjZm523Ay5R3Rn0y3orJiO5TlgoeL31gzGwpsCynFn9zdR3u3y4LIBWpLV0Qq5CJ2oYqAYB3Mp4kZLhz8WM7LHbT7PBtO2DCOV7RW/tyYwDn5QoDxj5tEC5Yek+Ti7cdj7XAPvSbETHjvnlfRGVBb7xYSETZ8gG4cnwfdiAv6icLTOBZRjHDxcon1FUeom5HpCiUje9YQSmazrCSUiIdcTSiTyrieUiORdTyiRCLmeUBRFUf4j/gCCS5oovcHFMAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.243.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABqklEQVR4nGNgGAWjYFiAHCB+DsTboPxYIH6JpkYWiPci8QWBeAcQ/4KKi0LFtwCxNJXc5QU1/z+U9iDHkEQgPgnEPED8ECq2DohnIqlRAeLjQGyKJFYPxHpAzATEXUC8BiruCMQXgFiJHMegAWRPeUD5JAENBkjMGaCJgzwjD2WDPHAQiMXR1EQjsfmA+AcSH6R3P6mOwQL+E+DjBZugGv5D2cigFYkNSq7VRJj3Do1fD9VLCaDIgyBQxIDqGWwA5HlTAmpA+bEPTcyaAZLUKQEUexBUqLgRUPOFAZJM8QFQTMmjibEB8Sc0sf94MDZAkQdZgPgbA2HH/yEgD9Ifj0OO5EIBDVDkQVCptIUIdaBYYMMj74hDnIlhgGOwB4iziFC3gQGSn7ABWMmqA8Tz0eRAVQh64UUqoKiaANVV6EU/NhAJxM1YxJczoMbAXDT5cgbcSZdYAPMUrKL3IlYjqEBYSoJFoDpNhQT14gzUqQdJBreAmIMBkpxIaWmAAuQcA3FNJVsGSEOBGi0ZkgGoRXKXAXfBgA+AYoWYQgnUPpUlw/xRMApGwRAEAA8yYqIceWJUAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.244.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAlCAYAAAAEGWqvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABhUlEQVR4nO2XPUsDQRCGByuRIFgEKxEsLERsUolVGhGxEsQiiK2kEP+B2ImFWAkWIYWFICJiIYL4H0QsxM7CwiZYBRHhfMeJMNEz3N6RzAXmgQd2Nxd4h739OCLHcfJAGd5Zh8jCI4ysQ2TFC7DGC7DGC7CkQFJAwTpIWiKlswifWq7CN9s4YVTgA5yGQ/AaHpsmCmACPsNRNXYDV2KejTpoxiGsqv4IbMJBmzjhvFJ72CN49c+zITPQ6dks/uEdTsEi3IF1uEWyqPsCDv0Bz0mKOCGZgQXLUCRrcNY4Q2qW4Dw8hSXjLN+bAm/LPMu3JLOcFJ6FuW6ECmEbzsABuAfPAv670ZVEgVRUe5hk00gCf/Dn8pLXUG3evnnX46LuSQ5Vhs+lC1ij+APVDF4P+6q/C5dbbX7XL3ueKJA1OK76L9R+SDUtQiWFF/H6r7FPiyBpKceMNWLGcsnPTZev63U1fgA3SWZnjOQWnDv4aqLf85r6jbdJPhf4kOMPqcmep3OcPuUL3rBm4nthpxgAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.245.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAlCAYAAACDBEHsAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADPUlEQVR4nO2aX4RXQRTHj58kWZGslawlK0kS6SFJliRJEvuQlfSWJEn0kCS9JEl6X+khkSQ/K5Gkp+xL0kMSSQ/pbWUlK/HrfM29mjtm5nfnzv0zW+fD197fzO/eOffcc+fMnN8SCYIgCIIgCGCK9bZrI4R0+MAadG2EkBYSEEIBCQihgASEUEACQiggASEUkIBomDOsb6ynWts460WJc+dYG5owysEIqYAYqfGao6x9rG2snZHXwnXeR1sUR1St5iRrnpSDv2Rtk6zXVM45+eAbqxoQyEBTndwhdd+9yOt8p+5nsMq1ms2kZoYtWhsc8oo1FnCdCdbLKgYkBAJifQ3Xgf+6DggQbEOf/r5pj7X246xLjgGgGdZK1n3WZ63/SnZuyqxi3WUtsd6RmtWgY6y9rKus1TWMkz8MzJ5IH3hh5rNxDzi+7/NtjA1BnGddM9oQKK5UgZkEqeQca63Rt5uKgZUi11lHs2PY28+Oe8bfWPKHkaeP06QeNILhl+Mcn29jbAgCi8gpo+0H+R2zwNpuaccNLzoMc6ltvhrj/2xonPzebOnDd98u38bYUJoVpBxiPvzfnnPw0LHwPOjod0V/KvjuzUdoUA8cx7bPOcN8G2NDKTB99S3ti5lxNrClQoq5bOnrUfwM4ftujHIWHPdVN1UCwufbWBtKcZN1ytL+hFR+tXGYdYT1iHXB6MMe3hZgKXGbdZZU8KLO8ryBMZD/B9lf/djsM/H5NpRKtRrUDtZZ2rHiNheaAHtbFKDWkFo5mzuRi6wTIQY0wDRrl6cfDoLDkdo+sjY1YINvlnLNjsN8G2NDKbANuufpR01hMsCAMeq+DnGItZ/1kLWjY1uWDXgrsBefJX9lEQHzhux7ZpM9pLZLdVYqMaU+I/Umo3w+GnAuZglXyhMMUIH8RKoIMwy89XMlvocHNx5jlAUUubAmQa6/QWqaL4ttXSQsc2a0Y+TVpZLnoaZS549eQqLo20Vb+RmgGogdEtLhdKvWCa2C9cQt7bOr/Cz8J+AHswntc1vlZyFBsKg0axtVy8/CP4D5wxtoq/wsJEb+DzpbSS0ic9ooPwuJ8YCK64RZra+N8rMgCIIgCIKg8Qc+huh4EKxsfAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.246.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAAAmCAYAAADDeWW+AAAACXBIWXMAAA7DAAAOwwHHb6hkAAADCElEQVR4nO2ZT4RVURzHf56MZESLMZIReZIkkRZJEkmSJFpkJO2SJIkWSTIiSdKuxWg1IklGEklapU3SIolkFiNtZpFkJF6/r3OvOXPn3nvOvfecd+7vOh++5r3zzj3vO+f/7/eIIpFIJBKJtIX9rI+hTVggxadXvrAGoU1YIMWnd6R0ghSfXpHSCVJ8ekVKJ0jx6RUpnSDFp1ekdIIUn16R0glefJ5i/fTRsAdGSXXCqMM2x1gHWNtZuxy16cznedYP1ovk/VPWg0ydCdZri7aeszY0NVSBgSaX3Gf1WT1H7TnxeYb1ntSIzyVl71gbtTr9pMxmlqWR+qYmploABmt9aBM6W0itqB2Z8pvaa8yst6zxCu1ioN80sxYMTLKTrH2sG6w1Ye0oZmlpWc6W1MP5dTVTlj43yRphzbC+Z+pcT55tM6tZD1mLrE+0tBv0Mn9bwSVavorywEDmbX9bSW2NF1nrcj7fQ+rsazO3WMeT1/BbNmmDgwvFQUOd31Q8wxZo5RaaghX3K6d8UKJhM5/5/j8BPFixipQ501L/V1COwcCF5HDJs39r+NIpG9gmSin635r4quPfyCFS12wTWB0jOeWIQ6ZY1wqe61H7V9ZCgO+sxR3WOYt6z0jt51mOso6xnrAu53yOgDLkGXCCtdtQ5x7rAqmJhTjylW9TdUEsZHMdxzV2KlOGH9IQ+K5lfaaVt0VwhXW6icEGHCF1Fj9m7Syph9gSkw3b9VfWZv/WqoM4aKZCfcRM/Qr1x6kdcRZWV96uIALMnjS2qJJhwOB+IHXOmdhL6krvMoOB0OAlqRWAlNeY5XNnHXoYOshEfCOVEqoKVovNhQSdOlGj/TIQYOMMxNlym9TWZQL/o8vkbsSSSe01zslFQ31cnHAxmia1FUYCol+5i1JGbcImPddJcH7d1d5LSRmZ0nOdBMlh/ecbMSkjKk/PdQ5cMLKxW92U0bCxSc91irxbrJSUkSk91ynSbMs2UheKFCkpI1N6rjM8ouXn0rT2mYSUkU16LhKJRCIRMfwHIYnNU2xKT1QAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.247.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAASCAYAAAAQeC39AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABO0lEQVR4nGNgGAWjYFACLyD+BcT/obTHwDoHJxAE4h0MEDfuBWJRQhqQPeMB5Q9GUA/EekDMBMRdQLyGkIb/BPj4gBYQbyNBPSVmRiOx+YD4ByGDyPGYNBDPB+LjQGyOw8z/UMewAfFSIL5PoZno4B0hBaR4DBRSrUB8CYj9CJgLCnmQIwsYIPmDGmbCAMi8PkKKiPVYERBfA+IcBkg6JwaAQtUAjzw5ZoJALBDLE1JErMfKgfgWAyQGiHEEKAk+ZICUurgAqWYyQNXFE6OQlKQISgKgEgkUykEEzHUB4mYgriWgjhQzQcCRCDVgQE5xLwvEcxnwZ3RQfglggBTLJVQyUxxK6zBAChq8AOYZWAWNL+mgA1ABsQWL+A0GSCkHKhhAMVFNBTOXMyBKWxCeS4KZo2AUjIJRgBsAAPRjSuJkPr0AAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.248.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB40lEQVR4nO2WsUvDQBTGH0WKgwhOHUQE6SAdxEUcxEEQKR1E3EREXMVBRHAQcRAX8R9wEKduIiJFXEScxEXEQUQQcRIXBxEHEeL3cRdM00t619RF88GPJJd3d3l5796dSKpUf0IL4Bkc6+cZ8BKy6QKnFmNVQGeTvqsEPoGnr8VGBpkDl6ANPOm2A7ATsMmDCzBgMd4IuAY9jXxMSEGnivrZSb2iItcfaqcz3fo+A85BzmFc9j1zsC/IT/YE5dV5jtWR7uDp+6A2A/dM11XDRGQaZEEZPIZs1nXfODGV90T90EHD+0QOUktS7YxJdN6UmgX9YYugw/B+SFSqm9Su570B4zFzJ3aQaTFWx+ZdVJqa9Cq16e2LkX0ztPOn3ooqbFHj+krkYAv4sJjkK6KdDrAolWL6morCCrgXFflfdZBVqWJhxyhkDe2jYAOsRfTLiDmCFFN6S1QkJ2PmTuTgNpi3sDsUtZ7C4tqZAPtg2fC+T2qLV1jcW3clusgk2ia4V9mU/ilRkQrqTlQFZLFgFMJVlmIqzlp+CwuWKZt8p/yNPm45VIn7VNnWWNSelnewz4nbPtg0cXG3itp7XE4a/CFXYndUGhaVcs04yTiLJ5IHUccpVzEqNkXpRNTaSpUq1T/QNwa1YBw2fJL3AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.249.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA9UlEQVR4nGNgGAUjHAgC8Q4g/gXEe4FYdKAcUg/EekDMBMRdQLyGmoZvA2ItItVGI7H5gPgHIQ3/oRikkQ2IlwLxfRxqbYH4HBDPB2JpIh0EA++IUQTy5XEgLmCAxC0hEArEN4C4gwHiW0IAZGYfMQ4BAZCLDYhVzACJ+yIgvgXE5QTUxgKxPDGGgqLkIRB7keAQEMgA4itQB+ECIAfHE2ugCxA3A3EtkeqDgPgCVA8PAbWOxDoCBPyAOIABksVK8KizZICkpdkMxCVWcSitwwBJ4HjBDaihoER3DYir8ajdwkB89l3OgMiRIDyXSH2jYBQMPgAAXvImwpLVmogAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.250.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB5ElEQVR4nO2WvUsDQRDFhyDBIghWKUQESSEWYmMhYiGISAoRwUJExE7EQkSwELEQwcJ/QCys0omIBLERsQo2YiESBBErsbEQsRAhvsfuweWyt9nLxUbvwY/c7cdk53Z2ZkUSJfoTWgYv4Ey/z4HXwJhOcOFgqwg6mrSuPPgCFf073oiRBXANMuBZtx2Dfd+YHCiBAQd7I+AWdDeymID8To3r90jqEbVz/YF2OtOln1PgCmQj2OXcS0s/I6XXwU6lzrtVp3pCRT/7teN7ZrhuGP6IzII0KICnwJgtPdekYXADDsUezrEcpFal2hmT6LwpNLkD3OkV0G7oHxIV6jZNgzLYBW2G/tgOMlTG6oz5EBWmJr1JbXh74s6+O6yBtvmhH8B6oC+Wgy3gU8IX7+k7pJ0OMCnlLXNdk8IiuBPlqF+xHGRWKjqM4y6kDe2jYBtshsxLSf0dnBKVcWknY+iP5eAeWHIYdyLqPAU1ASbBEVgz9PdJbfLyNCjq/B6IPcnEKhP8ci6pf0bUF/arrBfGxHAvtVmW4nmaD7HJyHEpE55TXqG3HYcqsU4VXAeLqmm5COOzYq+DvyZmqlZR9SfKTYMfhHXL5arEGleKaL9p4o3kUdR1Kqq4Ky5J6VzUvTVRokT/QD9oXmAfeoSEPgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.251.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAUCAYAAADlep81AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABOklEQVR4nGNgGAXDAMgC8V4kvhcQ/wLi/1Dag0hzBIF4B1QPyDxRqPgWIJYm1jEqQHwciE2RxJAd4QHlEwPqgVgPiJmAuAuI10DFHYH4AhArETIApPEgEIujif8nwMcFopHYfED8A4kvD8T7CRkQC8TVWMTJdRA6eIfGr4faiRNsYkCNKmo6CJSe+tDErIF4HT5NXxgg0UYLB4FCQh5NjA2IP+HT9AeHOKUOAnkyHocc3gwCci0bDRzkiEOciYFACG1ggMQrOiA324MALMfqAPF8NDlQkbAJn+ZIIG7GIg5zBKxg9EKSuwLEu3GYtxyqB4bnosmXM+COSjgAlQ0qhBQhAQ4gfkmCehgQZyCiHAIBUE44x0B89VDCgD2a8QFbBkhtQLCkhgGQ67eQaAkpAFS/ydLQ/FEwwgEA35xBGHqpbiQAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.252.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAUCAYAAAAk/dWZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABqUlEQVR4nO2VMUsDQRCFhxDEQgQLEZEQkJRiZxUs0vkXRMTCfyCChUgKG7GwtxCxkDQiElIIImIlgoiF2FrbBAmHSBDiG3YX5s5kdi9csLkHH9ztze3O7L2bJcqVa6QqgVtxPwWuQdeOT/9DTi0wFxpcAQ9gSYzVwSIogENwkWV2gaqBFzDvC+Qk78FMYnxNXE+C78xSS6cyuPMFrYPdgMnaKRfvKc9mwSP4AiegCLZARGazzsnY2alu8xyoJsVt1E884ZEnJimtCLbmARkXcILvZDZpAYyDBjgT8VVwqS0W2ck08S6UPTFJaUXwbhfFPf+Pm+I+ad8x0NEW+/EkwwVueGKcegpSsghOkG1VFc95LEq809UW7tiXBqmmvaxI+xLs+T17zTZ9I9POSzaXYzL/ilOBPF/iiuK7IOU6Fnv1VE35r7Qi+MxxZ9ATmRbPm/Vpx9j/EyKeW31TW2wV7PcZb1DcDnJnXsGNNinpRaTVDgVYmvtwJcWk3EE+hs0opdgN3nOCxZ3nGawETrxNgy2YpZbJdC7vie3EFbdGls5wcj97rly5AvQLNXFRHHOrCUIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.253.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAYAAAAuqZsAAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeElEQVR4nO2WwSuEQRjG3xwkbcpBDnKRJLk6OchtkyQXB3dtDk5KkoNcJEkOyklOLnKQpPwTkoPcHBykHDdJfZ6nd2R27Wg+zddszK9+tfvtvjvPtzPfOyOSSPxNxuF17BCNuINZ7BAuUrC8pGB5KSTYUIDfKCTYJNyG63D4F/Ul0WClkKFsWuEc3IJLsMezLrMsnE5YgRtwHnaEHmAC3htn4XPOegZcFd1yBkOF4rTciq6bdngJDz3qukT/rR24FjIQ6YMPsNu6dgWnHd/nelqAu3AldBibfTPQJ5ySqugCr2dPdLr6G3zWAqdE19pIiGBPsM16fwDPPWsZhi2ET+fmD4EyD7/xKto4uV7Yn47goujD4ApTFu1nDDTmeRO5YZg3eGrCHcMLM3g9y6LTWTYBE4mEJ2xL3FHYCW5Em3tTwF43Y16PwrOIWWp4lNqmWo0b54v32AFcvMQO4IInEm533DV6RU8xTQHP+ieiWyAPpANx4yT+Ix8zqUk3CI46CwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.254.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAAnCAYAAAA8XHcHAAAACXBIWXMAAA7DAAAOwwHHb6hkAAADJElEQVR4nO2a34cVYRjHH0eSrNiLrCSxVlaSvekqWZGsJOkuSbpJVpIsSVayIknSP9DV3iU5ViJJV+km6SKJpIt0l6wkK07fr3fGGdP7Y96Z2TPnTM+Hr3POO/Oe9znPc973fd53XhFFURRFURSlVWyFDkF7oX0N26LUwH1oCuo0bYhSHQZzW9NGKMXZBD2AfkPvoMlEJ6FZ6Aa0uTHrlChuQSeS9/uhbvK+k3tVRoCvUC+jX82ao1ThT9MGKPXxvWkDlD67K9a/B10UMzfugJ5VtqjFXIC+QU8yZXTa8wJ1V6DtgXuOQnfEZJ17Stg3Bj2E1qCP0K4S3xGCmw/v1+F7YzkIvS1b+Sz0WozDviRlXIS/kmK7KmnjkwXu3Qidgm5DCxL+EwySH2KSq6b5ICXtmBbTI2cyZRzKXkITEd+zE3oR2fY4dB5ags5BWyLr1w1/9zAEk0Tb0ZV+qt/NlJ+GrjkaoNiz2MOWoc+Z69eTurGMJ+2xd0+XqF8nWSdyxOGwyz8qRy5uWMw56vj8UtWOwlyGbubKGFjX8MpEhsPvJTFByMLF/KOC7XKDnL3yLrQozQcxJevEdNidFxMkBnLNUc/nl6p2FIYJz+Fc2U/x76hwmTBjKecPXvXU4/xIxzAzvSrDE8AsWSfahl2fk11+qWpHITaI2UnJB863QGfAmCQdcVx3/XO5Gc6hdMpyje0fEzN3rsdjrJ5HtntjPqeE/BJjg68dJxw2Vizlq4lxNpi+0+mLlmsd8ffM/L1crjCr5b6rK4g+J4RUhrLB9PmlDjuCcN03byl/LGb+s8EedFzMmm8hd40PiLv/1OjDAM4l7TKIszHGDgDOdT3pz3mhz1l8follLGlnLKYSs0fb8oOPlZYs5Vz/cN7jEoJZXj7jvQKdcbTFaxxqGcxhfcKR79Whzykhv1S1IwjT7WXPda4ZbfObiwmJX2cqFeFWWPqg17djw2C/Efu6Ks8BMWl5kR0gpUa4s/NJzII4BHubLUHK81TMPq6iKP8ztvNAyojiOg+kjCB6HqhF6HmgFqHngVqEngdqEYM4D6QoiqIoygjzF0SVxASI5aDLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.255.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAnCAYAAADuDH1fAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACyElEQVR4nO2aMYjUQBSGH4uIyCJYyCEiwnFYWIiNlYgIFmIhYiMiYiciIhaChYgc11iKvViJICJyXCGIiFiIjYiFiI1YiJ0ch4gcwvr/zARz48wk2eQyGXkf/Gx2k0n+nUlm3puMiKIoiqIoirIubIOOQHuh/Ym9KA25A81Bo9RGlGaw4banNqH42QTdg35B76FZq9PQIWge2pzMnRLkFnTSbh+AFu32yPlUBsZXaFLSz7R2lLr8Tm1AmY7vqQ0o03EbuixmLNsJPUtrJy9YYc9rHLcE7ej42mPoEbQKfYJ2d3z+AibzH9bp3HU5DL3r6mRMcF9LvdmJ4sKzXV28R5bFBD8p+diVB3ZPL6GZBmV2QS+6uHjP8L+mbjhS2wPn/B6KCbPLYfcW6Cx0PXBy6gy0EboPfS7tv2nL5kZRaew52G3yJnwjJvk/Gjg+Vg9tPFTCseuGmDuO00flPInJbqiL3COmC70CbXX2MVF+XNfAgCgqreg2L4ppEDbaaqBMrB7aeKiEhnhnseHmrYmCHxKfmWCovs/zO//sSsBUSEOg8OHrNmMeQ/XQxkMlF8Q0HruDB7J20jaW/LJxvkDHAvtDd2ifNL1RJoFt3/eCqnpo4yHKKfk7F+iyYo35YPi8IKabdRlJ+ycudmyVpmWahovVQ1sPUdgdnhd///xEzHjl4zh0QkyOddXZx5ebi/+UGDb8/xP7Wd5297nE6qEpY3udcdWBzNE4rt2FvkGvxLwqKeCrkwVPOeYbTLQZeTL6ciPPa9C5pq4TE3t6Q09zVT208RCFyfKG0nc22rJzDHOyuQYXn5E887isYCPxyeCYxLHskqyNKgkjzrfiz2NcDtryOc6cZAUbg08dI0oGE3zT7Jsl4W9LNc73VMy8pqIo/wO+9SdKBoTWnygDR9efZIquP8kUXX+SKbr+JFP6Wn+iKIqiKEpP/AH7vcjwKJb6AQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.256.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAAAnCAYAAACVKL+TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAChElEQVR4nO2ZMUgcQRSGH4eIiAgpREREkMMihdhYiUjAQiyC2IgEsRMLEQvBQkREAinFLoVYSSAEEbEQRERS2IlYSEgjFiI2IhKCiKD/z+zhcszsrd7s6s7NBz+3ezv7Zvbd7Lv3ZkQ8Ho/H4/G8CxqgPqgD6rJs+xN0bNlmpliB8lDOst0/0KNlm5mCjm1KyLbzjq2B1qA76ARqCzQC9UKLUG0C/Trv2G/QUHDcDW0Fx7miT9s479gLUQ9Z0P+U+nXesQ9v1K/zjr1+o34TcewodJWE4VewDE2JiqUt0G4KfdaJcmydbcMb0PfQOR9oL+a921CzxbHw4X5B99BfqN2ibRPhmG6VQ6g1OM4H53Grm0LV0mZ7UC7wNfjk63cANb7wfv4o+1ZHlBFYZ/8UlbqEp319UTvG2jnN/YX2X6BqaB06K2qzENxfUTBezouakSwJTbkhk3FTCPgoKkRMQx8015nMb5Q3zOzBPwK+rnQsS8JDQ7t/El3ZMBXqNFzjTL7VfP8YocwzIcq5rL9/iHkhIyo5p+POoYGINvevGp1dUv0hh+W5/o6CM67acI1roUuiQoqOnJQ/Y6Pa2naYFdt8xcdFHxvDbIqKlTo+Q4OicswZzXUuQG9pvncW5qWMq6vQJfRb1PKbDi7NLWm+50IwiwBmEaeizxxmobFyB5slmLxXhc7p1JuI9sxH8y/so1EqMI+lEzmTGAMZPyfFnBUQZg9HUH9M+z2BvYqrvOggzlpmBPxz4ep8qcqK17dj2t8Rtbbg8Xh0+1+2iVOuO4dp/8s2pcp150hz/yuqXHeOtPa/4pTrTpHW/lepct050tr/KlWuO0ca+19xynWPx+PxJMwTvvesqz3bx/EAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.257.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAARCAYAAABwxZQXAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABAElEQVR4nGNgGAWjgO7AC4h/AfF/KO0xsM7BCRyB+AIhRcge8IDyByO4wQAJcLwAXQFBDUhAC4i3keIiCs2kiWekgXg+EB8HYnMcZoJwNBCzAfFSIL5PoZlEuY0Uz/ABcSsQXwJiPwLmakEdVgDEglQyk2qeKQLia0CcA8RMhAyFgndAbIBHnlQzqeaZciC+xQAJaWIsBiWvhwyQ0hIXINVMqiYzUHLpYoCEZhABc12AuBmIawmoI8VMgp4hp2iWBeK5DPgzKyj9BwDxGiAuoYKZPAwQz/DgMwTmAViliS9ZoANQJt+CRRxUJ4BKJ1DmBoV4NRXM/I+ER8EoGAVkAgDthUov6tgjdAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.258.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAUCAYAAAAp46XeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB7klEQVR4nO2WzStEURjG3ybNUllIkpRmZSEbWUhSFpOFZCNJdrKwkJSFpEk2/gMLWUlJkibZSLKwkywkG1nJRpIkqfE83jN1O51zP8ZdTfepXzPn697znvN+XJFMmepC0+DF6msHZzHWlkFbSvsYAd+gYn6LaTz0EGwF2gVwBXpjrB0CN6AzhX0EDSqa9r9FQzrM/xy4AC0J1nPtecJ3doETq68S0XaqGeyDT7OgSqMZ3wjMpYuuOF5CpkAe7IJHa86aWRsluvCO6IH2Od4T1naKsbMqeiutokb6dCxud+wyG1oATY7xflH39okHyUO8BaOeOTUZR9+l69C4ktmkTx9mnkuvoMczxht994wtgjswH/Jsqibj5kQN/AJ7orfn04+nn5t/Es1oPvkSwDJ4EL311I2bAONxJoqeft7RPwzWRd3bpZz4b46iK2+K3qBvLzUZR1ebFXes2DoSjR9bjJMxcACWHOPdovEaJdbPbXEnlMSlgDWrZB74DC7BYMj8SdEbCupeNMsxKfDk7WxK0fVmojYTEBNU2eqrGlQt4mEh8CcW2IZAm4a9RaxhzSrE3qbWxKR1LhXREJ4oY4KxxIwVli0pZtZriff5M2Cel8YXSmJxg7w9ZkoGPAtonK8PzrHdxqVT0TjKlClTHeoXrwpnWcv5wAIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.259.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAARCAYAAAAlpHdJAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAvUlEQVR4nGNgGAXDFDgC8YWBsvwGEP8fKMsZiLX8PxRHAzEbEC8F4vs41B4GYhdqWg4CWkB8HIgLgFgQjzpTIN4GxOeAOIhaloPAOyA2IFKtHhAvZ4DEbTIQM1FiOSi4HwKxF7EaoMCNAeLow5RYDorHZiCuJVK9BhDPBeIrDJC0QpHP/YA4AIjXAHEJHnWgON8CxGegenABHqjlPIQsBsWbNBDzAfE1IK7Go/YgENsTMpABkYMGNK+PgsEBAEqPJgPuBa8/AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.260.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAUCAYAAAAp46XeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB8ElEQVR4nO2WzytEURTHT5NmJWWhSZKSlYVsLKRJykIWkpIk2cnCQlIWkiTlX5BkJSVJmmQjycJOs5AmG1nJRpIkqfH9unfyenPve/c2bKb3rU8z790f75x7z7nniiRKVBWaBE+hd83gzGFsDjT9oS2D4BMU9e9ApRMegs3Acxu4Al0OY/tAHrRWaoRW0KEB/VyR6EiL/p8CFyDjMZ5jzyPaT0C741zFmOcyNYB98K47l6jT7euBvgzRJcMHyARIg11wH+qzosealAXXYEfiQ9jbOebOsqhdaRTlpE3HYg5Hrjx3eA7UG9p7RIV3lEZBAWzI78KG5e0c45ahQ+dWtZE2vel+Jj2DTksbd/Q1zhA99zy4A4uGdm/nZkQ5+AH2RO2eTV+W9zT+QdRpZpNr8tOeG1FOhuXt3BgYcfwwVz9teN8P1kSFt0kpid852pDX89Ra+ng7x1CbFnOuhHUkKn/CGgLD4AAsGNo7ROWrSd2iUmFL4g8Ur1LAmsU82waP4BL0RvQfF7WyQRW0UTwEbqX8NKWYP1OWOVnoXUtByaFSEY9Kg58wqAk807GXmA+wZrU5GkNlJLrO/ZvoCFeUOcFcmpXo05Liycq65HL1yer5/uqG4iUayN3jScmEZyF1uX2wT86h36moe2iiRImqUN/e52dc9Uv6vAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.261.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAASCAYAAACjMAXnAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAiElEQVR4nGNgGAXDFDgC8YWBsvwGEP8fKMsZiLX8PxRHAzEbEC8F4vv0shwEtID4OBAXALEgFSwmyXIQeAfEBgQMw4UpshwU3A+B2ItYDUQAoi13AeJmIK4lYBhNfO4HxAFAvAaIS4jVhAfwQC3nIaQQlCelgZgPiK8BcTUVLCcUKqNgFNAHAACR6Sfhn4GXEgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.262.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAUCAYAAAB1aeb6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABY0lEQVR4nGNgGAVDCMgC8V4i1G0BYmlqWqwCxMeB2JQItY5AfAGIlahhMRMQHwRicRL0yAPxfmIViwLxKiD+BsT/kTAfEMcCcTUWPTA10UDMBsRLgfg+knw9VC9BAIrLWgaILyWhjoCBTQy4g1uLARIdBUAsiCZnDcTriLH8FwMkqECWN0INhIEvUHFc4B0QG2ARB4XGJ2Isz4A64AcQL2eA+B4G/uDRB7LgIRB74ZD/RYzl4UAchEPuE9QSbMAFiJsZIFGGDpgYiPQ5KGjTGDDjDQQ2MEDiDxvwA+IAIF4DxCVocnoMkPSCF4DyMCie5wLxcyA+DMT2SPKRDBDfoYMbDJDCBJQjrjFg5ohyII4nZDmoQGBB4oMs/oCmZj/UkcQCcQYi8znIIpALQXEEitscBtTUDgKgnHAOiD2IMM8Wqp+oEg5kIMj3oJQOSiDzGbCXZiCxLUSYt4MBUg+MglEABgB8WT8+1qABUwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.263.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAARCAYAAAC4qX7BAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA8ElEQVR4nGNgGAWjgKEeiH8Acc9AOsIeiDcAMRMQLwZij4FyyHIg9oGyLaF8qoH9QGxNpNrHQMwFZbMA8WtCGv5D8RqohoVAfB+HWlMg3gbEhxkgQY8P/CLAxwpkgfgLEBcBsSgR6vUYIEF9HIhdiHTID2IcAgLngNiPWMVQ4AbE7xggoYkOngIxG5TNAeUTBCAf9gFxJZEO0ADiuUB8BYijGSA5Ax2AQgwWWvYMRCZWLyAOYID4LAuPOlAa2QLEZxgIhx7IEaugjlzDgDsK4eAuEKsAMQ8QXyNgwUEGwokUGYAKMlDaaCRBzygYBXAAADMVKptPSQ1mAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.264.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAAUCAYAAADvJjFnAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACh0lEQVR4nO1YTUhWQRS9SLiSwIWIRAThQiLCjSuJCFxIiISbiAh3EeLChSASEtEmRCTcRysJJELkW7SREBfupJW0i1btIkRERPg8x5kHn8Pc92bem1cU78BB5s3PO3O8c+e+T6RBgwZ/Brf+toB/BdfB7cCxLfBaTv8EuAK+Am9X1KXB1Xsf/NrRLtIYgwfgKdi2f8dTLDoI7oEjgeOzDd4sGNcNPgGXwXlJZ4JP7zcxpsRqDEGn0eO2XQld4A7YHznvBvglYnwv+Bx8DT4Dr0a+L0Oe3rbTjtWowV3XbXvRB26Ax3ZCRm78KfhCeRHJSGXEroPfnTEv7fwY9Nr3MQqHEurNNLsoo7Fo3SDTmfuWxETJgJjNZNgSPa3wQuQxnhNjlotR8FPA+2kio3zV6tDMrqrXZ0aoxjyUMp05iEeNm+DlttfRd2Sfa/gFDit9PAGHSh/z9wz4FlyUYqNT6PWZoWls57Bo3SDTGWXcyAn4QUz0ZDjLmUfBP8Tc3hp8l8qamBQw6OmjYZNicrsWsWX1amZUvfhKmf4InFL6GAXdSt+YGHOWlP4u0SPdHccyklXMGymuksrq9Zmhaaw90nkkWTH48vKmmLznAyPyIfhRTMnn4o6YHOsDN8vyivU6zb4XIrSC3h4xZvREaAxFdMnII868+A78Ce7KZQMei4lmF6x7mZdZMRyIv2JYAKeV52tWYN59kVKvFqmaxhhkRmcfR3np9gIsza50tLmB384Y1rK+/JuHfklTA7tIqbcujYWgYP6nGXHMhbNyuRogWCnsS/jn7V27RoqvPRep9NapsRAUxuhhJcAL5b34v+b4rBW45mcxv33UgVR669TYoEGDBg3+Y5wDUlq0tDz7nU4AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.265.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAUCAYAAADY6P5TAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB/klEQVR4nO2Wz0dEURTHj5HRIjGLzCKJzGIkadMqSSRjJG2TpE0yWiSRZCSJJMn8A61mlyQjbZJWaZNWSSSt2rVIWiSm73Hv486be++779Vo0fvyMe/dH3Pueefecy5RrFi/oe6/XsACeAGnSlsHOHeYWwHtAWPGwC7YAD0h15YHn6Aqf3Mh59MsuAYt4Fm2ZcAV6HeYPwxuQZfD2CSYAjtgmYI/DEt1KiffnZUlEbk+pS0BLkE6xP90goswhqEUmAebYA60GsZVA96NOpGDq/LZ0zRYMxhiOAIciTJ4UvrX5dywSkl7vAuyBru2d6uWwJavjZ01bU1OFrx1F+XCVA2AI0e7bSSitweKpHfM048c5KQy6mt7J7FNTXql2i3tiaP6ZpnH560A9sEq2Z1SFdnBJvBB9c58WeawE5yI8oZ+UwIokdiGGU0f2x8ncRZ1Oyeyg5yRKpp2jkLSMGdELqSo6UuQPYL+sVw6OJtukz1bR3aQ61JB035M4jzpxF96AhySSPOqeqk2WfnFTuWkXXZsyHGdkcsEZy1dKZgkESW/7kmcI07nd1SfaVfAjMEW95XkAm3nWyfPKa/Qm45HjbhulS39XNN058WkNIWvgw3RA2gGB2S/efAHuCG3a9EgidLhcpNpuPiG8kjiehUkjoouCfl1RuLeGitWrH+ob20FYEolhBsLAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.266.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAAUCAYAAAA5g+sCAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB1klEQVR4nO2WMUsDQRCFBwsRkYCFpLAQRETEwkbEUkgRgkiwTWEhWEtII2IhIoiIlY0/QATJXxCxEsHCQkQEkRQiQRCLYCFCfC+7h+dmb3MxyIHug4/czs7dzc7OzkXEy8vLq6ERMJV0EEnrChyDM/CYcCy/qi7H3KUxvgc9Uc51TQF0g0Pw0Gl0hvrABrgA8xE+26AGqmBZ23LgXcfH32zIP5jb0fOmVsGcYauIWmOkxsE5WAH9LscfaAls6XeURQU9Zvgw6JKo3V0Ad9oeXnxWj8WYmxV7Imi7NniOE/ALmHTM1x1Eic8rGzYGM23YeHZtJW4+Ozy+AYsR72WCjsBQiE2w74i1IZYLyybXyrFN8YgNGraqxRaVTFci0uBA1LmfMfyYpFHDxo1uWe0ZURlbd/i0WxEpyxyPxKnF90lUH7G90zWmWF0Vw8Zkp0NjHs+9iDi/iQ0sL6qMS3FuiCH2GwZ+oscToj5lNu2Cor4elq9m7eoRfHbGYhd9f15fc2225DfpVlSpcgdZUmtxbooh7jIX/yGqL7iqrVfUJnBBTFZB24NFBl+N8NGljYutSfORZm96A6+iGnViGpA//uclrvifodjS6x+I3+xU0kF4eXl5daJPGrhzI+2kgZcAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.267.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAUCAYAAAA9djs/AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB1klEQVR4nGNgGAWjYBQMEXCBCmaoALEpFcwZkgAUgKuA+CAQPx1gtxAFmKho1hk0/l0g5sCl+D8QT0BSuJ+KDoEBHiBuBOKTQOyHJucFxL+AuAvqFhBwAeJrSGocoXx5qBk/gNgDh12VQOyDJvYQiNlwOS4UiNdB2dYMkCRDTZAMxK1ArAXEaxggntRAkgd5HuQZRwZEAHxAYiPzsxggHvGA6sMGQOquoOHX+BwICu0tSPxIPAbjwriAAQPE08gA5BhzJD4oZuPR1DChmYvOZ8DCBwFQwCxngKQUGG4G4il43AiOjbtQtj0QS+JTTCK4D8TSaGIv0cTEgXgm1A2WSOKEPIwtAECBqYYm9g6IBfE5EpQ/QUkMFMq48hXMQlJSAB8WOVBg4ypjQKniIZp96Pbj44MAKHDFkfig7NeHwz44AJWO3xgwCw5KQQEDxJF7oXwdBux1O0gNKBsi52tBqLggkXwYAKW4ACgbVNgSVaCDYh5UqqoQo5gE8JwB4uk/DJB8X4tDHcgjIEd/YYDUCDAx5NRFiA8DoDIHFJmgFN1KrEOVgDiPWMVEAlGGIdD4OMoACbEeGpgNqvOLaGAuVQGo1K2nkdmgupePRmaPglEwCkYB2QAAIaB2hw+77dUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.268.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAXCAYAAABtR5P0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAACF0lEQVR4nO2XsUsDMRjFPzqIQxEcpIiUgjiIgwjiICIiiIiIuHQQEVcREQdBRKRDVwf/AUcXERHp4CLSQdzESVxEHF1EREREqO9rrtCelyaXXq5S8oMHvWsu7zWXfkmIHA6Hw+FoPllotIX9/i1z0DR0DA23oJ+UNHRpsf9J6K7qugD1SNrybByzmCUOvy7oRadhH3QDjUQcoJoHqFR1XXkZvQFtVy3mCMKG3wXV/t5AElARSlkI4McfJgNd+e7xS0nGkMWm3zq0QxqDvwztBtwveVqC2qAj6KlOP0ojSZucl4FZg86gQxKlwKS/oDYH3udHqn3ZYf10GCAxVlr5zklebrgjLkebUKeiH9PB51p7qvGsqWe2qn/2Khp66cCTlBfvyj9Jme+DROmR8QoNaRibDj4Hftd41tRzisTiXmHRwEMmP1xBMmHy/dT5jgfmGZqNIFi9MN+qkA149pMoN8wE1B3CKyxhcpXhWdcm+Y5nTR7a0zQ2aZMguzOfS8Cb5zNj6BF6UHXz8YIj2+POQwvQCbTVoFHSa+PfWQySWHdM0BmAduiTxIEqbpT5uAbmA+7zvpwPQR3QPQXviMIYyWbMNrSiCmnoyfCM/yJxlokbnXzl7VczwqXo7z4/avgQt2HZoyF4hb4ls5poyjiJbWzQCTcKrkns0vYt9R8pPAsLylbRwcfvtMX+eYeTs9i/w+FwOBxKfgG9XYZBnITOWAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.269.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAUCAYAAADPym6aAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeklEQVR4nGNgGAWjYECBKBC/QxOTBeK9JJjhCMQXiFDnBcS/gPg/lPaAim8BYmkS7MMK+qAGw4AKEB8HYlMSzLiBZgYugOx4DygfBGABoUSCnSjAGojLkRzBBMQHgVicDLOI8Qi6GmS+PBDvJ8NesKNByYcDycBYIK4mxzAGyj0CAvVQN5AEQDFRgmbgJgbSkhQ+RxGjBp0PSiHrSLFUEojvMkBiA9nALwyQmCIHUMMjbED8iRRL10ENQcYg8AeH5bgwPkdhA8To+YVFDCtwY8AsWmEeAIUGG7EGEeEoQmrQ+UwMRMZIOBCfY4DUEzCgAcQ/GCAl1QYGSDolFfBAHcVDQB2u4hcG9Bgg+RQvmM+ASBKRULFQBtSkkgDEzYTdjQGwJbcrQLwbTR3M8bAK0QtNHlQAxZNhP1YAKstVqGAOqCB5SYJ6cQYy6xFcAFQxgZKfByGFBACoaCc2mdoyQFoTZNfsuAAodLZQ21A8YAcDar4dBaNgFJAAAOxKYL1Lu5ZaAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.270.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXElEQVR4nGNgGPRAEIh3APEvIN4LxKKENNQDsR4QMwFxFxCvIaQhGonNB8Q/SHXiO1IUg/zTR4qGWCCWJ1YxyNPxpJjuSIpicSitA8TzCSleDsT/kfBcUmwaIAAAyyYNqin/ZtYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.271.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAUCAYAAAAUccS4AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABuElEQVR4nO2WvUsDQRDFhyBBLAQRSSEhICmDjQQLsUgXUojYiYiFnVgKFhYp7Cz8B0SsxEZEQgpBRKzERiysbCSFhQgWIkFEiO+xc7JZ7puAzT34kd252d3J3uzsiWTKFKgj0LPogmtQsXyK4MrqN8C3+vO3HjL/GLhQP84xofY2mEwb8IK282ADPGm/DG5B1fK3A6xrP0hNMA1yYA+cqr0GHsBU0mBbYNzqj4BXXeAGFBz/XkTf1orVHgVfVr8k5i3G1hB40zaDm9UJ1sEq2PEZkyRYV+9Ov6nrxNKi9Ofss5jXRnHHqz5j0gbL/N13bHPgLOZ4OQBL2ma+bquN+hSz267SBssdLDk2rvkRc7x0xKSCJwbX1fZPwJg0wXLetYBnYQf0TzPg2LGxZHW0zX+c9xmXJthagD0nMXaWTixZXgqwAvBQvYBNtZ2LySlXSUoX5VWTiq5pi+ejFRUsX7F7GdxJ/8lcBrs+Y70AvUuhofZHcOn4njjrHDrPeUaC0iOxWMbKMX2HxdTnuCpIwjobJZ7eewm/Uj1tiX/a+GlezM2Y+AaLEnegPeA5+b1QHPCcmTL9m34BzP5ftZHyabQAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.272.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAbElEQVR4nGNgGGzgPxBPgLLvAvF+UjSHAvE6KNsaiA+SotkFiLcg8SNJ0azBAHEuCNgDsSQpmnmA+AMQMwGxBykaQYADiL8BsQ+pGhmgNv4AYhVyNCsBcR6pmo4CsQEQ95BjIyiE68nROFIAABnxDvQ4kLf4AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.273.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAWCAYAAADwza0nAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAYklEQVR4nGNgGAUkgVYg/gHEbuRoLgBiFnI09pCjSRiI+8jRmAjEQeRo3ADEgqRqAgXINXJsCwDihUh8kH9lidE4F4jjkfjVQBxOjMYzQLwKie9FrEZ0QH+NWUBcSY7G4QAAo78M3rtu9xUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.274.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdElEQVR4nGNgGAUUg1Yg/gHEbuQaUADELORq7iFXozAQ95GrORGIg8jVvAGIBcnRCAqka+TaGgDEC9HEQoHYkhjNc4E4HonvwwCJ71VAbExI8xmoQnQAst2aGNuxgQxyNToCMQ85GrMYIFEHCotQcm0fTgAAHwkOZFPLPIkAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.275.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAjklEQVR4nGNgGFZgPhD/R8LfgHg/EOuQYoAflM0GxFlAfItYzZuAWBiJzwXEL4nRyALEr6FsJiA2Z4A4O5kYzQEMqH6+D8R6RLkXCGYDcRCUDfJvOVSMKPCQAeJ0GAA5/RsxGo2BeCmamA7UQLwAZAMoimBOBoUwKJCeAnEOIc1/GDATx0kgjiXGyUMEAABQiB6eERUKtgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.276.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAWCAYAAAAfD8YZAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAdElEQVR4nGNgGAUUg1Yg/gHEbuQaUADELORq7iFXozAQ95GrORGIg8jVvAGIBcnRCAqka+TaGgDEC9HEQoHYkhjNc4E4HonvwwCJ71VAbExI8xmoQnQAst2aGNuxgQxyNToCMQ85GrMYIFEHCotQcm0fTgAAHwkOZFPLPIkAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.277.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAVCAYAAACdbmSKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXklEQVR4nGNgGBmgFYh/ALEbqRoLgJiFVE09pGoQBuI+UjUlAnEQqZo2ALEgKRpAnr9Gqi0BQLyQVE1zgTgeiQ8KFFlCms4A8SokfjUQh5Nqs9fg1pQFxJWkahpgAACwVQzeSqED+AAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.278.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAVCAYAAACkCdXRAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAsElEQVR4nGNgGAXUAjxA3AjED4H4BxB3AbExEN8l1SBJIL4ExHlAzAHETECcDMT/gXghKQaBNF4AYg8sFoAMCyfFMJALluOQAxkmTYphu4HYjRQN+AAosFmoZdgvahkEAmeA2BKLeDI5hoUyQNKWLZQvDsR9QKyFRR02SzFAPBDfYIB4+QKSwTDgwwCJpFUMkIRMFQBynTW1DMuglkGODJD8SzHIAuINQDyXAeLVkQYAKRwbQQUgSwUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.279.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAQCAYAAADJViUEAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAZ0lEQVR4nGNgGNZAFIjfkau5D4j/k6PRGojLydHMBMR7gZiDHM0gG0ugbJI0SwLxXaitJGteB9WAjIkCbgwQvyKDP8RoDAfic0AsiySmAcQ/gFgcn8b5SE6MhIqFMqA6nYsYFwxiAAAYURljKxBTDgAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.280.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAXElEQVR4nGNgGPRAEIh3APEvIN4LxKKENNQDsR4QMwFxFxCvIaQhGonNB8Q/SHXiO1IUg/zTR4qGWCCWJ1YxyNPxpJjuSIpicSitA8TzCSleDsT/kfBcUmwaIAAAyyYNqin/ZtYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.281.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAApCAYAAAB5hwSGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACH0lEQVR4nO2ZsUoDQRCGBxGrIFhISjuxEBsrsQg2FmIbLERsg4VIerEXsRREgmVALCxEbHwFsRJfQOzEUmzOWW7Vy3G7OzuZvWxkP/jJQTbzT+Yue3MZgEQikYibjPGZC9QXalIwjxnUvY77gJqtWMPJVQSu8Y5oFgBHqCXUBOoYdV2xZuyKtC+aBcB24Xga9VmxZqyK1ECdQ341ZVp3wh7vQnFE4BhvQV6gJuoRdQj2/cnXQ+1PpwJxxOAY91FnqDfUagAPdQLmBOKIUTbOLFKojfUD1dOvU5a4tjgmVPxdYq614WvcQt3qY3UH2hD2WBOKI4qv8Qmqo48PUF2wb9o+Hk39uoi6HCKOC0pPNpTxM/ztFwuoV9S8gEcfBn+SPWYcCpSeLIhxHUjlSunJghjXQahcq3qyAZxVjIgQuZp6sn8Ht91QmHqyhMbWk/1iOwOxi/o9bNh6sgS4ezIWo75yJO9slJ6MxTi1CiMjFckBtUBt1ErIRGKGUqRN1DrqCrUcNp04KRbJNSlRVxPljzgX6vb8JBCnNspXkm1S0rG858NLhW+0VCVqmpSos98I7B0l5URNk5I91A3kPUebEZe7JgrKifpOSqhxuWuioJyo76SEGpe7plZMD45FqJMSlwf1kSO6Iv2QGY4VLfCflFB8hlkzEopntpwkZ1Ji87HR0Gsk75aimIrEmZS4PGzvSz/9ixJ9grGQCpRIJELzDWDUBVEt6lNyAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.282.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAlCAYAAADWSWD3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABN0lEQVR4nGNgGAWjYBTQA4gC8cuBdgSpYAcQ/x9oR5ACcoC4kmEIOVoLiJdC2UPC0WxAvAqIeaD8IeHoaiCWR+IPCUf/x4GHFCDawbOB+BcQs9DOLUQDkkI5llauIBGQ5Og8WrmCVgBU3MxkgIQ2LCNsG1AXEQHCGSAOFgfic0BcyzA40jdesByIpwHxcyC2xqMOV/FE9yKKCYg/APFcKM1GJXNp6kF7IN4CZa8BYi86OgSfeXjN7gHiDCi7AIiLGIZAJrzGgKj7NYD4KRCrDZxzRgFNAaibtYkB0pQAYY+BdQ5xANRjkYWyQQ7+NYBuIRowIbFBRe6lgXIIOcAUiJuBWHKgHUIsgLV7HgKx7QC7hWQAStM/BtoR5IAh190CgSHn6CFT5J1kQDSOQA7G12gbBaNg2AAAlO1W1PqoqLYAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.283.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAARCAYAAABTnsXCAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAq0lEQVR4nGNgGAWDGMwG4l9AzEJlc72g5v6H0h6ENMRS2QEMaBZ7QPl4QR4NHPGfAB8F8ADxTAZIaPyH4m30dkQ41AHiQHwOiGsZqJM+SHLEciCeBsTPgdiagKG4MEWOYALiD0A8F0qz4XMtiYBoR9gD8RYoew0DJFvhM5QmIdEDxBlQdgEQFzFQJ1GCANFZ9BoQy0PZGkD8FIjVqOQImMWwwgpfKI+CUcAAAJNOOa7fw1OOAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.284.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAVCAYAAACkCdXRAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAsElEQVR4nGNgGAXUAjxA3AjED4H4BxB3AbExEN8l1SBJIL4ExHlAzAHETECcDMT/gXghKQaBNF4AYg8sFoAMCyfFMJALluOQAxkmTYphu4HYjRQN+AAosFmoZdgvahkEAmeA2BKLeDI5hoUyQNKWLZQvDsR9QKyFRR02SzFAPBDfYIB4+QKSwTDgwwCJpFUMkIRMFQBynTW1DMuglkGODJD8SzHIAuINQDyXAeLVkQYAKRwbQQUgSwUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.285.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAVCAYAAACZm7S3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAcklEQVR4nGNgGAUg0ArEP4DYjVwDCoCYhVzNXeRqFATiPnI1JwJxELmaN0BtJxmAAukaubYGAPFCcjXPBeJ4NLFQILYkRvMZIF6FxPdhgCQWkJgxuS4C2W5NruYMcjU6AjEPORqzGCDxDgrIUHJtH2QAAM2eDmDKITeAAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.286.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAVCAYAAACZm7S3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAcklEQVR4nGNgGAUg0ArEP4DYjVwDCoCYhVzNXeRqFATiPnI1JwJxELmaN0BtJxmAAukaubYGAPFCcjXPBeJ4NLFQILYkRvMZIF6FxPdhgCQWkJgxuS4C2W5NruYMcjU6AjEPORqzGCDxDgrIUHJtH2QAAM2eDmDKITeAAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.287.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAVCAYAAACZm7S3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAcklEQVR4nGNgGAUg0ArEP4DYjVwDCoCYhVzNXeRqFATiPnI1JwJxELmaN0BtJxmAAukaubYGAPFCcjXPBeJ4NLFQILYkRvMZIF6FxPdhgCQWkJgxuS4C2W5NruYMcjU6AjEPORqzGCDxDgrIUHJtH2QAAM2eDmDKITeAAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.288.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAApCAYAAABnTjQ1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAACGElEQVR4nO2ZsUsDMRTGg4hTERyko5s4iIuTOBQXB3EtDiKuxUHEXdxFHAWR4lgQBwcRF/8FcRL/AXETR3GpX2iq55G8e8kld7HmBx89avre12eae+0TIpFIJOKgb3j+HPqExj3lmYLuVMx7aNrSTy1QZrY85jmEFqAx6Ai6cvBTOZSZXY95NjPXk9CHYd2fKE4DOhOD3dNXunWIY+LNU5ygmMxsiEFhmtADdCDo88fmTcnz58RDnOCYzPSgU+gVWi4RR4cs+oyHOMHRmZGH5jvUVY8TxGtNMiFjb1v6qQ2dmRZ0o67lXWXNMY6OFU9xKkFn5hjqqOs9aF/Qh7EpTp6mepyHLkrEsYHbX7HNPImfM2EOeoFmHeJk6YnfH7uuYxxbuP1VJWbK4tsPt7/SMurFyWPqr7RYVbICQvqh+quRwKV9GEL1V/+aov7qG6r6MYrrnaKov/q3cPorK+reLdxzpAhuf2VFbLf4qEjFIeAWpw0thTQSG9zCrEOr0CW0GM5OXGSLw5lCyN3D+UGMQt5qH0vGqIT8zimaQnQK/s7hWZM3SvImqSmE/I83AuWNkqxJagqxA12LQe/QtohZZk2t5A3aTiG4cV3X1EreoO0UghvXdU0lUF/shnCnEJwcnK8F0RRnCFWclrCfQnDzuK6pnL7h2mUKwcmho6HW+LrzecO03V2mEFQOFw9REK2xGEjFSSQSvvgCXD/9Su3G1pUAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.289.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAARCAYAAABTnsXCAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAq0lEQVR4nGNgGAWDGMwG4l9AzEJlc72g5v6H0h6ENMRS2QEMaBZ7QPl4QR4NHPGfAB8F8ADxTAZIaPyH4m30dkQ41AHiQHwOiGsZqJM+SHLEciCeBsTPgdiagKG4MEWOYALiD0A8F0qz4XMtiYBoR9gD8RYoew0DJFvhM5QmIdEDxBlQdgEQFzFQJ1GCANFZ9BoQy0PZGkD8FIjVqOQImMWwwgpfKI+CUcAAAJNOOa7fw1OOAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.290.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABLElEQVR4nGNgGAWjYOgBUSB+OdCOQAY7gPj/QDsCBnKAuJJhkDhIC4iXQtkD7iA2IF4FxDxQ/oA7qBqI5ZH4A+6g/zjwoAFEO2Y2EP8CYhbauQUMSAqdWFq5AgmQ5KA8WrmCHADKljMZIKEES3jbBtJB4VDHiAPxOSCuZaB9esILlgPxNCB+DsTWeNThysZUzcpMQPwBiOdCaTZqGk4OsAfiLVD2GiD2wqOWlBDCpxZvyPYAcQaUXQDERQwDnKCvMSDqGw0gfgrEagPnnBEIQE3XTQyQqgmEPQbWOZCWoiyUDXLMrwF0CxgwIbFBRcqlgXIIOjAF4mYglhxoh4AArI58CMS2A+wWFABKQz8G2hHoYFA1YUFgUDloUGT7kwyIihTkGHyV9ygYBWQDAALlT9uUzcOXAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.291.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAlCAYAAAAqXEs9AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABLElEQVR4nGNgGAWjYOgBUSB+OdCOQAY7gPj/QDsCBnKAuJJhkDhIC4iXQtkD7iA2IF4FxDxQ/oA7qBqI5ZH4A+6g/zjwoAFEO2Y2EP8CYhbauQUMSAqdWFq5AgmQ5KA8WrmCHADKljMZIKEES3jbBtJB4VDHiAPxOSCuZaB9esILlgPxNCB+DsTWeNThysZUzcpMQPwBiOdCaTZqGk4OsAfiLVD2GiD2wqOWlBDCpxZvyPYAcQaUXQDERQwDnKCvMSDqGw0gfgrEagPnnBEIQE3XTQyQqgmEPQbWOZCWoiyUDXLMrwF0CxgwIbFBRcqlgXIIOjAF4mYglhxoh4AArI58CMS2A+wWFABKQz8G2hHoYFA1YUFgUDloUGT7kwyIihTkGHyV9ygYBWQDAALlT9uUzcOXAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.292.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAVCAYAAACZm7S3AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAcklEQVR4nGNgGAUg0ArEP4DYjVwDCoCYhVzNXeRqFATiPnI1JwJxELmaN0BtJxmAAukaubYGAPFCcjXPBeJ4NLFQILYkRvMZIF6FxPdhgCQWkJgxuS4C2W5NruYMcjU6AjEPORqzGCDxDgrIUHJtH2QAAM2eDmDKITeAAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.293.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAoElEQVR4nGNgGAUDDniAuBGIHwLxDyDuAmJjIL5LiiGSQHwJiPOAmAOImYA4GYj/A/FCYg0BaboAxB5YDAcZFE6sQSCbl+OQAxkkTaxBu4HYjVjF+AAoYFmoYdAvahgCAmeA2BKLeDISWxiIZQkZFMoASTu2UL44EPcBsRaSmmoGImMvHohvMEC8eQHJUBjwItYgQmDwGZQFxJXUMGikAQD7fxm7gv5WogAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.294.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAmCAYAAABagbwLAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACFUlEQVR4nO2ZQSsFURTHT28hCykLSZKShSTZWElSFpJkYyHJF5AsbCS9hZ0kX0BWUpKFLGwkC8nWQjaSpY2spLd5zunel5l6c++ZmTtzn3nnV//c6d4z99xj7p1z5gEIgiAIRaQT9eHbiSJxjar6dqIorKG2QALqhCHUiW5LQFPSgjpDtelrCWhKtlF9gWsJaEqqERIcIcF0jATUMbaApgl4EtsOUPlxBXUDqvgoFHkHtIwaQZVQe6jzFPM3JHkHdDnQbkf9cCc61O1X1G2CifOiXlBqmQEtnvJaKhLemLacviCfnEGLqAvdHkfdMW/ug6iFU7X1gNoAde7FsbX11aD7HjDGwTTqKnC9ZJjUd95omouentGEtpw1rEC4CIlkENRWJyZR3RwjC5zgm8ZE/bOiFk5b/R01a/Epro816KW0arh3CKqjv7TRjMWhRn1CaZftonYS2Nr6iClLf4hW1DdqLo6RJ6IWPo9aAJXWbMa0tfV16b/DqGOjdxp6MikdGOAM9ky9hb+gekClNc+gPrhwbW19pxDeiUccJ/tR65yBDUDeeWgs7kG9FfeznsgClXOXoMo7ku0cT0rmAaU3eznrSRjQTx+9uk3BrBjGsiqVDGz/FaVAm9KfJ1+OFI0xUKmPizy46aEqhM44Ss4nPPtSKOgMbZqzLi/kq71jJKAOsaVNAoNH+CvtKJimL0aCIAhCgfgF1ESTfvWnyPoAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.295.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH8AAAAUCAYAAACkjuKKAAAACXBIWXMAAA7DAAAOwwHHb6hkAAACLUlEQVR4nO2ZzyuEQRzGv23aHDbltAdJaQ9ykIuTHJQkB7lKkqscJOUgOcjN/+C0N0mSXCQnuchJUpKTm4MkSa1nmtl6d3Zm3vnxvpu35lNPaX49TzvvvO/MIIpEIpFIpI016A06T5T1Q5cWfc+gvkD/RmB/Gyah+5z8C5t/BbqFKtCrKKtBN9CYQ6hB3wDUmR/v0eBThMnPPP8Q8RU/migrQddQ1WGcAejKJ4CgEz+eyacIk2/ycfY/FZ0a4u8mS9C2xoBpESpDdeglUb8r+vqgCp/mZzOGbZs8Jt81v6+PqdzIBrQvlbEHQfe6Hyb+OViHeqW6cejYJwTpw5v8bMewaZPXynfJH+LjlZ9t8Kalsk/ir34d79T6mWjCnu4PTTCdkm1c/VQ+vm3yfO3b5g/xcc7fBX1R+0T/GvqwCWabwllN/Y9rCIEufJqfzYNl42N6bduM/R/zG5khfkyTYau3rOkzBe1BO4q6EmW/8k1+Kh/fNnmtfJf8IT7O+Q+gVUX5CfHvt4o5aB46gjaluhFq3Ti6oAtv8rMdo0lFtKl49E0ji/xpZJqfnc1Vx7kF4k+rDDtnssucHuiB2k8EW9CyawiBKnyan80Ycr3ra9uWLPLbeGSSn53L64Z6dmavOYxXpWKc8/PyL0T+J6gbOiTzjRx7OO6I7wvSmCB+nPnvN3x5+hciP7u5eyZ+JZsGW82qDaHMBfH/A4TwHdg/lFD/ouePRCKRSCRSYP4Ab3bIZHv7YhAAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.296.png": "data:image/png;base64,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",
                "2018年高考文科数学试题-HTML.297.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAUCAYAAAAgCAWkAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABw0lEQVR4nO2WoUsEQRTGH4cchkMwGUQEuSAGsRhEDILIYRARDCIiNhGDiGAQMYhg8D8wmK6JiIhYREyHRQwihyBishlEDCKs38fswd7czuzM4sGF/eAHy7ydN/PevH2zIpkytYzWwDu4jIz1gGuHuReg+x/3Mg4e0k5eBnegAN7CsSKogGGPxfvSbkBTFQRpJvaLOpGhyFgO3IIuDz+94MZi54kPePjzDuY8nBSEzzUtgm3DAmQB5EEZvEbsu+HcOI2Be3AsbiWZ6mQ2wL42xsBM5cXssvzWQadmGwWnCevNiSqjA9BheS9VMDz+SW3sS1SpmfQh9WVZE0/r02FN+mYSn8GW4R3vYNrAtzRu/Ncyhxtmk5gy2H8c114Bj6KCipN3MCVRbVUXs5s3zJkAe2AnxpaT5JOZFdX56KNgec87mEOwGjN+Jqr+4zQNZsAJ2NRsg1LfSKIaEfWtHUlyA2CQgdiDbRAzFNd+50VlTlc13Ag/3Cdp7His/yXDWqwA19YcRHAS74Wyxc47o+jqTFRSbPdMU8QO0i6q39tubAbLe6Hk4JN3SCXBX1PEm/1F1C9IkpjtuAah60rUf1ymTJlaTH//dFEXQDQMqQAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.298.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAmCAYAAAB6beP2AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB4ElEQVR4nO2YPUgDQRCFBwurIFiIiIW9iNhaBAlYiYgIVkHsQhAREcFCxMJGLFLaiFiJjaWIIFYp7MRCJKQRsU8lIiLEN64LZ7j9yZ23K8d+8ECcnb03w+3PhSgQCASypwTd+zbhigbU9m3CJaHYvBKKzSuh2DxSIFFsIe1Eq9BLgjyXnW5H1Al7X7OZZAWqQYMJDfwH2PshtG4a+JriIUmLvYRGUzxXxZtpQJxh+bqUoV7oFHqyyLXNK0J30Ak0bDLYBcbmfyj+z52/JfFq9HcxuU2eZJHEnXcf6jMZteBTF5yBrjXxFjShias6acqL0gNtQE1oyzJHRR2aUwXZ7JQixq/hM4mG6PKT5HVShR5IFB33DJMkRYWnb7gLdUVsGtqDdjQm4ya2yZMskPhG5fGpz09wA83qBqjWLDdiHjqHNhVj4oq1yZsksa6P6G83KO2aZeIMN35M8KbxCG1b5trmXVA2R49xN/ZxzmaFsRa+QfHtYyjB5C6L5WPsisSy47U5EInJG1TVZqIKxR/+Jt4T5CRlFxoncVQdkNgTJOy94tBL5pQjf/Oe4LLR3mn5NuAKXr813yZcsQSN+DbhAt6gln2bcEXJtwFXyF9Txkh8C+eWM/r9pXPs104gEMiCL5hQcnsXjhioAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.299.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAUCAYAAAAp46XeAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABeUlEQVR4nGNgGAWjYMQCWSDei8T3AuJfQPwfSnsQaY4jEF9A4m8BYmlqOJBcoALEx4HYFEkM2UMeUD4x4AYDJEBgAOZZJQrdSBZgAuKDQCyOJv6fAB8fQFcrD8T7idUIwtFAzAbES4H4PhZ1yMkKhrGBWCCuJsKBlHgOBOqhdhEEWgyQZFQAxIJY5EHJ6BsDcflkEwNqcsTlQEo9Zw3E64g14B0QG+CQA8WYF5HmfGGAJE10QG3PgVLZJ2I0gxQ+ZMDtgf84MDbwh0gHUuo5ECCqUHIB4mYgrsVjCLFFNyg02bCIU9tzTAxExpwfEAcA8RogLsEiT0qe28AAyQ/ogNyqgIcB4jkeNHE9Bkj+xgtA9QioUuQD4msM2Es6ZAcRSpaRDJBUgE8/ch6+AsS78bgPl33lQByPRx/NAKgOUiFSLQcQvyTRfHEGIus5WgBQJXuOgbhkDMoG2JIxLmDLAKm2BqSFAgOg0N1CA3N3MEDaraNgFIyCQQAAEe9hacjMsUIAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.300.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHIAAAAUCAYAAABRcGk6AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAB5klEQVR4nO2YsUoEMRCGBwsROQQLsbCzFAtbCwvBQq4QEcTCFxALkUOwEAux8QkEsRALsRErEcEHsBMLkcNGLEWwPA6b8w/Zw2W5JDN7m6wu+eErks3N/JPsZjdHFBUVFRXlWZ0AOebBk6f8Ifzb5LM2kUIka1ry/PeF9FmbSKGSVXUhlbi13YKpkCY6CetgEFyAN2EM7hhfC1kHrwlr4JPkdfXrIds/Bx7BGZhgxBR5NZlQd84D2AajjKQuhVxIVfwzmAbD4I705ClJ6urHg61/lfSWfARGLHFFXm0T+QVmXAEcMVxjil7ISfAOxlN992A51ebWldeDq19pADRI7xi7lnFsr6Zk6nFWE1K3/M6EJI9ta+fEzvYdg81UW93JLdL1ELnrkuY31WDr72qD9M7RMFzneHUmWwCHYL+PGJwxRT+RH2Ao1T4BN6m2pK68Hlz9K6SPLMpHzRJX5NWUbIn0dnQFdnLG6KqWjOlluuiFbJN+t4yBA3AOtuj3rpbUxZGktlnS77xTcn/sKIm89prIZpJIvYhfwF6OGNnr3K1Rquzv1eJ9g2vSi3lJ+rN/keR1cfNza1M7A/f4IfZa9jmsCudIkyr5h4Cv/GX7tymot3bIZB7yl+3fpr/sLSoqKioqqrL6ARa6ruqiV23EAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.301.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAUCAYAAAA6NOUqAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABdklEQVR4nGNgGAWjYMSD/wNotyMQX8AhR4m78JlLNUsoBTfw2E+Ju/CZSzVLqAEo8bwWEG+jQD9ORV5AfAuKw4H4NVQtCEcDMRsQLwXi+8RYQob9+BwvDcTzgfg4EJuToR+vIpDnrgCxDhBzAfEOqGUgoAW1tACIBYmxgAz7cYnzAXErEF8CYj8yzcWrSAmIHwKxOJLYbiAOQOK/A2IDYgwnw35c4kVAfA2Ic4CYiQJz8SqaBsRZSHxQ7H5jgCRzBigNChwvPObhwqQ4El28nAGSBUEpjmaefwnEHEj8mUC8BYnvAsTNQFxLjOFk2I9PHBQRXQyQFBBEprl4Ff1ggORrUSBuBOKFQJzHgIhpUF4DZYE1QFxCjAV4AA/Ufh4i3IUMZIF4LgPuAg+fuXgtAXn4FxCvY4AEwHIGSHXiwQCpP0ElLajgAYV+NSHDibAbV5YgtqrbgkWcUFYjyZKBAHRx14j2/A96WEIGGKzuGgWjYBQMIQAAxbBnMxEDRbsAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.302.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAASCAYAAAA31qwVAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABKklEQVR4nGNgGAWDC/AAsehAOwIGOIA4Goh7gLgWiCWxqPEC4l9A/B9Ke9DKMWxAHAp1TCMQ6xFQj+wYDyifaoAFiAOAuA+IO4DYlAS9/wnwsQJQMN+C4nAgfo1FjRoQX2OARBU5gGSHgdLGFSDWAWIuIN4BxPPxqLdngERdPRDb0sphSkD8EIjFkcR2M0CiixBgAmI3IG5mgDiUULSS5LBpQJyFxBcE4m8MkISNDkyhjgA5mgWLI/2AuBXqSGlKHfaSAZLVYWAmEG/BpwEIjBkg0dgMdQwTmjzI0djKMZIc9gOItaAGgXy6EIjzGCCZgRgACsUOqCO9sDgSGZBUXDRCFayDOm45EG9jIK/ws2aARCXIofJY5GGOgRWwxHqeqgA9DY6CUTAoAABMKzvKX2wyYAAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.303.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAUCAYAAADWQYA8AAAACXBIWXMAAA7DAAAOwwHHb6hkAAABq0lEQVR4nO2WoUsEQRTGHxdE5BAMYrCJQcRgMYtgkEPEZrCLGMQgiMgFsYiIiEEwiUEsYhIR/AOsBhG5IkYRjHJY9Pt4c7gsO3Ozu8feofPBj2NmH/O9e7NvZkWCgv6SRosw+S7CxKIp8GB5Fs9rFuyDbTDWQh+naZF6dvjb5rvAItgD62Awp4+XaVFKW4yo+sAy2AFLoDeDj1dQBdQMC+DdxBLuDHfoHLz4mGTwT7NJLMqWaCuM5FkvKYh/9lG0N3vALTg1z3iQ3YM1k0ReZS1Gv+hbcQCqYi+C73qJQUPgFQxE5u7AfGT8AcZ9Fs/g75rn+bACDsGmNC+Aj48z6NgYNsTd/xRtCzG/LFbFsZ6NNEnG549EW2E4IbYE5kTPjomUPs6gN9AdGZ+A68h42phWfRbP4N9sviEWgNctb5VdsRfBd73EoLroucCe5J1+Blbl903gDrBlLkWvtjwqG/+yR14UCzAj+r3BIky2wMdpygJ8gSvRglyAG5ME72v2La+wJ9HXNo9cLRSf2xBtFeZRaqGP07RT1Ja8QjEiqrfD1EOdmldQUNA/1g+4O2tZuErJAwAAAABJRU5ErkJggg==",
                "2018年高考文科数学试题-HTML.304.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAASCAYAAAA+PQxvAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAA5klEQVR4nGNgGAUjHHgB8S8g/g+lPQbKIciWe0D5VAPbgFiLSLX/CfCxAlAw3oLicCB+jUOdLRCfA+L5QCxNbYdEA/EVINYBYi4g3gG1CB8IBeIbQNwBxHzUcIgSED8EYnEksd1AHEDAISDABMRFDJBQLKfUIdOAOAuJLwjE34CYjQiHgEAGAyQ0iyh1yEsg5kDizwTiLUQ4IAiILwBxMxDz4FBDkkN+MEBygSgQNwLxQiDOY4AkXmzAEoiPA/FsBsKJlaTs2whVsA7qmOUMkCyKq/DZwkB89oVZDivQcHluFIyCwQ8AEes3h4Ie448AAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.305.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAAmCAYAAACRWlj1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAByElEQVR4nO2ZPyhFURzHfxkkgzLoDZIySrKZleFlkCwGyS5JUgZJksVgVAbJIItMkpLZLklvkVHKKFmu77fffXWTd/8c57zzXOdTn+47993763fevfec37lPJBAIBMzphlfwE97AHr/p2GcTDsM2uAvP/KZjn9nE5y744SuRZvHmOwGX8Hnc852ES+Zgv+8kXMFBZt53Ei4Z852ASyrxdggeZR08ITppRvG26i4vK5yK5lr3MOuEZKeqcbtURBntNAbhpcVcnMQ06WCv6L1/C0cbxKSsOtrhCXz6ZUxjinSQpdEOvIOTGXF5JZjssuiEbCOmEXk7uAIf4KLoHJQHllEjKd+bxCxM3g6uwZroFcmTDG/NZ9FRuhF5Y0Y5bXhyWjsJbzUuUfirT6ccR8bhNtzIOK5ITCNMpok+0fknbUDg8zQlul5btRTTiHqn6hN92i31HQ4kFz/sfxQdFTmA8MqsW4gZCAQCTYGDYC12Br76TccurG3vRdeBnaLvRzPXg3+FAdHKqJLYdy0615aCfbiQaLMCehctCUvBC+xItA+kZAUB32CzyuF/EVvwGC5JscqrpWGnWEqei3aS72a48m/1d0iBwL/jC/jJaDgxGU3cAAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.306.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABj0lEQVR4nO2YwStEURSHTxaSJmUhCwslC0l21rKbJNlZSHaShZWSJMlGkmShLCQrG1lJSv4HCwvZWUpZSjbj9+u85116d9wxvXdK96uvmak30zfz7tx3ZkQiERs64TX8gLewyzYnYwMOwxa4A89tczJmnPsd8N0q5DderQPy4Hrbs47IYxb2Wkf8hIt/zjoijzHrgDy6k9sheOI5ZrCkli/OYM3x2HPcBNyFm6JvoBF4Nu7+GhhKq+jex814GfYEPOdB9E2XBreXBbgF50U3aB+lhqUwcE30dA14jiktjBd7flrckNfrBKUUGsb1tAj34WpAjEtwWC1AlwPR09Wf81rcnCdF19pIs2HNwhhuIfx2btcJSik0jDFV0f2MQaOBz6uIhlWKiFoRPZ3VJLARfMsjEjFnHD4mTsMX2xyFk8K96CjTLvob0zeTlUYffJJsUCQ3cMomJ+NQ9NqXwinhTXTmMuUZtjmPj+ClUcs3+KubszxHGI7Mp3BJ9MtgCmP4Z8qFaBzn/yvRy04k8m/4BAj1RzqLzly3AAAAAElFTkSuQmCC",
                "2018年高考文科数学试题-HTML.307.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAASCAYAAADlhqZNAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABx0lEQVR4nO2WMUgDMRSGH1JERAQHESkiODgUcRFxEBEXKQ4igjgUcRcRcXESKUUQkY6CQylOLuIkUhBndxEHN0cRHEVc6v/77spxmORSCxa5Hz5613vJ5U9eXk4kVap2UA/ob1VnC+AT1IPffKs6/oW6QAEcgz0waIjrAzXRcd9KgkmJGswH93+hTrAiarAIxhO02Q/iOsARuHA1qDvubcqBa4/4uDJgCZTBIZj0bF+IXPeCD1eDZsxmQRXcgSlDDLfHU8AqeI09HwWPomnaKr25AnzMcvYOwD1YtMRxxh/AGOgW3VdVQ+ysaNoyJWdcg7WI+7fsCkpqdkd0JTZF94hJI+AZDET+uxFNV5vY5zwoiZr3Tek1MOwKSmp2VzQlt8Vu9gRsRO454++iBSgqmqExTkIm9oz9M3OYRTSetbwvjF93xHzLJ405cFY9rvCyIeZF9OgIdQquLH1OiKYwjdNgfCI5Ea4jZc7xvKFmjp4hUJGfCxQrYi4YIFflDGyJFiyXuNqsyqUg3pZBocLtwvpgqgsNhQbDj4okgwpFU/FVKwb9XIoaPhc9nnw/VqZF05jmTXuRfdcjVDzf0ZaK7+lUqVL9U30BenFVkMytgaMAAAAASUVORK5CYII=",
                "2018年高考文科数学试题-HTML.308.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAUCAYAAADoZO9yAAAACXBIWXMAAA7DAAAOwwHHb6hkAAABAUlEQVR4nGNgGAVDCMgC8V4kvhcQ/wLi/1Dag4B+QSDeAVULMkcUKv4fCRMEKkB8HIhNkcSQLfeA8vGBeiDWA2ImIO4C4jVo8gQdAtJ4EIjFCWgkZFA0EpsPiH+Q6pBYIK7GIk6qQ9DBO1L1b2JAjRJqOASUXvpI1f+FARI91HQIKJTlSdX/B4c4uQ4BeSqeCPMwwCcgZqOiQxxxiBPUvwGIrbGIk5p9QQCW83SAeD6pDokE4mYs4jDLYQWaF5LcFSDejaZ+OQNq4TWXVIeAwH4GSKFGLOAA4pckqCfaIaAUfo6BcDEOAyUM2KOTYoeAACh+t5BoODHgBxIeBaOAZAAABVlF4N7rba0AAAAASUVORK5CYII="
              }
            },

      // 全卷导入显示内容控制
      Question_Edit_Now: -1,
      Question_Edit_Part: "",
      Question_Edit_Option_Index: -1,
      Question_Edit_Sub_Ques_Index: -1,
      Question_Edit_Answer_Index: -1,
      Question_Check: [],
      Submit_Show: false,

      Sequence_Questions: "1",
      // 是否显示导入试卷的对话框
      importPaperDialog: false,
      // 选择题编辑器,填空题编辑器和解答题编辑器的显示控制
      showDialog: false,
      showDialog_Fill: false,
      showDialog_Answer: false,
      showDialog_Mix: false,
      // 非法输入格式提示
      showHint: false,
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
  mounted(){
    this.Init_Question_Check()
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

      console.log(val)

        if(val.type != 'mix'){
          this.Normal_Char_Check(val);
        }else{
          this.Mix_Char_Check(val)
        }

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

        if(val.type != 'mix'){
          this.Normal_Char_Check(val);
        }else{
          this.Mix_Char_Check(val)
        }
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
        this.showHint = false;

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
    // 尝试进行导出
    PaperUpload(Control){

      if(this.Symbol_Error){
        this.$message.error("仍有非法字符存在，请修改后重新尝试。")
        return null;
      }

      var Upload_Json = {
        "title": this.PaperTitle,
        "subject_type": this.SubjectType,
        "period_type": this.PeriodType,
        "source": "USER_ID",
        "img": {},
        "doc": []
      }

      for(var len = 0; len < this.Questions.length; len++){

        for(var i = 0; i < this.Questions[len].Bundle_Questions.length; i++){


          var Temp_Doc = {
            "question_stem": "",
            "question_options": [],
            "question_type": "",
            "sub_questions": [],
            "answer": "",
            "analysis": ""
          }

          var Ques = this.Questions[len].Bundle_Questions[i]

          if(Ques.type == 'option'){
            // 题型
            Temp_Doc.question_type = "选择题"
            // 题干
            Temp_Doc.question_stem = Ques.content;
            for(var img_l = 0; img_l < Ques.content_images.length; img_l++){
              Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
            }
            // 答案
            Temp_Doc.answer = Ques.answer;
            for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
              Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
            }
            // 解析
            Temp_Doc.analysis = Ques.analyse;
            for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
              Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
            }
            // 选项
            for(img_l = 0; img_l < Ques.options.length; img_l++){
              var optionInfo = Ques.options[img_l];
              if(Ques.options_images[img_l] != ""){
                optionInfo = optionInfo + "<img src='" + Ques.options_images[img_l] + "'>"
              }
              Temp_Doc.question_options.push(optionInfo)
            }

            Upload_Json.doc.push(Temp_Doc)
          }else if(Ques.type == 'fill'){
            // 题型
            Temp_Doc.question_type = "填空题"
            // 题干
            Temp_Doc.question_stem = Ques.content;
            for(img_l = 0; img_l < Ques.content_images.length; img_l++){
              Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
            }
            // 答案
            Temp_Doc.answer = Ques.answer;
            for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
              Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
            }
            // 解析
            Temp_Doc.analysis = Ques.analyse;
            for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
              Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
            }

            Upload_Json.doc.push(Temp_Doc)
          }else if(Ques.type == 'answer'){
            // 题型
            Temp_Doc.question_type = "解答题"
            // 题干
            Temp_Doc.question_stem = Ques.content;
            for(img_l = 0; img_l < Ques.content_images.length; img_l++){
              Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
            }
            // 答案
            Temp_Doc.answer = Ques.answer;
            for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
              Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
            }
            // 解析
            Temp_Doc.analysis = Ques.analyse;
            for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
              Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
            }
            // 小题
            for(img_l = 0; img_l < Ques.sub_questions.length; img_l++){
              var subTemp = Ques.sub_questions[img_l];
              for(var inner = 0; inner < Ques.sub_questions_images[img_l].length; inner++){
                subTemp = subTemp + "<img src='" + Ques.sub_questions_images[img_l][inner] + "'>"
              }
              Temp_Doc.sub_questions.push(subTemp)
            }

            Upload_Json.doc.push(Temp_Doc)
          }else if(Ques.type == 'mix'){

            var O_Ques = this.Questions[len].Bundle_Questions[i];
            var O_Answer = O_Ques.answer.split("::");

            for(var B_inner = 0; B_inner < this.Questions[len].Bundle_Questions[i].sub_questions.length; B_inner++){

              Temp_Doc = {
                "question_stem": "",
                "question_options": [],
                "question_type": "",
                "sub_questions": [],
                "answer": "",
                "analysis": ""
              }

              Ques = this.Questions[len].Bundle_Questions[i].sub_questions[B_inner]

              if(Ques.type == 'option'){
                // 题型
                Temp_Doc.question_type = "选择题"
                // 题干
                Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
                for(img_l = 0; img_l < Ques.content_images.length; img_l++){
                  Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
                }
                // 答案
                if(O_Answer[B_inner]){
                  Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
                }else{
                  Temp_Doc.answer = Ques.answer;
                }
                for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
                  Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
                }
                // 解析
                Temp_Doc.analysis = Ques.analyse;
                for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
                  Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
                }
                // 选项
                for(img_l = 0; img_l < Ques.options.length; img_l++){
                  optionInfo = Ques.options[img_l];
                  if(Ques.options_images[img_l] != ""){
                    optionInfo = optionInfo + "<img src='" + Ques.options_images[img_l] + "'>"
                  }
                  Temp_Doc.question_options.push(optionInfo)
                }
              }else if(Ques.type == 'fill'){
                // 题型
                Temp_Doc.question_type = "填空题"
                // 题干
                Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
                for(img_l = 0; img_l < Ques.content_images.length; img_l++){
                  Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
                }
                // 答案
                if(O_Answer[B_inner]){
                  Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
                }else{
                  Temp_Doc.answer = Ques.answer;
                }
                for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
                  Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
                }
                // 解析
                Temp_Doc.analysis = Ques.analyse;
                for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
                  Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
                }
              }else if(Ques.type == 'answer'){
                // 题型
                Temp_Doc.question_type = "解答题"
                // 题干
                Temp_Doc.question_stem = this.Questions[len].Bundle_Questions[i].content + " " + Ques.content;
                for(img_l = 0; img_l < Ques.content_images.length; img_l++){
                  Temp_Doc.question_stem = Temp_Doc.question_stem + "<img src='" + Ques.content_images[img_l] + "'>"
                }
                // 答案
                if(O_Answer[B_inner]){
                  Temp_Doc.answer = O_Answer[B_inner] + " " + Ques.answer;
                }else{
                  Temp_Doc.answer = Ques.answer;
                }
                for(img_l = 0; img_l < Ques.answer_images.length; img_l++){
                  Temp_Doc.answer = Temp_Doc.answer + "<img src='" + Ques.answer_images[img_l] + "'>"
                }
                // 解析
                Temp_Doc.analysis = Ques.analyse;
                for(img_l = 0; img_l < Ques.analyse_images.length; img_l++){
                  Temp_Doc.analysis = Temp_Doc.analysis + "<img src='" + Ques.analyse_images[img_l] + "'>"
                }
                // 小题
                for(img_l = 0; img_l < Ques.sub_questions.length; img_l++){
                  subTemp = Ques.sub_questions[img_l];
                  for(inner = 0; inner < Ques.sub_questions_images[img_l].length; inner++){
                    subTemp = subTemp + "<img src='" + Ques.sub_questions_images[img_l][inner] + "'>"
                  }
                  Temp_Doc.sub_questions.push(subTemp)
                }
              }

              Upload_Json.doc.push(Temp_Doc)
            }
          }

        }

      }

      if(Control == 'upload'){

        let config = {
            headers: { "Content-Type": "multipart/form-data" }
        };
        let param = new FormData();

        param.append('result_json', JSON.stringify(Upload_Json));
        this.$http
        .post(this.backendIP + "/api/mathUpload", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          console.log(data.data)
        });

      }else if(Control == 'export'){

        var file = new File(
          [JSON.stringify(Upload_Json, null, 4)],
          this.PaperTitle + ".json",
          { type: "text/plain;charset=utf-8" }
        );
        FileSaver.saveAs(file);

        var Upload_Json_2 = {
        "title": this.PaperTitle,
        "subject_type": this.SubjectType,
        "period_type": this.PeriodType,
        "questions": this.Questions,
      }

        var file_2 = new File(
          [JSON.stringify(this.Upload_Json_2, null, 4)],
          this.PaperTitle + "_Full.json",
          { type: "text/plain;charset=utf-8" }
        )
        FileSaver.saveAs(file_2);

      }

    },
    // 以下是单题显示配套用的方法
    Ensure(){
      this.$confirm("您已经锁定了所有题目，确认审核完毕请点击确认提交，仍有更改请点击取消。").then( () => {
        this.$message.success("已提交");
        this.Submit_Show = true;
        this.Submit();
      }).catch(() => {
        this.$message.info("已取消");
        this.Submit_Show = true;
      })
    },
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
    Get_Sub_Question(Stem){
        for(var key in this.TestData.img){
            var Img_Name_Catcher = new RegExp('<IMG: ' + key + '>')
            if(Img_Name_Catcher.exec(Stem) != null){
                Stem = Stem.replace(Img_Name_Catcher,'<img src="' + this.TestData.img[key] + '">')
            }
        }
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
      this.importPaperDialog = true;
    },
    // 检测是否有非法字符 - 综合
    Mix_Char_Check(val){

      var Check_Now = val.content;
      if(Check_Now!= "" && !this.ChecK_Do(Check_Now)){
        return false
      }

      var Check_Now_List = val.answer;
      Check_Now_List = Check_Now_List.split("::");
      for(var j = 0; j < Check_Now_List.length; j++){
        var item = Check_Now_List[j]
        if(item != "" && !this.ChecK_Do(item)){
          return false
        }
      }

      Check_Now = val.analyse;
      if(Check_Now!= "" && !this.ChecK_Do(Check_Now)){
        return false
      }

      Check_Now_List = val.sub_questions;
      for(var len = 0; len < Check_Now_List.length; len++){
        item = Check_Now_List[len]
        if(!this.Normal_Char_Check(item)){
          return false
        }
      }

      this.Symbol_Error = false;

    },
    // 检测是否有非法字符 - 选择-填空-解答
    Normal_Char_Check(val){

      var Check_Now = val.content;
      console.log("con")
      if(!this.ChecK_Do(Check_Now)){
        return false
      }

      var Check_Now_List = val.answer;
      console.log("ans")
      if(Check_Now_List.indexOf("::") != -1){

        Check_Now_List = Check_Now_List.split("::");

        for(var j = 0; j < Check_Now_List.length; j++){

          var item = Check_Now_List[j]
          
          if(item != "" && !this.ChecK_Do(item)){
            return false
          }

        }
      }else{
        if(Check_Now_List != "" && !this.ChecK_Do(Check_Now_List)){
          return false
        }
      }

      Check_Now = val.analyse;
      console.log("ana")
      if(Check_Now != "" && !this.ChecK_Do(Check_Now)){
        return false
      }

      if(val.type == 'option'){
        console.log("opt")
        Check_Now_List = val.options;
        for(var opi = 0; opi < Check_Now_List.length; opi++){

          item = Check_Now_List[opi]
          
          if(item != "" && !this.ChecK_Do(item)){
            return false
          }
        }
      }else if(val.type == 'answer'){
        Check_Now_List = val.sub_questions;
        for(opi = 0; opi < Check_Now_List.length; opi++){
          item = Check_Now_List[opi]
          if(item != "" && !this.ChecK_Do(item)){
            return false
          }
        }
      }

      this.Symbol_Error = false;
    },
    // 负责实际检查的部分
    ChecK_Do(Check_Now){

      var Flag = true;

      var Img_Catcher = new RegExp("<img src='(.*?)'>")
      var Result_List = Img_Catcher.exec(Check_Now);

      if(Result_List != null){
        for(var rl = 0; rl < Result_List.length; rl++){
          var Temp_Catcher = new RegExp(Result_List[rl])
          Check_Now = Check_Now.replace(Temp_Catcher, "");
        }
      }

      for(var c = 0; c < Check_Now.length; c++){
        
        if(Check_Now[c] == '$'){
          if(Flag){
            Flag = false;
            this.Symbol_Error = true;
          }else{
            Flag = true;
            this.Symbol_Error = false;
          }
        }

        if(!(Check_Now.charCodeAt(c) > 255 || this.ch_pun_list.indexOf(Check_Now[c]) != -1 || this.en_pun_list.indexOf(Check_Now[c]) != -1 || Check_Now[c] == ' ') 
            && Flag 
            && Check_Now[c] != '$'){
          this.$message.error("请勿输入非法字符，或将字母，罗马符号及数字包裹在$$之间进行输入");
          this.Symbol_Error = true;
          return false;
        }
      }
      if(Flag){
        return true;
      }
      else{
        this.$message.error("请勿输入非法字符，或将字母，罗马符号及数字包裹在$$之间进行输入");
        return false
      }
    },
    Submit(){

      var Docs = this.TestData.doc;

      for(var i = 0; i < Docs.length; i++){

        var Ques = Docs[i]

        var stem = Ques.question_stem;
        if(!this.ChecK_Do(stem)){
          this.$message.error("第"+ (i+1).toString() + "题题干内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
          return false;
        }

        var answer = Ques.answer;
        for(var j = 0; j < answer.length; j++){

          var item = answer[j]
            
          if(item != "" && !this.ChecK_Do(item)){
            this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "部分答案内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
            return false
          }

        }

        var analyse = Ques.analysis;
        if(!this.ChecK_Do(analyse)){
          this.$message.error("第"+ (i+1).toString() + "题解析内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
          return false;
        }
      
        var options = Ques.question_options;
        for(j = 0; j < options.length; j++){
          if(!this.ChecK_Do(options[j])){
            this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "选项内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
            return false;
          }
        }

        var sub_Ques = Ques.sub_questions;
        for(j = 0; j < sub_Ques.length; j++){
          if(!this.ChecK_Do(sub_Ques[j])){
            this.$message.error("第"+ (i+1).toString() + "题第" + (j+1).toString() + "小题内容存在非法字符，请更正，或将字母，罗马符号及数字包裹在$$之间进行输入");
            return false;
          }
        }

      }

      // let config = {
      //     headers: { "Content-Type": "multipart/form-data" }
      // };
      // let param = new FormData();

      // param.append('result_json', JSON.stringify(this.TestData));
      // this.$http
      // .post(this.backendIP + "/api/mathUpload", param, config, {
      //   emulateJSON: true
      // })
      // .then(function(data) {
      //   console.log(data.data)
      // });

      console.log(this.TestData);
      console.log("Ready To Upload. Waiting for database design.")
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
