<template>
  <el-container style="height: 100%;" class="container">
    <el-header style="height: 72px">
      <div class="logo">
        <img
          src="@/assets/luna_icon.png"
          height="100%"
          alt="Logo"
          @click="goToMainPage"
        />
      </div>
      <div class="vertical_line" />
      <div id="ailab" @click="goToAILab">AI实验室</div>
      <!-- 暂时用不到 -->
      <!-- <div class="search">
        <el-input
          v-model="input"
          placeholder="Search"
          prefix-icon="el-icon-search"
          style="height: 36px"
        ></el-input>
      </div> -->
      <!-- <div class="text">控制台</div> -->
      <!-- <div class="line"></div> -->
      <div v-if="$store.state.AIlab_user.AIname" class="user">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link">
            {{ $store.state.AIlab_user.AIname
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="checkUserInfo" icon="el-icon-user"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item
              @click.native="OrderManage"
              icon="el-icon-notebook-2"
              >工单管理</el-dropdown-item
            >
            <el-dropdown-item @click.native="CostCenter" icon="el-icon-coin"
              >费用中心</el-dropdown-item
            >
            <el-dropdown-item @click.native="logout" icon="el-icon-right"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside
        :width="isCollapse ? '75px' : '212px'"
        style="background-color: #FAFBFC; position: relative"
      >
        <el-menu
          :default-active="CurrPage()"
          :default-openeds="['1', '2']"
          class="menu"
          :collapse="isCollapse"
          :collapse-transition="false"
          :style="'width:' + (isCollapse ? '63px' : '200px')"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-s-home"></i>
              <span slot="title">个人中心</span></template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="ToUserInfo"
                >账号信息</el-menu-item
              >
              <el-menu-item index="1-2" @click="ToChangePass"
                >修改密码</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-menu"></i
              ><span slot="title">项目管理</span></template
            >
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="ToMyPro">我的项目</el-menu-item>
              <el-menu-item index="2-2" @click="ToStatistics"
                >使用统计</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        <div class="arrow-box" @click="isCollapse = !isCollapse">
          <i
            :class="isCollapse ? 'el-icon-caret-right' : 'el-icon-caret-left'"
            style="
              font-size: 12px;
              position: absolute;
              top: 50%;
              transform: translate(0, -50%);
            "
          ></i>
        </div>
      </el-aside>
      <el-main style="padding: 0 0 0 0; background-color: #FAFBFC">
        <div>
          <router-view :key="$route.fullPath"></router-view>
        </div>
      </el-main>
    </el-container>
    <basic-footer />
  </el-container>
</template>

<script>
import BasicFooter from "@/layout/components/footer.vue";

export default {
  name: "App",
  components: {
    BasicFooter,
  },
  mounted() {
    console.log("@" + this.$route.path);
  },
  data() {
    return {
      input: "",
      isCollapse: false,
    };
  },
  methods: {
    // 根据当前的url获取应该默认激活的选项
    CurrPage() {
      let path = this.$route.path;
      if (path.includes("userInfo")) return "1-1";
      else if (path.includes("ChangePass")) return "1-2";
      else if (path.includes("Pro")) return "2-1";
      else if (path.includes("Statistics")) return "2-2";
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
    // 查看用户个人信息
    checkUserInfo() {
      this.$router.push({
        path: "/PublicPlatform/user/userInfo",
      });
    },
    //工单管理
    OrderManage() {
      this.$message.error("还没做好捏...");
    },
    //费用中心
    CostCenter() {
      this.$message.error("还没做好捏...");
    },
    //登出
    async logout() {
      await this.$store.dispatch("AIlab_user/logout");
      this.$router.push("/PublicPlatform");
      location.reload();
    },
    ToUserInfo() {
      this.$router.push({
        path: "/PublicPlatform/user/userInfo",
      });
    },
    ToChangePass() {
      this.$router.push({
        path: "/PublicPlatform/user/ChangePass",
      });
    },
    ToMyPro() {
      this.$router.push({
        path: "/PublicPlatform/user/MyPro",
      });
    },
    ToStatistics() {
      this.$router.push({
        path: "/PublicPlatform/user/Statistics",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.logo {
  // background-color: white;
  position: absolute;
  left: 80px;
  top: 15px;
  cursor: pointer;
  height: 42px;
}

.vertical_line {
  position: absolute;
  left: 242px;
  top: 24px;
  border-left: 2px solid white;
  height: 24px;
  // transform: rotate(90deg);
}

#ailab {
  position: absolute;
  left: 258px;
  top: 18.5px;
  height: 35px;
  line-height: 35px;
  font-family: Microsoft YaHei UI;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  /* identical to box height */
  letter-spacing: 0.06em;
  cursor: pointer;
  color: white;
}

.search {
  position: absolute;
  top: 18px;
  left: calc(50% - 150px);
  height: 36px;
  width: 300px;
  .el-input ::v-deep .el-input__inner {
    height: 36px;
  }
  .el-input ::v-deep .el-input__icon {
    line-height: 36px;
  }
}

.text {
  position: absolute;
  top: 22px;
  left: 72.36%;
  width: 60px;
  height: 29px;
  color: white;
  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 29px;
}

.line {
  position: absolute;
  width: 0px;
  height: 16px;
  left: calc(72.36% + 60px + 28px);
  top: 28.5px;

  border-right: 2px solid #ffffff;
  // transform: rotate(90deg);
}

.user {
  position: absolute;
  top: 22px;
  left: calc(72.36% + 60px + 28px + 28px);
  height: 29px;
}

.menu {
  float: left;
  height: 100%;
  overflow: hidden;
}
.arrow-box {
  height: 66px;
  width: 12px;
  position: absolute;
  top: 250px;
  // left: 100%;
  right: 0%;
  background: #FFFFFF;
  clip-path: polygon(0 0, 100% 20%, 100% 80%, 0 100%);
  z-index: 10;
  // box-shadow: 10px 10px 5px #888888;
  // border-right: 1px solid rgb(129, 124, 124);
}

.arrow-box:hover {
  cursor: pointer;
}

.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-family: Noto Sans SC;
  font-style: normal;
  font-weight: normal;
  font-size: 20px;
  line-height: 29px;
}
.el-header {
  background: #23242a;
  // height: 72px;
}

.el-aside {
  // color: #333;
  overflow: hidden;
}

.el-menu ::v-deep .el-menu-item-group__title {
  display: none;
}

.el-menu ::v-deep > .is-active .el-submenu__title {
  background-color: #e9f7fb;
  color: #1890ff;
  .el-icon-s-home,
  .el-icon-menu {
    color: #1890ff;
  }
}

.el-menu ::v-deep .el-menu-item-group .is-active {
  background-color: #e9f7fb;
  color: black;
}

.el-menu ::v-deep .el-menu-item {
  margin-left: 40px;
  padding-left: 30px !important;
}

.container ::v-deep .footer-wrap {
  background: #ffffff;
}
</style>