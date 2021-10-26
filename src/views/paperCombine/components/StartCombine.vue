<template>
  <div style=" padding-top: 5vh; padding-bottom: 5vh; min-height: 40vh; padding-left: 5vw; padding-right: 5vw; background: #EEF5FE">
    <el-dialog 
      :visible.sync="Question_Check_Switch"
      title="题目内容检查"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="true">
      <el-row type="flex" justify="center">
        <el-col>
          <!-- 分数，题型，题干 -->
          <el-row type="flex" justify="center" style="width: 100%">
            <el-col :span="4">
              <el-row type="flex" justify="start">
                <label style="margin-right: 10px;">{{Checked_Question_Info.type}}</label>
                <label style="margin-right: 10px;">  -  </label>
                <label>{{Checked_Question_Info.score}}分</label>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row type="flex" justify="start">
                <Mathdown :content="Checked_Question_Info.stem" :name="'Checked_Question_Stem'"></Mathdown>
              </el-row>
            </el-col>
          </el-row>
          <!-- 选项 -->
          <el-row type="flex" justify="center" style="margin-top: 2vh">
            <el-col :span="4">
              <el-row type="flex" justify="start">
                <label>选项：</label>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row 
                v-for="(Option, OptionIndex) in Checked_Question_Info.options" 
                :key="'Checked_Options_' + OptionIndex"
                style="margin-bottom: 2px;">
                <Mathdown 
                  :content="Get_Option_Index(OptionIndex) + ':  ' + Option"
                  :name="'Checked_Options_' + OptionIndex"></Mathdown>
              </el-row>
            </el-col>
          </el-row>
          <!-- 答案 -->
          <el-row type="flex" justify="center" style="margin-top: 2vh">
            <el-col :span="4">
              <el-row type="flex" justify="start">
                <label>答案：</label>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row type="flex" justify="start">
                <Mathdown :content="Checked_Question_Info.answer" :name="'Checked_Question_Answer'"></Mathdown>
              </el-row>
            </el-col>
          </el-row>
          <!-- 解析 -->
          <el-row type="flex" justify="center" style="margin-top: 2vh">
            <el-col :span="4">
              <el-row type="flex" justify="start">
                <label>解析：</label>
              </el-row>
            </el-col>
            <el-col :span="20">
              <el-row type="flex" justify="start">
                <Mathdown :content="Checked_Question_Info.analyse" :name="'Checked_Question_Analyse'"></Mathdown>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog 
      :visible.sync="Download_Combine_Paper_Dialog"
      title="试卷下载"
      width="50%"
      @close="Reset_Combine_Paper_Download_Setting()"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      >
      <!-- 纸张类型 -->
      <el-row type="flex" justify="start" style="margin-bottom: 20px;">
        <el-col :span="3">
          <el-row type="flex" justify="start" style="margin-top: -3px;">
            试卷纸张：
          </el-row>
        </el-col>
        <el-col :span="21">
          <el-row type="flex" justify="start">
            <el-radio-group v-model="Combine_Paper_Size">
              <el-radio label="A4">标准A4</el-radio>
              <el-radio label="A3">双栏A3</el-radio>
              <el-radio label="B4">双栏B4</el-radio>
            </el-radio-group>
          </el-row>
        </el-col>
      </el-row>
      <!-- 试卷内容 -->
      <el-row type="flex" justify="start" style="margin-bottom: 20px;">
        <el-col :span="3">
          <el-row type="flex" justify="start">
            试卷内容：
          </el-row>
        </el-col>
        <el-col :span="21">
          <el-row type="flex" justify="start">
            <el-checkbox-group v-model="Combine_Paper_Content">
              <el-checkbox label="Answer">答案</el-checkbox>
              <el-checkbox label="Analyse">解析</el-checkbox>
            </el-checkbox-group>
          </el-row>
        </el-col>
      </el-row>
      <!-- 试卷类型 -->
      <el-row type="flex" justify="start">
        <el-col :span="3">
          <el-row type="flex" justify="start" style="margin-top: -3px;">
            试卷类型：
          </el-row>
        </el-col>
        <el-col :span="21">
          <el-row type="flex" justify="start" style="margin-bottom: 10px;">
            <el-radio v-model="Combine_Paper_Type" label="Teacher">教师用卷（题目后附带答案及解析）</el-radio>
          </el-row>
          <el-row type="flex" justify="start" style="margin-bottom: 10px;">
            <el-radio v-model="Combine_Paper_Type" label="Student">学生用卷（无答案及解析）</el-radio>
          </el-row>
          <el-row type="flex" justify="start" style="margin-bottom: 30px;">
            <el-radio v-model="Combine_Paper_Type" label="Normal">普通用卷（卷后统一提供答案及解析）</el-radio>
          </el-row>
        </el-col>
      </el-row>
      <!-- 下载行 -->
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <el-row type="flex" justify="center">
            <el-button type="info" @click="Download_Combine_Paper_Dialog = false">取消</el-button>
          </el-row>
        </el-col>
        <el-col :span="4">
          <el-row type="flex" justify="center">
            <el-button type="success" @click="Download_Paper()">下载</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog 
      :visible.sync="Replace_Dialog_Show"
      title="换一题"
      width="70%"
      @close="Replace_Dialog_Close()"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      >
      <el-row
        v-if="Replace_Question_List.length == 0"
        style="min-height: 60vh"
        v-loading="loading"
        element-loading-text="正在检索试题中..."
        element-loading-spinner="el-icon-loading">

      </el-row>
      <el-row
        v-for="(Question, Question_Index) in Replace_Question_List"
        :key="Question_Index"
        style="margin-bottom: 50px"
        type="flex" justify="start"
        >
        <el-col :span="20" class="quesCard">
          <el-row style="text-align: left; padding-top: 15px; background: white; padding-bottom: 15px">
            <el-col style="padding-bottom: 15px" >
              <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
            </el-col>
            <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
              <el-row style="line-height: 40px" type="flex" justify="start">
                <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
                <Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 10px; padding-top: 10px;">
              <el-col :span="5" style="line-height: 40px; color: #888; font-size: 1.5rem; padding-left: 30px; text-align: left">
                所属题库：{{Question.database}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem;">
                题型：{{Question.type}}
              </el-col>
              <el-col :span="3" style="line-height: 40px; color: #888; font-size: 1.5rem">
                难度：
              </el-col>
              <el-col :offset="9" :span="3" style="line-height: 40px;">
                <el-button :disabled="Replacable(Question.id)" size="medium" plain round type="primary" @click="Replace_Question(Question_Index)">替换试题</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
      <el-row>
        <el-col :span="5">
          <!-- 设置区块 -->
          <el-row class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-top: 5px;">
                <label>试卷导出设置</label>
              </el-row>

              <el-row type="flex" justify="start" style="margin-top: 10px">
                <label style="height: 30px; line-height: 30px; margin-left: 7px; width: 60px;">形式：</label>
                <el-radio-group v-model="Export_Setting_Type" style="margin-top: 7px;">
                  <el-radio label="simple" style=" width: 60px;">简易</el-radio>
                  <el-radio label="standard" style="margin-left: -15px; width: 60px;">标准</el-radio>
                </el-radio-group>
              </el-row>

              <el-row type="flex" justify="start" style="padding-left: 15px">
                <el-button type="text" size="medium" style="color: grey" @click="Setting_Expand = !Setting_Expand">
                  <span style="margin-right: 10px;">高级设置</span>
                  <i v-if="Setting_Expand" class="el-icon-arrow-up"></i>
                  <i v-else class="el-icon-arrow-down"></i>
                </el-button>
              </el-row>

              <el-row v-if="Setting_Expand" style="margin-top: 5px;">
                <el-checkbox-group v-model="Setting_CheckBox_List" style="text-align: left">
                  <el-row v-for="Row_Index in 5" :key="'Setting_Row_' + Row_Index" style="margin-top: 5px">
                    <el-col :span="12" v-for="Col_Index in 2" :key="'Setting_Col_' + Col_Index" style="padding-left: 15px">
                      <el-checkbox v-if="(Row_Index - 1) * 2 + (Col_Index - 1) < 9" :label="Setting_CheckBox_Label[(Row_Index - 1) * 2 + (Col_Index - 1)]"></el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </el-row>

            </el-col>
          </el-row>
          <!-- 下载区块 -->
          <el-row style="margin-top: 30px;" class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-bottom: 5px;">
                <el-button type="primary" plain round style="font-size: 14px" @click.native="Download_Combine_Paper()">
                  <i class="el-icon-download"></i>
                  <span>下载试卷</span>
                </el-button>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Analyse_Combine_Paper()">
                      <i class="el-icon-s-data"></i>
                      <span>分析试卷</span>
                    </el-button>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Unfinish()">
                      <i class="el-icon-document-checked"></i>
                      <span>保存试卷</span>
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>

              <el-row type="flex" justify="start">
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Check_Answer_Card()">
                      <i class="el-icon-s-data"></i>
                      <span>查看答题卡</span>
                    </el-button>
                  </el-row>
                </el-col>
              </el-row>

            </el-col>
          </el-row>
          <el-row style="margin-top: 30px;" class="Side_Card">
            <el-col>

              <el-row type="flex" justify="center" style="margin-top: 5px; margin-bottom: 15px;">
                <label>试卷数量及快速操作</label>
              </el-row>

              <el-row v-for="(Question_List_Item, Index) in Question_List" :key="'Question_List_' + Index" style="margin-bottom: 15px;">
                <el-col>
                  <!-- 顶行：题型及删除操作 -->
                  <el-row style="margin-bottom: 10px;">
                    <el-col :span="10">
                      <el-row type="flex" justify="start" style="height: 30px; line-height: 30px;">
                        <label>
                          {{Get_Chinese_Index(Index)}}、
                          {{Question_List_Item.type}}
                        </label>
                      </el-row>
                    </el-col>
                    <el-col :span="14">
                      <el-row type="flex" justify="end" style="height: 30px; line-height: 30px">
                        <el-button v-if="Index != 0" type="text" @click="List_Item_Move_Up(Index)" style="padding: 0px">前移</el-button>
                        <el-button v-if="Index != Question_List.length - 1" type="text" @click="List_Item_Move_Down(Index)" style="padding: 0px">后移</el-button>
                        <el-button type="text" @click="Delete_Item(Index)" style="padding: 0px">删除</el-button>
                      </el-row>
                    </el-col>
                  </el-row>

                  <!-- 之后的每一道题的操作 -->
                  <el-row v-for="Row_Index in Math.ceil(Question_List_Item.list.length / 6)" :key="'Setting_Row_Index_' + Row_Index">
                    <el-col :span="4" v-for="Col_Index in 6" :key="'Setting_Col_Index_' + Col_Index">
                      <el-popover 
                        trigger="click"
                        width="250"
                        placement="bottom"
                        v-if="((Row_Index - 1) * 6 + Col_Index - 1) < Question_List_Item.list.length"
                        :ref="Get_Pop_Ref(Index, (Row_Index - 1) * 6 + Col_Index - 1)">
                        <el-row type="flex" justify="start" style="margin-bottom: 10px;">
                          <el-col :span="18">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <span style="height: 30px; line-height: 30px; margin-right: 20px">修改为</span>
                              <el-input 
                                class="Custom_Score_Input" 
                                v-model="Custom_Setting_Score" 
                                :placeholder="Get_Custom_Setting_Score_Placeholder(Index, (Row_Index - 1) * 6 + Col_Index - 1)"></el-input>
                              <span style="height: 30px; line-height: 30px; margin-left: 20px">分</span>
                            </el-row>
                          </el-col>
                          <el-col :span="6">
                            <el-row type="flex" justify="end">
                              <el-button 
                                type="text" 
                                size="medium" 
                                style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px"
                                @click="Update_Question_Score(Index, (Row_Index - 1) * 6 + Col_Index - 1)">确认</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <!-- 第一行，上移下移 -->
                        <el-row type="flex" justify="center" style="margin-bottom: 10px;">
                          <el-col :span="12">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <el-button 
                                type="primary" 
                                size="medium" 
                                :disabled="(Row_Index - 1) * 6 + Col_Index - 1 == 0"
                                @click="Question_Move_Up(Index, (Row_Index - 1) * 6 + Col_Index - 1)"
                                >前移</el-button>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" justify="end" style="margin-right: 10px;">
                              <el-button 
                                type="primary" 
                                size="medium" 
                                :disabled="(Row_Index - 1) * 6 + Col_Index == Question_List_Item.list.length"
                                @click="Question_Move_Down(Index, (Row_Index - 1) * 6 + Col_Index - 1)">后移</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <!-- 第二行，查看解析及删除 -->
                        <el-row type="flex" justify="center" style="margin-bottom: 10px;">
                          <el-col :span="12">
                            <el-row type="flex" justify="start" style="margin-left: 10px;">
                              <el-button type="primary" size="medium" @click="Check_Question(Index, (Row_Index - 1) * 6 + Col_Index - 1)">查看</el-button>
                            </el-row>
                          </el-col>
                          <el-col :span="12">
                            <el-row type="flex" justify="end" style="margin-right: 10px;">
                              <el-button type="danger" size="medium" @click="Delete_Question(Index, (Row_Index - 1) * 6 + Col_Index - 1)">删除</el-button>
                            </el-row>
                          </el-col>
                        </el-row>
                        <el-row type="flex" justify="center">
                          <el-button type="primary" size="medium" @click="submit(Index, (Row_Index - 1) * 6 + Col_Index - 1)"><i class="el-icon-refresh" style="margin-right: 15px;"></i>换一题</el-button>
                        </el-row>
                        <el-row 
                          slot="reference"
                          type="flex" 
                          justify="center" 
                          class="Question_Setting_Button"
                          @click.native="Quick_Operation(Index, (Row_Index - 1) * 6 + Col_Index - 1)"
                          v-if="((Row_Index - 1) * 6 + Col_Index - 1) < Question_List_Item.list.length">
                          {{ (Row_Index - 1) * 6 + Col_Index }}
                        </el-row>
                      </el-popover>
                    </el-col>
                  </el-row>

                </el-col>
              </el-row>

            </el-col>
          </el-row>
        </el-col>
        <!-- 显示区 -->
        <el-col 
          :span="18" 
          :offset="1" 
          class="Side_Card"
          v-loading="waiting"
          :element-loading-text="waiting_text"
          element-loading-spinner="el-icon-loading"
          >
          <el-row type="flex" justify="start">
            <el-col :span="1" v-if="Get_Paper_Setting('装订线')">
                <div class="Paper_Seal">
                  <label>学校：</label>____________ <label>班级：</label>____________ <label>姓名：</label>____________ <label>考号：</label>___________
                </div>
            </el-col>
            <el-col :span="Get_Paper_Span()" style="padding-left: 10px; min-height: 630px;">
              <!-- 密封标识 -->
              <el-row type="flex" justify="start" v-if="Get_Paper_Setting('密封标识')" style="font-size: 16px;">
                <label>绝密 ★ 启用前</label>
              </el-row>
              <!-- 关于标题 -->
              <el-row 
                type="flex" 
                justify="center" 
                v-if="Get_Paper_Setting('标题')" 
                @mouseleave.native="Expand_Change('title', 0)" 
                @mouseenter.native="Expand_Change('title', 1)">
                <el-row
                  v-if="Expand_Model.title == 0" 
                  style="padding: 3px; border: 3px solid transparent;"
                  type="flex" justify="center">
                  <label 
                    style="font-size: 20px;">
                    {{Setting_Info.title}}
                  </label>
                </el-row>
                <el-row 
                  v-if="Expand_Model.title == 1"
                  class="Focusing_Part" 
                  @click.native="Expand_Change('title', 2)"
                  style="font-size: 20px; font-weight: bold;"
                  type="flex" justify="center">
                  {{Setting_Info.title}}
                </el-row>
                <el-row
                  v-if="Expand_Model.title == 2" 
                  style="font-size: 20px"
                  class="Focusing_Part"
                >
                  <el-input v-model="Setting_Info.title"></el-input>
                </el-row>
                
              </el-row>
              <!-- 关于副标题 -->
              <el-row 
                type="flex" 
                justify="center" 
                v-if="Get_Paper_Setting('副标题')" 
                @mouseleave.native="Expand_Change('subTitle', 0)" 
                @mouseenter.native="Expand_Change('subTitle', 1)">
                <el-row
                  v-if="Expand_Model.subTitle == 0" 
                  style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                  type="flex" justify="center">
                  <span 
                    style="font-size: 14px; color: #888">
                    {{Setting_Info.subTitle}}
                  </span>
                </el-row>
                <el-row 
                  v-if="Expand_Model.subTitle == 1"
                  class="Focusing_Part" 
                  @click.native="Expand_Change('subTitle', 2)"
                  style="font-size: 14px; font-weight: bold; min-height: 20px;"
                  type="flex" justify="center">
                  {{Setting_Info.subTitle}}
                </el-row>
                <el-row
                  v-if="Expand_Model.subTitle == 2" 
                  style="font-size: 18px;"
                  class="Focusing_Part"
                >
                  <el-input v-model="Setting_Info.subTitle"></el-input>
                </el-row>
                
              </el-row>
              <!-- 关于考试信息栏 -->
              <el-row 
                type="flex" 
                justify="center" 
                v-if="Get_Paper_Setting('考试信息栏')" 
                @mouseleave.native="Expand_Change('examInfo', 0)" 
                @mouseenter.native="Expand_Change('examInfo', 1)">
                <el-row
                  v-if="Expand_Model.examInfo == 0" 
                  style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                  type="flex" justify="center">
                  <span 
                    style="font-size: 14px;">
                    {{Getting_ExamInfo()}}
                  </span>
                </el-row>
                <el-row 
                  v-if="Expand_Model.examInfo == 1"
                  class="Focusing_Part" 
                  @click.native="Expand_Change('examInfo', 2)"
                  style="font-size: 14px; font-weight: bold; min-height: 20px;"
                  type="flex" justify="center">
                  {{Getting_ExamInfo()}}
                </el-row>
                <el-row
                  v-if="Expand_Model.examInfo == 2" 
                  style="font-size: 14px;"
                  class="Focusing_Part"
                >
                  <span>考试总分：{{Setting_Info.examInfo.score}}分，考试时间：</span>
                  <el-input class="Exam_Info_Input" v-model="Setting_Info.examInfo.time"></el-input>
                  <span>分钟</span>
                </el-row>
                
              </el-row>
              <!-- 关于学生输入框 -->
              <el-row 
                type="flex" 
                justify="center" 
                v-if="Get_Paper_Setting('学生输入框')" 
                @mouseleave.native="Expand_Change('studentWrite', 0)" 
                @mouseenter.native="Expand_Change('studentWrite', 1)">
                <el-row
                  v-if="Expand_Model.studentWrite == 0" 
                  style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                  type="flex" justify="center">
                  <span 
                    style="font-size: 14px;">
                    {{Setting_Info.studentWrite}}
                  </span>
                </el-row>
                <el-row 
                  v-if="Expand_Model.studentWrite == 1"
                  class="Focusing_Part" 
                  @click.native="Expand_Change('studentWrite', 2)"
                  style="font-size: 14px; font-weight: bold; min-height: 20px;"
                  type="flex" justify="center">
                  {{Setting_Info.studentWrite}}
                </el-row>
                <el-row
                  v-if="Expand_Model.studentWrite == 2" 
                  style="font-size: 18px;"
                  class="Focusing_Part"
                >
                  <el-input v-model="Setting_Info.studentWrite"></el-input>
                </el-row>
                
              </el-row>
              <!-- 关于注意事项 -->
              <el-row 
                type="flex" 
                justify="center" 
                v-if="Get_Paper_Setting('注意事项')" 
                @mouseleave.native="Expand_Change('cautions', 0)" 
                @mouseenter.native="Expand_Change('cautions', 1)">
                <el-row
                  v-if="Expand_Model.cautions == 0" 
                  style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%"
                  type="flex" justify="center">
                  <span 
                    style="font-size: 14px; white-space: pre-line; text-align: left; width: 100%; color: #909399">
                    {{Setting_Info.cautions}}
                  </span>
                </el-row>
                <el-row 
                  v-if="Expand_Model.cautions == 1"
                  class="Focusing_Part" 
                  @click.native="Expand_Change('cautions', 2)"
                  style="font-size: 14px; font-weight: bold; min-height: 20px; white-space: pre-line; text-align: left; width: 100%;"
                  type="flex" justify="start">
                  {{Setting_Info.cautions}}
                </el-row>
                <el-row
                  v-if="Expand_Model.cautions == 2" 
                  style="font-size: 18px; width: 100%"
                  class="Focusing_Part"
                >
                  <el-input 
                    v-model="Setting_Info.cautions"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    resize="false"></el-input>
                </el-row>
                
              </el-row>
              <!-- 遍历大题 -->
              <el-row v-for="(Question_List_Item, Index) in Question_List" :key="'Result_Item_' + Index" style="margin-bottom: 10px; margin-top: 20px;">
                
                <!-- 垂直排列 -->
                <el-col>
                  <!-- 分卷注释的一行 -->
                  <el-row 
                    type="flex" 
                    justify="center" 
                    v-if="Get_Paper_Setting('分卷注释')" 
                    @mouseleave.native="Expand_Change('partIntroduce', 0)" 
                    @mouseenter.native="Expand_Change('partIntroduce', 1)">
                    <el-row
                      style="padding: 5px; width: 100%; background: #eee; margin-bottom: 10px;"
                      type="flex" justify="center">
                      <span 
                        style="font-size: 20px; font-weight: bold">
                        {{Getting_Part_Introduce(Index)}}
                      </span>
                    </el-row>
                  </el-row>
                  <!-- 题型显示的那一行，原来这个算是大题注释啊 -->
                  <el-row 
                    type="flex" 
                    justify="center" 
                    v-if="Get_Paper_Setting('大题注释')" 
                    @mouseleave.native="Expand_Change_Intro(Index, 0)" 
                    @mouseenter.native="Expand_Change_Intro(Index, 1)">
                    <el-row
                      v-if="Expand_Model.bundleIntroduce[Index] == 0" 
                      style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%; "
                      type="flex" justify="start">
                      <span 
                        style="font-size: 14px; font-weight: bold">
                        {{Getting_Bundle_Introduce(Index)}}）
                      </span>
                    </el-row>
                    <el-row 
                      v-if="Expand_Model.bundleIntroduce[Index] == 1"
                      class="Focusing_Part" 
                      @click.native="Expand_Change_Intro(Index, 2)"
                      style="font-size: 14px; font-weight: bold; min-height: 20px; width: 100%;"
                      type="flex" justify="start">
                      {{Getting_Bundle_Introduce(Index)}}）
                    </el-row>
                    <el-row
                      v-if="Expand_Model.bundleIntroduce[Index] == 2" 
                      style="font-size: 14px; width: 100%"
                      class="Focusing_Part"
                      type="flex"
                      justify="start"
                    >
                      <span style="height: 30px; line-height: 30px">{{Getting_Bundle_Introduce(Index)}}，</span>
                      <el-input 
                        class="Bundle_Introduce_Input" 
                        v-model="Setting_Info.bundleIntroduce[Index]"
                        placeholder="其他说明，没有可以不填"></el-input>
                      <span style="height: 30px; line-height: 30px">）</span>
                    </el-row>
                    
                  </el-row>
                  <!-- 每道题内容显示的部分 -->
                  <el-row 
                    v-for="(Question, IndexIn) in Question_List_Item.list" 
                    :key="'Result_Item_' + Index + '_' + IndexIn"
                    type="flex" justify="center"
                    :class="Get_Hover_Question(Index, IndexIn)"
                    style="padding-bottom: 5px; min-height: 45px; padding-top: 5px; margin-top: 5px; margin-bottom: 5px; padding-left: 10px; padding-right: 10px;"
                    @mouseenter.native="Hover_Question(Index, IndexIn)" 
                    @mouseleave.native="Hover_Question(-1, -1)"
                    >
                    <!-- 把这些部分垂直排列 -->
                    <el-col>
                        <el-row 
                          type="flex" 
                          justify="start" 
                          style="margin-bottom: 5px;"
                          @mouseenter.native="Hover_Question(Index, IndexIn)">
                          <Mathdown 
                            :content="'(' + Question.score + '分) '+ (IndexIn + 1) + '. $ $ '+ Question.stem" 
                            :name="'Question_Stem_' + Index + '_' + IndexIn"></Mathdown>
                        </el-row>
                        <el-row 
                          v-for="(Option, OptionIndex) in Question.options" 
                          :key="'Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"
                          style="margin-bottom: 2px;"
                          @mouseenter.native="Hover_Question(Index, IndexIn)">
                          <Mathdown 
                          style="width: 50%"
                            :content="Get_Option_Index(OptionIndex) + ': $ $ ' + Option"
                            :name="'Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"></Mathdown>
                        </el-row>
                        <el-row 
                          v-if="Index == Hovered_Question_Bundle_Index && IndexIn == Hovered_Question_Index"
                          type="flex"
                          justify="start"
                          @mouseenter.native="Hover_Question(Index, IndexIn)">
                          <!-- 分数修改 -->
                          <span style="height: 30px; line-height: 30px; margin-right: 20px">修改为</span>
                          <el-input 
                            class="Custom_Score_Input" 
                            v-model="Custom_Setting_Score" 
                            :placeholder="Get_Custom_Setting_Score_Placeholder(Index, IndexIn)"></el-input>
                          <span style="height: 30px; line-height: 30px; margin-left: 20px">分</span>
                          <el-button 
                            type="text" 
                            size="medium" 
                            style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px; margin-left: 10px;"
                            @click="Update_Question_Score(Index, IndexIn)">确认</el-button>
                            <!-- 上下移动 -->
                            <el-button 
                              type="text" 
                              size="medium" 
                              :disabled="IndexIn == 0"
                              @click="Question_Move_Up(Index, IndexIn)"
                              style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px"
                              >前移</el-button>
                            <el-button 
                              type="text" 
                              size="medium" 
                              :disabled="IndexIn == Question_List_Item.list.length - 1"
                              @click="Question_Move_Down(Index, IndexIn)"
                              style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px">后移</el-button>
                            <!-- 检查和删除 -->
                            <el-button 
                              type="text" 
                              size="medium" 
                              @click="Check_Question(Index, IndexIn)"
                              style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px">查看</el-button>
                            <el-button 
                              type="text" 
                              size="medium" 
                              @click="Delete_Question(Index, IndexIn)"
                              style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px; color: red">删除</el-button>
                            <!-- 换一题 -->
                            <el-button 
                              type="text" 
                              size="medium" 
                              @click="submit(Index, IndexIn)"
                              style="height: 30px; line-height: 30px; margin-right: 10px; padding: 0px"><i class="el-icon-refresh" style="margin-right: 15px;"></i>换一题</el-button>
                        </el-row>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>
<script>

import Mathdown from '@/common/components/Mathdown'
import {commonAjax} from '@/common/utils/ajax'
export default {
  name: 'StartCombine',
  props: {
    Question_List: {
      type: Array,
      default: function(){
        return []
      }
    },
    Subject: {
        type: String,
        default: "数学"
    },
    Period: {
        type: String,
        default: "高中"
    }
  },
  components: {
    Mathdown
  },
  data() {
    return {
      // 获取文件时用于等待的值
      waiting: false,
      // 用于等待时显示的文字
      waiting_text: "",
      // 试卷纸张
      Combine_Paper_Size: "A4",
      // 试卷内容
      Combine_Paper_Content: ["Answer", "Analyse"],
      // 试卷类型
      Combine_Paper_Type: "Teacher",
      // 试卷下载对话框是否展示
      Download_Combine_Paper_Dialog: false,
      // 试卷导出设置
      Export_Setting_Type: "simple",
      // 设置项的值列表
      Setting_CheckBox_List: [],
      // 设置项的值标签
      Setting_CheckBox_Label: ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '学生输入框', '注意事项', '分卷注释', '大题注释'],
      // 设置列表是否展开
      Setting_Expand: false,
      // 用于给用户临时自定义分数用的值
      Custom_Setting_Score: "",
      Checked_Question_Info: {},
      Question_Check_Switch: false,
      // 各个设置项的对应值
      Setting_Info: {
        title: "",
        subTitle: "这里是副标题的位置",
        examInfo: {
          score: "0",
          time: "60"
        },
        studentWrite: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
        cautions: "注意事项\n1.答题前填写好自己的班级、姓名、考号等信息。\n2.请将答案正确填写在答题卡上。",
        bundleIntroduce: [],
      },
      // 所有可自定义设置项是否允许点击打开用户自定义模式
      Expand_Model: {
        title: 0,
        subTitle: 0,
        examInfo: 0,
        studentWrite: 0,
        cautions: 0,
        bundleIntroduce: []
      },
      Hovered_Question_Bundle_Index: -1,
      Hovered_Question_Index: -1,
      // 换一题 时所允许检索的数据库名
      databaseAim: [],
      // 是否正在搜索题目
      loading: false,
      // 是否打开用于显示题目替换的对话框
      Replace_Dialog_Show: false,
      // 替换目标的题包索引和题目索引
      Replace_Question_Bundle_Index: -1,
      Replace_Question_Index: -1,
      // 用于替换的目标题目
      Replace_Question_List: [],
      // 以下内容用于在组卷分析报告页面替换题目时的一些需要的信息
      // 1:知识点层级树
      TreeData: {}
    }
  },
  watch:{
    Subject(){
      console.log(this.Subject)
      this.Init_Setting_Info();
    },
    Period(){
      console.log(this.Period)
      this.Init_Setting_Info();
    },
    Export_Setting_Type(){
      this.Init_Setting_CheckBox();
    }
  },
  mounted() {
    this.Init_Setting_CheckBox();
    this.Init_Setting_Info();
    this.Init_User_Database_List();
    this.Init_KP_Tree()
  },
  methods: {
    // 打开答题卡页面
    Check_Answer_Card(){
      sessionStorage.setItem("CombinePaper_AnswerCard", JSON.stringify(this.Question_List));
      sessionStorage.setItem("AnswerCardSubject", this.Subject)
      let routeData = this.$router.resolve({ path: '/answerCard' });
      window.open(routeData.href, '_blank');
    },
    // 开始导出用于分析报告的数据
    Analyse_Combine_Paper(){

      this.waiting_text = "正在获取分析报告，请稍后..."
      this.waiting = true;

      let Analyse_Paper_JSON = {
        subject: this.Subject,
        title: this.Setting_Info.title,
        data: []
      }

      for(let i = 0; i < this.Question_List.length; i++){
        let Bundle_Format = {
          is_longques: 2,
          desc: this.Question_List[i].type,
          content: []
        }
        for(let j = 0; j < this.Question_List[i].list.length; j++){
          let Question_Item = {
            score: this.Question_List[i].list[j].score,
            stem: this.Question_List[i].list[j].stem,
            options: this.Question_List[i].list[j].options,
            answer: this.Question_List[i].list[j].answer,
            analysis: this.Question_List[i].list[j].analyse
          }
          Bundle_Format.content.push(Question_Item)
        }
        Analyse_Paper_JSON.data.push(Bundle_Format);
      }

      commonAjax(this.backendIP+'/api/combinePaperAnalyseReport',
        {
          Paper_Data: JSON.stringify(Analyse_Paper_JSON)
        }
      ).then((data)=>{
        let Changing_Info = []
        let Bundle_Item = {}
        for(let Bundle_Index = 0; Bundle_Index < data.sub_question.length; Bundle_Index++){
          let Info_Item = {
            difficulty: 0,
            knowledgePointInfos: {
              ID: [],
              Label: [],
              Layer: []
            },
            sub_question: []
          }
          Bundle_Item = data.sub_question[Bundle_Index]
          Info_Item.difficulty = Bundle_Item.difficulty_statistics.mean
          for(let Sub_Index = 0; Sub_Index < Bundle_Item.sub_question.length; Sub_Index++){
            let Question = Bundle_Item.sub_question[Sub_Index]
            let Question_Item = {
              difficulty: Question.difficulty,
              stem: Question.stem,
              options: Question.options,
              answer: Question.answer,
              analysis: Question.analysis,
              score: Question.score,
              knowledgePointInfos: {
                ID: [],
                Label: [],
                Layer: []
              },
            }
            let KP_Layer = Question.knowledge_points_frontend.kp_layer
            let KP_ID = ""
            for(let Layer_0 = 0; Layer_0 < KP_Layer.length; Layer_0++){
              Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
              Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
              Question_Item.knowledgePointInfos.Layer.push(0)
              Info_Item.knowledgePointInfos.Layer.push(0)
              KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].label, 0)
              if(KP_ID != ""){
                Question_Item.knowledgePointInfos.ID.push(KP_ID)
                Info_Item.knowledgePointInfos.ID.push(KP_ID)
              }
              for(let Layer_1 = 0; Layer_1 < KP_Layer[Layer_0].children.length; Layer_1++){
                Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)
                Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)
                Question_Item.knowledgePointInfos.Layer.push(1)
                Info_Item.knowledgePointInfos.Layer.push(1)
                KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].label, 1)
                if(KP_ID != ""){
                  Question_Item.knowledgePointInfos.ID.push(KP_ID)
                  Info_Item.knowledgePointInfos.ID.push(KP_ID)
                }
                for(let Layer_2 = 0; Layer_2 < KP_Layer[Layer_0].children[Layer_1].children.length; Layer_2++){
                  Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)
                  Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)
                  Question_Item.knowledgePointInfos.Layer.push(2)
                  Info_Item.knowledgePointInfos.Layer.push(2)
                  KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label, 2)
                  if(KP_ID != ""){
                    Question_Item.knowledgePointInfos.ID.push(KP_ID)
                    Info_Item.knowledgePointInfos.ID.push(KP_ID)
                  } 
                }
              }
            }
            Info_Item.sub_question.push(Question_Item)
          }
          Changing_Info.push(Info_Item)
        }
        sessionStorage.setItem("PaperJson", JSON.stringify(data));
        sessionStorage.setItem("ChangingCombine", true)
        sessionStorage.setItem("ChangingCombineInfo", JSON.stringify(Changing_Info))
        sessionStorage.setItem("ChangingKPTree", JSON.stringify(this.TreeData))
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        this.waiting = false;
        this.waiting_text = ""
      }).catch(() => {
        this.$message.error("服务器忙碌，请稍后再试...")
        this.waiting = false;
        this.waiting_text = ""
      })
    },
    Search_KP_ID(Label, Layer){
      for(let Layer_0 = 0; Layer_0 < this.TreeData.length; Layer_0++){
        if(Label == this.TreeData[Layer_0].label && Layer == this.TreeData[Layer_0].level){
          return this.TreeData[Layer_0].id
        }
        for(let Layer_1 = 0; Layer_1 < this.TreeData[Layer_0].children.length; Layer_1++){
          if(Label == this.TreeData[Layer_0].children[Layer_1].label && Layer == this.TreeData[Layer_0].children[Layer_1].level){
            return this.TreeData[Layer_0].children[Layer_1].id
          }
          for(let Layer_2 = 0; Layer_2 < this.TreeData[Layer_0].children[Layer_1].children.length; Layer_2++){
            if(Label == this.TreeData[Layer_0].children[Layer_1].children[Layer_2].label && 
              Layer == this.TreeData[Layer_0].children[Layer_1].children[Layer_2].level){
              return this.TreeData[Layer_0].children[Layer_1].children[Layer_2].id
            }
          }
        }
      }
    },
    // 获取知识树
    Init_KP_Tree(){

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          emulateJSON: true
      }

      let param = new FormData();

      param.append('system', 'tiku');
      param.append('subject', this.Subject);
      param.append('period', this.Period);

      this.$http
          .post(this.backendIP + "/api/getKnowledgeSystem", param, config)
          .then(function(data) {
            this.TreeData = data.body.knowledge_system
          })
    },
    // 开始导出用于下载的数据
    Download_Paper(){

      this.waiting_text = "正在准备生成的试卷，请稍后..."
      this.waiting = true;

      this.Download_Combine_Paper_Dialog = false;

      let Download_Paper_JSON = {
        paperSize: this.Combine_Paper_Size,
        paperPart: this.Combine_Paper_Content,
        paperType: this.Combine_Paper_Type,
        paperformat: [],
        formatinfo:{
            title: this.Setting_Info.title,
            subtitle: this.Setting_Info.subTitle,
            examInfo: "考试总分: " + this.Setting_Info.examInfo.score + "分，考试时间: " + this.Setting_Info.examInfo.time + "分钟。",
            sealLabel: "绝密 ★ 启用前",
            gutter: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
            studentInput: this.Setting_Info.studentWrite,
            cautions: this.Setting_Info.cautions
        },
        questions: []
      }

      let Label_Using = ['title', 'subtitle', 'examInfo', 'sealLabel', 'gutter', 'studentInput', 'cautions', 'partInfo', 'bundleInfo'];
      for(let i = 0; i < this.Setting_CheckBox_List.length; i++){
        Download_Paper_JSON.paperformat.push(Label_Using[this.Setting_CheckBox_Label.indexOf(this.Setting_CheckBox_List[i])])
      }

      for(let i = 0; i < this.Question_List.length; i++){
        let Questions_Format = {
            type: this.Question_List[i].type,
            partInfo: this.Getting_Part_Introduce(i),
            bundleInfo: this.Getting_Bundle_Introduce(i) + this.Setting_Info.bundleIntroduce[i] + "）",
            questions: []
        }
        for(let j = 0; j < this.Question_List[i].list.length; j++){
          let Question_Item = {
              score: this.Question_List[i].list[j].score,
              stem: this.Question_List[i].list[j].stem,
              options: this.Question_List[i].list[j].options,
              answer: this.Question_List[i].list[j].answer,
              analysis: this.Question_List[i].list[j].analyse
          }
          Questions_Format.questions.push(Question_Item)
        }
        Download_Paper_JSON.questions.push(Questions_Format)
      }

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          responseType: 'arraybuffer',
          emulateJSON: true
      }

      let param = new FormData();

      param.append('Paper_Data', JSON.stringify(Download_Paper_JSON, null, 4));

      this.$http
          .post(this.backendIP + "/api/combinePaperDownload", param, config)
          .then(function(data) {
          if(data.data){
              this.waiting = false;
              const link = document.createElement('a')
              let blob = new Blob([data.data],
                  {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
              let objectUrl = URL.createObjectURL(blob)
              link.href = objectUrl
              link.download = this.Setting_Info.title + '.docx'
              link.click()
              URL.revokeObjectURL(objectUrl);
              this.waiting_text = ""
          }
          }).catch(() => {
              this.$message.error("服务器忙碌，请稍后再试...");
              this.waiting = false;
              this.waiting_text = "";
              return
          });
    },
    // 重置下载设置
    Reset_Combine_Paper_Download_Setting(){
      this.Combine_Paper_Size = "A4";
      this.Combine_Paper_Content = ["Answer", "Analyse"];
      this.Combine_Paper_Type = "Teacher";
    },
    // 尝试打开下载页面
    Download_Combine_Paper(){
      this.Download_Combine_Paper_Dialog = true;
    },
    // 判断这道题是否应该可以被替换
    Replacable(ID){
      for(let i = 0; i < this.Question_List.length; i++){
        for(let j = 0; j < this.Question_List[i].list.length; j++){
          if(this.Question_List[i].list[j].id != "" && this.Question_List[i].list[j].id == ID){
            return true;
          }
        }
      }
      return false;
    },
    // 替换试题
    Replace_Question(Question_Index){
      let Item = this.Replace_Question_List[Question_Index];

      for(let i = 0; i < this.Question_List.length; i++){
        for(let j = 0; j < this.Question_List[i].list.length; j++){
          if(this.Question_List[i].list[j].id != "" && this.Question_List[i].list[j].id == Item.id){
            this.$message.error("已有重复试题在试题篮，请选择其他题目替换。");
            return
          }
        }
      }

      let Question_Show_Infos = {
        id: "",
        type: "",
        score: 0,
        stem: "",
        options: [],
        answer: "",
        analyse: ""
      }
      if(['单选题', '多选题', '判断题'].indexOf(Item.type) != -1){
        Question_Show_Infos.type = "选择题";
        Question_Show_Infos.score = 5;
      }else if(['简答题', '计算题'].indexOf(Item.type) != -1){
        Question_Show_Infos.type = "解答题"
        Question_Show_Infos.score = 12;
      }else if(Item.type == '填空题'){
        Question_Show_Infos.type = '填空题'
        Question_Show_Infos.score = 5;
      }

      Question_Show_Infos.id = Item.id;
      Question_Show_Infos.options = Item.options;
      Question_Show_Infos.stem = Item.stem;
      Question_Show_Infos.answer = Item.answer;
      Question_Show_Infos.analyse = Item.analysis;

      this.Question_List[this.Replace_Question_Bundle_Index].list.splice(this.Replace_Question_Index, 1, Question_Show_Infos);
      this.Replace_Dialog_Show = false;
      this.Replace_Question_Bundle_Index = -1;
      this.Replace_Question_Index = -1;
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));

      this.Replace_Question_List = [];
    },
    // 手动关闭替换对话框
    Replace_Dialog_Close(){
      this.Replace_Question_Bundle_Index = -1;
      this.Replace_Question_Index = -1;
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 初始化用户所可以检索的数据库列表
    Init_User_Database_List(){
      this.databaseAim = ['public']
      //未登录时，不调用获取题库的端口
      if(!this.$store.state.user.token){
          return ;
      }
      commonAjax(this.backendIP+'/api/get_user_ig_name',
          {
          type:'Question',
          action:'R',
          }
      ).then((res)=>{
          let data=res.ig_name;
          for (var i = 0; i < data.length; i++) {
              this.databaseAim.push(data[i])
          }
      })
    },
    // 准备开始做一下“换一题”
    // 检索试题内容
    submit(Index, IndexIn) {

        this.Replace_Dialog_Show = true;
        this.loading = true;

        let param = {}

        let type = [];
        if(this.Question_List[Index].list[IndexIn].type == "选择题"){
          type = ["单选题", "多选题", "判断题"]
        }else if(this.Question_List[Index].list[IndexIn].type == "填空题"){
          type = ["填空题"]
        }else if(this.Question_List[Index].list[IndexIn].type == "解答题"){
          type = ["简答题", "计算题"]
        }
        
        var data = JSON.stringify({
          "content": this.Question_List[Index].list[IndexIn].stem,
          "size": 6,
          "database": this.databaseAim,
          "page_count": 1,
          "subject": [this.Subject],
          "period": [this.Period],
          "difficulty": [0.0, 1.0],
          "type": type
        })

        // param.append("data", data);
        param.data=data

        commonAjax(this.backendIP+'/api/search', param)
        .then((data)=>{
            this.Replace_Question_List = [];
            for(var i = 1; i < data.results.length; i++){
                this.Replace_Question_List.push(data.results[i])
            }
            this.Replace_Question_Bundle_Index = Index;
            this.Replace_Question_Index = IndexIn;
            this.loading = false
        }).catch(() => {
            this.$message.error("服务器过忙，请稍后再试。")
            this.loading = false;
        })
    },
    // 根据当前正在悬浮的题目返回不同的样式
    Get_Hover_Question(Index, IndexIn){
      if(Index == this.Hovered_Question_Bundle_Index && IndexIn == this.Hovered_Question_Index){
        return "Hovered_Question"
      }else{
        return ""
      }
    },
    // 调整鼠标目前正悬浮在哪道题目上面
    Hover_Question(Index, IndexIn){
      this.Hovered_Question_Bundle_Index = Index;
      this.Hovered_Question_Index = IndexIn;
      if(Index != -1){
        this.Custom_Setting_Score = this.Question_List[Index].list[IndexIn].score;
      }
    },
    // 获取“分卷注释”里显示的内容
    Getting_Part_Introduce(Index){
      let List = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ']
      return "卷" + List[Index] + " （"+ this.Question_List[Index].type + "）"
    },
    // 获取“大题注释”里显示的内容
    Getting_Bundle_Introduce(Index){
      let Score = 0;
      for(let i = 0; i < this.Question_List[Index].list.length; i++){
        Score = Score + this.Question_List[Index].list[i].score;
      }
      let Info = "（  " + this.Question_List[Index].list.length + " 小题，共计 " + Score + " 分 "
      if(this.Setting_Info.bundleIntroduce[Index] != "" && this.Expand_Model.bundleIntroduce[Index] != 2){
        Info = Info + "，" + this.Setting_Info.bundleIntroduce[Index];
      }
      return this.Get_Chinese_Index(Index) + "、" + this.Question_List[Index].type + Info;
    },
    // 获取考试信息栏里显示的内容
    Getting_ExamInfo(){
      let Score = 0;
      for(let i = 0; i < this.Question_List.length; i++){
        for(let j = 0; j < this.Question_List[i].list.length; j++){
          Score = Score + this.Question_List[i].list[j].score;
        }
      }
      this.Setting_Info.examInfo.score = Score + ""
      return "考试总分：" + this.Setting_Info.examInfo.score + "分，考试时间：" + this.Setting_Info.examInfo.time + "分钟"
    },
    // 调整标题栏内容
    Expand_Change(part, value){
      this.Expand_Model[part] = value;
      if(value == 0){
        this.Expand_Model.title = 0;
        this.Expand_Model.subTitle = 0;
        this.Expand_Model.examInfo = 0;
        this.Expand_Model.studentWrite = 0;
        this.Expand_Model.cautions = 0;
      }
    },
    // 比较例外的，调整大题注释的内容的时候
    Expand_Change_Intro(index, value){
      this.Expand_Model.bundleIntroduce.splice(index, 1, value)
    },
    // 初始化设置项里面的内容
    Init_Setting_Info(){
      var time1 = new Date();
      this.Setting_Info.title = time1.getFullYear() + "年" + 
                                (time1.getMonth() + 1) + "月" + 
                                time1.getDate() + "日 - " + 
                                this.Period + this.Subject + "卷";
      this.Setting_Info.bundleIntroduce = [];
      for(let i = 0; i < this.Question_List.length; i++){
        this.Setting_Info.bundleIntroduce.push("")
        this.Expand_Model.bundleIntroduce.push(0)
      }
    },
    // 判别是否显示“装订线”
    Get_Paper_Setting(Setting){
      if(this.Setting_CheckBox_List.indexOf(Setting) != -1){
        return true
      }else{
        return false
      }
    },
    // 判别是否显示“装订线”时，试卷显示区的宽度
    Get_Paper_Span(){
      if(this.Setting_CheckBox_List.indexOf("装订线") != -1){
        return 23
      }else{
        return 24
      }
    },
    // 查看某个位置的题目的信息
    Check_Question(IndexOut, IndexIn){
      this.Checked_Question_Info = this.Question_List[IndexOut].list[IndexIn];
      this.Question_Check_Switch = true;
      this.Popover_Close(IndexOut, IndexIn);
    },
    // 删除某道题目
    Delete_Question(IndexOut, IndexIn){
      this.Question_List[IndexOut].list.splice(IndexIn, 1);
      this.Popover_Close(IndexOut, IndexIn);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    // 返回一个选项的序号
    Get_Option_Index(OptionIndex){
      return String.fromCharCode(65 + OptionIndex);
    },
    // 返回一个用于给自定义分数栏占位的值
    Get_Custom_Setting_Score_Placeholder(IndexOut, IndexIn){
      return this.Question_List[IndexOut].list[IndexIn].score + ""
    },
    // 快捷操作栏
    Quick_Operation(IndexOut, IndexIn){
      this.Custom_Setting_Score = this.Question_List[IndexOut].list[IndexIn].score;
    },
    // 更新分数
    Update_Question_Score(IndexOut, IndexIn){
      if(parseFloat(this.Custom_Setting_Score) + "" != this.Custom_Setting_Score){
        this.$message.error("请正确输入数字");
        return
      }
      this.Question_List[IndexOut].list[IndexIn].score = parseFloat(this.Custom_Setting_Score);
      this.$message.success("已修改")
    },
    // 初始化设置栏
    Init_Setting_CheckBox(){
      if(this.Export_Setting_Type == 'simple'){
        this.Setting_CheckBox_List = ['标题', '考试信息栏', '学生输入框', '大题注释']
      }else if(this.Export_Setting_Type == 'standard'){
        this.Setting_CheckBox_List = ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '注意事项', '分卷注释', '大题注释']
      }
    },
    // 简单返回一下大题编号
    Get_Chinese_Index(Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
      return Result[Index]
    },
    // 删除这群大题
    Delete_Item(Index){
      this.Question_List.splice(Index, 1);
      this.Setting_Info.bundleIntroduce.splice(Index, 1);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    // 题目前后移
    Question_Move_Up(IndexOut, IndexIn){
      let Item = this.Question_List[IndexOut].list[IndexIn];
      this.Question_List[IndexOut].list.splice(IndexIn, 1)
      this.Question_List[IndexOut].list.splice(IndexIn - 1, 0, Item)
      this.Popover_Close(IndexOut, IndexIn);
      this.$message.success(this.Question_List[IndexOut].type + "第" + ( IndexIn + 1 ) + "题已前移至第" + IndexIn + "题的位置");
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    Question_Move_Down(IndexOut, IndexIn){
      let Item = this.Question_List[IndexOut].list[IndexIn];
      this.Question_List[IndexOut].list.splice(IndexIn, 1)
      this.Question_List[IndexOut].list.splice(IndexIn + 1, 0, Item)
      this.Popover_Close(IndexOut, IndexIn);
      this.$message.success(this.Question_List[IndexOut].type + "第" + ( IndexIn + 1 ) + "题已后移至第" + ( IndexIn + 2 ) + "题的位置")
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
    },
    // 给这些内容附加Ref用来定位popover
    Get_Pop_Ref(IndexOut, IndexIn){
      return 'Pop_' + IndexOut + '_' + IndexIn 
    },
    // 题包元素前后移动
    List_Item_Move_Up(Index){
      let Item = this.Question_List[Index];
      let Intro = this.Setting_Info.bundleIntroduce[Index];
      this.Setting_Info.bundleIntroduce.splice(Index, 1);
      this.Setting_Info.bundleIntroduce.splice(Index - 1, 0, Intro);
      this.Question_List.splice(Index, 1);
      this.Question_List.splice(Index - 1, 0, Item);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
      this.$message.success("第" + this.Get_Chinese_Index(Index) + "大题已向前移动。")
    },
    // 题包元素前后移动
    List_Item_Move_Down(Index){
      let Item = this.Question_List[Index];
      let Intro = this.Setting_Info.bundleIntroduce[Index];
      this.Setting_Info.bundleIntroduce.splice(Index, 1);
      this.Setting_Info.bundleIntroduce.splice(Index + 1, 0, Intro);
      this.Question_List.splice(Index, 1);
      this.Question_List.splice(Index + 1, 0, Item);
      this.$emit('Update_Question_List', JSON.stringify(this.Question_List));
      this.$message.success("第" + this.Get_Chinese_Index(Index) + "大题已向后移动。")
    },
    Unfinish(){
      this.$message.error("这部分还没做完或者说还不在当前计划范围内")
    },
    Popover_Close(IndexOut, IndexIn){
      let name = 'Pop_' + IndexOut + '_' + IndexIn
      this.$refs[name][0].doClose();
    }
  },
}
</script>
<style>
.Side_Card{
  border-radius: 20px;
  background: white; 
  box-shadow: 2px 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 15px;
}
.Question_Setting_Button{
  cursor: pointer;
  margin-left: 10%;
  margin-right: 10%;
  border: 1px solid #409EFF;
  color: #409EFF;
  background: transparent;
  border-radius: 5px;
}
.Question_Setting_Button:hover{
  border: 1px solid #92D050;
  color: #92D050;
}
</style>
<style lang="scss" scoped>
.Custom_Score_Input{
  font-size: 16px;
}
.Custom_Score_Input ::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 45px;
  padding: 0px;
  text-align: center;
  border-radius: 0px;   
  background: white;
}
.Custom_Score_Input.el-input {
  width: 45px;
}
.Paper_Seal{
    position: relative;
    font-size: 14px;
    padding-bottom: 8px;
    border-bottom: 1px dashed black;
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
    font-weight: 700;
    left: -280px;
    top: 300px;/* Opera */
    width: 600px;
}
.Focusing_Part{
  width: 90%; 
  text-align: center; 
  cursor: pointer; 
  padding: 3px; 
  border: 3px solid #409EFF; 
  border-radius: 10px;
  background: #EEF5FE;
  box-sizing: border-box;
}
.Exam_Info_Input{
  font-size: 14px;
}
.Exam_Info_Input ::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 45px;
  padding: 0px;
  border-radius: 0px;
}
.Exam_Info_Input.el-input {
  width: 45px;
}
.Bundle_Introduce_Input{
  font-size: 14px;
}
.Bundle_Introduce_Input ::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 200px;
  padding: 0px;
  border-radius: 0px;
}
.Bundle_Introduce_Input.el-input {
  width: 200px;
}
.Hovered_Question{
  border: 3px solid #409EFF; 
  border-radius: 10px;
  background: #EEF5FE;
  box-sizing: border-box;
}
.quesCard{
  // border: 3px dashed black;
  background: #F8FBFF;
  border: 1px dashed black;
  margin-left: 5vw;
}
</style>