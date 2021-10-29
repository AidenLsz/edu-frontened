<template>
  <div>
    <!-- 地址框 -->
    <el-row justify="start" type="flex" style="margin-bottom: 3vh; margin-left: 5vw; margin-right: 5vw; margin-top: 10px;">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            组卷系统
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row style="min-height: 50px; background: #409EFF;">
        <el-col :span="3" :offset="1" class="Bar_Menu_Unfocus">
            <el-popover 
                placement="bottom-start"
                trigger="click"
                width="400">
                <el-row 
                    v-for="(Item, Index) in Select_List" 
                    :key="'Select_List_' + Index"
                    style="margin-bottom: 12px">
                    <el-col :span="24">
                        <el-row type="flex" justify="start">
                            <label style="font-size: 30px; height: 30px; line-height: 30px; margin-right: 12px">·</label>
                            <label style="font-size: 16px; height: 30px; line-height: 30px">{{Item.period}}</label>
                        </el-row>
                        <el-row 
                            v-for="Subject_Row_Index in Math.ceil(Item.subjects.length / 6)" 
                            :key="'Select_List_' + Index + '_' + Subject_Row_Index"
                            style="margin-bottom: 3px;">
                            <el-col :span="4" v-for="Col_Index in [0, 1, 2, 3, 4, 5]" :key="'Select_List_' + Index + '_' + Subject_Row_Index + '_' + Col_Index">
                                <el-row 
                                    type="flex" 
                                    justify="center" 
                                    :class="Selected_Catch(Item.period, Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index])"
                                    @click.native="Change_Select(Item.period, Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index])">
                                    {{Item.subjects[(Subject_Row_Index - 1) * 6 + Col_Index]}}
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row type="flex" justify="center" slot="reference">
                    <i class="el-icon-menu" style="height: 50px; line-height: 50px; font-size: 20px; margin-right: 15px"></i>
                    {{Selected_Period + Selected_Subject}}
                </el-row>
            </el-popover>
        </el-col>
        <el-col :span="2" :class="Menu_Now('keyword')" @click.native="Jump_To('keyword')">
            <el-row type="flex" justify="center">
                关键词挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now('knowledgePoint')" @click.native="Jump_To('knowledgePoint')">
            <el-row type="flex" justify="center">
                知识点挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now('import')" @click.native="Jump_To('import')">
            <el-row type="flex" justify="center">
                录入题目
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now('databasePaper')" @click.native="Jump_To('databasePaper')">
            <el-row type="flex" justify="center">
                试卷挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now('detailTable')" @click.native="Jump_To('detailTable')">
            <el-row type="flex" justify="center">
                细目表挑题
            </el-row>
        </el-col>
        <el-col :span="2" :class="Menu_Now('autoCombine')" @click.native="Jump_To('autoCombine')">
            <el-row type="flex" justify="center">
                智能组卷
            </el-row>
        </el-col>
        <el-col :span="3" :offset="4" class="Question_Shopping_Card">
            <el-popover
                trigger="click"
                width="400"
                placement="bottom-end"
                style="padding: 0px"
                :ref="'Question_Cart'">
                <div v-show="Question_List.length > 0" id="Question_Type_Chart" class="Question_Type_Chart" style="margin-bottom: 14px"></div>
                <el-row type="flex" justify="center" v-show="Question_List.length == 0" style="font-size: 16px">
                    <label>你的试题篮空空如也</label>
                </el-row>
                <el-row type="flex" justify="center" v-show="Question_List.length > 0">
                  <el-col :span="12">
                      <el-row type="flex" justify="center">
                            <el-button type="primary" @click="Clear_Question_Cart()">清空试题篮</el-button>
                      </el-row>
                  </el-col>
                  <el-col :span="12">
                        <el-row type="flex" justify="center">
                            <el-button type="primary" @click="Combine_Paper()">开始组卷</el-button>
                        </el-row>
                  </el-col>
                </el-row>
                <el-row type="flex" justify="center" slot="reference" @click.native="Init_Question_Type_Chart()">
                    <i class="el-icon-shopping-cart-2" style="height: 32px; line-height: 32px; font-size: 20px; margin-right: 10px"></i>
                    <div 
                        style=" border-radius: 50%; 
                                background: white; 
                                height: 24px; width: 24px; margin-top: 4px;
                                line-height: 24px; margin-right: 20px; 
                                color: #409EFF; font-size: 16px">
                        <label>{{Get_Total_Questions_Count()}}</label>
                    </div>
                    <p style="margin-top: -1px">试题篮</p>
                </el-row>
            </el-popover>
        </el-col>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'keyword'">
        <Keyword @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></Keyword>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'knowledgePoint'">
        <KnowledgePoint @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></KnowledgePoint>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'import'">
        <InputQuestion @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></InputQuestion>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'detailTable'">
        <DetailTable 
            @Jump_To_SC="Jump_To_SC"
            @Add_To_Cart="Add_To_Question_Cart" 
            @Clear_Cart="Clear_Cart" 
            :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></DetailTable>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'databasePaper'">
        <FromDatabasePaper @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></FromDatabasePaper>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'autoCombine'">
        <AutoCombine @Add_To_Cart="Add_To_Question_Cart" :Period.sync="Selected_Period" :Subject.sync="Selected_Subject"></AutoCombine>
    </el-row>
    <el-row v-if="Using_Menu_Index == 'startCombine'">
        <StartCombine 
            @Update_Question_List="Update_Question_List"
            @Jump_To_SC="Jump_To_SC"
            @Add_To_Cart="Add_To_Question_Cart" 
            @Clear_Cart="Clear_Cart"
            :Question_List.sync="Question_List"
            :Period.sync="Selected_Period" 
            :Subject.sync="Selected_Subject"></StartCombine>
    </el-row>
  </div>
</template>
<script>

import Keyword from '@/views/paperCombine/components/Keyword'
import KnowledgePoint from '@/views/paperCombine/components/KnowledgePoint'
import InputQuestion from '@/views/paperCombine/components/InputQuestion'
import DetailTable from '@/views/paperCombine/components/DetailTable'
import StartCombine from '@/views/paperCombine/components/StartCombine'
import FromDatabasePaper from '@/views/paperCombine/components/FromDatabasePaper'
import AutoCombine from '@/views/paperCombine/components/AutoCombine'

import * as echarts from 'echarts';

var Question_Cart_Charts = "";

export default {
  name: 'paperCombine',
  props: {

  },
  components: {
        Keyword, KnowledgePoint,
        InputQuestion, DetailTable, StartCombine,
        FromDatabasePaper, AutoCombine
  },
  data() {
    return {
        // 存放当前正在使用第几个菜单项
        Using_Menu_Index: 'keyword',
        // 题目列表信息
        Question_List: [],
        // 用于设定学科 / 学段选择位置的数据字段
        Select_List: [{
            period: "高中",
            subjects: ['数学', "语文", "英语", "物理", "化学", "生物", "政治", "历史", "地理"]
        },{
            period: "初中",
            subjects: ['数学', "语文", "英语", "物理", "化学", "生物", "政治", "历史", "地理"]
        },{
            period: "小学",
            subjects: ['数学', "语文", "英语"]
        }],
        // 被选中的学段和科目
        Selected_Period: "高中",
        Selected_Subject: "数学"
    }
  },
  watch:{
      
  },
  mounted() {
    //   if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
    //     this.$message.error("您尚未登录，请登录后使用组卷功能。")
    //     this.$router.push("/")
    //     return 
    //   }
      this.Init_Question_Type_Chart();
  },
  methods: {
      Jump_To_SC(){
          this.Combine_Paper()
      },
      // 清空试题篮
      Clear_Cart(){
        this.Question_List = [];
        this.Init_Question_Type_Chart();
      },
      // 从组卷那边更新题目列表
      Update_Question_List(val){
        this.Question_List = JSON.parse(val);
        if(this.Question_List.length == 0){
            this.Using_Menu_Index = 'keyword';
        }
      },
      // 获取题目总数
      Get_Total_Questions_Count(){
          let count = 0;
          for(let i = 0; i < this.Question_List.length; i++){
              count = count + this.Question_List[i].list.length;
          }
          return count;
      },
      // 判断当前要给菜单栏显示的样式
    Menu_Now(index){
        if(index == this.Using_Menu_Index){
            return "Bar_Menu_Focus"
        }else{
            return "Bar_Menu_Unfocus"
        }
    },
    // 添加到“题目篮”的方法
    Add_To_Question_Cart(val){
        let Question = JSON.parse(val);
        for(let i = 0; i < this.Question_List.length; i++){
            for(let j = 0; j < this.Question_List[i].list.length; j++){
                if(this.Question_List[i].list[j].id != "" && this.Question_List[i].list[j].id == Question.id){
                    this.$message.error("这道试题已经在试题篮里了。")
                    return;
                }
            }
        }
        let Switch = false;
        for(let i = 0; i < this.Question_List.length; i++){
            if(this.Question_List[i].type == Question.type){
                this.Question_List[i].list.push(Question);
                Switch = true;
                break;
            }
        }
        if(!Switch){
            this.Question_List.push({
                type: Question.type,
                list: [Question]
            })
        }
        this.Init_Question_Type_Chart();
    },
    // 通过当前选择的学科学段来判断筛选按钮的样式
    Selected_Catch(Period, Subject){
        if(Period == this.Selected_Period && Subject == this.Selected_Subject){
            return "Selected_Item"
        }else{
            return "Unselected_Item"
        }
    },
    // 更换当前选择的学科学段
    Change_Select(Period, Subject){
        this.Selected_Period = Period;
        this.Selected_Subject = Subject;
    },
    // 更新试题类型图
    Init_Question_Type_Chart(){
        if (Question_Cart_Charts != null && Question_Cart_Charts != "" && Question_Cart_Charts != undefined){
            Question_Cart_Charts.dispose();
        }
        Question_Cart_Charts = echarts.init(document.getElementById('Question_Type_Chart'));

        //职称结构取数
        var Question_Types = [];
        var Question_Types_Count = [];

        for(let i = 0; i < this.Question_List.length; i++){
            Question_Types.push(this.Question_List[i].type);
            Question_Types_Count.push(this.Question_List[i].list.length)
        }

        var Data_Dict = [];
        for (var i = 0; i < Question_Types.length; i++) {
            Data_Dict.push({
                name: Question_Types[i],
                value: Question_Types_Count[i]
            })
        }
        var rich = {
            name: {
                color: "#666666",
                fontSize: 14,
                padding: [8, 30, 0, 30],
                fontWeight: '400',
                align: 'left'
            },
            value: {
                color: "#333",
                fontSize: 15,
                padding: [0, 30, 8, 30],
                fontWeight: '500',
                align: 'left'
            },
            percent: {
                color: "#FFF",
                align: 'right',
                fontSize: 15,
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
        //职称结构图表
        var colorList = ['#507AFF', '#51D9A2', '#FFC371', '#797AFF'];
        let option = {
            title: {
                text: "各题型所占数量及比例",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [35,35,40,25]
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
                    length: 10,
                    length2: 20,
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
                    fontSize: "14px",
                    rich: rich
                },
                data: Data_Dict,
                z: -1
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
        Question_Cart_Charts.setOption(option);
        //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
        window.addEventListener('resize',function() {Question_Cart_Charts.resize()});
    },
    // 清空试题篮
    Clear_Question_Cart(){
        this.Question_List = [];
        this.$message.warning("您的试题篮已清空。");
        this.Init_Question_Type_Chart();
    },
    // 切换至组卷页面
    Combine_Paper(){
        if(this.Question_List.length == 0){
            this.$message.error("你的试题篮里目前没有题目，无法组卷。");
            return
        }else{
            this.Jump_To('startCombine');
            this.$refs['Question_Cart'].doClose();
        }
    },
    Jump_To(Aim){
        // if(Aim != 'keyword' || Aim != 'startCombine'){
        //     if(!this.$store.state.user.name || this.$store.state.user.name.length == 0){
        //         this.$message.error("您尚未登录，请登录后使用此功能。")
        //         return 
        //     }
        // }
        this.Using_Menu_Index = Aim;
    }
  },
}
</script>
<style >
.Bar_Menu_Unfocus{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-size: 16px;
    color: white;
}
.Bar_Menu_Focus{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    background: #71B0F2;
}
.Question_Shopping_Card{
    margin-top: 7px;
    margin-bottom: 2px;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    font-size: 16px;
    color: white;
    border: 2px solid white; 
    border-radius: 8px; 
    box-sizing: border-box
}
.Selected_Item{
    background: #409EFF;
    color: white;
    cursor: pointer;
    border-radius: 30px;
    height: 30px;
    line-height: 30px;
    margin-left: 5px;
    margin-right: 5px;
}
.Unselected_Item
{
    background: transparent;
    color: black;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
}
.Question_Type_Chart{
    width: 374px;
    height: 374px;
    background: #EEF5FE;
}
</style>