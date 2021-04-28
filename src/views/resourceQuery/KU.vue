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

    <!-- header -->

    <el-row justify="start" type="flex">
      <el-col style="padding-left: 5vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>知识单元检索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

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
      <el-card class="box-card left">
        <div class="el-notification__closeBtn el-icon-close" @click="closePanel()"></div>
        <div class="container">
          <div class="intro">
            <el-row type="flex" justify="start">
              <h4 style="color: #0a1612; font-weight: bold">知识单元简介</h4>
            </el-row>
            <el-row type="flex" justify="start" class="title">
              {{ node.name }}
            </el-row>
            <el-row type="flex" justify="start" class="content">
              <el-col>
                {{ (node.description || "").split("...")[0] }}
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
                <h4 style="color: #0a1612; float: left; font-weight: bold">知识关系</h4>
              </el-row>
              <el-tabs v-model="activeName" :stretch="true" :lazy="true" @click="handleSwitchTabs()" >
                <el-button type="text" class="zoom-in-btn" size="small" @click="handleFullScreen()">
                  <i class="el-icon-full-screen"></i>
                </el-button>
                <el-tab-pane :key="Math.random()" label="前驱后继" name="presuc" id="presuc_container" class="svg-container">
                  <pre-suc
                  :node="node"
                  :neighbors_groups="neighbors_groups"
                  :inward_arrow="inward_arrow"
                  :outward_arrow="outward_arrow"
                  @search="search"
                  />
                </el-tab-pane>
                <el-tab-pane :key="Math.random()" label="共同学习" name="costudy" id="costudy_container" class="svg-container">
                  <co-study
                    :node="node"
                    :neighbors_groups="neighbors_groups"
                    :undirected_len="undirected_len"
                    @search="search"
                    />
                </el-tab-pane>
                <el-tab-pane :key="Math.random()" label="层级关系" name="tree" id="tree_container" class="svg-container">
                  <tree
                    :node="node"
                    :neighbors_hierarchy="neighbors_hierarchy"
                    :superior_layer="superior_layer"
                    :inferior_layer="inferior_layer"
                    />
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>

      </el-card>

      <el-col>
        <div class="graph">
          <el-row>
            <el-col :span="6"><p style="color: #409EFD; font-size: 30px; line-height: 15px; padding-top: 5px">●</p><p>知识点</p></el-col>
            <el-col :span="6"><p style="color: #EDB664; font-size: 30px; line-height: 15px; padding-top: 5px">●</p><p>前驱后继</p></el-col>
            <el-col :span="6"><p style="color: #9ECCAB; font-size: 30px; line-height: 15px; padding-top: 5px">●</p><p>共同学习</p></el-col>
            <el-col :span="6"><p style="color: #F1939C; font-size: 30px; line-height: 15px; padding-top: 5px">●</p><p>层级关系</p></el-col>
          </el-row>
          <Graph
            :node="node"
            :neighbors_groups="neighbors_groups"
            :neighbors_hierarchy="neighbors_hierarchy"
            :inward_arrow="inward_arrow"
            :outward_arrow="outward_arrow"
            :superior_layer="superior_layer"
            :inferior_layer="inferior_layer"
            :selected_type="checkList"
            @Research="Research"
          ></Graph>
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
import Tree from "./components/Tree.vue";
import Graph from "./components/Graph.vue";
import ComplexInput from "../../common/components/ComplexInput.vue";
import screenfull from 'screenfull'

export default {
  components: {
    Graph,
    ComplexInput,PreSuc,CoStudy,Tree },
  name: "KU",
  data() {
    return {
      activeName:"presuc",
      ku_name: "",
      ku_type: "kp2.0",
      fullEl: document.getElementById(this.activeName+'_container'),
      isFullscreen: false,
      // 节点。邻居节点，层级结构
      node: {},
      neighbors_groups: {},
      neighbors_hierarchy : [],
      sour: "rjb_new",
      sourceLabel: ["百科", "人教版"],
      checkList: ["前驱后继", "共同学习", "层级结构"],
      // 前驱后继，共同学习，向内箭头，向外箭头
      directed_len: "",
      // undirected_len: "",
      undirected_len: 0,
      inward_arrow: 0,
      outward_arrow: 0,
      // 上级层，下级层
      superior_layer: 0,
      inferior_layer: 0,
      layerLength: "",
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
    this.root_view = sessionStorage.user === "root";
    console.log(this.root_view);
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
    openPanel() {
      $('.box-card.left').animate({
        left: '0%',
        opacity: 1
      },'easeInOutExpo')
    },
    closePanel(){
      $('.box-card.left').animate({
        left: '-3%',
        opacity: 0
      }, 'easeInOutExpo')
    },
    handleSwitchTabs(){
      this.key1+=3
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
      // console.log(screenfull,screenfull);
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
          this.backendIP + "/api/ku",
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
            alert("输入知识点不存在！");
          } else {
            this.openPanel();
            this.initFullScreen();
            this.node = data.data.node;
            this.neighbors_groups = data.data.neighbors_groups;
            this.neighbors_hierarchy = data.data.neighbors_hierarchy;
            for(let i = 0; i < this.neighbors_hierarchy.length; i++){
              if(this.neighbors_hierarchy[i] == this.node.name){
                this.neighbors_hierarchy[i] = this.neighbors_hierarchy[i] + " "
              }
            }
            this.inward_arrow = data.data.pre_len;
            this.outward_arrow = data.data.suc_len;
            this.superior_layer = data.data.sup_len;
            this.inferior_layer = data.data.inf_len;
            this.loading = false;
          }
        });
      this.$http
        .post(
          this.backendIP + "/api/ku",
          {
            ku_name: this.ku_name,
            ku_type: this.ku_type,
            ku_edge_type: ["前驱后继", "共同学习", "层级结构"],
            system: this.knowledgeSystem
          },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.directed_len = "(" + (data.data.pre_len + data.data.suc_len) + ")";
          // this.undirected_len = "(" + data.data.undirected_len + ")";
          this.undirected_len =  data.data.undirected_len;
          this.layerLength = "(" + (data.data.sup_len + data.data.inf_len) + ")";
        });
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
<style  lang="scss" >
.tool-tip{
  position:absolute;
  width: 150px;
  max-height:200px;
  border-radius: 4px;
  background-color:rgba(248,251, 255, .7);
  border:solid 1px rgba(31,119,180,0.3);
  overflow-y: scroll;
}
.tool-tip p{
  margin: 6px;
  color:#303133;
  text-align: left;
  text-indent: 2em;
}
</style>
<style scoped lang="scss">
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
