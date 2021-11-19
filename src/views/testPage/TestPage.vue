<template>
  <div style="margin-top: 2vh;">
    <el-dialog 
      title="1" 
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :visible.sync="Dialog1">
      <el-dialog 
        title="2" 
        :modal='false'
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :visible.sync="Dialog2">
        <el-button type="" @click="Dialog2 = false">关闭2</el-button>
      </el-dialog>
      <el-button type="" @click="Dialog2 = true">打开2</el-button>
    </el-dialog>
    <el-button type="" @click="Dialog1 = true">打开1</el-button>
  </div>
</template>
<script>

export default {
  name: 'ScreenShot',
  props: {
  },
  components:{
    // Mathdown
  },
  data() {
    return {
      // 知识点
      Dialog1: false,
      Dialog2: false
    }
  },
  watch: {

  },
  mounted() {

  },
  methods: {

  },
}
</script>
<style lang="scss" scoped>

</style>