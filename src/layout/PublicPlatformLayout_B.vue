<template>
  <el-container id="app">
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <el-header style="height: 80px">
      <div class="logo">
        <img
          src="@/assets/luna_icon.png"
          height="100%"
          alt="Logo"
          @click="goToMainPage"
        />
      </div>
      <div id="ailab" @click="goToAILab">
        <p>AI实验室</p>
      </div>
      <div class="vertical_line"></div>
      <div class="page" style="left: calc(50% - 30px)">
        <el-button
          type="text"
          class="navbar"
          style="border-bottom: 2px solid #67b1fe"
          @click="goToAILab"
          >首页</el-button
        >
      </div>
      <!-- <div class="page" style="left: calc(50% - 30px)">
        <el-button type="text" class="navbar">页面1</el-button>
      </div>
      <div class="page" style="left: calc(50% + 3% + 30px)">
        <el-button type="text" class="navbar">页面2</el-button>
      </div> -->
      <!-- <div class="icon-search">
        <i class="el-icon-search" style="font-size: 32px"></i>
      </div> -->
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
  position: absolute;
  width: 168px;
  height: 42px;
  left: 12%;
  top: 19px;
  // background-color: white;
  cursor: pointer;
}

.vertical_line {
  position: absolute;
  width: 0px;
  height: 40px;
  left: calc(12% + 168px);
  top: 20px;
  border-left: 2px solid #ffffff;
  // transform: rotate(90deg);
}

#ailab {
  position: absolute;
  width: 80px;
  height: 23px;
  left: calc(12% + 168px);
  margin-left: 17px;
  top: 28.5px;

  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 23px;
  /* identical to box height */
  letter-spacing: 0.06em;
  cursor: pointer;
  color: #ffffff;
}

.page {
  position: absolute;
  width: 60px;
  height: 25px;
  // left: calc(50% - 90px);
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
  color: #ffffff;
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

.user {
  position: absolute;
  height: 22px;
  color: white;
  left: calc(72.3% + 150px);
  top: 28.5px;
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
  top: 17px;
  color: white;
  cursor: pointer;
}

.reg_text {
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.02em;
  color: #ffffff;
}

.login {
  position: absolute;
  height: 22px;
  left: calc(72.3% + 169px);
  top: 20px;
  // background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  .el-button {
    background-color: #23242A;
    color: white;
    font-size: 18px;
    border: 2px solid #ffffff;
    box-sizing: border-box;
    border-radius: 55px;
  }
  .el-button:hover{
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
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
  /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  background: #23242A;
}
</style>
