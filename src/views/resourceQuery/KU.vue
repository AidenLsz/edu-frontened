/* eslint-disable camelcase */
<template>
  <div class="ku" style="margin-top: 5vh">
    <el-dialog
        :visible.sync="simpleInput"
        title="LUNA输入助手"
        width="65%"
        :modal-append-to-body="false"
        :close-on-click-modal="false">
      <ComplexInput @Update_CI="UCI" @Update_Image="UCII" :Get_Out_Content="content"></ComplexInput>
      <el-button type="success" plain @click="simpleInput = false">完成输入</el-button>
    </el-dialog>

    <el-row justify="start" type="flex">
      <el-col style="padding-left: 5vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            知识单元检索
            <span @click="openInstructionDialog" style="cursor:pointer;">
              <i class="el-icon-question"></i>
            </span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <instruction ref="instruction"/>
    <!-- 搜索框行 -->
    <el-row type="flex" justify="start" class="SearchArea">
        <el-col :span="20">
          <el-input class="SearchInput" v-model="ku_name" type="text" @keyup.enter.native="submit(ku_name)">

          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px; color: black;" size="small" v-if="content != ''" @click="content = ''">
            <i class="el-icon-close"></i>
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical"></el-divider>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 18px; color: black; display: block; margin-left: -5px"  size="small" @click="simpleInput = true">
            ∑
          </el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="text" style="font-size: 20px; display: block; margin-left: -8px;" size="small" @click="submit(ku_name)">
            <i class="el-icon-search"></i>
          </el-button>
        </el-col>
    </el-row>

    <el-row class="panel-body" v-loading="loading" style="" v-if="FullChange">
      <div class="tab panel-btn" id="openBtn" @click="openPanel()">
            <div>知识卡片</div>
          <div class="arrow"></div>
      </div>
      <el-card class="box-card left">
        <div class="panel-btn" id="closeBtn" @click="closePanel()">
          <i class="el-icon-d-arrow-left"></i>
        </div>
        <div class="container">
          <div class="intro">
            <!-- <el-row type="flex" justify="start">
              <h4 style="color: #0a1612; font-weight: bold">知识单元简介</h4>
            </el-row> -->
            <el-row type="flex" justify="start" class="title">
              {{ data.nodes?data.nodes.node.name:"" }}
            </el-row>
            <el-row type="flex" justify="start" class="content">
              <el-col>
                {{ (data.nodes?data.nodes.node.description:"").split("...")[0] }}
                <a
                  v-if="ku_name.length > 0"
                  v-bind:href="url"
                  target="_blank"
                  :underline="false"
                >
                </a>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <el-row class="detail">
            <el-col>
              <el-row>
                <h4 style="color: #0a1612; float: left; font-weight: bold">知识关系
                  <el-tooltip  class="item" effect="dark" placement="right">
                    <div class="instruction" slot="content">
                      <h5>前驱后继</h5>
                      <p>
                        前驱节点是学习当前节点的必要条件，掌握了前驱节点才能理解当前知识节点。掌握当前知识节点是掌握后继节点的必要条件。
                      </p>
                      <h5>共同学习</h5>
                      <p>
                        共同学习知识节点和当前知识节点有相互促进关系，掌握了共同学习知识节点可以更好地理解当前知识节点。
                      </p>
                      <h5>层级关系</h5>
                      <p>
                        树状节点图中，上级节点包括当前知识节点，当前知识节点包括下级节点。
                      </p>
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </h4>
              </el-row>
              <el-tabs v-model="activeName" :stretch="true" :lazy="true" @click.native="handleSwitchTabs()" >
                <el-button type="text" class="zoom-in-btn" size="small" @click="handleFullScreen()">
                  <i class="el-icon-full-screen"></i>
                </el-button>
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
            </el-col>
          </el-row>
        </div>

      </el-card>

      <el-col>
        <div class="graph" id="graph_container">
          <Graph
            ref="graph"
            @search="search"
            />
            <!-- :node="node" -->
            <!-- :neighbors_groups="neighbors_groups"
            :neighbors_hierarchy="neighbors_hierarchy"
            :inward_arrow="inward_arrow"
            :outward_arrow="outward_arrow"
            :undirected_len="undirected_len"
            :superior_layer="superior_layer"
            :inferior_layer="inferior_layer"
            :selected_type="checkList" -->
        </div>
      </el-col>
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
import ComplexInput from "../../common/components/ComplexInput.vue";
import screenfull from 'screenfull'
import {dataDict} from './components/utils.js'
import {Message } from 'element-ui'
import Instruction from './components/InstructionKU.vue'

export default {
  components: {
    Graph,
    ComplexInput,
    PreSuc,
    CoStudy,
    Hierarchy,
    Instruction
  },
  name: "KU",
  data() {
    return {
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
      FullChange: true,
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
    };
  },
  mounted() {
    $('.panel-btn').hide()
    this.root_view = sessionStorage.user === "root";
    // console.log(this.root_view);
    if (this.$route.params.name) {
      this.ku_name = this.$route.params.name;
      this.submit(this.ku_name);
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
    openInstructionDialog(){
      this.$refs.instruction.openDialog();
    },
    openPanel() {
      $('.box-card.left').animate({
        left: '0%',
        opacity: 1
      },'easeInOutExpo')
      $('#openBtn').hide()
      $('#closeBtn').show()

      // $('.box-card.left').css('display','block')
    },
    closePanel(){
      $('.box-card.left').animate({
        left: '-50%',
        opacity: 0,
      }, 'easeInOutExpo')
      $('#openBtn').show()
      $('#closeBtn').hide()
      // setTimeout(function(){ $('.box-card.left').css('display','none') }, 1000);
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
    Research(val){
      this.submit(val);
    },
    search(val){
      this.submit(val);
    },
    ComplexInputFullChange(val){
      if(val){
        this.FullChange = false;
      }
      else{
        this.FullChange = true;
      }
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
      if (this.ku_name.length === 0) {
        return;
      }
      if (name !== undefined) this.ku_name = name;
      if (ks !== undefined) this.knowledgeSystem = ks;
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
          if (data.data.node === null) {
            this.loading = false;
            Message({
              message: '查询不到该知识点',
              type: 'error',
              duration: 5 * 1000
            })
          } else {
            this.openPanel();
            this.initFullScreen();
            this.data=data.data
            this.handleSwitchTabs()
            this.drawGraph()
            this.loading = false;
          }
        })
        .catch(()=>{
          this.loading = false;
          Message({
            message: '查询不到该知识点',
            type: 'error',
            duration: 5 * 1000
          })
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
        mid_data=data.children[0]
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
    UCI(val){
      this.ku_name = val;
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
  top:-10px;
  right:0px;
  color:#ADADAD;
  font-size: 18px;
  display: block;
}
.ku {
  // background: url("../assets/sub_bg.png") repeat;
  background-size: 100%;
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

.panel-body{
  position:relative;
  padding-top: 5vh;
  margin-left: 5vw;
  margin-right: 5vw;
}

.box-card {
    position: absolute;
    margin-left: 15px;
    background: rgba(248,251, 255, .7);
    width: 37.5%;
    height: 850px;
    // z-index: 10;
    left: -3%;
    opacity:0;
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
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 800px;
}
.intro{
  max-height:40%;
}
.intro >.content{
  max-height:180px;
  overflow-y: scroll;
}
.detail{
  flex:1;
}
.detail .el-tab-pane{
  overflow-y: scroll;
}
.svg-container{
  height:380px;
}
.svg-container:fullscreen{
  height: 100%;
  background-color: #fff;
}
.graph {
  // position: relative;
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  height: 850px;
  background-color: #fff;
  margin-right: 20px;
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
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}
.content {
  text-align: left;
  text-indent: 2em;
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
#tabs /deep/ .el-tabs__item {
  background: #4FA5FD;;
  color: white;
  font-weight: 900;
  border-radius: 10px;
  border: 0px;
}
#tabs /deep/ .el-tabs__item.is-active {
  background: #4FA5FD;;
  color: white;
  font-weight: 900;
  border-radius: 10px;
}

#tabs /deep/ .el-tabs__nav.is-top{
  border: none;
}
#tabs /deep/ .el-tabs__header.is-top{
  border: none;
}

#checkbox /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
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
  line-height: 28px;
  height: 28px
}
.SearchInput /deep/ .el-input__inner {
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
  margin-left: 5vw;
  border: 1px solid Silver;
  width: 60%;
  border-radius: 18px;
  -webkit-box-shadow: 2px 4px 8px rgba(25, 25, 25, 0.15);
}
</style>
