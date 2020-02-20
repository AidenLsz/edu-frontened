<template>
  <div class="estimate">
    <!-- header -->
    <el-row>
      <el-col :span="6">
        <div class="logo">
          <el-dropdown @command="handleCommand">
            <el-button ref = "attribute">
            试题属性（默认自动检测）
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="默认检测  ">默认检测</el-dropdown-item>
              <el-dropdown-item command="数学  ">数学</el-dropdown-item>
              <el-dropdown-item command="英语  ">英语</el-dropdown-item>  
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-col>
      <el-col :span="14">
        <form @submit.prevent="submit" style="margin-top: 20px;">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="22">
              <el-input
                type="textarea"
                :rows="2"
                v-model="estimate_text"
                placeholder="请输入内容"
              ></el-input>
            </el-col>
            <el-button type="submit" value="提交" @click="submit"
              >检索</el-button
            >
          </el-row>
        </form>
      </el-col>
    </el-row>
    <!-- header -->
    <!-- main -->
    <el-row>
      <el-col :span="7">
        <div class="result">
          <el-row type="flex" justify="start">
            <h5 style="color: #ff9900;">难度预估结果</h5>
          </el-row>
          <el-tag>{{ estimate_value }}</el-tag>
        </div>
      </el-col>
      <el-col :span="17">
        <div class="graph">
          <!-- <button class="reset">Reset View</button> -->
          <svg width="930" height="760"></svg>
        </div>
      </el-col>
    </el-row>
    <!-- main -->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "estimate",
  data() {
    return {
      estimate_text: "",
      estimate_value: 1
    };
  },
  methods: {
    submit() {
      this.$http
        .post(
          //改
          // this.backendIP + "/api/surface",
          // { exercise_text: this.exercise_text, entity_type: this.entity_type },
          // { emulateJSON: true }
        )
        .then(function(data) {
          //加
      });    
    },
    handleCommand(command) {
        this.$refs.attribute.$el.innerText = command;
    }
  }
};
</script>

<style scoped lang="scss">
.estimate {
  background: url("/static/sub_bg.png") no-repeat;
}
.logo {
  margin-top: 28px;
  margin-left: 50px;
}
.result {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 780px;
  background-color: #fff;
  margin-left: 20px;
  border-right: 14px solid #fff;
}

.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #0a1612;
}

.el-tag {
  margin-left: 10px;
}

.el-col {
  border-radius: 4px;
}

.graph {
  border: 1px solid #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
/*  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;*/
  height: 780px;
  background-color: #fff;
  margin-right: 20px;
}
</style>

<style type="text/css">
 .el-tabs__item {
    color: #0a1612!important;
    font-weight: 900!important;
} 
 .el-tabs__item.is-active {
    background-color: #0a1612!important;
    color: #fff!important;
    font-weight: 900!important;
} 
.el-button {
  background-color: #ffd700!important;
  color: #1a2930!important;
  border-color: #ffd700!important;
}
.el-button:hover {
  background-color: #ff9900!important;
  color: #fff!important;
  border-color: #0a1612!important;
}
.el-button:focus {
  outline: none!important;
}
.el-tag {
  background-color: #fff!important;
  color: #000!important;
  border-color: #c5c1c0!important;
}
</style>

<style>
.links path {
  fill: none;
  stroke: #999;
  stroke-opacity: 0.6;
}
marker {
  fill: #999;
  opacity: 0.6;
}
.nodes circle {
  stroke: #fff;
  stroke-width: 3px;
  r: 25px;
}
text {
  pointer-events: none;
}
image {
  pointer-events: none;
}
.d3-tip {
    line-height: 1;
    width: 20%;
    padding: 6px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 4px;
    font-size: 10px;
}
/* Creates a small triangle extender for the tooltip */
.d3-tip:after {
    box-sizing: border-box;
    display: inline;
    font-size: 10px;
    width: 100%;
    line-height: 1;
    color: rgba(0, 0, 0, 0.8);
    content: "\25BC";
    position: absolute;
    text-align: center;
  } 
/* Style northward tooltips specifically */
.d3-tip.n:after {
    margin: -2px 0 0 0;
    top: 100%;
    left: 0;
  } 
</style>

