<template>
  <el-container id="app">
    <!-- 试卷分析路径跳转 -->
    <el-dialog :visible.sync="PaperAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(0)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(0)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(1)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(1)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择题库中试卷进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row>
            <el-button
              @click="PAS(2)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon15.png"
                width="60%"
                style="margin-left: 0px; margin-top: 0px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="PAS(2)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              选择多张试卷进行分析
            </el-button>
          </el-row>
        </el-col>
<!--        <el-col :span="6">-->
<!--          <el-row>-->
<!--            <el-button-->
<!--              @click="PAS(3)"-->
<!--              circle-->
<!--              style="height: 200px; width: 200px"-->
<!--              ><img-->
<!--                src="@/assets/icon15.png"-->
<!--                width="60%"-->
<!--                style="margin-left: 0px; margin-top: 0px"-->
<!--              />-->
<!--            </el-button>-->
<!--          </el-row>-->
<!--          <el-row>-->
<!--            <el-button-->
<!--              type="text"-->
<!--              @click="PAS(3)"-->
<!--              style="margin-top: 30px; font-size: 20px; color: black"-->
<!--            >-->
<!--              搜索分析/录入分析-->
<!--            </el-button>-->
<!--          </el-row>-->
<!--        </el-col>-->
      </el-row>
    </el-dialog>
    <!-- 试题分析路径跳转 -->
    <el-dialog :visible.sync="QuestionAnalyseSwitchFlag" width="70%">
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-button
              @click="QAS(0)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon4.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="QAS(0)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              录入试题进行分析
            </el-button>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-button
              @click="QAS(1)"
              circle
              style="height: 200px; width: 200px"
              ><img
                src="@/assets/icon1.png"
                width="150%"
                style="margin-left: -46px; margin-top: -46px"
              />
            </el-button>
          </el-row>
          <el-row>
            <el-button
              type="text"
              @click="QAS(1)"
              style="margin-top: 30px; font-size: 20px; color: black"
            >
              搜索试题进行分析
            </el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <login ref="login" @register_show="register_show" @forget_pass_show="forget_pass_show"/>
    <forget-pass ref="forget_pass" />
    <register ref="register"  @login_show="login_show"/>
    <!-- 当屏幕过窄的时候显示的导航栏抽屉 -->
    <el-drawer
      style="overflow: scroll;"
      :visible.sync="Narrow_Navbar_Drawer"
      :direction="'rtl'"
      size="260px">
      <el-row slot="title" type="flex" justify="start" class="Drawer_Header">
        <span style="font-size: 20px; color: black; padding-left: 5%">LUNA水镜智能</span>
      </el-row>
      <div style="padding: 0px 10%">
        <!-- 首页 -->
        <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
          <el-button type="text" @click="goToMainPage" class="Narrow_Navbar_Button"
            >首页</el-button
          >
        </el-row>
        <!-- 功能导航栏 -->
        <el-row type="flex" justify="start">
          <el-col>
            <el-row
              type="flex"
              justify="start"
              style="cursor: pointer"
              @click.native="Expand_Navbar_Drawer_Part == '功能' ? Expand_Navbar_Drawer_Part = '' : Expand_Navbar_Drawer_Part = '功能'">
              <el-col :span="12">
                <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
                  <el-button type="text" @click="Expand_Navbar_Drawer_Part == '功能' ? Expand_Navbar_Drawer_Part = '' : Expand_Navbar_Drawer_Part = '功能'" class="Narrow_Navbar_Button"
                    >功能</el-button
                  >
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row type="flex" justify="end" class="Narrow_Navbar_Item">
                  <i
                    :class="Expand_Navbar_Drawer_Part == '功能' ? 'el-icon-arrow-up' : 'el-icon-arrow-down' "
                    style="height: 80px; line-height: 80px; margin-top: -1px;"></i>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="Expand_Navbar_Drawer_Part == '功能'" style="padding-left: 20px">
              <el-collapse accordion>
                <el-collapse-item  name="资源录入" title="资源录入">
                  <div align="left" class="Navbar_Drawer_Sub">
                    <span style="color: Gainsboro">学习资源</span>
                  </div>
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/inputMarked')">
                    <span style="color: black">试题资源</span>
                  </div>
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/inputPaper')">
                    <span style="color: black">试卷资源</span>
                  </div>
                  <div align="left" class="Navbar_Drawer_Sub">
                    <span style="color: Gainsboro">知识体系</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="搜索整合" title="搜索整合">
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/luna-search')">
                    <span style="color: black">搜索整合</span>
                  </div>
<!--                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/searchPaper')">-->
<!--                    <span style="color: black">试卷检索</span>-->
<!--                  </div>-->
<!--                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/ku')">-->
<!--                    <span style="color: black">知识单元检索</span>-->
<!--                  </div>-->
<!--                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/resources')">-->
<!--                    <span style="color: black">学习资源检索</span>-->
<!--                  </div>-->
                </el-collapse-item>
                <el-collapse-item name="分析" title="分析">
                  <div align="left" class="Navbar_Drawer_Sub">
                    <span style="color: Gainsboro">学习资源</span>
                  </div>
                  <div
                    align="left"
                    class="Navbar_Drawer_Sub"
                    style="cursor: pointer"
                    @click="QuestionAnalyseSwitch()">
                    <span style="color: black">试题资源</span>
                  </div>
                  <div
                    align="left"
                    @click="PaperAnalyseSwitch()"
                    style="cursor: pointer"
                    class="Navbar_Drawer_Sub">
                      <span style="color: black">试卷资源</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="标注管理平台" title="标注管理平台">
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/questionUpdate')">
                    <span style="color: black">试题信息修改</span>
                  </div>
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/paperdivide')">
                    <span style="color: black">试卷切分</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="组卷系统" title="组卷系统">
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/paperCombine')">
                    <span style="color: black">组卷页面入口</span>
                  </div>
                </el-collapse-item>
                <el-collapse-item name="资源管理" title="资源管理">
                  <div align="left" class="Navbar_Drawer_Sub" @click="Router_Trans('/manage/dashboard')">
                    <span style="color: black">资源管理入口</span>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-row>
          </el-col>
        </el-row>
        <!-- AI实验室 -->
        <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
          <el-button type="text" @click="PublicPlatform" class="Narrow_Navbar_Button"
            >AI实验室</el-button
          >
        </el-row>
        <!-- 成员 -->
        <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
          <el-button type="text" @click="show_members" class="Narrow_Navbar_Button"
            >成员</el-button
          >
        </el-row>
        <!-- 用户 -->
        <el-row type="flex" justify="start" class="Narrow_Navbar_Item">
          <div
            v-if="$store.state.user.name"
          >
            <el-row>
              <el-dropdown
                trigger="hover"
              >
                <span class="el-dropdown-link user-inner">
                  {{ $store.state.user.name
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="checkUserInfo"
                    >个人设置</el-dropdown-item
                  >
                  <el-dropdown-item v-if="isGroup" @click.native="checkUserGroup"
                    >组织架构</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="logout"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </el-row>
          </div>
          <div
            v-else>
            <el-button type="text" @click="login_show" class="Narrow_Navbar_Button"
              >登录</el-button
            >
          </div>
        </el-row>
        <!-- 注册 -->
        <el-row type="flex" justify="start" class="Narrow_Navbar_Item" style="border-bottom: 2px solid #ccc">
          <el-button type="text" @click="register_show" class="Narrow_Navbar_Button"
            >注册</el-button
          >
        </el-row>
      </div>
    </el-drawer>
    <!-- <el-header style="height: 70px;" v-show="$route.name!='user'"> -->
    <!-- <el-header style="height: 80px; background: transparent">

    </el-header> -->
    <!-- <basic-header/> -->
    <el-main style="overflow-y: auto; overflow-x: hidden" id="main-container" >
      <scrollbar anchor="main-container" />
      <div id="header-sticky" :class="{
		'nav-trans': scrollTop < 170 && !Get_Current_Path(),
        'sticky-menu': true,
        'Little_Shadow': Get_Current_Path()}" style="height: 70px; overflow: hidden">
        <el-row class="NavBarArea Normal_Navbar" type="flex" justify="center">
          <el-col :span="4" style="padding-top: 15px;">
            <el-row type="flex" justify="start">
              <img
                src="@/assets/luna_icon.png"
                alt="Logo"
                width="132px"
                style="cursor: pointer"
                @click="goToMainPage"
              />
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row type="flex" justify="end">
              <div
                v-if="$store.state.user.name"
                class="NarbarItem"
              >
                <el-button type="text" @click="goToMainPage" class="navbar"
                  >首页</el-button
                >
              </div>
              <div
                v-else
                class="NarbarItem">
                <el-button type="text" @click="goToMainPage" class="navbar"
                  >首页</el-button
                >
              </div>
              <div
                class="NarbarItem"
                style="width: 100px;">
                <el-menu
                  mode="horizontal"
                  style="background: transparent; height: 100%; border: none"
                  class="navbar-menu-bg"
                >
                  <el-submenu index="0" style="" >
                    <template slot="title">
                      <span :style="Title_Pos()" >功能</span>
                    </template>

                    <el-submenu style="display: none" index="1">
                      <template slot="title"
                        ><span style="color: black">资源录入</span></template
                      >
                      <el-menu-item index="1-1"
                        ><span style="color: Gainsboro">学习资源</span>
                      </el-menu-item>
                      <el-menu-item index="1-2" @click="Router_Trans('/inputMarked')">
                        <span style="color: black">试题资源</span>
                      </el-menu-item>
                      <el-menu-item index="1-3" @click="Router_Trans('/inputPaper')">
                        <span style="color: black">试卷资源</span>
                      </el-menu-item>
                      <el-menu-item index="1-4"
                        ><span style="color: Gainsboro">知识体系</span>
                      </el-menu-item>
                  </el-submenu>
<!--                    <el-submenu index="2">-->
<!--                      <span style="color: black">查询</span>-->
                    <el-menu-item index="2"  @click="Router_Trans('/luna-search')">
                      <span style="color: black"> 搜索整合 </span>
                    </el-menu-item>
<!--                      <template slot="title">-->
<!--                        <span style="color: black">查询</span>-->
<!--                      </template>-->
<!--                      <el-menu-item index="2-1" @click="Router_Trans('/exercise')">-->
<!--                        <span style="color: black">试题检索</span>-->
<!--                      </el-menu-item>-->

<!--                      <el-menu-item index="2-2" @click="Router_Trans('/searchPaper')">-->
<!--                        <span style="color: black">试卷检索</span>-->
<!--                      </el-menu-item>-->

<!--                      <el-menu-item index="2-3" @click="Router_Trans('/ku')">-->
<!--                        <span style="color: black">知识单元检索</span>-->
<!--                      </el-menu-item>-->

<!--                      <el-menu-item index="2-4" @click="Router_Trans('/resources')">-->
<!--                        <span style="color: black">学习资源检索</span>-->
<!--                      </el-menu-item>-->
<!--                    </el-submenu>-->
                    <el-submenu index="3">
                      <template slot="title"
                        ><span style="color: black">分析</span></template
                      >
                      <el-menu-item index="3-1"
                        ><span style="color: Gainsboro">学习资源</span>
                      </el-menu-item>
                      <el-menu-item
                        index="3-2"
                        @click="QuestionAnalyseSwitch()"
                      >
                        <span style="color: black">试题资源</span>
                      </el-menu-item>
                      <el-menu-item
                        index="3-3"
                        @click="PaperAnalyseSwitch()"
                      >
                        <span style="color: black">试卷资源</span>
                      </el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                      <template slot="title"
                        ><span style="color: black"
                          >标注管理平台</span
                        ></template
                      >
                      <el-menu-item index="4-1"  @click="Router_Trans('/questionUpdate')">
                        <span style="color: black">试题信息修改</span>
                      </el-menu-item>
                      <el-menu-item index="4-2"  @click="Router_Trans('/paperdivide')">
                        <span style="color: black">试卷切分</span>
                      </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="5"  @click="Router_Trans('/paperCombine')">
                      <span style="color: black"> 组卷系统 </span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="Router_Trans('/manage/dashboard')">
                      <span style="color: black"> 资源管理 </span>
                    </el-menu-item>
                  </el-submenu>
                </el-menu>

              </div>

              <div
                style="width: 100px;"
                class="NarbarItem">
                <el-button type="text" @click="PublicPlatform" class="navbar"
                  >AI实验室</el-button
                >
              </div>

              <div
                class="NarbarItem">
                <el-button type="text" @click="show_members" class="navbar"
                  >成员</el-button
                >
              </div>

              <div
                  class="NarbarItem">
                <a target="_blank"  href="https://www.wjx.cn/vm/hC1EkUI.aspx" class="navbar"
                >反馈</a
                >
              </div>
              <div style="width: 1px; height: 18px; margin-top: 25px; border-right: 2px solid #aaa; margin-left: 15px; margin-right: 12px">

              </div>

              <div
                class="NarbarItem"
                style="min-width: 100px"
                v-if="$store.state.user.name"
              >
                <el-row>
                  <el-dropdown
                    trigger="hover"
                    class="navbar"
                  >
                    <span class="el-dropdown-link user-inner">
                      {{ $store.state.user.name
                      }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="checkUserInfo"
                        >个人设置</el-dropdown-item
                      >
                      <el-dropdown-item v-if="isGroup" @click.native="checkUserGroup"
                        >组织架构</el-dropdown-item
                      >
                      <el-dropdown-item @click.native="logout"
                        >退出登录</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-row>
              </div>
              <div
                class="NarbarItem"
                v-else>
                <el-button type="text" @click="login_show" class="navbar"
                  >登录</el-button
                >
              </div>
              <div
                class="NarbarItem"
                v-show="!$store.state.user.name"
              >
                <el-button type="text" @click="register_show" class="navbar"
                  >注册</el-button
                >
              </div>
            </el-row>
          </el-col>
        </el-row>
        <el-row class="NavBarArea Narrow_Navbar" type="flex" justify="center">
          <el-col :span="4" style="padding-top: 16px;">
            <el-row type="flex" justify="start">
              <img
                src="@/assets/luna_icon.png"
                alt="Logo"
                width="132px"
                style="cursor: pointer"
                @click="goToMainPage"
              />
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row type="flex" justify="end" style="width: 100%">
              <div class="NavBarButton" @click="Open_Narrow_Navbar_Drawer()">
                <i class="el-icon-menu" style="font-size: 30px; height: 40px; line-height: 40px"></i>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div style="padding-top: 59px;">
        <div id="Top_Nav" class="Top_Nav">
        </div>
        <router-view :key="$route.fullPath"></router-view>
      </div>
      <basic-footer />
    </el-main>
  </el-container>
</template>

<script>
// import $ from "jquery";
import BasicFooter from "@/layout/components/footer.vue";
import login from "@/layout/components/login.vue";
import forgetPass from "@/layout/components/forgetPass.vue";
import register from "@/layout/components/register.vue";
import { commonAjax } from "@/common/utils/ajax";
import Scrollbar from "./components/scrollbar";
// import BasicHeader from '@/layout/header.vue'
// import vueImgVerify from "@/common/components/vue-img-verify.vue";
export default {
  name: "App",
  components: {
    Scrollbar,
    // vueImgVerify,
    BasicFooter,
    login,
    register,
    forgetPass
    // BasicHeader,
  },
  data() {
    return {
      root: false, // root用户
      isAdmin: false,
      isUser: false,
      username: "",
      // activeIndex: 下拉菜单用的
      activeIndex: "",
      // 跳转至试卷/试题分析的不同地点用的
      PaperAnalyseSwitchFlag: false,
      QuestionAnalyseSwitchFlag: false,
      isGroup: false,
      // 当前窗口的宽度
      // 窄窗口用的抽屉是否显示
      Width_Now: 0,
      Narrow_Navbar_Drawer: false,
      // 展开的菜单
      Expand_Navbar_Drawer_Part: "",
      // 页面滚动位置
      scrollTop: 0,
    }
  },
  mounted() {
    this.getGroups();
    this.To_Top();
    const scrollAnchor = document.getElementById("main-container")
    addEventListener("scroll", ()=>{this.$nextTick(() => {this.scrollTop=scrollAnchor.scrollTop})}, true)
  },
  watch:{

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
    To_Top(){
      document.getElementById("Top_Nav").scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
    },
    Router_Trans(Path){
      // this.To_Top();
      setTimeout(()=>{
        this.$router.push({
          path: Path
        });
      }, 100)
    },
    Get_Current_Path(){
      if(this.$route.path == '/'){
        return false
      }else{
        return true
      }
    },
    // 打开过窄时的导航栏
    Open_Narrow_Navbar_Drawer(){
      this.Narrow_Navbar_Drawer = true;
    },
    // 查看用户个人信息及组织架构
    checkUserInfo() {
      this.$router.push({
        path: "/user/userInfo",
      });
    },
    checkUserGroup() {
      this.$router.push({
        path: "/user/userGroup",
      });
    },
    getGroups() {
      commonAjax(this.backendIP + "/api/get_users_by_admin", {}).then((res) => {
        if (res.data.length > 0 && res.data.some((data) => data.is_admin)) {
          this.isGroup = true;
        }else {
          this.isGroup=false
        }
      });
    },
    QAS(index) {
      if (index == 0) {
        this.$router.push({
          path: "/QuestionAnalyseInput",
        });
        this.QuestionAnalyseSwitchFlag = false;
      } else {
        this.$router.push({
          path: "/exercise",
        });
        this.QuestionAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试题分析的不同位置的对话框
    QuestionAnalyseSwitch() {
      this.QuestionAnalyseSwitchFlag = true;
    },
    PAS(index) {
      if (index == 0) {
        this.$router.push({
          path: "/paperAnalyseInput",
        });
        this.PaperAnalyseSwitchFlag = false;
      } else
      if (index == 1) {
        this.$router.push({
          path: "/searchPaper",
        });
        this.PaperAnalyseSwitchFlag = false;
      } else
      if (index == 2) {
        this.$router.push({
          path: "/multipaperanalyse",
        });
        this.PaperAnalyseSwitchFlag = false;
      } else
      if (index == 3) {
        this.$router.push({
          path: "/searchanalyse",
        });
        this.PaperAnalyseSwitchFlag = false;
      }
    },
    // 跳转至试卷分析的不同位置的对话框
    PaperAnalyseSwitch() {
      this.PaperAnalyseSwitchFlag = true;
    },
    Get_Priority() {
      if (sessionStorage.isAdmin) {
        return true;
      } else {
        return false;
      }
    },
    Title_Pos() {
      return {
        "font-size": "18px",
        "color": "black",
        "margin-left": "10px",
      };
    },
    goToMainPage() {
      this.$router.push({
        path: "/",
      });
      setTimeout(()=>{
        this.To_Top();
      }, 100);
    },
    PublicPlatform() {
      this.$router.push({
        path: "/PublicPlatform",
      });
      this.To_Top();
    },
    goToImageTranscription() {
      this.$router.push({
        path: "/ImageTranscription",
      });
      this.To_Top();
    },
    show_members() {
      this.$router.push({
        path: "/members",
      });
      this.To_Top();
    },
    login_show() {
      this.$refs.login.show();
      this.$refs.register.hide();
    },
    forget_pass_show(){
      this.$refs.login.hide();
      this.$refs.forget_pass.show();
    },
    register_show() {
      this.$refs.login.hide();
      this.$refs.register.show();
    },
    login_admin() {
      this.$router.push({
        path: "/admin",
      });
      this.To_Top();
    },
    // 测试退出函数
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push("/");
      location.reload();
    },
    goToUserPage() {
      this.$router.push("/dashboard");
    },
    // logout() {
    //   var _this = this;
    //   this.$confirm("确认退出吗？", "提示", {
    //     // type:'warning'
    //   })
    //     .then(() => {
    //       sessionStorage.removeItem("user");
    //       sessionStorage.removeItem("isAdmin");
    //       this.username = "";
    //       this.isAdmin = false;
    //       _this.$router.push("/");
    //     })
    //     .catch(() => {});
    // },
  },
};
</script>

<style>
/* 导航栏&滚动条优化 */
#main-container::-webkit-scrollbar {
	width: 0;
	height: 0;
}

html, body {
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.navbar-menu-bg {
	background: transparent;
	border: none;
}
.navbar-menu-bg:hover {
	background: transparent !important;
}
</style>

<style scoped lang="scss">
.el-main
  .el-menu--horizontal
  ::v-deep
  .el-submenu.is-active
  .el-submenu__title {
  border-bottom: none;
}

// 导航栏功能按下不显示背景色
::v-deep .el-submenu__title {
	background: transparent;

	&:hover {
		background: transparent !important;
	}
}

.el-header .el-menu--horizontal ::v-deep .el-submenu .el-submenu__title {
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
.el-main
  .el-menu--horizontal
  ::v-deep
  .el-submenu.is-active
  .el-submenu__title {
  border-bottom: none;
  text-decoration: none;
  background: transparent !important;
}

.el-main .el-menu--horizontal ::v-deep .el-submenu .el-submenu__title {
  height: 42px;
  line-height: 18px;
  padding-top: 15px;
  border-bottom: 2px solid transparent;
  background: transparent !important;
  width: 50%;
  z-index: 999;
}

.el-main .el-menu .el-menu--horizontal {
  border-bottom: none;
  text-decoration: none;
  background: transparent !important;
}

.el-menu .el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: none;
  text-decoration: none;
  background: transparent !important;
}

.el-drawer__body {
   overflow: auto;
}

.el-drawer__header{
  height: 70px;
  line-height: 70px;
  padding-top: 0px !important;
  margin-bottom: 0px !important;
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
  position: absolute;
  height: 80px;
  top: 0;
  width: 100vw; //calc(100vw - 16px);
  //padding-left: 16px;
  z-index: 100;
  background: rgba($color: white, $alpha: 0.76);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  -webkit-animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  animation: 300ms ease-in-out 0s normal none 1 running fadeInDown;
  margin-top: 0;
  transition: background-color 200ms ease;
}

.Little_Shadow{
  border-bottom: 1px solid rgba(196, 196, 196, 0.4);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.06);
}

.nav-trans {
	background: rgba(255,255,255,0) !important;
	backdrop-filter: blur(2px);
	-webkit-backdrop-filter: blur(2px);
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
<style scoped lang="scss">
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
}

.NavBarArea{
  position: relative;
  background: transparent;
  padding: 0px;
  min-height: 70px;
}

.NarbarItem{
  width: 80px;
  height: 70px;
  box-sizing: border-box;
  background: transparent;
  line-height: 70px;

  button, ul {
    height: 100%;
  }

  >a {
    display: block;
    height: 100%;
    width: 100%;
    transition: .2s;

    &:hover {
      color: #66b1ff;
      border-color: transparent;
      background-color: transparent;
    }
  }
}

.NavBarButton{
  height: 40px;
  width: 40px;
  color: #000;
  margin-top: 18px;
  cursor: pointer;
  transition: 200ms;
}
.NavBarButton:hover{
  color: #409EFF;
}

.Narrow_Navbar_Item{
  width: 100%;
  border-top: 1px solid #ccc;
  min-height: 80px;
  line-height: 80px;
  font-size: 18px;
}

.Narrow_Navbar_Button{
  font-size: 18px;
  color: black;
  transition: 200ms;
}

.Narrow_Navbar_Button:hover{
  color: #409EFF;
}

/* 路径的跳转点 */
.Navbar_Drawer_Sub{
  margin: 10px 0px 10px 20px;
  cursor: pointer;
}

.Narrow_Navbar{
  display: none;
}

.Normal_Navbar{
  width: 100vw;
  padding: 0 32px;

}

@media screen and (max-width: 768px) {
  .Narrow_Navbar{
    padding: 0px 32px;
    margin-right: 30px;
    display: block;
  }

  .Normal_Navbar{
    display: none;
  }
}

@media screen and (min-width: 1344px) {
  .Normal_Navbar{
    width: 1344px;
    margin: 0 auto;
  }
}

.Top_Nav{
    position: relative;
    top: -90px;
    width: 1px;
    height: 1px;
    background: transparent;
}

::v-deep .el-submenu {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
