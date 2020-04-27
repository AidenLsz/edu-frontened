<template>
  <el-row class="navigator">
    <el-col :span="24" class="top">
      <el-col
        :span="10"
        class="logo"
        :class="collapsed ? 'logo-collapse-width' : 'logo-width'"
      >
        {{ collapsed ? "" : logo }}
      </el-col>
      <el-col :span="10">
        <div class="tools" @click.prevent="collapse">
          <i class="el-icon-s-fold"></i>
        </div>
      </el-col>
      <el-col :span="4" class="userinfo">
        <el-dropdown trigger="hover">
          <span class="el-dropdown-link user-inner">
            {{ username }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-col>

    <el-col :span="24" class="maincontent">
      <aside>
        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleopen"
          @close="handleclose"
          unique-opend
          :collapse="collapsed"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span>查看修改数据</span>
            </template>
            <el-menu-item-group>
              <el-submenu index="1-1" :class="collapsed ? '' : 'menu-kp'">
                <template slot="title">
                  知识单元
                </template>
                <el-menu-item
                  index="1-1-1"
                  :class="collapsed ? '' : 'menu-bk'"
                  @click="goTo('/concept')"
                  >来自百科
                </el-menu-item>
                <el-menu-item
                  index="1-1-2"
                  :class="collapsed ? '' : 'menu-rjb'"
                  @click="goTo('/knowledgePoint')"
                  >来自教科书
                </el-menu-item>
              </el-submenu>
              <el-menu-item
                index="1-2"
                :class="collapsed ? '' : 'menu-relation'"
                @click="goTo('/relation')"
                >知识关系
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>数据批量导入</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="goTo('/importNode')">
                导入到node
              </el-menu-item>
              <el-menu-item index="2-2" @click="goTo('/importEdge')">
                导入到edge
              </el-menu-item>
              <el-menu-item index="2-3" @click="goTo('/bulkImport')">
                导入新集合字段
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3" @click="goTo('/importExercise')">
            <i class="el-icon-setting"></i>
            <span slot="title">录题校对功能</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <section class="content-container">
        <div style="height: 550px;">
          <el-col :span="24" class="contentwrapper">
            <router-view></router-view>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      logo: "后台管理系统",
      collapsed: false,
      username: ""
    };
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      this.username = user;
    }
  },
  methods: {
    goTo(path) {
      this.$router.replace(path);
    },
    handleopen(key, keyPath) {},
    handleclose(key, keyPath) {},
    logout: function() {
      var _this = this;
      this.$confirm("确认退出吗？", "提示", {
        // type:'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          _this.$router.push("/login");
        })
        .catch(() => {});
    },
    // 折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    }
  }
};
</script>
<style lang="scss">
.navigator {
  width: 100%;
  .top {
    height: 30px;
    line-height: 30px;
    color: #fff;
    background-color: #3c3c3c;
    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
      .user-inner {
        cursor: pointer;
        color: #fff;
      }
    }
  }
  .logo {
    padding-left: 140px;
  }
  .logo-width {
    width: 260px;
  }
  .logo-collapse-width {
    width: 60px;
  }
  .tools {
    padding: 0px 23px;
    width: 14px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
  }
}
.maincontent {
  display: flex;
  /*    aside {
      flex: 0 0 230px;
      width: 230px;
    }*/
}
.content-container {
  flex: 1;
  overflow-y: scroll;
  padding: 10px;
  .contentwrapper {
    background-color: #fff;
    box-sizing: border-box;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.menu-kp {
  margin-left: -20px;
}
.menu-bk {
  margin-left: 30px;
}
.menu-rjb {
  margin-left: 37px;
}
.menu-relation {
  margin-left: 2px;
}
</style>
