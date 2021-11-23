/* eslint-disable camelcase */
<template>
  <div 
    class="ku" 
    style="padding-top: 32px; overflow: auto" 
    v-loading="loading"
    element-loading-text="正在读取知识点网络，请稍后..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.28)">
    <!-- <el-dialog
        :visible.sync="simpleInput"
        title="LUNA输入助手"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @New_Content="Update_Complex_Input" :Get_Out_Content="content"></ComplexInput>
    </el-dialog> -->

    <el-row justify="start" type="flex" style="margin: 0;">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>
          知识单元检索
          <span @click="openInstructionDialog" style="cursor:pointer;">
            <i class="el-icon-question"></i>
          </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <instruction ref="instruction"/>
    <!-- 页面标题行 -->
    <el-row
        type="flex"
        class="KU_Title"
        justify="start"
        style="margin-top: 12px; margin-bottom: 30px; margin-left: -4px;">
        <span>知识单元检索</span>
    </el-row>

    <!-- 学科行 -->
    <el-row type="flex" justify="start" style="margin-bottom: 18px; font-size: 18px;">
      <label>学科</label>
    </el-row>
    <div class="SearchArea" align="left" style="margin-bottom: 20px;">
      <div 
        v-for="(Subject, Subject_Index) in Subject_List_All" 
        :key="'Subject_' + Subject_Index"
        align="center"
        :class="Get_Subject_Button_Class(Subject)" 
        @click="Change_Subject_List(Subject)">
        <span>{{Subject}}</span>
      </div>
    </div>

    <!-- 学段行 -->
    <el-row type="flex" justify="start" style="margin-bottom: 12px; font-size: 18px;">
      <label>学段</label>
    </el-row>
    <div class="SearchArea" align="left" style="margin-bottom: 20px;">
      <div 
        v-for="(Period, Period_Index) in Period_List_All" 
        :key="'Period_' + Period_Index"
        align="center"
        :class="Get_Period_Button_Class(Period)" 
        @click="Change_Period_List(Period)">
        <span>{{Period}}</span>
      </div>
    </div>
    
    <!-- 搜索框行 -->
    <el-row id="Search_Bar" type="flex" justify="start" style="margin-bottom: 12px; font-size: 18px;">
      <label>检索</label>
    </el-row>
    <el-row type="flex" justify="start" class="SearchArea">
      <div class="SearchInputDIV">
        <el-input 
          prefix-icon="el-icon-search"
          placeholder="请输入知识单元名称"
          class="SearchInput" v-model="ku_name" type="text" @keyup.enter.native="Search_KU_Info(ku_name)">

        </el-input>
      </div>
      <div class="SearchButton" @click="Search_KU_Info(ku_name)">
        <span>检索</span>
      </div>
    </el-row>

    <!-- 搜索结果行 -->
    <el-row type="flex" justify="start" style="margin: 0;" v-show="Search_KU">
      <label style="height: 40px; line-height: 40px; padding-top: 3px; margin-right: 30px; font-size: 18px;">搜索结果</label>
      <el-button type="text" @click="Transition_Show = !Transition_Show" style="color: #4A4B56">
        <i class="el-icon-caret-right" :style="Get_Rotate_Triangle(Transition_Show)"></i>
        <label style="cursor: pointer">{{Transition_Show ? "仅看首个" : "查看更多"}}</label>
      </el-button>
    </el-row>
    <el-row 
      v-show="Search_KU"
      type="flex" 
      justify="start" 
      :style="'margin: 0; margin-bottom:' + Transition_Show ? ' 32px' : ' 24px'" 
      class="KU_Point_Card">
      <KnowledgePointCard @Search_This_KU="Search_KU_Do" :KnowledgePoint="KU_Search_List[0]">

      </KnowledgePointCard>
    </el-row>
    <el-row type="flex" justify="start" style="margin: 0; margin-bottom: 32px">
      <transition name="el-zoom-in-top">
        <!-- 用于显示知识点的地方 -->
        <div v-show="Transition_Show" class="transition-box">
          <!-- <div v-for="(Node_Name, Node_Index) in similar_nodes" :key="'Similar_' + Node_Index" class="KU_Point_Card">
            <KnowledgePointCard>

            </KnowledgePointCard>
          </div> -->
          <el-row 
            v-for="KU_Index in (KU_Search_List.length - 1)" 
            :key="'Similar_' + KU_Index" 
            type="flex" 
            justify="start"
            class="KU_Point_Card">
            <KnowledgePointCard  @Search_This_KU="Search_KU_Do" :KnowledgePoint="KU_Search_List[KU_Index]">

            </KnowledgePointCard>
          </el-row>
        </div>
      </transition>
    </el-row>
  
    <!-- 相关搜索
    <el-row class="ConnectSearch" v-if="similar_nodes.length" style="">
      <el-row style="margin-left: -1330px;font-size: 14px;">相关搜索</el-row>
      <el-row type="flex" v-model="similar_nodes" v-for="_row in 2" :key="_row">
        <el-col :span="4" v-for="_rol in 5" :key="_rol" >
          <el-button class="info-btn" size="medium" type="info" plain >
            {{getSimilarNodesElement(_row, _rol)}}
          </el-button>
        </el-col>          
      </el-row>        
    </el-row> -->
    <el-row>
      <div class="KU_Detail_Aim" id="KU_Detail"></div>
    </el-row>
    <el-row type="flex" justify="start" style="margin-bottom: 12px; font-size: 18px; margin-top: -10px" v-show="Search_Result">
      <label>知识点详情</label>
    </el-row>
    <el-row class="panel-body" v-loading="loading" v-show="Search_Result">
      <div class="graph" id="graph_container">
        <Graph
          ref="graph"
          @search="search"
          />
      </div>
      <div class="container">
        <div class="intro">
          <el-row type="flex" justify="start" class="title">
            {{ data.nodes ? data.nodes.node.name : "" }}
          </el-row>
          <el-row type="flex" justify="start" class="content">
            {{ (data.nodes ? data.nodes.node.description : "").split("...")[0] }}
          </el-row>
        </div>
        <div class="detail">
          <el-row class="Relation_Title">
            <label style="color: #0a1612; float: left; font-weight: bold">知识关系
              <el-tooltip  class="item" effect="dark" placement="top">
                <div class="instruction" slot="content">
                  <h5>前驱后继</h5>
                  <p>
                    前驱节点是学习当前节点的必要条件，掌握了前驱节点才能理解当前知识节点。掌握当前知识节点是掌握后继节点的必要条件。
                  </p>
                  <h5 style="margin-top: 12px; display: inline-block">共同学习</h5>
                  <p>
                    共同学习知识节点和当前知识节点有相互促进关系，掌握了共同学习知识节点可以更好地理解当前知识节点。
                  </p>
                  <h5 style="margin-top: 12px; display: inline-block">层级关系</h5>
                  <p>
                    树状节点图中，上级节点包括当前知识节点，当前知识节点包括下级节点。
                  </p>
                </div>
                <i class="el-icon-question"></i>
              </el-tooltip>
            </label>
            <el-button type="text" class="zoom-in-btn" size="small" @click="handleFullScreen()">
              <i class="el-icon-full-screen" style="margin-right: 10px"></i>全屏显示
            </el-button>
          </el-row>
          <div>
            <el-tabs v-model="activeName" :stretch="false" :lazy="true" @click.native="handleSwitchTabs()">
              <el-tab-pane
                label="前驱后继" name="presuc" id="presuc_container" class="svg-container">
                <pre-suc
                  ref="presuc"
                  @search="search"
                />
              </el-tab-pane>
              <el-tab-pane label="共同学习" name="costudy" id="costudy_container" class="svg-container">
                <co-study
                  ref="costudy"
                  @search="search"
                  />
              </el-tab-pane>
              <el-tab-pane label="层级关系" name="hierarchy" id="tree_container" class="svg-container">
                <Hierarchy
                  ref="hierarchy"
                  />
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      
    </el-row>
    <el-row v-show="!Search_Result" style="height: 300px; width: 100%;">
      <label style="font-size: 24px; margin-top: 60px; color: #ccc">{{Search_KU ? "点击按钮查看详情信息" : "尚未检索知识点"}}</label>
    </el-row>
  </div>
</template>

<script>
import $ from 'jquery'
import * as d3 from "d3";
import PreSuc from "./components/PreSuc.vue";
import CoStudy from "./components/CoStudy.vue";
import Hierarchy from "./components/Hierarchy.vue";
import Graph from "./components/Graph.vue";
// import ComplexInput from "@/common/components/ComplexInput.vue";
import screenfull from 'screenfull'
import {dataDict} from './components/utils.js'
import {Message } from 'element-ui'
import Instruction from './components/InstructionKU.vue'

import KnowledgePointCard from '@/views/resourceQuery/KU/components/KnowledgePointCard'
import {commonAjax} from '@/common/utils/ajax'

export default {
  components: {
    Graph,
    PreSuc,
    CoStudy,
    Hierarchy,
    Instruction,
    KnowledgePointCard
  },
  name: "KU",
  data() {
    return {
      // 变化区块
      Transition_Show:false,
      activeName:"presuc",
      content:"",
      // ku_name: "函数",
      ku_name: "",
      ku_type: "kp2.0",
      fullEl: document.getElementById(this.activeName+'_container'),
      isFullscreen: false,
      // 节点。邻居节点，层级结构
      data:{},
      node: {},
      neighbors_groups: {},
      neighbors_hierarchy : [],
      similar_nodes: [],
      sour: "rjb_new",
      sourceLabel: ["百科", "人教版"],
      checkList: ["前驱后继", "共同学习", "层级结构"],
      // 前驱后继，共同学习，向内箭头，向外箭头
      // directed_len: "",
      // undirected_len: "",
      undirected_len: 0,
      inward_arrow: 0,
      outward_arrow: 0,
      // 上级层，下级层
      superior_layer: 0,
      inferior_layer: 0,
      // layerLength: "",
      root_view: false,
      loading: false,
      url: "",
      image_infos: [],
      complex_input_flag: false,
      // 知识体系名称
      KS_List: [
        {
          value: 'NUEAGUC',
          label: '高考数据'
        },
        {
          value: 'iflytek',
          label: '讯飞'
        },
        {
          value: 'neea',
          label: '考试中心'
        },
        {
          value: 'tiku',
          label: '题库中国'
        },
        {
          value: 'Other',
          label: '其他'
        },
      ],
      // 知识体系
      knowledgeSystem: "neea",
      // 当前是否为简单输入格式
      simpleInput: false,
      // 以下为2021 11 22 新增内容，关于学科和学段的筛选
      Subject_List_All: ["语文", "数学", "英语", "政治", "历史", "地理", "化学", "物理", "生物"],
      Period_List_All: ["小学", "初中", "高中", "大学", "成人"],
      Subject_List: [],
      Period_List: [],
      // 标记是否为“知识点检索结果”的状况
      Search_Result: false,
      // 标记是否为“知识点关键字检索”的状况
      Search_KU: false,
      KU_Search_List: [
        {
            "content": "三角函数",
            "subject": "数学",
            "period": "高中",
            "level": "一级知识点",
            "description": "123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123",
        },
        {
            "content": "三角函数",
            "subject": "数学",
            "period": "高中",
            "level": "一级知识点",
            "description": "123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123",
        }
      ]
    };
  },
  mounted() {
    $('.panel-btn').hide()
    this.root_view = sessionStorage.user === "root";
    // console.log(this.root_view);
    if (this.$route.params.name) {
      this.ku_name = this.$route.params.name;
      this.Search_KU_Info(this.ku_name);
    }
    if (sessionStorage.getItem('KUFromPaperAnalyse')){
      this.ku_name = sessionStorage.getItem('KUFromPaperAnalyse');
      this.Search_KU_Info(this.ku_name);
    }
    this.ToTop();
  },
  beforeDestroy() {
    this.destroyFullScreen()
  },
  watch: {
    sour() {
      this.submit(this.ku_name, this.knowledgeSystem);
    },
    checkList() {
      this.submit(this.ku_name, this.knowledgeSystem);
    }
  },
  methods: {
    Search_KU_Info(KU_Name){
      // KU_Name
      // this.Search_KU = true;
      // this.Transition_Show = true;
      // document.getElementById("Search_Bar").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      this.Search_KU = false
      this.Transition_Show = false
      this.Search_Result = false
      let Param = {
        data: JSON.stringify({
          content: KU_Name,
          subject: this.Subject_List,
          period: this.Period_List
        })
      }
      commonAjax(this.backendIP+'/api/GetSimilarKnowledge', Param)
      .then((data)=>{
        this.KU_Search_List = data.results
        this.Search_KU = true;
        this.Transition_Show = true;
        document.getElementById("Search_Bar").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
        
      })
    },
    // 确认要检索某个知识点
    Search_KU_Do(KU_Info){
      let Info = JSON.parse(KU_Info);
      this.submit(Info.content)
    },
    // 小三角的变化
    Get_Rotate_Triangle(Transition_Show){
      let Style = {
        "transition-duration": "300ms",
        "transform": Transition_Show ? "rotate(90deg)" : "",
        "margin-right": "10px",
        "color": "#4A4B56"
      }

      return Style
    },
    // 调整过滤项
    Change_Subject_List(Subject){
      let Index = this.Subject_List.indexOf(Subject)
      if(Index == -1){
        this.Subject_List.push(Subject)
      }else{
        this.Subject_List.splice(Index, 1)
      }
    },
    Change_Period_List(Period){
      let Index = this.Period_List.indexOf(Period)
      if(Index == -1){
        this.Period_List.push(Period)
      }else{
        this.Period_List.splice(Index, 1)
      }

    },
    // 获取学科过滤按钮的类别
    Get_Subject_Button_Class(Subject){
      if(this.Subject_List.indexOf(Subject) != -1){
        return "Chosen_Filter"
      }else{
        return "Unchosen_Filter"
      }
    },
    // 获取学段过滤按钮的类别
    Get_Period_Button_Class(Period){
      if(this.Period_List.indexOf(Period) != -1){
        return "Chosen_Filter"
      }else{
        return "Unchosen_Filter"
      }
    },
    getSimilarNodesElement(val1, val2){
      return this.similar_nodes[(val1-1)*5 + val2 - 1];
    },
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    handleSwitchTabs(){
      d3.selectAll("#presuc>*").remove();
      d3.selectAll("#costudy>*").remove();
      d3.selectAll("#hierarchy>*").remove();
      switch (this.activeName) {
        case 'presuc':
          this.drawPresuc();
          break;
        case 'costudy':
          this.drawCostudy();
          break;
        case 'hierarchy':
          this.drawHierarchy();
          break;
      }
    },
    handleFullScreen() {
      this.fullEl = document.getElementById(this.activeName+'_container');
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      if (this.fullEl) {
        screenfull.toggle(this.fullEl)
      } else {
        screenfull.toggle()
      }
    },
    changeFullScreen() {
      this.isFullscreen = screenfull.isFullscreen
      this.$emit('changeFullScreen', this.isFullscreen)
    },
    initFullScreen() {
      // this.fullEl = document.getElementById(this.activeName);
      if (screenfull.enabled) {
        screenfull.on('change', this.changeFullScreen)
      }
    },
    destroyFullScreen() {
      if (screenfull.enabled) {
        screenfull.off('change', this.changeFullScreen)
      }
    },
    changeInput() {
      this.simpleInput = !this.simpleInput;
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    search(val){
      this.Search_KU_Info(val);
    },
    dataSource(tab) {
      this.sour = "rjb_new";
      return tab.name;
    },
    // 测试退出函数
    logout_root() {
      sessionStorage.clear();
      location.reload();
    },
    /**
     * 提交
     */
    submit(name, ks) {
      if (name !== undefined) this.ku_name = name;
      if (ks !== undefined) this.knowledgeSystem = ks;
      if (this.ku_name.length === 0) {
        return;
      }
      this.url =
        "https://baike.baidu.com/search/word?word=" + encodeURI(this.ku_name);
      this.loading = true;
      d3.selectAll("svg>*").remove();
      this.$http
        .post(
          this.backendIP + "/api/ku_v2",
          {
            ku_name: this.ku_name,
            ku_type: this.ku_type,
            ku_edge_type: this.checkList,
            system: this.knowledgeSystem
          },
          { emulateJSON: true }
        )
        .then(function(data) {
          if (data.data.nodes === null) {
            this.loading = false;
            Message({
              message: '没有此知识点的相关内容',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            if (data.data.similar_nodes.length === 0){
              this.initFullScreen();
              this.data=data.data
              this.similar_nodes = data.data.similar_nodes
              this.neighbors_hierarchy = data.data.neighbors_hierarchy
              this.neighbors_undirected = data.data.neighbors_undirected
              this.Search_Result = true;
              setTimeout(()=>{
                this.drawGraph()
                this.handleSwitchTabs()
                document.getElementById("KU_Detail").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
              }, 100)
              this.loading = false;
            } else {
              Message({
                message: '暂缺此知识点的网络信息，正在为您推荐近似的知识点',
                type: 'error',
                duration: 2000
              })
              this.Search_Result = false;
              this.Search_KU_Info(this.ku_name);
              this.loading = false;
            }
          }
          if(sessionStorage.getItem("KUFromPaperAnalyse")){
            sessionStorage.removeItem("KUFromPaperAnalyse")
          }
        })
        .catch(()=>{
          Message({
            message: '服务出现故障，请重新输入并检索',
            type: 'error',
            duration: 5 * 1000
          })

          this.loading = false;
        });
    },
    drawPresuc(){
      let nodes =this.data.nodes
      let data={}
      data.nodes = [
        {
          id:nodes.node.name,
          community:dataDict.current.value,
          color:dataDict.current.color,
          desc: nodes.node.description,
        }
      ];
      data.links=[];
      let pre = nodes.pre
      let suc = nodes.suc
      //
      for (let i = 0; i < pre.length; i++) {
          data.nodes.push({
            id:pre[i].node.name,
            color:dataDict.pre.color,
            community:dataDict.pre.value,
            desc:pre[i].node.description
          })
          data.links.push({
            source: pre[i].node.name,
            target: nodes.node.name,
            relation: '',
            value: Math.random() * (1.6 - 1) + 1
          })
      }
      for (let i = 0; i < suc.length; i++) {
        data.nodes.push({
          id:suc[i].node.name,
          color:dataDict.suc.color,
          community:dataDict.suc.value,
          desc: suc[i].node.description
        })
        data.links.push({
          source: nodes.node.name,
          target: suc[i].node.name,
          relation: '',
          value: Math.random() * (1.6 - 1) + 1
        })
      }
      this.$refs.presuc.draw_graph(data)
    },
    drawCostudy(){
      let nodes=this.data.nodes
      let data={}
      data.nodes=[
        {
          name:nodes.node.name,
          color:dataDict.current.color,
          desc: nodes.node.description,
        }
      ]
      data.links=[]
      let neighbors_undirected=this.data.neighbors_undirected["kp2.0"]||[]
      for (let i = 0; i < neighbors_undirected.length||0; i++) {
        data.nodes.push({
          name:neighbors_undirected[i].name,
          color:dataDict.costudy.color,
          desc: neighbors_undirected[i].annotation.split("description-")[1],
        })
        data.links.push({
          source: 0,
          target: i+1,
          relation: '',
          value: Math.random() * (1.6 - 1) + 1
        })
      }
      this.$refs.costudy.draw_graph(data)
    },
    drawHierarchy(){
      let data=this.data
      let hierarchyData=null

      let mid_data
      let sup_len=data.neighbors_hierarchy.length-data.inf_len
      let i=0
      if(sup_len>0){
        for (; i < sup_len; i++) {
          hierarchyData={
            name: this.neighbors_hierarchy[i],
            value: dataDict.sup.value,
            color:dataDict.sup.color,
            community:dataDict.sup.value,
            children: []
          }
        }
        // mid_data=data.children[0]
      }
      mid_data={
        name: data.nodes.node.name,
        value: dataDict.current.value,
        children: [],
        color:dataDict.current.color,
      }
      for (; i < data.neighbors_hierarchy.length; i++) {
          mid_data.children.push({
            name: data.neighbors_hierarchy[i],
            value: dataDict.inf.value,
            color:dataDict.inf.color,
            children: [],
          })
      }
      if(!hierarchyData){
        hierarchyData=mid_data
      }else{
        hierarchyData.children.push(mid_data)
      }
      this.$refs.hierarchy.draw_graph(hierarchyData)
    },
    drawGraph(){
      let data = {}
      let nodes = [];
      let nodeCount = 0;
      let edgeCount = 0;
      let edges = []
      let lenMin = 1.5,
      lenMax = 2;
      nodes.push({
        id: nodeCount++,
        name: this.data.nodes.node.name,
        community: dataDict.current.value,
        color:dataDict.current.color,
        group: dataDict.current.value,
        desc: this.data.nodes.node.description,
      })

      //共同学习
      let nu=this.data.neighbors_undirected['kp2.0']||[]
      for (let i =0; i < nu.length; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: nu[i].name,
          color:dataDict.costudy.color,
          community: dataDict.costudy.value,
          group: dataDict.costudy.value,
          desc: nu[i].annotation.split("description-")[1],
        })
        edges.push({
          id: edgeCount,
          source: 0,
          target: nodeCount,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      //层级关系
      let nh = this.data.neighbors_hierarchy
      let sup_len = nh.length-this.data.inf_len
      for (let i = 0; i < sup_len; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: nh[i],
          color:dataDict.sup.color,
          group: dataDict.sup.value,
          community: dataDict.sup.value,
        })
        edges.push({
          id: edgeCount,
          source: nodeCount,
          target: 0,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      for (let i = sup_len; i < nh.length; i++, nodeCount++, edgeCount++) {
        nodes.push({
          id: nodeCount,
          name: nh[i],
          color:dataDict.inf.color,
          community: dataDict.inf.value,
          group: dataDict.inf.value,
        })
        edges.push({
          id: edgeCount,
          source: 0,
          target: nodeCount,
          relation: '',
          value: Math.random() * (lenMax - lenMin) + lenMin,
        })
      }
      //前驱后继
      let pre = this.data.nodes.pre;
      let suc = this.data.nodes.suc;
      this.recursivePresuc(0,dataDict.pre.value,pre,suc,nodes,edges,nodeCount,edgeCount);
      data.nodes = nodes
      data.links = edges
      this.$refs.graph.draw_graph(data);
    },
    recursivePresuc(root,community,pre,suc,nodes,edges,nodeCount,edgeCount){
      for (let i = 0; i < pre.length; i++,nodeCount++,edgeCount++) {
        if(nodes.find(d=>d.name==pre[i].node.name)){
          continue;
        }
        nodes.push({
          id: nodeCount,
          name: pre[i].node.name,
          color:dataDict.pre.color,
          community: community,
          group: community,
          desc: pre[i].node.description
        })
        edges.push({
          id: edgeCount,
          source: nodeCount,
          target: root,
          relation: '',
        })
        if(pre[i].pre!=[]||pre[i].suc!=[]){
          [nodeCount,edgeCount]=this.recursivePresuc(nodeCount,community,pre[i].pre,pre[i].suc,nodes,edges,nodeCount+1,edgeCount+1);
        }

      }
      if (root==0) {
        community=dataDict.suc.value
      }
      for (let i = 0; i < suc.length; i++,nodeCount++,edgeCount++) {

        if(nodes.find(d=>d.name==suc[i].node.name)){
          continue;
        }
        nodes.push({
          id: nodeCount,
          name: suc[i].node.name,
          color:dataDict.suc.color,
          community: community,
          group: community,
          desc: suc[i].node.description
        })
        edges.push({
          id: edgeCount,
          source: root,
          target: nodeCount,
          relation: '',
        })
        if(suc[i].pre!=[]||suc[i].suc!=[]){
          [nodeCount,edgeCount]=this.recursivePresuc(nodeCount,community,suc[i].pre,suc[i].suc,nodes,edges,nodeCount+1,edgeCount+1);
        }
      }
      return [nodeCount,edgeCount]
    },
    // Update Complex Input，将组合输入的内容复制到当前搜索框应该具有的内容里
    Update_Complex_Input(val){
      this.ku_name = val;
      this.simpleInput = false;
    },
    // Update Complex Input Image，将组合输入的内容的图片部分复制到当前页面的内容里，如果后续又要用到则进行调用
    UCII(val){
      this.image_infos = val;
    },
    // 打开组合输入的组件，并将当前存放的ku_name属性赋予组件，实现切换时的无缝效果，由于content发生改变时会自动
    // 将内容返回给this.ku_name，所以关闭组合输入时无需考虑这一点
    Open_CI(){
      this.complex_input_flag = true;
      setTimeout(()=>{this.$refs.CI.content = this.ku_name}, 10);
    },
    Close_CI(){
      this.complex_input_flag = false;
    }
  }
};
</script>

<style scoped lang="scss">
.instruction{
   max-width:300px;
   p{
     text-indent:2em;
   }
}
.zoom-in-btn{
  position:absolute;
  top:59px;
  right:0px;
  color: black;
  z-index: 2;
  display: block;
  font-family: PingFang SC;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
}
.ku {
  width: 1344px;
  padding: 0 88px;
  margin: 0 auto;
}
.ku h6 {
  color: #666;
  font-size: 12px;
  padding-top: 3px;
  padding-bottom: 0px;
}
.logo {
  margin-top: 15px;
  margin-left: 20px;
}
::v-deep .info-btn{
  // background-color: red;
  width: 200px;
  text-align: left;
}
.panel-body{
  position:relative;
  padding: 48px 32px;
  background: #FFFFFF;
  border: 1px solid rgba(212, 212, 212, 0.5);
  box-sizing: border-box;
  box-shadow: 1px 4px 16px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.ConnectSearch{
  position:relative;
  padding-top: 5vh;
  margin-left: 5vw;
  margin-right: 5vw;
}
.panel-btn{
  position: absolute;
  top:0;
  font-size: 30px;
  font-weight:bold;
  color: #bbb;
}
#openBtn{
  top:5vh;
  // left:15px;
}
#closeBtn{
  right:0;
}
.tab
{
    position: absolute;
    width: 30px;
    height: 95px;
    border-radius: 0px 10px 10px 0px;
    background-color: #eef1f7;
    cursor:default;
    div{
      width: 16px;
      margin: 8px auto;
      line-height: 21px;
      font-size: 16px;
      color: #909194;
    }
    .arrow
    {
      border-color: #eef1f7 transparent transparent #eef1f7;
      border-style: solid;
      border-width: 15px 15px 15px 15px;
      height:0;
      width:0;
      position:absolute;
      bottom:-23px;
    }
}

.container {
  display: flex;
  width:100%;
  flex-flow: column;
  padding: 0;
}
.intro{
  max-height:20%;
}
.intro >.content{
  max-height:240px;
  overflow-y: auto;
}
.detail{
  margin-top: 40px;
  height: 400px;
  flex:1;
}
.detail .el-tab-pane{
  overflow-y: auto;
  margin-bottom: 0;
}
.svg-container{
  height:321px;
}
.svg-container:fullscreen{
  height: 100%;
  background-color: #fff;
}
.graph {
  // position: relative;
  height: 345px;
  background-color: #fff;
  margin-bottom: 32px;
}
.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.label {
  line-height: 35px;
  margin: 10px;
  display: flex;
  flex-wrap: wrap;
}
.title {
  text-align: left;
  color: #0a1612;
  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 41px;
  margin-bottom: 16px;
}
.content {
  margin-top: 0;
  text-align: left;
  font-family: PingFang SC;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0em;

}
.el-tag {
  margin-left: 10px;
}
.el-col {
  border-radius: 4px;
}
.el-tabs__nav.is-top{
}
</style>

<style scoped type="text/css">
/* .el-button {
  background-color: #1a2930;
  color: #fff;
  border-color: #1a2930;
}
.el-button:hover {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
}
.el-button:focus {
  background-color: #008080;
  color: #fff;
  border-color: #fff;
  outline: none;
} */
#tabs ::v-deep .el-tabs__item {
  background: #4FA5FD;;
  color: white;
  font-weight: 900;
  border-radius: 10px;
  border: 0px;
}
#tabs ::v-deep .el-tabs__item.is-active {
  background: #4FA5FD;;
  color: white;
  font-weight: 900;
  border-radius: 10px;
}

#tabs ::v-deep .el-tabs__nav.is-top{
  border: none;
}
#tabs ::v-deep .el-tabs__header.is-top{
  border: none;
}

#checkbox ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #1a2930;
}
.el-tag {
  margin-left: 10px;
  background-color: #fff;
  color: #000;
  border-color: #c5c1c0;
}
</style>
<style lang="scss" scoped>
.SearchInput{
  font-size: 16px;
  line-height: 46px;
  height: 46px;
  background: #FFFFFF;
  border: 1px solid #D4D4D4;
  box-sizing: border-box;
  box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
  border-radius: 10px;
  -webkit-box-shadow: 0px 2px 8px rgba(151, 151, 151, 0.06);
}
.SearchInputDIV{
  width: 684px;
}
.SearchInput ::v-deep .el-input__inner {
  border: 0;
  border-radius: 0px;
  background: transparent;
}

.el-divider--vertical{
  display: block;
  width: 2px;
  background-color: #9B9EA4;
  height: 32px;
  margin-top: 4px;
}
.FilterButton{
  padding-top: 12px;
}

.SearchArea{
  width: 100%
}

.SearchButton{
  display: block;
  margin-left: 12px;
  width: 120px;
  height: 46px;
  line-height: 46px;
  color: white;
  cursor: pointer;
  background: linear-gradient(90deg, #65A1E6 0%, #3E89E0 100%);
  /* capsule */

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  transition-duration: 300ms;
}

.SearchButton:hover{
  background: linear-gradient(90deg, #3777BF 0%, #1863BA 100%);
  transition-duration: 300ms;
}

.Unchosen_Filter{
  display: inline-block;
  margin-right: 12px;
  margin-bottom: 12px;
  width: 80px;
  height: 46px;
  line-height: 46px;
  color: black;
  cursor: pointer;
  /* capsule */
  background: #FFFFFF;
  border: 1px solid #D4D4D4;
  box-sizing: border-box;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  transition-duration: 300ms;
}

.Unchosen_Filter:hover{
  border: 1px solid #B3B3B3;
  color: #295D99;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
  transition-duration: 300ms;
}

.Chosen_Filter{
  display: inline-block;
  margin-right: 12px;
  width: 80px;
  height: 46px;
  line-height: 46px;
  margin-bottom: 12px;
  color: white;
  cursor: pointer;
  /* capsule */
  background: linear-gradient(90deg, #65A1E6 0%, #3E89E0 100%);
  box-sizing: border-box;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
  border-radius: 10px;
  transition-duration: 300ms;
}

.Chosen_Filter:hover{
  background: linear-gradient(90deg, #3777BF 0%, #1863BA 100%);
  transition-duration: 300ms;
}

.Relation_Title{
  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 35px;
  display: flex;
  align-items: center;
  color: #000000;
}

.transition-box {
  box-sizing: border-box;
  width: 100%;
}

.KU_Point_Card{
  width: 100%;
  margin-bottom: 24px;
  background: #FFFFFF;
  opacity: 0.95;
  /* capsule */
  border: 1px solid #D4D4D4;
  box-sizing: border-box;
  box-shadow: 0px 6px 24px rgba(0, 0, 0, 0.12);
  border-radius: 10px;
}

.KU_Title{
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 48px;
  line-height: 56px;
  display: flex;
  align-items: center;
  letter-spacing: 0.05em;

  color: #000000;

  text-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
}

@media screen and (min-width: 768px) and (max-width: 1344px) {
  .ku{
    width: 100%;
    padding: 0 88px;
    margin: 0;
  }

  .SearchInputDIV{
    width: calc(100% - 120px)
  }
}

@media screen and (max-width: 768px){
  .ku{
    width: 100%;
    padding: 0 32px;
    margin: 0;
  }

  .SearchInputDIV{
    width: calc(100% - 120px)
  }
}

.KU_Detail_Aim{
  position: relative;
  display: block;
  width: 10px;
  height: 10px;
  margin-top: -96px;
  background: transparent;
}
</style>
