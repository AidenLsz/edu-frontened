<template>
  <div>
    <el-row>
      <el-col :span="21">
        <fieldManager src="concept"></fieldManager>
      </el-col>
      <el-col :span="3">
        <InsertOne collection="node_copy" field="concept"></InsertOne>
      </el-col>
    </el-row>
    <ShowNode src="concept" field="concept"></ShowNode>
  </div>
</template>
<script>
import fieldManager from "./fieldManager.vue";
import InsertOne from "./InsertOne.vue";
import ShowNode from "./ShowNode.vue";
export default {
  components: { fieldManager, ShowNode, InsertOne }
};
</script>
