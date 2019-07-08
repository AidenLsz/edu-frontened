<template>
  <div class="exercise">
    <h1>
      试题检索
    </h1>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="知识单元识别" name="first">
        <h2>知识单元识别</h2>
      </el-tab-pane>
      <el-tab-pane label="相似题检索" name="second" disabled="true">
        <h2>相似题检索</h2>
      </el-tab-pane>
    </el-tabs>
    <form @submit.prevent="submit">
      <el-row type="flex" class="row-bg" justify="center">
        <el-input v-model="exercise_text" placeholder="请输入内容"></el-input>
        <el-button type="submit" value="提交" @click="submit">检索</el-button>
      </el-row>
    </form>
    <el-row>
      <el-col :span="12">
        <div class="result">
          <el-row type="flex" justify="start">
            <h4>试题文本</h4>
          </el-row>
          <el-row type="flex" justify="start" class="title">
            {{ raw_text }}
          </el-row>
          <el-divider></el-divider>
          <el-row
            v-for="(entities, group, group_index) in entities_groups"
            :key="group_index"
          >
            <el-row type="flex" justify="start"
              ><h4>{{ group }}</h4></el-row
            >
            <el-row type="flex" justify="start">
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
            <el-row>
              <el-divider></el-divider>
            </el-row>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">右边</el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "KU",
  data() {
    return {
      activeName: "first",
      exercise_text: "",
      raw_text: "",
      entities_groups: {}
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    submit() {
      this.$http
        .post(
          this.backendIP + "/api/surface",
          { exercise_text: this.exercise_text },
          { emulateJSON: true }
        )
        .then(function(data) {
          this.raw_text = data.data.raw_text;
          this.entities_groups = data.data.entities_groups;
        });
    }
  }
};
</script>

<style scoped lang="scss">
.result {
  border: 1px solid #a6a9ad;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
  height: 600px;
}

.el-row {
  margin-bottom: 20px;
  & :last-child {
    margin-bottom: 0;
  }
}
.title {
  text-align: left;
}

.el-tag {
  margin-left: 10px;
}

.el-col {
  border-radius: 4px;
}
</style>
