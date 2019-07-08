<template>
  <div id="app">
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">
        <router-link to="/" :underline="false">
          首页
        </router-link>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title"
          >API</template
        >
        <el-submenu index="2-1">
          <template slot="title"
            >试题检索</template
          >
          <el-menu-item index="2-4-1">
            <router-link to="/exercise" :underline="false">
              知识单元识别
            </router-link>
          </el-menu-item>
          <el-menu-item index="2-4-2">
            <router-link to="/exercise" :underline="false">
              相似题检索
            </router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="2-2">
          <router-link to="/ku" :underline="false">
            知识单元检索
          </router-link>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="3">消息中心</el-menu-item>
      <el-menu-item index="4">
        <el-link
          href="http://bigdata.ustc.edu.cn/"
          target="_blank"
          :underline="false"
        >
          实验室主页
        </el-link>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
  text-decoration: none;
  color: #ffffff;
}

a:link {
  text-decoration: none;
}

a:visited {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
}

a:active {
  text-decoration: none;
}
</style>
