<template lang="html">
  <div class="">
    <el-row style="margin-top: 40px; padding-bottom: 40px">
      <el-col :span="$store.isLuna?4:5" :offset="$store.isLuna?4:5" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon1.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">试题</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_Question}}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="$store.isLuna?4:5" :offset="$store.isLuna?2:4" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon2.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">试卷</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_Paper}}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col v-if="$store.isLuna" :span="4" :offset="2" class="partData">
        <el-row>
          <el-col :span="12">
            <img src="@/assets/dataIcon3.png" width="60px" style="padding-top: 30px"/>
          </el-col>
          <el-col :span="12" style="padding-top: 30px">
            <p style="font-weight:bold; font-size: 18px; color: black">知识单元</p>
            <p style="font-weight:bold; font-size: 18px; color: black">{{Num_KU}}</p>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-bottom: 40px">
      <el-button-group>
        <el-button round @click="changeCountButton('Question')" ref="countButtonQuestion" :class="Get_Count_Style('Question')">
          试题资源
        </el-button>
        <el-button round @click="changeCountButton('Paper')" ref="countButtonPaper" :class="Get_Count_Style('Paper')">
          试卷资源
        </el-button>
        <el-button v-if="$store.isLuna" round @click="changeCountButton('KU')" ref="countButtonKU" :class="Get_Count_Style('KU')">
          知识单元
        </el-button>
      </el-button-group>
    </el-row>

    <el-row>
    <div class="bigBox">
      <div class="labelBox">
        <el-tabs  @tab-click="handleClick">
        <el-tab-pane label="学科" name="first"></el-tab-pane>
        <el-tab-pane label="学段" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div id="data_chart" class="data_chart">
      </div>
    </div>
    </el-row>
  </div>
</template>

<script>
import $ from "jquery";
// import {commonAjax} from '@/common/utils/ajax'
import * as echarts from 'echarts';
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

      Paper_Data_Sub: [],
      Question_Data_Sub: [],
      KU_Data_Sub: [],//修改的属性

      Paper_Data_Per: [],
      Question_Data_Per: [],
      KU_Data_Per: [],//新加入属性

      Chart_Data: {},
      Count_Type: "Question",
      Sort_Type: "学科"//新加入的属性
    };
  },
  mounted() {
    this.Init_Bar();
    // data - background
    $("[data-background]").each(function() {
      $(this).css(
        "background-image",
        "url(" + $(this).attr("data-background") + ")"
      );
    });
    this.ToTop();
  },
  methods: {
    // 调整首页统计表格的内容
    changeCountButton(type){
      this.Count_Type = type;
      this.Redraw_Bar();
    },
    Get_Count_Style(type){
      if(type == this.Count_Type){
        return "resourceButton"
      }else{
        return "sleepingButton"
      }
    },

    handleClick(tab,event) {//新加入的标签页
      console.log(tab,event)
      if(tab.name == 'first'){
        this.Sort_Type = "学科";
      }
      else if(tab.name == 'second'){
        this.Sort_Type = "学段";
      }
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
      BarChart = echarts.init(document.getElementById('data_chart'));
        let option = {
          grid: {
            x: 80, //x=70时y轴坐标可能显示不全，可以改成百分比
            y: 90,
            x2: 30,
            y2: 35
          },
          title: {
              text :'各' + this.Sort_Type + '数据统计',
              x: 'center',
              y: 'top',
              textStyle: {
                  fontSize: 16,
                  fontStyle: 'normal',
                  fontWeight: 'bold',
              },
              padding: [5,5,40,25]
          },
          color: ['#409EFD'],
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
          series: []
      };

      if(this.Count_Type == 'Question' ){
        option.legend.data = ['试题']
        option.series = [{
              name:'试题',
              type:'bar',
              barWidth: '30%',
              data:this.Question_Data_Sub
          }]
        if(this.Sort_Type == '学段') {
          option.series[0].data = this.Question_Data_Per;
          option.xAxis[0].data = this.Chart_Data.list_per;
        }
      }else if(this.Count_Type == 'Paper'){
        option.legend.data = ['试卷']
        option.series = [{
              name:'试卷',
              type:'bar',
              barWidth: '30%',
              data: this.Paper_Data_Sub
          }]
        if(this.Sort_Type == '学段') {
          option.series[0].data = this.Paper_Data_Per;
          option.xAxis[0].data = this.Chart_Data.list_per;
        }
      }else if(this.Count_Type == 'KU'){
        option.legend.data = ['知识单元']
        option.series = [{
              name:'知识单元',
              type:'bar',
              barWidth: '30%',
              data: this.KU_Data_Sub
          }]
        if(this.Sort_Type == '学段') {
          option.series[0].data = this.KU_Data_Per;
          option.xAxis[0].data = this.Chart_Data.list_per;
        }
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

      this.$http
      .post(this.backendIP + "/api/count", param, config, {
        emulateJSON: true
      })
      .then(function(data) {

        this.Chart_Data = {};

        this.Paper_Data_Sub = [];
        this.Question_Data_Sub = [];
        this.KU_Data_Sub = [];
        this.Paper_Data_Per = [];
        this.Question_Data_Per = [];
        this.KU_Data_Per = [];

        this.Chart_Data = data.data;

        this.Num_Paper = this.Chart_Data.num_paper;
        this.Num_Question = this.Chart_Data.num_question;
        this.Num_KU = this.Chart_Data.num_knowledge;
        for(var index = 0; index < this.Chart_Data.num_sub.length; index ++){
            this.Paper_Data_Sub.push(this.Chart_Data.num_sub[index].Paper);
            this.Question_Data_Sub.push(this.Chart_Data.num_sub[index].Question);
            this.KU_Data_Sub.push(this.Chart_Data.num_sub[index].Knowledge);//后端PQK数据名已调整为大写！
        }
        for(var index2 = 0; index2 < this.Chart_Data.num_per.length; index2 ++){
          this.Paper_Data_Per.push(this.Chart_Data.num_per[index2].Paper);
          this.Question_Data_Per.push(this.Chart_Data.num_per[index2].Question);
          this.KU_Data_Per.push(this.Chart_Data.num_per[index2].Knowledge);
        }
        this.Redraw_Bar();
      });
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
  background: #48a6f3;
  color: white;
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
  background: #F8FBFF;
  color: rgb(122, 122, 122);
}
.partData{
  height: 120px;
  background: #EEF5FE;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  border-radius: 10px;
}

.bigBox{
   border-radius: 10px;
   width: 67%;
   height:400px;
   margin-left: 16.5%;
   border: 3px solid #EEF5FE;
   margin-bottom: 40px;
}
.labelBox{
  padding-left:2%; /*解决标签顶格问题*/
  padding-right:2%;
}
.data_chart{
   height:300px;
}
</style>
