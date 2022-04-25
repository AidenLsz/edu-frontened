<template>
  <div 
    style="padding-top: 5vh; padding-bottom: 5vh; min-height: 40vh; padding-left: 5vw; padding-right: 5vw; background: #EEF5FE"
    v-loading="History_Loading"
    element-loading-text="正在处理中，请稍候..."
    element-loading-spinner="el-icon-loading">
    <!-- 试卷内容预览 -->
    <el-dialog 
      :visible.sync="Paper_Preview"
      title="试卷内容预览"
      width="1344px"
      :modal-append-to-body="false"
      :close-on-click-modal="true">
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
            v-if="Get_Paper_Setting('标题')">
            <el-row
                style="padding: 3px; border: 3px solid transparent;"
                type="flex" justify="center">
                <label 
                style="font-size: 20px;">
                {{paper_settings.formatinfo.title}}
                </label>
            </el-row>
            </el-row>
            <!-- 关于副标题 -->
            <el-row 
            type="flex" 
            justify="center" 
            v-if="Get_Paper_Setting('副标题')">
            <el-row
                style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                type="flex" justify="center">
                <span 
                style="font-size: 14px; color: #888">
                {{paper_settings.formatinfo.subTitle}}
                </span>
            </el-row>
            </el-row>
            <!-- 关于考试信息栏 -->
            <el-row 
            type="flex" 
            justify="center" 
            v-if="Get_Paper_Setting('考试信息栏')">
            <el-row
                style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                type="flex" justify="center">
                <span 
                style="font-size: 14px;">
                {{Getting_ExamInfo()}}
                </span>
            </el-row>        
            </el-row>
            <!-- 关于学生输入框 -->
            <el-row 
            type="flex" 
            justify="center" 
            v-if="Get_Paper_Setting('学生输入框')" >
            <el-row
                style="padding: 3px; border: 3px solid transparent; min-height: 20px;"
                type="flex" justify="center">
                <span 
                style="font-size: 14px;">
                {{paper_settings.formatinfo.studentInput}}
                </span>
            </el-row>
            </el-row>
            <!-- 关于注意事项 -->
            <el-row 
            type="flex" 
            justify="center" 
            v-if="Get_Paper_Setting('注意事项')">
            <el-row
                style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%"
                type="flex" justify="center">
                <span 
                style="font-size: 14px; white-space: pre-line; text-align: left; width: 100%; color: #909399">
                {{paper_settings.formatinfo.cautions}}
                </span>
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
                v-if="Get_Paper_Setting('分卷注释')">
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
                v-if="Get_Paper_Setting('大题注释')">
                <el-row
                    style="padding: 3px; border: 3px solid transparent; min-height: 20px; width: 100%; "
                    type="flex" justify="start">
                    <span 
                    style="font-size: 14px; font-weight: bold">
                    {{Getting_Bundle_Introduce(Index)}}）
                    </span>
                </el-row>
                </el-row>
                <!-- 每道题内容显示的部分 -->
                <el-row 
                v-for="(Question, IndexIn) in Question_List_Item.list" 
                :key="'Result_Item_' + Index + '_' + IndexIn"
                type="flex" justify="center"
                :class="Get_Hover_Question(Index, IndexIn)"
                style="padding-bottom: 5px; min-height: 45px; padding-top: 5px; margin-top: 5px; margin-bottom: 5px; padding-left: 10px; padding-right: 10px;"
                >
                <!-- 把这些部分垂直排列 -->
                <el-col>
                    <el-row 
                        type="flex" 
                        justify="start" 
                        style="margin-bottom: 5px;">
                        <Mathdown 
                        :content="'(' + Question.score + '分) '+ (IndexIn + 1) + '. $ $ '+ Question.stem" 
                        :name="'Question_Stem_' + Index + '_' + IndexIn"></Mathdown>
                    </el-row>
                    <el-row 
                        v-for="(Option, OptionIndex) in Question.options" 
                        :key="'Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"
                        style="margin-bottom: 2px;">
                        <Mathdown 
                        style="width: 50%"
                        :content="Get_Option_Index(OptionIndex) + ': $ $ ' + Option"
                        :name="'Q_O_' + Index + '_' + IndexIn + '_' + OptionIndex"></Mathdown>
                    </el-row>
                </el-col>
                </el-row>
            </el-col>
            </el-row>
        </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 32px;">
            <el-button type="primary" @click="Download_Combine_Paper()" plain style="margin-right: 32px;"><i class="el-icon-download" style="display: inline-block; margin-right: 20px;"></i>下载试卷</el-button>
            <el-button type="" @click="Edit_Paper()" style="margin-right: 32px;"><i class="el-icon-edit" style="display: inline-block; margin-right: 20px;"></i>编辑试卷</el-button>
            <el-button type="" @click="Analyse_Combine_Paper()"><i class="el-icon-s-data" style="display: inline-block; margin-right: 20px;"></i>分析试卷</el-button>
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
      <el-row style="min-width: 1344px;">
        <el-col :span="5" class="Combine_History_Left">

            <!-- 组卷记录 -->
            <div align="left" class="History_Label">
                <i class="el-icon-document" style="display: inline-block; margin-right: 10px;"></i>我的组卷记录
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Combine_History' ? true : false
            }"
            @click="Aimed_Func = 'Combine_History'">
                <span class="History_Left_Label">组卷记录</span>
                <span class="History_Left_Num">{{Combine_History_Data.length}}条</span>
            </div>
            <!-- <div class="Divider"></div> -->

            <!-- 下载记录 -->
            <!-- <div align="left" class="History_Label">
                <i class="el-icon-download" style="display: inline-block; margin-right: 10px;"></i>我的下载记录
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Download_History_Question' ? true : false
            }"
            @click="Aimed_Func = 'Download_History_Question'">
                <span class="History_Left_Label">下载的试题</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}道</span>
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Download_History_Paper' ? true : false
            }"
            @click="Aimed_Func = 'Download_History_Paper'">
                <span class="History_Left_Label">下载的试卷</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}张</span>
            </div>
            <div class="Divider"></div> -->

            <!-- 报错记录 -->
            <!-- <div align="left" class="History_Label">
                <i class="el-icon-error" style="display: inline-block; margin-right: 10px;"></i>我的报错记录
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Combine_Error' ? true : false
            }"
            @click="Aimed_Func = 'Combine_Error'">
                <span class="History_Left_Label">报错记录</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}条</span>
            </div>
            <div class="Divider"></div> -->

            <!-- 收藏记录 -->
            <!-- <div align="left" class="History_Label">
                <i class="el-icon-collection-tag" style="display: inline-block; margin-right: 10px;"></i>我的收藏记录
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Combine_Collect_Question' ? true : false
            }"
            @click="Aimed_Func = 'Combine_Collect_Question'">
                <span class="History_Left_Label">收藏的试题</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}道</span>
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Combine_Collect_Paper' ? true : false
            }"
            @click="Aimed_Func = 'Combine_Collect_Paper'">
                <span class="History_Left_Label">收藏的试卷</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}张</span>
            </div>
            <div align="left" :class="{
                'History_Left_Card': true,
                'Aimed_Background': Aimed_Func == 'Combine_Collect_Detail' ? true : false
            }"
            @click="Aimed_Func = 'Combine_Collect_Detail'">
                <span class="History_Left_Label">收藏的细目表</span>
                <span class="History_Left_Num">{{User_History_Info.Combine_Paper_Count}}份</span>
            </div> -->
        </el-col>
        <!-- 显示区 --> 
        <el-col 
          :span="18" 
          :offset="1" 
          class="Combine_History_Right"
          >
          <div v-if="Aimed_Func == 'Combine_History'" align="left">
              <el-row style="border-top: 1px solid #ddd; font-weight: bold">
                  <div class="Combine_History_Table_Label History_Paper_PS">
                      学科学段
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Name">
                      试卷名称
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Ques_Count">
                      题目数量
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Update_Time">
                      最后更新
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Download_Time">
                      上次下载时间
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Function">
                      操作
                  </div>
              </el-row>
              <el-row 
                v-for="(History, History_Index) in Combine_History_Data"
                :key="'Combine_History_' + History_Index">
                  <div class="Combine_History_Table_Label History_Paper_PS">
                      {{History.period + History.subject}}
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Name">
                      {{History.paper_title}}
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Ques_Count">
                      {{History.question_num}}
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Update_Time">
                      {{History.create_date}}
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Download_Time">
                      {{History.download_date}}
                  </div>
                  <div class="Combine_History_Table_Label History_Paper_Function">
                      <el-button @click="handleClick(History, 'Preview')" type="text" size="small">预览</el-button>
                      <el-button @click="handleClick(History, 'Download_Paper')" type="text" size="small">试卷下载</el-button>
                      <el-button @click="handleClick(History, 'Edit_Paper')" type="text" size="small">编辑</el-button>
                      <el-button @click="handleClick(History, 'Answer_Card')" type="text" size="small">查看答题卡</el-button>
                      <el-button @click="handleClick(History, 'Delete')" type="text" size="small">删除</el-button>
                  </div>
              </el-row>
          </div>
        </el-col>
      </el-row>
  </div>
</template>
<script>

import Mathdown from '@/common/components/Mathdown'
import {commonAjax} from '@/common/utils/ajax'
import {LRStrip} from '@/common/utils/strip'

// import FileSaver from 'file-saver'

import * as variable from '@/common/utils/variable'

export default {
  name: 'StartCombine',
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
  components: {
    Mathdown
  },
  data() {
    return {
        // 用于标记当前关注的是否是此位置
        Aimed_Func: "Combine_History",
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
      // 试卷预览框
      Paper_Preview: false,
      // 试卷导出设置
      Export_Setting_Type: "simple",
      // 设置项的值列表
      Setting_CheckBox_List: [],
      // 设置项的值标签
      Setting_CheckBox_Label: ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '学生输入框', '注意事项', '分卷注释', '大题注释'],
      // 各个设置项的对应值
      Setting_Info: {
        title: "试卷1",
        subTitle: "副标题栏",
        examInfo: "",
        studentWrite: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
        cautions: "注意事项\n1.答题前填写好自己的班级、姓名、考号等信息。\n2.请将答案正确填写在答题卡上。",
        bundleIntroduce: [""],
        
      },
      paper_settings: {
        // 密封线和装订线是固定的，不在Setting_Info，别忘了
        // studentWrite和studentInput的差别也别忘了
        paperformat: ['title', 'subtitle', 'examInfo', 'sealLabel', 'gutter', 'studentInput', 'cautions', 'partInfo', 'bundleInfo'],
        formatinfo:{
          title: "试卷1",
          subTitle: "副标题栏",
          examInfo: "考试总分: 100分，考试时间: 120分钟",
          sealLabel: "绝密 ★ 启用前",
          gutter: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
          studentInput: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
          cautions: "注意事项\n1.答题前填写好自己的班级、姓名、考号等信息。\n2.请将答案正确填写在答题卡上。",
          partInfo: ["注释内容"],
          bundleInfo: ["随便写写而已"]
        }
      },
      // 用户历史记录，用于在左侧卡片展示
      User_History_Info: {
        Combine_Paper_Count: 0
      },
      // 试卷
      Combine_History_Data:[
        
      ],
      Question_List: [

      ],
      Downloading_ID: "",
      Downloading_Title: "",
      // 用来给处理中的数据做一个遮挡
      History_Loading: false
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
    this.Update_Whole_History();
  },
  methods: {
      handleClick(History, Func){

        let ID = History.paper_record_ID;

        if(Func != 'Delete' && Func != 'Download_Paper'){

          this.History_Loading = true;

          let Data = {
            'paper_record_ID': ID
          }

          let Param = {
            "data": JSON.stringify(Data)
          }

          commonAjax(this.backendIP+'/api/preview', Param)
          .then((data)=>{

            this.paper_settings = data.paper_settings;

            let Label_Using = ['title', 'subtitle', 'examInfo', 'sealLabel', 'gutter', 'studentInput', 'cautions', 'partInfo', 'bundleInfo'];
            this.Setting_CheckBox_List = [];
            for(let i = 0; i < this.paper_settings.paperformat.length; i++){
                this.Setting_CheckBox_List.push(this.Setting_CheckBox_Label[Label_Using.indexOf(this.paper_settings.paperformat[i])])
            }

            this.Question_List = [];
            for(let i = 0; i < data.questions.length; i++){
              let Item = {
                'type': data.questions[i].type,
                'list': data.questions[i].questions
              }
              this.Question_List.push(Item);
            }

            sessionStorage.setItem('paperRecordID', ID);

            if(Func == 'Preview'){
              this.Paper_Preview = true;
            }else if(Func == 'Edit_Paper'){
              this.Edit_Paper(History);
            }else if(Func == 'Answer_Card'){
              this.Check_Answer_Card();
            }
          }).catch(() => {
            this.$message.error('请稍后重试。');
          }).finally(() => {
            this.History_Loading = false;
          })

        }else if(Func == 'Delete'){

          let Data = {
            'paper_record_ID': ID
          }

          let Param = {
            'data': JSON.stringify(Data)
          }

          commonAjax(this.backendIP+'/api/delete_record', Param)
          .then((data)=>{
              if(data.code == 200){
                this.$message.success("已删除此记录。")
              }
          }).catch(() => {
              this.$message.error("删除失败，请稍后再试。")
          }).finally(() => {
              this.Update_Whole_History();
              sessionStorage.setItem('paperRecordID', "");
          })
        }else if(Func == 'Download_Paper'){
          console.log(ID, History.paper_title)
          this.Download_Combine_Paper(ID, History.paper_title)
        }
      },
      Delete_Combine_History(ID){
        let Param = {
          'paper_record_ID': ID
        }
        commonAjax(this.backendIP+'/api/delete_record', Param)
        .then((data)=>{
            if(data.code == 200){
              this.$message.success("已删除此记录。")
            }
        }).catch(() => {
            this.$message.error("删除失败，请稍后再试。")
        }).finally(() => {
            this.Update_Whole_History();
        })
      },
      Update_Whole_History(){
        this.Combine_History_Data = [];
        let Param = {}
        commonAjax(this.backendIP+'/api/load_all_records', Param)
        .then((data)=>{
          for(let i = 0; i < data.length; i++){
            this.Combine_History_Data.push({
              'period': data[i].period,
              'subject': data[i].subject,
              'paper_record_ID': data[i].paper_record_ID,
              'paper_title': data[i].title,
              'question_num': data[i].question_num,
              'create_date': data[i].update_date,
              'download_date': data[i].download_date ? data[i].download_date : "保存后暂无下载记录"
            })
          }
        }).catch(() => {
            this.$message.error("删除失败，请稍后再试。")
        }).finally(() => {

        })
      },
      Edit_Paper(History){
          this.$confirm("如果编辑这份试卷，则会清空当前试题篮并用这份试卷的试题篮进行覆盖，因此建议您先前往组卷中心进行保存，确定要继续吗？", "提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'Info'
            })
            .then(() => {
                this.$emit("Clear_Cart", true)
                let Aim = {
                  Subject: History.subject,
                  Period: History.period
                }
                this.$emit("Edit_Paper", JSON.stringify(Aim));
                this.$emit("Replace_Cart", JSON.stringify(this.Question_List))
            })
      },
    Page_Index_Change(){
      this.Search_Replace_Question();
    },
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

        this.filterKPTree_Question.Difficulty_Range = [0, 1]
        this.filterKPTree_Question.Difficulty = "全部"

        this.Question_List[this.Replace_Question_Bundle_Index].list.splice(this.Replace_Question_Index, 1, Temp_Question)
        this.refresh = !this.refresh;

        this.Replace_Dialog_Show = false
        this.Replace_Question_List = [];

    },
    // 检索替换题目用的题目
    Search_Replace_Question(){

        this.Extra_Keyword = LRStrip(this.Extra_Keyword);

        this.Question_Loading = true;
        this.Replace_Question_List = []; 

        let Param = {}

        let kl = [[0], [1], [2]]

        for(let i = 0; i < this.Combine_Replace_Question_Info.knowledgePointInfos.ID.length; i++){
            kl[this.Combine_Replace_Question_Info.knowledgePointInfos.Layer[i]].push(this.Combine_Replace_Question_Info.knowledgePointInfos.Label[i])
        }

        var data = JSON.stringify({
            "content": this.Extra_Keyword.length > 0 ? this.Extra_Keyword : this.Combine_Replace_Question_Info.stem.substring(0, 30),
            "size": 5,
            "database": this.filterKPTree_Question.Database,
            "page_count": this.Page_Index,
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
    Clear_List(){
      this.Compare_Paper_Questions = [];
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
        period: this.Period,
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
        period: this.Period,
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
            stem: Changing_Info[i].sub_question[j].stem,
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

      this.History_Loading = true;

      this.Download_Combine_Paper_Dialog = false;

      // {
      //   paperformat: [],
      //   formatinfo:{
      //       title: this.paper_settings.formatinfo.title,
      //       subtitle: this.paper_settings.formatinfo.subTitle,
      //       examInfo: this.paper_settings.formatinfo.examInfo,
      //       sealLabel: "绝密 ★ 启用前",
      //       gutter: "学校：____________ 班级：____________ 姓名：____________ 考号：___________",
      //       studentInput: this.paper_settings.formatinfo.studentInput,
      //       cautions: this.paper_settings.formatinfo.cautions
      //   },
      //   questions: []
      // }

      // let Label_Using = ['title', 'subtitle', 'examInfo', 'sealLabel', 'gutter', 'studentInput', 'cautions', 'partInfo', 'bundleInfo'];
      // for(let i = 0; i < this.Setting_CheckBox_List.length; i++){
      //   Download_Paper_JSON.paperformat.push(Label_Using[this.Setting_CheckBox_Label.indexOf(this.Setting_CheckBox_List[i])])
      // }

      // for(let i = 0; i < this.Question_List.length; i++){
      //   let Questions_Format = {
      //       type: this.Question_List[i].type,
      //       partInfo: this.Getting_Part_Introduce(i),
      //       bundleInfo: this.Getting_Bundle_Introduce(i) + "）",
      //       questions: []
      //   }
      //   for(let j = 0; j < this.Question_List[i].list.length; j++){
      //     let Question_Item = {
      //         score: this.Question_List[i].list[j].score,
      //         stem: this.Question_List[i].list[j].stem,
      //         options: this.Question_List[i].list[j].options,
      //         answer: this.Question_List[i].list[j].answer,
      //         analysis: this.Question_List[i].list[j].analyse
      //     }
      //     Questions_Format.questions.push(Question_Item)
      //   }
      //   Download_Paper_JSON.questions.push(Questions_Format)
      // }

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          responseType: 'arraybuffer',
          emulateJSON: true
      }

      let Data = {
        paper_record_ID: this.Downloading_ID,
        paperSize: this.Combine_Paper_Size,
        paperPart: this.Combine_Paper_Content,
        paperType: this.Combine_Paper_Type
      };

      let Param = {
        'data' : JSON.stringify(Data)
      }

      // let file = new File(
      //   [JSON.stringify(param, null, 4)],
      //   "Download_Record.json",
      //   { type: "text/plain;charset=utf-8" }
      // );
      // FileSaver.saveAs(file);

      this.$http
          .post(this.backendIP + "/api/download_paper_record", Param, config)
          .then(function(data) {
          if(data.data){
              this.History_Loading = false;
              const link = document.createElement('a')
              let blob = new Blob([data.data],
                  {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"})
              let objectUrl = URL.createObjectURL(blob)
              link.href = objectUrl
              link.download = this.Downloading_Title + '.docx'
              link.click()
              URL.revokeObjectURL(objectUrl);
          }
          }).catch(() => {
              this.$message.error("服务器忙碌，请稍后再试...");
              this.History_Loading = false;
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
    Download_Combine_Paper(ID, Title){
      this.Downloading_ID = ID;
      this.Downloading_Title = Title;
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
    // 手动关闭替换对话框
    Replace_Dialog_Close(){
      this.Replace_Question_Bundle_Index = -1;
      this.Replace_Question_Index = -1;

      this.Replace_Question_List = [];
      this.Extra_Keyword = "";
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
          "period": this.Period,
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
          for(let i = 1; i < 6; i++){
            let Difficulty = this.Difficulty_List[i];
            if(data[0].difficulty < variable.Difficulty[Difficulty].max && data[0].difficulty > variable.Difficulty[Difficulty].min){
              this.filterKPTree_Question.Difficulty = Difficulty
              this.filterKPTree_Question.Difficulty_Range = [variable.Difficulty[Difficulty].min, variable.Difficulty[Difficulty].max]
              break;
            }
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
      let Extra = this.paper_settings.formatinfo.partInfo[Index]
      return Extra
    },
    // 获取“大题注释”里显示的内容
    Getting_Bundle_Introduce(Index){
      return this.paper_settings.formatinfo.bundleInfo[Index];
    },
    // 获取考试信息栏里显示的内容
    Getting_ExamInfo(){
      return this.paper_settings.formatinfo.examInfo;
    },
    // 初始化设置项里面的内容（现在只是个预留项了）
    Init_Setting_Info(){
        return 
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
      // if(this.Export_Setting_Type == 'simple'){
      //   this.Setting_CheckBox_List = ['标题', '考试信息栏', '学生输入框', '大题注释']
      // }else if(this.Export_Setting_Type == 'standard'){
      //   this.Setting_CheckBox_List = ['标题', '副标题', '考试信息栏', '密封标识', '装订线', '注意事项', '分卷注释', '大题注释']
      // }
    },
    // 简单返回一下大题编号
    Get_Chinese_Index(Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九']
      return Result[Index]
    },
    // 给这些内容附加Ref用来定位popover
    Get_Pop_Ref(IndexOut, IndexIn){
      return 'Pop_' + IndexOut + '_' + IndexIn 
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
// 组卷历史的左边卡片
.Combine_History_Left{
    min-height: 400px;
    background: white;
    padding: 16px 32px;
}

// 左侧区域下的卡片
.History_Left_Card{
    padding: 8px 24px;
    cursor: pointer;
}

// 左侧卡片中的文字部分
.History_Left_Label{
    width: 70%;
    display: inline-block;
}

// 左侧卡片中的数字部分
.History_Left_Num{
    width: 30%;
    display: inline-block;
    text-align: right;
}

.Aimed_Background{
    background: #409EFF;
    color: white;
}

// 右侧区域
.Combine_History_Right{
    min-height: 400px;
}

// 自己画分界线
.Divider{
    width: 100%;
    height: 1px;
    background: #ccc;
    margin: 16px 0px;
}

.History_Label{
    margin-bottom: 16px;
    margin-top: 8px;
}

// 手搓组卷历史记录的表格
.Combine_History_Table_Label{
    display: inline-block;
    background: white;
    border: 1px solid #ddd;
    border-right: none;
    border-top: none;
    min-height: 32px;
    line-height: 32px;
    text-align: center;
}

// 分为5部分控制具体宽度和后续事宜

.History_Paper_PS{
    min-width: 100px;
    width: calc((100% - 260px) * 0.10);
}

.History_Paper_Name{
    min-width: 100px;
    width: calc((100% - 260px) * 0.33);
    white-space: nowrap;       /* 不换行 */
    text-overflow: ellipsis;
}

.History_Paper_Ques_Count{
    min-width: 100px;
    width: calc((100% - 260px) * 0.10);
}

.History_Paper_Update_Time{
    min-width: 100px;
    width: calc((100% - 260px) * 0.20);
}

.History_Paper_Download_Time{
    min-width: 100px;
    width: calc((100% - 260px) * 0.20);
}

.History_Paper_Function{
    width: 260px;
    border-right: 1px solid #ddd;
}
</style>