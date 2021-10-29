<template>
  <div style=" margin-top: 5vh; margin-bottom: 5vh;">
    <!-- 查看分析报告 -->
    <el-dialog
        :visible.sync="analyseReport"
        width="90%"
        :modal-append-to-body="false"
        :close-on-click-modal="true"
        :key="Refresh">
        <template slot="title"></template>
        <el-row
          style="margin: 0px">
          <QuestionAnalyse :Ques="analyseData"></QuestionAnalyse>
        </el-row>
    </el-dialog>
    <!-- 搜索框行 -->
    <el-row type="flex" justify="start">
      <el-col :span="6" style="padding-left: 3vw; padding-right: 3vw;">
        <el-row type="flex" justify="center" class="KnowledgePointFilter">
          <el-col style="padding: 0px; margin: 0px; padding-top: 20px">
            <el-row type="flex" justify="center" style="margin: 0px 1.5vw 10px 1.5vw">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </el-row>
            <el-row type="flex" justify="center" style="display: none">
              <el-select v-model="KnowledgeGroup" placeholder="请选择知识体系">
                <el-option :value="'KnowledgeGroup_1'" :label="'知识体系一号'"></el-option>
                <el-option :value="'KnowledgeGroup_2'" :label="'知识体系二号'"></el-option>
              </el-select>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 20px; margin-left: 1.5vw">
              <label style="margin-top: -3px; margin-right: 10px;">
                选择方式：
              </label>
              <el-radio-group v-model="KnowledgeSelectType">
                <el-radio label="单选">单选</el-radio>
                <el-radio label="多选">多选</el-radio>
              </el-radio-group>
            </el-row>
            <el-row type="flex" justify="start" style="margin-top: 10px; margin-left: 1.5vw">
              <label style="margin-top: -3px; margin-right: 10px;">
                过滤方式：
              </label>
              <el-radio-group v-model="KnowledgeFilterType">
                <el-radio label="并集">并集</el-radio>
                <el-radio label="交集">交集</el-radio>
              </el-radio-group>
            </el-row>
            <el-row 
              type="flex" 
              justify="start" 
              style="margin-top: 20px; margin-left: 0.5vw; margin-right: 0.5vw; overflow: scroll; height: 80vh;"
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
        </el-row>
      </el-col>
      <el-col :span="18" style="margin-right: 5vw;">
        <!-- 已选择知识点行 -->
        <el-row type="flex" justify="start" :style="ExistFilter()">
          <el-col :span="22">
            <el-row 
              v-for="Row_Index in Math.ceil(KnowledgeUnitList.length/6)" 
              :key="'KU_Row' + Row_Index"
              >
              <el-col :span="4" v-for="Col_Index in 6" :key="'KU_COL_' + Row_Index + '_' + Col_Index">
                <el-tooltip class="item" effect="dark" :content="KnowledgeUnitList[(Row_Index-1) * 6 + Col_Index - 1]" placement="top">
                    <el-row 
                    type="flex" 
                    justify="center" 
                    v-if="KU_Show((Row_Index-1) * 6 + Col_Index - 1)"
                    class="KU_Button"
                    @click.native="Delete_KU((Row_Index-1) * 6 + Col_Index - 1)">
                        {{Get_Show(KnowledgeUnitList[(Row_Index-1) * 6 + Col_Index - 1])}}
                        <i class="el-icon-delete" style="line-height: 20px; margin-left: 10px"></i>
                    </el-row>
                </el-tooltip>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-row type="flex" justify="center" :style="Get_Suitable_Height()" v-if="KnowledgeUnitList.length > 0">
              <el-button 
                type="primary" 
                @click="Search_KP()">
                <i class="el-icon-search"></i>
                检索
              </el-button>
            </el-row>
            <el-row v-else style="min-height: 10px">

            </el-row>
          </el-col>
        </el-row>
        <!-- 筛选行 - 题型 -->
        <el-row style="font-size: 16px;">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
                  <label>题型：</label>
              </el-row>
          </el-col>
          <el-col :span="2" v-for="(typeName, typeIndex) in typeAim" :key="'type_' + typeIndex">
              <el-row type="flex" justify="center" :class="filterButtonStyle('type', typeIndex)" @click.native="type_Change(typeIndex)">
                  <span>{{typeName}}</span>
              </el-row>
          </el-col>
        </el-row>
        <!-- 筛选行 - 难度 -->
        <el-row style="margin-top: 2vh; font-size: 16px;">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
                  <label>难度：</label>
              </el-row>
          </el-col>
          <el-col :span="2" v-for="(difficulty, difficultyIndex) in difficultyAim" :key="'Diff_' + difficultyIndex">
              <el-row type="flex" justify="center" 
                      :class="filterButtonStyle('difficulty', difficultyIndex)" 
                      @click.native="difficulty_Change(difficultyIndex)">
                  <span>{{difficulty}}</span>
              </el-row>
          </el-col>
          <el-col :span="2">
            <el-row :class="selfDiffGapClass()" @click.native="selfDiffGapInput()">
                自定义
            </el-row>
          </el-col> 
          <el-col :span="4" v-if="selfDiffGap">
              <el-row type="flex" justify="center">
                  <el-input v-model="selfDiffGap_Min" class="selfDiffGapInput"></el-input>
                  <span style="height: 30px; line-height: 30px">到</span>
                  <el-input v-model="selfDiffGap_Max" class="selfDiffGapInput" style="margin-right: 8px;"></el-input>
                  <el-button type="primary" size="mini" @click="selfDiffGapCheck()">确认</el-button>
              </el-row>
          </el-col>
        </el-row>
        <!-- 筛选行 - 题库 -->
        <el-row style="margin-top: 2vh; font-size: 16px;">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
                  <label>题库：</label>
              </el-row>
          </el-col>
          <el-col :span="2" v-for="(databaseName, databaseIndex) in databaseAim" :key="'Database_' + databaseIndex">
              <el-row type="flex" justify="center" :class="filterButtonStyle('database', databaseIndex)" @click.native="database_Change(databaseIndex)">
                  <span>{{databaseName.nick || databaseName.name}}</span>
              </el-row>
          </el-col>
        </el-row>
        <!-- 筛选行 - 排序方式 -->
        <el-row style="margin-top: 2vh; font-size: 16px; margin-bottom: 30px">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
                  <label>排序：</label>
              </el-row>
          </el-col>
          <el-col :span="2" >
              <el-row type="flex" justify="center" class="filterButtonFocus">
                  <span>智能排序</span>
              </el-row>
          </el-col>
        </el-row>
        <el-row
          v-for="(Question, Question_Index) in questionList"
          :key="Question_Index"
          style="margin-bottom: 50px"
          >
          <el-col :span="22" class="quesCard">
            <el-row style="text-align: left; padding-left: 30px; padding-top: 15px; background: white; padding-bottom: 15px">
              <el-col style="padding-bottom: 15px" >
                <Mathdown :content="Question.stem" :name="'Q_' + Question_Index + '_Stem'"></Mathdown>
              </el-col>
              <el-col v-for="(Option, Option_Index) in Question.options" :key="'Option_'+ Option_Index + '_Of_' + Question_Index">
                <el-row style="line-height: 40px" type="flex" justify="start"><span style="line-height: 40px">{{Get_Option_Label(Option_Index)}}：</span><Mathdown style="width:700px" :content="Option" :name="'Q_' + Question_Index + '_Option_' + Option_Index"></Mathdown></el-row>
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
                <el-col :span="4" :offset="2" style="line-height: 40px">
                  <el-button size="medium" plain round type="primary" @click="Expand(Question_Index)">查看答案与解析</el-button>
                </el-col>
                <el-col :span="3" style="line-height: 40px">
                  <el-button size="medium" plain round type="primary" @click="Check_Analyse(Question.id, Question.database)">查看分析报告</el-button>
                </el-col>
                <el-col :span="3" style="line-height: 40px; margin-left: 6px;">
                  <el-button size="medium" plain round type="primary" @click="Add_To_Question_Cart(Question_Index)">加入试题篮</el-button>
                </el-col>
            </el-row>
            <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; line-height:30px; padding-top: 20px; border-top: 1px dashed black">
              <el-col>
                <span style="margin-bottom: 10px; display: block">答案：</span><Mathdown :content="Question.answer" :name="'Q_' + Question_Index + '_Answer'"></Mathdown>
              </el-col>
            </el-row>
            <el-row v-if="Expand_List[Question_Index]" style="text-align: left; padding-left: 40px; padding-bottom: 20px">
              <el-col>
                <span style="margin-bottom: 20px; display: block">解析：</span><Mathdown :content="Question.analysis" :name="'Q_' + Question_Index + '_Analysis'"></Mathdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          v-if="questionList.length == 0"
          style="margin: 30px 5vw; height: 50vh; font-size: 30px;"
          v-loading="loading"
          element-loading-text="正在检索试题中..."
          element-loading-spinner="el-icon-loading">

        </el-row>
        <el-row v-if="questionList.length != 0">
          <el-pagination
            @current-change="BackToTop"
            :current-page.sync="Page_Index"
            :page-size="Page_Length"
            layout="total, prev, pager, next"
            :total="Total_Count">
          </el-pagination>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import {commonAjax} from '@/common/utils/ajax'
import Mathdown from '@/common/components/Mathdown'

import QuestionAnalyse from '@/views/resourceAnalyse/QuestionAnalyse'

export default {
  name: 'KnowledgePoint',
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
  components: {Mathdown, QuestionAnalyse},
  data() {
    return {
      // 知识树用到的变量
        // 等待变量
        waiting: false,
        // 要展示的知识点槽
        KnowledgeUnitList: [],
        // 展示的知识点对应的ID
        KnowledgeUnitIDList: [],
        KnowledgeUnitIDList_Cache: [],
        // 知识点的层级关系
        KnowledgeUnitLevelList: [],
        // 输入框过滤
        filterText: '',
        // 测试树组件选择的数据
        TreeData: [{
          id: 1,
          label: '几何',
          children: [{
            id: 4,
            label: '圆',
            children: [{
              id: 9,
              label: '半径'
            }, {
              id: 10,
              label: '直径'
            }]
          }]
        }, {
          id: 2,
          label: '四则运算',
          children: [{
            id: 5,
            label: '加法'
          }, {
            id: 6,
            label: '减法'
          }]
        }, {
          id: 3,
          label: '积分',
          children: [{
            id: 7,
            label: '导数'
          }, {
            id: 8,
            label: '极限'
          }]
        }],
        // 这里用于定义哪些内容是用于生成树的，这里定义了字数的关键字为children，标签的标签值为label
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        // 知识体系名
        KnowledgeGroup: "KnowledgeGroup_1",
        // 知识体系单选或多选
        KnowledgeSelectType: "单选",
        // 知识点交集或并集
        KnowledgeFilterType: "并集",
        // 正在加载
        loading: false,
        // 刷新分析报告
        Refresh: false,
        // 打开分析报告
        analyseReport: false,
        // 分析数据
        analyseData: {},
        // 复杂输入框是否打开
        complexInput: false,
        // 页码
        Page_Index: 1,
        // 单页长度
        Page_Length: 5,
        // 能搜索到的题目数量
        Total_Count: -1,
        // 检索到的题目
        questionList: [],
        // 用于保存检索条件的Json
        filterRecord: {
            // 题型
            type: [false, false, false, false, false, false, false],
            // 难度
            difficulty: [0.0, 1.0],
            // 题库
            database: []
        },
        // 用于显示的题目类型
        typeAim: ['全部', '单选题', "多选题", "判断题", "填空题", '简答题', "计算题", "其他"],
        // 用于筛选的题目难度
        difficultyAim: ['全部', '容易', '较易', '中等', '较难', '困难'],
        // 用于筛选的数据库名
        databaseAim: [],
        // 自定义难度区间
        selfDiffGap: false,
        selfDiffGap_Min: "0.0",
        selfDiffGap_Max: "1.0",
        // 题目是否展开
        Expand_List: []
    }
  },
  watch:{
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    KnowledgeSelectType(newVal, oldVal){
      if(newVal != oldVal){
        this.$refs.tree.setCheckedKeys([])
        this.KnowledgeUnitList.splice(0, this.KnowledgeUnitList.length)
        this.KnowledgeUnitIDList.splice(0, this.KnowledgeUnitIDList.length)
        this.KnowledgeUnitLevelList.splice(0, this.KnowledgeUnitLevelList.length)
      }
    },
    Period(newVal, oldVal){
      if(newVal!= oldVal){
        this.KnowledgeUnitList = [];
        this.KnowledgeUnitIDList = [];
        this.KnowledgeUnitLevelList = [];
        this.$refs.tree.setCheckedKeys([])
        this.Init();
      }
    },
    Subject(newVal, oldVal){
      if(newVal!= oldVal){
        this.KnowledgeUnitList = [];
        this.KnowledgeUnitIDList = [];
        this.KnowledgeUnitLevelList = [];
        this.$refs.tree.setCheckedKeys([])
        this.Init();
      }
    },
  },
  mounted() {
      this.initDatabaseList();
      this.Init();
  },
  methods: {
    // 检索试题
    Search_KP(){

      this.loading = true;

      if(this.KnowledgeUnitIDList != this.KnowledgeUnitIDList_Cache){
        this.Page_Index = 1;
      }

      this.KnowledgeUnitIDList_Cache = this.KnowledgeUnitIDList;

      let param={}

      let database = [];
      for(let i = 0 ; i < this.filterRecord.database.length; i++){
          if(this.filterRecord.database[i]){
              database.push(this.databaseAim[i+1].name)
          }
      }

      let type = [];
      for(let i = 0 ; i < this.filterRecord.type.length; i++){
          if(this.filterRecord.type[i]){
              type.push(this.typeAim[i+1])
          }
      }

      let kl = [[0], [1], [2]];

      for(let i = 0; i < this.KnowledgeUnitIDList.length; i++){
        kl[this.KnowledgeUnitLevelList[i]].push(this.KnowledgeUnitList[i])
      }


      for(let i = 2; i >= 0; i--){
        if(kl[i].length == 1){
          kl.splice(i, 1)
        }
      }

      var data = JSON.stringify({
          "size": 5,
          "database": database,
          "page_count": this.Page_Index,
          "subject": [this.Subject],
          "period": [this.Period],
          "difficulty": this.filterRecord.difficulty,
          "type": type,
          "knowledge": {
            "knowledge_list": kl,
            "select": this.KnowledgeSelectType,
            "filter": this.KnowledgeFilterType
          }
        })

        param.data=data

        console.log(param)

        commonAjax(this.backendIP+'/api/search', param)
        .then((data)=>{
            this.Expand_List = [];
            this.questionList = [];
            for(var i = 0; i < data.results.length; i++){
                this.questionList.push(data.results[i])
                this.Expand_List.push(false);
            }
            this.Total_Count = data.totalLength
            this.loading = false
        }).catch(() => {
            this.$message.error("服务器过忙，请稍后再试。")
            this.loading = false;
        })
    },
    // 尚未完成
    Unfinish(){
      this.$message.error("这部分还没做完")
    },
    // 调整一下知识点的位置对应的边距
    ExistFilter(){
      let Style = {
        'margin-bottom': '4vh'
      }
      if(this.KnowledgeUnitList.length > 0){
        return Style
      }else{
        return {}
      }
    },
    // 调整一下检索按钮的行高
    Get_Suitable_Height(){
      let Style = { 
        'height': (Math.ceil(this.KnowledgeUnitList.length/6) * 46) + 'px',
        'line-height': (Math.ceil(this.KnowledgeUnitList.length/6) * 46) + 'px'
      }
      return Style
    },
    KU_Show(index){
      if(index < this.KnowledgeUnitList.length){
        return true
      }else{
        return false
      }
    },
    // 移除某个选中的知识点
    Delete_KU(index){
      this.KnowledgeUnitIDList.splice(index, 1);
      this.KnowledgeUnitList.splice(index, 1);
      this.KnowledgeUnitLevelList.splice(index, 1)
      this.$refs.tree.setCheckedKeys(this.KnowledgeUnitIDList);
    },
    // 获取知识点显示内容
    Get_Show(label){
      if(label.length > 6){
        return label.substring(0, 5) + "..."
      }else{
        return label
      }
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

      param.append('system', 'tiku');
      param.append('subject', this.Subject);
      param.append('period', this.Period);

      this.$http
          .post(this.backendIP + "/api/getKnowledgeSystem", param, config)
          .then(function(data) {
            this.TreeData = data.body.knowledge_system
            this.$refs.tree.setCheckedKeys([])
            this.waiting = false;
          })
    },
      // 点击节点后的方法
      handleCheckChange(data, checked) {
        if (checked && this.KnowledgeSelectType == "单选") {
          this.KnowledgeUnitList = [];
          this.KnowledgeUnitIDList = [];
          this.KnowledgeUnitLevelList = [];
          this.$refs.tree.setCheckedKeys([data.id])
          this.KnowledgeUnitList.push(data.label)
          this.KnowledgeUnitIDList.push(data.id)
          this.KnowledgeUnitLevelList.push(data.level)
        }else if(!checked && this.KnowledgeSelectType == "单选") {
          this.KnowledgeUnitList = [];
          this.KnowledgeUnitIDList = [];
          this.KnowledgeUnitLevelList = [];
          this.$refs.tree.setCheckedKeys([])
        }
        else if(checked && this.KnowledgeSelectType == "多选"){
          this.KnowledgeUnitList.push(data.label)
          this.KnowledgeUnitIDList.push(data.id)
          this.KnowledgeUnitLevelList.push(data.level)
        }else if(!checked && this.KnowledgeSelectType == "多选" && this.KnowledgeUnitIDList.indexOf(data.id) != -1){
          this.KnowledgeUnitList.splice(this.KnowledgeUnitIDList.indexOf(data.id), 1);
          this.KnowledgeUnitIDList.splice(this.KnowledgeUnitIDList.indexOf(data.id), 1);
          this.KnowledgeUnitLevelList.splice(this.KnowledgeUnitIDList.indexOf(data.id), 1);
          this.$refs.tree.setCheckedKeys(this.KnowledgeUnitIDList);
        }
      },
      // 知识点过滤
      // 这里是输入过滤用的方法
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 加入试题篮
      Add_To_Question_Cart(Question_Index){
        let Aim = this.questionList[Question_Index]
        let Question_Show_Infos = {
          id: "",
          type: "",
          score: 0,
          stem: "",
          options: [],
          answer: "",
          analyse: ""
        }
        if(['单选题', '多选题', '判断题'].indexOf(Aim.type) != -1){
          Question_Show_Infos.type = Aim.type;
          Question_Show_Infos.score = 5;
        }else if(['简答题', '计算题'].indexOf(Aim.type) != -1){
          Question_Show_Infos.type = Aim.type
          Question_Show_Infos.score = 12;
        }else if(Aim.type == '填空题'){
          Question_Show_Infos.type = Aim.type
          Question_Show_Infos.score = 5;
        }

        Question_Show_Infos.id = Aim.id;
        Question_Show_Infos.options = Aim.options;
        Question_Show_Infos.stem = Aim.stem;
        Question_Show_Infos.answer = Aim.answer;
        Question_Show_Infos.analyse = Aim.analysis;
        
        this.$emit("Add_To_Cart", JSON.stringify(Question_Show_Infos));
      },
      // 页码变化搜索
    BackToTop(){
      this.Search_KP();
      document.documentElement.scrollTop = 0 
    },
    // 获取用户所具有的题库权限
    initDatabaseList(){
        this.filterRecord.database = [true]
        this.databaseAim = [
          {name: '全部', nick: '全部'}, 
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
                this.filterRecord.database.push(false)
                this.databaseAim.push({name: data[i], nick: data[i]})
            }
            this.databaseAim[2].nick = "个人题库"
        })
    },
    // 根据不同选择的状况调整按钮样式
    filterButtonStyle(type, index){
        if(type == 'type'){
            if(index == 0){
                if(this.filterRecord.type.indexOf(true) == -1 || this.filterRecord.type.indexOf(false) == -1){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.type[index-1]){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }else if(type == "difficulty"){
            if(index > 0){
                if(this.filterRecord.difficulty[0] == ((index - 1) * 0.2).toFixed(1) && (this.filterRecord.difficulty[1] == (index * 0.2).toFixed(1))){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.difficulty[0] == 0.0 && this.filterRecord.difficulty[1] == 1.0){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }else if(type == "database"){
            if(index == 0){
                if(this.filterRecord.database.indexOf(true) == -1 || this.filterRecord.database.indexOf(false) == -1){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }else{
                if(this.filterRecord.database[index-1]){
                    return "filterButtonFocus"
                }else{
                    return "filterButtonUnfocus"
                }
            }
        }
    },
    type_Change(typeIndex){
        if(typeIndex > 0){
            this.filterRecord.type.splice(typeIndex - 1, 1, !this.filterRecord.type[typeIndex-1])
        }else{
            if(this.filterRecord.type.indexOf(false) == -1){
                this.filterRecord.type.splice(0, 7, false, false, false, false, false, false, false)
            }else{
                this.filterRecord.type.splice(0, 7, true, true, true, true, true, true, true)
            }
        }
    },
    // 小数计算，MD受不了了，这全是0.0000...01了
    Minus_Float(float1, float2){
        return parseFloat((float2 - float1).toFixed(1))
    },
    // 用按钮控制难度区间
    difficulty_Change(difficultyIndex){
        if(difficultyIndex > 0){
            this.filterRecord.difficulty.splice(0, 2, parseFloat("0." + (difficultyIndex - 1) * 2), parseFloat(((difficultyIndex * 0.2).toFixed(1))))
        }else{
            this.filterRecord.difficulty.splice(0, 2, 0.0, 1.0)
        }
    },
    // 获取难度手动输入按钮的样式
    selfDiffGapClass(){
        if(this.filterRecord.difficulty[0] == 0.0 && this.filterRecord.difficulty[1] == 1.0){
            return "filterButtonUnfocus"
        }else if(
            this.Minus_Float(this.filterRecord.difficulty[0], this.filterRecord.difficulty[1]) == 0.2 &&
            [0, 0.2, 0.4, 0.6, 0.8, 1.0].indexOf(this.filterRecord.difficulty[0]) != -1)
        {
            return "filterButtonUnfocus"
        }else{
            return "filterButtonFocus"
        }
    },
    // 手动输入难度自定义区间
    selfDiffGapInput(){
        this.selfDiffGap_Min = this.filterRecord.difficulty[0];
        this.selfDiffGap_Max = this.filterRecord.difficulty[1];
        this.selfDiffGap = true;
    },
    // 更新自定义难度区间
    selfDiffGapCheck(){
        let min = 0.0;
        let max = 1.0;
        min = parseFloat(this.selfDiffGap_Min);
        max = parseFloat(this.selfDiffGap_Max);
        if(isNaN(min) || isNaN(max) || min + "" != this.selfDiffGap_Min || max + "" != this.selfDiffGap_Max){
            this.$message.error("请正确输入数字！")
            return 
        }
        if(min > max) {
            this.$message.error("请将难度下限输入左侧，上限输入右侧。")
            return
        }
        if(min < 0 || min > 1 || max < 0 || max > 1){
            this.$message.error("难度范围在 0.0 到 1.0 之间")
            return
        }
        this.selfDiffGap_Min = parseFloat(this.selfDiffGap_Min);
        this.selfDiffGap_Max = parseFloat(this.selfDiffGap_Max);
        this.filterRecord.difficulty.splice(0, 2, this.selfDiffGap_Min, this.selfDiffGap_Max);
        this.$message.success("搜索难度区间已更新至 " + this.filterRecord.difficulty[0] + " 至 " + this.filterRecord.difficulty[1]);
        this.selfDiffGap = false;
    },
    // 更新数据库选择情况
    database_Change(databaseIndex){
        if(databaseIndex > 0){
            this.filterRecord.database.splice(databaseIndex - 1, 1, !this.filterRecord.database[databaseIndex-1])
        }else{
            let l = this.filterRecord.database.length;
            if(this.filterRecord.database.indexOf(false) == -1){
                this.filterRecord.database.splice(0, this.filterRecord.database.length)
                for(let i = 0; i < l; i++){
                    this.filterRecord.database.push(false);
                }
            }else{
                this.filterRecord.database.splice(0, this.filterRecord.database.length)
                for(let i = 0; i < l; i++){
                    this.filterRecord.database.push(true);
                }
            }
        }
    },
    // 返回选项标签
    Get_Option_Label(Index){
      return String.fromCharCode(Index + 65)
    },
    // 修改是否展开
    Expand(Index){
      this.Expand_List.splice(Index, 1, !this.Expand_List[Index]);
    },
    // 查看单题分析报告
    Check_Analyse(ID, DatabaseName){

      this.Question_Analysing = true;

      commonAjax(this.backendIP+'/api/questionAnalyse',
        {
          databasename:DatabaseName=='公开题库'?'public':DatabaseName,
          ID:ID
        }
      ).then((data)=>{
        this.Refresh = !this.Refresh;
        this.analyseData = data.que_dic;
        this.analyseReport = true;
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.SearchArea{
  border: 1px solid Silver;
  width: 60%;
  border-radius: 18px;
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
.SearchInput{
  font-size: 16px;
  line-height: 28px;
  height: 28px
}
.SearchInput ::v-deep .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}
.selfDiffGapInput{
  font-size: 16px;
}
.selfDiffGapInput ::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
  width: 45px;
  padding: 0px;
  text-align: center;
  border-radius: 0px;   
  background: transparent;
}
.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 34px;
  margin-top: 4px;
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
.quesCard{
  // border: 3px dashed black;
  background: #F8FBFF;
  border: 1px dashed black;
}
.KnowledgePointFilter{
  border: 1px solid Silver;
  border-radius: 10px;
  min-height: 500px;
  box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
// 过滤出的知识点
// 手搓
.KU_Button{
  border: 1px solid #409EFF;
  background: #F8FBFF;
  margin: 4px 20px 4px 0px;
  padding: 4px;
  color: #409EFF;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.5rem;
}
</style>