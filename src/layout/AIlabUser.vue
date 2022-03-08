<template>
  <el-container style="height: 100%; border: 1px solid #eee" id="app">
    <el-header style="height: 72px">
      <div class="search">
        <el-input
          v-model="input"
          placeholder="Search"
          prefix-icon="el-icon-search"
          style="height: 36px"
        ></el-input>
      </div>
      <div class="text">控制台</div>
      <div class="line"></div>
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
    <el-container style="min-height: 100vh">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          default-active="1-1"
          :default-openeds="['1', '2']"
          class="menu"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-s-home"></i>个人中心</template
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
              ><i class="el-icon-menu"></i>项目管理</template
            >
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="ToMyPro">我的项目</el-menu-item>
              <el-menu-item index="2-2" @click="ToStatistics"
                >使用统计</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="padding:0 0 0 0">
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
  data() {
    return {
      input: "",
    };
  },
  methods: {
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
  width: 80px;
  height: 29px;
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
  background: #3e89e0;
  // height: 72px;
}

.el-aside {
  color: #333;
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
</style>