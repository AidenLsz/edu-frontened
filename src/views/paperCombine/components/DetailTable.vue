<template>
  <div style=" margin-top: 5vh; margin-bottom: 5vh; min-height: 40vh;" v-loading="Edit_Bundle_Dialog">
    <el-dialog
        :visible.sync="New_Bundle_Dialog"
        title="添加新的细目表大题项"
        width="60%"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="Reset_New_Bundle_Params()">
        <!-- 题型项 -->
        <el-row type="flex" justify="start" style="margin-top: 10px; margin-bottom: 10px;">
          <el-col :span="2">
            <el-row type="flex" justify="start" style="margin-top: -3px;">
              <label>题型类别：</label>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="单选题">单选题</el-radio>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="多选题">多选题</el-radio>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="判断题">判断题</el-radio>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="填空题">填空题</el-radio>
            </el-row>
          </el-col>
          <el-col :span="3">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="简答题">简答题</el-radio>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-row type="flex" justify="center">
              <el-radio v-model="Add_Bundle_Type" label="计算题">计算题</el-radio>
            </el-row>
          </el-col>
        </el-row>
        <!-- 数目项 -->
        <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px;">
          <label style="margin-top: 10px">题目数量</label>
          <el-input-number v-model="Add_Bundle_Number" placeholder="1" style="margin-left: 30px" :min="1"></el-input-number>
        </el-row>
        <!-- 单题分数项 -->
        <el-row type="flex" justify="start" style="margin-top: 20px; margin-bottom: 20px;">
          <label style="margin-top: 10px">单题分数</label>
          <el-input-number v-model="Add_Bundle_Score" placeholder="1" style="margin-left: 30px" :min="1"></el-input-number>
        </el-row>
        <!-- 确认及取消 -->
        <el-row type="flex" justify="center" style="margin-top: 50px;">
          <el-button type="info" style="margin-right: 10vw" @click="New_Bundle_Dialog = false">取消操作</el-button>
          <el-button type="success" @click="Add_New_Bundle()">确定添加</el-button>
        </el-row>
    </el-dialog>
    <el-dialog
        :visible.sync="Edit_Bundle_Dialog"
        title="细目表元素编辑"
        width="1344px"
        :modal='CompareMode ? false: true'
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        @close="Editing_Reset()">
        <div style="padding: 36px;">
        <el-row>
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <label style="height: 40px; line-height: 40px;">分值</label>
            </el-row>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="start">
              <el-input type="number" :min="1" :max="100" v-model="Editing_Info.score" class="DiffInput"></el-input>
            </el-row>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-row type="flex" justify="start">
              <label style="height: 40px; line-height: 40px;">自定义试题难度</label>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-row type="flex" justify="start">
              <el-input type="number" :min="0.0" :max="1.0" :step="0.1" v-model="Editing_Info.difficulty[0]" class="DiffInput"></el-input>
              <span style="height: 40px; line-height: 40px; margin-left: 20px; margin-right: 20px;">~</span>
              <el-input type="number" :min="0.0" :max="1.0" :step="0.1" v-model="Editing_Info.difficulty[1]" class="DiffInput"></el-input>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 10px;">
          <el-col :span="3">
            <el-row type="flex" justify="start">
              <label style="height: 40px; line-height: 40px;">试题来源</label>
            </el-row>
          </el-col>
          <el-col :span="5">
            <el-row type="flex" justify="start">
              <el-select v-model="Editing_Info.source">
                <el-option v-for="(Database, DIndex) in DatabaseAim" :key="'EQ_' + DIndex" :label="Database.nick" :value="Database.name"></el-option>
              </el-select>
            </el-row>
          </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <el-col :span="15" style="padding: 0px; margin: 0px;">
            <el-row type="flex" justify="center" style="margin: 0px 1.5vw 10px 1.5vw">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-row>
            <el-row type="flex" justify="center" v-show="Subject == '数学' && Period == '高中'">
              <el-select v-model="KnowledgeGroup" placeholder="请选择知识体系" style="width: 94%">
                <el-option :value="'tiku'" :label="'知识体系v1'"></el-option>
                <el-option :value="'neea'" :label="'知识体系v2'"></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-left: 1.5vw">
              <label style="margin-top: -3px; margin-right: 10px;">
                选择方式：
              </label>
              <el-radio-group v-model="Editing_Info.select">
                <el-radio label="单选">单选</el-radio>
                <el-radio label="多选">多选</el-radio>
              </el-radio-group>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 1.5vw">
              <label style="margin-top: -3px; margin-right: 10px;">
                过滤方式：
              </label>
              <el-radio-group v-model="Editing_Info.filter">
                <el-radio label="并集">并集</el-radio>
                <el-radio label="交集">交集</el-radio>
              </el-radio-group>
            </el-row>
            <el-row 
              type="flex" 
              justify="start" 
              style="margin-top: 20px; margin-left: 0.5vw; margin-right: 0.5vw; height: 60vh; overflow: scroll"
              v-loading="waiting"
              element-loading-text="正在获取知识树..."
              element-loading-spinner="el-icon-loading">
              <el-tree 
                :data="TreeData"
                check-strictly
                node-key="id"
                show-checkbox
                :props="defaultProps"
                check-on-click-node
                :filter-node-method="filterNode"
                @check-change="handleCheckChange"
                style="font-size: 10px;"
                ref="tree">
              </el-tree>
            </el-row>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-row type="flex" justify="start">
              <label>已选择的知识点项：</label>
            </el-row>
            <el-row style="height: 75.2vh; overflow: scroll">
              <el-row v-for="(Item, Item_Index) in Editing_Info.knowledgePoints" :key="'EIKP_' + Item_Index" type="flex" justify="start">
                <el-button 
                  type="text" 
                  @click="Delete_Editing_KP(Item_Index)"
                  style="padding: 0px; margin-top: 15px;">
                  {{Check_Knowledge_Point_Length(Item)}}<i class="el-icon-delete" style="margin-left: 20px;"></i>
                </el-button>
              </el-row>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 30px;">
          <el-button type="success" @click="Edit_Finish()">编辑完成</el-button>
        </el-row>
      </div>
    </el-dialog>
      <el-row 
        :style="CompareMode ? '' : 'margin-left: 5vw; margin-right: 5vw'"
        v-loading="Loading"
        :element-loading-text="Get_Waiting_Label()"
        element-loading-spinner="el-icon-loading"
        type="flex"
        justify="center"
        >
        <el-col :span="CompareMode ? 17: 18" style="padding: 20px 30px;" class="Shadow_Border">
          <el-row type="flex" justify="center" style="margin-bottom: 15px;">
            <label style="font-size: 18px">{{CompareMode ? "类比组卷 - 双向细目表" : "双向细目表名称"}}</label>
          </el-row>
          <el-row v-for="(Bundle, Bundle_Index) in Table_Info" :key="'Table_Line_' + Bundle_Index" style="margin-bottom: 30px;">
            <el-col>
              <el-row type="flex" justify="center" class="Bundle_First_Line">
                <el-col :span="19">
                  <el-row type="flex" justify="start">
                    {{Getting_Bundle_Introduce(Bundle_Index) + "）"}}
                  </el-row>
                </el-col>
                <el-col :span="3">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="color: white; padding: 3px;" @click="Add_New_Ques(Bundle_Index)">添加小题</el-button>
                  </el-row>
                </el-col>
                <el-col :span="2">
                  <el-row type="flex" justify="center">
                    <el-button type="text" style="color: white; padding: 3px;" @click="Delete_Bundle(Bundle_Index)">删除大题</el-button>
                  </el-row>
                </el-col>
              </el-row>
               <el-row type="flex" justify="start">
                <!-- 题号 -->
                <el-col :span="2" class="Bundle_Other_Line" style="border-left: 1px solid #409EFF;">
                  <el-row type="flex" justify="center">
                    <label>题号</label>
                  </el-row>
                </el-col>
                <!-- 题型 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>题型</label>
                  </el-row>
                </el-col>
                <!-- 分值 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>分值</label>
                  </el-row>
                </el-col>
                <!-- 知识点 -->
                <el-col :span="10" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>知识点</label>
                  </el-row>
                </el-col>
                <!-- 难度 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>难度</label>
                  </el-row>
                </el-col>
                <!-- 来源 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>来源</label>
                  </el-row>
                </el-col>
                <!-- 操作 -->
                <el-col :span="4" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>操作</label>
                  </el-row>
                </el-col>
              </el-row>
              <el-row type="flex" justify="start" v-for="(Ques, Ques_I) in Bundle.List" :key="'Table_Line_' + Bundle_Index + '_' + Ques_I">
                <!-- 题号 -->
                <el-col :span="2" class="Bundle_Other_Line" style="border-left: 1px solid #409EFF;">
                  <el-row type="flex" justify="center">
                    <label>{{Ques_I + 1}}</label>
                  </el-row>
                </el-col>
                <!-- 题型 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label>{{Bundle.Type}}</label>
                  </el-row>
                </el-col>
                <!-- 分值 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <el-input type="number" :min="1" :max="100" v-model="Ques.score" class="ScoreInput"></el-input>
                  </el-row>
                </el-col>
                <!-- 知识点 -->
                <el-col :span="10" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center" v-if="Ques.knowledgePoints.length == 0">
                    <span class="Button_Label" @click="Open_Editor(Bundle_Index, Ques_I)">点击添加知识点</span>
                  </el-row>
                  <el-row type="flex" justify="center" v-else>
                    <el-col :span="20">
                      <el-popover 
                      placement="bottom"
                      width="350"
                      trigger="hover">
                      <el-row 
                        type="flex" 
                        justify="start"
                        v-for="(KP, KPI) in Ques.knowledgePoints" 
                        :key="'KP_' + Bundle_Index + '_' + Ques_I + '_' + KPI">
                        <el-button 
                          type="text" 
                          @click="Delete_KP(Bundle_Index, Ques_I, KPI)"
                          style="padding: 0px; margin-top: 15px;">
                          {{Check_Knowledge_Point_Length(KP)}}<i class="el-icon-delete" style="margin-left: 20px;"></i>
                        </el-button>
                      </el-row>
                      <span slot="reference">{{Ques_KP_Shows(Ques)}}</span>
                      </el-popover>
                    </el-col>
                    <el-col :span="4">
                      <el-row type="flex" justify="center">
                        <el-button type="text" style="margin-top: 12px; padding: 0px; font-weight: bold" @click="Open_Editor(Bundle_Index, Ques_I)">添加或修改</el-button>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-col>
                <!-- 难度 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <el-popover 
                      placement="bottom"
                      width="200"
                      trigger="hover">
                      <el-row type="flex" justify="start">
                        <label>难度选择</label>
                      </el-row>
                      <el-row type="flex" justify="start">
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('容易', Bundle_Index, Ques_I)">容易</el-button>
                          </el-row>
                        </el-col>
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('较易', Bundle_Index, Ques_I)">较易</el-button>
                          </el-row>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="start">
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('中等', Bundle_Index, Ques_I)">中等</el-button>
                          </el-row>
                        </el-col>
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('较难', Bundle_Index, Ques_I)">较难</el-button>
                          </el-row>
                        </el-col>
                      </el-row>
                      <el-row type="flex" justify="start">
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('困难', Bundle_Index, Ques_I)">困难</el-button>
                          </el-row>
                        </el-col>
                        <el-col :span="12">
                          <el-row type="flex" justify="center">
                            <el-button type="text" @click="Difficulty_Change('自定义', Bundle_Index, Ques_I)">自定义</el-button>
                          </el-row>
                        </el-col>
                      </el-row>
                      <span slot="reference">{{Get_Difficulty_Text(Ques.difficulty)}}</span>
                    </el-popover>
                    
                  </el-row>
                </el-col>
                <!-- 来源 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <el-popover 
                      placement="bottom"
                      width="200"
                      trigger="hover">
                      <el-row type="flex" justify="start">
                        <label>筛选题库</label>
                      </el-row>
                      <el-row type="flex" justify="center">
                        <el-button type="text" @click="Source_Change(0, Bundle_Index, Ques_I)">{{DatabaseAim[0].nick}}</el-button>
                      </el-row>
                      <el-row 
                        type="flex" justify="start" 
                        v-for="Row_Index in Math.ceil(DatabaseAim.length/2)" 
                        :key="'BA_' + Bundle_Index + '_' + Ques_I + '_' + Row_Index">
                        <el-col 
                          :span="12" 
                          v-for="Col_Index in 2"
                          :key="'BA_' + Bundle_Index + '_' + Ques_I + '_' + Row_Index + '_' + Col_Index">
                          <el-row type="flex" justify="center" v-if="(Row_Index - 1) * 2 + Col_Index < DatabaseAim.length">
                            <el-button type="text" @click="Source_Change((Row_Index - 1) * 2 + Col_Index, Bundle_Index, Ques_I)">
                              {{DatabaseAim[(Row_Index - 1) * 2 + Col_Index].nick}}
                            </el-button>
                          </el-row>
                          <el-row style="min-height: 10px" v-else>
                          </el-row>
                        </el-col>
                      </el-row>
                      <span slot="reference">{{Ques.source}}</span>
                    </el-popover>
                    
                  </el-row>
                </el-col>
                <!-- 操作 -->
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label class="Button_Label" @click="Open_Editor(Bundle_Index, Ques_I)">编辑</label>
                  </el-row>
                </el-col>
                <el-col :span="2" class="Bundle_Other_Line">
                  <el-row type="flex" justify="center">
                    <label class="Button_Label" @click="Delete_Ques_Item(Bundle_Index, Ques_I)">删除</label>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 添加大题的区域 -->
          <el-row type="flex" justify="center" class="New_Bunble_Class" @click.native="New_Bundle()">
            <i class="el-icon-circle-plus" style="margin-top: 40px; margin-right: 20px;"></i> 添加大题
          </el-row>
          <el-row type="flex" justify="center" style="margin-top: 30px;">
            <el-button type="primary" @click="Use_Table_Info()">生成试卷</el-button>
          </el-row>
        </el-col>
        <el-col :span="5" :offset="1" style="padding: 20px 30px;" class="Shadow_Border">
          <el-row type="flex" justify="center">
            <label>细目表分析</label>
          </el-row>
          <el-row type="flex" justify="center" v-if="Table_Info.length == 0" style="margin-top: 6vh">
            <span>请添加细目表内容以进行分析</span>
          </el-row>
          <el-row type="flex" justify="center" v-else style="margin-top: 2vh">
            <el-col>
              
              <div id="Type_Pie_Chart" class="Chart_Class"></div>
              
              <el-divider></el-divider>

              <div id="Diff_Bar_Chart" class="Chart_Class"></div>
              
              <el-divider></el-divider>
              
              <div id="KP_Pie_Chart" class="Chart_Class"></div>
            
            </el-col>
          </el-row>
        </el-col>
      </el-row>
  </div>
</template>
<script>

import {commonAjax} from '@/common/utils/ajax'
import * as variable from '@/common/utils/variable'

// import FileSaver from 'file-saver'

import * as echarts from 'echarts';

var Type_Pie_Chart = "";
var Diff_Bar_Chart = "";
var KP_Pie_Chart = "";

export default {
  name: 'DetailTable',
  props: {
    Subject: {
      type: String,
      default: "数学"
    },
    Period: {
      type: String,
      default: "高中"
    },
    Database_List: {
      type: Array,
      default: function(){
        return []
      }
    },
    CompareMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 关于正在等待生成题目的变量和等待文字
      Loading: false,
      Loading_Text: "",
      // 关于知识树的操作
      // 等待变量
      waiting: false,
      // 输入框过滤
      filterText: '',
      // 测试树组件选择的数据
      TreeData: [],
      // 这里用于定义哪些内容是用于生成树的，这里定义了字数的关键字为children，标签的标签值为label
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用于装填细目表的数组
      Table_Info: [],
      // 用于编辑细目表的元素项
      Edit_Bundle_Dialog: false,
      // 用于添加细目表的大题项
      New_Bundle_Dialog: false,
      // 用于添加大题项的题型选择
      Add_Bundle_Type: "单选题",
      // 用于添加大题项的题目数量
      Add_Bundle_Number: 1,
      // 用于添加大题项的单题分数
      Add_Bundle_Score: 5,
      // 可选择的题库项
      DatabaseAim: this.Database_List,
      // 正在进行编辑的题包序号，题目序号以及题目内容
      Editing_Bundle: -1,
      Editing_Ques: -1,
      // 题目内容全都是默认数据
      Editing_Info: {
        score: 5,
        // 从知识点查询那儿来的经验
        knowledgePoints: [],
        knowledgePointsIDs: [],
        knowledgePointsLevels: [],
        // 难度项
        difficulty: [variable.Difficulty['容易'].min, variable.Difficulty['容易'].max],
        // 题库
        source: 'default',
        select: '单选',
        filter: '并集'
      },
      // 用于试题ID重复时过滤
      Dup_Index: 1,
      // 用于保存已经存入试卷篮的试题ID
      Cart_IDS: [],
      // 用于统计一共应当有多少道题
      Total: 0,
      // 用于暂存要发送到主页面的试题
      Ques_List: [],
      // 用于进行检索的信息保存
      Searching_Question_Info: [],
      KnowledgeGroup: 'tiku'
    }
  },
  watch:{
    'Editing_Info.difficulty': {
      handler: function(newVal) {
        let Min = parseFloat(newVal[0]).toFixed(2);
        let Max = parseFloat(newVal[1]).toFixed(2);
        if(Min > Max){
          this.$message.error("上下限位置不合理，已调换。");
          newVal[0] = Max;
          newVal[1] = Min;
        }
      },
      deep: true,
      immediate: true,
    },
    'Editing_Info.select': {
      handler: function(newVal, oldVal) {
        if(newVal != oldVal){
          this.$refs.tree.setCheckedKeys([])
          this.Editing_Info.knowledgePoints = [];
          this.Editing_Info.knowledgePointsIDs = [];
          this.Editing_Info.knowledgePointsLevels = [];
        }
      },
      deep: true,
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    Period(newVal, oldVal){
      if(newVal!= oldVal){
        this.Edit_Bundle_Dialog = false;
        this.Editing_Reset();
        this.Init();
      }
    },
    Subject(newVal, oldVal){
      if(newVal!= oldVal){
        this.Edit_Bundle_Dialog = false;
        this.Editing_Reset();
        this.Init();
      }
    },
    KnowledgeGroup(){
      this.Init();
    }
  },
  mounted() {
    if(sessionStorage.getItem("Table_Info")){
      this.Table_Info = JSON.parse(sessionStorage.getItem("Table_Info"))
    }
    if(this.CompareMode){
      this.Table_Info = JSON.parse(sessionStorage.getItem("Compare_Table_Info"))
      this.DatabaseAim.splice(0, 0, {
        name: "全部",
        nick: "全部"
      })
      setTimeout(()=>{
        this.Editing_Reset();
      }, 100)
    }
    
    this.Init();
  },
  methods: {
    Get_Waiting_Label(){
      return "正在检索第 " + (this.Ques_List.length + 1) + " 道试题。"
    },
    // 
    Search_KP(Info, Type){

      let database = []

      if(Info.source == '全部'){
        for(let i = 1; i < this.DatabaseAim.length; i++){
          database.push(this.DatabaseAim[i].name)
        }
      }else{
        for(let i = 0; i < this.Database_List.length; i++){
          if(this.Database_List[i].nick == Info.source){
            database.push(this.Database_List[i].name)
          }
        }
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
          // "content": Info.stem ? Info.stem : "",
          "database": database,
          "page_count": 1,
          "score": Info.score,
          "subject": [this.Subject],
          "period": [this.Period],
          "difficulty": [parseFloat(Info.difficulty[0]), parseFloat(Info.difficulty[1])],
          "knowledge_version": this.KnowledgeGroup,
          "type": type,
          "knowledge": knowledge_Dict,
          "semantic": 0
        }

        this.Searching_Question_Info.push(data)

    },
    // 尝试添加试题
    Add_New_Ques_To_Cart(Ques_Info){

        let Aim = Ques_Info

        let Question_Show_Infos = {
          id: Aim.id,
          type: Aim.type,
          score: Aim.score,
          stem: Aim.stem,
          options: Aim.options,
          answer: Aim.answer,
          analyse: Aim.analysis
        }
        
        this.Ques_List.push(Question_Show_Infos)
        
    },
    Emit_All(){
      for(let i = 0; i < this.Ques_List.length; i++){
        this.$emit("Add_To_Cart", JSON.stringify(this.Ques_List[i]));
      }
      this.$emit("Jump_To_SC", true)
      this.Ques_List = []
      this.Searching_Question_Info = []
    },
    // 开始生成试卷
    Use_Table_Info(){
      if(!this.CompareMode){
        this.$confirm("使用细目表组卷将清空已存入试题篮的试题，确定要继续吗？", "提示", {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          this.Loading = true;
          sessionStorage.setItem('Table_Info', JSON.stringify(this.Table_Info))
          this.$emit("Clear_Cart", true)
          for(let i = 0; i < this.Table_Info.length; i++){
            let Bundle = this.Table_Info[i];
            for(let j = 0; j < Bundle.List.length; j++){
              this.Search_KP(Bundle.List[j], Bundle.Type)
            }
          }
          // let file = new File(
          //     [JSON.stringify(this.Searching_Question_Info, null, 4)],
          //     "Searching_Question_Info.json",
          //     { type: "text/plain;charset=utf-8" }
          //     );
          // FileSaver.saveAs(file);

          commonAjax(this.backendIP+'/api/detail_table_generate', {
            'detail_table': JSON.stringify(this.Searching_Question_Info, null, 4)
          })
          .then((data)=>{
            for(let i = 0; i < data.length; i++){
              this.Add_New_Ques_To_Cart(data[i])
            }
            this.Emit_All();
            this.Loading = false
          })
        })
        .catch(() => {
          this.$message.warning("已取消。")
        })
        .finally(() => {
          this.Searching_Question_Info = []
        })
      }else{
        this.Loading = true;
        for(let i = 0; i < this.Table_Info.length; i++){
          let Bundle = this.Table_Info[i];
          for(let j = 0; j < Bundle.List.length; j++){
            this.Search_KP(Bundle.List[j], Bundle.Type)
          }
        }
        this.$emit("Clear_List", true)
        commonAjax(this.backendIP+'/api/detail_table_generate', {
          'detail_table': JSON.stringify(this.Searching_Question_Info, null, 4)
        })
        .then((data)=>{
          for(let i = 0; i < data.length; i++){
            this.Add_New_Ques_To_Cart(data[i])
          }
          this.Emit_All();
          this.Loading = false
        }).finally(() => {
          this.Searching_Question_Info = []
        })
      }     
    },
    // 删除大题
    Delete_Bundle(Bundle_Index){
      this.Table_Info.splice(Bundle_Index, 1);
      this.Init_Paint();
    },
    // 点击添加新的小题想
    Add_New_Ques(Bundle_Index){

      let Item = {
        score: this.Table_Info[Bundle_Index].List[this.Table_Info[Bundle_Index].List.length - 1].score,
        // 从知识点查询那儿来的经验
        knowledgePoints: [],
        knowledgePointsIDs: [],
        knowledgePointsLevels: [],
        // 难度项
        difficulty: [variable.Difficulty['容易'].min, variable.Difficulty['容易'].max],
        // 题库
        source: this.DatabaseAim[0].nick,
        select: '单选',
        filter: '交集'
      }

      this.Table_Info[Bundle_Index].List.push(Item);

      this.Init_Paint();

    },
    // 控制一下知识点长度
    Check_Knowledge_Point_Length(KP){
      if(KP.length > 20){
        return KP.substring(0, 20) + "..."
      }else{
        return KP
      }
    },
    // 返回知识点内能显示的内容
    Ques_KP_Shows(Ques){
      let KP_List = Ques.knowledgePoints;
      let Sym = Ques.filter == "交集" ? "∩": "∪"
      let Result = KP_List[0];
      let Switch = false;
      for(let i = 1; i < KP_List.length; i++){
        if(Result.length < 16){
          Result = Result + ' ' + Sym + ' ' + KP_List[i]
        }else{
          Switch = true;
          break;
        }
      }
      if(Switch){
        return Result.substring(0, 16) + "...（等" + KP_List.length + "项）"
      }else{
        return Result
      }

    },
    // 删除某道题所选择的知识点
    Delete_Editing_KP(Item_Index){
      this.Editing_Info.knowledgePoints.splice(Item_Index, 1);
      this.Editing_Info.knowledgePointsIDs.splice(Item_Index, 1);
      this.Editing_Info.knowledgePointsLevels.splice(Item_Index, 1);
      this.$refs.tree.setCheckedKeys(this.Editing_Info.knowledgePointsIDs);
    },
    // 删除某道题所选择的知识点（编辑框外）
    Delete_KP(Bundle_Index, Ques_I, KPI){
      this.Table_Info[Bundle_Index].List[Ques_I].knowledgePoints.splice(KPI, 1);
      this.Table_Info[Bundle_Index].List[Ques_I].knowledgePointsIDs.splice(KPI, 1);
      this.Table_Info[Bundle_Index].List[Ques_I].knowledgePointsLevels.splice(KPI, 1);
      this.Init_Paint();
    },
    // 对某道题结束编辑
    Edit_Finish(){
      let Item = JSON.parse(JSON.stringify(this.Editing_Info));
      Item.score = parseInt(Item.score);
      Item.difficulty[0] = parseFloat(Item.difficulty[0]).toFixed(2);
      Item.difficulty[1] = parseFloat(Item.difficulty[1]).toFixed(2);
      this.Table_Info[this.Editing_Bundle].List.splice(this.Editing_Ques, 1, Item);
      this.Init_Paint();
      this.Editing_Reset();
    },
    // 重置编辑栏项
    Editing_Reset(){
      this.Editing_Bundle = -1;
      this.Editing_Ques = -1;
      this.Edit_Bundle_Dialog = false;
      this.Init_Paint();
    },
    // 删除某一小题项
    Delete_Ques_Item(Bundle_Index, Ques_I){
      if(this.Table_Info[Bundle_Index].List.length == 1){
        this.Table_Info.splice(Bundle_Index, 1)
      }else{
        this.Table_Info[Bundle_Index].List.splice(Ques_I, 1)
      }
      this.Init_Paint();
    },
    // 设置当前题目的来源库
    Source_Change(Swi, Bundle_Index, Ques_I){
      this.Table_Info[Bundle_Index].List[Ques_I].source = this.DatabaseAim[Swi].nick;
    },
    // 调整单题难度项
    Difficulty_Change(Swi, Bundle_Index, Ques_I){
      if(Swi != '自定义'){
        this.Table_Info[Bundle_Index].List[Ques_I].difficulty = [variable.Difficulty[Swi].min, variable.Difficulty[Swi].max];
        this.Init_Paint();
      }else{
        this.Editing_Bundle = Bundle_Index;
        this.Editing_Ques = Ques_I;
        this.Editing_Info = JSON.parse(JSON.stringify(this.Table_Info[Bundle_Index].List[Ques_I]));
        this.Edit_Bundle_Dialog = true;
        setTimeout(()=>{
          this.$refs.tree.setCheckedKeys(this.Table_Info[Bundle_Index].List[Ques_I].knowledgePointsIDs);
        }, 10)
      }
    },
    // 根据难度项的数据返回对应的文字
    Get_Difficulty_Text(Diff){
      let Text_List = ['容易', '较易', '中等', '较难', '困难'];
      for(let i = 0; i < 5; i++){
        if(Diff[0] == variable.Difficulty[Text_List[i]].min && Diff[1] == variable.Difficulty[Text_List[i]].max){
          return Text_List[i]
        }
      }
      return parseFloat(Diff[0]).toFixed(2) + "~" + parseFloat(Diff[1]).toFixed(2)
    },
    // 打开针对于元素项的编辑器
    Open_Editor(Bundle_Index, Ques_I){
      this.Editing_Bundle = Bundle_Index;
      this.Editing_Ques = Ques_I;
      this.Editing_Info = JSON.parse(JSON.stringify(this.Table_Info[Bundle_Index].List[Ques_I]));
      this.Edit_Bundle_Dialog = true;
      setTimeout(()=>{
        this.$refs.tree.setCheckedKeys(this.Editing_Info.knowledgePointsIDs);
      }, 10)
      
    },
    // 获取“大题注释”里显示的内容
    Getting_Bundle_Introduce(Index){
      let Score = 0;
      for(let i = 0; i < this.Table_Info[Index].List.length; i++){
        Score = Score + parseFloat(this.Table_Info[Index].List[i].score);
      }
      let Info = "（  " + this.Table_Info[Index].List.length + " 小题，共计 " + Score + " 分 "

      return this.Get_Chinese_Index(Index) + "、" + this.Table_Info[Index].Type + Info;
    },
    // 简单返回一下大题编号
    Get_Chinese_Index(Index){
      let Result = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      return Result[Index]
    },
    // 打开添加新大题项的对话框
    New_Bundle(){
      this.New_Bundle_Dialog = true;
    },
    // 重置变量
    Reset_New_Bundle_Params(){
      this.Add_Bundle_Type = "单选题";
      this.Add_Bundle_Number = 1;
      this.Add_Bundle_Score = 5;
    },
    // 确认添加新的双向细目表大题项
    Add_New_Bundle(){
      let Type = this.Add_Bundle_Type;
      let A_Number = parseInt(this.Add_Bundle_Number);
      let Score = parseFloat(this.Add_Bundle_Score);

      let Bundle = {
        Type: Type,
        List: []
      }

      for(let i = 0; i < A_Number; i++){
        let Item = {
          score: Score,
          // 从知识点查询那儿来的经验
          knowledgePoints: [],
          knowledgePointsIDs: [],
          knowledgePointsLevels: [],
          // 难度项
          difficulty: [variable.Difficulty['容易'].min, variable.Difficulty['容易'].max],
          // 题库
          source: this.DatabaseAim[0].nick,
          select: '单选',
          filter: '并集'
        }
        Bundle.List.push(Item)
      }

      this.Table_Info.push(Bundle);
      setTimeout(() => {
        this.Init_Paint();
      }, 10)

      this.New_Bundle_Dialog = false;
      
    },
    // 获取用户所具有的题库权限
    initDatabaseList(){
        this.DatabaseAim = [
          {name: 'default', nick: '全部'}, 
          {name: 'public', nick: '公开题库'}]
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
                this.DatabaseAim.push({name:data[i], nick: "个人题库" + (data.length > 1 ? (i+1) + "" : "")})
            }
        })
    },
    // 获取知识树
    Init(){

      this.waiting = true;

      let config = {
          headers: {
              "Content-Type": "multipart/form-data"
          },
          emulateJSON: true
      }

      let param = new FormData();

      if(this.Subject != '数学' || this.Period != '高中'){
        this.KnowledgeGroup = 'tiku'
      }

      param.append('system', this.KnowledgeGroup);
      param.append('subject', this.Subject);
      param.append('period', this.Period);

      this.$http
          .post(this.backendIP + "/api/getKnowledgeSystem", param, config)
          .then(function(data) {
            this.TreeData = data.body.knowledge_system
            this.waiting = false;
          })
    },
    // 这里是输入过滤用的方法
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击节点后的方法
    handleCheckChange(data, checked) {
      if (checked && this.Editing_Info.select == "单选") {
        this.Editing_Info.knowledgePoints = [];
        this.Editing_Info.knowledgePointsIDs = [];
        this.Editing_Info.knowledgePointsLevels = [];
        this.$refs.tree.setCheckedKeys([data.id])
        this.Editing_Info.knowledgePoints.push(data.label)
        this.Editing_Info.knowledgePointsIDs.push(data.id)
        this.Editing_Info.knowledgePointsLevels.push(data.level);
      }else if (!checked && this.Editing_Info.select == "单选") {
        this.Editing_Info.knowledgePoints = [];
        this.Editing_Info.knowledgePointsIDs = [];
        this.Editing_Info.knowledgePointsLevels = [];
        this.$refs.tree.setCheckedKeys([])
      }else if(checked && this.Editing_Info.select == "多选"){
        if(this.Editing_Info.knowledgePointsIDs.indexOf(data.id) == -1){
          this.Editing_Info.knowledgePoints.push(data.label)
          this.Editing_Info.knowledgePointsIDs.push(data.id)
          this.Editing_Info.knowledgePointsLevels.push(data.level);
        }
      }else if(!checked && this.Editing_Info.select == "多选" && this.Editing_Info.knowledgePointsIDs.indexOf(data.id) != -1){
        this.Editing_Info.knowledgePoints.splice(this.Editing_Info.knowledgePointsIDs.indexOf(data.id), 1);
        this.Editing_Info.knowledgePointsIDs.splice(this.Editing_Info.knowledgePointsIDs.indexOf(data.id), 1);
        this.Editing_Info.knowledgePointsLevels.splice(this.Editing_Info.knowledgePointsIDs.indexOf(data.id), 1);
        this.$refs.tree.setCheckedKeys(this.Editing_Info.knowledgePointsIDs);
      }
    },
    Init_Paint(){
      this.Init_Type_Pie_Chart();
      this.Init_Diff_Bar_Chart();
      this.Init_KP_Pie_Chart();
    },
    // 画第一章饼图
    Init_Type_Pie_Chart(){
      if (Type_Pie_Chart != null && Type_Pie_Chart != "" && Type_Pie_Chart != undefined){
          Type_Pie_Chart.dispose();
      }
      Type_Pie_Chart = echarts.init(document.getElementById('Type_Pie_Chart'));

      let Data_Dict = [
        {
          name: this.Table_Info[0].Type,
          value: this.Table_Info[0].List.length
        }
      ];
      for(let i = 1; i < this.Table_Info.length; i++){
        let Switch = false
        for(let j = 0; j < Data_Dict.length; j++){
          if(j != Data_Dict.length && this.Table_Info[i].Type == Data_Dict[j].name && !Switch){
            Data_Dict[j].value = Data_Dict[j].value + this.Table_Info[i].List.length;
            Switch = true
          }
        }
        if(!Switch){
          Data_Dict.push({
            name: this.Table_Info[i].Type,
            value: this.Table_Info[i].List.length
          })
        }
      }

      var rich = {
            name: {
                color: "#666666",
                fontSize: 12,
                padding: [8, 30, 0, 30],
                fontWeight: '400',
                align: 'left'
            },
            value: {
                color: "#333",
                fontSize: 12,
                padding: [0, 30, 8, 30],
                fontWeight: '500',
                align: 'left'
            },
            percent: {
                color: "#FFF",
                align: 'right',
                fontSize: 12,
                fontWeight: '500',
                //padding: [0, 5]
            },
            hr: {
                borderColor: '#DFDFDF',
                width: '100%',
                borderWidth: 1,
                height: 0,
            },
        }
        
        var colorList = ['red', 'orange', 'yellow', 'green', 'aqua', 'blue', 'purple'];
        let option = {
            title: {
                text: "题型分布",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
            },
            series: [{
                itemStyle: {
                    color: function(params) {
                        return colorList[params.dataIndex]
                    }
                },
                type: 'pie',
                radius: ['0%', '50%'],
                center: ["50%", "50%"],
                label: {
                    position: 'inner',
                    formatter: params => {
                        return (
                            '{percent|' + params.percent.toFixed(0) + '%}'
                        );
                    },
                    rich: rich,
                },
                data: Data_Dict
            }, {
                itemStyle: {
                    color: function(params) {
                        return colorList[params.dataIndex]
                    }
                },
                type: 'pie',
                silent: true, //取消高亮
                radius: ['0%', '50%'],
                center: ["50%", "50%"],
                labelLine: {
                    length: 20,
                    length2: 0,
                    lineStyle: {
                        color: function(params) {
                            return colorList[params.dataIndex]
                        }
                    }
                },
                label: {
                    formatter: params => {
                        return params.name + '\n\n' + params.value + ' 道';
                    },
                    fontSize: "12px",
                    rich: rich
                },
                data: Data_Dict,
                z: 1
            }, {
                itemStyle: {
                    color: '#F2F9F7'
                },
                type: 'pie',
                silent: true, //取消高亮
                radius: ['0%', '50%'],
                center: ["50%", "50%"],
                hoverAnimation: false, //取消动画效果
                data: Data_Dict,
                label: {
                    show: false,
                    position: 'inner',
                    formatter: params => {
                        return (
                            '{percent|' + params.percent.toFixed(0) + '%}'
                        );
                    },
                    rich: rich,
                },
                z: -1
            }]
        };

      Type_Pie_Chart.setOption(option);
      window.addEventListener('resize',function() {Type_Pie_Chart.resize()});
    },
    // 画第二章柱状图
    Init_Diff_Bar_Chart(){
      if (Diff_Bar_Chart != null && Diff_Bar_Chart != "" && Diff_Bar_Chart != undefined){
          Diff_Bar_Chart.dispose();
      }
      Diff_Bar_Chart = echarts.init(document.getElementById('Diff_Bar_Chart'));

      let Text_List = ['容易', '较易', '中等', '较难', '困难'];

      let Data_Dict = [
        {
          name: '容易',
          value: 0
        },
        {
          name: '较易',
          value: 0
        },
        {
          name: '中等',
          value: 0
        },
        {
          name: '较难',
          value: 0
        },
        {
          name: '困难',
          value: 0
        },
        {
          name: '自定义',
          value: 0
        },
      ];
      for(let i = 0; i < this.Table_Info.length; i++){
        for(let j = 0; j < this.Table_Info[i].List.length; j++){
          let Text = this.Get_Difficulty_Text(this.Table_Info[i].List[j].difficulty);
          let Index = Text_List.indexOf(Text);
          if(Index != -1){
            Data_Dict[Index].value = Data_Dict[Index].value + 1;
          }else{
            Data_Dict[5].value = Data_Dict[5].value + 1;
          }
        }
      }
      
        let option = {
            grid: {
            x: 40,
            y: 70,
            x2: 30,
            y2: 35
            },
            title: {
                text: "试题难度分布",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 14,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
            },
            color: ["#409EFD"],
            tooltip : {
                trigger: 'axis',
                axisPointer : {
                    type : 'shadow',
                    label : {
                        show: true
                    }
                },
                textStyle: { 
                    fontSize: 14,
                    fontStyle: 'normal',
                    align: 'left'
                },
            },
            calculable: true,
            legend: {
                data: ['难度分布'],
                itemGap: 5,
                x: "right",
                y: "top",
                textStyle: { 
                    fontSize: 12,
                    fontStyle: 'normal',
                },
            },
            xAxis : [
                {
                    type : 'category',
                    data : [],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                        interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                        textStyle:{   //textStyle里面写x轴下的字体的样式
                            color:'black',
                            fontSize:12
                        }
                    },
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '难度分布',
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                        textStyle:{   //textStyle里面写y轴下的字体的样式
                            color:'black',
                            fontSize:12
                        }
                    },
                    nameTextStyle:{
                        color:"black", 
                        fontSize:12,  
                        padding:[30, 35, 15, 10]
                    }
                }
            ],
            series : [
                {
                    name:'难度分布',
                    type:'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        };

        


        for(let i = 0; i < 6; i++){
            option.xAxis[0].data.push(Data_Dict[i].name);
            option.series[0].data.push(Data_Dict[i].value)
        }

        Diff_Bar_Chart.setOption(option);

        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {Diff_Bar_Chart.resize()});
    },
    // 画第三章饼图
    Init_KP_Pie_Chart(){
      if (KP_Pie_Chart != null && KP_Pie_Chart != "" && KP_Pie_Chart != undefined){
          KP_Pie_Chart.dispose();
      }
      KP_Pie_Chart = echarts.init(document.getElementById('KP_Pie_Chart'));

      let Data_Dict = [];
      for(let i = 0; i < this.Table_Info.length; i++){
        for(let j = 0; j < this.Table_Info[i].List.length; j++){
          for(let k = 0; k < this.Table_Info[i].List[j].knowledgePoints.length; k++){
            let Swit = false
            for(let m = 0; m < Data_Dict.length; m++){
              if(!Swit && Data_Dict[m].name == this.Table_Info[i].List[j].knowledgePoints[k]){
                Data_Dict[m].value = Data_Dict[m].value + 1
                Swit = true
              }
            }
            if(!Swit){
              Data_Dict.push({
                name: this.Table_Info[i].List[j].knowledgePoints[k],
                value: 1
              })
            }
          }
        }
      }

      if(Data_Dict.length > 0){
        Data_Dict = this.Dict_Sort(Data_Dict);
      }
      
      let option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}：{c} 次<br/>占比：({d}%)'
        },
        title: {
            text: "知识点分布图",
            x: "center",
            y: "top",
            textStyle: { 
                fontSize: 14,
                fontStyle: 'normal',
                fontWeight: 'bold',
            },
        },
        series: [
            {
                name: '出现次数',
                type: 'pie',
                radius: ['20%', '50%'],
                center: ["50%", "50%"], 
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    // position: 'center',
                    color: 'black',
                    fontSize: '12',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '12',
                        fontWeight: 'bold',
                    }
                },
                labelLine: {
                    show: true,
                    lineStyle: {
                        color: 'red'
                    },
                    length: 20,
                    length2: 0
                },
                data: [],
            }
        ]
    };

    for(var i = 0; i < Data_Dict.length; i++){
        option.series[0].data.push(
            {
                value: Data_Dict[i].value, 
                name: Data_Dict[i].name
            }
        )
    }

      KP_Pie_Chart.setOption(option);
      window.addEventListener('resize',function() {KP_Pie_Chart.resize()});
    },
    // 给数据字典排序
    Dict_Sort(Data_Dict){

      let Name_List = [Data_Dict[0].name];
      let Value_List = [Data_Dict[0].value];
      for(let i = 1; i < Data_Dict.length; i++){
        let Swit = false
        for(let j = 0; j < Value_List.length; j++){
          if(!Swit && Data_Dict[i].value >= Value_List[j]){
            Name_List.splice(j, 0, Data_Dict[i].name);
            Value_List.splice(j, 0, Data_Dict[i].value);
            Swit = true
          }
        }
        if(!Swit){
          Name_List.push(Data_Dict[i].name);
          Value_List.push(Data_Dict[i].value);
        }
      }

      let Return_Dict = []

      for(let i = 0 ; i < Value_List.length; i++){
        Return_Dict.push({
          name: Name_List[i],
          value: Value_List[i]
        })
      }

      return Return_Dict
    }
  },
}
</script>
<style lang="scss" scoped>
.Shadow_Border{
  border: 1px solid #9B9EA4;
  border-radius: 20px;
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.22);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.22);
  min-height: 50vh;
}
.New_Bunble_Class{
  margin-top: 20px;
  border: 2px dashed #409EFF;
  color: #409EFF;
  background: #F8FBFF;
  border-radius: 10px;
  height: 100px;
  line-height: 100px;
  font-size: 20px;
  cursor: pointer;
}
.Bundle_First_Line{
  background: #409EFF;
  color: white;
  padding: 10px;
  padding-left: 20px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.Bundle_Other_Line{
  border-right: 1px solid #409EFF;
  border-bottom: 1px solid #409EFF;
  height: 40px;
  line-height: 40px;
}
.Button_Label{
  cursor: pointer;
  color: #409EFF;
}
.ScoreInput{
  font-size: 16px;
  line-height: 34px;
  height: 34px
}
.ScoreInput ::v-deep .el-input__inner {
  border: 0;
  margin-left: 15%;
  border-radius: 0px;
  background: transparent;
}
.DiffInput{
  font-size: 16px;
  line-height: 34px;
  height: 34px;
  width: 80px;
}
.DiffInput ::v-deep .el-input__inner {
  background: transparent;
}
// 题包知识点难度分析
.Chart_Class{
    width: 15vw;
    height:15vw; 
    padding-top: 10px; 
    background: #EEF5FE;
    border-radius: 15px;
}
</style>