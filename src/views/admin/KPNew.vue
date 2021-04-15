<template>
  <div>
    <el-row>
      <el-col :span="21">
        <fieldManager src="kp2.0"></fieldManager>
      </el-col>
      <el-col :span="3">
        <InsertOne collection="node_copy" field="kp2.0"></InsertOne>
      </el-col>
    </el-row>
    <ShowNode src="kp2.0" field="kp2.0"></ShowNode>
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
