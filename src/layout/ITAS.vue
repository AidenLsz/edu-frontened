<template>
  <el-container id="app">
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="PaperAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(0)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(0)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(1)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(1)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(2)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon15.png"
                width="60%"
                style="margin-left: 0px; margin-top: 0px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(2)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择多张试卷进行分析
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
            <el-button
                @click="QAS(0)"
                circle
                style="height: 200px; width: 200px"
            ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
            />
            </el-button>
          </el-row>
          <el-row>
            <el-button
                type="text"
                @click="QAS(0)"
                style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试题进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button
                @click="QAS(1)"
                circle
                style="height: 200px; width: 200px"
            ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
            />
            </el-button>
          </el-row>
          <el-row>
            <el-button
                type="text"
                @click="QAS(1)"
                style="margin-top: 30px; font-size: 20px; color: black"
            >
              搜索试题进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <login ref="login" @register_show="register_show" @forget_pass_show="forget_pass_show()"/>
    <forget-pass ref="forget_pass" />
    <register ref="register" />
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <el-header style="height: 70px;">
      <div id="header-sticky" class="sticky-menu">
        <el-row type="flex" justify="start">
          <div align="left" class="Header_Icon" style="padding-top: 20px; padding-left: 5vw">
            <img
                src="@/assets/luna_icon.png"
                alt="Logo"
                width="150px"
                style="cursor: pointer"
                @click="goToMainPage"
            />
          </div>
          <div align="right" class="Header_Functions">
            <el-row type="flex" justify="end">
              <div
                  align="center"
                  class="Function_Items"
                  v-if="$store.state.user.name"
                  style="padding-top: 15px"
              >
                <el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
              </div>
              <!-- 功能分离处 -->
              <div
                align="center"
                class="Function_Items"
                style="padding-top: 15px; padding-left: 0; width: 120px;" >
                <el-menu
                    mode="horizontal"
                    style="border-bottom: none; padding-bottom: 10px; width: 120px;"
                >
                <el-submenu index="1">
                    <template slot="title"
                    ><span :style="Title_Pos()">教学资源</span></template
                    >
                    <router-link
                      :to="rootPath+'inputMarked'"
                      :underline="false"
                      >
                      <el-menu-item index="2-1">
                        <span style="color: black">试题录入</span>
                      </el-menu-item>
                    </router-link>
                    <router-link
                      :to="rootPath+'inputPaper'"
                      :underline="false"
                      >
                      <el-menu-item index="2-2">
                        <span style="color: black">试卷录入</span>
                      </el-menu-item>
                    </router-link>
                    <router-link
                      :to="rootPath+'manage/dashboard'"
                      :underline="false"
                      >
                      <el-menu-item index="2-3">
                        <span style="color: black">我的资源</span>
                      </el-menu-item>
                    </router-link>
                  </el-submenu>
                </el-menu>
              </div>
              <div
                align="center"
                class="Function_Items" style="padding-top: 15px">
                <el-button type="text" @click="composePaperSystem" class="navbar"
                >组卷系统</el-button
                >
              </div>
              <div
                align="center"
                class="Function_Items" style="padding-top: 15px">
                <el-button type="text" @click="knowledegeUnitSearch" class="navbar"
                >知识联想</el-button
                >
              </div>
              <div
                align="center"
                class="Function_Items" style="padding-top: 15px">
                <el-button type="text" @click="PaperAnalyseSwitch" class="navbar"
                >智能分析</el-button
                >
              </div>

              <!-- <div
                align="center"
                class="Function_Items" style="padding-top: 15px; width: 120px;">
                <el-menu
                    mode="horizontal"
                    style="border-bottom: none; padding-bottom: 10px"
                >
                  <el-submenu index="3">
                    <template slot="title"
                    ><span :style="Title_Pos()">智能分析</span></template
                    >
                    <el-menu-item
                        index="3-1"
                        @click="QuestionAnalyseSwitch()"
                        @click.native="ToTop"
                    >
                      <span style="color: black">试题资源</span>
                    </el-menu-item>
                    <el-menu-item
                        index="3-2"
                        @click="PaperAnalyseSwitch()"
                        @click.native="ToTop"
                    >
                      <span style="color: black">试卷资源</span>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>
              </div> -->
              <div
                align="center"
                class="Function_Items" style="padding-top: 17px"  v-if="$store.state.user.name" >
                <el-row>
                  <el-dropdown
                      trigger="hover"
                      style="padding-top: 8px"
                      class="navbar"
                  >
                    <span class="el-dropdown-link user-inner">
                      {{ $store.state.user.name
                      }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="checkUserInfo"
                      >个人设置</el-dropdown-item
                      >
                      <el-dropdown-item v-if="isGroup" @click.native="checkUserGroup"
                      >组织架构</el-dropdown-item
                      >
                      <el-dropdown-item @click.native="logout"
                      >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </div>
              <div
                align="center"
                class="Function_Items" style="padding-top: 15px" v-else>
                <el-button type="text" @click="login_show" class="navbar"
                >登录</el-button
                >
              </div>
              <div
                align="center"
                class="Function_Items" style="padding-top: 15px">
                <el-button type="text" @click="register_show" class="navbar"
                >注册</el-button
                >
              </div>
            </el-row>
          </div>
        </el-row>
      </div>
    </el-header>
    <!-- <basic-header/> -->
    <el-main style="overflow: auto">
      <div style="min-height: 100vh">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <basic-footer />
    </el-main>
  </el-container>
</template>

<script>
// import $ from "jquery";
import BasicFooter from "@/layout/components/footer.vue";
import login from "@/layout/components/login.vue";
import forgetPass from "@/layout/components/forgetPass.vue";
import register from "@/layout/components/register.vue";
import { commonAjax } from "@/common/utils/ajax";
// import BasicHeader from '@/layout/header.vue'
// import vueImgVerify from "@/common/components/vue-img-verify.vue";
export default {
  name: "App",
  components: {
    // vueImgVerify,
    BasicFooter,
    login,
    register,
    forgetPass
    // BasicHeader,
  },
  data() {
    return {
      username: "",
      // activeIndex: 下拉菜单用的
      activeIndex: "",
      // 跳转至试卷/试题分析的不同地点用的
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false,
      isGroup: false,
    };
  },
  computed: {
    rootPath() {
      console.log("@"+this.$store.getters.rootPath)
      return this.$store.getters.rootPath;

    }
  },
  mounted() {
    this.getGroups();
  },
  updated() {
    var user = sessionStorage.getItem("user");
    if (user) {
      this.username = user;
    } else {
      this.username = "";
    }
  },
  methods: {
    // 查看用户个人信息及组织架构
    checkUserInfo() {
      this.$router.push({
        path: this.rootPath + "user/userInfo"
      });
    },
    checkUserGroup() {
      this.$router.push({
        path: this.rootPath + "user/userGroup"
      });
    },
    getGroups() {
      commonAjax(this.backendIP + "/api/get_users_by_admin", {}).then((res) => {
        if (res.data.length > 0 && res.data.some((data) => data.is_admin)) {
          this.isGroup = true;
        }else {
          this.isGroup=false
        }
      });
    },
    QAS(index) {
      if (index == 0) {
        this.$router.push({
          path: this.rootPath + "QuestionAnalyseInput"
        });
        this.QuestionAnalyseSwitchFlag = false;
      } else {
        this.$router.push({
          path: this.rootPath + "exercise"
        });
        this.QuestionAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试题分析的不同位置的对话框
    QuestionAnalyseSwitch() {
      this.QuestionAnalyseSwitchFlag = true;
    },
    PAS(index) {
      if (index == 0) {
        this.$router.push({
          path: this.rootPath + "paperAnalyseInput"
        });
        this.PaperAnalyseSwitchFlag = false;
      } else if( index == 1){
        this.$router.push({
          path: this.rootPath + "searchPaper"
        });
        this.PaperAnalyseSwitchFlag = false;
      }else if (index == 2) {
        this.$router.push({
          path: this.rootPath + "multipaperanalyse",
        });
        this.PaperAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch() {
      this.PaperAnalyseSwitchFlag = true;
    },
    Title_Pos() {
      return {
        "font-size": "18px",
        color: "black",
        "margin-left": "0px",
        "padding-left": "0px"
      };
    },
    Calculate_Title_Margin() {
      var Width = window.screen.width;
      var CWidth = document.body.clientWidth;
      // console.log(Width, CWidth)
      if (Width - CWidth < 300) {
        return "0px";
      } else {
        return 0 - (CWidth / Width) * (CWidth / Width) * 40 + "px";
      }
    },
    ToTop() {
      window.scrollTo(0, 0);
    },
    goToMainPage() {
      this.$router.push({
        path: this.rootPath
      });
      this.ToTop();
    },
    knowledegeUnitSearch(){
      this.$router.push({
        path: this.rootPath + "ku"
      });
      this.ToTop();
    },
    composePaperSystem(){
      this.$router.push({
        path: this.rootPath + "paperCombine"
      });
      this.ToTop();
    },
    goToImageTranscription() {
      this.$router.push({
        path: this.rootPath + "ImageTranscription"
      });
      this.ToTop();
    },
    login_show() {
      this.$refs.login.show();
      this.$refs.register.hide();
    },
    forget_pass_show(){
      console.log('ss');
      this.$refs.login.hide();
      this.$refs.forget_pass.show();
    },
    register_show() {
      this.$refs.login.hide();
      this.$refs.register.show();
    },
    login_admin() {
      this.$router.push({
        path: "/admin",
      });
      this.ToTop();
    },
    // 测试退出函数
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(this.rootPath);
      location.reload();
    },
    goToUserPage() {
      this.$router.push("/dashboard");
    }
  },
};
</script>
<style scoped lang="scss">
.el-header
.el-menu--horizontal
::v-deep
.el-submenu.is-active
.el-submenu__title {
  border-bottom: none;
}

.el-header .el-menu--horizontal ::v-deep .el-submenu .el-submenu__title {
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
.el-header
.el-menu--horizontal
::v-deep
.el-submenu.is-active
.el-submenu__title {
  border-bottom: none;
}

.el-header .el-menu--horizontal ::v-deep .el-submenu .el-submenu__title {
  height: 42px;
  line-height: 18px;
  padding-top: 15px;
  border-bottom: 2px solid transparent;
  width: 50%;
  z-index: 999;
}

.Function_Items .el-submenu__title {
  padding: 0;
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

.el-container {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}

.el-main {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px 0px 0px 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.el-header {
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}

.Header_Icon{
  width: 300px;
}
.Header_Functions{
  width: calc(100% - 5vw - 300px);
}

.Function_Items{
  width: 100px;
}

</style>
