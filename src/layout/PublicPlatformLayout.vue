<template>
  <el-container id="app">
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <el-header style="height: 75px">
      <div id="header-sticky" class="sticky-menu">
        <el-row
          type="flex"
          align="center"
          style="padding-top: 20px; padding-bottom: 20px"
        >
          <el-col :span="4" style="padding-left: 60px">
            <img
              src="@/assets/luna_icon.png"
              alt="Logo"
              width="150px"
              style="cursor: pointer"
              @click="goToMainPage"
            />
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col :span="2">
            <div
              style="
                height: 37.5px;
                line-height: 37.5px;
                padding-right: 40px;
                font-size: 22px;
              "
            >
              AI实验室
            </div>
          </el-col>
          <el-col :span="18">
            <el-row type="flex" justify="end" style="padding-right:20px;">
              <div
                class="NarbarItem"
              >
                <el-button type="text" @click="goToLogin" class="navbar"
                  >登录</el-button
                >
              </div>
              <div
                class="NarbarItem"
              >
                <el-button type="text" @click="goToRegister" class="navbar"
                  >注册</el-button
                >
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <!-- <basic-header/> -->
    <el-main>
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
// import login from "@/layout/components/login.vue";
// import register from "@/layout/components/register.vue";
import { commonAjax } from "@/common/utils/ajax";
// import BasicHeader from '@/layout/header.vue'
// import vueImgVerify from "@/common/components/vue-img-verify.vue";
export default {
  name: "App",
  components: {
    // vueImgVerify,
    BasicFooter,
    // login,
    // register,
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
      console.log("@" + this.$store.getters.rootPath);
      return this.$store.getters.rootPath;
    },
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
        path: this.rootPath + "user/userInfo",
      });
    },
    checkUserGroup() {
      this.$router.push({
        path: this.rootPath + "user/userGroup",
      });
    },
    getGroups() {
      commonAjax(this.backendIP + "/api/get_users_by_admin", {}).then((res) => {
        if (res.data.length > 0 && res.data.some((data) => data.is_admin)) {
          this.isGroup = true;
        } else {
          this.isGroup = false;
        }
      });
    },
    QAS(index) {
      if (index == 0) {
        this.$router.push({
          path: this.rootPath + "QuestionAnalyseInput",
        });
        this.QuestionAnalyseSwitchFlag = false;
      } else {
        this.$router.push({
          path: this.rootPath + "exercise",
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
          path: this.rootPath + "paperAnalyseInput",
        });
        this.PaperAnalyseSwitchFlag = false;
      } else {
        this.$router.push({
          path: this.rootPath + "searchPaper",
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
        path: this.rootPath,
      });
      this.ToTop();
    },
    goToLogin() {
      this.$router.push({
        path:"/PublicPlatform/AILablogin",
      });
      this.ToTop();
    },
    goToRegister() {
      this.$router.push({
        path:"/PublicPlatform/AILabRegister",
      });
      this.ToTop();
    },
    knowledegeUnitSearch() {
      this.$router.push({
        path: this.rootPath + "ku",
      });
      this.ToTop();
    },
    composePaperSystem() {
      this.$router.push({
        path: this.rootPath + "paperCombine",
      });
      this.ToTop();
    },
    goToImageTranscription() {
      this.$router.push({
        path: this.rootPath + "ImageTranscription",
      });
      this.ToTop();
    },
    login_show() {
      this.$refs.login.show();
      this.$refs.register.hide();
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
    },
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
  max-height: 75px;
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
.el-divider--vertical {
  height: 25px;
  width: 1px;
  background-color: black;
}

.NarbarItem{
  width: 80px;
  height: 37.5px;
  box-sizing: border-box;
  background: transparent;
}

.navbar {
  /* line-height: 37.5px; */
  font-size: 18px;
  color: black;
  margin: 0 auto;
}

.el-button {
  padding:0px;
  min-height:37.5px;
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
</style>
