<template>
  <div id="check_exercise">
    <el-row style="width: 1100px;">
      <el-col :span="5">
        <el-select v-model="value" placeholder="请选择" size="medium">
          <el-option
            v-for="item in attribute"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" style="margin-left:-12px;">
        <el-input
          size="medium"
          v-model="user_check"
          placeholder="检验人"
        ></el-input>
      </el-col>
      <el-col :span="5" style="margin-left:5px;">
        <el-input
          size="medium"
          v-model="ex_title"
          placeholder="题目名"
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-date-picker
          size="medium"
          v-model="select_data"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="4" style="margin-left:-5%;">
        <el-button type="primary" size="medium">查找</el-button>
      </el-col>
    </el-row>
    <div style="margin-top: 30px;"></div>
    <el-row>
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="" label="题面" width="180"></el-table-column>
        <el-table-column prop="" label="校验人" width="180"></el-table-column>
        <el-table-column prop="" label="时间"> </el-table-column>
      </el-table>
    </el-row>
    <el-row type="flex" justify="end">
      <el-button @click="affirm">确认</el-button>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: "",
      content: "",
      change_content: "",
      attribute: [
        { value: "1", label: "知识点" },
        { value: "2", label: "难度" },
        { value: "3", label: "全部" }
      ],
      value: "全部",
      user_check: "",
      ex_title: "",
      select_data: "",
      tableData: []
    };
  },
  methods: {
    // 导入试题
    affirm() {
      this.$http
        .post(
          this.backendIP + "/api/import",
          {
            content: this.content,
            change_content: this.change_content,
            username: this.username
          },
          { emulateJSON: true }
        )
        .then(function() {});
    }
  }
};
</script>
<style scoped>
#check_exercise {
  padding: 2% 2% 2% 2%;
}
</style>
