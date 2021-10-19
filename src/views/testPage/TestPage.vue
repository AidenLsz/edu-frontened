<template>
  <div style="margin-top: 2vh">
    <el-row>
        <div v-for="i in 4" :id="'container' + i" :key="'Word_Cloud_' + i" style="height: 405px; width: 405px; border: 1px solid black; display: inline-block"></div>
    </el-row>
    <el-row>
      <div id="Multi-Y" style="height: 600px">

      </div>
    </el-row>
  </div>
</template>
<script>

// 关于如何创建词云图

// 第一步 cnpm install js2wordcloud --save 安装js2wordcloud包
// 第二步 按照下面的方式引入这个包
// 第三步 按照Init_Word_Cloud方法来在你需要的时候需要的位置生成词云
// 其原理和echarts区别不大，你自己调整一下数据即可
// 注：其宽度和高度最小值是400px（div不带border的情况下），小于这个值会导致词云图可能显示不完全

import Js2WordCloud from 'js2wordcloud'

// 关于如何创建三Y轴图

import * as echarts from 'echarts';

export default {
  name: 'ScreenShot',
  props: {
  },
  components:{
    // Mathdown
  },
  data() {
    return {

    }
  },
  watch: {

  },
  mounted() {
    this.Init_Word_Cloud();
    this.Init_MultiY_Charts();
  },
  methods: {
    Init_Word_Cloud(){
      for(let i = 1; i < 5; i++){
        // 获取div对象，和echarts是一个道理，获取完数据后重新捕捉这些对象即可
        // 建议创建若干个预置对象，和echarts一样，然后用户点击左右切换的时候根据数据清空已有数据然后导入新的数据进行渲染
        // 具体方式可以参照statistics.vue那个BarChart变量，意思是一样的
        var wc = new Js2WordCloud(document.getElementById('container' + i))
        wc.setOption({
            tooltip: {
                show: true
            },
            // 把数据放在这儿就行了
            list: [['谈笑风生', 80], ['谈笑风生', 80], ['谈笑风生', 70], ['谈笑风生', 70], ['谈笑风生', 60], ['谈笑风生', 60]],
            // 这是字体颜色，你可以自己生成
            color: '#15a4fa'
        })
      }
    },
    Init_MultiY_Charts(){
      var Chart = echarts.init(document.getElementById('Multi-Y'));
      const colors = ['#5470C6', '#91CC75', '#EE6666'];
      let options = {
        // 调整多Y轴的颜色，具体什么颜色你自己按照需求来
        color: colors,
        // 这个是示例的触发位置，这个是移动到轴上的时候
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // 这个是Y轴的位置
        grid: {
          right: '10%'
        },
        // 有几根Y轴写几个变量，这代表了想表示的变量
        legend: {
          data: ['Evaporation', 'Precipitation', 'Temperature']
        },
        // 这里是X轴的数据，比如卷1，卷2之类的，你自己组织怎么写
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        // 有几根Y轴就有几个字典，name要和legend的data项向对应，min和max你自己定
        // position指坐标轴位置
        // axisLine是轴线，show是显示，lineStyle是线的样式，color控制颜色，自己按需求调整
        // formatter是内容的显示标签，不带axisLabel这一项的话就是单纯显示数据，具体怎么弄你要自己查echarts，不同的图的格式不一样
        // offset是偏移量，主要是为了Y轴不要重叠到一起
        yAxis: [
          {
            type: 'value',
            name: 'Evaporation',
            min: 0,
            max: 250,
            position: 'right',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: 'Precipitation',
            min: 0,
            max: 250,
            position: 'right',
            offset: 80,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            min: 0,
            max: 25,
            position: 'left',
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[2]
              }
            },
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        // 数据项，name需要和legend的数据一一对应
        // type是指这个图的类型，bar是柱状，line是折线图
        // yAxisIndex是指这个东西的优先级，你按照先后顺序写一下，别互相覆盖了就可以
        // data是指数据，把对应这个变量的数据写进去就可以了
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Precipitation',
            type: 'bar',
            yAxisIndex: 1,
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ]
          },
          {
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      };
      Chart.setOption(options)
      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize', function() {Chart.resize()});
    }
  },
}
</script>
<style >

</style>