<template>
  <div id="app">
    <!-- 登录 -->
    <el-dialog :visible.sync="login_visible" width="70%">
      <el-row>
        <el-col :span="10" :offset="2">
          <el-row>
            <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
              欢迎使用LUNA智慧教育知识图谱
            </span>
          </el-row>
          <el-row style="margin: 50px 0px 30px 0px;">
            <el-input
              type="text"
              v-model="account"
              auto-complete="off"
              placeholder="账号"
            ></el-input>
          </el-row>
          <el-row style="margin: 30px 0px">
            <el-input
              type="password"
              v-model="pass"
              auto-complete="off"
              placeholder="密码"
            ></el-input>
          </el-row>
          <el-row style="margin: 30px 0px">
            <el-col :span="15">
              <el-input
                type="text"
                v-model="verifyCode"
                auto-complete="off"
                placeholder="请输入验证码"
              ></el-input>     
            </el-col>
            <el-col :span="8" :offset="1">
              <el-row type="flex" justify="end" >
                <vue-img-verify @getImgCode="getImgCode" ref="vueImgVerify" />
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin: 30px 0px">
            <el-col :span="8">
              <el-button type="primary" style="width: 8vw" round @click="login">登录</el-button>
            </el-col>
            <el-col :span="6" :offset="1">
              <el-button type="text" style="color: #aaa">忘记密码？</el-button>
            </el-col>
            <el-col :span="6" :offset="3">
              <el-row type="flex" justify="end" >
                <el-button type="text" @click="register_show">注册新用户</el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <img src="./assets/login.png" width="350vh" height="350vh"/>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 注册 -->
    <el-dialog :visible.sync="register_visible"  width="70%" style="margin-top: -13vh;"> 
      <el-row>
        <el-col :span="10" :offset="2">
          <el-row>
            <span style="font-weight: bold; color: #47A2FF; font-size: 24px">
              欢迎使用LUNA智慧教育知识图谱
            </span>
          </el-row>
          <el-row style="margin: 50px 0px 20px 0px;">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">账号</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="text"
                v-model="account_reg"
                auto-complete="off"
                placeholder="请输入账号名称"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">密码</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="password"
                v-model="pass_reg"
                auto-complete="off"
                placeholder="请输入初始密码"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">验证密码</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="password"
                v-model="pass_reg2"
                auto-complete="off"
                placeholder="请验证初始密码"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">邮箱</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="text"
                v-model="email_reg"
                auto-complete="off"
                placeholder="请输入您的邮箱"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">工作单位</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="text"
                v-model="school_reg"
                auto-complete="off"
                placeholder="请输入您的工作单位（学校）"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="5"  style="text-align-last: justify; display: inline-block; text-align: justify; padding: 1.5vh 1vw 0 0">
              <span style="font-weight: bold">职业</span>
            </el-col>
            <el-col :span="18" :offset="1">
              <el-input
                type="text"
                v-model="profession_reg"
                auto-complete="off"
                placeholder="请输入您的职业"
              ></el-input>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-col :span="15">
              <el-input
                type="text"
                v-model="verifyCode_reg"
                auto-complete="off"
                placeholder="请输入验证码"
              ></el-input>     
            </el-col>
            <el-col :span="8" :offset="1">
              <el-row type="flex" justify="end" >
                <vue-img-verify @getImgCode="getImgCode_reg" ref="vueImgVerify_reg"/>
              </el-row>
            </el-col>
          </el-row>
          <el-row style="margin: 20px 0px">
            <el-button type="primary" @click="register" >注册新用户</el-button>
          </el-row>
        </el-col>
        <el-col :span="12" style="padding-top: 12vh">
          <img src="./assets/login.png" width="350vh" height="350vh"/>
        </el-col>
      </el-row>
    </el-dialog>
    <header>
      <div id="header-sticky" class="menu-area">
        <div class="container">
          <el-row>
            <el-col :span="4" style="padding-top: 5vh;">
              <img src="./assets/luna_icon.png" alt="Logo" width="150px"/>
            </el-col>
            <el-col :span="12" :offset="8">
              <el-row class="navbar" type="flex" justify="end">
                <el-col :span="4">
                  <router-link to="/" :underline="false" class="navbar">
                    <span>首页</span>
                  </router-link>
                </el-col>
                <el-col :span="4">
                  <el-menu :default-active="activeIndex" mode="horizontal">
                    <el-submenu index="0" style="padding-top: 0.5vh">
                      <template slot="title"><span style="font-size: 18px; font-weight: bold; color: black">功能</span></template>
                      <el-submenu index="1">
                        <template slot="title"><span style="color: black; font-weight: bold">资源录入</span></template>
                        <el-menu-item index="1-1"><span style="color:	Gainsboro; font-weight: bold">学习资源</span></el-menu-item>
                        <el-menu-item index="1-2">
                          <router-link to="/inputMarked" :underline="false">
                            <span style="color: black; font-weight: bold">试题资源</span>
                          </router-link>
                        </el-menu-item>
                        <el-menu-item index="1-3"><span style="color: Gainsboro; font-weight: bold">试卷资源</span></el-menu-item>
                        <el-menu-item index="1-4"><span style="color:	Gainsboro; font-weight: bold">知识体系</span></el-menu-item>
                      </el-submenu>
                      <el-submenu index="2">
                        <template slot="title"><span style="color: black; font-weight: bold">查询</span></template>
                        <el-menu-item index="2-1">
                          <router-link to="/exercise" :underline="false">
                            <span style="color: black; font-weight: bold">试题检索</span>
                          </router-link>
                        </el-menu-item>
                        <el-menu-item index="2-2">
                          <router-link to="/ku" :underline="false">
                            <span style="color: black; font-weight: bold">知识单元检索</span>
                          </router-link>
                        </el-menu-item>
                      </el-submenu>
                      <el-submenu index="3">
                        <template slot="title"><span style="color: black; font-weight: bold">分析</span></template>
                        <el-menu-item index="3-1"><span style="color: Gainsboro; font-weight: bold">学习资源</span></el-menu-item>
                        <el-menu-item index="3-2"><span style="color: Gainsboro; font-weight: bold">试卷资源</span></el-menu-item>
                      </el-submenu>
                      <el-menu-item index="4">
                        <router-link to="/estimate" :underline="false">
                            <span style="color: black; font-weight: bold">试题属性预估</span>
                          </router-link>
                      </el-menu-item>
                      <el-menu-item index="5">
                        <router-link to="/similarity" :underline="false">
                            <span style="color: black; font-weight: bold">相似题预估</span>
                          </router-link>
                      </el-menu-item>
                    </el-submenu>
                  </el-menu>
                </el-col>
                <el-col :span="5">
                  <el-link href="http://bigdata.ustc.edu.cn/" target="_blank" class="navbar"><span style="color: black">实验室主页</span></el-link>
                </el-col>
                <el-col :span="4">
                  <el-dropdown trigger="hover" v-if="username"  class="navbar">
                    <span class="el-dropdown-link user-inner">
                      {{ username }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="logout"
                        >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-button type="text" @click="login_show" v-else class="navbar">登录</el-button>
                </el-col>
                <el-col :span="2">
                  <el-button type="text" @click="register_show" class="navbar">注册</el-button>
                </el-col>
              </el-row>
              <!-- <div class="main-menu text-right">
                <nav id="mobile-menu">
                  <ul>
                    <li>
                      <router-link to="/" :underline="false">首页</router-link>
                    </li>
                    <li class="drop-down">
                      <el-dropdown placement="bottom">
                        <span class="el-dropdown-link">
                          API&emsp;<i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          
                          <router-link to="/ku" :underline="false">
                            <el-dropdown-item>
                              知识单元检索
                            </el-dropdown-item>
                          </router-link>
                          
                          <router-link to="/exercise" :underline="false">
                            <el-dropdown-item>
                              试题检索
                            </el-dropdown-item>
                          </router-link>
                          
                          <router-link to="/estimate" :underline="false">
                            <el-dropdown-item>
                              试题属性预估
                            </el-dropdown-item>
                          </router-link>
                          
                          <router-link to="/similarity" :underline="false">
                            <el-dropdown-item>
                              相似题预估
                            </el-dropdown-item>
                          </router-link>
                          
                          
                          <router-link to="/inputMarked" :underline="false">
                            <el-dropdown-item>
                              试题录入
                            </el-dropdown-item>
                          </router-link>
                          
                        </el-dropdown-menu>
                      </el-dropdown>
                    </li>
                    <li>
                      <a
                        href="http://bigdata.ustc.edu.cn/"
                        target="_blank"
                        :underline="false"
                        >实验室主页</a
                      >
                    </li>
                    <li>
                      <router-link to="/admin" :underline="false" v-if="isAdmin"
                        >数据管理</router-link
                      >
                    </li>
                    <el-dropdown trigger="hover" v-if="username">
                      <span class="el-dropdown-link user-inner">
                        {{ username }}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="logout"
                          >退出登录</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </el-dropdown>
                    <button v-else class="text-btn" @click="login_show">登录</button>
                    <button class="text-btn" @click="register_show">注册</button>
                  </ul>
                </nav>
              </div> -->
            </el-col>
          </el-row>
        </div>
      </div>
    </header>
    <router-view></router-view>
    <!-- footer -->
    <footer>
      <el-col class="footer-wrap" style="color: #9B9EA4; padding: 30px; font-size: 16px; background: #E4E7ED">
        <el-row style="text-align-last: justify">
          <el-col :span="6" :offset="9">
            <span>Copyright © 大数据分析与应用安徽省重点实验室</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px;">
          <el-col :span="3" :offset="9" style="text-align: left">
            <span><i class="el-icon-phone" style="margin-right: 10px"></i>0551-63601558</span>
          </el-col>
          <el-col :span="3" style="text-align: right">
            <span><i class="el-icon-location" style="margin-right: 10px"></i>安徽省合肥市</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px;">
          <el-col :span="2" :offset="9" style="text-align: left;">
            <span><i class="el-icon-link" style="margin-right: 10px;"></i>友情链接：</span>
          </el-col>
          <el-col :span="3">
            <span><label><el-link style="color: #9B9EA4; font-size: 16px;" :underline="false" href="https://www.ustc.edu.cn/" target="_blank">中国科学技术大学</el-link></label></span>
          </el-col>
          <el-col :span="2">
            <span><label><el-link style="color: #9B9EA4; font-size: 16px; margin-left: -60px" :underline="false" href="https://www.iflytek.com/index.html" target="_blank">科大讯飞</el-link></label></span>
          </el-col>
        </el-row>
      </el-col>
    </footer>
    <!-- footer-end -->
  </div>
</template>

<script>
import $ from "jquery";
import vueImgVerify from "./components/vue-img-verify.vue";
export default {
  name: "App",
  components: { vueImgVerify },
  data() {
    return {
      root: false, // root用户
      isAdmin: false,
      username: "",
      login_visible: false,
      register_visible: false,
      // 账户，密码，验证码正确值，验证码输入值
      // 只在登录对话框使用
      account: "",
      pass: "",
      imgCode: "",
      verifyCode: "",
      // 账号，密码，确认密码，邮箱，工作单位，职业，验证码正确值，验证法输入值
      // 只在注册对话框使用
      account_reg: "",
      pass_reg: "",
      pass_reg2: "",
      imgCode_reg: "",
      verifyCode_reg: "",
      email_reg: "",
      school_reg: "",
      profession_reg: "",
      // activeIndex: 下拉菜单用的
      activeIndex: ""
    };
  },
  watch:{
    login_visible(newVal){
      if(!newVal){
        this.imgCode = "";
        this.account = "";
        this.pass = "";
      }
      this.login_visible = newVal;
    },
    register_visible(newVal){
      if(!newVal){
        this.imgCode_reg = "";
        this.account_reg = "";
        this.pass_reg = "";
        this.pass_reg2 = "";
        this.email_reg = "";
        this.school_reg = "";
        this.profession_reg = "";
      }
      this.register_visible = newVal;
    }
  },
  mounted() {
    var user = sessionStorage.getItem("user");
    if (user) {
      this.username = user;
    }
    if (this.username === "advanced" || this.username === "admin") {
      this.isAdmin = true;
    }
    // this.root = this.username === "root";
    // console.log(this.root);
    $(window).on("scroll", function () {
      var scroll = $(window).scrollTop();
      if (scroll < 700) {
        $("#header-sticky").removeClass("sticky-menu");
      } else {
        $("#header-sticky").addClass("sticky-menu");
      }
    });
  },
  methods: {
    login_show() {
      // this.$router.push({ path: "/login" });
      this.register_visible = false;
      this.login_visible = true;
      setTimeout(()=>{
        this.$refs.vueImgVerify.handleDraw();}, 
      1)
    },
    register_show(){
      this.login_visible = false;
      this.register_visible = true;
      setTimeout(()=>{
        this.$refs.vueImgVerify_reg.handleDraw();}, 
      1)
    },
    register() {
      // this.$router.push({ path: "/register" });
      console.log(this.account_reg);
      console.log(this.pass_reg);
      console.log(this.pass_reg2);
      console.log(this.email_reg);
      console.log(this.school_reg);
      console.log(this.profession_reg);
    },
    login_admin() {
      this.$router.push({ path: "/admin" });
    },
    // 测试退出函数
    logout() {
      var _this = this;
      this.$confirm("确认退出吗？", "提示", {
        // type:'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          this.username = "";
          this.isAdmin = false;
          _this.$router.push("/");
        })
        .catch(() => {});
    },
    // 点击图片获取验证码
    getImgCode(code) {
      this.imgCode = code;
    },
    getImgCode_reg(code){
      this.imgCode_reg = code;
    },
    // 登录
    login() {
      if (this.verifyCode.toUpperCase() === this.imgCode.toUpperCase()) {
        this.$http
          .post(
            this.backendIP + "/api/login",
            {
              user: this.account,
              password: this.pass
            },
            { emulateJSON: true }
          )
          .then(function(data) {
            console.log(data.data);
            if (data.data == 1) { //eslint-disable-line
              sessionStorage.user = this.account;
              this.login_visible = false;
              this.$router.push("/");
              location.reload();
            } else {
              alert("登录失败");
            }
          });
      } else {
        alert("验证码错误");
      }
    },
  },
};
</script>

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
  // background: #1a2930;
  background: black;
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
  padding: 20px 0px 0px 0px;
  font-size: 18px; 
  font-weight: bold;
  color: black;
}
</style>
