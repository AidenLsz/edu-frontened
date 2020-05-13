/* eslint-disable camelcase */
<template>
  <div class="ku">
    <!-- header -->
    <el-row>
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_ku.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <form @submit.prevent="submit(ku_name)" style="margin-top: 20px;">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="22">
              <el-input v-model="ku_name" placeholder="请输入内容"></el-input>
            </el-col>
            <el-button type="submit" value="提交" @click="submit(ku_name)"
              >检索</el-button
            >
          </el-row>
        </form>
      </el-col>
    </el-row>
    <!-- main -->
    <el-row v-loading="loading">
      <el-col :span="7">
        <div class="result">
          <el-row type="flex" justify="start">
            <h5 style="color: #0a1612;">知识单元简介</h5>
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
                more>>
              </a>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row type="flex" justify="start">
            <el-col :span="24">
              <el-row>
                <h5 style="color: #0a1612; float: left;">知识关系</h5>
              </el-row>
              <el-tabs
                value="rjb_new"
                @tab-click="dataSource"
                type="card"
                ref="ss"
                style="height: 200px; margin-top: -10px; margin-left: 10px;"
              >
                <el-tab-pane
                  label="人教版新"
                  name="rjb_new"
                  id="rjb_new"
                  ref="rjb_new"
                >
                  <el-row type="flex" justufy="start" :gutter="40">
                    <el-checkbox-group v-model="checkList">
                      <el-col :span="6">
                        <el-checkbox label="前驱后继">前驱后继</el-checkbox>
                      </el-col>
                      <el-col :span="1">
                        <h6>{{ directed_len }}</h6>
                      </el-col>
                      <el-col :span="6">
                        <el-checkbox label="共同学习">共同学习</el-checkbox>
                      </el-col>
                      <el-col :span="1">
                        <h6>{{ undirected_len }}</h6>
                      </el-col>
                    </el-checkbox-group>
                  </el-row>
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
                        width="300"
                        trigger="hover"
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
                        <el-tag slot="reference" @click="submit(entity.name)">{{
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
      <el-col :span="17">
        <div class="graph">
          <Graph
            :node="node"
            :neighbors_groups="neighbors_groups"
            :inward_arrow="inward_arrow"
            :outward_arrow="outward_arrow"
          ></Graph>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Graph from "./Graph.vue";
export default {
  components: { Graph },
  name: "KU",
  data() {
    return {
      ku_name: "",
      ku_type: "kp2.0",
      node: {},
      neighbors_groups: {},
      sour: "rjb_new",
      sourceLabel: ["百科", "人教版"],
      checkList: ["前驱后继", "共同学习"],
      directed_len: "",
      undirected_len: "",
      inward_arrow: 0,
      outward_arrow: 0,
      root_view: false,
      loading: false,
      url: ""
    };
  },
  mounted() {
    this.root_view = sessionStorage.user === "root";
    console.log(this.root_view);
    if (this.$route.params.name) {
      this.ku_name = this.$route.params.name;
      this.submit(this.ku_name);
    }
  },
  watch: {
    sour(val) {
      this.submit(this.ku_name);
    },
    checkList(val) {
      this.submit(this.ku_name);
    }
  },
  methods: {
    dataSource(tab, event) {
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
    submit(name) {
      if (this.ku_name.length === 0) {
        return;
      }
      if (name !== undefined) this.ku_name = name;
      this.url =
        "https://baike.baidu.com/search/word?word=" + encodeURI(this.ku_name);
      this.loading = true;
      this.$http
        .post(
          this.backendIP + "/api/ku",
          {
            ku_name: this.ku_name,
            ku_type: this.ku_type,
            ku_edge_type: this.checkList
          },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.node = data.data.node;
          this.neighbors_groups = data.data.neighbors_groups;
          this.inward_arrow = data.data.pre_len;
          this.outward_arrow = data.data.suc_len;
          this.loading = false;
        });
      this.$http
        .post(
          this.backendIP + "/api/ku",
          {
            ku_name: this.ku_name,
            ku_type: this.ku_type,
            ku_edge_type: ["前驱后继", "共同学习"]
          },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.directed_len = "(" + data.data.pre_len + data.data.suc_len + ")";
          this.undirected_len = "(" + data.data.undirected_len + ")";
        });
    }
  }
};
</script>

<style scoped lang="scss">
.ku {
  /*background-color: #0a1612;*/
  background: url("/static/sub_bg.png") repeat;
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
  height: 780px;
  background-color: #fff;
  margin-left: 20px;
  border-right: 14px solid #fff;
}
.graph {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  height: 780px;
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

<style type="text/css">
.el-tabs__item {
  color: #0a1612 !important;
  font-weight: 900 !important;
}
.el-tabs__item.is-active {
  background-color: #0a1612 !important;
  color: #fff !important;
  font-weight: 900 !important;
}
.el-button {
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
}
.el-tag {
  background-color: #fff !important;
  color: #000 !important;
  border-color: #c5c1c0 !important;
}
</style>
