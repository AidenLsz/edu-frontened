<template>
  <el-container id="app">
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="PaperAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(0)" circle style="height: 200px; width: 200px;"><img src="@/assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(0)" style="margin-top: 30px; font-size: 20px; color: black">
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button @click="PAS(1)" circle style="height: 200px; width: 200px"><img src="@/assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="PAS(1)" style="margin-top: 30px; font-size: 20px; color: black">
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 试题分析路径跳转 -->
    <el-dialog :visible.sync="QuestionAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button @click="QAS(0)" circle style="height: 200px; width: 200px;"><img src="@/assets/icon4.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="QAS(0)" style="margin-top: 30px; font-size: 20px; color: black">
              录入试题进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button @click="QAS(1)" circle style="height: 200px; width: 200px"><img src="@/assets/icon1.png" width="150%" style="margin-left: -46px; margin-top: -46px"/></el-button>
          </el-row>
          <el-row>
            <el-button type="text" @click="QAS(1)" style="margin-top: 30px; font-size: 20px; color: black">
              搜索试题进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <login ref="login" @register_show="register_show"/>
    <register ref="register"/>
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <el-header style="height: 70px;" >
      <div id="header-sticky" class="sticky-menu">
        <el-row>
          <el-col :span="4" style="padding-top: 20px; padding-left: 30px">
            <img src="@/assets/luna_icon.png" alt="Logo" width="150px" style="cursor: pointer" @click="goToMainPage"/>
          </el-col>
          <el-col :span="8" :offset="11">
            <el-row type="flex" justify="end">
              <el-col :span="4" v-if="$store.state.user.name" style="padding-top: 15px;">
                <el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
              </el-col>
              <el-col :span="4" :offset="1" v-else style="padding-top: 15px;">
                <el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;">
                <el-menu :default-active="activeIndex" mode="horizontal" style=" border-bottom: 3px solid #409EFF; padding-bottom: 10px">
                  <el-submenu index="0">
                    <template slot="title">
                      <span :style="Title_Pos()">功能</span>
                    </template>
                    <el-submenu index="1">
                      <template slot="title"><span style="color: black;">资源录入</span></template>
                      <el-menu-item index="1-1"><span style="color:	Gainsboro;">学习资源</span></el-menu-item>
                      <router-link to="/inputMarked" :underline="false" @click.native="ToTop">
                        <el-menu-item index="1-2">
                          <span style="color: black;">试题资源</span>
                        </el-menu-item>
                      </router-link>
                      <router-link to="/inputPaper" :underline="false" @click.native="ToTop">
                        <el-menu-item index="1-3">
                          <span style="color: black;">试卷资源</span>
                        </el-menu-item>
                      </router-link>
                      <el-menu-item index="1-4"><span style="color:	Gainsboro;">知识体系</span></el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">

                      <template slot="title"><span style="color: black;">查询</span></template>

                      <router-link to="/exercise" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-1">
                          <span style="color: black;">试题检索</span>
                        </el-menu-item>
                      </router-link>

                      <router-link to="/searchPaper" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-2">
                          <span style="color: black;">试卷检索</span>
                        </el-menu-item>
                      </router-link>

                      <router-link to="/ku" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-3">
                          <span style="color: black;">知识单元检索</span>
                        </el-menu-item>
                      </router-link>

                      <router-link to="/resources" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-4">
                          <span style="color: black;">学习资源检索</span>
                        </el-menu-item>
                      </router-link>

                    </el-submenu>
                    <el-submenu index="3">
                      <template slot="title"><span style="color: black;">分析</span></template>
                      <el-menu-item index="3-1"><span style="color: Gainsboro;">学习资源</span></el-menu-item>
                      <el-menu-item index="3-2" @click="QuestionAnalyseSwitch()" @click.native="ToTop">
                        <span style="color: black;">试题资源</span>
                      </el-menu-item>
                      <el-menu-item index="3-3" @click="PaperAnalyseSwitch()" @click.native="ToTop">
                        <span style="color: black;">试卷资源</span>
                      </el-menu-item>
                    </el-submenu>
                    <router-link to="/estimate" :underline="false" @click.native="ToTop">
                      <el-menu-item index="4">
                        <span style="color: black;">试题属性预估</span>
                      </el-menu-item>
                    </router-link>
                    <router-link to="/similarity" :underline="false" @click.native="ToTop">
                      <el-menu-item index="5">
                        <span style="color: black;">相似题预估</span>
                      </el-menu-item>
                    </router-link>
                    <router-link to="/admin" v-if="Get_Priority()" :underline="false" @click.native="ToTop">
                      <el-menu-item index="5">
                        <span style="color: red;">管理员页面</span>
                      </el-menu-item>
                    </router-link>
                  </el-submenu>
                </el-menu>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;">
                <el-button type="text" @click="show_members" class="navbar">成员</el-button>
              </el-col>
              <el-col :span="5" style="padding-top: 15px;" v-if="$store.state.user.name">
                <el-row>
                  <el-dropdown trigger="hover"  style="padding-top: 8px" class="navbar">
                    <span class="el-dropdown-link user-inner">
                      {{ $store.state.user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-if="$store.state.user.name" @click.native="goToUserPage">用户首页</el-dropdown-item>
                      <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;" v-else>
                <el-button type="text" @click="login_show" class="navbar">登录</el-button>
              </el-col>
              <el-col :span="2" style="padding-top: 15px;">
                <el-button type="text" @click="register_show" class="navbar">注册</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <!-- <basic-header/> -->
    <el-main>
      <router-view :key="$route.fullPath"></router-view>
      <basic-footer/>
    </el-main>
  </el-container>
</template>

<script>
// import $ from "jquery";
import BasicFooter from '@/layout/components/footer.vue'
import login from '@/layout/components/login.vue'
import register from '@/layout/components/register.vue'
// import BasicHeader from '@/layout/header.vue'
// import vueImgVerify from "@/common/components/vue-img-verify.vue";
export default {
  name: "App",
  components: {
    // vueImgVerify,
    BasicFooter,
    login,
    register
    // BasicHeader,
  },
  data() {
    return {
      root: false, // root用户
      isAdmin: false,
      isUser:false,
      username: "",
      // activeIndex: 下拉菜单用的
      activeIndex: "",
      // 跳转至试卷/试题分析的不同地点用的
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false
    };
  },
  mounted() {
    // if(this.$route.name=='user'){
    //     this.isUser=true
    // }
    // var user = sessionStorage.getItem("user");
    // if (user) {
    //   this.username = user;
    // }
    // if (this.username === "advanced" || this.username === "admin") {
    //   this.isAdmin = true;
    // }
    // this.root = this.username === "root";
    // console.log(this.root);
    // $(window).on("scroll", function () {
    //   var scroll = $(window).scrollTop();
    //   if (scroll < 700) {
    //     $("#header-sticky").removeClass("sticky-menu");
    //   } else {
    //     $("#header-sticky").addClass("sticky-menu");
    //   }
    // });
  },
  updated(){
    var user = sessionStorage.getItem("user");
    if (user) {
      this.username = user;
    }else{
      this.username = ""
    }
  },
  methods: {
    QAS(index){
      if(index == 0){
        this.$router.push({ path: "/QuestionAnalyseInput" });
        this.QuestionAnalyseSwitchFlag = false;
      }else{
        this.$router.push({ path: "/exercise" });
        this.QuestionAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试题分析的不同位置的对话框
    QuestionAnalyseSwitch(){
      this.QuestionAnalyseSwitchFlag = true;
    },
    PAS(index){
      if(index == 0){
        this.$router.push({ path: "/paperAnalyseInput" });
        this.PaperAnalyseSwitchFlag = false;
      }else{
        this.$router.push({ path: "/searchPaper" });
        this.PaperAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch(){
      this.PaperAnalyseSwitchFlag = true;
    },
    Get_Priority(){
      if(sessionStorage.isAdmin){
        return true
      }else{
        return false
      }
    },
    Title_Pos(){
      return {
        "font-size": "18px",
        "color": "black",
        "margin-left": "0px"
      }
    },
    Calculate_Title_Margin(){
      var Width = window.screen.width;
      var CWidth = document.body.clientWidth;
      console.log(Width, CWidth)
      if(Width - CWidth < 300){
        return "0px"
      }else{
        return (0 - (CWidth/Width)*(CWidth/Width)*40) + "px";
      }
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    goToMainPage(){
      this.$router.push({ path: "/" });
      this.ToTop();
    },
    show_members(){
      this.$router.push({ path: "/members" });
      this.ToTop();
    },
    login_show() {
      this.$refs.login.show()
      this.$refs.register.hide()
    },
    register_show(){
      this.$refs.login.hide()
      this.$refs.register.show()
    },
    login_admin() {
      this.$router.push({ path: "/admin" });
      this.ToTop();
    },
    // 测试退出函数
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push("/");
      location.reload();
    },
    goToUserPage(){
      this.$router.push("/dashboard");
    }
    // logout() {
    //   var _this = this;
    //   this.$confirm("确认退出吗？", "提示", {
    //     // type:'warning'
    //   })
    //     .then(() => {
    //       sessionStorage.removeItem("user");
    //       sessionStorage.removeItem("isAdmin");
    //       this.username = "";
    //       this.isAdmin = false;
    //       _this.$router.push("/");
    //     })
    //     .catch(() => {});
    // },
  },
};
</script>
<style>
html,body,#app{
  min-height: 100vh;
}
</style>
<style scoped lang="scss">
.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title{
  border-bottom: none;
}

.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
  height: 42px;
  line-height: 18px;
  padding-top: 15px;
  border-bottom: 2px solid transparent;
  width: 50%;
  z-index: 999;
}
.el-header .el-menu .el-menu--horizontal {
  border-bottom: none;
}

</style>
<style>

.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title{
  border-bottom: none;
}

.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
  height: 42px;
  line-height: 18px;
  padding-top: 15px;
  border-bottom: 2px solid transparent;
  width: 50%;
  z-index: 999;
}
.el-header .el-menu .el-menu--horizontal {
  border-bottom: none;
}

</style>

<style scoped lang="scss">
.menu-area {
  margin-top: -60px;
  padding-bottom: -10px;
  margin-right: 0px;
  background-color: #fff;
}
.logo {
  margin-left: -100px;
}
.main-menu ul li {
  display: inline-block;
  position: relative;
  margin-right: -10px;
}
.main-menu ul li:first-child {
  margin-left: 0;
}
.main-menu ul li a {
  display: block;
  color: #1a2930;
  opacity: 0.8;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
  position: relative;
  margin-bottom: -20px;
  text-decoration: none;
}
.main-menu ul li:hover > a {
  color: #000;
  opacity: 1;
  font-weight: 900;
  text-decoration: none;
}
.main-menu ul li.active > a {
  color: #ffd700;
  opacity: 1;
  font-weight: 900;
  text-decoration: none;
}
.main-menu ul > li > a::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 5px;
  width: 0;
  height: 2px;
  background: #fff;
  transition: 0.3s;
}
.main-menu ul > li:hover > a::before {
  width: 100%;
}
.main-menu ul li.active a::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: #fff;
  transition: 0.3s;
}
.sticky-menu {
  left: 0;
  margin: auto;
  position: fixed;
  max-height: 70px;
  top: 0;
  width: 100%;
  box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
  z-index: 999;
  background: #fff;
  -webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  -webkit-box-shadow: 0 0px 12px 0 rgba(0, 0, 0, 0.5);
  margin-top: 0px;
}

/* scrollUp */
#scrollUp {
  background: #fff;
  height: 40px;
  width: 40px;
  right: 50px;
  bottom: 77px;
  color: #666666;
  text-align: center;
  border-radius: 50%;
  font-size: 20px;
  line-height: 43px;
}
#scrollUp:hover {
  background: #666666;
  color: #fff;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.el-dropdown-link {
  cursor: pointer;
  color: #1a2930;
  font-size: 18px;
  font-weight: 900;
}

</style>
<style scoped>

.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disable):hover {
  background-color: #1a2930 !important;
  color: #fff !important;
}
.el-dropdown-menu__item a {
  color: #1a2930 !important;
  text-decoration: none !important;
}
.el-dropdown-menu__item:hover a {
  color: #fff !important;
  text-decoration: none !important;
}
.text-btn {
  background: transparent;
  color: #1a2930;
  border: 0px;
  margin-left: 30px;
  margin-right: -35px;
  font-size: 14px;
}
.user-inner {
  cursor: pointer;
  color: #1a2930;
}
.navbar {
  font-size: 18px;
  color: black;
}
.el-container{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}
.el-main{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px 0px 0px 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.el-header{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}

</style>
