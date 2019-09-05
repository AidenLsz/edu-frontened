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
                      <a href="">API</a>
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
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <router-view />
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
                    <!--<li><a href="#">科大讯飞</a></li>
                                    <li><a href="#">安徽广电信息网络股份有限公司</a></li>
                                    <li><a href="#">中科大计算机科学与技术学院</a></li>
                                    <li><a href="#">陈恩红实验室主页</a></li> -->
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
  mounted() {
    $(window).on("scroll", function() {
      var scroll = $(window).scrollTop();
      if (scroll < 250) {
        $("#header-sticky").removeClass("sticky-menu");
      } else {
        $("#header-sticky").addClass("sticky-menu");
      }
    });
    // scrollToTop
    // $.scrollUp({
    //   scrollName: 'scrollUp',
    //   topDistance: '300',
    //   topSpeed: 300,
    //   animation: 'fade',
    //   animationInSpeed: 200,
    //   animationOutSpeed: 200,
    //   scrollText: '<i class="el-icon-arrow-up"></i>',
    //   activeOverlay: false,
    // });
  }
};
</script>

<style lang="scss">
.menu-area {
  margin-top: -60px;
  padding-bottom: -10px;
  margin-right: -150px;
}
.logo {
  margin-left: -350px;
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
  color: #666666;
  opacity: 0.8;
  padding: 36px 0;
  font-size: 16px;
  font-weight: 700;
  position: relative;
  margin-bottom: -20px;
}
.main-menu ul li:hover > a {
  color: #ffb607;
  opacity: 1;
}
.main-menu ul li.active > a {
  color: #ffb607;
  opacity: 1;
}
.main-menu ul > li > a::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 5px;
  width: 0;
  height: 2px;
  background: #ffb607;
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
  background: #ffb607;
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
  padding-left: 140px;
}
/* footer */
.theme-bg {
  background: #666666;
}
.footer-trext p {
  color: #a6a6b5;
  margin-top: 10px;
  font-size: 12px;
}
.footer-contact ul li {
  color: #a6a6b5;
  font-family: "Helvetica";
  margin-bottom: 10px;
  font-size: 12px;
  list-style: none;
}
.footer-contact ul li i {
  margin-right: 10px;
  color: #a6a6b5;
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
  color: #a6a6b5;
  font-size: 12px;
}
.fw-link ul li a:hover {
  color: #ffb607;
}
/* scrollUp */
#scrollUp {
  background: #ffb607;
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
</style>
