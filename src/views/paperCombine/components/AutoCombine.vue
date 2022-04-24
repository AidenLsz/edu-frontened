<template>
  <div style=" margin-top: 5vh; margin-bottom: 5vh;"
    v-loading="Combine_loading"
    element-loading-text="正在组卷，请稍候..."
    element-loading-spinner="el-icon-loading">
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
            <el-row type="flex" justify="center" v-show="KnowledgeGroup_List.length > 1">
              <el-select v-model="KnowledgeGroup" placeholder="请选择知识体系">
                <el-option 
                  v-for="KnowledgeSystem in KnowledgeGroup_List" 
                  :value="KnowledgeSystem.name" 
                  :label="KnowledgeSystem.view_name"
                  :key="KnowledgeSystem.view_name"></el-option>
              </el-select>
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
                node-key="id"
                check-strictly
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
          <el-col>
            <el-row type="flex" justify="start">
                <label style="padding-top: 4px">已选知识点 {{KnowledgeUnitList.length}} 个：</label>
                <el-button 
                    type="text" 
                    style="padding: 0px; margin: 0px; font-weight: bold; margin-left: 30px"
                    v-if="KnowledgeUnitList.length > 30"
                    @click="KnowledgePoint_All_Show = !KnowledgePoint_All_Show">{{KnowledgePoint_All_Show ? '折叠' : "展开"}}全部知识点</el-button>
            </el-row>
            <el-row 
              v-for="Row_Index in Math.ceil(KnowledgeUnitList.length/6)" 
              :key="'KU_Row' + Row_Index"
              >
              <el-col :span="4" v-for="Col_Index in 6" :key="'KU_COL_' + Row_Index + '_' + Col_Index">
                <el-tooltip 
                  class="item" 
                  effect="dark" 
                  :content="KnowledgeUnitList[(Row_Index-1) * 6 + Col_Index - 1] 
                  + ' - ' + (KnowledgeUnitLevelList[(Row_Index-1) * 6 + Col_Index - 1] + 1) + '级知识点'" 
                  placement="top">
                    <el-row 
                      type="flex" 
                      justify="center" 
                      v-show="KU_Show((Row_Index-1) * 6 + Col_Index - 1)"
                      class="KU_Button"
                      :style="Get_Different_Level_Color(KnowledgeUnitLevelList[(Row_Index-1) * 6 + Col_Index - 1])"
                      @click.native="Delete_KU((Row_Index-1) * 6 + Col_Index - 1)">
                        {{Get_Show(KnowledgeUnitList[(Row_Index-1) * 6 + Col_Index - 1])}}
                        <i class="el-icon-delete" style="line-height: 20px; margin-left: 10px"></i>
                    </el-row>
                </el-tooltip>
              </el-col>
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
                      :class="filterButtonStyle('difficulty', difficulty)" 
                      @click.native="difficulty_Change(difficulty)">
                  <span>{{difficulty}}</span>
              </el-row>
          </el-col>
        </el-row>
        <!-- 筛选行 - 题型 -->
        <el-row style="margin-top: 2vh; font-size: 16px; ">
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
        <!-- 筛选行 - 题库 -->
        <el-row style="margin-top: 2vh; font-size: 16px;">
          <el-col :span="2">
              <el-row type="flex" justify="start" style="height: 30px; line-height: 30px">
                  <label>题库：</label>
              </el-row>
          </el-col>
          <el-col :span="databaseIndex == 0 ? 2 : 3" v-for="(databaseName, databaseIndex) in databaseAim" :key="'Database_' + databaseIndex">
              <el-row type="flex" justify="center" :class="filterButtonStyle('database', databaseIndex)" @click.native="database_Change(databaseIndex)">
                  <span>{{databaseName.nick || databaseName.name}}</span>
              </el-row>
          </el-col>
        </el-row>
        <el-row type="flex" justify="start" style="margin-top: 2vh; font-size: 16px; margin-bottom: 2vh">
            <label>已选题型：</label>
        </el-row>
        <el-row v-show="filterRecord.type.indexOf(true) == -1" type="flex" justify="center" style="margin-top: 2vh; font-size: 16px; margin-bottom: 1vh; height: 100px; line-height: 100px; color: #ccc;">
            <label>暂无题型选项，请选择所需要的题型</label>
        </el-row>
        <el-row 
            style="font-size: 16px; height: 40px; line-height: 40px; margin-bottom: 10px"
            v-for="(typeSelected, typeSelected_Index) in filterRecord.type" 
            :key="typeAim[typeSelected_Index] + '_Selected'" 
            v-show="typeSelected"
            type="flex"
            justify="start">
            <el-col :span="2">
                <el-row type="flex" justify="start">
                    <label>{{typeAim[typeSelected_Index]}}：</label>
                </el-row>
            </el-col>
            <el-col :span="4">
                <el-row type="flex" justify="start">
                    <el-input-number :min="0" v-model="filterRecord.numbers[typeAim[typeSelected_Index]]"></el-input-number>
                </el-row>
            </el-col>
            <el-col :span="1" :offset="1">
                <el-row type="flex" justify="start">
                    <label>题</label>
                </el-row>
            </el-col>
            <el-col :span="1">
                <el-row type="flex" justify="start">
                    <el-button type="text" @click="Cancel_Type_Select(typeSelected_Index)"><i class="el-icon-delete" style="font-size: 20px; margin-top: -3px"></i></el-button>
                </el-row>
            </el-col>
        </el-row>
      </el-col>
    </el-row>
    
    <el-row type="flex" justify="center" style="margin-top: 30px">
        <el-button type="primary" @click="Auto_Combine()" :disabled="filterRecord.type.indexOf(true) == -1">生成试卷</el-button>
    </el-row>
  </div>
</template>
<script>

import {commonAjax} from '@/common/utils/ajax'
// import FileSaver from 'file-saver'

// import FileSaver from "file-saver";

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
      },
      Database_List: {
        type: Array,
        default: function(){
          return []
        }
      }
  },
  components: {},
  data() {
    return {
      // 知识树用到的变量
        // 等待变量
        waiting: false,
        // 要展示的知识点槽
        KnowledgeUnitList: [],
        // 展示的知识点对应的ID
        KnowledgeUnitIDList: [],
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
        KnowledgeGroup: "tiku",
        KnowledgeGroup_List: [],
        // 正在加载
        loading: false,
        // 用于保存检索条件的Json
        filterRecord: {
            // 题型
            type: [false, false, false, false, false, false],
            // 题目数量
            numbers: {
                '单选题': 0,
                '多选题': 0,
                '判断题': 0,
                '填空题': 0,
                '简答题': 0,
                '计算题': 0
            },
            // 难度
            difficulty: "全部",
            // 题库
            database: []
        },
        // 用于显示的题目类型
        typeAim: ['单选题', "多选题", "判断题", "填空题", '简答题', "计算题"],
        // 用于筛选的题目难度
        difficultyAim: ['全部', '容易', '较易', '中等', '较难', '困难'],
        // 用于筛选的数据库名
        databaseAim: this.Database_List,
        // 最上面的知识点是否全部显示
        KnowledgePoint_All_Show: false,
        Ques_List: [],
        Combine_loading: false,
    }
  },
  watch:{
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    Period(newVal, oldVal){
      if(newVal!= oldVal){
        this.KnowledgeUnitList = [];
        this.KnowledgeUnitIDList = [];
        this.KnowledgeUnitLevelList = [];
        this.$refs.tree.setCheckedKeys([])
        this.Init_KP_System_Name();
        this.Init();
      }
    },
    Subject(newVal, oldVal){
      if(newVal!= oldVal){
        this.KnowledgeUnitList = [];
        this.KnowledgeUnitIDList = [];
        this.KnowledgeUnitLevelList = [];
        this.$refs.tree.setCheckedKeys([])
        this.Init_KP_System_Name();
        this.Init();
      }
    },
    KnowledgeGroup(){
      this.KnowledgeUnitList = [];
      this.KnowledgeUnitIDList = [];
      this.KnowledgeUnitLevelList = [];
      this.$refs.tree.setCheckedKeys([])
      this.Init();
    }
  },
  mounted() {
      this.initDatabaseList();
      this.Init_KP_System_Name();
      this.Init();
  },
  methods: {
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
    // 尚未完成
    Unfinish(){
      this.$message.error("这部分还没做完")
    },
    Auto_Combine(){

      this.$confirm("使用智能组卷将清空已存入试题篮的试题，确定要继续吗？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {

        this.$message.success("正在组卷")
        this.Combine_loading = true;

        this.$emit("Clear_Cart", true)

        let data = {
            subject: this.Subject,
            period: this.Period,
            difficulty: this.filterRecord.difficulty,
            numbers: this.filterRecord.numbers,
            knowledge_version: this.KnowledgeGroup,
            database: [],
            knowledgePoint: [[0], [1], [2]]
        }

        if(this.filterRecord.database.indexOf(true) != -1){
          for(let i = 0 ; i < this.filterRecord.database.length; i++){
              if(this.filterRecord.database[i]){
                  data.database.push(this.databaseAim[i+1].name)
              }
          }
        }else{
          for(let i = 0 ; i < this.filterRecord.database.length; i++){
            data.database.push(this.databaseAim[i+1].name)
          }
        }

        for(let i = 0; i < this.KnowledgeUnitLevelList.length; i++){
          data.knowledgePoint[this.KnowledgeUnitLevelList[i]].push(this.KnowledgeUnitList[i])
        }

        for(let i = 2; i >= 0; i--){
          if(data.knowledgePoint[i].length == 1){
            data.knowledgePoint.splice(i, 1)
          }
        }

        commonAjax(this.backendIP + '/api/paperAutoGenerate', {
          'Paper_Data': JSON.stringify(data, null, 4)
        })
        .then((data)=>{
          for(let i = 0; i < data.length; i++){
            this.Add_New_Ques_To_Cart(data[i])
          }
          this.Emit_All();
          this.$message.success("组卷结束")
        }).catch(()=>{
          this.$message.error("虽然找到推荐题目，但由于数据库中缺少推荐题目的某些数据，无法返回结果，请稍后重试，会为您重新推荐题目。")
        }).finally(() => {
          this.Combine_loading = false;
        })
      })
      .catch(() => {
        this.$message.warning("已取消。")
      })
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
    },
    // 调整一下知识点的位置对应的边距
    ExistFilter(){
      let Style = {
        'margin-bottom': '4vh',
        'font-size': '16px'
      }
      return Style
    },
    KU_Show(index){
      if(index < this.KnowledgeUnitList.length && (index < 30 || this.KnowledgePoint_All_Show)){
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
    Get_Show(label = ""){
      if(label.length > 6){
        return label.substring(0, 5) + "..."
      }else{
        return label
      }
    },
    // 获取当前学科学段所能用的知识体系版本
    // 获取知识树
    Init_KP_System_Name(){

      this.waiting = true;

      let Param = {
        subject: this.Subject,
        period: this.Period
      }

      commonAjax(this.backendIP + '/api/getKnowledgeSystemName', Param)
        .then((data)=>{
          this.KnowledgeGroup_List = data;
          this.KnowledgeGroup = this.KnowledgeGroup_List[0].name;
        }).catch(()=>{

        }).finally(() => {
          this.waiting = false;
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

      param.append('system', this.KnowledgeGroup);
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
        if(checked){
          this.KnowledgeUnitList.push(data.label)
          this.KnowledgeUnitIDList.push(data.id)
          this.KnowledgeUnitLevelList.push(data.level)
        }else if(!checked && this.KnowledgeUnitIDList.indexOf(data.id) != -1){
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
    // 获取用户所具有的题库权限
    initDatabaseList(){
        this.filterRecord.database = [true]
        for(let i = 1; i < this.databaseAim.length - 1; i++){
          this.filterRecord.database.push(false)
        }
    },
    // 根据不同选择的状况调整按钮样式
    filterButtonStyle(type, index){
        if(type == 'type'){
            if(this.filterRecord.type[index]){
                return "filterButtonFocus"
            }else{
                return "filterButtonUnfocus"
            }
        }else if(type == "difficulty"){
            if(this.filterRecord.difficulty == index){
                return "filterButtonFocus"
            }else{
                return "filterButtonUnfocus"
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
        if(!this.filterRecord.type[typeIndex]){
            this.filterRecord.type.splice(typeIndex, 1, true)
        }else{
            this.filterRecord.type.splice(typeIndex, 1, false)
            this.filterRecord.numbers[this.typeAim[typeIndex]] = 0
        }
    },
    Cancel_Type_Select(typeSelected_Index){
        this.filterRecord.type.splice(typeSelected_Index, 1, false)
        this.filterRecord.numbers[this.typeAim[typeSelected_Index]] = 0
    },
    // 小数计算，MD受不了了，这全是0.0000...01了
    Minus_Float(float1, float2){
        return parseFloat((float2 - float1).toFixed(1))
    },
    // 用按钮控制难度区间
    difficulty_Change(difficulty){
        this.filterRecord.difficulty = difficulty
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
    }
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