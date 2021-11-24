<template>
  <div style=" padding-top: 5vh; padding-bottom: 5vh; min-height: 40vh; padding-left: 5vw; padding-right: 5vw; background: #EEF5FE">
    <!-- 题目内容检查 -->
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
    <!-- 试卷下载 -->
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
    <!-- 换一题 - 旧 -->
    <!-- <el-dialog 
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
                难度：{{Question.difficulty == null ? "暂无数据" : Question.difficulty.toFixed(3)}}
              </el-col>
              <el-col :offset="9" :span="3" style="line-height: 40px;">
                <el-button :disabled="Replacable(Question.id)" size="medium" plain round type="primary" @click="Replace_Question(Question_Index)">替换试题</el-button>
              </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog> -->
    <!-- 类比组卷的对话框 -->
    <el-dialog 
      custom-class="None_Padding_Dialog"
      :visible.sync="Compare_Paper_Dialog"
      title="类比试卷推荐"
      width="1344px"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      >
      <DetailTable
        @Add_To_Cart="Add_To_Compare_Cart"
        @Clear_List="Clear_List"
        ref="DetailTable"
        :CompareMode="true"   
        :Period.sync="Period" 
        :Subject.sync="Subject" 
        :Database_List.sync="Database_List"></DetailTable>
        <el-divider v-if="Compare_Paper_Questions.length > 0"></el-divider>
        <el-row type="flex" justify="center" v-if="Compare_Paper_Questions.length > 0">
          <label>为您类比推荐以下试题：</label>
        </el-row>
        <!-- 遍历大题 -->
        <div 
          v-for="(Question_List_Item, Index) in Compare_Paper_Questions" 
          :key="'Compare_Item_' + Index" 
          class="Compare_Bundle"
          :id="'Compare_Item_' + Index">
            <el-row type="flex" justify="start" class="Compare_Bundle_Type">
              {{Question_List_Item.type}}
            </el-row>
            <!-- 每道题内容显示的部分 -->
            <el-row 
              v-for="(Question, IndexIn) in Question_List_Item.list" 
              :key="'Compare_Item_' + Index + '_' + IndexIn"
              type="flex" justify="center"
              >
              <!-- 把这些部分垂直排列 -->
              <el-col>
                <el-row 
                  type="flex" 
                  justify="start" 
                  style="margin-bottom: 5px;">
                  <Mathdown 
                    :content="'(' + Question.score + '分) '+ (IndexIn + 1) + '. $ $ '+ Question.stem" 
                    :name="'Compare_Question_Stem_' + Index + '_' + IndexIn"></Mathdown>
                </el-row>
                <el-row 
                  v-for="(Option, OptionIndex) in Question.options" 
                  :key="'Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"
                  style="margin-bottom: 2px;">
                  <Mathdown 
                    style="width: 50%"
                    :content="Get_Option_Index(OptionIndex) + ': $ $ ' + Option"
                    :name="'Compare_Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"></Mathdown>
                </el-row>
              </el-col>
            </el-row>
        </div>
        <el-row type="flex" justify="center" v-if="Compare_Paper_Questions.length > 0">
          <el-button type="primary" style="margin-right: 30px" @click="Get_Another_Paper()"><i class="el-icon-refresh"></i>再换一组</el-button>
          <el-button type="success" @click="Use_This_Compare_Paper()"><i class="el-icon-check"></i>使用此卷</el-button>
        </el-row>
    </el-dialog>
    <!-- 单题替换页面 -->
    <el-dialog 
        :visible.sync="Replace_Dialog_Show"
        title="试题替换" 
        width="1192px"
        @close="Replace_Dialog_Close()"
        v-loading="Question_Loading"
        element-loading-text="检索替换试题中，请等待..."
        element-loading-spinner="el-icon-loading"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
        <el-row type="flex" justify="start">
            <el-col :span="5" style="height: 420px; overflow: scroll">
                <el-row type="flex" justify="center" style="margin: 0px 1.5vw 15px 1.5vw">
                    <el-input
                        placeholder="输入关键字进行过滤"
                        v-model="filterText_Question_KPTree">
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-row>
                <el-row type="flex" justify="start">
                    <el-tree 
                        :data="TreeData"
                        check-strictly
                        node-key="id"
                        show-checkbox
                        :props="defaultProps"
                        check-on-click-node
                        :filter-node-method="filterNode_Question_KPTree"
                        @check-change="handleCheckChange_Question_KPTree"
                        style="font-size: 10px;"
                        ref="Question_KPTree">
                    </el-tree>
                </el-row>
            </el-col>
            <el-col :span="18" :offset="1">
                <el-row type="flex" justify="start" style="margin-bottom: 10px">
                    <label>题型：{{Combine_Replace_Question_Info.type}}（无法修改）</label><label style="margin-left: 50px">分值：{{Combine_Replace_Question_Info.score}}（无法在此处修改）</label>
                </el-row>
                <el-row type="flex" justify="start" style="margin-bottom: 15px; height: 30px; line-height: 30px;">
                    <el-col :span="2">
                        <el-row type="flex" justify="start">
                            <label>难度：</label>
                        </el-row>
                    </el-col>
                    <el-col 
                        :span="3" 
                        v-for="(Difficulty, Difficulty_Index) in Difficulty_List"
                        :key="'Question_Difficulty_' + Difficulty_Index">
                        <div
                            align="center"
                            :class="filterButtonStyle('Question', 'Difficulty', Difficulty)" 
                            @click="difficulty_Change('Question', Difficulty)">
                            {{Difficulty}}
                        </div>
                    </el-col>
                </el-row>
                <el-row 
                    type="flex" 
                    justify="start" 
                    v-show="filterKPTree_Question.Difficulty == '自定义'"
                    style="margin-bottom: 15px; height: 30px; line-height: 30px;">
                    <el-col :span="6" style="margin-top: 5px;">
                        <el-row type="flex" justify="start">
                            <label>自定义难度：{{filterKPTree_Question.Difficulty_Range[0]}}
                            <span style="margin-left: 10px; margin-right: 10px">至</span>
                            {{filterKPTree_Question.Difficulty_Range[1]}}</label>
                        </el-row>
                    </el-col>
                    <el-col :span="18">
                        <el-row type="flex" justify="start">
                            <el-slider
                                v-model="filterKPTree_Question.Difficulty_Range"
                                range
                                show-stops
                                style="width: 560px;"
                                :step="0.01"
                                :min="0"
                                :max="1">
                            </el-slider>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="margin-bottom: 15px; height: 30px; line-height: 30px;">
                    <el-col :span="2">
                        <el-row type="flex" justify="start">
                            <label>题库：</label>
                        </el-row>
                    </el-col>
                    <el-col 
                        :span="3" 
                        v-for="(Database, Database_Index) in Database_List"
                        :key="'Question_Database_' + Database_Index">
                        <div
                            align="center"
                            :class="filterButtonStyle('Question', 'Database', Database.name)" 
                            @click="database_Change('Question', Database.name)">
                            {{Database.nick || Database.name}}
                        </div>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="start" style="margin-bottom: 10px">
                    <label>已选择的知识点：</label>
                    <el-button 
                        type="text" 
                        v-if="Combine_Replace_Question_Info.knowledgePointInfos.Label.length > 30"
                        @click="filterKPTree_Question.Expand = !filterKPTree_Question.Expand">
                        {{filterKPTree_Question.Expand ? "收起过多" : "展开全部"}}知识点</el-button>
                </el-row>
                <el-row 
                    type="flex" 
                    justify="center" 
                    v-for="KP_Row_Index in 
                        (Math.ceil(Combine_Replace_Question_Info.knowledgePointInfos.Label.length/6) <= 5 ? 
                        Math.ceil(Combine_Replace_Question_Info.knowledgePointInfos.Label.length/6) : 
                        filterKPTree_Question.Expand ? 
                            Math.ceil(Combine_Replace_Question_Info.knowledgePointInfos.Label.length/6) : 
                            5)"
                    :key="'Replacing_Question_KP_Row_' + KP_Row_Index"
                    style="margin-bottom: 10px;">
                    <el-col 
                        :span="4" 
                        v-for="Col_Index in 6" 
                        :key="'Replacing_Question_KP_Row_' + KP_Row_Index + '_Col_' + Col_Index">
                        <el-tooltip 
                            v-if="(KP_Row_Index - 1) * 6 + Col_Index - 1 < Combine_Replace_Question_Info.knowledgePointInfos.Label.length"
                            effect="dark" 
                            :content="Combine_Replace_Question_Info.knowledgePointInfos.Label[(KP_Row_Index - 1) * 6 + Col_Index - 1] 
                            + ' - ' + (Combine_Replace_Question_Info.knowledgePointInfos.Layer[(KP_Row_Index - 1) * 6 + Col_Index - 1] + 1) + '级知识点'"
                            placement="top">
                            <div 
                                align="center"
                                class="KU_Button"
                                :style="Get_Different_Level_Color(Combine_Replace_Question_Info.knowledgePointInfos.Layer[(KP_Row_Index - 1) * 6 + Col_Index - 1])"
                                @click="Delete_KP_Question((KP_Row_Index - 1) * 6 + Col_Index - 1)">
                                {{Get_Show(Combine_Replace_Question_Info.knowledgePointInfos.Label[(KP_Row_Index - 1) * 6 + Col_Index - 1])}}
                                <i class="el-icon-delete" style="margin-left: 10px; font-size: 20px"></i>
                            </div>
                        </el-tooltip>
                        <div 
                            v-else 
                            style="width: 100%; height: 30px; line-height: 30px">
                            
                        </div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 30px;">
            <el-button @click="Search_Replace_Question()" type="primary">根据当前条件检索替换用题目</el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row type="flex" justify="start">
            <label>当前题目题干内容：</label>
        </el-row>
        <el-row type="flex" justify="start">
            <Mathdown :content="Combine_Replace_Question_Info.stem" :name="'Replacing_Question_Stem'"></Mathdown>
        </el-row>
        <el-row v-for="(Option, Option_Index) in Combine_Replace_Question_Info.options" :key="'Option_' + Option_Index" style="line-height: 40px" type="flex" justify="start">
            <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
            <Mathdown style="width:700px" :content="Option" :name="'Replacing_Option_' + Option_Index"></Mathdown>
        </el-row>
        <el-divider v-if="Replace_Question_List.length > 0"></el-divider>
        <el-row 
            class="Replace_Question_Aim"
            v-for="(Question, Question_Index) in Replace_Question_List"
            :key="'Replacing_Question_Aim_' + Question_Index"
            :id="'Replacing_Question_Aim_' + Question_Index">
            <el-col :span="24">
                <el-row type="flex" justify="start">
                    <Mathdown :content="Question.stem" :name="'Replacing_Question_Aim_' + Question_Index + '_Stem'"></Mathdown>
                </el-row>
                <el-row v-for="(Option, Option_Index) in Question.options" :key="'Replacing_Question_' + Question_Index + '_Option_' + Option_Index" style="line-height: 40px" type="flex" justify="start">
                    <span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span>
                    <Mathdown style="width:700px" :content="Option" :name="'Replacing_Question_' + Question_Index + '_Option_' + Option_Index"></Mathdown>
                </el-row>
                <el-row type="flex" justify="center" style="margin-top: 10px">
                    <el-button type="primary" @click="Replace_Question_With_It(Question)">用这道题替换</el-button>
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
                      <i class="el-icon-s-claim"></i>
                      <span>查看答题卡</span>
                    </el-button>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="font-size: 14px; color: grey" @click.native="Auto_Compare_Combine_Paper()">
                      <i class="el-icon-s-opportunity"></i>
                      <span>类比组卷</span>
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
                          <el-button type="primary" size="medium" @click="Get_Question_Difficulty_And_KP(Index, (Row_Index - 1) * 6 + Col_Index - 1)"><i class="el-icon-refresh" style="margin-right: 15px;"></i>换一题</el-button>
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
          :key="'Preview_Area_' + refresh"
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
                              @click="Get_Question_Difficulty_And_KP(Index, IndexIn)"
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
import DetailTable from '@/views/paperCombine/components/DetailTable'
import {commonAjax} from '@/common/utils/ajax'

// import FileSaver from 'file-saver'

import * as variable from '@/common/utils/variable'

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
    Mathdown, DetailTable
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
      // 单题替换、题包替换的信息内容
      Combine_Replace_Question_Info: {
          difficulty: 0,
          id: "",
          stem: "",
          options: [],
          answer: "",
          analysis: "",
          score: 0,
          type: "",
          knowledgePointInfos: {
              ID: [],
              Label: [],
              Layer: []
          },
      },
      // 单选多选的信息筛选，单选多选，交集并集，是否显示全部知识点
      filterKPTree_Question:{
          Choice: "多选",
          Method: "并集",
          Expand: false,
          Difficulty: "全部",
          Difficulty_Range: [0, 1],
          Database: ['public']
      },
      // 以下内容用于在组卷分析报告页面替换题目时的一些需要的信息
      // 1:知识点层级树
      TreeData: {},
      // 题库目录
      Database_List: [],
      // 用来监控替换结果的监听器
      Replacing_Interval: "",
      // 替换后刷新一下页面
      refresh: false,
      // 记录一下双向细目表，用于类比组卷
      Detail_Table: [],
      // 类比组卷的对话框
      Compare_Paper_Dialog: false,
      // 拿来模拟成卷的样子，展示类比出来的题目列表
      Compare_Paper_Questions: [],
      // 正在检索替换试题
      Question_Loading: false,
      // 知识点过滤用的文本
      filterText_Question_KPTree: "",
      // 这里用于定义哪些内容是用于生成树的，这里定义了字数的关键字为children，标签的标签值为label
      defaultProps: {
          children: 'children',
          label: 'label'
      },
      // 难度筛选列表
      Difficulty_List: ['全部', '容易', '较易', '中等', '较难', '困难', "自定义"]
    }
  },
  watch:{
    Subject(){
      this.Init_Setting_Info();
    },
    Period(){
      this.Init_Setting_Info();
    },
    Export_Setting_Type(){
      this.Init_Setting_CheckBox();
    },
    filterText_Question_KPTree(val) {
        this.$refs.Question_KPTree.filter(val);
    },
  },
  mounted() {
    this.Init_Setting_CheckBox();
    this.Init_Setting_Info();
    this.Init_User_Database_List();
    this.Init_KP_Tree();
    this.Init_Database_List();
  },
  methods: {
    // 更新数据库选择情况
    database_Change(Keyword, Database){
        let Index = this.filterKPTree_Question.Database.indexOf(Database)
        if(Index == -1){
            this.filterKPTree_Question.Database.push(Database)
        }else{
            this.filterKPTree_Question.Database.splice(Index, 1)
        }
    },
    // 用选中的试题内容替换当前题目
    Replace_Question_With_It(Question){
        // 单题替换、题包替换的信息内容
        let Temp_Question = {
            id: Question.id,
            stem: Question.stem,
            options: Question.options,
            answer: Question.answer,
            analyse: Question.analysis,
            score: this.Combine_Replace_Question_Info.score,
            type: this.Combine_Replace_Question_Info.type
        }

        this.Question_List[this.Replace_Question_Bundle_Index].list.splice(this.Replace_Question_Index, 1, Temp_Question)
        this.refresh = !this.refresh;

        this.Replace_Dialog_Show = false

    },
    // 检索替换题目用的题目
    Search_Replace_Question(){

        this.Question_Loading = true;

        let Param = {}

        let kl = [[0], [1], [2]]

        for(let i = 0; i < this.Combine_Replace_Question_Info.knowledgePointInfos.ID.length; i++){
            kl[this.Combine_Replace_Question_Info.knowledgePointInfos.Layer[i]].push(this.Combine_Replace_Question_Info.knowledgePointInfos.Label[i])
        }

        var data = JSON.stringify({
            "content": this.Combine_Replace_Question_Info.stem,
            "size": 5,
            "database": this.filterKPTree_Question.Database,
            "page_count": 1,
            "subject": [this.Subject],
            "period": [this.Period],
            "difficulty": this.filterKPTree_Question.Difficulty_Range,
            "type": [this.Combine_Replace_Question_Info.type],
            "knowledge": {
                "knowledge_list": kl,
                "select": "多选",
                "filter": "并集"
            },
            "semantic": 0
        })

        Param.data=data

        commonAjax(this.backendIP+'/api/search', Param)
        .then((data)=>{
            this.Replace_Question_List = data.results
            this.Question_Loading = false;
            
        }).catch(() => {
            this.$message.error("服务器过忙，请稍后再试。")
            this.Question_Loading = false;
        }).finally(() => {
            this.Jump_To_Top('Replacing_Question_Aim_0')
        })
    },
    // 跳转至某一块区域
    Jump_To_Top(Part){
        document.getElementById(Part).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    },
    // 获取知识点显示内容
    Get_Show(label = ""){
        if(label.length > 5){
            return label.substring(0, 5) + "..."
        }else{
            return label
        }
    },
    // 在单题替换的对话框里点击知识点删除
    Delete_KP_Question(Index){
        this.Combine_Replace_Question_Info.knowledgePointInfos.ID.splice(Index, 1);
        this.Combine_Replace_Question_Info.knowledgePointInfos.Label.splice(Index, 1);
        this.Combine_Replace_Question_Info.knowledgePointInfos.Layer.splice(Index, 1);
        this.$refs.Question_KPTree.setCheckedKeys(this.Combine_Replace_Question_Info.knowledgePointInfos.ID);
    },
    // 根据层级不同，进行一点简单的颜色区分
    Get_Different_Level_Color(level){
        if(level == 0){
            return {
                'color': "#E6A23C",
                'background': "rgba(230, 162, 60, 0.1)",
                'border': "1px solid #E6A23C"
            }
        }else if(level == 1){
            return {
                'color': "#67C23A",
                'background': "rgba(103, 194, 58, 0.1)",
                'border': "1px solid #67C23A"
            }
        }
    },
    // 用按钮控制难度区间
    difficulty_Change(Keyword, Difficulty){
        this.filterKPTree_Question.Difficulty = Difficulty
        let Index = this.Difficulty_List.indexOf(Difficulty);
        if(Index == 0){
            this.filterKPTree_Question.Difficulty_Range = [0, 1]
        }else if(Index != 6){
            this.filterKPTree_Question.Difficulty_Range = [variable.Difficulty[Difficulty].min, variable.Difficulty[Difficulty].max]
        }
    },
    // 根据不同选择的状况调整按钮样式
    filterButtonStyle(Keyword, type, index){
        if(type == "Difficulty"){
            if(this.filterKPTree_Question.Difficulty == index){
                return "filterButtonFocus"
            }else{
                return "filterButtonUnfocus"
            }
        }
        else if(type == "Database"){
            if(this.filterKPTree_Question.Database.indexOf(index) != -1){
                return "filterButtonFocus"
            }else{
                return "filterButtonUnfocus"
            }
        }
    },
    // 点击节点后的方法
    handleCheckChange_Question_KPTree(data, checked) {
        if (checked && this.filterKPTree_Question.Choice == "单选") {
            this.Combine_Replace_Question_Info.knowledgePointInfos.ID = [];
            this.Combine_Replace_Question_Info.knowledgePointInfos.Label = [];
            this.Combine_Replace_Question_Info.knowledgePointInfos.Layer = [];
            this.$refs.Question_KPTree.setCheckedKeys([data.id])
            this.Combine_Replace_Question_Info.knowledgePointInfos.ID.push(data.id)
            this.Combine_Replace_Question_Info.knowledgePointInfos.Label.push(data.label)
            this.Combine_Replace_Question_Info.knowledgePointInfos.Layer.push(data.level)
        }else if(!checked && this.filterKPTree_Question.Choice == "单选") {
            this.Combine_Replace_Question_Info.knowledgePointInfos.ID = [];
            this.Combine_Replace_Question_Info.knowledgePointInfos.Label = [];
            this.Combine_Replace_Question_Info.knowledgePointInfos.Layer = [];
            this.$refs.Question_KPTree.setCheckedKeys([])
        }
        else if(checked && this.filterKPTree_Question.Choice == "多选" && this.Combine_Replace_Question_Info.knowledgePointInfos.ID.indexOf(data.id) == -1){
            this.Combine_Replace_Question_Info.knowledgePointInfos.ID.push(data.id)
            this.Combine_Replace_Question_Info.knowledgePointInfos.Label.push(data.label)
            this.Combine_Replace_Question_Info.knowledgePointInfos.Layer.push(data.level)
        }else if(!checked && this.filterKPTree_Question.Choice == "多选" && this.Combine_Replace_Question_Info.knowledgePointInfos.ID.indexOf(data.id) != -1){
            let Index = this.Combine_Replace_Question_Info.knowledgePointInfos.ID.indexOf(data.id)
            this.Combine_Replace_Question_Info.knowledgePointInfos.ID.splice(Index, 1);
            this.Combine_Replace_Question_Info.knowledgePointInfos.Label.splice(Index, 1);
            this.Combine_Replace_Question_Info.knowledgePointInfos.Layer.splice(Index, 1);
            this.$refs.Question_KPTree.setCheckedKeys(this.Combine_Replace_Question_Info.knowledgePointInfos.ID);
        }
    },
    // 这里是输入过滤用的方法
    filterNode_Question_KPTree(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    },
    // 再换一组
    Get_Another_Paper(){
      this.Compare_Paper_Questions = [];
      this.$refs.DetailTable.Use_Table_Info();
    },
    Clear_List(){
      this.Compare_Paper_Questions = [];
    },
    // 完成替换
    Use_This_Compare_Paper(){
      this.$confirm("将使用这份类比组卷的结果替换当前全部题目的内容，确定要继续吗？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.$emit("Clear_Cart", true)
          for(let i = 0; i < this.Compare_Paper_Questions.length; i++){
            for(let j = 0; j < this.Compare_Paper_Questions[j].list.length; j++){
              this.$emit("Add_To_Cart", JSON.stringify(this.Compare_Paper_Questions[i].list[j]));
            }
          }
        })
        .finally(() => {
          this.Compare_Paper_Questions = []
          sessionStorage.removeItem("Compare_Table_Info")
          this.Compare_Paper_Dialog = false;
        })
    },
    // 类比组卷结果检索
    Add_To_Compare_Cart(val){
      let Item = JSON.parse(val)
      let Flag = false;
      for(let i = 0; i < this.Compare_Paper_Questions.length; i++){
        if(this.Compare_Paper_Questions[i].type == Item.type){
          this.Compare_Paper_Questions[i].list.push(Item)
          Flag = true
          break
        }
      }
      if(Flag == false){
        this.Compare_Paper_Questions.push({
          type: Item.type,
          list: [Item]
        })
      }
      setTimeout(()=>{
          document.getElementById('Compare_Item_0').scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      }, 100)
    },
    // 打开答题卡页面
    Check_Answer_Card(){
      sessionStorage.setItem("CombinePaper_AnswerCard", JSON.stringify(this.Question_List));
      sessionStorage.setItem("AnswerCardSubject", this.Subject)
      let routeData = this.$router.resolve({ path: '/answerCard' });
      window.open(routeData.href, '_blank');
    },
    // 获取用户所具有的题库权限
    Init_Database_List(){
        this.Database_List = [
          {name: 'public', nick: '公开题库'}
        ]
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
                this.Database_List.push({name:data[i], nick: "个人题库" + (data.length > 1 ? (i+1) + "" : "")})
            }
        })
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

      console.log(Analyse_Paper_JSON)

      commonAjax(this.backendIP+'/api/combinePaperAnalyseReport',
        {
          Paper_Data: JSON.stringify(Analyse_Paper_JSON)
        }
      ).then((data)=>{
        console.log(data)
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
            update: false,
            type: "",
            sub_question: []
          }
          Bundle_Item = data.sub_question[Bundle_Index]
          Info_Item.difficulty = Bundle_Item.difficulty_statistics.mean
          Info_Item.type = this.Question_List[Bundle_Index].type
          for(let Sub_Index = 0; Sub_Index < Bundle_Item.sub_question.length; Sub_Index++){
            let Question = Bundle_Item.sub_question[Sub_Index]
            let Question_Item = {
              difficulty: Question.difficulty,
              id: this.Question_List[Bundle_Index].list[Sub_Index].id,
              stem: Question.stem,
              options: Question.options,
              answer: Question.answer,
              analysis: Question.analysis,
              score: Question.score,
              update: false,
              type: this.Question_List[Bundle_Index].type,
              knowledgePointInfos: {
                ID: [],
                Label: [],
                Layer: []
              },
            }
            let KP_Layer = Question.knowledge_points_frontend.kp_layer
            let KP_ID = ""
            for(let Layer_0 = 0; Layer_0 < KP_Layer.length; Layer_0++){
              KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].label, 0)
              if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                Question_Item.knowledgePointInfos.ID.push(KP_ID)
                Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
                Question_Item.knowledgePointInfos.Layer.push(0)

                if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                  Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
                  Info_Item.knowledgePointInfos.Layer.push(0)
                  Info_Item.knowledgePointInfos.ID.push(KP_ID)
                }

              }

              for(let Layer_1 = 0; Layer_1 < KP_Layer[Layer_0].children.length; Layer_1++){
                KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].label, 1)
                if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                  Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)                 
                  Question_Item.knowledgePointInfos.Layer.push(1)
                  Question_Item.knowledgePointInfos.ID.push(KP_ID)
                  
                  if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                    Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)
                    Info_Item.knowledgePointInfos.Layer.push(1)
                    Info_Item.knowledgePointInfos.ID.push(KP_ID)
                  }

                }
                for(let Layer_2 = 0; Layer_2 < KP_Layer[Layer_0].children[Layer_1].children.length; Layer_2++){
                  KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label, 2)
                  if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                    Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)              
                    Question_Item.knowledgePointInfos.Layer.push(2)
                    Question_Item.knowledgePointInfos.ID.push(KP_ID)
                    
                    if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                      Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)
                      Info_Item.knowledgePointInfos.Layer.push(2)
                      Info_Item.knowledgePointInfos.ID.push(KP_ID)
                    }

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
        sessionStorage.setItem("ChangingDatabaseList", JSON.stringify(this.Database_List))
        sessionStorage.setItem("SubjectAndPeriod", JSON.stringify({
          Subject: this.Subject,
          Period: this.Period
        }))
        window.localStorage.removeItem("Replacing_Result")
        this.Replacing_Interval = setInterval(()=>{
          let Result = window.localStorage.getItem("Replacing_Result")
          if(Result){
            this.Start_Replace_Questions(Result)
          }
        }, 50)
        let routeData = this.$router.resolve({ path: '/paperAnalyse' });
        window.open(routeData.href, '_blank');
        this.$message.success("试题详情内容已在新页面展开。");
        this.waiting = false;
        this.waiting_text = ""
      }).catch((err) => {
        console.log(err)
        this.$message.error("服务器忙碌，请稍后再试...")
        this.waiting = false;
        this.waiting_text = ""
      })
    },
    // 开始导出用于分析报告的数据
    Auto_Compare_Combine_Paper(){

      this.waiting_text = "正在组织类比试卷，请稍后..."
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
            update: false,
            type: "",
            sub_question: []
          }
          Bundle_Item = data.sub_question[Bundle_Index]
          Info_Item.difficulty = Bundle_Item.difficulty_statistics.mean
          Info_Item.type = this.Question_List[Bundle_Index].type
          for(let Sub_Index = 0; Sub_Index < Bundle_Item.sub_question.length; Sub_Index++){
            let Question = Bundle_Item.sub_question[Sub_Index]
            let Question_Item = {
              difficulty: Question.difficulty,
              id: this.Question_List[Bundle_Index].list[Sub_Index].id,
              stem: Question.stem,
              options: Question.options,
              answer: Question.answer,
              analysis: Question.analysis,
              score: Question.score,
              update: false,
              type: this.Question_List[Bundle_Index].type,
              knowledgePointInfos: {
                ID: [],
                Label: [],
                Layer: []
              },
            }
            let KP_Layer = Question.knowledge_points_frontend.kp_layer
            let KP_ID = ""
            for(let Layer_0 = 0; Layer_0 < KP_Layer.length; Layer_0++){
              KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].label, 0)
              if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                Question_Item.knowledgePointInfos.ID.push(KP_ID)
                Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
                Question_Item.knowledgePointInfos.Layer.push(0)

                if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                  Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].label)
                  Info_Item.knowledgePointInfos.Layer.push(0)
                  Info_Item.knowledgePointInfos.ID.push(KP_ID)
                }

              }

              for(let Layer_1 = 0; Layer_1 < KP_Layer[Layer_0].children.length; Layer_1++){
                KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].label, 1)
                if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                  Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)                 
                  Question_Item.knowledgePointInfos.Layer.push(1)
                  Question_Item.knowledgePointInfos.ID.push(KP_ID)
                  
                  if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                    Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].label)
                    Info_Item.knowledgePointInfos.Layer.push(1)
                    Info_Item.knowledgePointInfos.ID.push(KP_ID)
                  }

                }
                for(let Layer_2 = 0; Layer_2 < KP_Layer[Layer_0].children[Layer_1].children.length; Layer_2++){
                  KP_ID = this.Search_KP_ID(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label, 2)
                  if(KP_ID != "" && Question_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){

                    Question_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)              
                    Question_Item.knowledgePointInfos.Layer.push(2)
                    Question_Item.knowledgePointInfos.ID.push(KP_ID)
                    
                    if(Info_Item.knowledgePointInfos.ID.indexOf(KP_ID) == -1){
                      Info_Item.knowledgePointInfos.Label.push(KP_Layer[Layer_0].children[Layer_1].children[Layer_2].label)
                      Info_Item.knowledgePointInfos.Layer.push(2)
                      Info_Item.knowledgePointInfos.ID.push(KP_ID)
                    }

                  } 
                }
              }
            }
            Info_Item.sub_question.push(Question_Item)
          }
          Changing_Info.push(Info_Item)
        }
        this.Auto_Compare_Combine_Paper_Save_Table(Changing_Info)
      })
    },
    // 具体处理知识点的部分
    Search_KP(Info, Type){

      let database = []

      for(let i = 0; i < this.Database_List.length; i++){
        database.push(this.Database_List[i].name)
      }

      let type = [Type];

      let kl = [[0], [1], [2]];

      for(let i = 0; i < Info.knowledgePointsIDs.length; i++){
        kl[Info.knowledgePointsLevels[i]].push(Info.knowledgePoints[i])
      }

      for(let i = 2; i >= 0; i--){
        if(kl[i].length == 1){
          kl.splice(i, 1)
        }
      }

      let knowledge_Dict = {}

      if(kl.length > 0){
        knowledge_Dict = {
          "knowledge_list": kl,
          "select_way": Info.select,
          "filter_way": Info.filter
        }
      }

      var data = {
        "database": database,
        "score": Info.score,
        "subject": [this.Subject],
        "period": [this.Period],
        "difficulty": [Info.difficulty[0], Info.difficulty[1]],
        "type": type,
        "knowledge": knowledge_Dict
      }

      return data

    },
    // 等到数据整理完了之后，类比组卷的具体实现
    Auto_Compare_Combine_Paper_Save_Table(Changing_Info){

      let Table_Info = []
      
      for(let i = 0; i < Changing_Info.length; i++){
        let Bundle_Format = {
          Type: Changing_Info[i].type,
          List: []
        }
        for(let j = 0; j < Changing_Info[i].sub_question.length; j++){
          let Item = {
            score: Changing_Info[i].sub_question[j].score,
            // 从知识点查询那儿来的经验
            knowledgePoints: Changing_Info[i].sub_question[j].knowledgePointInfos.Label,
            knowledgePointsIDs: Changing_Info[i].sub_question[j].knowledgePointInfos.ID,
            knowledgePointsLevels: Changing_Info[i].sub_question[j].knowledgePointInfos.Layer,
            // 难度项
            difficulty: [],
            // 题库
            source: '全部',
            select: '多选',
            filter: '并集'
          }
          let Text_List = ['容易', '较易', '中等', '较难', '困难'];
          for(let k = 0; k < 5; k++){
            if(Changing_Info[i].sub_question[j].difficulty > variable.Difficulty[Text_List[k]].min && Changing_Info[i].sub_question[j].difficulty < variable.Difficulty[Text_List[k]].max ){
              Item.difficulty = [variable.Difficulty[Text_List[k]].min, variable.Difficulty[Text_List[k]].max]
              break
            }
          }
          Bundle_Format.List.push(Item)
        }
        Table_Info.push(Bundle_Format);
      }

      this.Detail_Table = JSON.parse(JSON.stringify(Table_Info))
      sessionStorage.setItem("Compare_Table_Info", JSON.stringify(Table_Info))

      this.Compare_Paper_Dialog = true
      this.Compare_Paper_Questions = []
      this.waiting_text = ""
      this.waiting = false;

    },
    // 换一页
    Auto_Compare_Combine_Paper_Do(){

      let Table_Info = JSON.parse(JSON.stringify(this.Detail_Table))

      let Searching_Question_Info = []

      for(let i = 0; i < Table_Info.length; i++){
        let Bundle = Table_Info[i];
        for(let j = 0; j < Bundle.List.length; j++){
          Searching_Question_Info.push(this.Search_KP(Bundle.List[j], Bundle.Type))
        }
      }

      this.waiting_text = ""
      this.waiting = false;

      // commonAjax(this.backendIP+'/api/detail_table_generate', {
      //   'detail_table': JSON.stringify(this.Searching_Question_Info, null, 4)
      // })
      // .then((data)=>{
      //   for(let i = 0; i < data.length; i++){
      //     this.Add_New_Ques_To_Cart(data[i])
      //   }
      //   this.Emit_All();
      //   this.Loading = false
      // })
    },
    Start_Replace_Questions(Result){
      clearInterval(this.Replacing_Interval)
      let List = JSON.parse(Result)
      this.$emit("Clear_Cart", true)
      for(let i = 0; i < List.length; i++){
        this.$emit("Add_To_Cart", JSON.stringify(List[i]));
      }
      this.$emit("Jump_To_SC", true)
      window.localStorage.removeItem("Replacing_Result")
      this.refresh = !this.refresh
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
    replace_with_another_question(Index, IndexIn) {

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
        }else{
          type = [this.Question_List[Index].list[IndexIn].type]
        }

        var data = JSON.stringify({
          "content": this.Question_List[Index].list[IndexIn].stem,
          "size": 6,
          "database": this.databaseAim,
          "page_count": 1,
          "subject": [this.Subject],
          "period": [this.Period],
          "difficulty": [0.0, 1.0],
          "type": type,
          "semantic": 0
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
    // 检索难度和知识点用于替换
    Get_Question_Difficulty_And_KP(Index, IndexIn){

      this.Replace_Question_Bundle_Index = Index;
      this.Replace_Question_Index = IndexIn;
      
      this.waiting = true;
      this.waiting_text = "正在识别知识点和难度，请稍后...";
      
      let Question = this.Question_List[Index].list[IndexIn];
      let Param = {
        "Question_Data": JSON.stringify({
          "subject": this.Subject,
          "questions": [{
            "stem": Question.stem
          }]
        })
      }
      commonAjax(this.backendIP + '/api/get_know_diff', Param)
      .then((data)=>{
          this.Combine_Replace_Question_Info = {
            difficulty: data[0].difficulty,
            id: Question.id,
            stem: Question.stem,
            options: Question.options,
            answer: Question.answer,
            analysis: Question.analyse,
            score: Question.score,
            type: Question.type,
            knowledgePointInfos: {
                ID: [],
                Label: [],
                Layer: []
            },
          }
          for(let i = 0; i < data[0].knowledgePoint.label.length; i++){
            let ID = this.Search_KP_ID(data[0].knowledgePoint.label[i], data[0].knowledgePoint.layer[i])
            if(this.Combine_Replace_Question_Info.knowledgePointInfos.ID.indexOf(ID) == -1){
              this.Combine_Replace_Question_Info.knowledgePointInfos.ID.push(ID),
              this.Combine_Replace_Question_Info.knowledgePointInfos.Label.push(data[0].knowledgePoint.label[i])
              this.Combine_Replace_Question_Info.knowledgePointInfos.Layer.push(data[0].knowledgePoint.layer[i])
            }
          }
          this.Replace_Dialog_Show = true;
          setTimeout(()=>{
            this.$refs.Question_KPTree.setCheckedKeys(this.Combine_Replace_Question_Info.knowledgePointInfos.ID);
          }, 100)
      })
      .finally(()=>{
        this.waiting = false;
        this.waiting_text = "";
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
.None_Padding_Dialog .el-dialog__body{
  padding: 0;
  padding-bottom: 30px;
  margin: 0;
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
// 类比组卷的时候，大题题包的样式
.Compare_Bundle{
  margin: 30px;
  padding: 24px;
}
// 题包类型的样式
.Compare_Bundle_Type{
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
// 知识点内容的样式
.KU_Button{
  border: 1px solid #409EFF;
  background: #F8FBFF;
  margin: 0px 0px 0px 10px;
  padding: 4px;
  color: #409EFF;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5rem;
}

.filterButtonUnfocus{
    height: 30px;
    line-height: 30px;
    border: 1px solid #409EFF;
    color: #409EFF;
    border-radius: 30px;
    margin-left: 8px; 
    margin-right: 8px;
    box-sizing: border-box;
    cursor: pointer;
}

.filterButtonFocus{
    height: 30px;
    line-height: 30px;
    border: 1px solid #409EFF;
    color: white;
    border-radius: 30px;
    margin-left: 8px; 
    margin-right: 8px;
    box-sizing: border-box;
    background: #409EFF;
    cursor: pointer;
}
// 替换单题的时候，试题的试题卡
.Replace_Question_Aim{
    margin: 30px 0;
    border: 1px solid black;
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0px 4px 12px rgba($color: #000000, $alpha: 0.12);
}
</style>