<template>
  <div class="qp-body-container">
    <el-card class="qp-right">
      <ques-paired-preview :prefix="prefix" :figures="figures" :question="leftQuestion"/>
    </el-card>
    <el-card class="qp-left">
      <ques-paired-preview :prefix="prefix" :figures="figures" :question="rightQuestion"/>
    </el-card>
  </div>
</template>

<script>
import QuesPairedPreview from './QuesPairedPreview';

export default {
  name: 'QuesPairedBody',
  components: {
    QuesPairedPreview,
  },
  mounted() {
    console.log(this.rightQuestion)
  },
  props: {
    rightQuestion: Object,
    leftQuestion: Object,
    figures: Array,
    prefix: String,
  }
}
</script>

<style scoped lang="scss">
  .qp-body-container {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    margin-bottom: 6rem;
  }

  .qp-left,
  .qp-right {
    width: 49%;
    min-height: 400px;
  }
</style>
