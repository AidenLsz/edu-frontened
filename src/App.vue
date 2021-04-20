<template>
  <el-container id="app">
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
    <el-header style="height: 70px;">
      <div id="header-sticky" class="sticky-menu">
        <el-row>
          <el-col :span="4" style="padding-top: 20px; padding-left: 30px">
            <img src="./assets/luna_icon.png" alt="Logo" width="150px" style="cursor: pointer" @click="goToMainPage"/>
          </el-col>
          <el-col :span="8" :offset="11">
            <el-row type="flex" justify="end">
              <el-col :span="4" v-if="username" style="padding-top: 15px;">
                <el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
              </el-col>
              <el-col :span="4" :offset="1" v-else style="padding-top: 15px;">
                <el-button type="text" @click="goToMainPage" class="navbar">首页</el-button>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;">
                <el-menu :default-active="activeIndex" mode="horizontal" style=" border-bottom: 3px solid #409EFF; padding-bottom: 10px">
                  <el-submenu index="0">
                    <template slot="title">
                      <span :style="Title_Pos()">功能</span>
                    </template>
                    <el-submenu index="1">
                      <template slot="title"><span style="color: black;">资源录入</span></template>
                      <el-menu-item index="1-1"><span style="color:	Gainsboro;">学习资源</span></el-menu-item>
                      <router-link to="/inputMarked" :underline="false" @click.native="ToTop">
                        <el-menu-item index="1-2">
                          <span style="color: black;">试题资源</span>
                        </el-menu-item>
                      </router-link>
                      <router-link to="/inputPaper" :underline="false" @click.native="ToTop">
                        <el-menu-item index="1-3">
                          <span style="color: black;">试卷资源</span>
                        </el-menu-item>
                      </router-link>
                      <el-menu-item index="1-4"><span style="color:	Gainsboro;">知识体系</span></el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">

                      <template slot="title"><span style="color: black;">查询</span></template>

                      <router-link to="/exercise" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-1">
                          <span style="color: black;">试题检索</span>
                        </el-menu-item>
                      </router-link>

                      <router-link to="/ku" :underline="false" @click.native="ToTop">
                        <el-menu-item index="2-2">
                          <span style="color: black;">知识单元检索</span>
                        </el-menu-item>
                      </router-link>
                      <el-menu-item index="2-3"><span style="color: Gainsboro;">学习资源</span></el-menu-item>

                    </el-submenu>
                    <el-submenu index="3">
                      <template slot="title"><span style="color: black;">分析</span></template>
                      <el-menu-item index="3-1"><span style="color: Gainsboro;">学习资源</span></el-menu-item>
                      <router-link to="/QuestionAnalyse" :underline="false" @click.native="ToTop">
                        <el-menu-item index="3-2">
                          <span style="color: black;">试题资源</span>
                        </el-menu-item>
                      </router-link>
                      <router-link to="/PaperAnalyse" :underline="false" @click.native="ToTop">
                        <el-menu-item index="3-3">
                          <span style="color: black;">试卷资源</span>
                        </el-menu-item>
                      </router-link>
                    </el-submenu>
                    <router-link to="/estimate" :underline="false" @click.native="ToTop">
                      <el-menu-item index="4">
                          <span style="color: black;">试题属性预估</span>
                      </el-menu-item>
                    </router-link>
                    <router-link to="/similarity" :underline="false" @click.native="ToTop">
                      <el-menu-item index="5">
                        <span style="color: black;">相似题预估</span>
                      </el-menu-item>
                    </router-link>
                    <router-link to="/admin" v-if="Get_Priority()" :underline="false" @click.native="ToTop">
                      <el-menu-item index="5">
                        <span style="color: red;">管理员页面</span>
                      </el-menu-item>
                    </router-link>                  
                  </el-submenu>
                </el-menu>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;">
                <el-button type="text" @click="show_members" class="navbar">成员</el-button>
              </el-col>
              <el-col :span="5" style="padding-top: 15px;" v-if="username">
                <el-row>
                  <el-dropdown trigger="hover"  style="padding-top: 8px" class="navbar">
                    <span class="el-dropdown-link user-inner">
                      {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="logout"
                        >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </el-col>
              <el-col :span="4" style="padding-top: 15px;" v-else>
                  <el-button type="text" @click="login_show" class="navbar">登录</el-button>
              </el-col>
              <el-col :span="2" style="padding-top: 15px;">
                <el-button type="text" @click="register_show" class="navbar">注册</el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <!-- footer -->
    <el-footer>
      <el-col class="footer-wrap" style="color: #9B9EA4; padding: 30px; font-size: 16px; background: #E4E7ED">
        <el-row type="flex" justify="center">
            <el-link :underline="false" style="color: #9B9EA4; font-size: 16px">服务条款</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link :underline="false" style="color: #9B9EA4; font-size: 16px">隐私政策</el-link>
            <el-divider direction="vertical"></el-divider>
            <el-link :underline="false" style="color: #9B9EA4; font-size: 16px">联系我们</el-link>
        </el-row>
        <el-row  type="flex" justify="center" style="margin-top: 15px">
          <el-link @click="TeMethod()" :underline="false" style="padding-right: 10px; color: #9B9EA4; font-size: 16px">LUNA水镜智能</el-link>
          ©
          <el-link href="http://bigdata.ustc.edu.cn/" target="_blank" :underline="false" style="padding-left: 10px; color: #9B9EA4; font-size: 16px">大数据分析与应用安徽省重点实验室</el-link>
        </el-row>
      </el-col>
    </el-footer>
    <!-- footer-end -->
  </el-container>
</template>

<script>
// import $ from "jquery";
import vueImgVerify from "./common/components/vue-img-verify.vue";
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
    // $(window).on("scroll", function () {
    //   var scroll = $(window).scrollTop();
    //   if (scroll < 700) {
    //     $("#header-sticky").removeClass("sticky-menu");
    //   } else {
    //     $("#header-sticky").addClass("sticky-menu");
    //   }
    // });
  },
  methods: {
    Get_Priority(){
      if(sessionStorage.isAdmin){
        return true
      }else{
        return false
      }
    },
    Title_Pos(){
      return {
        "font-size": "18px",
        "color": "black",
        "margin-left": "0px"
      }
    },
    Calculate_Title_Margin(){
      var Width = window.screen.width;
      var CWidth = document.body.clientWidth;
      console.log(Width, CWidth)
      if(Width - CWidth < 300){
        return "0px"
      }else{
        return (0 - (CWidth/Width)*(CWidth/Width)*40) + "px";
      }
    },
    ToTop(){
      window.scrollTo(0,0);
    },
    TeMethod(){
      this.$router.push({ path: "/" });
      location.reload();
      window.scrollTo(0,0);
    },
    goToMainPage(){
      this.$router.push({ path: "/" });
      this.ToTop();
    },
    show_members(){
      this.$router.push({ path: "/members" });
      this.ToTop();
    },
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
      this.ToTop();
    },
    // 测试退出函数
    logout() {
      var _this = this;
      this.$confirm("确认退出吗？", "提示", {
        // type:'warning'
      })
        .then(() => {
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("isAdmin");
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
              sessionStorage.isAdmin = true;
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

.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title{
  border-bottom: none;
}

.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
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

.el-header .el-menu--horizontal /deep/ .el-submenu.is-active .el-submenu__title{
  border-bottom: none;
}

.el-header .el-menu--horizontal /deep/ .el-submenu .el-submenu__title {
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
  max-height: 70px;
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
  font-size: 18px;
  color: black;
}
.el-container{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
    /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}
.el-main{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
    /*外部间距也是如此设置*/
  margin: 0px 0px 0px 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
.el-header{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px 0px 0px 0px;
    /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}
.el-footer{
  /*设置内部填充为0，几个布局元素之间没有间距*/
  padding: 0px;
    /*外部间距也是如此设置*/
  margin: 0px;
  /*统一设置高度为100%*/
  height: 100%;
  width: 100%;
}

.el-divider--vertical{
  display:block;
  width:2px;
  margin:3px 49px;
  background-color: #9B9EA4;
}
</style>
