/* eslint-disable camelcase */
<template>
  <div class="ku" style="margin-top: 5vh">
    <!-- header -->

    <el-row justify="start" type="flex">
      <el-col style="padding-left: 5vw;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>知识单元检索</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row>
      <form @submit.prevent="submit(ku_name)" style="margin-top: 20px; margin-left: 5vw;">
        <el-row type="flex" class="row-bg" justify="start" v-if="!complex_input_flag">
          <el-col :span="10">
            <el-input v-model="ku_name" placeholder="请输入内容"></el-input>
          </el-col>
          <el-col :span="3" :offset="1">
            <el-button type="primary"  @click="Open_CI()">切换多格式输入</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary"  value="提交" @click="submit(ku_name)" :disabled="knowledgeSystem == ''">检索</el-button>
          </el-col>
          <el-col :span="4" :offset="3">
            <el-select v-model="knowledgeSystem" placeholder="请选择知识体系" v-if="false">
              <el-option
                v-for="item in KS_List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row type="flex" class="row-bg" justify="start" v-if="complex_input_flag">
          <el-col :span="18" :offset="1">
            <ComplexInput @Update_CI="UCI" @Update_Image="UCII" ref="CI" @Full_Change="ComplexInputFullChange"></ComplexInput>
          </el-col>
          <el-col :span="3" type="flex" justify="center">
            <el-select v-model="knowledgeSystem" placeholder="请选择知识体系" style="margin-top: 6vh" v-if="false">
              <el-option
                v-for="item in KS_List"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary"  @click="Close_CI()" style="margin-top: 7vh">切换简单输入</el-button>
            <el-button type="primary" value="提交" @click="submit(ku_name)"  style="margin-top: 3vh" :disabled="knowledgeSystem == ''">检索</el-button>        
          </el-col>
        </el-row>
        <!-- <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="22">
            <el-input v-model="ku_name" placeholder="请输入内容"></el-input>
          </el-col>
          <el-button type="submit" value="提交" @click="submit(ku_name)"
            >检索</el-button
          >
        </el-row> -->
      </form>
    </el-row>
    <!-- main -->
    <el-row v-loading="loading" style="padding-top: 5vh; margin-left: 5vw; margin-right: 5vw" v-if="FullChange">
      <el-col :span="9">
        <div class="result" style="background: #F8FBFF">
          <el-row type="flex" justify="start">
            <h4 style="color: #0a1612; font-weight: bold">知识单元简介</h4>
          </el-row>
          <el-row type="flex" justify="start" class="title">
            {{ node.name }}
            <!-- {{ node.type }} -->
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
          <el-divider></el-divider>
          <el-row type="flex" justify="start">
            <el-col :span="24">
              <el-row>
                <h4 style="color: #0a1612; float: left; font-weight: bold">知识关系</h4>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                ref="ss"
                style="height: 200px; margin-top: -10px; margin-left: 10px;"
                id="tabs"
              >
                <el-tab-pane
                  label="人教版新"
                  name="rjb_new"
                  id="rjb_new"
                  ref="rjb_new"
                >
                  <el-row type="flex" justufy="start" :gutter="40">
                    <el-checkbox-group v-model="checkList" id="checkbox">
                      <el-col :span="4">
                        <el-checkbox label="前驱后继">前驱后继</el-checkbox>
                      </el-col>
                      <el-col :span="1">
                        <h6>{{ directed_len }}</h6>
                      </el-col>
                      <el-col :span="4">
                        <el-checkbox label="共同学习">共同学习</el-checkbox>
                      </el-col>
                      <el-col :span="1">
                        <h6>{{ undirected_len }}</h6>
                      </el-col>
                      <el-col :span="4">
                        <el-checkbox label="层级关系">层级关系</el-checkbox>
                      </el-col>
                      <el-col :span="1">
                        <h6>{{ '(' + 0 + ')' }}</h6>
                      </el-col>
                    </el-checkbox-group>
                  </el-row>
                  <el-row
                    v-for="(entities, group, group_index) in neighbors_groups"
                    :key="group_index"
                    style="background: #F8FBFF"
                  >
                    <el-row
                      v-if="group == 'kp2.0'"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="300"
                        trigger="hover"
                        style="background: #F8FBFF"
                      >
                        <el-tag size="mini">{{
                          (entity.annotation || "").split(";")[0].split("-")[1]
                        }}</el-tag>
                        <el-tag size="mini">{{
                          (entity.annotation || "").split(";")[1].split("-")[1]
                        }}</el-tag>
                        <el-tag size="mini">{{
                          (entity.annotation || "").split(";")[2].split("-")[1]
                        }}</el-tag>
                        <el-tag size="mini">{{
                          (entity.annotation || "").split(";")[3].split("-")[1]
                        }}</el-tag>
                        <h6>
                          {{
                            entity.annotation
                              .split("description")[1]
                              .split("...")[0]
                          }}
                        </h6>
                        <el-tag style="background: #F8FBFF; color: #4FA5FD; border: 1px solid #4FA5FD; margin: 0.35vw 0.5vw" slot="reference" @click="submit(entity.name)">{{
                          entity.name
                        }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
                <!-- 尝试加考试院数据 -->
                <el-tab-pane
                  v-if="root_view"
                  label="考试院"
                  name="root_data"
                  id="root_data"
                  ref="root_data"
                >
                  <el-row
                    v-for="(entities, group, group_index) in neighbors_groups"
                    :key="group_index"
                  >
                    <el-row
                      v-if="group == 'kp2.0'"
                      class="label"
                      type="flex"
                      justify="start"
                    >
                      <el-popover
                        placement="top-start"
                        v-for="(entity, index) in entities"
                        :key="index"
                        :title="entity.name"
                        width="200"
                        trigger="hover"
                        :content="entity.annotation"
                      >
                        <el-tag slot="reference">{{ entity.name }}</el-tag>
                      </el-popover>
                    </el-row>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="15">
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
            :inward_arrow="inward_arrow"
            :outward_arrow="outward_arrow"
            :selected_type="checkList"
            @Research="Research"
          ></Graph>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Graph from "./Graph.vue";
import ComplexInput from "./ComplexInput.vue";
export default {
  components: { Graph, ComplexInput },
  name: "KU",
  data() {
    return {
      ku_name: "",
      ku_type: "kp2.0",
      node: {},
      neighbors_groups: {},
      sour: "rjb_new",
      sourceLabel: ["百科", "人教版"],
      checkList: ["前驱后继", "共同学习", "层级关系"],
      directed_len: "",
      undirected_len: "",
      inward_arrow: 0,
      outward_arrow: 0,
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
      knowledgeSystem: ""
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
  watch: {
    sour() {
      this.submit(this.ku_name);
    },
    checkList() {
      this.submit(this.ku_name);
    }
  },
  methods: {
    ToTop(){
      window.scrollTo(0,0);
    },
    Research(val){
      console.log(val);
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
            this.node = data.data.node;
            this.neighbors_groups = data.data.neighbors_groups;
            this.inward_arrow = data.data.pre_len;
            this.outward_arrow = data.data.suc_len;
            this.loading = false;
          }
        });
      this.$http
        .post(
          this.backendIP + "/api/ku",
          {
            ku_name: this.ku_name,
            ku_type: this.ku_type,
            ku_edge_type: ["前驱后继", "共同学习", "层级关系"],
            system: this.knowledgeSystem
          },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.directed_len = "(" + (data.data.pre_len + data.data.suc_len) + ")";
          this.undirected_len = "(" + data.data.undirected_len + ")";
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

<style scoped lang="scss">
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
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 850px;
  background-color: #fff;
  // border-right: 14px solid #fff;
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
