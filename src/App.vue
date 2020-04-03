<template>
  <div id="app">
    <header>
      <div id="header-sticky" class="menu-area">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-2">
              <div class="logo">
                <img src="./assets/logo.png" alt="Logo" />
              </div>
            </div>
            <div class="col-lg-10">
              <div class="main-menu text-right">
                <nav id="mobile-menu">
                  <ul>
                    <li>
                      <router-link to="/" :underline="false">首页</router-link>
                    </li>
                    <li class="drop-down">
                      <!-- <router-link to="/estimate">试题评估</router-link> -->
                      <el-dropdown>
                        <span class="el-dropdown-link">
                          API<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>
                            <router-link to="/ku" :underline="false"
                              >知识单元检索</router-link
                            >
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <router-link to="/exercise" :underline="false"
                              >试题检索</router-link
                            >
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <router-link to="/estimate" :underline="false"
                              >试题难度评估</router-link
                            >
                          </el-dropdown-item>
                          <el-dropdown-item>
                            <router-link to="/similarity" :underline="false"
                              >相似题评估</router-link
                            >
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <!--实现下拉菜单-->
                    </li>
                    <li>
                      <a
                        href="http://bigdata.ustc.edu.cn/"
                        target="_blank"
                        :underline="false"
                        >实验室主页</a
                      >
                    </li>
                    <button v-if="root" class="text-btn" @click="logout_root">
                      退出(neea_kg)
                    </button>
                    <button v-else class="text-btn" @click="login_root">
                      登录(neea_kg)
                    </button>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <router-view></router-view>
    <!-- footer -->
    <footer>
      <div class="footer-wrap theme-bg">
        <div class="container">
          <div class="row justify-content-between">
            <div class="col-lg-4">
              <div class="footer-widget">
                <div class="footer-trext">
                  <p>Copyright © 大数据分析与应用安徽省重点实验室</p>
                </div>
                <div class="footer-contact">
                  <ul>
                    <li>
                      <i class="el-icon-phone"></i>
                      <span>0551-63601558</span>
                    </li>
                    <li>
                      <i class="el-icon-location"></i>
                      <span>安徽省合肥市</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="footer-widget">
                <div class="footer-trext">
                  <p>友情链接</p>
                </div>
                <div class="fw-link">
                  <ul>
                    <li><a href="#">中国科学技术大学</a></li>
                    <li><a href="#">科大讯飞</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!-- footer-end -->
  </div>
</template>

<script>
import $ from "jquery";
export default {
  name: "App",
  data() {
    return {
      root: false // root用户
    };
  },
  mounted() {
    this.root = sessionStorage.user === "root";
    console.log(this.root);
    $(window).on("scroll", function() {
      var scroll = $(window).scrollTop();
      if (scroll < 250) {
        $("#header-sticky").removeClass("sticky-menu");
      } else {
        $("#header-sticky").addClass("sticky-menu");
      }
    });
  },
  methods: {
    login_root() {
      this.$router.push({ path: "/root" });
    },
    // 测试退出函数
    logout_root() {
      sessionStorage.clear();
      location.reload();
    }
  }
};
</script>

<style lang="scss">
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
  margin-left: 35px;
  margin-right: -10px;
}
.main-menu ul li:first-child {
  margin-left: 0;
}
.main-menu ul li a {
  display: block;
  color: #1a2930;
  opacity: 0.8;
  padding: 36px 0;
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
  top: 0;
  width: 100%;
  box-shadow: 0 0 60px 0 rgba(0, 0, 0, 0.07);
  z-index: 9999;
  background: #fff;
  -webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  -webkit-box-shadow: 0 10px 15px rgba(25, 25, 25, 0.1);
  margin-top: 0px;
  padding-left: 100px;
}
/* footer */
.theme-bg {
  background: #1a2930;
}
.footer-trext p {
  color: #fff;
  margin-top: 10px;
  font-size: 12px;
}
.footer-contact ul li {
  color: #fff;
  font-family: "Helvetica";
  margin-bottom: 10px;
  font-size: 12px;
  list-style: none;
}
.footer-contact ul li i {
  margin-right: 10px;
  color: #fff;
  font-size: 12px;
}
.footer-contact ul li:last-child {
  margin-bottom: 0;
}
.fw-link ul li {
  margin-bottom: 10px;
  list-style: none;
}
.fw-link ul li:last-child {
  margin-bottom: 0;
}
.fw-link ul li a {
  color: #fff;
  font-size: 12px;
}
.fw-link ul li a:hover {
  color: #fff;
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
  margin-top: 60px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #1a2930;
  font-size: 18px;
  font-weight: 900;
}
</style>
<style>
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
}
</style>
