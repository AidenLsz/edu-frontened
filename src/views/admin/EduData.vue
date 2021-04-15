<template>
  <div id="eduData">
    <el-row style="width: 1100px;">
      <el-col :span="4">
        <el-select
          v-model="data_type"
          placeholder="请选择数据类型"
          size="medium"
        >
          <el-option
            v-for="item in attribute"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="medium" @click="search()"
          >查找</el-button
        >
      </el-col>
    </el-row>
    <div style="margin-top: 30px;"></div>
    <el-row>
      <fieldManager v-if="data_type" :src="field"></fieldManager>
      <ShowNode v-if="data_type" :src="field" :field="field"></ShowNode>
      <InsertOne
        style="float:left;"
        v-if="data_type"
        :collection="collection"
        :field="field"
      ></InsertOne>
    </el-row>
  </div>
</template>
<script>
import fieldManager from "./fieldManager.vue";
import InsertOne from "./InsertOne.vue";
import ShowNode from "./ShowNode.vue";
export default {
  components: { fieldManager, ShowNode, InsertOne },
  data() {
    return {
      username: "",
      content: "",
      change_content: "",
      attribute: [
        { value: "知识单元", label: "知识单元" },
        { value: "知识关系", label: "知识关系" },
        { value: "知识结构", label: "知识结构（习题）" }
      ],
      data_type: "",
      user_check: "",
      ex_title: "",
      select_data: "",
      collection: "",
      field: ""
    };
  },
  methods: {
    search() {
      if (this.data_type === "知识单元") {
        this.field = "concpet";
        this.collection = "node_type";
      }
      if (this.data_type === "知识关系") {
        this.field = "concpet";
        this.collection = "node_type";
      }
      if (this.data_type === "知识结构") {
        this.field = "concpet";
        this.collection = "node_type";
      }
    }
  }
};
</script>
<style scoped>
#eduData {
  padding: 2% 2% 2% 2%;
}
</style>
