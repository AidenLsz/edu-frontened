// 这一页面主要用于测试各类新功能的显示是否符合具体要求，等待完成后再放到正式页面上去

<template>
    <div style="min-height: 600px">
      <el-row style="padding-top: 15px">
        <label style="font-size: 22px">xxx试卷分析报告</label>
      </el-row>
      <el-row>
        <el-col :span="18" :offset="3">
          <el-divider style="width: 3px"></el-divider>
        </el-col>
      </el-row>
      <!-- 综合分析 -->
      <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(0)" :class="Get_Part_Row_Style(0)">
        <el-col :span="2">
          综合分析
        </el-col>
        <el-col :span="2" :offset="20">
          <i class="el-icon-arrow-down" v-if="!Part_Expand[0]"></i>
          <i class="el-icon-arrow-up" v-if="Part_Expand[0]"></i>
        </el-col>
      </el-row>
      <el-row :class="Get_Expand_Or_Collapse(0)">
        <!-- 本卷大题数量 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; font-size: 16px" type="flex" justify="start">
          <label>本卷共{{Paper_Json.sub_question.length}}道大题，各项指标如下：</label>
        </el-row>
        <!-- 三项指标的假表格 -->
        <!-- 表头项 -->
        <el-row style="width: 67vw; background: WhiteSmoke; font-weight: bold; font-size: 16px; margin-left: 16.5vw; margin-top: 30px; padding-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
          <el-col :span="5" :offset="4">均值</el-col>
          <el-col :span="5">方差</el-col>
          <el-col :span="5">最大值</el-col>
          <el-col :span="5">最小值</el-col>
        </el-row>
        <!-- 第一项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
          <el-col :span="4">难度</el-col>
          <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.mean)}}</el-col>
          <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.min)}}</el-col>
          <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.max)}}</el-col>
          <el-col :span="5">{{Reduce_Length(Paper_Json.difficulty_statistics.std)}}</el-col>
        </el-row>
        <!-- 第二项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; padding-bottom: 5px; border-bottom: 1px solid silver">
          <el-col :span="4">指标2</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
        </el-row>
        <!-- 第三项 -->
        <el-row style="width: 67vw; margin-left: 16.5vw; margin-top: 5px; margin-bottom: 40px; padding-bottom: 5px; border-bottom: 1px solid silver">
          <el-col :span="4">指标3</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
          <el-col :span="5">0</el-col>
        </el-row>
        <!-- 随意添加的一个假柱状图 -->
        <el-row>
          <div id="Paper_Total_Bar" class="Paper_Total_Bar"></div>
        </el-row>
      </el-row>
      <!-- 分析详情 -->
      <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(1)" :class="Get_Part_Row_Style(1)">
        <el-col :span="2">
          分析详情
        </el-col>
        <el-col :span="2" :offset="20">
          <i class="el-icon-arrow-down" v-if="!Part_Expand[1]"></i>
          <i class="el-icon-arrow-up" v-if="Part_Expand[1]"></i>
        </el-col>
      </el-row>
      <el-row :class="Get_Expand_Or_Collapse(1)">
        <el-row style="width: 18vw; margin-left: 41vw; margin-top: 10px; border: 1px solid #409EFD; border-radius: 10px; height: 30px">
            <el-col :span="12" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px;" :class="Check_Total_Switch(true)" v-on:click.native="Paper_Total_Analyse_Focus = true">
                知识点分析
            </el-col>
            <el-col :span="12" style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;" :class="Check_Total_Switch(false)" v-on:click.native="Paper_Total_Analyse_Focus = false">
                难度分析
            </el-col>
        </el-row>
        <!-- 知识点分析 -->
        <el-row :class="Paper_Total_Analyse_Hidden(true)">
            2-1
        </el-row>
        <!-- 难度分析 -->
        <el-row :class="Paper_Total_Analyse_Hidden(false)">
            <!-- 总分析行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 18px; margin-top: 30px">
                <label>本卷难度平均值为&nbsp;&nbsp;{{Reduce_Length(Paper_Json.difficulty_statistics.mean)}}&nbsp;&nbsp;，占比最大的题目难度区间为&nbsp;&nbsp;{{Max_Gap}}</label>
            </el-row>
            <!-- 提示行 -->
            <el-row type="flex" justify="start" style="margin-left: 16.5vw; width: 67vw; font-size: 18px">
                <label>各难度所占分值如下：</label>
            </el-row>
            <!-- 环状图 -->
            <el-row>
                <div id="Paper_Total_Difficult_Analyse" class="Paper_Total_Difficult_Analyse"></div>
            </el-row>
        </el-row>
      </el-row>
      <!-- 相似试卷 -->
      <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(2)" :class="Get_Part_Row_Style(2)">
        <el-col :span="2">
          相似试卷
        </el-col>
        <el-col :span="2" :offset="20">
          <i class="el-icon-arrow-down" v-if="!Part_Expand[2]"></i>
          <i class="el-icon-arrow-up" v-if="Part_Expand[2]"></i>
        </el-col>
      </el-row>
      <el-row :class="Get_Expand_Or_Collapse(2)">
        3
      </el-row>
      <!-- 试卷详情 -->
      <el-row type="flex" justify="start" v-on:click.native="Expand_Or_Collapse(3)" :class="Get_Part_Row_Style(3)">
        <el-col :span="2">
          试卷详情
        </el-col>
        <el-col :span="2" :offset="20">
          <i class="el-icon-arrow-down" v-if="!Part_Expand[3]"></i>
          <i class="el-icon-arrow-up" v-if="Part_Expand[3]"></i>
        </el-col>
      </el-row>
      <el-row :class="Get_Expand_Or_Collapse(3)">
        4
      </el-row>
      <!-- <el-row>
        {{Paper_Json.id}}
        {{Paper_Json.type}}
        {{Paper_Json.difficulty_area_score}}
        {{Paper_Json.difficulty_statistics}}
        {{Paper_Json.knowledge_knowledge2num}}
        {{Paper_Json.knowledge2difficulty}}
      </el-row>
      <el-row v-for="(Item, Index) in Paper_Json.sub_question" :key="Index" style="border: 1px solid black">
        <el-row>
          {{Item.id}}
        </el-row>
        <el-row>
          {{Item.type}}
        </el-row>
        <el-row>
          {{Item.difficulty_area_score}}
        </el-row>
        <el-row>
          {{Item.difficulty_statistics}}
        </el-row>
        <el-row>
          {{Item.knowledge_knowledge2num}}
        </el-row>
        <el-row>
          {{Item.knowledge2difficulty}}
        </el-row>
        <el-row>
          {{Item.sub_question}}
        </el-row>
      </el-row> -->
    </div>
</template>
<script>

// import $ from "jquery";

// 引入基本模板
import * as echarts from 'echarts';

export default {

    components: { },
    name: "TestPage",
    data(){
        return {
          Paper_Json:{ 
            "id": "",
            "type": "",
            "status": "",
            "difficulty_area_score": [],
            "difficulty_statistics": {},
            "knowledge_knowledge2num": {},
            "knowledge2difficulty": {},
            "sub_question": []
          },
          Part_Expand: [false, false, false, false],
          Paper_Total_Analyse_Focus: true,
          Max_Gap: ""
        }
    },
    mounted() {
      this.Init()
    },
    methods: {
        // 调整数据长度
        Reduce_Length(Data){
            Data = Data + "";
            return Data.substring(0, 4);
        },
        // 返回全卷分析选项的样式
        Check_Total_Switch(Part){
            if(Part == this.Paper_Total_Analyse_Focus){
                return "Paper_Total_Analyse_Focus"
            }else{
                return "Paper_Total_Analyse_Unfocus"
            }
        },
        // 返回功能条的样式
        Get_Part_Row_Style(index){
            if(this.Part_Expand[index])
                return "Part_Row_Style_Expand"
            return "Part_Row_Style_Collapse"
        },
        // 展开下级展示区域
        Expand_Or_Collapse(index){
            this.Part_Expand.splice(index, 1, !this.Part_Expand[index])
        },
        // 修改下级展示区域的Style
        Get_Expand_Or_Collapse(index){
            if(!this.Part_Expand[index])
                return "Hidden"
            return ""
        },
        // 全卷分析的不同模块区域是否显示
        Paper_Total_Analyse_Hidden(Part){
            if(Part == this.Paper_Total_Analyse_Focus){
                return ""
            }else{
                return "Hidden"
            }
        },
        // 获取占比最大难度区间
        Get_Max_Difficult_Gap(){
            var Max_Gap = Math.max.apply(Math, this.Paper_Json.difficulty_area_score);
            var Result = "";
            for(var i = 0; i < 10; i++){
                console.log(this.Paper_Json.difficulty_area_score[i] == Max_Gap, Max_Gap, Result)
                if(this.Paper_Json.difficulty_area_score[i] == Max_Gap){
                    if(Result == ""){
                        if(i != 9){
                            Result = "0." + i + " - 0." + (i + 1);
                        }
                        else{
                            Result = "0." + i + " - 1.0";
                        }
                    }else{
                        if(i != 9){
                            Result = Result + "、0." + i + " - 0." + (i + 1);
                        }
                        else{
                            Result = Result + "、0." + i + " - 1.0";
                        }
                    }
                }
            }
            this.Max_Gap = Result;
        },
        // 初始化总体的那张柱状图的方法
        Init_Paper_Total_Bar(){

            let myChart = echarts.init(document.getElementById('Paper_Total_Bar'));

            let option = {
                grid: {
                x: 70,
                y: 90,
                x2: 30,
                y2: 35
                },
                title: {
                    text: "各大题指标变化趋势",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                color: ["#00B0F0", "#FFC000", "#92D050"],
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
                    data: ['指标1', '指标2', '指标3'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,40,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                xAxis : [
                {
                    type : 'category',
                    data : ["大题1", "大题2", "大题3", "大题4"],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示x轴下的字体 默认为true
                        interval:0,  //可以设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
                        textStyle:{   //textStyle里面写x轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                }
                ],
                yAxis : [
                {
                    type : 'value',
                    name : '数量',
                    min: 0.0,
                    max: 0.7,
                    axisLabel:{
                        show:true,  //这里的show用于设置是否显示y轴下的字体 默认为true
                        textStyle:{   //textStyle里面写y轴下的字体的样式
                            color:'black',
                            fontSize:14
                        }
                    },
                    nameTextStyle:{
                        color:"black", 
                        fontSize:14,  
                        padding:[30, 35, 15, 10]
                    }
                }
                ],
                series : [
                {
                    name:'指标1',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.4, 0.3, 0.2, 0.6]
                },
                {
                    name:'指标2',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.6, 0.2, 0.4, 0.6]
                },
                {
                    name:'指标3',
                    type:'bar',
                    barWidth: '20%',
                    data: [0.2, 0.4, 0.1, 0.4]
                },
            ]
            };

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化总体的难度分析的那张环形图的方法
        Init_Paper_Total_Difficult_Analyse(){

            var chartDom = document.getElementById('Paper_Total_Difficult_Analyse');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '18%',
                    right: '15%',
                    orient: 'vertical'
                },
                title: {
                    text: "各难度区间分值图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [15, 5, 5, 5]
                },
                series: [
                    {
                        name: '难度区间',
                        type: 'pie',
                        radius: ['40%', '80%'],
                        center: ["50%", "55%"], 
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                            color: 'black',
                            fontSize: '12',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '24',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: []
                    }
                ]
            };

            for(var i = 0; i < this.Paper_Json.difficulty_area_score.length; i++){
                var name_End = ""
                if(i != 9){
                    name_End = "0." + (i + 1);
                }else{
                    name_End = "1.0";
                }
                option.series[0].data.push(
                    {
                        value: this.Paper_Json.difficulty_area_score[i], 
                        name: "0." + i + "-" + name_End
                    }
                )
            }

            myChart.setOption(option);
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 初始化数据的方法，不要动，放到最下面就得了
        Init(){
            this.Paper_Json = {
            "id": "af6a45a3-46fa-41d6-ac7e-ae3842ce40fb",
            "type": "paper",
            "status": "OK",
            "difficulty_area_score": [
                0,
                0,
                2,
                12,
                3,
                2,
                12,
                0,
                0,
                0
            ],
            "difficulty_statistics": {
                "mean": 0.47843202083341535,
                "min": 0.29554620385169983,
                "max": 0.6161502003669739,
                "std": 0.11606908316104704
            },
            "knowledge_knowledge2num": {
                "解析几何::代数": 1
            },
            "knowledge2score": {
                "解析几何": 4,
                "代数": 10,
                "立体几何与平面几何": 1,
                "三角函数": 10,
                "统计与概率": 4
            },
            "knowledge2difficulty": {
                "解析几何": 0.4028695672750473,
                "代数": 0.5552377372980117,
                "立体几何与平面几何": 0.4640635550022125,
                "三角函数": 0.5189290523529053,
                "统计与概率": 0.3971267342567444
            },
            "sub_question": [
                {
                    "id": "43482c08-8c71-4166-8490-2d991ba5be0a",
                    "type": "PackedQues",
                    "score": 4,
                    "difficulty_statistics": {
                        "mean": 0.4028695672750473,
                        "min": 0.29554620385169983,
                        "max": 0.5101929306983948,
                        "std": 0.10732336342334747
                    },
                    "knowledge_knowledge2num": {
                        "解析几何::代数": 1
                    },
                    "knowledge2difficulty": {
                        "解析几何": 0.4028695672750473,
                        "代数": 0.5101929306983948
                    },
                    "knowledge2score": {
                        "解析几何": 4,
                        "代数": 2
                    },
                    "sub_question": [
                        {
                            "id": "812f1b6f-cd74-41a0-9504-dc4fb9d3871b",
                            "type": "Question",
                            "difficulty": 0.29554620385169983,
                            "knowledge_points": {
                                "id": "812f1b6f-cd74-41a0-9504-dc4fb9d3871b",
                                "一级知识点": [
                                    "解析几何"
                                ],
                                "二级知识点": [
                                    "圆锥曲线与方程"
                                ],
                                "三级知识点": [
                                    "圆锥曲线",
                                    "直线与圆锥曲线的关系"
                                ],
                                "四级知识点": [
                                    "椭圆的定义、标准方程及简单几何性质",
                                    "直线与椭圆的位置关系及其简单应用"
                                ],
                                "first_label": [
                                    "1176327025812840448"
                                ],
                                "second_label": [
                                    "1176329055835004928"
                                ],
                                "third_label": [
                                    "1176333276336627712",
                                    "1176333304631402496"
                                ],
                                "fourth_label": [
                                    "1186906659990282315",
                                    "1186906659990282318"
                                ],
                                "topk": [
                                    [
                                        "解析几何"
                                    ],
                                    [
                                        "解析几何",
                                        "圆锥曲线与方程"
                                    ],
                                    [
                                        "解析几何",
                                        "圆锥曲线与方程",
                                        "圆锥曲线"
                                    ],
                                    [
                                        "解析几何",
                                        "圆锥曲线与方程",
                                        "直线与圆锥曲线的关系"
                                    ],
                                    [
                                        "解析几何",
                                        "圆锥曲线与方程",
                                        "直线与圆锥曲线的关系",
                                        "直线与椭圆的位置关系及其简单应用"
                                    ]
                                ],
                                "topk_label": [
                                    [
                                        1176327025812840448
                                    ],
                                    [
                                        1176327025812840448,
                                        1176329055835004928
                                    ],
                                    [
                                        1176327025812840448,
                                        1176329055835004928,
                                        1176333276336627712
                                    ],
                                    [
                                        1176327025812840448,
                                        1176329055835004928,
                                        1176333304631402496
                                    ],
                                    [
                                        1176327025812840448,
                                        1176329055835004928,
                                        1176333304631402496,
                                        1186906659990282318
                                    ]
                                ]
                            },
                            "score": 2
                        },
                        {
                            "id": "3bd039b1-f8e1-425d-aea9-9b33990fe172",
                            "type": "Question",
                            "difficulty": 0.5101929306983948,
                            "knowledge_points": {
                                "id": "3bd039b1-f8e1-425d-aea9-9b33990fe172",
                                "一级知识点": [
                                    "代数",
                                    "解析几何"
                                ],
                                "二级知识点": [
                                    "函数概念与基本初等函数I"
                                ],
                                "三级知识点": [
                                    "函数及其基本性质"
                                ],
                                "四级知识点": [],
                                "first_label": [
                                    "1176326814415724544",
                                    "1176327025812840448"
                                ],
                                "second_label": [
                                    "1176327246953324544"
                                ],
                                "third_label": [
                                    "1176329475902939136"
                                ],
                                "fourth_label": [],
                                "topk": [
                                    [
                                        "代数"
                                    ],
                                    [
                                        "解析几何"
                                    ],
                                    [
                                        "代数",
                                        "函数概念与基本初等函数I"
                                    ],
                                    [
                                        "代数",
                                        "函数概念与基本初等函数I",
                                        "函数及其基本性质"
                                    ],
                                    [
                                        "代数",
                                        "函数概念与基本初等函数I",
                                        "函数及其基本性质",
                                        "函数的概念"
                                    ]
                                ],
                                "topk_label": [
                                    [
                                        1176326814415724544
                                    ],
                                    [
                                        1176327025812840448
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327246953324544
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327246953324544,
                                        1176329475902939136
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327246953324544,
                                        1176329475902939136,
                                        1186906659990282350
                                    ]
                                ]
                            },
                            "score": 2
                        }
                    ]
                },
                {
                    "id": "9d7f1411-677a-4e69-b34e-e87f28e95a78",
                    "type": "PackedQues",
                    "score": 13,
                    "difficulty_statistics": {
                        "mean": 0.6014587627007411,
                        "min": 0.4640635550022125,
                        "max": 0.6161502003669739,
                        "std": 0.03978468727873507
                    },
                    "knowledge_knowledge2num": {},
                    "knowledge2difficulty": {
                        "立体几何与平面几何": 0.4640635550022125,
                        "代数": 0.6096665263175964,
                        "三角函数": 0.6161502003669739
                    },
                    "knowledge2score": {
                        "立体几何与平面几何": 1,
                        "代数": 6,
                        "三角函数": 6
                    },
                    "sub_question": [
                        {
                            "id": "67856dca-708c-4aa2-9fd7-8850e3edafaf",
                            "type": "PackedQues",
                            "score": 13,
                            "difficulty_statistics": {
                                "mean": 0.6014587627007411,
                                "min": 0.4640635550022125,
                                "max": 0.6161502003669739,
                                "std": 0.03978468727873507
                            },
                            "knowledge_knowledge2num": {},
                            "knowledge2difficulty": {
                                "立体几何与平面几何": 0.4640635550022125,
                                "代数": 0.6096665263175964,
                                "三角函数": 0.6161502003669739
                            },
                            "knowledge2score": {
                                "立体几何与平面几何": 1,
                                "代数": 6,
                                "三角函数": 6
                            },
                            "sub_question": [
                                {
                                    "id": "7c2bcff3-0f75-4062-ab0d-8a9441a74d03",
                                    "type": "Question",
                                    "difficulty": 0.4640635550022125,
                                    "knowledge_points": {
                                        "id": "7c2bcff3-0f75-4062-ab0d-8a9441a74d03",
                                        "一级知识点": [
                                            "立体几何与平面几何"
                                        ],
                                        "二级知识点": [
                                            "几何证明选讲（选考内容）"
                                        ],
                                        "三级知识点": [
                                            "直线与圆的位置关系（选）"
                                        ],
                                        "四级知识点": [
                                            "圆内接四边形的性质定理与判定定理"
                                        ],
                                        "first_label": [
                                            "1176326911555805184"
                                        ],
                                        "second_label": [
                                            "1176328518028763136"
                                        ],
                                        "third_label": [
                                            "1176331976379211776"
                                        ],
                                        "fourth_label": [
                                            "1186906659990282265"
                                        ],
                                        "topk": [
                                            [
                                                "立体几何与平面几何"
                                            ],
                                            [
                                                "立体几何与平面几何",
                                                "几何证明选讲（选考内容）"
                                            ],
                                            [
                                                "立体几何与平面几何",
                                                "立体几何初步",
                                                "空间几何体"
                                            ],
                                            [
                                                "立体几何与平面几何",
                                                "几何证明选讲（选考内容）",
                                                "直线与圆的位置关系（选）"
                                            ],
                                            [
                                                "立体几何与平面几何",
                                                "几何证明选讲（选考内容）",
                                                "直线与圆的位置关系（选）",
                                                "圆内接四边形的性质定理与判定定理"
                                            ]
                                        ],
                                        "topk_label": [
                                            [
                                                1176326911555805184
                                            ],
                                            [
                                                1176326911555805184,
                                                1176328518028763136
                                            ],
                                            [
                                                1176326911555805184,
                                                1176328401812987904,
                                                1176331650112692224
                                            ],
                                            [
                                                1176326911555805184,
                                                1176328518028763136,
                                                1176331976379211776
                                            ],
                                            [
                                                1176326911555805184,
                                                1176328518028763136,
                                                1176331976379211776,
                                                1186906659990282265
                                            ]
                                        ]
                                    },
                                    "score": 1
                                },
                                {
                                    "id": "ef94592e-3828-430c-a629-e23b68f392f3",
                                    "type": "PackedQues",
                                    "score": 12,
                                    "difficulty_statistics": {
                                        "mean": 0.6129083633422852,
                                        "min": 0.6096665263175964,
                                        "max": 0.6161502003669739,
                                        "std": 0.0032418370246887207
                                    },
                                    "knowledge_knowledge2num": {},
                                    "knowledge2difficulty": {
                                        "代数": 0.6096665263175964,
                                        "三角函数": 0.6161502003669739
                                    },
                                    "knowledge2score": {
                                        "代数": 6,
                                        "三角函数": 6
                                    },
                                    "sub_question": [
                                        {
                                            "id": "86ed5c6a-53b0-4dd5-8a70-9860b90897bc",
                                            "type": "Question",
                                            "difficulty": 0.6096665263175964,
                                            "knowledge_points": {
                                                "id": "86ed5c6a-53b0-4dd5-8a70-9860b90897bc",
                                                "一级知识点": [
                                                    "代数"
                                                ],
                                                "二级知识点": [
                                                    "导数及其应用"
                                                ],
                                                "三级知识点": [],
                                                "四级知识点": [],
                                                "first_label": [
                                                    "1176326814415724544"
                                                ],
                                                "second_label": [
                                                    "1176327510267535360"
                                                ],
                                                "third_label": [],
                                                "fourth_label": [],
                                                "topk": [
                                                    [
                                                        "代数"
                                                    ],
                                                    [
                                                        "三角函数"
                                                    ],
                                                    [
                                                        "代数",
                                                        "导数及其应用"
                                                    ],
                                                    [
                                                        "三角函数",
                                                        "基本初等函数II"
                                                    ],
                                                    [
                                                        "三角函数",
                                                        "基本初等函数II",
                                                        "三角函数的图象与性质"
                                                    ]
                                                ],
                                                "topk_label": [
                                                    [
                                                        1176326814415724544
                                                    ],
                                                    [
                                                        1176326884557070336
                                                    ],
                                                    [
                                                        1176326814415724544,
                                                        1176327510267535360
                                                    ],
                                                    [
                                                        1176326884557070336,
                                                        1176331222201409536
                                                    ],
                                                    [
                                                        1176326884557070336,
                                                        1176331222201409536,
                                                        1176331414615105536
                                                    ]
                                                ]
                                            },
                                            "score": 6
                                        },
                                        {
                                            "id": "bf446a82-96d6-45fc-ad44-2733d1db8128",
                                            "type": "Question",
                                            "difficulty": 0.6161502003669739,
                                            "knowledge_points": {
                                                "id": "bf446a82-96d6-45fc-ad44-2733d1db8128",
                                                "一级知识点": [
                                                    "三角函数"
                                                ],
                                                "二级知识点": [
                                                    "基本初等函数II"
                                                ],
                                                "三级知识点": [],
                                                "四级知识点": [],
                                                "first_label": [
                                                    "1176326884557070336"
                                                ],
                                                "second_label": [
                                                    "1176331222201409536"
                                                ],
                                                "third_label": [],
                                                "fourth_label": [],
                                                "topk": [
                                                    [
                                                        "代数"
                                                    ],
                                                    [
                                                        "三角函数"
                                                    ],
                                                    [
                                                        "代数",
                                                        "函数概念与基本初等函数I"
                                                    ],
                                                    [
                                                        "三角函数",
                                                        "基本初等函数II"
                                                    ],
                                                    [
                                                        "三角函数",
                                                        "基本初等函数II",
                                                        "三角函数的图象与性质"
                                                    ]
                                                ],
                                                "topk_label": [
                                                    [
                                                        1176326814415724544
                                                    ],
                                                    [
                                                        1176326884557070336
                                                    ],
                                                    [
                                                        1176326814415724544,
                                                        1176327246953324544
                                                    ],
                                                    [
                                                        1176326884557070336,
                                                        1176331222201409536
                                                    ],
                                                    [
                                                        1176326884557070336,
                                                        1176331222201409536,
                                                        1176331414615105536
                                                    ]
                                                ]
                                            },
                                            "score": 6
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "ac789714-5394-45f8-9641-966a74a31c67",
                    "type": "PackedQues",
                    "score": 12,
                    "difficulty_statistics": {
                        "mean": 0.37724650899569195,
                        "min": 0.36151546239852905,
                        "max": 0.3971267342567444,
                        "std": 0.014831327958718265
                    },
                    "knowledge_knowledge2num": {},
                    "knowledge2difficulty": {
                        "统计与概率": 0.3971267342567444,
                        "三角函数": 0.37309733033180237
                    },
                    "knowledge2score": {
                        "统计与概率": 4,
                        "三角函数": 4
                    },
                    "sub_question": [
                        {
                            "id": "e45b0d29-1444-445f-b71f-f733100f7e91",
                            "type": "PackedQues",
                            "score": 8,
                            "difficulty_statistics": {
                                "mean": 0.3793210983276367,
                                "min": 0.36151546239852905,
                                "max": 0.3971267342567444,
                                "std": 0.017805635929107666
                            },
                            "knowledge_knowledge2num": {},
                            "knowledge2difficulty": {
                                "统计与概率": 0.3971267342567444
                            },
                            "knowledge2score": {
                                "统计与概率": 4
                            },
                            "sub_question": [
                                {
                                    "id": "ded078a1-20bd-4354-b847-e7b71a02dd40",
                                    "type": "Question",
                                    "difficulty": 0.36151546239852905,
                                    "knowledge_points": {
                                        "id": "ded078a1-20bd-4354-b847-e7b71a02dd40",
                                        "一级知识点": [],
                                        "二级知识点": [
                                            "概率"
                                        ],
                                        "三级知识点": [],
                                        "四级知识点": [],
                                        "first_label": [],
                                        "second_label": [
                                            "1176328941892542464"
                                        ],
                                        "third_label": [],
                                        "fourth_label": [],
                                        "topk": [
                                            [
                                                "代数"
                                            ],
                                            [
                                                "三角函数"
                                            ],
                                            [
                                                "统计与概率"
                                            ],
                                            [
                                                "统计与概率",
                                                "概率"
                                            ],
                                            [
                                                "统计与概率",
                                                "概率",
                                                "概率初步"
                                            ]
                                        ],
                                        "topk_label": [
                                            [
                                                1176326814415724544
                                            ],
                                            [
                                                1176326884557070336
                                            ],
                                            [
                                                1176326977637064704
                                            ],
                                            [
                                                1176326977637064704,
                                                1176328941892542464
                                            ],
                                            [
                                                1176326977637064704,
                                                1176328941892542464,
                                                1176332504010072064
                                            ]
                                        ]
                                    },
                                    "score": 4
                                },
                                {
                                    "id": "f5c073b3-e0c7-45e4-b8b4-53c97792a3fa",
                                    "type": "Question",
                                    "difficulty": 0.3971267342567444,
                                    "knowledge_points": {
                                        "id": "f5c073b3-e0c7-45e4-b8b4-53c97792a3fa",
                                        "一级知识点": [
                                            "统计与概率"
                                        ],
                                        "二级知识点": [
                                            "概率"
                                        ],
                                        "三级知识点": [
                                            "随机变量及其分布"
                                        ],
                                        "四级知识点": [
                                            "离散型随机变量及其分布列",
                                            "离散型随机变量的均值、方差"
                                        ],
                                        "first_label": [
                                            "1176326977637064704"
                                        ],
                                        "second_label": [
                                            "1176328941892542464"
                                        ],
                                        "third_label": [
                                            "1176332538164289536"
                                        ],
                                        "fourth_label": [
                                            "1186906659990282284",
                                            "1186906659990282289"
                                        ],
                                        "topk": [
                                            [
                                                "统计与概率"
                                            ],
                                            [
                                                "统计与概率",
                                                "概率"
                                            ],
                                            [
                                                "统计与概率",
                                                "概率",
                                                "随机变量及其分布",
                                                "离散型随机变量及其分布列"
                                            ],
                                            [
                                                "统计与概率",
                                                "概率",
                                                "随机变量及其分布",
                                                "离散型随机变量的均值、方差"
                                            ]
                                        ],
                                        "topk_label": [
                                            [
                                                1176326977637064704
                                            ],
                                            [
                                                1176326977637064704,
                                                1176328941892542464
                                            ],
                                            [
                                                1176326977637064704,
                                                1176328941892542464,
                                                1176332538164289536,
                                                1186906659990282284
                                            ],
                                            [
                                                1176326977637064704,
                                                1176328941892542464,
                                                1176332538164289536,
                                                1186906659990282289
                                            ]
                                        ]
                                    },
                                    "score": 4
                                }
                            ]
                        },
                        {
                            "id": "b51bc253-90eb-4968-ba5f-79be3cc808b8",
                            "type": "PackedQues",
                            "score": 4,
                            "difficulty_statistics": {
                                "mean": 0.37309733033180237,
                                "min": 0.37309733033180237,
                                "max": 0.37309733033180237,
                                "std": 0.0
                            },
                            "knowledge_knowledge2num": {},
                            "knowledge2difficulty": {
                                "三角函数": 0.37309733033180237
                            },
                            "knowledge2score": {
                                "三角函数": 4
                            },
                            "sub_question": [
                                {
                                    "id": "7db9674f-17be-4b48-bff8-0989d31cb93c",
                                    "type": "Question",
                                    "difficulty": 0.37309733033180237,
                                    "knowledge_points": {
                                        "id": "7db9674f-17be-4b48-bff8-0989d31cb93c",
                                        "一级知识点": [
                                            "三角函数"
                                        ],
                                        "二级知识点": [
                                            "基本初等函数II"
                                        ],
                                        "三级知识点": [
                                            "三角函数的图象与性质"
                                        ],
                                        "四级知识点": [],
                                        "first_label": [
                                            "1176326884557070336"
                                        ],
                                        "second_label": [
                                            "1176331222201409536"
                                        ],
                                        "third_label": [
                                            "1176331414615105536"
                                        ],
                                        "fourth_label": [],
                                        "topk": [
                                            [
                                                "三角函数"
                                            ],
                                            [
                                                "三角函数",
                                                "基本初等函数II"
                                            ],
                                            [
                                                "三角函数",
                                                "基本初等函数II",
                                                "任意角的三角函数"
                                            ],
                                            [
                                                "三角函数",
                                                "基本初等函数II",
                                                "三角函数的图象与性质"
                                            ],
                                            [
                                                "三角函数",
                                                "基本初等函数II",
                                                "任意角的三角函数",
                                                "任意角的三角函数（正弦、余弦、正切）的定义"
                                            ]
                                        ],
                                        "topk_label": [
                                            [
                                                1176326884557070336
                                            ],
                                            [
                                                1176326884557070336,
                                                1176331222201409536
                                            ],
                                            [
                                                1176326884557070336,
                                                1176331222201409536,
                                                1176328191527362560
                                            ],
                                            [
                                                1176326884557070336,
                                                1176331222201409536,
                                                1176331414615105536
                                            ],
                                            [
                                                1176326884557070336,
                                                1176331222201409536,
                                                1176328191527362560,
                                                1186906659990282328
                                            ]
                                        ]
                                    },
                                    "score": 4
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "da5146bf-6f05-47d5-bd2b-d77b77a6e576",
                    "type": "PackedQues",
                    "score": 2,
                    "difficulty_statistics": {
                        "mean": 0.4369961768388748,
                        "min": 0.4020228981971741,
                        "max": 0.47196945548057556,
                        "std": 0.034973278641700745
                    },
                    "knowledge_knowledge2num": {},
                    "knowledge2difficulty": {
                        "代数": 0.4369961768388748
                    },
                    "knowledge2score": {
                        "代数": 2
                    },
                    "sub_question": [
                        {
                            "id": "0b1b75ac-3053-45b5-9244-65b0dbb9d9f1",
                            "type": "Question",
                            "difficulty": 0.4020228981971741,
                            "knowledge_points": {
                                "id": "0b1b75ac-3053-45b5-9244-65b0dbb9d9f1",
                                "一级知识点": [
                                    "代数"
                                ],
                                "二级知识点": [
                                    "计数原理"
                                ],
                                "三级知识点": [
                                    "排列、组合与二项式定理"
                                ],
                                "四级知识点": [],
                                "first_label": [
                                    "1176326814415724544"
                                ],
                                "second_label": [
                                    "1176327587170099200"
                                ],
                                "third_label": [
                                    "1176330753466966016"
                                ],
                                "fourth_label": [],
                                "topk": [
                                    [
                                        "代数"
                                    ],
                                    [
                                        "代数",
                                        "不等式"
                                    ],
                                    [
                                        "代数",
                                        "计数原理"
                                    ],
                                    [
                                        "代数",
                                        "计数原理",
                                        "排列、组合与二项式定理"
                                    ],
                                    [
                                        "代数",
                                        "计数原理",
                                        "排列、组合与二项式定理",
                                        "排列与组合的简单应用"
                                    ]
                                ],
                                "topk_label": [
                                    [
                                        1176326814415724544
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327353807413248
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327587170099200
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327587170099200,
                                        1176330753466966016
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327587170099200,
                                        1176330753466966016,
                                        1186906659990282414
                                    ]
                                ]
                            },
                            "score": 1
                        },
                        {
                            "id": "4bc1ada9-0364-45be-8f80-4960c9327c20",
                            "type": "Question",
                            "difficulty": 0.47196945548057556,
                            "knowledge_points": {
                                "id": "4bc1ada9-0364-45be-8f80-4960c9327c20",
                                "一级知识点": [
                                    "代数"
                                ],
                                "二级知识点": [
                                    "集合"
                                ],
                                "三级知识点": [
                                    "集合间的关系与运算"
                                ],
                                "四级知识点": [],
                                "first_label": [
                                    "1176326814415724544"
                                ],
                                "second_label": [
                                    "1176327112077090816"
                                ],
                                "third_label": [
                                    "1176329262698078208"
                                ],
                                "fourth_label": [],
                                "topk": [
                                    [
                                        "代数"
                                    ],
                                    [
                                        "代数",
                                        "集合"
                                    ],
                                    [
                                        "代数",
                                        "集合",
                                        "集合间的关系与运算"
                                    ],
                                    [
                                        "代数",
                                        "集合",
                                        "集合间的关系与运算",
                                        "集合之间的基本关系"
                                    ],
                                    [
                                        "代数",
                                        "集合",
                                        "集合间的关系与运算",
                                        "集合的基本运算"
                                    ]
                                ],
                                "topk_label": [
                                    [
                                        1176326814415724544
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327112077090816
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327112077090816,
                                        1176329262698078208
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327112077090816,
                                        1176329262698078208,
                                        1186906659990282342
                                    ],
                                    [
                                        1176326814415724544,
                                        1176327112077090816,
                                        1176329262698078208,
                                        1186906659990282343
                                    ]
                                ]
                            },
                            "score": 1
                        }
                    ]
                }
            ]
            }
            // for(var i in this.Paper_Json){
            //   console.log(i);
            // }
            setTimeout(()=>{
                this.Init_Paper_Total_Bar();
                this.Init_Paper_Total_Difficult_Analyse();
                this.Get_Max_Difficult_Gap();
            }, 100)
        }
    }
}
</script>
<style lang="scss" scoped>
.el-divider--horizontal{
    display:block;
    height:4px;
    width:100%;
    margin:24px 0
}
// 调整区块显示条
.Part_Row_Style_Collapse{
    border-left: 15px solid #409EFD; 
    background: 	Gainsboro; 
    width: 70%; 
    margin: 5px 15% 20px 15%;
    padding-left: 30px;
    font-size: 16px;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
.Part_Row_Style_Expand{
    border-left: 15px solid #409EFD; 
    background: 	whitesmoke; 
    width: 70%; 
    margin: 5px 15% 20px 15%;
    padding-left: 30px;
    font-size: 16px;
    font-weight: bold;
    padding-top: 5px;
    padding-bottom: 5px;
    cursor: pointer;
}
// 调整试卷总体条形图外框
.Paper_Total_Bar{
    border-radius: 10px; 
    width: 67vw; 
    height:300px; 
    padding-top: 20px; 
    margin-left: 16.5%; 
    border: 3px solid #EEF5FE; 
    margin-bottom: 40px;
}
.Paper_Total_Difficult_Analyse{
    margin-top: 30px;
    border-radius: 10px; 
    width: 67vw; 
    height:350px; 
    padding-top: 10px; 
    margin-left: 16.5%; 
    border: 3px solid #EEF5FE; 
    background: #EEF5FE;
    margin-bottom: 40px;
}
// 隐藏用
.Hidden{
    display: none;
}
// 知识点，难度分析的组合
.Paper_Total_Analyse_Focus{
    margin-top: -1px;
    height: 30px;
    padding-top: 5px;
    background: #409EFD;
    color: white;
}
.Paper_Total_Analyse_Unfocus{
    margin-top: -1px;
    height: 30px;
    padding-top: 5px;
}
</style>