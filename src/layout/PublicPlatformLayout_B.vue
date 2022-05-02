<template>
  <div style="min-width: 1440px" id="app">
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <div class="header" style="height: 80px">
      <div class="logo-wrapper">
        <div class="logo">
          <img
              src="@/assets/luna_icon.png"
              height="100%"
              alt="Logo"
              @click="goToMainPage"
          />
        </div>
        <div class="vertical_line"/>
        <div id="ailab" @click="goToAILab">
          <p class="ailab">AI实验室</p>
        </div>
      </div>
      <div class="page">
        <el-button
          type="text"
          class="navbar"
          style="border-bottom: 2px solid #67b1fe"
          @click="goToAILab"
          >首页</el-button
        >
      </div>
      <div class="flex-placeholder"/>
      <div>
        <div v-if="$store.state.AIlab_user.AIname" class="console" @click="ToMyPro">控制台</div>
        <div v-if="$store.state.AIlab_user.AIname" class="user">
          <el-dropdown trigger="hover">
          <span class="el-dropdown-link">
            {{ $store.state.AIlab_user.AIname
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="checkUserInfo"
              >个人中心</el-dropdown-item
              >
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div v-if="!$store.state.AIlab_user.AIname" class="reg">
          <el-button
              type="text"
              icon="el-icon-user-solid"
              class="reg_text"
              @click="goToLogin"
          >
            登陆
          </el-button>
        </div>
        <div v-if="!$store.state.AIlab_user.AIname" class="login">
          <el-button round @click="goToRegister">注册</el-button>
        </div>
        <div
            v-if="!$store.state.AIlab_user.AIname"
            class="menu"
            @click="
          () => {
            OpenNarrowMenu = true;
          }
        "
        >
          <i
              class="el-icon-menu"
              style="font-size: 30px; height: 40px; line-height: 40px"
          ></i>
        </div>
        <el-drawer
            :append-to-body="true"
            :modal-append-to-body="false"
            style="overflow: scroll"
            :visible.sync="OpenNarrowMenu"
            size="260px"
        >
          <el-row slot="title" type="flex" justify="start">
          <span style="font-size: 20px; color: black; padding-left: 5%"
          >LUNA-AI实验室</span
          >
          </el-row>
          <div style="padding: 0px 10%">
            <!-- 首页 -->
            <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
              <el-button
                  type="text"
                  @click="goToAILab"
                  class="Narrow_Navbar_Button"
              >首页</el-button
              >
            </el-row>
            <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
              <el-button
                  type="text"
                  @click="goToLogin"
                  class="Narrow_Navbar_Button"
              >登陆</el-button
              >
            </el-row>
            <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
              <el-button
                  type="text"
                  @click="goToRegister"
                  class="Narrow_Navbar_Button"
              >注册</el-button
              >
            </el-row>
          </div>
        </el-drawer>
      </div>
    </div>
    <!-- <basic-header/> -->
    <div>
      <div style="margin-top:80px;">
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <basic-footer />
    </div>
  </div>
</template>

<script>
// import $ from "jquery";
import BasicFooter from "@/layout/components/footer.vue";
// import login from "@/layout/components/login.vue";
// import register from "@/layout/components/register.vue";
// import { commonAjax } from "@/common/utils/ajax";
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
      OpenNarrowMenu: false,
    };
  },
  computed: {
    rootPath() {
      console.log("@" + this.$store.getters.rootPath);
      return this.$store.getters.rootPath;
    },
  },
  mounted() {
    // this.getGroups();
    console.log("@" + this.$route.path);
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
    ToTop() {
      window.scrollTo(0, 0);
    },
    goToMainPage() {
      this.$router.push({
        path: this.rootPath,
      });
      this.ToTop();
    },
    goToAILab() {
      this.$router.push({
        path: "/PublicPlatform",
      });
      this.ToTop();
    },
    goToLogin() {
      this.$router.push({
        path: "/PublicPlatform/AILablogin",
      });
      this.ToTop();
    },
    goToRegister() {
      this.$router.push({
        path: "/PublicPlatform/AILabRegister",
      });
      this.ToTop();
    },
    // 查看用户个人信息
    checkUserInfo() {
      this.$router.push({
        path: "/PublicPlatform/user/userInfo",
      });
    },
    ToMyPro() {
      this.$router.push({
        path: "/PublicPlatform/user/MyPro",
      });
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
    async logout() {
      await this.$store.dispatch("AIlab_user/logout");
      this.$router.push("/PublicPlatform");
      location.reload();
    },
  },
};
</script>

<style scoped lang="scss">
.sticky-menu {
  position: absolute;
  width: 89%;
  height: 100%;
  left: 5.5%;
  background-color: white;
}

.logo {
  // background-color: white;
  cursor: pointer;
  height: 100%;
  padding: 19px 0;
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.vertical_line {
  border-left: 2px solid white;
  height: 40px;
  // transform: rotate(90deg);
}

.ailab {
  margin: 0;
  margin-left: 15px;
}

#ailab {

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */
  letter-spacing: 0.06em;
  cursor: pointer;
  color: white;
}

.page {
  position: absolute;
  width: 60px;
  height: 25px;
  // left: calc(50% - 90px);
  left: max(calc(50% - 30px), calc(12% + 280px));
  top: 12px;
  cursor: pointer;
}

.navbar {
  /* line-height: 37.5px; */
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 25px;
  letter-spacing: 0.02em;
  color: white;
}

.icon-search {
  position: absolute;
  width: 32px;
  height: 32px;
  left: 72.3%;
  top: 24px;
  color: white;
  cursor: pointer;
}

.console {
  position: absolute;
  height: 22px;
  vertical-align: middle;
  line-height: 22px;
  font-size: 18px;
  width: 100px;
  color: white;
  right: calc(6% + 170px);
  // left: calc(72.3% + 150px);
  top: 28.5px;
  border-right: 2px solid white;
}

.console:hover{
  cursor: pointer;
}

.user {
  position: absolute;
  height: 22px;
  width: 150px;
  color: white;
  right: 6%;
  // left: calc(72.3% + 150px);
  top: 28.5px;
}

.el-dropdown {
  position: absolute;
  left: 0;
  top: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.reg {
  position: absolute;
  height: 22px;
  left: calc(72.3% + 84px);
  top: 16px;
  color: white;
  cursor: pointer;
}

.reg_text {
  position: absolute;
  left: 0;
  top: 0;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: white;
}

.login {
  position: absolute;
  height: 10px;
  width: 10px;
  left: calc(72.3% + 169px);
  top: 17px;
  // background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  .el-button {
    position: absolute;
    left: 0;
    top: 0;
    background-color: #23242a;
    color: white;
    font-size: 18px;
    border: 2px solid white;
    box-sizing: border-box;
    border-radius: 55px;
  }
  .el-button:hover {
    color: #66b1ff;
  }
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // min-width: 1440px;
}

.Narrow_Navbar_Item {
  width: 100%;
  border-top: 1px solid #ccc;
  min-height: 80px;
  line-height: 80px;
  font-size: 18px;
}

.Narrow_Navbar_Button {
  font-size: 18px;
  color: black;
  transition: 200ms;
}

.menu {
  display: none;
  position: absolute;
  right: 20px;
  top: 20px;
  color: white;
  cursor: pointer;
}

.menu:hover {
  color: #66b1ff;
}

.header {
  display: flex;
  position: fixed;
  top:0;
  justify-content: space-around;
  z-index: 10;
  width: 100%;
  background: #23242a;
}
@media screen and (max-width: 980px) {
  .reg {
    display: none;
  }
  .login {
    display: none;
  }
  .page {
    display: none;
  }
  .menu {
    display: inline;
  }
  .console {
    display: none;
  }
}
</style>
<style scoped>
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
  position: fixed;
  z-index: 10;
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  background: #23242a;
}
</style>
