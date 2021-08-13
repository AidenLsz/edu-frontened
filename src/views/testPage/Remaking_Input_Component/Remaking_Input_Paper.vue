<template>
  <div style="margin-top: 5vh">
    <el-row justify="start" type="flex" style="margin-left: 5vw">
      <el-col :span="6">
        <el-row type="flex" justify="start" style="height: 40px; line-height: 40px; padding-top: 13px">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>资源录入</el-breadcrumb-item>
                <el-breadcrumb-item>试卷资源</el-breadcrumb-item>
            </el-breadcrumb>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-row type="flex" justify="center" @click.native="toSingle()" class="toSingle">
            <span>切换至单题页面</span>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "RemakingInputSingle",
  data() {
    return {

    };
  },
  methods:{
      toSingle(){
        this.$router.push({path: "/remakeInputSingle"})
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.toSingle{
    height: 40px; 
    line-height: 40px;
    width: 10vw; 
    background: #FFE37F;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
}
.toSingle:hover{ 
    background: #FFF0A0;
    color: #888;
}
</style>
