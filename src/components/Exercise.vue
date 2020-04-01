<template>
  <div class="exercise">
    <!-- header -->
    <el-row>
      <el-col :span="6">
        <div class="logo">
          <img src="../assets/title_exercise.png" alt="logo" />
        </div>
      </el-col>
      <el-col :span="14">
        <form @submit.prevent="submit" style="margin-top: 20px;">
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="22">
              <el-input
                v-model="exercise_text"
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
    <!-- main -->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "exercise",
  data() {
    return {
      exercise_text: "",
      raw_text: "",
      entities_groups: {},
      neighbors_groups: {},
      entity_type: "concept",
      graph: {},
      sour: "",
      checkList: []
    };
  },
  watch:{
  },
  methods: {
    dataSource(tab, event) {
    },
    submit() {
      this.$http
        .post(
          this.backendIP + "/api/surface",
          { exercise_text: this.exercise_text, entity_type: this.entity_type },
          { emulateJSON: true }
        )
        .then(function(data) {
          console.log(data.data);
          this.raw_text = data.data.raw_text;
          this.entities_groups = data.data.entities_groups;
          this.graph = data.data.graph;
      });    
    }
  }
};
</script>

<style scoped lang="scss">
.exercise {
  background: url("/static/sub_bg.png") no-repeat;
}
.logo {
  margin-top: 15px;
  margin-left: 20px;
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
.el-button:focus {
  outline: none!important;
}
.el-tag {
  background-color: #fff!important;
  color: #000!important;
  border-color: #c5c1c0!important;
}
</style>

