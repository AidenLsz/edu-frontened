<template>
    <div>
        <div id="chart_example" style="width: 70%; height:300px; margin-top: 60px"></div>
    </div>
</template>
<script src="echarts.min.js">

</script>
<script>

// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')

export default {

    components: {},
    name: "TestPageList",
    data(){
        return {

        }
    },
    mounted(){
        this.Init_Bar()
    },
    methods: {
        Init_Bar(){
            let this_ = this;
            let myChart = echarts.init(document.getElementById('chart_example'));
            let option = {
                title: {
                    text: "各学科数据统计",
                    x: "center",
                    y: "top",
                    textStyle: { 
                        fontSize: 16,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,85]
                },
                color: ['#626C91','#6BE6C1','#3FB1E3'],
                tooltip : {
                    // trigger: 'axis',
                    // axisPointer : {
                    //     type : 'shadow',
                    //     label : {
                    //         show: true
                    //     }
                    // }
                },
                // calculable: true,
                legend: {
                    data: ['试卷', '试题', '知识单元'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,105,40,5]
                },
                xAxis : {
                    type : 'category',
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
                    }
                },
                yAxis : {
                    type : 'value',
                    name : '数量',
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
                },
                dataset :{
                    dimensions: ['product', "试卷", "试题", "知识单元"],
                    source: [{
                        product: "语文", "试卷": 5, "试题": 1, "知识单元": 5
                    },{
                        product: "数学", "试卷": 6, "试题": 2, "知识单元": 5
                    },{
                        product: "英语", "试卷": 4, "试题": 3, "知识单元": 5
                    },{
                        product: "政治", "试卷": 8, "试题": 4, "知识单元": 5
                    },{
                        product: "历史", "试卷": 6, "试题": 5, "知识单元": 5
                    },{
                        product: "地理", "试卷": 2, "试题": 6, "知识单元": 5
                    },{
                        product: "物理", "试卷": 6, "试题": 7, "知识单元": 5
                    },{
                        product: "化学", "试卷": 5, "试题": 8, "知识单元": 5
                    },{
                        product: "生物", "试卷": 8, "试题": 9, "知识单元": 5
                    },]
                },
                series : [
                {
                    type:'bar'
                },
                {
                    type:'bar'
                },{
                    type:'bar'
                }
                ]
            };
            myChart.setOption(option);
            myChart.on('click', function (param) { 
                alert(param.name + "_" + param.seriesName)//获取自定义变量barIds的值,barIds要和option的series里自定义的一样
            })
        
            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
        }
    }
}
</script>