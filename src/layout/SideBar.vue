w<template lang="html">
  <el-container style="height:100%">
    <!-- <el-header style="height:70px">
      <el-row>
        <el-col :span="6">
          <img src="@/assets/luna_icon.png" alt="Logo" width="150px" style="cursor: pointer" />
        </el-col>
        <el-col :span="3" :offset="15">
          <img class="user-icon" src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp" alt="">
          <el-dropdown>
            <i class="el-icon-setting user-setting-icon" style="margin-left: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人设置</el-dropdown-item>
              <el-dropdown-item @click.native="goToMainPage">游客首页</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header> -->
    <el-container :class="classObj">
      <sideBar style=";background:#fff;"/>
      <el-main style="background:#fff;margin:15px;border-radius:5px;">
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
    <!-- <basic-footer/> -->
  </el-container>
</template>

<script>
// import BasicFooter from '@/layout/components/footer.vue'
import sideBar from './components/Sidebar/index.vue'
export default {
  components:{
    sideBar,
    // BasicFooter
  },
  data() {
    return {
      activeIndex: "",
    }
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar
    },
    // device() {
    //   return this.$store.state.app.device
    // },
    // fixedHeader() {
    //   return this.$store.state.settings.fixedHeader
    // },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
      }
    }
  },
  methods: {
    // toggleSideBar(){
    //   this.$store.dispatch('app/toggleSideBar')
    // },
    // 测试退出函数
    goToMainPage(){
      this.$router.push("/");
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push("/");
      location.reload();
    },
  }
};
</script>

<style lang="scss" scoped>
@import "@/common/styles/variables.scss";
@import "@/common/styles/mixin.scss";
.el-header {
  background-color: #409EFF;
  background-color: rgb(238, 241, 246);
  color: #000;
  line-height: 70px;
}
.el-container{
  background-color: #f1f6fd;
}
.el-aside {
  color: #333;
}
.user-icon{
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: solid 1px #fff;
}
.user-setting-icon{
  line-height: 70px;
  vertical-align: middle;
  font-size: 24px;
  color:#ccc;
}

.app-wrapper {
  // @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar{
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}
</style>
