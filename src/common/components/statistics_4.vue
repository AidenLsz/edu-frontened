<script src="../../router/index.js"></script>
<template lang="html">
  <div class="Main_Statistics">
    <el-row type="flex" justify="start" style="margin-bottom: 20px">
      <div @click="changeCountButton('Question')" ref="countButtonQuestion" :class="Get_Count_Style('Question') + ' Button_Basic'">
        试题资源
      </div>
      <div round @click="changeCountButton('Paper')" ref="countButtonPaper" :class="Get_Count_Style('Paper') + ' Button_Basic'">
        试卷资源
      </div>
      <div v-if="$store.getters.isLuna" round @click="changeCountButton('KU')" ref="countButtonKU" :class="Get_Count_Style('KU') + ' Button_Basic'">
        知识单元
      </div>
      <div round @click="changeCountButton('Resources')" ref="countButtonResources" :class="Get_Count_Style('Resources') + ' Button_Basic'">
        教辅教材
      </div>
    </el-row>

    <div class="left_Part" align="left">
      <div class="Float_Button"
          style="display: inline-block"
          @click="handleClick(!period_switch)">
          {{period_switch ? '隐藏' : '显示'}}学科细分
      </div>
      <div id="data_chart_4" class="data_chart_4">

      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import {commonAjax} from '@/common/utils/ajax'
var BarChart;

export default {
  name: "statistics",
  data() {
    return {
      isLuna:true,
      ku_name: "三角函数",
      image_infos: [],
      ToolsLabelNow: "资源",
      functionStatus: [false, false, false, false],
      resourceStatus: [false, false, false, false],
      Num_Paper: 0,
      Num_Question: 0,
      Num_KU: 0,
      Num_Resources: 0,

      Paper_Data_Sub: [],
      Question_Data_Sub: [],
      KU_Data_Sub: [],
      Resources_Data_Sub: [],

      Paper_Data_Per: [],
      Question_Data_Per: [],
      KU_Data_Per: [],
      Resources_Data_Per: [],

      Chart_Data: {},
      Count_Part: "Question",
      List:[],
      period_switch : false,  //显示学段细分开关点击时的返回值
      echarts: null,
    };
  },
  async mounted() {
    const echarts = await import('echarts');
    this.echarts = echarts;
    this.Init_Bar();
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
    this.Refresh_Setting();
    this.ToTop();
  },
  methods: {
    Refresh_Setting(){
      this.Chart_Part = sessionStorage.getItem("Count_Part") ? sessionStorage.getItem("Count_Part") : "Question"
      this.changeCountButton(this.Chart_Part);
      this.period_switch = sessionStorage.getItem("period_switch") ? sessionStorage.getItem("period_switch") : false
    },
    // 调整首页统计表格的内容
    changeCountButton(type){
      this.$emit("Part_Change_Type", type)
      sessionStorage.setItem("Count_Part", type);
      this.Count_Part = type;
      this.Redraw_Bar();
    },
    Get_Count_Style(type){
      if(type == this.Count_Part){
        return "resourceButton"
      }else{
        return "sleepingButton"
      }
    },
    handleClick(event) {  //点击学段细分开关调用函数
      this.period_switch = event;
      sessionStorage.setItem("period_switch", event);
      this.Redraw_Bar();
    },

    ToTop(){
      window.scrollTo(0,0);
    },
    submit() {
      this.$router.push({
        name: "Knowledge Unit",
        params: { name: this.ku_name, knowledgeSystem: "neea" }
      });
    },
    CloseFunctions(){
      this.functionStatus = [false, false, false, false]
      this.resourceStatus = [false, false, false, false]
    },

    // 重绘统计表图
    Redraw_Bar(){
      if (BarChart != null && BarChart != "" && BarChart != undefined) {
        BarChart.dispose();//销毁
      }
      if (!this.echarts) {
        return;
      }
      BarChart = this.echarts.init(document.getElementById('data_chart_4'));
        let option = {
          grid: {
            x: 80, //x=70时y轴坐标可能显示不全，可以改成百分比
            y: 90,
            x2: 30,
            y2: 35
          },
          title: {
              text :'各学科数据统计',
              x: 'center',
              y: 'top',
              textStyle: {
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
              },
              padding: [5,5,40,25]
          },

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
              order:'seriesDesc'//和图例改动初目的一样，为了让由上到下输入的图例、提示框与由下到上绘制的图标保持一致性
          },
          calculable: true,
          legend: {
              data: [],
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
              data : this.Chart_Data.list_sub,
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
          color :['#48a6f3', '#91cc75','#5470c6',  '#73c0de','#3ba272','#ee6666',  '#fc8452', '#9a60b4', '#ea7ccc'],
          yAxis : [
          {
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
          }
          ],
          series: [],
          animationEasing: 'linear',

      };
      if(this.period_switch == false){
          option.series = [{
                //name:'',
                type:'bar',
                barWidth: '30%',
                //data:[]
            }]
        if(this.Count_Part == 'Question' ){
          option.series[0].name = '试题'
          option.series[0].data = this.Question_Data_Sub
        }else if(this.Count_Part == 'Paper'){
          option.series[0].name = '试卷'
          option.series[0].data = this.Paper_Data_Sub
        }else if(this.Count_Part == 'KU'){
          option.series[0].name = '知识单元'
          option.series[0].data = this.KU_Data_Sub
        }else if(this.Count_Part == 'Resources'){
          option.series[0].name = '教辅教材'
          option.series[0].data = this.Resources_Data_Sub
        }
      }

      else if(this.period_switch == true){
         option.legend.orient = 'vertical';
         option.legend.itemGap = 8;//图列间隔
         var storeName = new Array();//用于存储反转后的List列表
         for(var ind = 0; ind < this.List.length; ind++){
           storeName.push(this.List[this.List.length - ind - 1]);//反转后的List再输入legend达到标签和图例同方向显示
           option.series[ind] = new Object();
           option.series[ind].name = this.List[ind];
           option.series[ind].type = 'bar';
           option.series[ind].barWidth = '30%';
           option.series[ind].stack = this.Count_Part;
           option.series[ind].animationDelay = ind * 400;
           option.series[ind].animationDuration = 400;  //控制图像动画速度来达到欺骗眼睛的效果
           if(this.Count_Part == 'Question' )            option.series[ind].data = this.Question_Data_Per[ind];
           else if(this.Count_Part == 'Paper')           option.series[ind].data = this.Paper_Data_Per[ind];
           else if(this.Count_Part == 'KU')              option.series[ind].data = this.KU_Data_Per[ind];
           else if(this.Count_Part == 'Resources')       option.series[ind].data = this.Resources_Data_Per[ind];
         }
         option.legend.data = storeName;
         option.series[ind] = {
                type:'bar',
                name:'总量',
                barWidth: '30%',
                stack:'total',
                barGap: '-100%',
                itemStyle: {
                  color: 'rgba(128, 128, 128, 0)'  // 设置背景颜色为透明
                }      //此块目的为在堆叠柱形图中显示总量，采用的方法为新加一个总量的bar，与现有的堆叠柱重叠摆放并调整其颜色为透明
         }
        if(this.Count_Part == 'Question' )
          option.series[ind].data = this.Question_Data_Sub
        else if(this.Count_Part == 'Paper')
          option.series[ind].data = this.Paper_Data_Sub
        else if(this.Count_Part == 'KU')
          option.series[ind].data = this.KU_Data_Sub
        else if(this.Count_Part == 'Resources')
          option.series[ind].data = this.Resources_Data_Sub
      }
      // console.log(option.series)
      BarChart.setOption(option);

      //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
      window.addEventListener('resize',function() {BarChart.resize()});
    },
    // 初始化统计表图
    Init_Bar(){

      let config = {
          headers: { "Content-Type": "multipart/form-data" }
      };
      let param = new FormData();
      let isManage=this.$router.currentRoute.path.includes('/manage/')
      if (isManage) {
        // 资源管理页面
        commonAjax(this.backendIP + "/api/count",{}).then((data)=>{
          this.handleResData(data)
        })
      }else{
        // 首页
        this.$http
        .post(this.backendIP + "/api/count", param, config, {
          emulateJSON: true
        })
        .then(function(data) {
          this.handleResData(data.data)
        });
      }
    },
    handleResData(data){
      this.Chart_Data = {};

      this.Paper_Data_Sub = [];
      this.Question_Data_Sub = [];
      this.KU_Data_Sub = [];
      this.Resources_Data_Sub = [];

      this.Paper_Data_Per = [];
      this.Question_Data_Per = [];
      this.KU_Data_Per = [];
      this.Resources_Data_Per = [];

      this.Chart_Data = data;

      this.Num_Paper = this.Chart_Data.num_paper;
      this.Num_Question = this.Chart_Data.num_question;
      this.Num_KU = this.Chart_Data.num_knowledge;
      this.Num_Resources = this.Chart_Data.num_resources;
      this.List = this.Chart_Data.list_per;

      for(var ind = 0; ind < this.Chart_Data.list_per.length; ind++){
          this.Paper_Data_Per[ind] = new Array();
          this.Question_Data_Per[ind] = new Array();
          this.KU_Data_Per[ind] = new Array();
          this.Resources_Data_Per[ind] = new Array();
      }

      for(var index = 0; index < this.Chart_Data.list_sub.length; index ++){
          this.Paper_Data_Sub.push(this.Chart_Data.num_sub[index].Paper);
          this.Question_Data_Sub.push(this.Chart_Data.num_sub[index].Question);
          this.KU_Data_Sub.push(this.Chart_Data.num_sub[index].Knowledge);
          this.Resources_Data_Sub.push(this.Chart_Data.num_sub[index].Resources);

          for(var index2 = 0; index2 < this.Chart_Data.list_per.length; index2 ++){
            this.Paper_Data_Per[index2].push(this.Chart_Data.num_per[index].Paper[index2]);
            this.Question_Data_Per[index2].push(this.Chart_Data.num_per[index].Question[index2]);
            this.KU_Data_Per[index2].push(this.Chart_Data.num_per[index].Knowledge[index2]);
            this.Resources_Data_Per[index2].push(this.Chart_Data.num_per[index].Resources[index2]);
          }
      }
      this.Redraw_Bar();
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}

.resourceButton{
  border-bottom: 1px solid black;
  
}
.el-button:focus{
  background: #48a6f3;
  color: white;
}
.el-button:active{
  background: #48a6f3;
  color: white;
}
.el-button:hover{
  background: #98caf3;
  color: white;
}
.sleepingButton{
  border-bottom: none;
}
.partData{
  height: 120px;
  width: 19%;
  margin-right: 4%;
  display: inline-block;
  background: #EEF5FE;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  border-radius: 10px;
}

.partData_Narrow{
  height: 120px;
  width: 14.5%;
  display: inline-block;
  background: #EEF5FE;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  border-radius: 10px;
  margin-right: 3%;
}

.left_Part{
   border-radius: 20px;
   display: inline-block;
   width: 640px;
   height:400px;
   background: white;
   border: 3px solid white;
   margin-bottom: 40px;
   padding: 10px;
   box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08);
}

.Float_Button{
  position: relative;
  cursor: pointer;
  width: 124px;
  height: 44px;
  line-height: 44px;
  font-size: 16px;
  color: #5c87bf;
  background: #f7f7f7;
  border-radius: 12px;
  text-align: center;
  z-index: 2;
}

.data_chart_4{
  position: relative;
  margin-top:-30px;/*如果没有，则放在框里面的switch按钮点不到*/
  height:350px;
  background: white;
  z-index: 1;
}

.Right_Part{
  height: 400px;
  width: 600px;
  border: 1px solid blue;
  display: inline-block;
}

.Main_Statistics{
  background: #FAFAFC;
  width: 640px;
  margin: 0px auto;
  padding-top: 210px;
}

.Button_Basic{
  width: 80px;
  height: 40px;
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
  transition-duration: 3000ms;
  transition: ease;
  margin-right: 20px;
  cursor: pointer;
}


</style>
