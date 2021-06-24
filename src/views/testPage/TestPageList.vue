<template>
  <div style="margin: 30px">
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_0" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_1" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_2" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_3" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_4" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_5" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_6" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_7" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_8" class="Line_Chart_1" ></div>
    </el-row>
    <el-row style="margin: 50px 0px">
      <div id="Line_Chart_9" class="Line_Chart_1" ></div>
    </el-row>
  </div>

</template>
<script>

import * as echarts from 'echarts';

export default {

    components: {},
    name: "TestPageList",
    data(){
        return {
          SubjectType: "",
          PeriodType: "",
          Questions: [],
          Title: ""
        };
    },
    mounted() {
      this.Init_Line_Chart();
      this.Init_Math_Chart();
    },
    methods: {
      Init_Line_Chart(){
          this.Init_LC_0();
        this.Init_Line_Chart_Liberal_Char();
        this.Init_Line_Chart_Liberal_Img();
        this.Init_Line_Chart_Liberal_Answer();
        this.Init_Line_Chart_Liberal_Poem();
        this.Init_Line_Chart_Liberal_Diff_Char();
      },
      Init_LC_0(){

        // 尝试做一张旭日图

        let Line_Chart_1 = echarts.init(document.getElementById("Line_Chart_0"));
        let Level_Data = []

        let Check_List = [1,2,3,4,5,6,7,8];
        let Have_List = [1,2,3,5,7];

        for(let i = 0; i < Check_List.length; i++){
            if(Have_List.indexOf(Check_List[i]) != -1){
                Level_Data.push({
                    name: i + "",
                    value: 1,
                    itemStyle: {
                        color: "#409EFD",
                    },
                    label: {
                        color: "white"
                    },
                    children: []
                })
            }else{
                Level_Data.push({
                    name: i + "",
                    value: 1,
                    itemStyle: {
                        color: "grey",
                    },
                    label: {
                        color: "white"
                    },
                    children: []
                })
            }
        }

        console.log(Level_Data)

        let Liberal_Option_1 = {
          
            title: {
                text: "尝试做的旭日图",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            series: {
                type: 'sunburst',

                data: Level_Data,
                radius: [0, '95%'],
                sort: null,

                emphasis: {
                    focus: 'ancestor'
                },

                levels: [{}, {
                    r0: '15%',
                    r: '70%',
                    itemStyle: {
                        borderWidth: 2
                    },
                    label: {
                        rotate: 'tangential'
                    }
                }]
            }
        }

        Line_Chart_1.setOption(Liberal_Option_1);
        window.addEventListener('resize',function() {Line_Chart_1.resize()});
      },
      Init_Line_Chart_Liberal_Char(){
        // 语文总字数波动

        let Line_Chart_1 = echarts.init(document.getElementById("Line_Chart_1"));
        let Liberal_Option_1 = {
          
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            title: {
                text: "英语试卷文字数量波动趋势",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            color: ["#409EFD"],
            xAxis: {
                type: 'category',
                data: ['2016', '2017', '2018', '2019', '2020', '2021']
            },
            yAxis: {
                type: 'value',
                min: 3600,
                max: 4400
            },
            series: [{
                data: [4000, 4200, 3900, 3800, 4200, 3800],
                type: 'line'
            }]
        }

        Line_Chart_1.setOption(Liberal_Option_1);
        window.addEventListener('resize',function() {Line_Chart_1.resize()});
      },
      Init_Line_Chart_Liberal_Img(){
        // 语文总图片数量波动

        let Line_Chart_2 = echarts.init(document.getElementById("Line_Chart_2"));
        let Liberal_Option_2 = {
          
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            title: {
                text: "英语试卷图片图表数量波动趋势",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            color: ["#00B0F0", "#FFC000"],
            legend: {
                data: ['图片', "图表"],
                itemGap: 20,
                x: "right",
                y: "top",
                padding: [5,30,40,5],
                textStyle: { 
                    fontSize: 14,
                    fontStyle: 'normal',
                },
            },
            xAxis: {
                type: 'category',
                data: ['2016', '2017', '2018', '2019', '2020', '2021']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [1, 2, 2, 1, 1, 2],
                type: 'line',
                name: "图表"
            },
            {
                data: [2, 4, 3, 4, 2, 3],
                type: 'line',
                name: "图片"
            }]
        }

        Line_Chart_2.setOption(Liberal_Option_2);
        window.addEventListener('resize',function() {Line_Chart_2.resize()});
      },
      Init_Line_Chart_Liberal_Answer(){
        // 语文总字数波动

        let Line_Chart_3 = echarts.init(document.getElementById("Line_Chart_3"));
        let Liberal_Option_3 = {
          
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            title: {
                text: "英语试卷书写量波动趋势",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            color: ["#409EFD"],
            xAxis: {
                type: 'category',
                data: ['2016', '2017', '2018', '2019', '2020', '2021'],
                
            },
            yAxis: {
                type: 'value',
                min: 240,
                max: 360
            },
            series: [{
                data: [300, 330, 320, 280, 290, 300],
                type: 'line'
            }]
        }

        Line_Chart_3.setOption(Liberal_Option_3);
        window.addEventListener('resize',function() {Line_Chart_3.resize()});
      },
      Init_Line_Chart_Liberal_Diff_Char(){
        // 语文总字数波动

        let Line_Chart_3 = echarts.init(document.getElementById("Line_Chart_4"));
        let Liberal_Option_3 = {
            title: {
                text: "词频统计/⽣僻字词",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            color: ["#409EFD"],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: ['词6', '词5', '词5', '词3', '词2', '词1']
            },
            series: [
                {
                    type: 'bar',
                    data: [8203, 13489, 9034, 10497, 13100, 12345],
                    barWidth: "35%"
                }
            ]
        }

        Line_Chart_3.setOption(Liberal_Option_3);
        window.addEventListener('resize',function() {Line_Chart_3.resize()});
      },
      Init_Line_Chart_Liberal_Poem(){

        let Line_Chart_3 = echarts.init(document.getElementById("Line_Chart_5"));
        let Liberal_Option_3 = {
            title: {
                text: "诗词朝代出现次数",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                orient: 'vertical',
                bottom: 'bottom',
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '65%',
                label: {
                    formatter: '{b}: {@2012} ({d}%)'
                },
                data: [{value: 7, name: '唐'},
                {value: 5, name: '宋'},
                {value: 2, name: '元'},
                {value: 3, name: '明'},
                {value: 3, name: '清'}]
              }
            ]
        }

        Line_Chart_3.setOption(Liberal_Option_3);
        window.addEventListener('resize',function() {Line_Chart_3.resize()});
      },
      Init_Math_Chart(){
        this.Init_Math_KU_Point();
        this.Init_Math_Question_Difficult();
        this.Init_Math_Cover_Chart();
        this.Init_QB_Knowledge_Pair();
      },
      Init_Math_KU_Point(){
        let Line_Chart_3 = echarts.init(document.getElementById("Line_Chart_6"));
        let Liberal_Option_3 = {

            backgroundColor: 'white', // rgb(43, 51, 59)
            toolbox: {
                show: true,
                feature: {
                    mark: {
                        show: true
                    },
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore: {
                        show: true
                    },
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            calculable: true,
            "tooltip": {
                "trigger": "item",
                "formatter": "{a}<br/>{b}:{c}分"
            },
            "title": {
                "text": "2021年数学考点-平均分值图",
                "left": "center",
                "textStyle": {
                    "color": "black" // #ccc
                },
                "y": "6%",
                "padding": [5,5,40,50]
            },
            "legend": {
                "icon": "circle",
                "x": "center",
                "y": "12%",
                "data": [
                ],
                "textStyle": {
                    "color": "black" // #fff
                }
            },
            "series": [{
                "name": "分值",
                "type": "pie",
                "radius": [
                    10,
                    130
                ],
                "avoidLabelOverlap": true,
                "startAngle": 90,
                "center": [
                    "50%",
                    "53%"
                ],
                "roseType": "area",
                "selectedMode": "single",
                "label": {
                    "normal": {
                        "show": true,
                        "formatter": function(params){
                            let Score = (parseFloat(params.value) - 10) + "";
                            if(Score.indexOf(".") == 2){
                                let Decimal = parseInt(Score[4]);
                                Score = Score.substring(0, 4);
                                if(Decimal >= 5){
                                    Score = parseFloat(Score) + 0.1 + ""
                                    Score = Score.substring(0, 4);
                                }
                            }else if(Score.indexOf(".") == 1){
                                let Decimal = parseInt(Score[3]);
                                Score = Score.substring(0, 3);
                                if(Decimal >= 5){
                                    if(parseInt(Score[2]) < 9){
                                        Score = Score.substring(0, 2) + (parseInt(Score[2]) + 1) + "";
                                    }else{
                                        Score = (parseInt(Score[0]) + 1) + ".0"
                                    }
                                }
                            }
                            return params.name + ": " + Score + "分"
                        }
                    },
                    "emphasis": {
                        "show": true
                    }
                },
                "labelLine": {
                    "normal": {
                        "show": true,
                        "smooth": false,
                        "length": 10,
                        "length2": 10
                    },
                    "emphasis": {
                        "show": true
                    }
                },
                "data":
                []
                }
                ]
                
        }

        let Label_Color = [
            '#ff4343', '#f69846', '#f6d54a', '#45dbf7', '#44aff0', '#4777f5', '#5045f6', '#ad46f3'
        ]

        let Data_New = [['函数概念与基本初等函数I', 143],
                    ['立体几何初步', 142],
                    ['基本初等函数II', 128],
                    ['圆锥曲线与方程', 117],
                    ['数列', 84],
                    ['统计', 73],
                    ['概率', 73],
                    ['导数及其应用', 69],
                    ['不等式选讲（选考内容）', 67],
                    ['坐标系与参数方程（选考内容）', 60],
                    ['平面向量', 31],
                    ['不等式', 31],
                    ['集合', 30],
                    ['数系的扩充与复数的引入', 30],
                    ['平面解析几何初步', 30],
                    ['计数原理', 25],
                    ['算法初步', 10],
                    ['空间向量与立体几何', 10],
                    ['常用逻辑用语', 10],
                    ['框图', 5]]

        for(let i = 0; i < Data_New.length; i++){
            let Score = Data_New[i][1]/6 + "";
            console.log(Score)
            if(Score.indexOf(".") == 2){
                let Decimal = parseInt(Score[4]);
                Score = Score.substring(0, 4);
                if(Decimal >= 5){
                    Score = parseFloat(Score) + 0.1 + ""
                    Score = Score.substring(0, 4);
                }
            }else if(Score.indexOf(".") == 1){
                let Decimal = parseInt(Score[3]);
                Score = Score.substring(0, 3);
                if(Decimal >= 5){
                    if(parseInt(Score[2]) < 9){
                        Score = Score.substring(0, 2) + (parseInt(Score[2]) + 1) + "";
                    }else{
                        Score = (parseInt(Score[0]) + 1) + ".0"
                    }
                }
            }
            Score = 10 + parseFloat(Score) + ""
            
            let Item = {'value': Score, 'name': Data_New[i][0], 'itemStyle': {'normal': {'color': Label_Color[i%Label_Color.length]}}}
            Liberal_Option_3.series[0].data.push(Item);
        }

        Line_Chart_3.setOption(Liberal_Option_3);
        window.addEventListener('resize',function() {Line_Chart_3.resize()});
      },
      Init_Math_Question_Difficult(){
        // 数学题目难度波动

        let Line_Chart_1 = echarts.init(document.getElementById("Line_Chart_7"));
        let Liberal_Option_1 = {
          
            toolbox: {
                show: true,
                feature: {
                    saveAsImage: {
                        show: true,
                        excludeComponents: ['toolbox'],
                        pixelRatio: 3
                    }
                }
            },
            title: {
                text: "数学题目难度波动折线图",
                x: "center",
                y: "top",
                textStyle: { 
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                },
                padding: [5,5,40,25]
            },
            color: ["#409EFD"],
            xAxis: {
                type: 'category',
                data: []
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [],
                type: 'line'
            }]
        }

        for(let i = 0; i < 18; i++){
          Liberal_Option_1.xAxis.data.push("" + (i+1))
          Liberal_Option_1.series[0].data.push(i%6==5 ? 0.03 * (i + 1) + 0.2:0.03 * (i + 1))
        }

        Line_Chart_1.setOption(Liberal_Option_1);
        window.addEventListener('resize',function() {Line_Chart_1.resize()});
      },
      Init_Math_Cover_Chart(){
        let Line_Chart_1 = echarts.init(document.getElementById("Line_Chart_8"));


        let Liberal_Option_1 = {
            title: [
                {
                    text: '盒装图实例',
                    left: 'center'
                }
            ],
            dataset: [{
                source: [
                    [850, 740, 900, 1070, 930, 850, 950, 980, 980, 880, 1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960],
                    [960, 940, 960, 940, 880, 800, 850, 880, 900, 840, 830, 790, 810, 880, 880, 830, 800, 790, 760, 800],
                    [880, 880, 880, 860, 720, 720, 620, 860, 970, 950, 880, 910, 850, 870, 840, 840, 850, 840, 840, 840],
                    [890, 810, 810, 820, 800, 770, 760, 740, 750, 760, 910, 920, 890, 860, 880, 720, 840, 850, 850, 780],
                    [890, 840, 780, 810, 760, 810, 790, 810, 820, 850, 870, 870, 810, 740, 810, 940, 950, 800, 810, 870]
                ]
            }, {
                transform: {
                    type: 'boxplot',
                    config: { itemNameFormatter: 'expr {value}' }
                }
            }],
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                splitArea: {
                    show: true
                },
                min: 600,
                max: 1200
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    datasetIndex: 1
                }
            ]
        };

        Line_Chart_1.setOption(Liberal_Option_1);
        window.addEventListener('resize',function() {Line_Chart_1.resize()});
      },
      // 初始化大题的知识点点对分布的那张关系图的办法
        Init_QB_Knowledge_Pair(){

            let myChart = echarts.init(document.getElementById('Line_Chart_9'));

            let option = {
                grid: {
                    x: 600,
                    y: 600,
                    x2: 600,
                    y2: 400
                },
                title: {
                    text: "知识点对共现关系图",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,25]
                },
                tooltip : {},
                label: {
                    normal: {
                        show: true
                    }
                },
                legend: {
                    data: ['知识点'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,30,70,5],
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                    },
                },
                series : [
                {
                    name:'知识点对共现关系图',
                    type: 'graph',
                    layout: 'circular',
                    symbolSize: 20,
                    focusNodeAdjacency: true,
                    categories: [
                        {
                            name: "知识点",
                            itemStyle: {
                                color: "#409EFD"
                            }
                        }
                    ],
                    zoom: 0.8,
                    circular: {
                        rotateLabel: false
                    },
                    label: {
                        show: true,
                            textStyle: {
                                fontSize: 14
                            },
                            position: 'right',
                            formatter: '{b}'
                    },
                    data: [],
                    links: [],
                    lineStyle: {
                        opacity: 0.7,
                        width: 2,
                        curveness: 0.7
                    }
                }
            ]
            };

            var Temp_Ku_Name_List = []

            for(var j in ["1", "2", "3", "4", "5", "6", "7", "8"]){
                option.series[0].data.push({
                    name: j,
                    category: 0
                })
                Temp_Ku_Name_List.push(j)
            }

            let Fake_Pair = ["1::4", "2::3", "4::7", "1::7", "8::2"]

            for(var i = 0; i < Fake_Pair.length; i++){
                var Pair = Fake_Pair[i]
                var From = Pair.split("::")[0]
                var To = Pair.split("::")[1]
                option.series[0].links.push({
                    source: Temp_Ku_Name_List.indexOf(From),
                    target: Temp_Ku_Name_List.indexOf(To),
                    value: i,
                    lineStyle: {
                        color: this.Paper_Total_Ku_Pair_LineStyle(i)
                    }
                })
            }

            myChart.setOption(option);

            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});

        },
        // 返回不同颜色
        Paper_Total_Ku_Pair_LineStyle(index){
            if(index < 3){
                return 'red'
            }else{
                return '#CCC'
            }
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Line_Chart_1{
    width:680px;
    height:400px;
}
.Line_Chart_2{
    width:1000px;
    height:1000px;
}
</style>