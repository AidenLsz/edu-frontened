<template>
  <div id="import_exercise">
    <el-row>
      <el-input
        type="textarea"
        placeholder="请录入习题"
        v-model="textarea"
        maxlength="30"
        show-word-limit
      >
      </el-input>
    </el-row>
    <div style="margin:20px 0px;"></div>
    <el-row type="flex" justify="start">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-row>
    <div style="margin:20px 0px;"></div>
    <el-row type="flex" justify="end">
      <el-button @click="affirm">确认</el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textarea: "",
      options: [
        {
          value: "选项1",
          label: "知识单元"
        },
        {
          value: "选项2",
          label: "知识考点"
        },
        {
          value: "选项3",
          label: "知识领域"
        }
      ],
      value: ""
    };
  },
  methods: {
    affirm() {}
  }
};
</script>
<style scoped>
#import_exercise {
  padding: 5% 5% 5% 5%;
}
</style>
