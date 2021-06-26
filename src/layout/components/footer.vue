<template lang="html">
  <!-- footer -->
  <el-footer>
    <el-col class="footer-wrap" style="color: #9B9EA4; padding: 30px; font-size: 16px; background: #E4E7ED">
      <el-row type="flex" justify="center">
          <el-link :underline="false" style="color: #9B9EA4; font-size: 16px" @click="Router_Trans(0)">服务条款</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link :underline="false" style="color: #9B9EA4; font-size: 16px" @click="Router_Trans(1)">隐私政策</el-link>
          <el-divider direction="vertical"></el-divider>
          <el-link :underline="false" style="color: #9B9EA4; font-size: 16px">联系我们</el-link>
      </el-row>
      <el-row  type="flex" justify="center" style="margin-top: 15px">
        <el-link @click="TeMethod()" :underline="false" style="padding-right: 10px; color: #9B9EA4; font-size: 16px">LUNA水镜智能</el-link>
        ©
        <el-link href="http://bigdata.ustc.edu.cn/" target="_blank" :underline="false" style="padding-left: 10px; color: #9B9EA4; font-size: 16px">大数据分析与应用安徽省重点实验室</el-link>
      </el-row>
    </el-col>
  </el-footer>
  <!-- footer-end -->
</template>

<script>
export default {
  methods:{
    TeMethod(){
      this.$router.push({ path: "/" });
      location.reload();
      window.scrollTo(0,0);
    },
    Router_Trans(index){
      let Routes = ['/Agreement', '/privacyPolicy'];
      let Aim = Routes[index];
      sessionStorage.setItem("OnlyCheck", "1");
      let routeData = this.$router.resolve({ path: Aim });
      window.open(routeData.href, '_blank');
    }
  }
}
</script>

<style lang="css" scoped>
/* footer */
.theme-bg {
 /* background: #1a2930; */
  background: black;
}
.footer-trext p {
  color: #fff;
  margin-top: 10px;
  font-size: 12px;
}
.footer-contact ul li {
  color: #fff;
  font-family: "Helvetica";
  margin-bottom: 10px;
  font-size: 12px;
  list-style: none;
}
.footer-contact ul li i {
  margin-right: 10px;
  color: #fff;
  font-size: 12px;
}
.footer-contact ul li:last-child {
  margin-bottom: 0;
}
.fw-link ul li {
  margin-bottom: 10px;
  list-style: none;
}
.fw-link ul li:last-child {
  margin-bottom: 0;
}
.fw-link ul li a {
  color: #fff;
  font-size: 12px;
}
.fw-link ul li a:hover {
  color: #fff;
}

.el-footer{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
    /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}
.el-divider--vertical{
  display:block;
  width:2px;
  margin:3px 49px;
  background-color: #9B9EA4;
}
</style>
