<template>
  <div >
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->

    <el-scrollbar wrap-class="scrollbar-wrapper" style="background:#fff; height:100%;">
      <div class="user-info" v-show="$store.state.app.sidebar.opened">
        <i class="el-icon-s-fold" v-show="$store.state.app.sidebar.opened" v-on:click="toggleSideBar()"></i>
        <div>
          <img class="user-icon" src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp" alt="">
          <div class="info">
            <div class="user-name">
              {{$store.state.user.name}}
            </div>
            <div class="affiliation">
              所属单位
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <el-row style="width: 96%; margin-left: 2%">
        <el-menu
          style="display: block; margin-left: -20px; border-right: none;"
          :default-active="activeMenu"
          :collapse="isCollapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :unique-opened="true"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          mode="vertical"
        >
          <el-menu-item  class="submenu-title-noDropdown" v-show="!$store.state.app.sidebar.opened" v-on:click="toggleSideBar()">
              <i class="el-icon-s-unfold" ></i>
          </el-menu-item>
          <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
        </el-menu>
      </el-row>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/common/styles/variables.scss'

export default {
  components: {
    SidebarItem,
     // Logo
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      // console.log(this.$router.options.routes[0].children)
      // console.log(this.$router.options.routes[0].children.filter(data=>data.path=='/manage'));
      return this.$router.options.routes[0].children.filter(data=>data.showSideBar)[0].children
      // return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    // showLogo() {
    //   return this.$store.state.settings.sidebarLogo
    // },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    toggleSideBar(){
      this.$store.dispatch('app/toggleSideBar')
    },
  }
}
</script>
<style lang="scss" scoped>
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
.user-info{
  position: relative;
  width: 100%;
  min-width: 210px;
  height:100px;
  display: flex;
  flex-direction: column;
  align-items:center;
  justify-content: center;
  margin-top:5px;
  >div{
    display: flex;
    .user-icon{
      margin:auto;
      width: 67px;
      height: 67px;
    }
    >.info{
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .affiliation{
        color: #409EFF;
      }
    }
  }
  .el-icon-s-fold{
    position: absolute;
    color:#909399;
    top:15px;
    right:10px;
  }
}
.el-icon-s-fold,.el-icon-s-unfold{
  font-size: 20px;
}
.el-icon-s-unfold {
  padding-left:12px;
  text-align: center;
  vertical-align: middle;
}
</style>
