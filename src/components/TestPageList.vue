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
                    x: "left",
                    y: "top",
                    textStyle: { 
                        fontSize: 14,
                        fontStyle: 'normal',
                        fontWeight: 'bold',
                    },
                    padding: [5,5,40,85]
                },
                color: ['#636B92','#6BE7C2','#3DB3E1'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow',
                        label : {
                            show: true
                        }
                }
                },
                calculable: true,
                legend: {
                    data: ['试卷', '试题', '知识单元'],
                    itemGap: 20,
                    x: "right",
                    y: "top",
                    padding: [5,105,40,5]
                },
                xAxis : [
                {
                    type : 'category',
                    data : ['语文','数学','英语','政治','历史','地理','物理','化学','生物'],
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
                    name : '数量',
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
                        padding:[30, 35, 5, 10]
                    }
                }
                ],
                series : [
                {
                    name:'试卷',
                    type:'bar',
                    barWidth: '20%',
                    data:[5,6,4,8,6,2,6,5,8],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#636B92'
                            }
                        }
                    },
                },
                {
                    name:'试题',
                    type:'bar',
                    barWidth: '20%',
                    data:[1,2,3,4,5,6,7,8,9],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6BE7C2'
                            }
                        }
                    },
                },
                {
                    name:'知识单元',
                    type:'bar',
                    barWidth: '20%',
                    data:[5,5,5,5,5,5,5,5,5],
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#3DB3E1'
                            }
                        }
                    },
                },
                ]
            };
            myChart.setOption(option);
        
            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
        }
    }
}
</script>